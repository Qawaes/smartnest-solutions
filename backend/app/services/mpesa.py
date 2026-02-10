import requests
import base64
from datetime import datetime
import os
from dotenv import load_dotenv

# Load .env from parent directory if needed
import sys
from pathlib import Path
env_path = Path(__file__).parent.parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

class MpesaConfig:
    ENVIRONMENT = os.getenv("MPESA_ENVIRONMENT", "sandbox")
    CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
    CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
    SHORTCODE = os.getenv("MPESA_SHORTCODE")
    PASSKEY = os.getenv("MPESA_PASSKEY")
    CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")
    
    @classmethod
    def get_base_url(cls):
        if cls.ENVIRONMENT == "sandbox":
            return "https://sandbox.safaricom.co.ke"
        return "https://api.safaricom.co.ke"


def get_access_token():
    """Get OAuth access token from Safaricom"""
    url = f"{MpesaConfig.get_base_url()}/oauth/v1/generate?grant_type=client_credentials"
    
    # Create basic auth header
    auth_string = f"{MpesaConfig.CONSUMER_KEY}:{MpesaConfig.CONSUMER_SECRET}"
    auth_bytes = auth_string.encode('ascii')
    auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
    
    headers = {
        "Authorization": f"Basic {auth_base64}"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        print(f"Error getting access token: {str(e)}")
        raise


def generate_password():
    """Generate the password for STK push"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    data_to_encode = f"{MpesaConfig.SHORTCODE}{MpesaConfig.PASSKEY}{timestamp}"
    encoded = base64.b64encode(data_to_encode.encode()).decode('utf-8')
    return encoded, timestamp


def stk_push(phone, amount, order_id):
    """
    Initiate STK Push to customer's phone
    
    Args:
        phone: Customer phone number (format: 254XXXXXXXXX)
        amount: Amount to charge
        order_id: Your order ID for reference
    
    Returns:
        dict: Response from M-Pesa API
    """
    # Format phone number
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]
    elif not phone.startswith("254"):
        phone = "254" + phone
    
    # Get access token
    access_token = get_access_token()
    
    # Generate password and timestamp
    password, timestamp = generate_password()
    
    # STK Push endpoint
    url = f"{MpesaConfig.get_base_url()}/mpesa/stkpush/v1/processrequest"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "BusinessShortCode": MpesaConfig.SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": MpesaConfig.SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": MpesaConfig.CALLBACK_URL,
        "AccountReference": f"ORDER-{order_id}",
        "TransactionDesc": f"Payment for Order #{order_id}"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        result = response.json()
        
        # M-Pesa returns ResponseCode "0" for success
        response_code = result.get("ResponseCode")
        is_success = response_code == "0"
        
        return {
            "success": is_success,
            "response_code": response_code,
            "checkout_request_id": result.get("CheckoutRequestID"),
            "merchant_request_id": result.get("MerchantRequestID"),
            "response_description": result.get("ResponseDescription"),
            "customer_message": result.get("CustomerMessage"),
            "error": None if is_success else result.get("ResponseDescription")
        }
    
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                error_msg = error_detail.get("errorMessage", error_msg)
            except:
                error_msg = e.response.text
        
        print(f"STK Push Error: {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "response_code": None
        }


def query_stk_status(checkout_request_id):
    """
    Query the status of an STK push transaction
    
    Args:
        checkout_request_id: The CheckoutRequestID from STK push
    
    Returns:
        dict: Transaction status
    """
    access_token = get_access_token()
    password, timestamp = generate_password()
    
    url = f"{MpesaConfig.get_base_url()}/mpesa/stkpushquery/v1/query"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "BusinessShortCode": MpesaConfig.SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}
