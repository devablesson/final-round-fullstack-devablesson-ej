"""
CRUD operations for Vendor.
Separated from routing to keep logic testable.
"""

import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models import Vendor
from app.schemas import VendorCreate


def create_vendor(db: Session, payload: VendorCreate) -> Vendor:
    """
    Creates a new vendor after validating uniqueness.
    Raises ValueError for business-rule violations.
    """

    # Prevent duplicate vendor names (simple business rule)
    existing = db.query(Vendor).filter(Vendor.name == payload.name).first()
    if existing:
        raise ValueError("Vendor with this name already exists")

    vendor = Vendor(
        id=uuid.uuid4(),
        name=payload.name,
        category=payload.category,
        payment_type=payload.payment_type,
        department=payload.department,
        vendor_owner_location=payload.vendor_owner_location,
        status="active",          # default
        spend_365d=0,             # new vendors start with zero spend
        spend_30d=0,
        has_contract=False,
        is_1099_vendor=False,
    )

    try:
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        return vendor

    except SQLAlchemyError as exc:
        db.rollback()
        raise RuntimeError("Database error while creating vendor") from exc
