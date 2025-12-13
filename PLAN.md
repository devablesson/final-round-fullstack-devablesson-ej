# Implementation Plan

This document outlines the phased approach taken to implement the Ramp Vendors page.

---

## Phase 1 – Data Model & Schema Design

**Objective:** Define the database schema that supports all UI requirements.

### Approach

The `Vendor` entity was designed by analyzing the Ramp Vendors UI and identifying all visible data fields. The schema intentionally mirrors the UI columns to ensure seamless data binding.

### Vendor Entity

The Vendor entity represents a single row in the Vendors table.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique vendor identifier (primary key) |
| name | string | Vendor name (searchable, indexed) |
| category | string | Vendor category/subtitle |
| logo_url | string | URL to vendor logo image |
| owner_name | string | Internal vendor owner/contact |
| owner_avatar_url | string | Owner profile image URL |
| department | string | Responsible department |
| vendor_owner_location | string | Geographic location |
| spend_365d | decimal | Spend over last 365 days |
| spend_30d | decimal | Spend over last 30 days |
| payment_type | string | 'Card' or 'ACH' |
| status | string | 'active' or 'pending' |
| description | string | Optional vendor notes |
| has_contract | boolean | Contract on file indicator |
| is_1099_vendor | boolean | 1099 tax reporting flag |
| created_at | datetime | Record creation timestamp |
| updated_at | datetime | Last modification timestamp |

### Deliverables
- [x] SQLAlchemy ORM model (`models.py`)
- [x] Pydantic schemas for API validation (`schemas.py`)
- [x] Database connection setup (`database.py`)

---

## Phase 2 – Backend API Development

**Objective:** Build RESTful endpoints to support frontend operations.

### Endpoints Implemented

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/vendors` | List vendors with search, sort, pagination |
| POST | `/vendors` | Create a new vendor |
| GET | `/health` | Health check for monitoring |

### Key Decisions

1. **Search**: Case-insensitive `ILIKE` query on vendor name
2. **Sorting**: Whitelist of allowed columns to prevent SQL injection
3. **Validation**: Pydantic models enforce required fields and constraints
4. **Error Handling**: Consistent HTTP status codes (201, 409, 500)

### Deliverables
- [x] FastAPI router with endpoints (`routers/vendors.py`)
- [x] CRUD operations layer (`crud.py`)
- [x] CORS configuration for frontend access
- [x] OpenAPI documentation (auto-generated at `/docs`)

---

## Phase 3 – Database Seeding

**Objective:** Populate database with realistic test data.

### Approach

Created a seed script that generates 30+ diverse vendors with:
- Mix of real company names (AWS, Slack, GitHub, etc.)
- Varied spend amounts ($0 to $84,500)
- Different payment types (Card, ACH)
- Multiple departments and locations
- Some with missing optional fields (for edge case testing)

### Deliverables
- [x] Seed script with 30+ vendors (`seed.py`)
- [x] Logo URL mapping for known vendors (`update_logos.py`)
- [x] Idempotent seeding (won't duplicate on re-run)

---

## Phase 4 – Frontend Architecture

**Objective:** Set up React/TypeScript project with proper structure.

### Project Setup

1. Vite for fast development and optimized builds
2. TypeScript for type safety
3. TailwindCSS for utility-first styling
4. Organized folder structure (api/, components/, types/)

### Key Decisions

1. **API Client**: Centralized fetch wrapper for consistent error handling
2. **Type Definitions**: TypeScript interfaces matching backend schemas
3. **State Management**: React useState hooks (no external state library needed)

### Deliverables
- [x] Vite + React + TypeScript setup
- [x] TailwindCSS configuration
- [x] API client layer (`api/client.ts`, `api/vendors.ts`)
- [x] Type definitions (`types/vendor.ts`)

---

## Phase 5 – UI Component Development

**Objective:** Build UI components matching Ramp's design.

### Components Developed

| Component | Description |
|-----------|-------------|
| `App.tsx` | Root layout with header, tabs, search, table |
| `VendorsTable.tsx` | Data table with all columns, sorting, selection |
| `NewVendorModal.tsx` | Slide-in panel for vendor creation |

### UI Features Implemented

- **Header**: Title, "New vendor" button with Ramp's lime-green color
- **Tabs**: 5 tabs with badge counts (Overview, Needs Review, etc.)
- **Search Bar**: Rounded input with search icon
- **Data Table**: 
  - Fixed left column (checkbox + vendor) with synced scrolling
  - All visible columns with proper alignment
  - Column divider lines
  - Row hover and selection states
- **Footer**: Dynamic based on selection (count vs pagination)

### Deliverables
- [x] Pixel-perfect header and tab navigation
- [x] Vendors table with synchronized scrolling
- [x] New vendor slide-in modal with form
- [x] Selection footer with action buttons

---

## Phase 6 – Feature Integration

**Objective:** Connect frontend to backend and ensure full functionality.

### Integrations

1. **Search**: Debounced input (300ms) triggers API call with `search` param
2. **Sorting**: Column header clicks update `sort_by` and `sort_order` params
3. **Create Vendor**: Form submission POSTs to API, refreshes table on success
4. **Error Handling**: API errors displayed in UI

### Deliverables
- [x] Search with real-time filtering
- [x] Multi-column sorting (name, spend, date)
- [x] Vendor creation with validation
- [x] Loading and error states

---

## Phase 7 – Polish & Documentation

**Objective:** Final refinements and documentation.

### Activities

1. Added vendor logos with fallback to letter avatars
2. Added column divider lines
3. Fixed alignment issues in table cells
4. Created comprehensive README with setup instructions
5. Documented requirements checklist
6. Added code comments throughout codebase

### Deliverables
- [x] Professional README.md
- [x] REQUIREMENTS.md checklist
- [x] PLAN.md (this document)
- [x] Meaningful code comments in all files

---

## Summary

| Phase | Status | Time Estimate |
|-------|--------|---------------|
| Phase 1 – Schema Design | ✅ Complete | 1 hour |
| Phase 2 – Backend API | ✅ Complete | 2 hours |
| Phase 3 – Database Seeding | ✅ Complete | 1 hour |
| Phase 4 – Frontend Setup | ✅ Complete | 1 hour |
| Phase 5 – UI Components | ✅ Complete | 4 hours |
| Phase 6 – Integration | ✅ Complete | 2 hours |
| Phase 7 – Documentation | ✅ Complete | 1 hour |

**Total Estimated Time: ~12 hours**
