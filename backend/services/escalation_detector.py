"""
Escalation Detector for ToxicBuddy 2.0
Analyzes conversation message flow to identify toxicity escalation patterns,
conflict loops, and rapid hostility spikes.
"""

from typing import List, Dict

class EscalationDetector:
    """
    Identifies patterns of conflict escalation across conversational turns.
    """

    def detect_escalations(self, messages: List[Dict]) -> List[Dict]:
        """
        Analyzes a list of message objects (with index, sender, overall_score, is_toxic, categories).
        Returns a list of detected escalation indicators.
        """
        indicators = []
        if len(messages) < 2:
            return indicators

        # 1. Toxicity Spikes
        for i in range(1, len(messages)):
            prev_score = messages[i - 1].get("overall_score", 0.0)
            curr_score = messages[i].get("overall_score", 0.0)
            diff = curr_score - prev_score

            if diff >= 0.40 and curr_score >= 0.50:
                indicators.append({
                    "type": "Toxicity Spike",
                    "description": f"Toxicity rapidly escalated from {prev_score:.2f} to {curr_score:.2f} at message #{i + 1} by {messages[i].get('sender', 'User')}.",
                    "message_indexes": [i - 1, i],
                    "severity": "Medium" if curr_score < 0.80 else "High"
                })

        # 2. Conflict Loops (Back-and-Forth Toxicity)
        toxic_indices = [idx for idx, m in enumerate(messages) if m.get("is_toxic", False)]
        if len(toxic_indices) >= 3:
            # Check for consecutive toxic messages between different participants
            for i in range(len(toxic_indices) - 2):
                idx1, idx2, idx3 = toxic_indices[i], toxic_indices[i+1], toxic_indices[i+2]
                if (idx3 - idx1) <= 4:
                    s1 = messages[idx1].get("sender")
                    s2 = messages[idx2].get("sender")
                    s3 = messages[idx3].get("sender")
                    if s1 != s2 or s2 != s3:
                        indicators.append({
                            "type": "Back-and-Forth Conflict Loop",
                            "description": f"Hostile exchange detected between {s1} and {s2} across messages #{idx1 + 1} to #{idx3 + 1}.",
                            "message_indexes": [idx1, idx2, idx3],
                            "severity": "High"
                        })
                        break  # Report primary loop to avoid redundancy

        # 3. Severe Flag Escalation (Threat / Identity Attack / Harassment)
        for idx, m in enumerate(messages):
            categories = m.get("categories", {})
            threat_score = categories.get("threat", 0.0)
            harassment_score = categories.get("harassment", 0.0)
            identity_score = categories.get("identity_attack", 0.0)

            if threat_score >= 0.50 or identity_score >= 0.50 or harassment_score >= 0.60:
                indicators.append({
                    "type": "Severe Harm Indicator",
                    "description": f"Critical toxicity category (Threat / Harassment / Identity Attack) triggered at message #{idx + 1} by {m.get('sender', 'User')}.",
                    "message_indexes": [idx],
                    "severity": "Critical"
                })

        return indicators

# Singleton instance
_escalation_detector = None

def get_escalation_detector() -> EscalationDetector:
    global _escalation_detector
    if _escalation_detector is None:
        _escalation_detector = EscalationDetector()
    return _escalation_detector
