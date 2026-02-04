from datetime import datetime
from app.extensions import db


class ProductRating(db.Model):
    __tablename__ = "product_ratings"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "rating": self.rating,
            "created_at": self.created_at.isoformat()
        }
