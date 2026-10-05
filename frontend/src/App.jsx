import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RealtimeGuard from './components/RealtimeGuard';
import ConversationAnalyzer from './components/ConversationAnalyzer';
import InsightsView from './components/InsightsView';

export default function App() {
  const [mainTab, setMainTab] = useState('analyze');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('degraded');
      }
    } catch (err) {
      setApiStatus('offline');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar mainTab={mainTab} setMainTab={setMainTab} apiStatus={apiStatus} />

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {mainTab === 'analyze' && <RealtimeGuard />}
        {mainTab === 'conversations' && <ConversationAnalyzer />}
        {mainTab === 'insights' && <InsightsView />}
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-5 text-zinc-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <span>ToxicBuddy 2.0 • Conversational Toxicity Analysis & Moderation Engine</span>
          <span>FastAPI • React • Vite • Scikit-Learn</span>
        </div>
      </footer>
    </div>
  );
}
