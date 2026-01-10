from app.extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    is_branding = db.Column(db.Boolean, default=False)

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

    def to_dict(self):
     return {
        "id": self.id,
        "name": self.name,
        "description": self.description,
        "price": float(self.price),
        "is_branding": self.is_branding,

       
        "category": {
            "id": self.category.id,
            "name": self.category.name,
            "slug": self.category.slug,
        } if self.category else None,

        "images": [img.to_dict() for img in self.images],
    }

            
