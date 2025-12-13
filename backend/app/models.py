"""
SQLAlchemy ORM Models
=====================
Defines the database schema using SQLAlchemy's declarative ORM pattern.
Each class maps to a PostgreSQL table with type-safe column definitions.

Note: Changes to these models require database migrations (Alembic)
      to reflect in the actual database schema.
"""

import uuid
from sqlalchemy import Column, String, Boolean, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base


class Vendor(Base):
    """
    Vendor entity representing a company or individual supplier.
    
    This model supports the Vendors table UI with fields for:
    - Basic info (name, category, logo)
    - Ownership details (owner, department, location)
    - Financial data (spend metrics)
    - Compliance flags (1099, contract status)
    
    Attributes:
        id: UUID primary key, auto-generated
        name: Vendor display name (required, searchable)
        status: Current vendor status - 'Active' or 'Pending'
        payment_type: Payment method - 'Card' or 'ACH'
    """
    __tablename__ = "vendors"

    # Primary key using UUID for better distribution and security
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # --- Basic Information ---
    name = Column(String, nullable=False, index=True)  # Indexed for search performance
    category = Column(String)  # e.g., "Software", "Marketing", "Office Supplies"
    logo_url = Column(String)  # URL to vendor logo image

    # --- Ownership & Organization ---
    owner_name = Column(String)  # Internal owner/point of contact
    owner_avatar_url = Column(String)  # Profile image URL
    department = Column(String)  # Responsible department
    vendor_owner_location = Column(String)  # Geographic location

    # --- Financial Metrics ---
    # Using Numeric for precise decimal calculations (avoids float rounding issues)
    spend_365d = Column(Numeric(12, 2), default=0)  # Total spend last 365 days
    spend_30d = Column(Numeric(12, 2), default=0)   # Total spend last 30 days

    # --- Payment & Status ---
    payment_type = Column(String, nullable=False)  # 'Card' | 'ACH'
    status = Column(String, nullable=False)        # 'Active' | 'Pending'

    # --- Compliance & Metadata ---
    description = Column(String)  # Optional vendor notes
    has_contract = Column(Boolean, default=False)  # Contract on file indicator
    is_1099_vendor = Column(Boolean, default=False)  # Tax reporting flag

    # --- Timestamps ---
    # server_default uses DB function, onupdate triggers on ORM updates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
