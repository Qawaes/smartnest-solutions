from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage

app = create_app()

def seed():
    with app.app_context():
        print("🌱 Seeding database...")

        # ----------------------------
        # CLEAN DATABASE (DEV ONLY)
        # ----------------------------
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        db.session.commit()

        # ----------------------------
        # CATEGORIES
        # ----------------------------
        gifts = Category(name="Gifts", slug="gifts")
        home = Category(name="Home Essentials", slug="home-essentials")
        branding = Category(name="Custom Branding", slug="custom-branding")

        db.session.add_all([gifts, home, branding])
        db.session.commit()

        print("✅ Categories created")

        # ----------------------------
        # PRODUCTS
        # ----------------------------
        products = [
            Product(
                name="Birthday Gift Box",
                description="A beautifully curated birthday gift box.",
                price=2500,
                category_id=gifts.id,
                is_branding=False
            ),
            Product(
                name="Luxury Flower Bouquet",
                description="Fresh flowers perfect for any occasion.",
                price=3200,
                category_id=gifts.id,
                is_branding=False
            ),
            Product(
                name="Modern Table Lamp",
                description="Elegant lighting for your living space.",
                price=5400,
                category_id=home.id,
                is_branding=False
            ),
            Product(
                name="Custom Logo Mug",
                description="Personalized mug with your company logo.",
                price=1200,
                category_id=branding.id,
                is_branding=True
            ),
            Product(
                name="Branded Gift Hamper",
                description="Corporate gift hamper with full branding.",
                price=8500,
                category_id=branding.id,
                is_branding=True
            ),
        ]

        db.session.add_all(products)
        db.session.commit()

        print("✅ Products created")

        # ----------------------------
        # PRODUCT IMAGES
        # (Using placeholder URLs for now)
        # Replace with Cloudinary URLs later
        # ----------------------------
        images = [
            # Birthday Gift Box
            ProductImage(
                product_id=products[0].id,
                image_url="https://via.placeholder.com/800x800?text=Gift+Box+1",
                is_primary=True,
                position=0
            ),
            ProductImage(
                product_id=products[0].id,
                image_url="https://via.placeholder.com/800x800?text=Gift+Box+2",
                position=1
            ),

            # Flower Bouquet
            ProductImage(
                product_id=products[1].id,
                image_url="https://via.placeholder.com/800x800?text=Flowers+1",
                is_primary=True,
                position=0
            ),

            # Table Lamp
            ProductImage(
                product_id=products[2].id,
                image_url="https://via.placeholder.com/800x800?text=Lamp+1",
                is_primary=True,
                position=0
            ),

            # Custom Logo Mug
            ProductImage(
                product_id=products[3].id,
                image_url="https://via.placeholder.com/800x800?text=Branded+Mug+1",
                is_primary=True,
                position=0
            ),
            ProductImage(
                product_id=products[3].id,
                image_url="https://via.placeholder.com/800x800?text=Branded+Mug+2",
                position=1
            ),

            # Branded Hamper
            ProductImage(
                product_id=products[4].id,
                image_url="https://via.placeholder.com/800x800?text=Branded+Hamper+1",
                is_primary=True,
                position=0
            ),
        ]

        db.session.add_all(images)
        db.session.commit()

        print("✅ Product images created")
        print("🎉 Database seeded successfully!")


if __name__ == "__main__":
    seed()
