from flask import Blueprint, request, jsonify
from app.models.admin import AdminUser
from app.extensions import db
from datetime import datetime, timedelta
import secrets
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

admin_auth_bp = Blueprint("admin_auth", __name__)


def send_email(to_email, subject, body):
    try:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        smtp_email = os.getenv("SMTP_EMAIL")
        smtp_password = os.getenv("SMTP_PASSWORD")

        if not smtp_email or not smtp_password:
            return False

        msg = MIMEMultipart()
        msg["From"] = smtp_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


@admin_auth_bp.route("/register", methods=["POST"])
def admin_register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    existing = AdminUser.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Admin user already exists"}), 409

    verification_token = secrets.token_urlsafe(32)
    verification_expires = datetime.utcnow() + timedelta(hours=24)

    admin = AdminUser(
        email=email,
        full_name=full_name,
        verification_token=verification_token,
        verification_token_expires=verification_expires,
        is_verified=False,
    )
    admin.set_password(password)

    db.session.add(admin)
    db.session.commit()

    # send verification email if configured
    app_url = os.getenv("APP_URL", "http://localhost:3000")
    verification_link = f"{app_url}/admin/verify-email?token={verification_token}"
    body = f"<p>Please verify: <a href=\"{verification_link}\">Verify</a></p>"
    send_email(email, "Verify Admin Account", body)

    return jsonify({"message": "Registration successful. Check email to verify."}), 201


@admin_auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.get_json() or {}
    token = data.get("token")
    if not token:
        return jsonify({"error": "Token required"}), 400

    admin = AdminUser.query.filter_by(verification_token=token).first()
    if not admin:
        return jsonify({"error": "Invalid token"}), 400

    if admin.verification_token_expires and admin.verification_token_expires < datetime.utcnow():
        return jsonify({"error": "Token expired"}), 400

    admin.is_verified = True
    admin.verification_token = None
    admin.verification_token_expires = None
    db.session.commit()

    return jsonify({"message": "Email verified"}), 200


@admin_auth_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not admin.is_verified:
        return jsonify({"error": "Please verify your email before logging in"}), 403

    # Return a simple session token placeholder (replace with JWT when needed)
    token = secrets.token_urlsafe(24)
    admin.last_login = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Login successful", "access_token": token}), 200


@admin_auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin:
        return jsonify({"message": "If an account exists, an email was sent."}), 200

    reset_token = secrets.token_urlsafe(32)
    reset_expires = datetime.utcnow() + timedelta(hours=1)
    admin.reset_token = reset_token
    admin.reset_token_expires = reset_expires
    db.session.commit()

    app_url = os.getenv("APP_URL", "http://localhost:3000")
    reset_link = f"{app_url}/admin/reset-password?token={reset_token}"
    body = f"<p>Reset password: <a href=\"{reset_link}\">Reset</a></p>"
    send_email(email, "Password Reset", body)

    return jsonify({"message": "If an account exists, an email was sent."}), 200


@admin_auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    new_password = data.get("password")
    if not token or not new_password:
        return jsonify({"error": "Token and password required"}), 400

    admin = AdminUser.query.filter_by(reset_token=token).first()
    if not admin:
        return jsonify({"error": "Invalid token"}), 400

    if admin.reset_token_expires and admin.reset_token_expires < datetime.utcnow():
        return jsonify({"error": "Token expired"}), 400

    admin.set_password(new_password)
    admin.reset_token = None
    admin.reset_token_expires = None
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.admin import AdminUser
from app.extensions import db
from datetime import datetime, timedelta
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

admin_auth_bp = Blueprint("admin_auth", __name__)


def send_email(to_email, subject, body):
    """Send email using SMTP"""
    try:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        smtp_email = os.getenv("SMTP_EMAIL")
        smtp_password = os.getenv("SMTP_PASSWORD")

        if not smtp_email or not smtp_password:
            raise Exception("Email credentials not configured")

        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)
        server.quit()

        return True
    except Exception as e:
        print(f"Email error: {str(e)}")
        return False


@admin_auth_bp.route("/register", methods=["POST"])
def admin_register():
    """Register a new admin user"""
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        # Check if admin already exists
        existing_admin = AdminUser.query.filter_by(email=email).first()
        if existing_admin:
            return jsonify({"error": "Admin user already exists"}), 409

        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        verification_expires = datetime.utcnow() + timedelta(hours=24)

        # Create new admin
        admin = AdminUser(
            email=email,
            full_name=full_name,
            verification_token=verification_token,
            verification_token_expires=verification_expires,
            is_verified=False
        )
        admin.set_password(password)

        db.session.add(admin)
        db.session.commit()

        # Send verification email
        app_url = os.getenv("APP_URL", "http://localhost:3000")
        verification_link = f"{app_url}/admin/verify-email?token={verification_token}"
        
        email_body = f"""
        <html>
            <body>
                <h2>Welcome to Admin Panel!</h2>
                <p>Hi {full_name or 'Admin'},</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="{verification_link}">Verify Email</a></p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create this account, please ignore this email.</p>
            </body>
        </html>
        """

        send_email(email, "Verify Your Admin Account", email_body)

        return jsonify({
            "message": "Registration successful. Please check your email to verify your account.",
            "admin": {
                "id": admin.id,
                "email": admin.email,
                "full_name": admin.full_name
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    """Verify admin email with token"""
    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify({"error": "Verification token required"}), 400

        admin = AdminUser.query.filter_by(verification_token=token).first()

        if not admin:
            return jsonify({"error": "Invalid verification token"}), 400

        if admin.verification_token_expires < datetime.utcnow():
            return jsonify({"error": "Verification token expired"}), 400

        admin.is_verified = True
        admin.verification_token = None
        admin.verification_token_expires = None

        db.session.commit()

        return jsonify({
            "message": "Email verified successfully. You can now login."
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email required"}), 400

        admin = AdminUser.query.filter_by(email=email).first()

        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        if admin.is_verified:
            return jsonify({"error": "Email already verified"}), 400

        # Generate new token
        verification_token = secrets.token_urlsafe(32)
        verification_expires = datetime.utcnow() + timedelta(hours=24)

        admin.verification_token = verification_token
        admin.verification_token_expires = verification_expires

        db.session.commit()

        # Send verification email
        app_url = os.getenv("APP_URL", "http://localhost:3000")
        verification_link = f"{app_url}/admin/verify-email?token={verification_token}"
        
        email_body = f"""
        <html>
            <body>
                <h2>Email Verification</h2>
                <p>Hi {admin.full_name or 'Admin'},</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="{verification_link}">Verify Email</a></p>
                <p>This link will expire in 24 hours.</p>
            </body>
        </html>
        """

        send_email(email, "Verify Your Admin Account", email_body)

        return jsonify({
            "message": "Verification email sent successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/login", methods=["POST"])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        admin = AdminUser.query.filter_by(email=email).first()

        if not admin or not admin.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        if not admin.is_verified:
            return jsonify({"error": "Please verify your email before logging in"}), 403

        token = create_access_token(identity={
            "id": admin.id,
            "email": admin.email,
            "role": "admin"
        })

        # Update last login
        admin.last_login = datetime.utcnow()
        db.session.commit()

        return jsonify({
            "message": "Login successful",
            "access_token": token,
            "admin": {
                "id": admin.id,
                "email": admin.email,
                "full_name": admin.full_name
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email required"}), 400

        admin = AdminUser.query.filter_by(email=email).first()

        if not admin:
            # Don't reveal if email exists
            return jsonify({
                "message": "If an account exists with this email, a password reset link has been sent."
            }), 200

        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_expires = datetime.utcnow() + timedelta(hours=1)

        admin.reset_token = reset_token
        admin.reset_token_expires = reset_expires

        db.session.commit()

        # Send reset email
        app_url = os.getenv("APP_URL", "http://localhost:3000")
        reset_link = f"{app_url}/admin/reset-password?token={reset_token}"
        
        email_body = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Hi {admin.full_name or 'Admin'},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
        </html>
        """

        send_email(email, "Password Reset Request", email_body)

        return jsonify({
            "message": "If an account exists with this email, a password reset link has been sent."
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("password")

        if not token or not new_password:
            return jsonify({"error": "Token and password required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        admin = AdminUser.query.filter_by(reset_token=token).first()

        if not admin:
            return jsonify({"error": "Invalid reset token"}), 400

        if admin.reset_token_expires < datetime.utcnow():
            return jsonify({"error": "Reset token expired"}), 400

        # Update password
        admin.set_password(new_password)
        admin.reset_token = None
        admin.reset_token_expires = None

        db.session.commit()

        return jsonify({
            "message": "Password reset successful. You can now login with your new password."
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify_token():
    """Verify if the current token is valid"""
    try:
        current_user = get_jwt_identity()
        
        if current_user.get("role") != "admin":
            return jsonify({"error": "Unauthorized"}), 403

        return jsonify({
            "valid": True,
            "admin": {
                "id": current_user.get("id"),
                "email": current_user.get("email")
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """Change password for logged-in admin"""
    try:
        current_user = get_jwt_identity()
        
        if current_user.get("role") != "admin":
            return jsonify({"error": "Unauthorized"}), 403

        data = request.get_json()
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if not current_password or not new_password:
            return jsonify({"error": "Current and new password required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        admin = AdminUser.query.get(current_user.get("id"))

        if not admin or not admin.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 401

        admin.set_password(new_password)
        db.session.commit()

        return jsonify({
            "message": "Password changed successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500