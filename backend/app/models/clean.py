"""
Script to initialize admin user and clean up old columns
Run this once after deploying the new code
"""
from app import create_app, db
from app.models.admin import AdminUser
from sqlalchemy import text
import os

def cleanup_old_columns():
    """Remove old columns from admin_users table"""
    print("Starting column cleanup...")
    
    columns_to_drop = [
        'password_hash',
        'full_name',
        'is_verified',
        'verification_token',
        'verification_token_expires',
        'reset_token',
        'reset_token_expires'
    ]
    
    with db.engine.connect() as conn:
        for column in columns_to_drop:
            try:
                # Check if column exists first
                result = conn.execute(text(
                    f"SELECT column_name FROM information_schema.columns "
                    f"WHERE table_name='admin_users' AND column_name='{column}'"
                ))
                
                if result.fetchone():
                    conn.execute(text(f'ALTER TABLE admin_users DROP COLUMN {column}'))
                    conn.commit()
                    print(f"Dropped column: {column}")
                else:
                    print(f"Column {column} does not exist, skipping")
                    
            except Exception as e:
                print(f"Error dropping column {column}: {e}")
                conn.rollback()
    
    print("Column cleanup completed")


def initialize_admin_user():
    """Initialize admin user from ADMIN_EMAIL environment variable"""
    print("Initializing admin user...")
    
    admin_email = os.getenv("ADMIN_EMAIL")
    
    if not admin_email:
        print("ERROR: ADMIN_EMAIL environment variable not set")
        return False
    
    # Check if admin already exists
    admin = AdminUser.query.filter_by(email=admin_email).first()
    
    if admin:
        print(f"Admin user already exists: {admin_email}")
    else:
        admin = AdminUser(email=admin_email)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin user created: {admin_email}")
    
    return True


def main():
    """Main initialization function"""
    app = create_app()
    
    with app.app_context():
        print("=" * 60)
        print("Admin System Initialization")
        print("=" * 60)
        
        # Create tables if they don't exist
        print("\nCreating database tables...")
        db.create_all()
        print("Tables created successfully")
        
        # Clean up old columns
        print("\nCleaning up old columns...")
        cleanup_old_columns()
        
        # Initialize admin user
        print("\nInitializing admin user...")
        if initialize_admin_user():
            print("\nInitialization completed successfully!")
        else:
            print("\nInitialization failed!")
        
        print("=" * 60)


if __name__ == "__main__":
    main()