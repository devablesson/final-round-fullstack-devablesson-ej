"""
Vendors API Application Package
===============================
This package contains the FastAPI application for managing vendor data.

Modules:
    main        - FastAPI application entry point and middleware configuration
    config      - Environment variables and application settings
    database    - SQLAlchemy engine and session management
    models      - ORM model definitions (Vendor entity)
    schemas     - Pydantic request/response validation schemas
    crud        - Database CRUD operations
    seed        - Database seeding utilities
    routers/    - API endpoint definitions

Usage:
    uvicorn app.main:app --reload
"""
