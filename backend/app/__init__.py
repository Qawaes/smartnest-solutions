from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": "http://127.0.0.1:5173"}},
        supports_credentials=False
    )

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes.product_routes import product_bp
    from .routes.category_routes import category_bp
    from .routes.order_routes import order_bp
    from .routes.product_image_routes import product_image_bp
    from .utils.cloudinary import init_cloudinary
    from .routes.checkout_routes import payment_bp
    from .routes.payment import payment_bp
    from .routes.admin_routes import admin_bp

    init_cloudinary(app)
    app.register_blueprint(payment_bp, url_prefix="/api/payments")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(product_image_bp, url_prefix="/api/products")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    return app
