import React from 'react';
import { Shield } from 'lucide-react';

export default function Navbar({ mainTab, setMainTab, apiStatus }) {
  const navItems = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'conversations', label: 'Conversations' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setMainTab('analyze')}>
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-zinc-950 font-bold shadow-sm">
              <Shield className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zinc-100 text-lg tracking-tight">VibeCheck</span>
              
            </div>
          </div>

          {/* CENTER: Main Nav */}
          <nav className="flex space-x-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
            {navItems.map((item) => {
              const isActive = mainTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setMainTab(item.id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: API Status */}
          <div className="flex items-center space-x-2 text-xs text-zinc-300 border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-md">
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-xs text-zinc-300 font-medium">API: {apiStatus}</span>
          </div>

        </div>
      </div>
    </header>
  );
}
