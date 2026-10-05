"""
Unit Tests for Escalation Pattern Detector
"""

import pytest
from backend.services.escalation_detector import get_escalation_detector

def test_escalation_detection_spike():
    detector = get_escalation_detector()
    messages = [
        {"sender": "Alice", "overall_score": 0.05, "is_toxic": False},
        {"sender": "Bob", "overall_score": 0.85, "is_toxic": True, "categories": {"toxic": 0.9, "insult": 0.8}}
    ]

    indicators = detector.detect_escalations(messages)
    assert len(indicators) > 0
    assert any(ind["type"] == "Toxicity Spike" for ind in indicators)

def test_escalation_conflict_loop():
    detector = get_escalation_detector()
    messages = [
        {"sender": "Alice", "overall_score": 0.70, "is_toxic": True},
        {"sender": "Bob", "overall_score": 0.75, "is_toxic": True},
        {"sender": "Alice", "overall_score": 0.80, "is_toxic": True}
    ]

    indicators = detector.detect_escalations(messages)
    assert len(indicators) > 0
    assert any("Conflict Loop" in ind["type"] for ind in indicators)
