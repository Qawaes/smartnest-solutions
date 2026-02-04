from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment
from app.services.mpesa import stk_push, query_stk_status
from app.utils.email import send_email_smtp, build_payment_confirmation_html
from datetime import datetime
import traceback

payment_bp = Blueprint("payments", __name__)


@payment_bp.route("/mpesa/stk", methods=["POST"])
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
    
    print("=" * 50)
    print("STK PUSH REQUEST:")
    print(f"Data: {data}")
    print("=" * 50)
    
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
        print(f"Initiating STK for Order {order_id}, Amount: {order.total}")
        result = stk_push(
            phone=phone,
            amount=order.total,
            order_id=order.id
        )
        
        print(f"STK Result: {result}")
        
        if result.get("success"):
            # Store checkout request ID
            payment.mpesa_checkout_id = result["checkout_request_id"]
            payment.status = "PENDING"
            db.session.commit()
            
            print(f"Payment updated with checkout_id: {payment.mpesa_checkout_id}")
            
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
        print(f"STK Push Error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@payment_bp.route("/mpesa/callback", methods=["POST", "OPTIONS"])
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
        print("=" * 80)
        print("M-PESA CALLBACK RECEIVED:")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print(f"Data: {data}")
        print("=" * 80)
        
        # Validate data structure
        if not data or "Body" not in data:
            print("ERROR: Invalid callback structure - missing Body")
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        # Extract STK callback data
        stk_callback = data.get("Body", {}).get("stkCallback", {})
        
        if not stk_callback:
            print("ERROR: Invalid callback structure - missing stkCallback")
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        # Extract key fields
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        merchant_request_id = stk_callback.get("MerchantRequestID")
        
        print(f"CheckoutRequestID: {checkout_request_id}")
        print(f"MerchantRequestID: {merchant_request_id}")
        print(f"ResultCode: {result_code}")
        print(f"ResultDesc: {result_desc}")
        
        # Find payment by checkout request ID
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        if not payment:
            print(f"WARNING: Payment not found for CheckoutRequestID: {checkout_request_id}")
            # Still return 200 - this is not an error from M-Pesa's perspective
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
        
        print(f"Found payment ID: {payment.id} for Order ID: {payment.order_id}")
        print(f"Current payment status: {payment.status}")
        
        # Process based on result code
        if result_code == 0:
            # Payment SUCCESSFUL
            print("✓ Payment SUCCESSFUL - Processing...")
            
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
            
            print(f"Payment Details: {payment_details}")
            
            # Get M-Pesa receipt number
            mpesa_receipt = payment_details.get("MpesaReceiptNumber")
            amount = payment_details.get("Amount")
            phone = payment_details.get("PhoneNumber")
            
            print(f"Receipt: {mpesa_receipt}, Amount: {amount}, Phone: {phone}")
            
            # Update payment status
            payment.mark_as_paid(mpesa_receipt=mpesa_receipt)
            
            # Update order status
            if payment.order:
                payment.order.status = "CONFIRMED"
                print(f"Order {payment.order.id} status updated to CONFIRMED")
            
            # Commit to database
            db.session.commit()
            
            print(f"✓ Payment {payment.id} successfully marked as PAID")
            print("=" * 80)

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
                print(f"Payment email failed: {str(e)}")
        
        else:
            # Payment FAILED or CANCELLED
            print(f"✗ Payment FAILED - ResultCode: {result_code}")
            print(f"Reason: {result_desc}")
            
            # Mark payment as failed
            payment.mark_as_failed()
            
            # Update order status
            if payment.order:
                payment.order.status = "PAYMENT_FAILED"
                print(f"Order {payment.order.id} status updated to PAYMENT_FAILED")
            
            # Commit to database
            db.session.commit()
            
            print(f"✓ Payment {payment.id} marked as FAILED")
            print("=" * 80)
        
        # CRITICAL: Always return 200 OK to M-Pesa
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Success"
        }), 200
    
    except Exception as e:
        # Log the error but still return 200
        print("!" * 80)
        print(f"EXCEPTION in M-Pesa callback: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        print("!" * 80)
        
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
def check_payment_status(checkout_request_id):
    """
    Check the status of an M-Pesa transaction
    """
    try:
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
        
        payment = order.payment
        
        return jsonify({
            "order_id": order.id,
            "status": order.status,
            "payment_status": payment.status if payment else "NONE",
            "payment_method": payment.method if payment else None,
            "mpesa_receipt": payment.mpesa_receipt if payment else None,
            "mpesa_checkout_id": payment.mpesa_checkout_id if payment else None,
            "paid_at": payment.paid_at.isoformat() if payment and payment.paid_at else None,
            "total": float(order.total)
        })
    
    except Exception as e:
        print(f"Payment status error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
# Add this route to your payment.py file

@payment_bp.route("/orders/<int:order_id>/mark-cod-payment", methods=["POST"])
def mark_cod_payment(order_id):
    """
    Mark a COD order payment as pending/confirmed
    This is called when user selects Cash on Delivery
    """
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
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
