import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function UserStatsMatrix() {
  const [userId, setUserId] = useState('Bob');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserStats = async (idToSearch) => {
    const id = idToSearch || userId;
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}/stats`);
      const data = await res.json();
      setUserStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Search Bar */}
      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Search User ID (e.g. Alice, Bob)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-orange-500/70"
          />
        </div>
        <button
          onClick={() => fetchUserStats(userId)}
          className="bg-orange-500 hover:bg-orange-600 text-zinc-950 text-sm font-bold px-4 py-2 rounded-lg transition"
        >
          Lookup User
        </button>
      </div>

      {/* User Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">User Profile Record</h3>
        
        <div className="border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-zinc-300 font-mono">
            <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-sans font-semibold text-xs">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Messages</th>
                <th className="p-3">Toxic Msgs</th>
                <th className="p-3">Toxic %</th>
                <th className="p-3">Avg Score</th>
                <th className="p-3">Primary Tone</th>
                <th className="p-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-950">
              {userStats ? (
                <tr className="hover:bg-zinc-900/50 transition">
                  <td className="p-3 font-sans font-bold text-zinc-100">{userStats.user_id}</td>
                  <td className="p-3">{userStats.total_messages}</td>
                  <td className="p-3 text-red-400 font-bold">{userStats.toxic_messages}</td>
                  <td className="p-3">{userStats.toxic_percentage}%</td>
                  <td className="p-3">{(userStats.avg_toxicity_score * 100).toFixed(1)}%</td>
                  <td className="p-3 font-sans text-zinc-300">{userStats.primary_tone}</td>
                  <td className="p-3 font-sans">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      userStats.risk_level === 'High' ? 'text-red-300 bg-red-950/80' :
                      userStats.risk_level === 'Medium' ? 'text-amber-300 bg-amber-950/80' :
                      'text-emerald-300 bg-emerald-950/80'
                    }`}>
                      {userStats.risk_level} Risk
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-zinc-400 font-sans">
                    Lookup a User ID above to inspect moderation stats.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
