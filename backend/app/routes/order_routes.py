from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.branding import BrandingDetail
from app.models.product import Product

order_bp = Blueprint("orders", __name__)

@order_bp.route("", methods=["POST"])
def create_order():
    data = request.get_json()

    # 1️⃣ Create order (no commit yet)
    order = Order(
        customer_name=data["customer"]["name"],
        phone=data["customer"]["phone"],
        email=data["customer"].get("email"),
        address=data["customer"]["address"],
        total=data["total"],  # ⚠️ frontend provided (recalculate later)
        payment_method=data.get("payment_method"),
        status="pending",
    )

    db.session.add(order)
    db.session.flush()  # get order.id

    # 2️⃣ Order items
    for item in data["items"]:
        product = Product.query.get(item["product_id"])
        if not product:
            continue

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            name=product.name,
            price=product.price,
            qty=item["qty"],
        )
        db.session.add(order_item)

    # 3️⃣ Branding (optional)
    branding = data.get("branding")
    if branding:
        branding_detail = BrandingDetail(
            order_id=order.id,
            logo=branding.get("logo"),
            colors=branding.get("colors"),
            notes=branding.get("notes"),
            deadline=branding.get("deadline"),
        )
        db.session.add(branding_detail)

    # 4️⃣ Single commit
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id,
        "status": order.status
    }), 201


@order_bp.route("", methods=["GET"])
def get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()

    return jsonify([
        {
            "id": o.id,
            "customer": {
                "name": o.customer_name,
                "phone": o.phone,
                "email": o.email,
                "address": o.address,
            },
            "items": [
                {
                    "name": i.name,
                    "price": float(i.price),
                    "qty": i.qty,
                }
                for i in o.items
            ],
            "branding": (
                {
                    "logo": o.branding.logo,
                    "colors": o.branding.colors,
                    "notes": o.branding.notes,
                    "deadline": o.branding.deadline,
                }
                if o.branding else None
            ),
            "total": float(o.total),
            "payment_method": o.payment_method,
            "status": o.status,
            "created_at": o.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for o in orders
    ])


@order_bp.route("/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    data = request.get_json()

    order = Order.query.get_or_404(order_id)
    order.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Order status updated",
        "status": order.status
    })


@order_bp.route("/<int:order_id>/payment-method", methods=["PUT"])
def update_payment_method(order_id):
    data = request.get_json()

    order = Order.query.get_or_404(order_id)
    order.payment_method = data["payment_method"]

    db.session.commit()

    return jsonify({
        "message": "Payment method updated",
        "payment_method": order.payment_method
    })
