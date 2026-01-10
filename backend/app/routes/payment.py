from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from datetime import datetime

payment_bp = Blueprint("payment", __name__)

@payment_bp.route("/mpesa/callback", methods=["POST"])
def mpesa_callback():
    data = request.json

    stk = data["Body"]["stkCallback"]
    result_code = stk["ResultCode"]

    # Extract order ID from AccountReference if you set it like ORDER-123
    # OR map CheckoutRequestID to order in DB if stored earlier
    metadata = stk.get("CallbackMetadata", {}).get("Item", [])

    amount = None
    receipt = None
    phone = None

    for item in metadata:
        if item["Name"] == "Amount":
            amount = item["Value"]
        elif item["Name"] == "MpesaReceiptNumber":
            receipt = item["Value"]
        elif item["Name"] == "PhoneNumber":
            phone = item["Value"]

    # 🚨 IMPORTANT:
    # You should have stored CheckoutRequestID → order_id earlier
    # For now, assume last unpaid order for this phone (sandbox-safe)
    order = (
        Order.query
        .filter_by(phone=str(phone), status="pending")
        .order_by(Order.created_at.desc())
        .first()
    )

    if not order:
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})

    if result_code == 0:
        order.status = "paid"
        order.mpesa_receipt = receipt
        order.paid_at = datetime.utcnow()
        order.payment_method = "mpesa"
    else:
        order.status = "payment_failed"

    db.session.commit()

    # 🚨 YOU MUST RETURN THIS EXACT RESPONSE
    return jsonify({
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    })
