from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.payment import Payment
from app.models.order import Order
from functools import wraps
import jwt
import os

admin_payment_bp = Blueprint("admin_payments", __name__)

# Simple admin auth decorator (adjust based on your auth system)
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
                # Verify token (adjust secret key as needed)
                jwt.decode(token, os.getenv('JWT_SECRET_KEY', 'your-secret-key'), algorithms=["HS256"])
            except:
                return jsonify({"error": "Invalid or expired token"}), 401
        else:
            return jsonify({"error": "Authorization token required"}), 401
        
        return f(*args, **kwargs)
    return decorated_function


@admin_payment_bp.route("/test", methods=["GET"])
def test_route():
    """Test route without authentication"""
    return jsonify({"message": "Admin payments route is working!"}), 200


@admin_payment_bp.route("", methods=["GET", "OPTIONS"])
@admin_required
def get_all_payments():
    """
    Get all payments with order and customer details
    Returns comprehensive payment ledger for admin
    """
    # Handle OPTIONS request for CORS
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        # Query all payments with related order data
        payments = db.session.query(Payment).join(Order).order_by(Payment.created_at.desc()).all()
        
        result = []
        for payment in payments:
            order = payment.order
            
            # Get customer info
            customer_name = order.customer.name if order.customer else "Guest"
            customer_contact = order.customer.email or order.customer.phone if order.customer else "N/A"
            contact_type = "email" if (order.customer and order.customer.email) else "phone"
            
            # Get order items/products
            products = []
            for item in order.items:
                products.append({
                    "name": item.product.name if item.product else "Unknown",
                    "quantity": item.quantity,
                    "price": float(item.price)
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
@admin_required
def get_payment_stats():
    """
    Get payment statistics for dashboard
    """
    # Handle OPTIONS request for CORS
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
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