# 🛡️ ToxicBuddy

> **Chat toxicity analyzer.** Detects toxic messages, generates per-user toxicity stats, and suggests healthier rewrites — making online conversations more constructive.

![ToxicBuddy](https://img.shields.io/badge/ToxicBuddy-v1.0.0-9b59b6?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat-square&logo=python)
![NLP](https://img.shields.io/badge/NLP-Text_Classification-27ae60?style=flat-square)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-f37626?style=flat-square&logo=jupyter)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-f7931e?style=flat-square&logo=scikit-learn)

---

## 🎯 What it does

ToxicBuddy analyzes chat conversations to surface toxic messages, show who is sending them, and suggest how those messages could be rewritten in a more constructive and respectful way.

---

## ✨ Features

- 🔍 **Toxicity Detection** — NLP classifier identifies toxic messages across a conversation
- 📊 **Per-User Stats** — Shows which users send the most toxic messages and how frequently
- 💬 **Chat-Level Analysis** — Ranks conversations by overall toxicity score
- ✍️ **Rewrite Suggestions** — Generates healthier, non-toxic alternatives for flagged messages
- 📈 **Visualizations** — Charts showing toxicity distribution across users and time
- 🧹 **Actionable Insights** — Helps communities identify and address toxic patterns early

---

## 🚀 Getting Started

### Prerequisites

```bash
pip install pandas numpy scikit-learn matplotlib seaborn jupyter
```

### Installation

```bash
git clone https://github.com/Sanu700/ToxicBuddy.git
cd ToxicBuddy
pip install -r requirements.txt
jupyter notebook
```

---

## 🏗️ Project Structure

```
ToxicBuddy/
├── notebooks/
│   ├── 01_data_exploration.ipynb    # EDA on chat data
│   ├── 02_toxicity_classifier.ipynb # NLP model training
│   ├── 03_user_stats.ipynb          # Per-user analysis
│   └── 04_rewrite_suggestions.ipynb # Message rewriting
├── src/
│   ├── classifier.py                # Toxicity detection model
│   ├── stats.py                     # User and chat statistics
│   └── rewriter.py                  # Rewrite suggestion engine
├── data/
│   └── sample_chats.csv             # Sample dataset
└── requirements.txt
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.10+ |
| NLP / ML | scikit-learn, NLTK |
| Data Processing | pandas, NumPy |
| Visualization | Matplotlib, Seaborn |
| Environment | Jupyter Notebook |

---

## 📊 How It Works

```
Input: Raw chat messages (CSV / JSON)
         ↓
Step 1: Preprocess text (clean, tokenize, vectorize)
         ↓
Step 2: Classify each message (toxic / not toxic)
         ↓
Step 3: Aggregate stats per user and per chat
         ↓
Step 4: Generate rewrite suggestions for toxic messages
         ↓
Output: Toxicity report + visualizations + rewrites
```

---

## 🧩 Use Cases

- 🎮 Moderation tooling for gaming and online communities
- 💼 Workplace chat health monitoring
- 🔬 Research into online communication patterns
- 🏫 Educational tool for digital citizenship

---

## 📄 License

MIT — feel free to use and build on this project.
