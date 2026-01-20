from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment
from app.services.mpesa import stk_push, query_stk_status
from datetime import datetime

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
        import traceback
        traceback.print_exc()
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
    try:
        data = request.get_json()
        
        # Log the callback
        print("=" * 50)
        print("M-PESA CALLBACK RECEIVED:")
        print(data)
        print("=" * 50)
        
        # Extract STK callback data
        stk_callback = data.get("Body", {}).get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        
        # Find payment by checkout request ID
        payment = Payment.query.filter_by(
            mpesa_checkout_id=checkout_request_id
        ).first()
        
        if not payment:
            print(f"Payment not found for CheckoutRequestID: {checkout_request_id}")
            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Accepted"
            }), 200
        
        # Payment successful
        if result_code == 0:
            # Extract payment details
            callback_metadata = stk_callback.get("CallbackMetadata", {})
            items = callback_metadata.get("Item", [])
            
            payment_details = {}
            for item in items:
                payment_details[item.get("Name")] = item.get("Value")
            
            # Update payment
            payment.mark_as_paid(mpesa_receipt=payment_details.get("MpesaReceiptNumber"))
            
            # Update order status
            payment.order.status = "processing"
            
            print(f"Payment {payment.id} marked as PAID. Receipt: {payment.mpesa_receipt}")
        
        # Payment failed or cancelled
        else:
            payment.mark_as_failed()
            print(f"Payment {payment.id} FAILED. Reason: {result_desc}")
        
        db.session.commit()
        
        # IMPORTANT: Always return success to M-Pesa
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        }), 200
    
    except Exception as e:
        print(f"Callback Error: {str(e)}")
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
        return jsonify({
            "error": str(e)
        }), 500


@payment_bp.route("/order/<int:order_id>/payment-status", methods=["GET"])
def get_order_payment_status(order_id):
    """
    Get payment status for a specific order
    Used by frontend for polling
    """
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
