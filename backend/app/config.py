"""
Application Configuration
=========================
Centralized configuration management for the application.

This module would typically contain:
    - Environment variable loading
    - Feature flags
    - API keys and secrets (via environment variables)
    - Database connection settings
    - Third-party service configurations

Currently, database configuration is handled directly in database.py
using python-dotenv for simplicity. For larger applications, consider
using Pydantic's BaseSettings for type-safe configuration management.

Example usage with Pydantic:
    from pydantic_settings import BaseSettings
    
    class Settings(BaseSettings):
        database_url: str
        debug: bool = False
        
        class Config:
            env_file = ".env"
    
    settings = Settings()
"""
