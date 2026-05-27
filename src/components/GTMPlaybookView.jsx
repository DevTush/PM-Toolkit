import { Rocket, ArrowRight, Loader2, Megaphone, CalendarDays, CheckSquare, AlertTriangle, BarChart3 } from "lucide-react";

export default function GTMPlaybookView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Go-To-Market Playbook</h2>
        <p className="text-gray-400">
          Strategy: <span className="text-violet-300 font-medium">{data.launch_strategy.type}</span>
        </p>
      </div>

      {/* Launch Strategy */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
        <p className="text-sm text-gray-300 mb-2">{data.launch_strategy.rationale}</p>
        <p className="text-xs text-gray-400">Target: <span className="text-white font-medium">{data.launch_strategy.target_date}</span></p>
      </div>

      {/* Positioning */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4" /> Positioning
        </h3>
        <p className="text-sm text-white font-medium mb-2">{data.positioning.statement}</p>
        <p className="text-lg text-violet-300 font-bold mb-1">"{data.positioning.tagline}"</p>
        <p className="text-xs text-gray-400 italic">{data.positioning.elevator_pitch}</p>
      </div>

      {/* Messaging Matrix */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Messaging Matrix</h3>
        <div className="space-y-3">
          {data.messaging_matrix.map((msg, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-300">{msg.audience}</span>
              </div>
              <p className="text-xs text-red-400 mb-1">Pain: {msg.pain_point}</p>
              <p className="text-sm text-white font-medium mb-1">{msg.message}</p>
              <p className="text-xs text-green-400 mb-1">Proof: {msg.proof_point}</p>
              <p className="text-xs text-blue-400">CTA: {msg.cta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Strategy */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Channel Strategy
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.channel_strategy.map((ch, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <p className="text-sm text-white font-bold mb-1">{ch.channel}</p>
              <p className="text-xs text-gray-400 mb-2">{ch.objective}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {ch.tactics.map((t, ti) => (
                  <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{t}</span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Budget: {ch.budget}</span>
                <span>CAC: {ch.expected_cac}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{ch.timeline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Timeline */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Launch Timeline
        </h3>
        <div className="space-y-2">
          {data.launch_timeline.map((entry, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-start gap-3">
              <div className="flex-shrink-0 w-20">
                <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">{entry.week}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">{entry.phase} · {entry.owner}</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.activities.map((a, ai) => (
                    <span key={ai} className="text-xs text-gray-300">• {a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Day Checklist */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" /> Launch Day Checklist
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {data.launch_day_checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <div className="w-5 h-5 rounded border border-gray-600 flex-shrink-0" />
              <span className="text-xs text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Success Milestones</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(data.success_metrics).map(([period, val]) => (
            <div key={period} className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">{period.replace(/_/g, " ")}</p>
              <p className="text-xs text-white font-medium">{val.metric}</p>
              <p className="text-sm font-bold text-green-400">{val.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Risk Mitigation
        </h3>
        <div className="space-y-2">
          {data.risk_mitigation.map((r, i) => (
            <div key={i} className="p-3 rounded-lg border flex items-start justify-between gap-3"
              style={{ borderColor: r.likelihood === "High" ? "rgba(239,68,68,0.2)" : r.likelihood === "Medium" ? "rgba(234,179,8,0.2)" : "rgba(107,114,128,0.2)",
                       backgroundColor: r.likelihood === "High" ? "rgba(239,68,68,0.03)" : "transparent" }}>
              <div>
                <p className="text-sm text-white font-medium">{r.risk}</p>
                <p className="text-xs text-gray-400 mt-0.5">Mitigation: {r.mitigation}</p>
              </div>
              <span className={`text-xs font-bold flex-shrink-0 ${r.likelihood === "High" ? "text-red-400" : r.likelihood === "Medium" ? "text-yellow-400" : "text-gray-400"}`}>
                {r.likelihood}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button onClick={onNext} disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <>{nextLabel} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
