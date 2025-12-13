"""
Database Configuration & Session Management
============================================
This module handles SQLAlchemy engine creation, session factory setup,
and provides the declarative base for ORM models.

Environment Variables Required:
    DATABASE_URL: PostgreSQL connection string
                  Format: postgresql://user:password@host:port/database
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env file
# This must be called before accessing any env vars
load_dotenv()

# Retrieve database connection URL from environment
# Raises implicit error if None is passed to create_engine
DATABASE_URL = os.getenv("DATABASE_URL")

# Create SQLAlchemy engine - manages the connection pool
# For production, consider adding: pool_size, max_overflow, pool_pre_ping
engine = create_engine(DATABASE_URL)

# Session factory - creates new database sessions
# autocommit=False: Requires explicit commit() calls
# autoflush=False: Prevents automatic flush before queries (better control)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class - all ORM models inherit from this
Base = declarative_base()
