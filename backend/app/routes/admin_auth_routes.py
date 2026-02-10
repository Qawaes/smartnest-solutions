from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from app.models.admin import AdminUser
from app.extensions import db, limiter
from datetime import datetime, timedelta
import os
import resend
import logging
import secrets
import hmac

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/api/admin/auth")

# OTP settings
OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 10
MAX_OTP_ATTEMPTS = 5


# -------------------------
# Helpers
# -------------------------

def generate_otp():
    return "".join(str(secrets.randbelow(10)) for _ in range(OTP_LENGTH))

def send_email_resend(to_email, subject, html_body):
    """
    Send email using Resend official Python SDK
    https://resend.com/docs/send-with-python
    """

    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    if not api_key:
        logger.error("RESEND_API_KEY not configured")
        raise RuntimeError("Email service not configured")

    # Configure Resend
    resend.api_key = api_key

    logger.info(f"Sending email via Resend SDK to: {to_email}")

    try:
        response = resend.Emails.send({
            "from": from_email,
            "to": to_email,
            "subject": subject,
            "html": html_body,
        })

        logger.info(f"Email sent successfully via Resend: {response}")
        return response

    except Exception as e:
        logger.error(f"Resend SDK error: {e}", exc_info=True)
        raise RuntimeError(f"Failed to send email: {str(e)}")

# -------------------------
# Routes
# -------------------------

@admin_auth_bp.route("/request-otp", methods=["POST"])
@limiter.limit("5 per minute")
def request_otp():
    """Request OTP - POST endpoint"""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
        if not admin_email:
            logger.error("ADMIN_EMAIL environment variable not set")
            return jsonify({"error": "Admin system not configured"}), 500

        logger.info(f"OTP request for: {email}")

        if email != admin_email:
            logger.warning(f"Access denied for email: {email}")
            return jsonify({"error": "Access denied"}), 403

        # Get or create admin user
        admin = AdminUser.query.filter_by(email=admin_email).first()
        if not admin:
            logger.info(f"Creating new admin user: {admin_email}")
            admin = AdminUser(email=admin_email)
            db.session.add(admin)
            db.session.commit()

        # Defensive normalization
        if admin.otp_attempts is None:
            admin.otp_attempts = 0

        # Throttle OTP requests
        if (
            admin.otp_attempts >= MAX_OTP_ATTEMPTS
            and admin.otp_expires
            and admin.otp_expires > datetime.utcnow()
        ):
            minutes_left = int(
                (admin.otp_expires - datetime.utcnow()).total_seconds() / 60
            ) + 1
            logger.warning(f"Too many OTP attempts for {email}")
            return jsonify({
                "error": f"Too many attempts. Try again in {minutes_left} minutes"
            }), 429

        # Generate new OTP
        otp = generate_otp()
        # Do not log OTP values

        admin.otp_code = otp
        admin.otp_expires = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        admin.otp_attempts = 0
        db.session.commit()

        email_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Admin Login Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP code for admin login is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 8px; margin: 0;">{otp}</h1>
                    </div>
                    <p>This code will expire in {OTP_EXPIRY_MINUTES} minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </body>
        </html>
        """

        try:
            send_email_resend(admin_email, "Admin Login OTP", email_body)
            logger.info(f"OTP email sent successfully to {admin_email}")
            return jsonify({"message": "OTP sent successfully"}), 200
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return jsonify({"error": f"Failed to send OTP email: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Unexpected error in request_otp: {e}", exc_info=True)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@admin_auth_bp.route("/verify-otp", methods=["POST"])
@limiter.limit("10 per minute")
def verify_otp():
    """Verify OTP and login"""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        otp = data.get("otp", "").strip()

        if not email or not otp:
            return jsonify({"error": "Email and OTP required"}), 400

        admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
        if email != admin_email:
            return jsonify({"error": "Access denied"}), 403

        admin = AdminUser.query.filter_by(email=admin_email).first()
        if not admin or not admin.otp_code:
            return jsonify({"error": "No OTP requested"}), 400

        # Check if OTP expired
        if admin.otp_expires < datetime.utcnow():
            admin.otp_code = None
            admin.otp_expires = None
            admin.otp_attempts = 0
            db.session.commit()
            return jsonify({"error": "OTP expired"}), 400

        # Check max attempts
        if admin.otp_attempts >= MAX_OTP_ATTEMPTS:
            return jsonify({"error": "Too many attempts"}), 429

        # Verify OTP
        if not hmac.compare_digest(str(admin.otp_code), str(otp)):
            admin.otp_attempts += 1
            db.session.commit()
            remaining = MAX_OTP_ATTEMPTS - admin.otp_attempts
            return jsonify({
                "error": f"Invalid OTP. {remaining} attempt{'s' if remaining != 1 else ''} remaining"
            }), 401

        # Successful login
        admin.otp_code = None
        admin.otp_expires = None
        admin.otp_attempts = 0
        admin.last_login = datetime.utcnow()
        db.session.commit()

        token = create_access_token(
            identity=str(admin.id),
            additional_claims={
                "email": admin.email,
                "role": "admin"
            },
            expires_delta=timedelta(hours=8)
        )

        logger.info(f"Admin {email} logged in successfully")

        return jsonify({
            "access_token": token,
            "admin": {
                "id": admin.id,
                "email": admin.email
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in verify_otp: {e}", exc_info=True)
        return jsonify({"error": "An error occurred during verification"}), 500


@admin_auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify_token():
    """Verify JWT token"""
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"error": "Unauthorized"}), 403

        admin = AdminUser.query.get(identity)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        return jsonify({
            "valid": True,
            "admin": {
                "id": admin.id,
                "email": claims.get("email") or admin.email,
                "last_login": admin.last_login.isoformat() if admin.last_login else None
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in verify_token: {e}", exc_info=True)
        return jsonify({"error": "Token verification failed"}), 401


@admin_auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logout endpoint"""
    return jsonify({"message": "Logged out successfully"}), 200
