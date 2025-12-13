"""
Seed script for vendors table.

- Inserts realistic vendor data
- Safe to re-run (won't duplicate)
- Designed to match Ramp Vendors UI expectations

Usage:
    python -m app.seed   (from backend/ directory)
"""

import sys
from pathlib import Path

# Add parent directory to path to allow running as standalone script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal
from app.models import Vendor


# --- Base realistic vendors (manually curated) ---
BASE_VENDORS = [
    {
        "name": "Amazon Web Services",
        "category": "Cloud Infrastructure",
        "owner_name": "Sarah Lee",
        "department": "Engineering",
        "vendor_owner_location": "Seattle",
        "spend_365d": 84500.75,
        "spend_30d": 7200.00,
        "payment_type": "Card",
        "status": "active",
    },
    {
        "name": "Google Workspace",
        "category": "Productivity",
        "owner_name": "Michael Chen",
        "department": "IT",
        "vendor_owner_location": "Mountain View",
        "spend_365d": 15240.00,
        "spend_30d": 1200.00,
        "payment_type": "ACH",
        "status": "active",
    },
    {
        "name": "Slack",
        "category": "Communication",
        "owner_name": "Anita Rao",
        "department": "Operations",
        "vendor_owner_location": "San Francisco",
        "spend_365d": 9800.00,
        "spend_30d": 0.00,
        "payment_type": "Card",
        "status": "active",
    },
    {
        "name": "Stripe",
        "category": "Payments",
        "owner_name": "David Kim",
        "department": "Finance",
        "vendor_owner_location": "San Francisco",
        "spend_365d": 41200.25,
        "spend_30d": 3400.50,
        "payment_type": "ACH",
        "status": "active",
    },
    {
        "name": "Notion",
        "category": "Knowledge Base",
        "owner_name": "Emma Wilson",
        "department": "Product",
        "vendor_owner_location": "New York",
        "spend_365d": 6400.00,
        "spend_30d": 0.00,
        "payment_type": "Card",
        "status": "active",
    },
]

# --- Auto-generated vendors to reach 30+ ---
AUTO_VENDOR_NAMES = [
    "Zoom", "Figma", "GitHub", "Atlassian", "Jira",
    "Confluence", "Datadog", "New Relic", "SendGrid",
    "Twilio", "Snowflake", "MongoDB", "Postman",
    "Sentry", "Cloudflare", "Heroku", "DigitalOcean",
    "Netlify", "Vercel", "OpenAI", "Linear", "Asana",
    "Monday.com", "HubSpot", "Salesforce"
]


def seed_vendors() -> None:
    """
    Main seeding function.
    """
    db: Session = SessionLocal()

    try:
        # --- Prevent duplicate seeding ---
        existing_count = db.query(Vendor).count()
        if existing_count >= 25:
            print("Seed skipped: vendors already exist.")
            return

        vendors: list[Vendor] = []

        # Add curated vendors
        for data in BASE_VENDORS:
            vendors.append(
                Vendor(
                    id=uuid.uuid4(),
                    created_at=datetime.now(timezone.utc),
                    has_contract=False,
                    is_1099_vendor=False,
                    **data,
                )
            )

        # Add auto-generated vendors
        for name in AUTO_VENDOR_NAMES:
            vendors.append(
                Vendor(
                    id=uuid.uuid4(),
                    name=name,
                    category="SaaS",
                    owner_name="Auto Seed",
                    department="General",
                    vendor_owner_location="Remote",
                    spend_365d=float(abs(hash(name)) % 40000 + 5000),
                    spend_30d=float(abs(hash(name)) % 3000),
                    payment_type="Card",
                    status="active",
                    has_contract=False,
                    is_1099_vendor=False,
                    created_at=datetime.now(timezone.utc),
                )
            )

        db.add_all(vendors)
        db.commit()

        print(f"Seeded {len(vendors)} vendors successfully.")

    except SQLAlchemyError as exc:
        db.rollback()
        print("Seeding failed:", exc)

    finally:
        db.close()


if __name__ == "__main__":
    seed_vendors()
