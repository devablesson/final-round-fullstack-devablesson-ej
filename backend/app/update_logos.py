"""
Quick script to add logo URLs to existing vendors.
Run: python -m app.update_logos
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Vendor

# Using direct CDN URLs for company logos (more reliable than API services)
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


def update_logos():
    db: Session = SessionLocal()
    try:
        updated = 0
        vendors = db.query(Vendor).all()
        
        for vendor in vendors:
            logo_url = VENDOR_LOGOS.get(vendor.name)
            if logo_url and vendor.logo_url != logo_url:
                vendor.logo_url = logo_url
                updated += 1
        
        db.commit()
        print(f"✅ Updated {updated} vendor logos!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    update_logos()
