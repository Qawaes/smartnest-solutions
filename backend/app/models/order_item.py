from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = "order_item"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),  # ✅ FIXED (was order.id)
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    name = db.Column(db.String(120))
    price = db.Column(db.Numeric(10, 2))
    qty = db.Column(db.Integer, nullable=False)

    order = db.relationship(
        "Order",
        back_populates="items"
    )

 
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.name,
            'price': float(self.price) if self.price is not None else 0.0,
            'qty': self.qty,
            'subtotal': float(self.subtotal) if self.price is not None else 0.0
        }
    
    def __repr__(self):
        return f'<OrderItem {self.id} - {self.name} x{self.qty}>'