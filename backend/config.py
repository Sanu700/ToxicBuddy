"""
Configuration Settings for ToxicBuddy 2.0 Backend
Reads settings from environment variables or defaults.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ToxicBuddy 2.0"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Server Settings
    ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Database
    DATABASE_URL: str = "sqlite:///./toxicbuddy.db"
    
    # CORS Origins (Explicit Vercel Production & Local Development)
    CORS_ORIGINS: List[str] = [
        "https://toxicbuddy.vercel.app",
        "https://toxicbuddy-two.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "*"
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
