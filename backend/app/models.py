import uuid
from sqlalchemy import Column, String, Boolean, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String, nullable=False)
    category = Column(String)
    logo_url = Column(String)

    owner_name = Column(String)
    owner_avatar_url = Column(String)
    department = Column(String)
    vendor_owner_location = Column(String)

    spend_365d = Column(Numeric(12, 2), default=0)
    spend_30d = Column(Numeric(12, 2), default=0)

    payment_type = Column(String, nullable=False)
    status = Column(String, nullable=False)

    description = Column(String)
    has_contract = Column(Boolean, default=False)
    is_1099_vendor = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
