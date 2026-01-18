from app.extensions import db
from datetime import datetime

class BrandingDetail(db.Model):
    __tablename__ = "branding_detail"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),   # ✅ MUST be orders.id
        nullable=False
    )

    logo = db.Column(db.String(255))
    colors = db.Column(db.String(255))
    notes = db.Column(db.Text)
    deadline = db.Column(db.Date)

    order = db.relationship(
        "Order",
        back_populates="branding"
    )

    def to_dict(self):
            """Convert to dictionary"""
            return {
                'id': self.id,
                'logo': self.logo,
                'colors': self.colors,
                'notes': self.notes,
                'deadline': self.deadline.isoformat() if self.deadline else None,
            }
        
    def __repr__(self):
            return f'<BrandingDetail {self.id} for Order {self.order_id}>'