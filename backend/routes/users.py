"""
API Endpoint for User Toxicity Statistics
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from backend.database import get_db
from backend.models import UserStat
from backend.schemas import UserStatsResponse

router = APIRouter(prefix="/users", tags=["User Statistics"])

@router.get("/{user_id}/stats", response_model=UserStatsResponse, summary="Get user-level toxicity statistics")
def get_user_stats(user_id: str, db: Session = Depends(get_db)):
    """
    Returns aggregated toxicity statistics, risk levels, and activity metrics for a given user.
    """
    db_user = db.query(UserStat).filter(UserStat.user_id == user_id).first()
    if not db_user:
        return UserStatsResponse(
            user_id=user_id,
            total_messages=0,
            toxic_messages=0,
            toxic_percentage=0.0,
            avg_toxicity_score=0.0,
            primary_tone="Neutral",
            risk_level="Low",
            last_active=datetime.now(timezone.utc)
        )

    tot = db_user.total_messages
    tox = db_user.toxic_messages
    pct = round((tox / tot) * 100.0 if tot > 0 else 0.0, 2)
    avg_s = db_user.avg_toxicity_score

    if avg_s >= 0.55 or pct >= 40.0:
        risk = "High"
    elif avg_s >= 0.25 or pct >= 15.0:
        risk = "Medium"
    else:
        risk = "Low"

    return UserStatsResponse(
        user_id=db_user.user_id,
        total_messages=tot,
        toxic_messages=tox,
        toxic_percentage=pct,
        avg_toxicity_score=avg_s,
        primary_tone=db_user.primary_tone,
        risk_level=risk,
        last_active=db_user.last_active
    )
