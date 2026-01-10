from flask import Blueprint, jsonify
from app.models.category import Category

category_bp = Blueprint("categories", __name__)

@category_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug
        }
        for c in categories
    ])
