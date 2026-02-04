from app.extensions import db
from decimal import Decimal
from datetime import datetime

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    is_branding = db.Column(db.Boolean, default=False)
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    discount_percent = db.Column(db.Integer, default=0, nullable=False)
    flash_sale_start = db.Column(db.DateTime, nullable=True)
    flash_sale_end = db.Column(db.DateTime, nullable=True)
    flash_sale_percent = db.Column(db.Integer, default=0, nullable=False)
    rating_sum = db.Column(db.Integer, default=0, nullable=False)
    rating_count = db.Column(db.Integer, default=0, nullable=False)

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    category = db.relationship(
        "Category",
        back_populates="products"
    )

    images = db.relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    def is_flash_sale_active(self):
        if not self.flash_sale_start or not self.flash_sale_end:
            return False
        now = datetime.now()
        return self.flash_sale_start <= now <= self.flash_sale_end

    def get_discounted_price(self):
        """Return discounted price as Decimal (non-flash)."""
        price = self.price or Decimal("0")
        if self.discount_percent and self.discount_percent > 0:
            discount = Decimal(self.discount_percent) / Decimal(100)
            return price * (Decimal("1") - discount)
        return price

    def get_effective_price(self):
        """Return price after applying flash sale (if active) else discount."""
        price = self.price or Decimal("0")
        if self.is_flash_sale_active() and self.flash_sale_percent and self.flash_sale_percent > 0:
            discount = Decimal(self.flash_sale_percent) / Decimal(100)
            return price * (Decimal("1") - discount)
        return self.get_discounted_price()

    def to_dict(self):
        discounted_price = self.get_discounted_price()
        effective_price = self.get_effective_price()
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "is_branding": self.is_branding,
            "stock_quantity": self.stock_quantity,
            "discount_percent": self.discount_percent,
            "discounted_price": float(discounted_price) if self.discount_percent else None,
            "effective_price": float(effective_price),
            "flash_sale_active": self.is_flash_sale_active(),
            "flash_sale_percent": self.flash_sale_percent,
            "flash_sale_start": self.flash_sale_start.isoformat() if self.flash_sale_start else None,
            "flash_sale_end": self.flash_sale_end.isoformat() if self.flash_sale_end else None,
            "rating_avg": round(self.rating_sum / self.rating_count, 2) if self.rating_count > 0 else 0,
            "rating_count": self.rating_count,
            "in_stock": self.stock_quantity > 0,
            "category": {
                "id": self.category.id,
                "name": self.category.name,
                "slug": self.category.slug,
            } if self.category else None,
            "images": [img.to_dict() for img in self.images],
        }

            
