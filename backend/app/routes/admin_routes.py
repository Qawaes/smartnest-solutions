from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.order import Order
from app.models.product import Product
from app.models.branding import BrandingDetail

admin_bp = Blueprint("admin", __name__)


def admin_required():
    """Decorator to check if user has admin role"""
    claims = get_jwt()
    if not claims or claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    return None


@admin_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    """Get dashboard statistics - protected route"""
    # Check if user is admin
    auth_error = admin_required()
    if auth_error:
        return auth_error

    try:
        total_orders = Order.query.count()
        total_products = Product.query.count()
        branding_requests = BrandingDetail.query.count()

        # Additional stats you might want
        pending_orders = Order.query.filter_by(status="pending").count()
        completed_orders = Order.query.filter_by(status="completed").count()

        return jsonify({
            "total_orders": total_orders,
            "total_products": total_products,
            "branding_requests": branding_requests,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
