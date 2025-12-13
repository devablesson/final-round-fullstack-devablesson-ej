"""
API Routers Package
===================
This package contains FastAPI router modules that define API endpoints.

Each router handles a specific domain/resource:
    - vendors.py: Vendor CRUD operations and listing

Routers are registered in main.py using app.include_router().
All routes are automatically prefixed with their resource name
(e.g., /vendors for the vendors router).
"""
