from datetime import datetime
from app.extensions import db 

class ProductImage(db.Model):  # ← Changed from "Product" to "ProductImage"
    __tablename__ = "product_images"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    position = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', back_populates='images')
    
    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "is_primary": self.is_primary,
            "position": self.position
        }