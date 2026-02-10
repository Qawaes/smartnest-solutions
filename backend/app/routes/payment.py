from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db, limiter
from app.models.order import Order
from app.models.payment import Payment
from app.services.mpesa import stk_push, query_stk_status
from app.utils.email import send_email_smtp, build_payment_confirmation_html
from datetime import datetime
import traceback
import logging
from decimal import Decimal, InvalidOperation
import os

payment_bp = Blueprint("payments", __name__)
logger = logging.getLogger(__name__)


def _get_order_token():
    return (
        request.headers.get("X-Order-Token")
        or request.args.get("order_token")
        or (request.get_json(silent=True) or {}).get("order_token")
    )


def _normalize_phone(phone):
    if not phone:
        return None
    p = str(phone).strip()
    if p.startswith("+"):
        p = p[1:]
    if p.startswith("0"):
        p = "254" + p[1:]
    elif not p.startswith("254"):
        p = "254" + p
    return p


def _amounts_match(a, b):
    try:
        da = Decimal(str(a)).quantize(Decimal("0.01"))
        dbv = Decimal(str(b)).quantize(Decimal("0.01"))
        return da == dbv
    except (InvalidOperation, TypeError):
        return False


@payment_bp.route("/mpesa/stk", methods=["POST"])
@limiter.limit("5 per minute")
def initiate_stk():
    """
    Initiate M-Pesa STK Push
    
    Expected JSON:
    {
        "order_id": 123,
        "phone": "0712345678"
    }
    """
    data = request.get_json()
    
    logger.info("STK push request received")
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    order_id = data.get("order_id")
    phone = data.get("phone")
    
    if not order_id or not phone:
        return jsonify({"error": "order_id and phone are required"}), 400
    
    # Get order
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    order_token = _get_order_token()
    if not order_token or order_token != order.order_access_token:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Get or create payment record
    payment = order.payment
    if not payment:
        payment = Payment(
            order_id=order.id,
            method="mpesa",
            status="PENDING"
        )
        db.session.add(payment)
        db.session.flush()
    
    # Check if already paid
    if payment.status == "PAID":
        return jsonify({"error": "Order already paid"}), 400
    
    # Initiate STK Push
    try:
        result = stk_push(
            phone=phone,
            amount=order.total,
            order_id=order.id
        )
        
        if result.get("success"):
            # Store checkout request ID
            payment.mpesa_checkout_id = result["checkout_request_id"]
            payment.status = "PENDING"
            db.session.commit()
            return jsonify({
                "success": True,
                "message": "STK push sent successfully",
                "checkout_request_id": result["checkout_request_id"],
                "customer_message": result.get("customer_message")
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": result.get("error", "Failed to initiate payment")
            }), 400
    
    except Exception as e:
        db.session.rollback()
        logger.error("STK Push Error: %s", str(e))
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@payment_bp.route("/mpesa/callback", methods=["POST", "OPTIONS"])
@limiter.exempt
def mpesa_callback():
    """
    M-Pesa callback endpoint
    Safaricom will POST payment results here
    
    CRITICAL: This endpoint must ALWAYS return 200 OK to prevent M-Pesa retries
    """
    
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return jsonify({"ResultCode": 0, "ResultDesc": "Success"}), 200
    
    # Use a separate try-catch to ensure we ALWAYS return 200
    try:
        # Get callback data
        data = request.get_json()
        
        # Log the callback
        logger.info("M-Pesa callback received at %s", datetime.now().isoformat())
        
        # Validate data structure
        if not data or "Body" not in data:
            logger.warning("Invalid callback structure - missing Body")
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        # Extract STK callback data
        stk_callback = data.get("Body", {}).get("stkCallback", {})
        
        if not stk_callback:
            logger.warning("Invalid callback structure - missing stkCallback")
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        # Extract key fields
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        merchant_request_id = stk_callback.get("MerchantRequestID")
        
        logger.info("Callback IDs received for checkout %s", checkout_request_id)
        
        # Find payment by checkout request ID
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        if not payment:
            logger.warning("Payment not found for CheckoutRequestID: %s", checkout_request_id)
            # Still return 200 - this is not an error from M-Pesa's perspective
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        if payment.status == "PAID":
            return jsonify({"ResultCode": 0, "ResultDesc": "Success"}), 200
        
        # Process based on result code
        if result_code == 0:
            # Extract callback metadata
            callback_metadata = stk_callback.get("CallbackMetadata", {})
            items = callback_metadata.get("Item", [])
            
            # Extract payment details
            payment_details = {}
            for item in items:
                name = item.get("Name")
                value = item.get("Value")
                if name and value is not None:
                    payment_details[name] = value
            
            # Get M-Pesa receipt number
            mpesa_receipt = payment_details.get("MpesaReceiptNumber")
            amount = payment_details.get("Amount")
            phone = payment_details.get("PhoneNumber")

            # Verify against M-Pesa query endpoint (defense-in-depth)
            status_check = query_stk_status(checkout_request_id)
            if str(status_check.get("ResultCode")) != "0":
                logger.warning("Status query failed for %s", checkout_request_id)
                return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

            if not _amounts_match(amount, payment.order.total if payment.order else None):
                logger.warning("Amount mismatch for payment %s", payment.id)
                return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

            if payment.order and _normalize_phone(payment.order.phone) != _normalize_phone(phone):
                logger.warning("Phone mismatch for payment %s", payment.id)
                return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
            
            # Update payment status
            payment.mark_as_paid(mpesa_receipt=mpesa_receipt)
            
            # Update order status
            if payment.order:
                payment.order.status = "CONFIRMED"
            
            # Commit to database
            db.session.commit()

            # Send payment confirmation email (non-blocking)
            try:
                if payment.order and payment.order.email:
                    email_body = build_payment_confirmation_html(payment.order, payment)
                    send_email_smtp(
                        payment.order.email,
                        "Payment Confirmed - SmartNest",
                        email_body
                    )
            except Exception as e:
                logger.error("Payment email failed: %s", str(e))
        
        else:
            # Mark payment as failed
            payment.mark_as_failed()
            
            # Update order status
            if payment.order:
                payment.order.status = "PAYMENT_FAILED"
            
            # Commit to database
            db.session.commit()
        
        # CRITICAL: Always return 200 OK to M-Pesa
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Success"
        }), 200
    
    except Exception as e:
        # Log the error but still return 200
        logger.error("EXCEPTION in M-Pesa callback: %s", str(e))
        traceback.print_exc()
        
        # Try to rollback any pending transaction
        try:
            db.session.rollback()
        except:
            pass
        
        # CRITICAL: Still return 200 to prevent M-Pesa from retrying
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        }), 200


@payment_bp.route("/mpesa/status/<checkout_request_id>", methods=["GET"])
@jwt_required()
def check_payment_status(checkout_request_id):
    """
    Check the status of an M-Pesa transaction
    """
    try:
        claims = get_jwt()
        if not claims or claims.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403

        # Query M-Pesa API
        result = query_stk_status(checkout_request_id)
        
        # Also check local database
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        return jsonify({
            "mpesa_status": result,
            "payment": payment.to_dict() if payment else None,
            "order_status": payment.order.status if payment else None,
            "paid": payment.status == "PAID" if payment else False
        })
    
    except Exception as e:
        print(f"Status check error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": str(e)
        }), 500


@payment_bp.route("/order/<int:order_id>/payment-status", methods=["GET"])
def get_order_payment_status(order_id):
    """
    Get payment status for a specific order
    Used by frontend for polling
    """
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order_token = _get_order_token()
        if not order_token or order_token != order.order_access_token:
            return jsonify({"error": "Unauthorized"}), 403
        
        payment = order.payment
        
        return jsonify({
            "order_id": order.id,
            "status": order.status,
            "payment_status": payment.status if payment else "NONE",
            "payment_method": payment.method if payment else None,
            "paid_at": payment.paid_at.isoformat() if payment and payment.paid_at else None,
            "total": float(order.total)
        })
    
    except Exception as e:
        print(f"Payment status error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
# Add this route to your payment.py file

@payment_bp.route("/orders/<int:order_id>/mark-cod-payment", methods=["POST"])
@limiter.limit("10 per minute")
def mark_cod_payment(order_id):
    """
    Mark a COD order payment as pending/confirmed
    This is called when user selects Cash on Delivery
    """
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order_token = _get_order_token()
        if not order_token or order_token != order.order_access_token:
            return jsonify({"error": "Unauthorized"}), 403
        
        # Get or create payment record for this order
        payment = order.payment
        if not payment:
            payment = Payment(
                order_id=order.id,
                method="cod",
                status="PENDING"
            )
            db.session.add(payment)
        else:
            # Update existing payment to COD
            payment.method = "cod"
            payment.status = "PENDING"
        
        # Update order status
        order.status = "CONFIRMED"
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "COD order confirmed",
            "order_id": order.id,
            "payment_method": "cod",
            "status": "CONFIRMED"
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"COD marking error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500    


@payment_bp.route("/mpesa/test-callback", methods=["POST"])
def test_callback():
    """
    Test endpoint to manually trigger callback processing
    Useful for testing without actual M-Pesa transactions
    """
    try:
        if not os.getenv("ENABLE_TEST_CALLBACK"):
            return jsonify({"error": "Not found"}), 404
        # Get test data or use sample
        data = request.get_json() or {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "test-merchant-123",
                    "CheckoutRequestID": "ws_CO_TEST123456789",
                    "ResultCode": 0,
                    "ResultDesc": "The service request is processed successfully.",
                    "CallbackMetadata": {
                        "Item": [
                            {"Name": "Amount", "Value": 1},
                            {"Name": "MpesaReceiptNumber", "Value": "TEST123ABC"},
                            {"Name": "TransactionDate", "Value": 20260121093405},
                            {"Name": "PhoneNumber", "Value": 254712345678}
                        ]
                    }
                }
            }
        }
        
        print("Test callback with data:", data)
        
        # Process through the actual callback
        # Create a new request context with the test data
        with payment_bp.app.test_request_context(
            '/mpesa/callback',
            method='POST',
            json=data
        ):
            return mpesa_callback()
    
    except Exception as e:
        print(f"Test callback error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
