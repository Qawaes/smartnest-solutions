from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"
     
    id = db.Column(db.Integer, primary_key=True)

    # Customer Information
    customer_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    address = db.Column(db.Text, nullable=False)

    # Order Details
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(30), default="pending", nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Relationships
    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"
    )

    branding = db.relationship(
        "BrandingDetail",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan"
    )

    payment = db.relationship(
        "Payment",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # ---------- Methods ----------
    def to_dict(self):
        return {
            "id": self.id,
            "customer": {
                "name": self.customer_name,
                "phone": self.phone,
                "email": self.email,
                "address": self.address,
            },
            "items": [item.to_dict() for item in self.items],
            "total": float(self.total),
            "status": self.status,
            "payment": self.payment.to_dict() if self.payment else None,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Order {self.id} - {self.customer_name}>"