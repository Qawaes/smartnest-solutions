from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from datetime import timedelta


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

    # JWT Configuration
    app.config['JWT_SECRET_KEY'] = app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    # Enable CORS early
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Import and initialize extensions here to avoid import-time issues
    from .extensions import db, migrate, bcrypt, jwt
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {
            'error': 'Token has expired',
            'message': 'Please login again'
        }, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {
            'error': 'Invalid token',
            'message': 'Please login again'
        }, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
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
    from .utils.cloudinary import init_cloudinary

    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(product_image_bp, url_prefix="/api/products")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(payment_bp, url_prefix="/api/payments")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(admin_auth_bp, url_prefix="/api/admin/auth")
    app.register_blueprint(admin_payment_bp, url_prefix="/api/admin/payments")

    # Initialize cloudinary and other app-level helpers
    init_cloudinary(app)

    return app