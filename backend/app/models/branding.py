from app.extensions import db

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
