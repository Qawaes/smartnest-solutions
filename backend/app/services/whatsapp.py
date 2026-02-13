import os
import requests


def _normalize_msisdn(raw_number: str) -> str:
    if not raw_number:
        return ""
    digits = "".join(ch for ch in raw_number if ch.isdigit())
    if digits.startswith("0"):
        # Default to Kenya-style local number (0XXXXXXXXX -> 254XXXXXXXXX)
        digits = "254" + digits[1:]
    return digits


def _build_order_message(order, items, delivery_fee):
    lines = [
        f"New order #{order.id}",
        f"Customer: {order.customer_name}",
        f"Phone: {order.phone}",
        f"Address: {order.address}",
        f"Total: KES {float(order.total):,.2f}",
        f"Delivery: KES {float(delivery_fee):,.2f}",
        "Items:",
    ]
    for item in items:
        lines.append(f"- {item['qty']} x {item['name']} @ KES {item['price']:,.2f}")
    return "\n".join(lines)


def send_order_whatsapp_notification(order, items, delivery_fee):
    token = os.getenv("WHATSAPP_CLOUD_API_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    owner_number = os.getenv("WHATSAPP_OWNER_NUMBER", "+254728840848")

    if not token or not phone_number_id:
        return

    to_number = _normalize_msisdn(owner_number)
    if not to_number:
        return

    url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
    message = _build_order_message(order, items, delivery_fee)

    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"WhatsApp notification failed: {str(e)}")
