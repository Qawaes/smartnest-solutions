from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.branding import BrandingDetail
from app.models.product import Product
from app.models.payment import Payment
from datetime import datetime

order_bp = Blueprint("orders", __name__)


@order_bp.route("", methods=["POST"])
def create_order():
    data = request.get_json()

    # Validation
    if not data:
        return jsonify({"error": "No data provided"}), 400

    customer = data.get("customer", {})
    items = data.get("items", [])

    # Validate required fields
    required_fields = ["name", "phone", "address"]
    missing_fields = [field for field in required_fields if not customer.get(field)]
    
    if missing_fields:
        return jsonify({
            "error": f"Missing customer fields: {', '.join(missing_fields)}"
        }), 400

    if not items:
        return jsonify({"error": "No items in order"}), 400

    try:
        # 1️⃣ Create order
        order = Order(
            customer_name=customer["name"],
            phone=customer["phone"],
            email=customer.get("email"),
            address=customer["address"],
            total=0,
            status="pending",
        )

        db.session.add(order)
        db.session.flush()  # Get order.id

        calculated_total = 0
        created_items = []

        # 2️⃣ Create order items
        for item in items:
            product_id = item.get("product_id")
            qty = item.get("qty", 0)

            if not product_id or qty <= 0:
                db.session.rollback()
                return jsonify({
                    "error": "Invalid product_id or quantity"
                }), 400

            product = Product.query.get(product_id)
            if not product:
                db.session.rollback()
                return jsonify({
                    "error": f"Product with ID {product_id} not found"
                }), 404

            line_total = product.price * qty
            calculated_total += line_total

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                name=product.name,
                price=product.price,
                qty=qty,
            )
            db.session.add(order_item)
            created_items.append({
                "name": product.name,
                "price": float(product.price),
                "qty": qty
            })

        # 3️⃣ Update total
        order.total = calculated_total

        # 4️⃣ Create payment record
        payment_method = data.get("payment_method", "mpesa")
        payment = Payment(
            order_id=order.id,
            method=payment_method,
            status="PENDING"
        )
        db.session.add(payment)

        # 5️⃣ Branding (optional)
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

        db.session.commit()

        return jsonify({
            "message": "Order placed successfully",
            "order_id": order.id,
            "total": float(order.total),
            "status": order.status,
            "payment_status": payment.status,
            "items": created_items,
            "customer": {
                "name": order.customer_name,
                "phone": order.phone,
                "email": order.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Failed to create order",
            "details": str(e)
        }), 500


@order_bp.route("", methods=["GET"])
def get_orders():
    try:
        status = request.args.get("status")
        
        query = Order.query
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).all()

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
                        "price": float(i.price) if i.price is not None else 0.0,
                        "qty": i.qty,
                        "subtotal": float(i.price * i.qty) if i.price is not None else 0.0
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
                "total": float(o.total) if o.total is not None else 0.0,
                "payment": o.payment.to_dict() if o.payment else None,
                "status": o.status,
                "created_at": o.created_at.strftime("%Y-%m-%d %H:%M") if o.created_at else None,
            }
            for o in orders
        ])
    
    except Exception as e:
        return jsonify({
            "error": "Failed to fetch orders",
            "details": str(e)
        }), 500


@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order_detail(order_id):
    """Get a single order by ID"""
    order = Order.query.get_or_404(order_id)
    
    return jsonify({
        "id": order.id,
        "customer": {
            "name": order.customer_name,
            "phone": order.phone,
            "email": order.email,
            "address": order.address,
        },
        "items": [
            {
                "id": i.id,
                "product_id": i.product_id,
                "name": i.name,
                "price": float(i.price) if i.price is not None else 0.0,
                "qty": i.qty,
                "subtotal": float(i.price * i.qty) if i.price is not None else 0.0
            }
            for i in order.items
        ],
        "branding": (
            {
                "logo": order.branding.logo,
                "colors": order.branding.colors,
                "notes": order.branding.notes,
                "deadline": order.branding.deadline,
            }
            if order.branding else None
        ),
        "total": float(order.total) if order.total is not None else 0.0,
        "payment": order.payment.to_dict() if order.payment else None,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
    })


@order_bp.route("/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    data = request.get_json()
    
    if not data or "status" not in data:
        return jsonify({"error": "Status is required"}), 400

    # Validate status
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    new_status = data["status"]
    
    if new_status not in valid_statuses:
        return jsonify({
            "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        }), 400

    order = Order.query.get_or_404(order_id)
    old_status = order.status
    order.status = new_status

    try:
        db.session.commit()
        
        return jsonify({
            "message": "Order status updated successfully",
            "order_id": order.id,
            "old_status": old_status,
            "new_status": order.status
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to update status",
            "details": str(e)
        }), 500


@order_bp.route("/<int:order_id>", methods=["DELETE"])
def cancel_order(order_id):
    """Cancel an order (only if pending)"""
    order = Order.query.get_or_404(order_id)
    
    # Only allow cancellation of pending orders
    if order.status not in ["pending", "cancelled"]:
        return jsonify({
            "error": f"Cannot cancel order with status '{order.status}'"
        }), 400
    
    try:
        order.status = "cancelled"
        if order.payment:
            order.payment.status = "CANCELLED"
        db.session.commit()
        
        return jsonify({
            "message": "Order cancelled successfully",
            "order_id": order.id
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to cancel order",
            "details": str(e)
        }), 500