import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { getApiUrl } from '../config';

export default function AnalyticsDashboard() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/conversations'));
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAnalyzed = conversations.length;
  const totalMsgs = conversations.reduce((acc, c) => acc + c.total_messages, 0);
  const totalToxicMsgs = conversations.reduce((acc, c) => acc + c.toxic_messages_count, 0);
  const avgToxicity = totalAnalyzed > 0
    ? (conversations.reduce((acc, c) => acc + c.overall_toxicity_score, 0) / totalAnalyzed * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-zinc-400 font-mono font-bold">CONVERSATIONS</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-100 mt-1">{totalAnalyzed}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-zinc-400 font-mono font-bold">TOTAL MESSAGES</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-100 mt-1">{totalMsgs}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-zinc-400 font-mono font-bold">PLATFORM TOXICITY</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-1">{avgToxicity}%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-zinc-400 font-mono font-bold">FLAGGED MESSAGES</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 mt-1">{totalToxicMsgs}</p>
        </div>
      </div>

      {/* Conversations Log Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Recent Conversations Log</h3>
          <button
            onClick={fetchConversations}
            className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-mono transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-400 font-mono">Loading records...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-400 font-mono">No conversations analyzed yet.</div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-300 font-mono">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-sans font-semibold text-xs">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Health Status</th>
                  <th className="p-3">Toxicity Score</th>
                  <th className="p-3">Messages</th>
                  <th className="p-3">Toxic Msgs</th>
                  <th className="p-3">Escalation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
                {conversations.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/50 transition">
                    <td className="p-3 font-sans font-bold text-zinc-100">{c.title}</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        c.health_status === 'Healthy' ? 'text-emerald-300 bg-emerald-950/80' :
                        c.health_status === 'Moderately Toxic' ? 'text-amber-300 bg-amber-950/80' :
                        'text-red-300 bg-red-950/80'
                      }`}>
                        {c.health_status}
                      </span>
                    </td>
                    <td className="p-3">{(c.overall_toxicity_score * 100).toFixed(1)}%</td>
                    <td className="p-3">{c.total_messages}</td>
                    <td className="p-3 text-red-400 font-bold">{c.toxic_messages_count}</td>
                    <td className="p-3 font-sans text-zinc-300">
                      {c.has_escalation ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
