from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"
     
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.String(255))

    total = db.Column(db.Numeric(10, 2))
    payment_method = db.Column(db.String(50))
    status = db.Column(db.String(30), default="pending")

    mpesa_receipt = db.Column(db.String(50), nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    
    
    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    branding = db.relationship(
        "BrandingDetail",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan"
    )

