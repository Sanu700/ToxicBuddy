"""
SQLAlchemy Models for ToxicBuddy 2.0
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False, default="Chat Conversation")
    created_at = Column(DateTime, default=utc_now)
    total_messages = Column(Integer, default=0)
    toxic_messages_count = Column(Integer, default=0)
    overall_toxicity_score = Column(Float, default=0.0)
    health_status = Column(String, default="Healthy")
    has_escalation = Column(Boolean, default=False)
    participant_summary = Column(JSON, default=dict)
    escalation_summary = Column(JSON, default=list)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=True)
    sender = Column(String, nullable=False, default="User")
    text = Column(String, nullable=False)
    timestamp = Column(String, nullable=True)
    message_index = Column(Integer, default=0)
    
    is_toxic = Column(Boolean, default=False)
    overall_score = Column(Float, default=0.0)
    severity_level = Column(String, default="Clean")
    detected_tone = Column(String, default="Neutral")
    
    categories = Column(JSON, default=dict)
    flagged_categories = Column(JSON, default=list)
    rewrites = Column(JSON, default=dict)

    conversation = relationship("Conversation", back_populates="messages")

class UserStat(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    total_messages = Column(Integer, default=0)
    toxic_messages = Column(Integer, default=0)
    avg_toxicity_score = Column(Float, default=0.0)
    primary_tone = Column(String, default="Neutral")
    last_active = Column(DateTime, default=utc_now)
