import base64
import requests
from datetime import datetime
from flask import current_app

def get_access_token():
    consumer_key = current_app.config["MPESA_CONSUMER_KEY"]
    consumer_secret = current_app.config["MPESA_CONSUMER_SECRET"]

    auth = base64.b64encode(
        f"{consumer_key}:{consumer_secret}".encode()
    ).decode()

    res = requests.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {auth}"}
    )

    return res.json()["access_token"]


def stk_push(phone, amount, order_id):
    token = get_access_token()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    shortcode = current_app.config["MPESA_SHORTCODE"]
    passkey = current_app.config["MPESA_PASSKEY"]
    callback = current_app.config["MPESA_CALLBACK_URL"]

    password = base64.b64encode(
        f"{shortcode}{passkey}{timestamp}".encode()
    ).decode()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": callback,
        "AccountReference": f"ORDER-{order_id}",
        "TransactionDesc": "SmartNest Order Payment"
    }

    res = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    return res.json()
