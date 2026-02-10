"""add order access token and payment unique constraints

Revision ID: 8b3c9d1f4c2a
Revises: 60e7f3a8cfad
Create Date: 2026-02-06 10:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
import secrets

# revision identifiers, used by Alembic.
revision = '8b3c9d1f4c2a'
down_revision = '60e7f3a8cfad'
branch_labels = None
depends_on = None


def upgrade():
    # Add order_access_token column (nullable first for backfill)
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('order_access_token', sa.String(length=128), nullable=True))

    # Backfill tokens for existing orders
    bind = op.get_bind()
    orders = bind.execute(sa.text("SELECT id FROM orders WHERE order_access_token IS NULL")).fetchall()
    for row in orders:
        token = secrets.token_urlsafe(32)
        bind.execute(
            sa.text("UPDATE orders SET order_access_token = :token WHERE id = :id"),
            {"token": token, "id": row.id},
        )

    # Enforce NOT NULL + unique constraint
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('order_access_token', existing_type=sa.String(length=128), nullable=False)
        batch_op.create_unique_constraint('uq_orders_order_access_token', ['order_access_token'])

    # Add unique constraints for M-Pesa identifiers
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.create_unique_constraint('uq_payments_mpesa_checkout_id', ['mpesa_checkout_id'])
        batch_op.create_unique_constraint('uq_payments_mpesa_receipt', ['mpesa_receipt'])


def downgrade():
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint('uq_payments_mpesa_receipt', type_='unique')
        batch_op.drop_constraint('uq_payments_mpesa_checkout_id', type_='unique')

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_constraint('uq_orders_order_access_token', type_='unique')
        batch_op.drop_column('order_access_token')
