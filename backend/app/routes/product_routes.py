from flask import Blueprint, jsonify, request
from app.models.product import Product
from app.models.category import Category
from app.models.product_image import ProductImage
from app.extensions import db

product_bp = Blueprint("products", __name__)

# GET (ALL or BY CATEGORY)
@product_bp.route("", methods=["GET"])
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

          
            "image": primary_image,
            "images": [img.to_dict() for img in p.images],
        })

    return jsonify(result)



# CREATE PRODUCT
@product_bp.route("", methods=["POST"])
def create_product():
    data = request.get_json()

    product = Product(
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        category_id=data["category_id"],
        is_branding=data.get("is_branding", False),
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
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json

    product.name = data["name"]
    product.price = data["price"]
    product.category_id = data["category_id"]
    product.image_url = data.get("image_url")
    product.is_branding = data.get("is_branding", False)

    db.session.commit()

    return jsonify({"message": "Product updated"})


# DELETE PRODUCT
@product_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
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
            "image": primary_image,
            "images": [img.to_dict() for img in p.images],
        })

    return jsonify(result)
