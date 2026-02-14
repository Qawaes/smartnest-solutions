from dotenv import load_dotenv
from pathlib import Path
from .extensions import db


# Always load backend/.env explicitly (works no matter where flask is run from)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)
load_dotenv()  # fallback to current working dir

from flask import Flask, request
from flask_cors import CORS
from datetime import timedelta
import os


def create_app():
    """Create and configure the Flask application.

    All potentially import-time-heavy modules (extensions, blueprints)
    are imported inside this factory to avoid circular imports when
    the package is imported by the CLI or tests.
    """
    app = Flask(__name__)

    # Load configuration
    from .config import Config
    app.config.from_object(Config)

    # Fail hard if secrets are missing or insecure
    insecure_secrets = {
        None,
        "",
        "dev-secret-key-change-in-production",
        "jwt-secret-key-change-in-production",
        "your-secret-key-change-this-in-production",
    }
    if app.config.get("SECRET_KEY") in insecure_secrets:
        raise RuntimeError("SECRET_KEY must be set to a strong value")
    if app.config.get("JWT_SECRET_KEY") in insecure_secrets:
        raise RuntimeError("JWT_SECRET_KEY must be set to a strong value")

    # JWT Configuration
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    # Harden cookies (if any are used later)
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = True

    # Enable CORS early (restrict origins)
    # Allow multiple origins via comma-separated CORS_ORIGINS,
    # plus APP_URL and ADMIN_APP_URL as single values.
    origins_from_env = os.getenv("CORS_ORIGINS", "")
    allowed_origins = []
    if origins_from_env:
        allowed_origins.extend([o.strip() for o in origins_from_env.split(",") if o.strip()])
    allowed_origins.extend([
        app.config.get("APP_URL"),
        app.config.get("ADMIN_APP_URL"),
    ])
    allowed_origins = [o for o in allowed_origins if o]
    if not allowed_origins:
        if os.getenv("FLASK_ENV") == "development":
            allowed_origins = ["http://localhost:3000"]
        else:
            raise RuntimeError("No CORS origins configured. Set APP_URL/ADMIN_APP_URL.")

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": allowed_origins,
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Order-Token"],
            }
        },
    )

    # Import and initialize extensions here to avoid import-time issues
    from .extensions import db, migrate, bcrypt, jwt, limiter
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {
            'error': 'Token has expired',
            'message': 'Please login again'
        }, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        app.logger.warning("JWT invalid token: %s", error)
        return {
            'error': 'Invalid token',
            'message': 'Please login again'
        }, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        app.logger.warning("JWT missing/unauthorized: %s", error)
        return {
            'error': 'Authorization required',
            'message': 'Please provide a valid token'
        }, 401

    # Register blueprints
    from .routes.product_routes import product_bp
    from .routes.product_image_routes import product_image_bp
    from .routes.category_routes import category_bp
    from .routes.order_routes import order_bp
    from .routes.payment import payment_bp
    from .routes.admin_routes import admin_bp
    from .routes.admin_auth_routes import admin_auth_bp
    from .routes.admin_payment import admin_payment_bp
    from .routes.contact_routes import contact_bp
    from .utils.cloudinary import init_cloudinary

    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(product_image_bp, url_prefix="/api/products")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(payment_bp, url_prefix="/api/payments")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(admin_auth_bp, url_prefix="/api/admin/auth")
    app.register_blueprint(admin_payment_bp, url_prefix="/api/admin/payments")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    # Initialize cloudinary and other app-level helpers
    init_cloudinary(app)

    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if os.getenv("FLASK_ENV") != "development":
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "img-src 'self' https: data:; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; "
                "connect-src 'self' https:;"
            )
            if request.is_secure or os.getenv("FORCE_HTTPS"):
                response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    # 🚨 TEMPORARY: RESET DATABASE SCHEMA (Render Free bootstrap)
    with app.app_context():
        db.drop_all()
        db.create_all()
        app.logger.info("Database schema recreated from models")

    return app
