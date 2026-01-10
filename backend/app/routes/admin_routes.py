from flask import Blueprint, jsonify
from app.models.order import Order
from app.models.product import Product
from app.models.branding import BrandingDetail

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/dashboard-stats", methods=["GET"])
def dashboard_stats():
    total_orders = Order.query.count()
    total_products = Product.query.count()
    branding_requests = BrandingDetail.query.count()

    return jsonify({
        "total_orders": total_orders,
        "total_products": total_products,
        "branding_requests": branding_requests,
    })
