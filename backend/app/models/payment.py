from app.extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = "payments"
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign key to order
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    
    # Payment method (mpesa, cod, card, etc.)
    method = db.Column(db.String(50), nullable=False)  # "mpesa", "cod"
    
    # Payment status
    status = db.Column(db.String(30), default="PENDING", nullable=False)  # PENDING, PAID, FAILED, CANCELLED
    
    # M-Pesa specific fields
    mpesa_checkout_id = db.Column(db.String(100), nullable=True)
    mpesa_receipt = db.Column(db.String(50), nullable=True)
    
    # Payment timestamps
    paid_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Relationship back to order
    order = db.relationship(
        "Order",
        back_populates="payment",
        uselist=False
    )
    
    def mark_as_paid(self, mpesa_receipt=None):
        """Mark payment as successful"""
        self.status = "PAID"
        self.paid_at = datetime.utcnow()
        if mpesa_receipt:
            self.mpesa_receipt = mpesa_receipt
    
    def mark_as_failed(self):
        """Mark payment as failed"""
        self.status = "FAILED"
    
    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "method": self.method,
            "status": self.status,
            "mpesa_receipt": self.mpesa_receipt,
            "mpesa_checkout_id": self.mpesa_checkout_id,
            "paid_at": self.paid_at.isoformat() if self.paid_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f"<Payment {self.id} - Order {self.order_id} - {self.method}>"
