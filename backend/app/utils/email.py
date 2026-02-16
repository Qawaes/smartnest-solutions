import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app


def send_email_smtp(to_email, subject, html_body, reply_to=None):
    smtp_server = current_app.config.get("SMTP_SERVER")
    smtp_port = current_app.config.get("SMTP_PORT")
    smtp_email = current_app.config.get("SMTP_EMAIL")
    smtp_password = current_app.config.get("SMTP_PASSWORD")
    smtp_timeout = current_app.config.get("SMTP_TIMEOUT_SECONDS", 10)

    if not smtp_server or not smtp_port:
        raise RuntimeError("SMTP server not configured")
    if not smtp_email or not smtp_password:
        raise RuntimeError("SMTP credentials not configured")
    if not to_email:
        raise RuntimeError("Recipient email not provided")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_email
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(smtp_server, smtp_port, timeout=smtp_timeout) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, [to_email], msg.as_string())


def _items_html(items):
    return "".join([
        f"<tr><td style='padding:6px 0'>{i.name}</td>"
        f"<td style='padding:6px 0;text-align:center'>{i.qty}</td>"
        f"<td style='padding:6px 0;text-align:right'>KES {float(i.price):,.2f}</td></tr>"
        for i in items
    ])


def build_order_confirmation_html(order):
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111">
      <div style="padding:24px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 12px">Order Confirmation</h2>
        <p style="margin:0 0 12px">Hi {order.customer_name},</p>
        <p style="margin:0 0 16px">Thanks for your order! We received it and will process it shortly.</p>

        <div style="background:#f9fafb;padding:12px;border-radius:8px;margin-bottom:16px">
          <strong>Order ID:</strong> {order.id}<br/>
          <strong>Status:</strong> {order.status}
        </div>

        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;border-bottom:1px solid #eee;padding-bottom:6px">Item</th>
              <th style="text-align:center;border-bottom:1px solid #eee;padding-bottom:6px">Qty</th>
              <th style="text-align:right;border-bottom:1px solid #eee;padding-bottom:6px">Price</th>
            </tr>
          </thead>
          <tbody>
            {_items_html(order.items)}
          </tbody>
        </table>

        <div style="margin-top:16px;text-align:right;font-size:16px">
          <strong>Total:</strong> KES {float(order.total):,.2f}
        </div>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:12px">
        This is an automated email. Please do not reply.
      </p>
    </div>
    """


def build_payment_confirmation_html(order, payment):
    receipt = payment.mpesa_receipt or "N/A"
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111">
      <div style="padding:24px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 12px">Payment Confirmed</h2>
        <p style="margin:0 0 12px">Hi {order.customer_name},</p>
        <p style="margin:0 0 16px">We’ve received your payment. Your order is confirmed.</p>

        <div style="background:#f9fafb;padding:12px;border-radius:8px;margin-bottom:16px">
          <strong>Order ID:</strong> {order.id}<br/>
          <strong>Payment Method:</strong> {payment.method}<br/>
          <strong>Receipt:</strong> {receipt}
        </div>

        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;border-bottom:1px solid #eee;padding-bottom:6px">Item</th>
              <th style="text-align:center;border-bottom:1px solid #eee;padding-bottom:6px">Qty</th>
              <th style="text-align:right;border-bottom:1px solid #eee;padding-bottom:6px">Price</th>
            </tr>
          </thead>
          <tbody>
            {_items_html(order.items)}
          </tbody>
        </table>

        <div style="margin-top:16px;text-align:right;font-size:16px">
          <strong>Total:</strong> KES {float(order.total):,.2f}
        </div>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:12px">
        This is an automated email. Please do not reply.
      </p>
    </div>
    """
