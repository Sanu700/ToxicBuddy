"""
API Endpoints for Conversation Reports and Historical Retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import Conversation, Message
from backend.schemas import ConversationReportResponse

router = APIRouter(prefix="/conversations", tags=["Conversations & Reports"])

@router.get("", summary="List recent analyzed conversations")
def list_conversations(db: Session = Depends(get_db)):
    """
    Returns a list of all analyzed conversations stored in the database.
    """
    convs = db.query(Conversation).order_by(Conversation.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at,
            "health_status": c.health_status,
            "overall_toxicity_score": c.overall_toxicity_score,
            "total_messages": c.total_messages,
            "toxic_messages_count": c.toxic_messages_count,
            "has_escalation": c.has_escalation
        }
        for c in convs
    ]

@router.get("/{conversation_id}/report", response_model=ConversationReportResponse, summary="Get conversation report")
def get_conversation_report(conversation_id: str, db: Session = Depends(get_db)):
    """
    Retrieves the complete report for a specific analyzed conversation.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation ID '{conversation_id}' not found."
        )

    # Fetch messages
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.message_index.asc()).all()

    flagged_messages = []
    time_series = []

    for m in messages:
        msg_dict = {
            "text": m.text,
            "sender": m.sender,
            "is_toxic": m.is_toxic,
            "overall_score": m.overall_score,
            "severity_level": m.severity_level,
            "detected_tone": m.detected_tone,
            "categories": m.categories or {},
            "flagged_categories": m.flagged_categories or [],
            "rewrites": m.rewrites or {}
        }
        if m.is_toxic:
            flagged_messages.append(msg_dict)

        time_series.append({
            "index": m.message_index,
            "sender": m.sender,
            "timestamp": m.timestamp,
            "toxicity_score": m.overall_score,
            "is_toxic": m.is_toxic
        })

    tot = conv.total_messages
    tox = conv.toxic_messages_count
    pct = round((tox / tot) * 100.0 if tot > 0 else 0.0, 2)

    return ConversationReportResponse(
        conversation_id=conv.id,
        title=conv.title,
        created_at=conv.created_at,
        health_status=conv.health_status,
        overall_toxicity_score=conv.overall_toxicity_score,
        total_messages=tot,
        toxic_messages_count=tox,
        toxic_percentage=pct,
        has_escalation=conv.has_escalation,
        participant_summary=conv.participant_summary or {},
        time_series_trend=time_series,
        escalation_indicators=conv.escalation_summary or [],
        flagged_messages=flagged_messages
    )
