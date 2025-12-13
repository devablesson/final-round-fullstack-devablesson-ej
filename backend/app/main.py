"""
Main FastAPI Application Entry Point
=====================================
This module initializes the FastAPI application, configures middleware,
registers routers, and sets up the database connection on startup.

Usage:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .routers import vendors

# Initialize FastAPI app with metadata for OpenAPI documentation
app = FastAPI(
    title="Vendors API",
    version="1.0.0",
    description="RESTful API for managing vendor data with search, sort, and CRUD operations",
)

# Configure CORS to allow frontend requests
# In production, replace "*" with specific origins like ["https://yourapp.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Create all database tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

# Register API routers - each router handles a specific resource domain
app.include_router(vendors.router)


@app.get("/health", tags=["Health"])
def health():
    """
    Health check endpoint for load balancers and monitoring services.
    Returns a simple status object to confirm the API is responsive.
    """
    return {"status": "ok"}
