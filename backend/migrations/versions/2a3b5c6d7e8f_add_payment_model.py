"""Add Payment model for payment tracking

Revision ID: 2a3b5c6d7e8f
Revises: ed15811a9aca
Create Date: 2026-01-18 17:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2a3b5c6d7e8f'
down_revision = 'ed15811a9aca'
branch_labels = None
depends_on = None


def upgrade():
    # Create payments table
    op.create_table(
        'payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('method', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False),
        sa.Column('mpesa_checkout_id', sa.String(length=100), nullable=True),
        sa.Column('mpesa_receipt', sa.String(length=50), nullable=True),
        sa.Column('paid_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    # Drop payments table
    op.drop_table('payments')
