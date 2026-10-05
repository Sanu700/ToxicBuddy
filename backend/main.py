"""
Main FastAPI Application Entrypoint for ToxicBuddy 2.0
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.config import settings
from backend.logger import logger
from backend.database import engine, Base

from backend.routes import analyze, users, conversations, health
from backend.schemas import RewriteRequest, RewriteResponse
from ml.rewriter import get_rewriter

# Ensure tables exist on startup
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing ToxicBuddy 2.0 Backend...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified.")
    yield
    logger.info("Shutting down ToxicBuddy 2.0 Backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ToxicBuddy 2.0 API — End-to-End Conversational Toxicity Analysis & Moderation Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router Registrations
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(analyze.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(conversations.router, prefix=settings.API_V1_STR)

# Top-level direct health check aliases for /health and /api/health
@app.get("/health", tags=["Health"], summary="Top-level health check")
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"], summary="API health check")
def direct_health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV
    }

# Direct top-level alias for POST /api/rewrite
@app.post(f"{settings.API_V1_STR}/rewrite", response_model=RewriteResponse, tags=["Toxicity Analysis & Rewriting"], summary="Constructive text rewriting endpoint")
def top_level_rewrite(payload: RewriteRequest):
    rewriter = get_rewriter()
    return rewriter.rewrite(text=payload.text, tone=payload.target_tone or "Constructive")

@app.get("/")
def root():
    return {
        "message": "Welcome to ToxicBuddy 2.0 API",
        "documentation": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
