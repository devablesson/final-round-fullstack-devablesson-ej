from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from typing import Optional
from ..database import SessionLocal
from ..models import Vendor

router = APIRouter(prefix="/vendors", tags=["vendors"])

def get_db():
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
    query = db.query(Vendor)

    if search:
        query = query.filter(Vendor.name.ilike(f"%{search}%"))

    allowed_sorts = {
        "name": Vendor.name,
        "spend_365d": Vendor.spend_365d,
        "spend_30d": Vendor.spend_30d,
        "created_at": Vendor.created_at,
    }

    sort_column = allowed_sorts.get(sort_by, Vendor.created_at)

    query = query.order_by(
        asc(sort_column) if sort_order == "asc" else desc(sort_column)
    )

    return query.all()
