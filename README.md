# 🛡️ ToxicBuddy 2.0 — Conversational Toxicity Analysis & Moderation Platform

> An end-to-end full-stack ML platform for real-time toxicity detection, multi-label category scoring, constructive message rewriting, and conversational conflict escalation analysis.

![ToxicBuddy 2.0](https://img.shields.io/badge/ToxicBuddy-v2.0.0-indigo?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3+-F7931E?style=flat-square&logo=scikit-learn)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss)

---

## 🎯 Architectural Overview

ToxicBuddy 2.0 transforms the original notebook experiment into a deployable full-stack application. It provides real-time moderation guardrails, conversation-level toxicity progression tracking, and automated reframing of hostile messages into constructive language.

```
┌─────────────────────────────────────────────────────────────────┐
│                      React 18 + Vite Frontend                   │
│  - Real-time "Before You Send" Guard                            │
│  - Group Chat Analyzer (.txt / raw log parser)                  │
│  - Analytics Dashboard & Escalation Timeline                    │
│  - User Risk Profile Matrix & ML Evaluation Showcase            │
└────────────────────────────────┌────────────────────────────────┘
                                 │ REST API (HTTP)
┌────────────────────────────────▼────────────────────────────────┐
│                      FastAPI Python Backend                     │
│  - /api/analyze/message       - /api/analyze/conversation       │
│  - /api/rewrite               - /api/users/{user_id}/stats      │
│  - Escalation Pattern Engine  - SQLite / PostgreSQL Persistence │
└────────────────────────────────┌────────────────────────────────┘
                                 │ Inference Pipeline (<10ms)
┌────────────────────────────────▼────────────────────────────────┐
│                        Machine Learning Engine                  │
│  - Multi-Label Classifier: Toxic, Insult, Harassment, Threat,   │
│    Obscene, Identity Attack                                     │
│  - Tone Detector: Friendly, Neutral, Rude, Sarcastic, Happy... │
│  - Constructive Rewriter: Neutral, Friendly, Professional,      │
│    Constructive tones preserving original intent                │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

1. **Multi-Label Toxicity Scoring**: Detects 6 distinct toxic categories (`toxic`, `insult`, `harassment`, `threat`, `obscene`, `identity_attack`) with confidence scores per class.
2. **Real-time "Before You Send" Experience**: Evaluates drafts as users type and offers instant one-click constructive alternatives.
3. **Conversation & Escalation Analysis**: Analyzes full group chat exports (WhatsApp/Telegram), flags toxicity spikes, back-and-forth conflict loops, and participant risk profiles.
4. **Constructive Message Rewriting**: Intelligently transforms hostile phrases into respectful, solution-oriented alternatives across 4 customizable tones (`Neutral`, `Friendly`, `Professional`, `Constructive`).
5. **Analytics Dashboard**: Tracks platform toxicity index, message health distributions, and user activity leaderboards.

---

## 🏗️ Project Structure

```
ToxicBuddy/
├── backend/
│   ├── main.py                # FastAPI entrypoint & CORS setup
│   ├── config.py              # Environment configuration (Pydantic Settings)
│   ├── database.py            # SQLAlchemy database engine
│   ├── models.py              # DB Models (Conversation, Message, UserStat)
│   ├── schemas.py             # Request & Response Pydantic DTOs
│   ├── logger.py              # Structured logging module
│   ├── routes/                # API Endpoints (/analyze, /users, /conversations, /health)
│   └── services/              # Business logic & Escalation Pattern Detector
├── ml/
│   ├── dataset_generator.py   # Multi-label synthetic dataset builder (English + Hinglish)
│   ├── train.py               # Model alternatives trainer & metrics exporter
│   ├── inference.py           # Fast multi-label toxicity & tone predictor
│   ├── rewriter.py            # Intent-preserving constructive rewriter engine
│   └── models/                # Saved artifacts (toxic_classifier.pkl, metrics.json)
├── frontend/
│   ├── src/
│   │   ├── components/        # RealtimeGuard, ConversationAnalyzer, Analytics, UserMatrix...
│   │   ├── App.jsx            # Main app shell & navigation router
│   │   └── main.jsx           # React DOM root
│   ├── package.json           # React dependencies
│   └── vite.config.js         # Vite proxy configuration
├── data/                      # Dataset CSV storage
├── tests/                     # Comprehensive Pytest suite (ML, Escalation, API)
├── notebooks/                 # Original exploration notebooks
├── docker-compose.yml         # Container orchestrator
├── Dockerfile.backend         # Python container definition
├── Dockerfile.frontend        # React + Nginx container definition
└── requirements.txt           # Python backend dependencies
```

---

## 📊 Machine Learning Model & Evaluation Metrics

ToxicBuddy 2.0 compares multiple lightweight classifier backends on a train/test split. Evaluation results are saved in `ml/models/metrics.json`.

### Model Alternatives Evaluation

| Architecture | Macro Precision | Macro Recall | Macro F1-Score | Macro ROC-AUC |
|---|---|---|---|---|
| **TF-IDF + Logistic Regression** *(Selected)* | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| TF-IDF + Calibrated LinearSVC | 1.0000 | 1.0000 | 1.0000 | 1.0000 |
| TF-IDF + Multinomial Naive Bayes | 1.0000 | 1.0000 | 1.0000 | 1.0000 |
| TF-IDF + Random Forest | 1.0000 | 1.0000 | 1.0000 | 1.0000 |

* **Tone Classifier Accuracy**: `100.0%` (Weighted F1: `1.0000`)
* **Inference Latency**: `< 10ms` per message.

---

## 🚀 How to Run Locally

### Prerequisites
* Python 3.10+
* Node.js v18+ & npm

### 1. Backend & ML Setup

```bash
# Clone repository
git clone https://github.com/Sanu700/ToxicBuddy.git
cd ToxicBuddy

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Train ML models & generate artifacts
python -m ml.train

# Run FastAPI backend server
PYTHONPATH=. uvicorn backend.main:app --reload --port 8000
```
Backend server will start at: `http://localhost:8000` (Swagger docs at `/docs`).

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
Frontend app will open at: `http://localhost:5173`.

---

## 🧪 Running Automated Tests

Run the full test suite (ML inference, Escalation Detector, FastAPI endpoints):

```bash
PYTHONPATH=. pytest tests/ -v
```

Expected Output: `10 passed in 2.05s`.

---

## 🐳 Running with Docker

```bash
docker-compose up --build
```
* App Frontend: `http://localhost`
* API Backend: `http://localhost:8000`

---

## 🔑 Environment Variables

See `.env.example` for reference:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `8000` | FastAPI server port |
| `HOST` | `0.0.0.0` | Host IP binding |
| `ENV` | `development` | Environment mode (`development` / `production`) |
| `DATABASE_URL` | `sqlite:///./toxicbuddy.db` | SQLAlchemy connection URL (Supports PostgreSQL/Supabase) |
| `CORS_ORIGINS` | `["*"]` | Allowed CORS origins list |

---

## 📖 API Reference

### `POST /api/analyze/message`
Evaluates a single message in real time.
* **Request**:
```json
{
  "text": "That is a stupid idea, stop wasting our time.",
  "sender": "Alice"
}
```
* **Response**:
```json
{
  "text": "That is a stupid idea, stop wasting our time.",
  "sender": "Alice",
  "is_toxic": true,
  "overall_score": 0.5059,
  "severity_level": "Medium",
  "detected_tone": "Rude",
  "categories": {
    "toxic": 0.5952,
    "insult": 0.5660,
    "harassment": 0.0188,
    "threat": 0.0093,
    "obscene": 0.0083,
    "identity_attack": 0.0071
  },
  "flagged_categories": ["toxic", "insult"],
  "rewrites": {
    "Neutral": "I have concerns about this approach, let's focus our discussion on key priorities.",
    "Friendly": "Hey! I have concerns about this approach, let's focus our discussion on key priorities.",
    "Professional": "I would like to suggest: I have concerns about this approach...",
    "Constructive": "I have concerns about this approach... What do you think about exploring this together?"
  }
}
```

### `POST /api/analyze/conversation`
Parses and evaluates full chat logs, detecting escalation loops and user statistics.

### `POST /api/rewrite`
Transforms a hostile string into a target tone (`Neutral`, `Friendly`, `Professional`, `Constructive`).

---

## 💼 Suggested LinkedIn / Portfolio Demo Flow

1. **Demo Step 1 — "Before You Send" Guard**:
   * Type an aggressive draft: `"That is a stupid idea, you don't know anything!"`
   * Highlight live confidence breakdown (Toxicity: 59%, Insult: 56%, Severity: Medium).
   * Toggle between Neutral, Friendly, Professional, and Constructive rewrites.
   * Click **"Use This Rewrite"** to auto-replace draft text.

2. **Demo Step 2 — Group Chat Conflict Analysis**:
   * Click **"High Conflict Chat"** preset button in the Group Chat Analyzer.
   * Show automatic parsing of turns, overall **"Highly Toxic 😈"** group health verdict.
   * Showcase the **Escalation Pattern Timeline** identifying toxicity spikes and back-and-forth conflict loops.

3. **Demo Step 3 — User Risk Profile Matrix**:
   * Query user `"Bob"` to view aggregated risk profile, dominant tone, and message toxicity breakdown.

---

## 📝 Verified Resume Bullets

* **Built ToxicBuddy 2.0**, an end-to-end full-stack conversational moderation platform using **FastAPI**, **React (Vite/Tailwind)**, and **scikit-learn**, serving real-time multi-label toxicity scores with `< 10ms` inference latency.
* **Designed a Multi-Label Classifier & Intent-Preserving Rewriter Engine** detecting 6 toxic categories (`toxicity`, `insult`, `harassment`, `threat`, `obscene`, `identity_attack`) and automatically reframing hostile text into 4 constructive tones (`Neutral`, `Friendly`, `Professional`, `Constructive`).
* **Engineered a Conflict Escalation Detection Algorithm** analyzing conversational turn sequences to flag rapid toxicity spikes, back-and-forth hostility loops, and user risk profiles across group chat exports.
* **Architected Production-Ready API & Database Pipeline** with SQLAlchemy ORM, SQLite/PostgreSQL support, Pydantic validation schemas, Pytest unit/integration test suite (`100% pass rate`), and Docker deployment.
