from flask import Blueprint, jsonify, request
from datetime import datetime
from app.models.product import Product
from app.models.category import Category
from app.models.product_image import ProductImage
from app.models.product_rating import ProductRating
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt

product_bp = Blueprint("products", __name__)

def parse_iso_datetime(value):
    if not value:
        return None
    try:
        if isinstance(value, str) and value.endswith("Z"):
            value = value.replace("Z", "+00:00")
        return datetime.fromisoformat(value)
    except Exception:
        return None

def _require_admin():
    claims = get_jwt()
    if not claims or claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    return None

# GET (ALL or BY CATEGORY)
@product_bp.route("", methods=["GET", "OPTIONS"])
def get_products():
    products = Product.query.all()

    result = []

    for p in products:
        primary_image = None

        if p.images:
            primary = next(
                (img for img in p.images if img.is_primary),
                None
            )
            primary_image = (
                primary.image_url if primary else p.images[0].image_url
            )

        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "category": p.category.slug,
            "is_branding": p.is_branding,
            "discount_percent": p.discount_percent,
            "discounted_price": float(p.get_discounted_price()) if p.discount_percent else None,
            "effective_price": float(p.get_effective_price()),
            "flash_sale_active": p.is_flash_sale_active(),
            "flash_sale_percent": p.flash_sale_percent,
            "flash_sale_start": p.flash_sale_start.isoformat() if p.flash_sale_start else None,
            "flash_sale_end": p.flash_sale_end.isoformat() if p.flash_sale_end else None,
            "rating_avg": round(p.rating_sum / p.rating_count, 2) if p.rating_count > 0 else 0,
            "rating_count": p.rating_count,
            "in_stock": p.stock_quantity > 0,

          
            "image": primary_image,
            "images": [img.to_dict() for img in p.images],
        })

    return jsonify(result)

@product_bp.route("/admin", methods=["GET"])
@jwt_required()
def get_products_admin():
    auth_error = _require_admin()
    if auth_error:
        return auth_error

    products = Product.query.all()
    result = []
    for p in products:
        primary_image = None
        if p.images:
            primary = next((img for img in p.images if img.is_primary), None)
            primary_image = primary.image_url if primary else p.images[0].image_url
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "category": p.category.slug,
            "is_branding": p.is_branding,
            "stock_quantity": p.stock_quantity,
            "discount_percent": p.discount_percent,
            "discounted_price": float(p.get_discounted_price()) if p.discount_percent else None,
            "effective_price": float(p.get_effective_price()),
            "flash_sale_active": p.is_flash_sale_active(),
            "flash_sale_percent": p.flash_sale_percent,
            "flash_sale_start": p.flash_sale_start.isoformat() if p.flash_sale_start else None,
            "flash_sale_end": p.flash_sale_end.isoformat() if p.flash_sale_end else None,
            "rating_avg": round(p.rating_sum / p.rating_count, 2) if p.rating_count > 0 else 0,
            "rating_count": p.rating_count,
            "in_stock": p.stock_quantity > 0,
            "image": primary_image,
            "images": [img.to_dict() for img in p.images],
        })
    return jsonify(result)


# CREATE PRODUCT
@product_bp.route("", methods=["POST"])
@jwt_required()
def create_product():
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    data = request.get_json()

    stock_quantity = data.get("stock_quantity", 0)
    discount_percent = data.get("discount_percent", 0)
    flash_sale_percent = data.get("flash_sale_percent", 0)
    flash_sale_start = parse_iso_datetime(data.get("flash_sale_start"))
    flash_sale_end = parse_iso_datetime(data.get("flash_sale_end"))
    if stock_quantity is not None and stock_quantity < 0:
        return jsonify({"error": "stock_quantity must be 0 or greater"}), 400
    if discount_percent is not None and (discount_percent < 0 or discount_percent > 100):
        return jsonify({"error": "discount_percent must be between 0 and 100"}), 400
    if flash_sale_percent is not None and (flash_sale_percent < 0 or flash_sale_percent > 100):
        return jsonify({"error": "flash_sale_percent must be between 0 and 100"}), 400
    if flash_sale_start and flash_sale_end and flash_sale_end <= flash_sale_start:
        return jsonify({"error": "flash_sale_end must be after flash_sale_start"}), 400

    product = Product(
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        category_id=data["category_id"],
        is_branding=data.get("is_branding", False),
        stock_quantity=stock_quantity,
        discount_percent=discount_percent,
        flash_sale_start=flash_sale_start,
        flash_sale_end=flash_sale_end,
        flash_sale_percent=flash_sale_percent,
    )

    db.session.add(product)
    db.session.flush()  # get product.id BEFORE commit

    # ✅ handle images properly
    images = data.get("images", [])
    for idx, img in enumerate(images):
        image = ProductImage(
            url=img["url"],
            is_primary=img.get("is_primary", idx == 0),
            product_id=product.id
        )
        db.session.add(image)

    db.session.commit()

    return jsonify(product.to_dict()), 201

# UPDATE PRODUCT
@product_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    product = Product.query.get_or_404(id)
    data = request.json

    if "stock_quantity" in data and data["stock_quantity"] is not None and data["stock_quantity"] < 0:
        return jsonify({"error": "stock_quantity must be 0 or greater"}), 400
    if "discount_percent" in data and data["discount_percent"] is not None:
        if data["discount_percent"] < 0 or data["discount_percent"] > 100:
            return jsonify({"error": "discount_percent must be between 0 and 100"}), 400
    if "flash_sale_percent" in data and data["flash_sale_percent"] is not None:
        if data["flash_sale_percent"] < 0 or data["flash_sale_percent"] > 100:
            return jsonify({"error": "flash_sale_percent must be between 0 and 100"}), 400

    product.name = data["name"]
    product.price = data["price"]
    product.category_id = data["category_id"]
    product.image_url = data.get("image_url")
    product.is_branding = data.get("is_branding", False)
    product.stock_quantity = data.get("stock_quantity", product.stock_quantity)
    product.discount_percent = data.get("discount_percent", product.discount_percent)
    product.flash_sale_percent = data.get("flash_sale_percent", product.flash_sale_percent)
    if "flash_sale_start" in data:
        product.flash_sale_start = parse_iso_datetime(data.get("flash_sale_start"))
    if "flash_sale_end" in data:
        product.flash_sale_end = parse_iso_datetime(data.get("flash_sale_end"))

    db.session.commit()

    return jsonify({"message": "Product updated"})


# DELETE PRODUCT
@product_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted"})

# GET PRODUCTS BY CATEGORY SLUG
@product_bp.route("/category/<slug>", methods=["GET"])
def get_products_by_category(slug):
    products = (
        Product.query
        .join(Category)
        .filter(Category.slug == slug)
        .all()
    )

    result = []

    for p in products:
        primary_image = None

        if p.images:
            primary = next(
                (img for img in p.images if img.is_primary),
                None
            )
            primary_image = (
                primary.image_url if primary else p.images[0].image_url
            )

        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "category": p.category.slug,
            "is_branding": p.is_branding,
            "discount_percent": p.discount_percent,
            "discounted_price": float(p.get_discounted_price()) if p.discount_percent else None,
            "effective_price": float(p.get_effective_price()),
            "flash_sale_active": p.is_flash_sale_active(),
            "flash_sale_percent": p.flash_sale_percent,
            "flash_sale_start": p.flash_sale_start.isoformat() if p.flash_sale_start else None,
            "flash_sale_end": p.flash_sale_end.isoformat() if p.flash_sale_end else None,
            "rating_avg": round(p.rating_sum / p.rating_count, 2) if p.rating_count > 0 else 0,
            "rating_count": p.rating_count,
            "in_stock": p.stock_quantity > 0,
            "image": primary_image,
            "images": [img.to_dict() for img in p.images],
        })

    return jsonify(result)


@product_bp.route("/<int:id>/ratings", methods=["POST"])
def create_rating(id):
    data = request.get_json() or {}
    rating = data.get("rating")
    if rating is None:
        return jsonify({"error": "rating is required"}), 400

    try:
        rating = int(rating)
    except ValueError:
        return jsonify({"error": "rating must be an integer"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"error": "rating must be between 1 and 5"}), 400

    product = Product.query.get_or_404(id)
    review = ProductRating(product_id=product.id, rating=rating)
    db.session.add(review)

    product.rating_sum = (product.rating_sum or 0) + rating
    product.rating_count = (product.rating_count or 0) + 1

    db.session.commit()

    return jsonify({
        "message": "Rating submitted",
        "rating_avg": round(product.rating_sum / product.rating_count, 2),
        "rating_count": product.rating_count
    }), 201
