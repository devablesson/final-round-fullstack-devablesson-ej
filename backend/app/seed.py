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

from app.database import SessionLocal, engine, Base
from app.models import Vendor


# --- Logo URL mapping for vendors (using Wikipedia/CDN URLs) ---
VENDOR_LOGOS = {
    "Amazon Web Services": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/100px-Amazon_Web_Services_Logo.svg.png",
    "Google Workspace": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/100px-Google_%22G%22_Logo.svg.png",
    "Slack": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/100px-Slack_icon_2019.svg.png",
    "Stripe": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/100px-Stripe_Logo%2C_revised_2016.svg.png",
    "Notion": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/100px-Notion-logo.svg.png",
    "Zoom": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/100px-Zoom_Logo_2022.svg.png",
    "Figma": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/100px-Figma-logo.svg.png",
    "GitHub": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/100px-Octicons-mark-github.svg.png",
    "Atlassian": "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png",
    "Jira": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jira_Logo.svg/100px-Jira_Logo.svg.png",
    "Confluence": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Confluence_Logo.svg/100px-Confluence_Logo.svg.png",
    "Datadog": "https://imgix.datadoghq.com/img/dd_logo_n_70x75.png",
    "New Relic": "https://newrelic.com/favicon.ico",
    "SendGrid": "https://sendgrid.com/favicon.ico",
    "Twilio": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/100px-Twilio-logo-red.svg.png",
    "Snowflake": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Snowflake_Logo.svg/100px-Snowflake_Logo.svg.png",
    "MongoDB": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/100px-MongoDB_Logo.svg.png",
    "Postman": "https://www.postman.com/favicon-32x32.png",
    "Sentry": "https://sentry.io/favicon.ico",
    "Cloudflare": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Cloudflare_Logo.png/100px-Cloudflare_Logo.png",
    "Heroku": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Heroku_logo.svg/100px-Heroku_logo.svg.png",
    "DigitalOcean": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/100px-DigitalOcean_logo.svg.png",
    "Netlify": "https://www.netlify.com/favicon.ico",
    "Vercel": "https://vercel.com/favicon.ico",
    "OpenAI": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/100px-OpenAI_Logo.svg.png",
    "Linear": "https://linear.app/favicon.ico",
    "Asana": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Asana_logo.svg/100px-Asana_logo.svg.png",
    "Monday.com": "https://monday.com/favicon.ico",
    "HubSpot": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/HubSpot_Logo.svg/100px-HubSpot_Logo.svg.png",
    "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/100px-Salesforce.com_logo.svg.png",
}

# --- Base realistic vendors (manually curated with help of AI) ---
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
        "logo_url": VENDOR_LOGOS.get("Amazon Web Services"),
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
        "logo_url": VENDOR_LOGOS.get("Google Workspace"),
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
        "logo_url": VENDOR_LOGOS.get("Slack"),
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
        "logo_url": VENDOR_LOGOS.get("Stripe"),
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
        "logo_url": VENDOR_LOGOS.get("Notion"),
    },
]

# --- Auto-generated vendors to reach 30+ With help of AI---
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
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
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
                    logo_url=VENDOR_LOGOS.get(name),
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
