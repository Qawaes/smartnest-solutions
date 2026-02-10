from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.payment import Payment
from app.models.order import Order
from datetime import datetime

admin_payment_bp = Blueprint("admin_payments", __name__)

def _require_admin():
    claims = get_jwt()
    if not claims or claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    return None

@admin_payment_bp.route("/test", methods=["GET"])
@jwt_required()
def test_route():
    """Test route (admin only)"""
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    return jsonify({"message": "Admin payments route is working!"}), 200


@admin_payment_bp.route("", methods=["GET", "OPTIONS"])
@jwt_required()
def get_all_payments():
    """
    Get all payments with order and customer details
    Returns comprehensive payment ledger for admin
    """
    # Handle OPTIONS request for CORS
    if request.method == "OPTIONS":
        return jsonify({}), 200
    auth_error = _require_admin()
    if auth_error:
        return auth_error
        
    try:
        # Query all payments with related order data
        payments = db.session.query(Payment).join(Order).order_by(Payment.created_at.desc()).all()
        
        result = []
        for payment in payments:
            order = payment.order
            
            # Get customer info directly from order columns
            customer_name = order.customer_name or "Guest"
            customer_contact = order.email or order.phone or "N/A"
            contact_type = "email" if order.email else "phone"
            
            # Get order items/products
            products = []
            for item in order.items:
                products.append({
                    "name": item.name or "Unknown",
                    "quantity": item.qty,
                    "price": float(item.price) if item.price else 0.0
                })
            
            result.append({
                "payment_id": payment.id,
                "order_id": order.id,
                "customer_name": customer_name,
                "customer_contact": customer_contact,
                "contact_type": contact_type,
                "products": products,
                "total": float(order.total),
                "method": payment.method,
                "status": payment.status,
                "mpesa_receipt": payment.mpesa_receipt,
                "mpesa_checkout_id": payment.mpesa_checkout_id,
                "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
                "created_at": payment.created_at.isoformat(),
                "order_status": order.status
            })
        
        return jsonify(result), 200
    
    except Exception as e:
        print(f"Error fetching payments: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch payments"}), 500


@admin_payment_bp.route("/stats", methods=["GET", "OPTIONS"])
@jwt_required()
def get_payment_stats():
    """
    Get payment statistics for dashboard
    """
    # Handle OPTIONS request for CORS
    if request.method == "OPTIONS":
        return jsonify({}), 200
    auth_error = _require_admin()
    if auth_error:
        return auth_error
        
    try:
        total_payments = Payment.query.count()
        paid_payments = Payment.query.filter_by(status="PAID").count()
        pending_payments = Payment.query.filter_by(status="PENDING").count()
        failed_payments = Payment.query.filter_by(status="FAILED").count()
        
        # Calculate total revenue
        paid_orders = db.session.query(Order).join(Payment).filter(Payment.status == "PAID").all()
        total_revenue = sum(float(order.total) for order in paid_orders)
        
        # Get payment methods breakdown
        mpesa_count = Payment.query.filter_by(method="mpesa", status="PAID").count()
        cod_count = Payment.query.filter_by(method="cod", status="PAID").count()
        
        return jsonify({
            "total_payments": total_payments,
            "paid": paid_payments,
            "pending": pending_payments,
            "failed": failed_payments,
            "total_revenue": total_revenue,
            "payment_methods": {
                "mpesa": mpesa_count,
                "cod": cod_count
            }
        }), 200
    
    except Exception as e:
        print(f"Error fetching payment stats: {str(e)}")
        return jsonify({"error": "Failed to fetch payment statistics"}), 500


@admin_payment_bp.route("/<int:payment_id>/status", methods=["PUT"])
@jwt_required()
def update_payment_status(payment_id):
    auth_error = _require_admin()
    if auth_error:
        return auth_error

    data = request.get_json() or {}
    new_status = data.get("status")

    valid_statuses = ["PENDING", "PAID", "FAILED", "CANCELLED"]
    if new_status not in valid_statuses:
        return jsonify({
            "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        }), 400

    payment = Payment.query.get_or_404(payment_id)
    old_status = payment.status
    payment.status = new_status

    if new_status == "PAID":
        if not payment.paid_at:
            payment.paid_at = datetime.utcnow()
        # If order is still pending, move to processing
        if payment.order and payment.order.status == "pending":
            payment.order.status = "processing"
    else:
        payment.paid_at = None
        if payment.order and payment.order.status == "processing":
            payment.order.status = "pending"

    try:
        db.session.commit()
        return jsonify({
            "message": "Payment status updated",
            "payment_id": payment.id,
            "old_status": old_status,
            "new_status": payment.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to update payment status",
            "details": str(e)
        }), 500
