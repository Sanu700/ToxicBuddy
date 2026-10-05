"""
Vercel Serverless Function Entrypoint for ToxicBuddy 2.0 FastAPI Backend
"""

import sys
import os

# Add root directory to python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.main import app
