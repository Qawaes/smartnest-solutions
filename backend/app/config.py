import os
from datetime import timedelta

class Config:
    """Flask configuration variables."""
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///smartnest.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # SMTP Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_EMAIL = os.getenv('SMTP_EMAIL')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    
    # App Configuration
    APP_URL = os.getenv('APP_URL', 'http://localhost:3000')
    
    # Cloudinary (if you're using it)
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

    # WhatsApp Cloud API
    WHATSAPP_CLOUD_API_TOKEN = os.getenv('WHATSAPP_CLOUD_API_TOKEN')
    WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
    WHATSAPP_OWNER_NUMBER = os.getenv('WHATSAPP_OWNER_NUMBER', '+254728840848')
    
    # M-Pesa (if you're using it)
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL')
