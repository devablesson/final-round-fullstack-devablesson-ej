# Ramp Vendors Page — Full Stack Implementation

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

A production-quality recreation of Ramp's Vendors management page, featuring a FastAPI backend with PostgreSQL persistence and a React/TypeScript frontend styled with TailwindCSS.

---

## Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Features Implemented](#-features-implemented)
- [Database Schema](#-database-schema)
- [Development Notes](#-development-notes)

---

## Overview

This project implements the core functionality of Ramp's Vendors page as specified in the assessment requirements. The implementation focuses on:

- **Perfect UI replication** matching Ramp's design language
- **Full-stack architecture** with clear separation of concerns
- **Type-safe development** using TypeScript and Pydantic schemas
- **Production-ready patterns** including error handling, validation, and CORS configuration

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | FastAPI (Python 3.11+) | RESTful API with automatic OpenAPI documentation |
| **Database** | PostgreSQL (Neon) + SQLAlchemy | Cloud-hosted PostgreSQL with ORM |
| **Frontend** | React 18 + TypeScript | Component-based UI with type safety |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Build Tool** | Vite | Fast development server and optimized builds |
| **Validation** | Pydantic | Request/response schema validation |

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Package initialization
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # SQLAlchemy engine & session setup
│   │   ├── models.py            # ORM model definitions
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── crud.py              # Database CRUD operations
│   │   ├── seed.py              # Database seeding script
│   │   ├── update_logos.py      # Vendor logo update utility
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── vendors.py       # Vendor API endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # React application entry
│   │   ├── App.tsx              # Root component with page layout
│   │   ├── App.css              # Global styles
│   │   ├── index.css            # Tailwind imports
│   │   ├── api/
│   │   │   ├── client.ts        # Centralized HTTP client
│   │   │   └── vendors.ts       # Vendor-specific API functions
│   │   ├── components/
│   │   │   ├── VendorsTable.tsx # Main data table component
│   │   │   └── NewVendorModal.tsx # Vendor creation slide-in panel
│   │   └── types/
│   │       └── vendor.ts        # TypeScript type definitions
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── PLAN.md                      # Implementation phases documentation
├── REQUIREMENTS.md              # Requirements checklist
└── README.md                    # This file
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Python 3.11+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)

> **Note:** No local PostgreSQL installation required! The database is hosted on [Neon](https://neon.tech) (cloud PostgreSQL).

### 1. Clone the Repository

```bash
git clone git@github.com:devablesson/final-round-fullstack-devablesson-ej.git
cd final-round-fullstack-devablesson-ej
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows (Git Bash)
source .venv/Scripts/activate

# Windows (Command Prompt)
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample vendors (one-time, 30+ records)
# Safe to re-run - skips if data already exists
python -m app.seed

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**

Interactive API docs: **http://localhost:8000/docs**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at: **http://localhost:5173**

---

##  API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/vendors` | List vendors with optional filtering and sorting |
| `POST` | `/vendors` | Create a new vendor |
| `GET` | `/health` | Health check endpoint |

### GET /vendors

Retrieves a list of vendors with optional search and sort parameters.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | — | Case-insensitive partial match on vendor name |
| `sort_by` | string | `created_at` | Column to sort by: `name`, `spend_365d`, `spend_30d`, `created_at` |
| `sort_order` | string | `desc` | Sort direction: `asc` or `desc` |

**Example Request:**
```bash
curl "http://localhost:8000/vendors?search=slack&sort_by=spend_365d&sort_order=desc"
```

**Example Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Slack",
    "category": "Communication",
    "owner_name": "Anita Rao",
    "department": "Operations",
    "spend_365d": 9800.00,
    "spend_30d": 0.00,
    "payment_type": "Card",
    "status": "active",
    "created_at": "2025-12-13T10:30:00Z"
  }
]
```

### POST /vendors

Creates a new vendor.

**Request Body:**
```json
{
  "name": "New Vendor Inc",
  "payment_type": "ACH",
  "category": "Software",
  "department": "Engineering",
  "vendor_owner_location": "San Francisco"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "message": "Vendor created successfully"
}
```

---

## Features Implemented

### Core Functionality

| Feature | Status | Description |
|---------|--------|-------------|
| Vendor Table Display | ✅ | All columns with proper formatting |
| Search Functionality | ✅ | Real-time search with 300ms debounce |
| Column Sorting | ✅ | Sort by name, 365d spend, 30d spend, creation date |
| New Vendor Creation | ✅ | Slide-in modal with form validation |
| Checkbox Selection | ✅ | Select all / individual with footer state change |
| Pagination Display | ✅ | Shows vendor count in footer |

### UI Components

| Component | Status | Description |
|-----------|--------|-------------|
| Tabs Navigation | ✅ | Overview, Needs Review, Renewals, Duplicates, Switch Cards |
| Vendor Logos | ✅ | Image with letter avatar fallback |
| Owner Avatars | ✅ | Colored initials based on name hash |
| Column Dividers | ✅ | Vertical borders between columns |
| Hover States | ✅ | Row hover, button hover effects |
| Loading State | ✅ | Spinner during data fetch |
| Error State | ✅ | Error message display |

### Intentionally Omitted (Per Requirements)

- Left sidebar navigation
- Top navigation bar
- Vendor Status dropdown filter
- Contract column functionality
- Tax Details / 1099 column functionality
- Row click → vendor detail page
- Kebab menu "Request Information" action

---

##  Database Schema

### Vendors Table

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | No | Primary key, auto-generated |
| `name` | VARCHAR | No | Vendor name (indexed for search) |
| `category` | VARCHAR | Yes | Business category |
| `logo_url` | VARCHAR | Yes | URL to vendor logo |
| `owner_name` | VARCHAR | Yes | Internal point of contact |
| `owner_avatar_url` | VARCHAR | Yes | Owner profile image URL |
| `department` | VARCHAR | Yes | Responsible department |
| `vendor_owner_location` | VARCHAR | Yes | Geographic location |
| `spend_365d` | NUMERIC(12,2) | No | Total spend last 365 days |
| `spend_30d` | NUMERIC(12,2) | No | Total spend last 30 days |
| `payment_type` | VARCHAR | No | 'Card' or 'ACH' |
| `status` | VARCHAR | No | 'active' or 'pending' |
| `description` | TEXT | Yes | Optional notes |
| `has_contract` | BOOLEAN | No | Contract on file indicator |
| `is_1099_vendor` | BOOLEAN | No | Tax reporting flag |
| `created_at` | TIMESTAMP | No | Record creation time |
| `updated_at` | TIMESTAMP | Yes | Last modification time |

---

## Development Notes

### Code Quality

- **Type Safety**: Full TypeScript coverage on frontend, Pydantic schemas on backend
- **Error Handling**: Centralized error handling in API client with user-friendly messages
- **Code Comments**: All files include descriptive docstrings and inline comments
- **Component Structure**: Reusable components with clear props interfaces

### AI Assistance Disclosure

AI assistance was used specifically for:
- **Vendor logo URL mappings** — sourcing image URLs from Wikipedia/CDN for vendor icons


### Performance Considerations

- **Debounced Search**: 300ms delay prevents excessive API calls during typing
- **Memoized Colors**: Vendor colors computed once and cached per render cycle
- **Synchronized Scrolling**: Left column and table body scroll together seamlessly


##  License

This project was created as part of a technical assessment and is not licensed for public distribution.

---

*Built with ❤️ for Ramp/ThetaAI Software*

- Sidebar and top navigation are intentionally omitted per requirements
- Vendor Status dropdown filter is omitted per requirements
- Contract/Tax columns are visual only (non-functional per requirements)
- Row click to detail page is omitted per requirements
