import React, { useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import UserStatsMatrix from './UserStatsMatrix';
import MLMetricsView from './MLMetricsView';

export default function InsightsView() {
  const [activeSubTab, setActiveSubTab] = useState('analytics');

  const subTabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'User Risk' },
    { id: 'ml', label: 'ML Metrics' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Title & Sub-navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Insights</h1>
          <p className="text-base text-zinc-300 mt-1">Platform analytics, user moderation risk profiles, and model metrics.</p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-1.5 rounded-md transition ${
                activeSubTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === 'analytics' && <AnalyticsDashboard />}
      {activeSubTab === 'users' && <UserStatsMatrix />}
      {activeSubTab === 'ml' && <MLMetricsView />}

    </div>
  );
}
