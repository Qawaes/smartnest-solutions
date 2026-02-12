from flask import Blueprint, jsonify, request, current_app
from app.extensions import limiter
from app.utils.email import send_email_smtp
import html

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("", methods=["POST"])
@limiter.limit("5 per minute")
def send_contact_message():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    subject = (data.get("subject") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not phone or not subject or not message:
        return jsonify({"error": "All fields are required"}), 400

    to_email = current_app.config.get("CONTACT_EMAIL") or current_app.config.get("SMTP_EMAIL")
    if not to_email:
        return jsonify({"error": "Email service not configured"}), 500

    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_phone = html.escape(phone)
    safe_subject = html.escape(subject)
    safe_message = html.escape(message)

    email_subject = f"Contact Form: {safe_subject} - {safe_name}"
    html_body = f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111">
      <div style="padding:24px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 12px">New Contact Message</h2>
        <p style="margin:0 0 8px"><strong>Name:</strong> {safe_name}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> {safe_email}</p>
        <p style="margin:0 0 16px"><strong>Phone:</strong> {safe_phone}</p>
        <p style="margin:0 0 8px"><strong>Subject:</strong> {safe_subject}</p>
        <div style="margin-top:12px;padding:12px;background:#f9fafb;border-radius:8px;white-space:pre-wrap">
          {safe_message}
        </div>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:12px">
        This message was submitted from the contact form.
      </p>
    </div>
    """

    try:
        send_email_smtp(to_email, email_subject, html_body, reply_to=email)
    except Exception as e:
        return jsonify({"error": f"Failed to send message: {str(e)}"}), 500

    return jsonify({"message": "Message sent successfully"}), 200
