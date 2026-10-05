"""
Health Check API Endpoint
"""

from fastapi import APIRouter
from backend.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV
    }
