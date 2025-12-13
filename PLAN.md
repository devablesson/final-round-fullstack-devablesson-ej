## Phase 1 – Data Model & Schema Design

This project is centered around a single core entity: `Vendor`.
The schema is intentionally designed to directly support the Vendors
table UI (sorting, search, creation) without implementing Ramp’s full
vendor lifecycle domain.

### Vendor Entity

The Vendor entity represents a single row in the Vendors table.

Fields are derived from the visible UI requirements.

### Vendor Schema

| Field | Type | Description |
|------|----|------------|
| id | UUID | Unique vendor identifier |
| name | string | Vendor name (searchable) |
| category | string | Vendor category (subtitle) |
| logo_url | string | Vendor logo URL |
| owner_name | string | Vendor owner |
| owner_avatar_url | string | Owner avatar |
| department | string | Department name |
| vendor_owner_location | string | Location |
| spend_365d | number | Spend over last 365 days |
| spend_30d | number | Spend over last 30 days |
| payment_type | string | Card / ACH |
| status | string | Active / Pending |
| description | string | Optional description |
| has_contract | boolean | Contract indicator |
| is_1099_vendor | boolean | 1099 flag |
| created_at | datetime | Creation date |
| updated_at | datetime | Last update |
