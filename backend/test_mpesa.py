#!/usr/bin/env python3
"""Test M-Pesa STK Push configuration"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from app.services.mpesa import MpesaConfig, get_access_token, stk_push

def test_credentials():
    """Test M-Pesa credentials"""
    print("=" * 60)
    print("TESTING M-PESA CREDENTIALS")
    print("=" * 60)
    
    print(f"\n✓ Environment: {MpesaConfig.ENVIRONMENT}")
    print(f"✓ Shortcode: {MpesaConfig.SHORTCODE}")
    print(f"✓ Base URL: {MpesaConfig.get_base_url()}")
    print(f"✓ Callback URL: {MpesaConfig.CALLBACK_URL}")
    
    # Check credentials are set
    if not MpesaConfig.CONSUMER_KEY:
        print("\n✗ ERROR: MPESA_CONSUMER_KEY not set in .env")
        return False
    if not MpesaConfig.CONSUMER_SECRET:
        print("\n✗ ERROR: MPESA_CONSUMER_SECRET not set in .env")
        return False
    if not MpesaConfig.SHORTCODE:
        print("\n✗ ERROR: MPESA_SHORTCODE not set in .env")
        return False
    if not MpesaConfig.PASSKEY:
        print("\n✗ ERROR: MPESA_PASSKEY not set in .env")
        return False
    
    print("\n✓ All credentials are set")
    return True

def test_access_token():
    """Test getting M-Pesa access token"""
    print("\n" + "=" * 60)
    print("TESTING ACCESS TOKEN")
    print("=" * 60)
    
    try:
        token = get_access_token()
        if token:
            print(f"✓ Successfully obtained access token")
            print(f"  Token (first 50 chars): {token[:50]}...")
            return True
        else:
            print("✗ Failed to get access token")
            return False
    except Exception as e:
        print(f"✗ Error getting access token: {str(e)}")
        return False

def test_stk_push():
    """Test STK push"""
    print("\n" + "=" * 60)
    print("TESTING STK PUSH")
    print("=" * 60)
    
    # Test data - update these with real values
    phone = input("\nEnter test phone number (254712345678): ").strip() or "254712345678"
    amount = input("Enter test amount (e.g. 1): ").strip() or "1"
    order_id = "TEST-001"
    
    try:
        amount = int(amount)
        result = stk_push(phone=phone, amount=amount, order_id=order_id)
        
        print(f"\n✓ STK Push Response:")
        for key, value in result.items():
            if key == "error" and value:
                print(f"  ✗ {key}: {value}")
            else:
                print(f"  ✓ {key}: {value}")
        
        if result.get("success"):
            print("\n✓ STK Push initiated successfully!")
            return True
        else:
            print("\n✗ STK Push failed")
            return False
    
    except Exception as e:
        print(f"✗ Error during STK push: {str(e)}")
        return False

if __name__ == "__main__":
    success = True
    
    if not test_credentials():
        success = False
    
    if not test_access_token():
        success = False
    
    if success:
        test_stk_push()
    else:
        print("\n✗ Cannot test STK push due to credential errors")
        sys.exit(1)
