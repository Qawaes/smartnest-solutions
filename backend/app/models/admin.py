from app.extensions import db
from datetime import datetime


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    # OTP fields
    otp_code = db.Column(db.String(6), nullable=True)
    otp_expires = db.Column(db.DateTime, nullable=True)
    otp_attempts = db.Column(db.Integer, default=0, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<AdminUser {self.email}>"
