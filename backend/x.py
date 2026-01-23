"""
Migration script to update admin_users table for OTP authentication
Run this once: python migrate_admin_to_otp.py
"""
from app import create_app, db
from sqlalchemy import text, inspect
import os

def column_exists(table_name, column_name):
    """Check if a column exists in a table"""
    inspector = inspect(db.engine)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def add_otp_columns():
    """Add new OTP-related columns"""
    print("\n=== Adding OTP Columns ===")
    
    new_columns = {
        'otp_code': 'VARCHAR(6)',
        'otp_expires': 'TIMESTAMP',
        'otp_attempts': 'INTEGER DEFAULT 0'
    }
    
    with db.engine.connect() as conn:
        for column_name, column_type in new_columns.items():
            if not column_exists('admin_users', column_name):
                try:
                    sql = text(f'ALTER TABLE admin_users ADD COLUMN {column_name} {column_type}')
                    conn.execute(sql)
                    conn.commit()
                    print(f"✓ Added column: {column_name}")
                except Exception as e:
                    print(f"✗ Error adding column {column_name}: {e}")
                    conn.rollback()
            else:
                print(f"- Column {column_name} already exists")

def remove_old_columns():
    """Remove old password-based authentication columns"""
    print("\n=== Removing Old Columns ===")
    
    columns_to_remove = [
        'password_hash',
        'full_name',
        'is_verified',
        'verification_token',
        'verification_token_expires',
        'reset_token',
        'reset_token_expires'
    ]
    
    with db.engine.connect() as conn:
        for column_name in columns_to_remove:
            if column_exists('admin_users', column_name):
                try:
                    sql = text(f'ALTER TABLE admin_users DROP COLUMN {column_name}')
                    conn.execute(sql)
                    conn.commit()
                    print(f"✓ Removed column: {column_name}")
                except Exception as e:
                    print(f"✗ Error removing column {column_name}: {e}")
                    conn.rollback()
            else:
                print(f"- Column {column_name} does not exist")

def initialize_admin_user():
    """Create or update admin user from ADMIN_EMAIL"""
    print("\n=== Initializing Admin User ===")
    
    admin_email = os.getenv("ADMIN_EMAIL")
    
    if not admin_email:
        print("✗ ERROR: ADMIN_EMAIL environment variable not set!")
        print("  Please set ADMIN_EMAIL in your .env file")
        return False
    
    print(f"Admin email from environment: {admin_email}")
    
    # Import here to avoid circular imports
    from app.models.admin import AdminUser
    
    # Check if any admin exists
    existing_admins = AdminUser.query.all()
    
    if existing_admins:
        print(f"Found {len(existing_admins)} existing admin user(s)")
        
        # Check if the correct admin exists
        correct_admin = AdminUser.query.filter_by(email=admin_email).first()
        
        if correct_admin:
            print(f"✓ Admin user with email {admin_email} already exists")
        else:
            # Delete old admins and create new one
            print(f"Cleaning up old admin users...")
            for old_admin in existing_admins:
                print(f"  Removing: {old_admin.email}")
                db.session.delete(old_admin)
            
            db.session.commit()
            
            # Create new admin
            new_admin = AdminUser(email=admin_email)
            db.session.add(new_admin)
            db.session.commit()
            print(f"✓ Created new admin user: {admin_email}")
    else:
        # No admins exist, create new one
        new_admin = AdminUser(email=admin_email)
        db.session.add(new_admin)
        db.session.commit()
        print(f"✓ Created admin user: {admin_email}")
    
    return True

def verify_migration():
    """Verify that migration was successful"""
    print("\n=== Verifying Migration ===")
    
    from app.models.admin import AdminUser
    
    # Check required columns exist
    required_columns = ['id', 'email', 'otp_code', 'otp_expires', 'otp_attempts', 'created_at', 'last_login']
    
    missing_columns = []
    for col in required_columns:
        if not column_exists('admin_users', col):
            missing_columns.append(col)
    
    if missing_columns:
        print(f"✗ Missing columns: {', '.join(missing_columns)}")
        return False
    else:
        print(f"✓ All required columns present")
    
    # Check admin user exists
    admin_email = os.getenv("ADMIN_EMAIL")
    admin = AdminUser.query.filter_by(email=admin_email).first()
    
    if admin:
        print(f"✓ Admin user verified: {admin.email}")
        print(f"  - ID: {admin.id}")
        print(f"  - Created: {admin.created_at}")
        return True
    else:
        print(f"✗ Admin user not found")
        return False

def main():
    """Main migration function"""
    app = create_app()
    
    with app.app_context():
        print("=" * 70)
        print("Admin Authentication Migration: Password -> OTP")
        print("=" * 70)
        
        try:
            # Step 1: Add new columns
            add_otp_columns()
            
            # Step 2: Initialize admin user (before removing old columns)
            if not initialize_admin_user():
                print("\n✗ Migration failed: Could not initialize admin user")
                return
            
            # Step 3: Remove old columns
            print("\nWarning: About to remove old columns. This action cannot be undone.")
            response = input("Continue? (yes/no): ").strip().lower()
            
            if response == 'yes':
                remove_old_columns()
            else:
                print("Skipped removing old columns")
            
            # Step 4: Verify migration
            if verify_migration():
                print("\n" + "=" * 70)
                print("✓ Migration completed successfully!")
                print("=" * 70)
                print("\nYou can now use the OTP-based authentication system.")
                print(f"Admin email: {os.getenv('ADMIN_EMAIL')}")
            else:
                print("\n" + "=" * 70)
                print("✗ Migration verification failed!")
                print("=" * 70)
                print("Please check the errors above and try again.")
        
        except Exception as e:
            print(f"\n✗ Migration failed with error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
