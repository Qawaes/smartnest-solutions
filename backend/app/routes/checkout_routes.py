from flask import Blueprint, request, jsonify
from app.services.mpesa import stk_push
from app.models.order import Order
from app.extensions import db

payment_bp = Blueprint("payments", __name__)

@payment_bp.route("/mpesa/stk", methods=["POST"])
def initiate_stk():
    data = request.json

    order = Order.query.get_or_404(data["order_id"])

    res = stk_push(
        phone=data["phone"],
        amount=order.total,
        order_id=order.id
    )

    return jsonify(res)


@payment_bp.route("/mpesa/callback", methods=["POST"])
def mpesa_callback():
    payload = request.json

    print("MPESA CALLBACK:", payload)

    stk = payload["Body"]["stkCallback"]
    result_code = stk["ResultCode"]
    checkout_id = stk["CheckoutRequestID"]

    if result_code == 0:
        amount = stk["CallbackMetadata"]["Item"][0]["Value"]
        receipt = stk["CallbackMetadata"]["Item"][1]["Value"]
        phone = stk["CallbackMetadata"]["Item"][4]["Value"]

        order = Order.query.filter_by(
            mpesa_checkout_id=checkout_id
        ).first()

        if order:
            order.payment_status = "paid"
            order.mpesa_receipt = receipt
            db.session.commit()

    return jsonify({"status": "ok"})
