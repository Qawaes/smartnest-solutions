from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment
from app.services.mpesa import stk_push, query_stk_status
from datetime import datetime
import json

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
    
    # Check if order already has a paid payment
    existing_payment = Payment.query.filter_by(
        order_id=order_id,
        status="PAID"
    ).first()
    if existing_payment:
        return jsonify({"error": "Order already paid"}), 400
    
    # Get or create payment record for this order
    payment = Payment.query.filter_by(
        order_id=order_id,
        method="mpesa"
    ).first()
    
    if not payment:
        payment = Payment(
            order_id=order_id,
            method="mpesa",
            status="PENDING"
        )
        db.session.add(payment)
        db.session.flush()
    
    # Initiate STK Push
    try:
        result = stk_push(
            phone=phone,
            amount=order.total,
            order_id=order.id
        )
        
        # HARD LOGGING - PRINT EXACT SAFARICOM RESPONSE
        print(f"\n🔥 STK PUSH RESULT (RAW): {result}")
        print(f"\n{'='*60}")
        print(f"STK Push Response for Order {order_id}:")
        print(f"Success: {result.get('success')}")
        print(f"Response Code: {result.get('response_code')}")
        print(f"CheckoutRequestID: {result.get('checkout_request_id')}")
        print(f"Full Response: {result}")
        print(f"{'='*60}\n")
        
        if result.get("success"):
            # Store checkout request ID in payment record
            checkout_id = result.get("checkout_request_id")
            print(f"🔥 SAVING checkout_id: {checkout_id} to Payment {payment.id}")
            payment.mpesa_checkout_id = checkout_id
            payment.status = "PENDING"
            db.session.flush()
            db.session.commit()
            db.session.refresh(payment)
            print(f"🔥 VERIFY SAVED: Payment {payment.id} now has checkout_id: {payment.mpesa_checkout_id}")
            
            return jsonify({
                "success": True,
                "message": "STK push sent successfully. Check your phone for the prompt.",
                "checkout_request_id": result.get("checkout_request_id"),
                "customer_message": result.get("customer_message"),
                "response_code": result.get("response_code"),
                "payment_id": payment.id
            }), 200
        else:
            error_msg = result.get("error") or result.get("response_description") or "Failed to initiate payment"
            return jsonify({
                "success": False,
                "error": error_msg,
                "response_code": result.get("response_code")
            }), 400
    
    except Exception as e:
        print(f"STK Push Exception: {str(e)}")
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@payment_bp.route("/mpesa/callback", methods=["POST"])
def mpesa_callback():
    """
    M-Pesa callback endpoint
    Safaricom will POST payment results here
    """
    # 🔥 HARD LOGGING - PROOF CALLBACK IS HIT
    print("\n" + "="*80)
    print("🔥🔥🔥 MPESA CALLBACK HIT 🔥🔥🔥")
    print("="*80)
    
    try:
        data = request.get_json()
        
        # Log the callback for debugging
        print("M-PESA CALLBACK RECEIVED:")
        print(json.dumps(data, indent=2))
        print("="*80)
        
        # Extract STK callback data
        stk_callback = data.get("Body", {}).get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        
        print(f"ResultCode: {result_code}, CheckoutRequestID: {checkout_request_id}")
        
        # Find payment by checkout request ID
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        if not payment:
            print(f"Payment not found for CheckoutRequestID: {checkout_request_id}")
            # Still return success to M-Pesa
            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Accepted"
            }), 200
        
        print(f"Found payment: {payment.id}, Order: {payment.order_id}, Current status: {payment.status}")
        
        # Payment successful
        if result_code == 0:
            # Extract payment details from metadata
            callback_metadata = stk_callback.get("CallbackMetadata", {})
            items = callback_metadata.get("Item", [])
            
            # Parse metadata items
            payment_details = {}
            for item in items:
                name = item.get("Name")
                value = item.get("Value")
                payment_details[name] = value
            
            # Update payment with success details
            payment.mark_as_paid(mpesa_receipt=payment_details.get("MpesaReceiptNumber"))
            # Update order status to processing
            payment.order.status = "processing"
            db.session.commit()
            
            print(f"✓ Payment {payment.id} marked as PAID. Receipt: {payment.mpesa_receipt}, Order status: {payment.order.status}")
        
        # Payment failed or cancelled
        else:
            payment.mark_as_failed()
            db.session.commit()
            print(f"✗ Payment {payment.id} FAILED. Reason: {result_desc}")
        
        # IMPORTANT: Always return success to M-Pesa
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        }), 200
    
    except Exception as e:
        print(f"Error processing M-Pesa callback: {str(e)}")
        import traceback
        traceback.print_exc()
        # Still return success to avoid retries
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        }), 200


@payment_bp.route("/mpesa/status/<checkout_request_id>", methods=["GET"])
def check_payment_status(checkout_request_id):
    """
    Check the status of an M-Pesa transaction
    Useful for polling if callback hasn't arrived
    """
    try:
        # Find payment by checkout request ID
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        if not payment:
            return jsonify({"error": "Payment not found"}), 404
        
        return jsonify({
            "payment_id": payment.id,
            "order_id": payment.order_id,
            "method": payment.method,
            "status": payment.status,
            "mpesa_receipt": payment.mpesa_receipt,
            "mpesa_checkout_id": payment.mpesa_checkout_id,
            "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
            "order_status": payment.order.status
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@payment_bp.route("/order/<int:order_id>/payment-status", methods=["GET"])
def get_order_payment_status(order_id):
    """
    Get payment status for a specific order
    Useful for frontend polling
    """
    # Get the order
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    # Get the M-Pesa payment for this order (most recent)
    payment = Payment.query.filter_by(
        order_id=order_id,
        method="mpesa"
    ).order_by(Payment.created_at.desc()).first()
    
    if not payment:
        return jsonify({"error": "No payment found for this order"}), 404
    
    print(f"\n[Status Check] Order {order_id} - Payment {payment.id} - Status: {payment.status}")
    
    response = {
        "order_id": order.id,
        "order_status": order.status,
        "payment_id": payment.id,
        "payment_method": payment.method,
        "payment_status": payment.status,
        "mpesa_receipt": payment.mpesa_receipt,
        "mpesa_checkout_id": payment.mpesa_checkout_id,
        "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
        "total": float(order.total)
    }
    
    print(f"[Status Check] Final response for order {order_id}: {response}\n")
    return jsonify(response)