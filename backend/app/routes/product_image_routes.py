from flask import Blueprint, request, jsonify
from app.models.product import Product
from app.models.product_image import ProductImage
from app.extensions import db
from cloudinary.uploader import upload
from flask_jwt_extended import jwt_required, get_jwt

product_image_bp = Blueprint("product_images", __name__)

def _require_admin():
    claims = get_jwt()
    if not claims or claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    return None
@product_image_bp.route(
    "/<int:product_id>/images",
    methods=["POST"]
)
@jwt_required()
def upload_product_images(product_id):
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    product = Product.query.get_or_404(product_id)

    files = request.files.getlist("images")

    if not files:
        return {"error": "No images provided"}, 400

    uploaded = []
    start_position = len(product.images)
    has_primary = any(img.is_primary for img in product.images)

    for index, file in enumerate(files):
        result = upload(
            file,
            folder="smartnest/products",
            resource_type="image"
        )

        product_image = ProductImage(
            product_id=product.id,
            image_url=result["secure_url"],
            is_primary=(not has_primary and index == 0),
            position=start_position + index
        )

        db.session.add(product_image)
        uploaded.append(product_image)

    db.session.commit()

    return jsonify([
        {
            "id": img.id,
            "image_url": img.image_url,
            "is_primary": img.is_primary,
            "position": img.position
        }
        for img in uploaded
    ]), 201

@product_image_bp.route("/images/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_product_image(image_id):
    auth_error = _require_admin()
    if auth_error:
        return auth_error
    image = ProductImage.query.get_or_404(image_id)

    # Optional: delete from Cloudinary here
    db.session.delete(image)
    db.session.commit()

    return {"message": "Image deleted"}, 200
    
