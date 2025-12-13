"""
Vendors API Router
==================
Handles all vendor-related HTTP endpoints including listing,
searching, sorting, and CRUD operations.

Endpoints:
    GET /vendors - List all vendors with optional search/sort

TODO:
    - POST /vendors - Create new vendor
    - GET /vendors/{id} - Get vendor by ID
    - PUT /vendors/{id} - Update vendor
    - DELETE /vendors/{id} - Delete vendor
"""

from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.schemas import VendorCreate, VendorCreateResponse
from app.crud import create_vendor
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from typing import Optional
from ..database import SessionLocal
from ..models import Vendor

# Create router with URL prefix and OpenAPI tag grouping
router = APIRouter(prefix="/vendors", tags=["vendors"])


def get_db():
    """
    Database session dependency injection.
    
    Yields a SQLAlchemy session and ensures proper cleanup after request.
    This pattern guarantees the connection is returned to the pool
    even if an exception occurs during request processing.
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("")
def list_vendors(
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db),
):
    """
    Retrieve a list of vendors with optional filtering and sorting.
    
    Args:
        search: Case-insensitive partial match on vendor name
        sort_by: Column to sort by (name, spend_365d, spend_30d, created_at)
        sort_order: Sort direction - 'asc' or 'desc' (default: desc)
        db: Database session (injected)
    
    Returns:
        List[Vendor]: Array of vendor objects matching the criteria
    
    Example:
        GET /vendors?search=acme&sort_by=spend_365d&sort_order=desc
    """
    # Start with base query
    query = db.query(Vendor)

    # Apply search filter if provided (case-insensitive LIKE query)
    if search:
        query = query.filter(Vendor.name.ilike(f"%{search}%"))

    # Whitelist of allowed sort columns to prevent SQL injection
    # Maps query param values to actual SQLAlchemy column objects
    allowed_sorts = {
        "name": Vendor.name,
        "spend_365d": Vendor.spend_365d,
        "spend_30d": Vendor.spend_30d,
        "created_at": Vendor.created_at,
    }

    # Fallback to created_at if invalid sort_by is provided
    sort_column = allowed_sorts.get(sort_by, Vendor.created_at)

    # Apply sort order (ascending or descending)
    query = query.order_by(
        asc(sort_column) if sort_order == "asc" else desc(sort_column)
    )

    return query.all()

@router.post(
    "",
    response_model=VendorCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vendor_endpoint(
    payload: VendorCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new vendor.
    Used by the simplified New Vendor flow.
    """

    try:
        vendor = create_vendor(db, payload)

        return VendorCreateResponse(
            id=str(vendor.id),
            message="Vendor created successfully",
        )

    except ValueError as exc:
        # Business rule violation (duplicate name)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )

    except RuntimeError:
        # Database or unexpected error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create vendor",
        )
