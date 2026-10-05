"""
Unit Tests for ML Inference and Constructive Rewriter Modules
"""

import pytest
from ml.inference import get_analyzer
from ml.rewriter import get_rewriter

@pytest.fixture(scope="module")
def analyzer():
    return get_analyzer()

@pytest.fixture(scope="module")
def rewriter():
    return get_rewriter()

def test_toxic_message_analysis(analyzer):
    toxic_text = "That is a stupid idea, you do not know anything!"
    result = analyzer.analyze_message(toxic_text)

    assert result["is_toxic"] is True
    assert result["overall_score"] > 0.40
    assert result["severity_level"] in ["Medium", "High", "Critical"]
    assert "toxic" in result["categories"]
    assert "insult" in result["categories"]
    assert len(result["flagged_categories"]) > 0

def test_clean_message_analysis(analyzer):
    clean_text = "Hey team, great job on the quarterly release today!"
    result = analyzer.analyze_message(clean_text)

    assert result["is_toxic"] is False
    assert result["overall_score"] < 0.30
    assert result["severity_level"] == "Clean"
    assert result["detected_tone"] in ["Friendly", "Happy"]

def test_constructive_rewriter(rewriter):
    toxic_text = "That is a stupid idea, stop wasting our time."
    
    # Test Neutral tone
    rw_neutral = rewriter.rewrite(toxic_text, "Neutral")
    assert rw_neutral["changes_applied"] is True
    assert "stupid" not in rw_neutral["rewritten_text"].lower()

    # Test Friendly tone
    rw_friendly = rewriter.rewrite(toxic_text, "Friendly")
    assert rw_friendly["target_tone"] == "Friendly"
    assert rw_friendly["rewritten_text"].startswith("Hey!")

    # Test Professional tone
    rw_prof = rewriter.rewrite(toxic_text, "Professional")
    assert rw_prof["target_tone"] == "Professional"
    assert rw_prof["rewritten_text"].startswith("I would like to suggest:")

    # Test Constructive tone
    rw_const = rewriter.rewrite(toxic_text, "Constructive")
    assert rw_const["target_tone"] == "Constructive"
    assert "exploring" in rw_const["rewritten_text"].lower() or "together" in rw_const["rewritten_text"].lower()
