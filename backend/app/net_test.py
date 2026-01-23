#!/usr/bin/env python3
"""
Network diagnostic script to test Gmail SMTP connectivity
Run this to diagnose the "Network unreachable" error
"""

import socket
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_dns_resolution():
    """Test if we can resolve Gmail's SMTP server"""
    print("=" * 60)
    print("TEST 1: DNS Resolution")
    print("=" * 60)
    try:
        ip = socket.gethostbyname("smtp.gmail.com")
        print(f"✓ DNS Resolution SUCCESS")
        print(f"  smtp.gmail.com resolves to: {ip}")
        return True
    except socket.gaierror as e:
        print(f"✗ DNS Resolution FAILED: {e}")
        return False

def test_port_connectivity(port=587):
    """Test if we can connect to Gmail SMTP port"""
    print("\n" + "=" * 60)
    print(f"TEST 2: Port {port} Connectivity")
    print("=" * 60)
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)
        result = sock.connect_ex(("smtp.gmail.com", port))
        sock.close()
        
        if result == 0:
            print(f"✓ Port {port} is REACHABLE")
            return True
        else:
            print(f"✗ Port {port} is BLOCKED (error code: {result})")
            return False
    except Exception as e:
        print(f"✗ Port {port} connectivity FAILED: {e}")
        return False

def test_smtp_connection(port=587, use_ssl=False):
    """Test actual SMTP connection"""
    print("\n" + "=" * 60)
    print(f"TEST 3: SMTP Connection (Port {port}, SSL: {use_ssl})")
    print("=" * 60)
    try:
        if use_ssl:
            server = smtplib.SMTP_SSL("smtp.gmail.com", port, timeout=10)
            print("✓ SSL connection established")
        else:
            server = smtplib.SMTP("smtp.gmail.com", port, timeout=10)
            print("✓ SMTP connection established")
            server.starttls()
            print("✓ TLS upgrade successful")
        
        server.quit()
        print("✓ SMTP handshake SUCCESSFUL")
        return True
    except Exception as e:
        print(f"✗ SMTP connection FAILED: {e}")
        return False

def test_authentication():
    """Test SMTP authentication with credentials"""
    print("\n" + "=" * 60)
    print("TEST 4: SMTP Authentication")
    print("=" * 60)
    
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    if not smtp_email or not smtp_password:
        print("✗ SMTP credentials not configured in environment")
        print("  Set SMTP_EMAIL and SMTP_PASSWORD in your .env file")
        return False
    
    print(f"Email: {smtp_email}")
    print(f"Password: {'*' * len(smtp_password)} (hidden)")
    
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.quit()
        print("✓ Authentication SUCCESSFUL")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"✗ Authentication FAILED: {e}")
        print("\n⚠️  Common causes:")
        print("   1. Using regular password instead of App Password")
        print("   2. 2FA not enabled on Google Account")
        print("   3. Incorrect App Password")
        return False
    except Exception as e:
        print(f"✗ Connection FAILED: {e}")
        return False

def check_firewall_rules():
    """Check common firewall configurations"""
    print("\n" + "=" * 60)
    print("TEST 5: Firewall Check")
    print("=" * 60)
    
    import subprocess
    
    # Check iptables (Linux)
    try:
        result = subprocess.run(
            ["iptables", "-L", "-n"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if "587" in result.stdout or "smtp" in result.stdout.lower():
            print("⚠️  Found SMTP/587 rules in iptables")
            print(result.stdout)
        else:
            print("✓ No obvious firewall blocks in iptables")
    except:
        print("ℹ️  Could not check iptables (may need sudo)")
    
    # Check if running in Docker
    try:
        if os.path.exists("/.dockerenv"):
            print("⚠️  Running inside Docker container")
            print("   Docker networking may be restricting outbound connections")
    except:
        pass

def test_alternative_ports():
    """Test both port 587 and 465"""
    print("\n" + "=" * 60)
    print("TEST 6: Alternative Ports")
    print("=" * 60)
    
    ports = [
        (587, False, "TLS"),
        (465, True, "SSL")
    ]
    
    working_ports = []
    for port, use_ssl, protocol in ports:
        print(f"\nTesting port {port} ({protocol})...")
        if test_port_connectivity(port):
            working_ports.append((port, protocol))
    
    if working_ports:
        print(f"\n✓ Working ports: {', '.join([f'{p} ({pr})' for p, pr in working_ports])}")
    else:
        print("\n✗ No working ports found")
    
    return working_ports

def main():
    print("\n" + "=" * 60)
    print("Gmail SMTP Connectivity Diagnostic Tool")
    print("=" * 60)
    
    # Load environment variables if .env exists
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✓ Loaded environment variables from .env")
    except ImportError:
        print("ℹ️  python-dotenv not installed, using system environment")
    
    print()
    
    # Run tests
    dns_ok = test_dns_resolution()
    port_ok = test_port_connectivity(587)
    
    if dns_ok and port_ok:
        smtp_ok = test_smtp_connection(587, False)
        if smtp_ok:
            auth_ok = test_authentication()
    
    # Test alternatives
    working_ports = test_alternative_ports()
    
    check_firewall_rules()
    
    # Summary
    print("\n" + "=" * 60)
    print("DIAGNOSTIC SUMMARY")
    print("=" * 60)
    
    if not dns_ok:
        print("✗ DNS resolution failed - check your internet connection")
    elif not port_ok:
        print("✗ Network connectivity issue detected")
        print("\n📝 Recommended actions:")
        print("   1. Check if firewall is blocking outbound port 587")
        print("   2. Try port 465 (SSL) as alternative")
        print("   3. If in Docker, check network configuration")
        print("   4. Contact your hosting provider/network admin")
    else:
        print("✓ Network connectivity is OK")
        print("📝 If authentication failed, generate a new App Password:")
        print("   https://myaccount.google.com/apppasswords")
    
    print("=" * 60)

if __name__ == "__main__":
    main()