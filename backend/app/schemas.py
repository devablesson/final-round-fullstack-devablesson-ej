"""
Pydantic schemas for request/response validation.
Keeps API contracts explicit and safe.
"""

from pydantic import BaseModel, Field


class VendorCreate(BaseModel):
    # Required fields
    name: str = Field(..., min_length=2, max_length=100)
    payment_type: str = Field(..., min_length=2, max_length=20)

    # Optional fields
    category: str | None = Field(default=None, max_length=50)
    department: str | None = Field(default=None, max_length=50)
    vendor_owner_location: str | None = Field(default=None, max_length=50)


class VendorCreateResponse(BaseModel):
    id: str
    message: str
