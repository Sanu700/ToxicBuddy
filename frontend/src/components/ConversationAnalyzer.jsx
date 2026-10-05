import React, { useState } from 'react';
import { Upload, RefreshCw, Copy, Check, MessageSquare } from 'lucide-react';

export default function ConversationAnalyzer() {
  const [rawText, setRawText] = useState('');
  const [chatTitle, setChatTitle] = useState('Project Team Standup Chat');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRewriteTone, setActiveRewriteTone] = useState({});

  const presetChats = {
    conflict: `Alice: Great job on the sprint demo today team!
Bob: Your demo was garbage and ruined our presentation.
Alice: Stop being so rude and useless Bob!
Charlie: Everyone calm down, let's look at the metrics.
Bob: Shut up Charlie, you don't know anything either.
Alice: I will make sure management hears about this!`,
    workplace: `Sarah: Meeting starts at 3 PM in Conference Room B.
David: I will bring the updated slide deck.
Sarah: Thanks David! Appreciate the quick turn around.
Alex: I have finished testing the database migration.
Sarah: Wonderful work everyone, see you at 3 PM!`,
    hinglish: `Rahul: Arey yaar, mast kaam kiya today!
Priya: Thanks bhai, team effort top class.
Vikas: Kya bakwaas kar raha hai tu Vikas, total waste idea.
Rahul: Calm down bhai, let's discuss calmly.`
  };

  const loadPreset = (key, title) => {
    setRawText(presetChats[key]);
    setChatTitle(title);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setChatTitle(file.name.replace('.txt', ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawText(event.target.result);
    };
    reader.readAsText(file);
  };

  const analyzeConversation = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: chatTitle || 'Group Chat Analysis',
          raw_chat_text: rawText
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Error analyzing conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Conversations</h1>
          <p className="text-base text-zinc-300 mt-1">Upload or paste chat logs to inspect group toxicity and conflict escalation.</p>
        </div>

        {/* Presets */}
        <div className="flex items-center space-x-2 text-xs font-medium">
          <span className="text-zinc-400 font-mono">Presets:</span>
          <button
            onClick={() => loadPreset('conflict', 'High Conflict Chat')}
            className="text-zinc-200 hover:text-orange-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded transition font-mono"
          >
            Conflict
          </button>
          <button
            onClick={() => loadPreset('workplace', 'Workplace Standup')}
            className="text-zinc-200 hover:text-orange-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded transition font-mono"
          >
            Workplace
          </button>
          <button
            onClick={() => loadPreset('hinglish', 'Hinglish Chat')}
            className="text-zinc-200 hover:text-orange-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded transition font-mono"
          >
            Hinglish
          </button>
        </div>
      </div>

      {/* Input Workspace */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            placeholder="Conversation Title"
            className="sm:col-span-8 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500/70"
          />
          <label className="sm:col-span-4 flex items-center justify-center border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-4 py-2.5 rounded-lg cursor-pointer text-xs font-semibold text-zinc-200 transition">
            <Upload className="w-4 h-4 text-orange-400 mr-2" />
            <span>Upload .txt File</span>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={6}
          placeholder="Paste chat messages (e.g. Alice: Hello\nBob: Hi)..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 placeholder-zinc-500 font-mono focus:outline-none focus:border-orange-500/70"
        />

        <div className="flex justify-end">
          <button
            onClick={analyzeConversation}
            disabled={loading || !rawText.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            <span>Analyze Conversation</span>
          </button>
        </div>
      </div>

      {/* Report */}
      {report && (
        <div className="space-y-8 pt-6 border-t border-zinc-800">
          
          {/* Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">{report.title}</h2>
              <p className="text-sm text-zinc-300 mt-1">
                {report.total_messages} messages • {report.toxic_messages_count} toxic ({report.toxic_percentage}%)
              </p>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <span className={`px-3 py-1 rounded-md font-bold border ${
                report.health_status === 'Healthy' ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800' :
                report.health_status === 'Moderately Toxic' ? 'text-amber-300 bg-amber-950/80 border-amber-800' :
                'text-red-300 bg-red-950/80 border-red-800'
              }`}>
                {report.health_status}
              </span>
              <span className="font-mono text-zinc-100 font-extrabold text-base">
                {(report.overall_toxicity_score * 100).toFixed(1)}% Index
              </span>
            </div>
          </div>

          {/* Participant Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">Participants</h3>
            <div className="border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-zinc-300 font-mono">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-sans font-semibold text-xs">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Messages</th>
                    <th className="p-3">Toxic Msgs</th>
                    <th className="p-3">Toxic %</th>
                    <th className="p-3">Dominant Tone</th>
                    <th className="p-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
                  {Object.values(report.participant_summary).map((p) => (
                    <tr key={p.user_id} className="hover:bg-zinc-900/50 transition">
                      <td className="p-3 font-sans font-bold text-zinc-100">{p.user_id}</td>
                      <td className="p-3">{p.total_messages}</td>
                      <td className="p-3 text-red-400 font-bold">{p.toxic_messages}</td>
                      <td className="p-3">{p.toxic_percentage}%</td>
                      <td className="p-3 font-sans text-zinc-300">{p.dominant_tone}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          p.risk_level === 'High' ? 'text-red-400 bg-red-950/60' :
                          p.risk_level === 'Medium' ? 'text-amber-400 bg-amber-950/60' :
                          'text-emerald-400 bg-emerald-950/60'
                        }`}>
                          {p.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Escalation Indicators */}
          {report.escalation_indicators.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-400">Escalation Indicators</h3>
              <div className="space-y-2">
                {report.escalation_indicators.map((esc, idx) => (
                  <div key={idx} className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{esc.type}</span>
                      <span className="font-mono text-xs text-amber-400 font-bold uppercase">{esc.severity}</span>
                    </div>
                    <p className="text-zinc-200">{esc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged Messages */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">Flagged Messages</h3>
            
            {report.flagged_messages.length === 0 ? (
              <p className="text-sm text-zinc-400">No toxic messages flagged in this chat.</p>
            ) : (
              <div className="space-y-4">
                {report.flagged_messages.map((msg, idx) => {
                  const currentTone = activeRewriteTone[idx] || 'Constructive';
                  return (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="font-sans font-bold text-base text-red-400">{msg.sender}</span>
                          <span className="text-zinc-400 text-xs">{(msg.overall_score * 100).toFixed(1)}% toxicity</span>
                        </div>
                        <div className="flex gap-1.5 font-mono">
                          {msg.flagged_categories.map((cat) => (
                            <span key={cat} className="text-xs bg-red-950/80 text-red-300 border border-red-800/80 px-2 py-0.5 rounded font-semibold capitalize">
                              {cat.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-zinc-200 bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 font-mono">
                        "{msg.text}"
                      </div>

                      {/* Rewrite suggestion */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-400 font-bold">Constructive suggestion:</span>
                          <div className="flex space-x-1">
                            {['Constructive', 'Professional', 'Friendly', 'Neutral'].map((tone) => (
                              <button
                                key={tone}
                                onClick={() => setActiveRewriteTone({ ...activeRewriteTone, [idx]: tone })}
                                className={`text-xs px-2.5 py-1 rounded font-medium ${
                                  currentTone === tone ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-zinc-100 bg-zinc-950/80 p-3.5 rounded-lg border border-orange-500/20 font-medium">
                          "{msg.rewrites[currentTone] || msg.text}"
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
