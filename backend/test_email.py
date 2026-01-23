"""
Email Testing Script
Run this to test your SMTP configuration
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def test_email_connection():
    """Test SMTP connection and send a test email"""
    
    # Load credentials
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    print("=" * 50)
    print("EMAIL CONFIGURATION TEST")
    print("=" * 50)
    
    # Check if credentials are set
    print(f"\n1. Checking environment variables...")
    print(f"   SMTP_SERVER: {smtp_server}")
    print(f"   SMTP_PORT: {smtp_port}")
    print(f"   SMTP_EMAIL: {smtp_email if smtp_email else '❌ NOT SET'}")
    print(f"   SMTP_PASSWORD: {'✅ SET' if smtp_password else '❌ NOT SET'}")
    
    if not smtp_email or not smtp_password:
        print("\n❌ ERROR: SMTP_EMAIL or SMTP_PASSWORD not set in .env file")
        print("\nPlease add these to your .env file:")
        print("SMTP_EMAIL=your-email@gmail.com")
        print("SMTP_PASSWORD=your-app-password")
        return False
    
    # Test connection
    print(f"\n2. Testing connection to {smtp_server}:{smtp_port}...")
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.set_debuglevel(1)  # Show detailed logs
        print("   ✅ Connection established")
        
        print("\n3. Starting TLS...")
        server.starttls()
        print("   ✅ TLS started")
        
        print("\n4. Attempting login...")
        server.login(smtp_email, smtp_password)
        print("   ✅ Login successful")
        
        # Send test email
        print("\n5. Sending test email...")
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = 'ianderrick341@gmail.com'  # Send to yourself
        msg['Subject'] = "SmartNest - SMTP Test Email"
        
        body = """
        <html>
            <body>
                <h2>✅ SMTP Configuration Working!</h2>
                <p>If you're reading this, your email configuration is correct.</p>
                <p>Your SmartNest admin authentication emails should work now.</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        server.send_message(msg)
        print(f"   ✅ Test email sent to {smtp_email}")
        
        server.quit()
        
        print("\n" + "=" * 50)
        print("✅ ALL TESTS PASSED!")
        print("=" * 50)
        print(f"\nCheck your inbox at {smtp_email}")
        print("If you don't see it, check your spam/junk folder.")
        
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n❌ Authentication Error: {e}")
        print("\nCommon causes:")
        print("1. Wrong password (use App Password for Gmail, not regular password)")
        print("2. 2-Step Verification not enabled (required for Gmail)")
        print("3. 'Less secure app access' disabled")
        print("\nFor Gmail:")
        print("- Enable 2-Step Verification: https://myaccount.google.com/security")
        print("- Generate App Password: https://myaccount.google.com/apppasswords")
        return False
        
    except smtplib.SMTPException as e:
        print(f"\n❌ SMTP Error: {e}")
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_gmail_setup_instructions():
    """Show instructions for setting up Gmail"""
    print("\n" + "=" * 50)
    print("GMAIL APP PASSWORD SETUP INSTRUCTIONS")
    print("=" * 50)
    print("\n1. Go to: https://myaccount.google.com/")
    print("2. Click 'Security' on the left")
    print("3. Under 'Signing in to Google', enable '2-Step Verification'")
    print("4. After enabling, go back to Security")
    print("5. Under 'Signing in to Google', click 'App passwords'")
    print("6. Select 'Mail' and 'Other (Custom name)'")
    print("7. Name it 'SmartNest' and click 'Generate'")
    print("8. Copy the 16-character password (no spaces)")
    print("9. Add to your .env file:")
    print("   SMTP_EMAIL=your-email@gmail.com")
    print("   SMTP_PASSWORD=the-16-character-password")
    print("\n" + "=" * 50)


if __name__ == "__main__":
    success = test_email_connection()
    
    if not success:
        print("\n")
        show_gmail_setup_instructions()
        print("\nAfter setup, run this script again to test.")
    else:
        print("\n🎉 Your email is configured correctly!")
        print("Admin registration emails should work now.")