import { Rocket, ArrowRight, Loader2, Megaphone, CalendarDays, CheckSquare, AlertTriangle, BarChart3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function GTMPlaybookView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Go-To-Market Playbook</h2>
        <p className="text-gray-500">
          Strategy: <span className="text-indigo-600 font-medium">{data.launch_strategy.type}</span>
        </p>
      </div>

      {/* Launch Strategy */}
      <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-sm text-gray-700 mb-2">{data.launch_strategy.rationale}</p>
        <p className="text-xs text-gray-500">Target: <span className="text-gray-900 font-medium">{data.launch_strategy.target_date}</span></p>
      </div>

      {/* Positioning */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <SectionHeader icon={Megaphone} title="Positioning" moduleKey={moduleKey} sectionKey="positioning" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <p className="text-sm text-gray-900 font-medium mb-2">{data.positioning.statement}</p>
        <p className="text-lg text-indigo-600 font-bold mb-1">"{data.positioning.tagline}"</p>
        <p className="text-xs text-gray-500 italic">{data.positioning.elevator_pitch}</p>
      </div>

      {/* Messaging Matrix */}
      <div>
        <SectionHeader title="Messaging Matrix" moduleKey={moduleKey} sectionKey="messaging_matrix" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-3">
          {data.messaging_matrix.map((msg, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">{msg.audience}</span>
              </div>
              <p className="text-xs text-red-600 mb-1">Pain: {msg.pain_point}</p>
              <p className="text-sm text-gray-900 font-medium mb-1">{msg.message}</p>
              <p className="text-xs text-emerald-600 mb-1">Proof: {msg.proof_point}</p>
              <p className="text-xs text-blue-600">CTA: {msg.cta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Strategy */}
      <div>
        <SectionHeader icon={BarChart3} title="Channel Strategy" moduleKey={moduleKey} sectionKey="channel_strategy" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 gap-3">
          {data.channel_strategy.map((ch, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-900 font-bold mb-1">{ch.channel}</p>
              <p className="text-xs text-gray-500 mb-2">{ch.objective}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {ch.tactics.map((t, ti) => (
                  <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{t}</span>
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
        <SectionHeader icon={CalendarDays} title="Launch Timeline" moduleKey={moduleKey} sectionKey="launch_timeline" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.launch_timeline.map((entry, i) => (
            <div key={i} className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm flex items-start gap-3">
              <div className="flex-shrink-0 w-20">
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{entry.week}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">{entry.phase} · {entry.owner}</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.activities.map((a, ai) => (
                    <span key={ai} className="text-xs text-gray-700">• {a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Day Checklist */}
      <div>
        <SectionHeader icon={CheckSquare} title="Launch Day Checklist" moduleKey={moduleKey} sectionKey="launch_day_checklist" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 gap-2">
          {data.launch_day_checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="w-5 h-5 rounded border border-gray-300 flex-shrink-0" />
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <SectionHeader title="Success Milestones" moduleKey={moduleKey} sectionKey="success_metrics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(data.success_metrics).map(([period, val]) => (
            <div key={period} className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">{period.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-900 font-medium">{val.metric}</p>
              <p className="text-sm font-bold text-emerald-600">{val.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div>
        <SectionHeader icon={AlertTriangle} title="Risk Mitigation" moduleKey={moduleKey} sectionKey="risk_mitigation" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.risk_mitigation.map((r, i) => (
            <div key={i} className="p-3 rounded-lg border flex items-start justify-between gap-3"
              style={{ borderColor: r.likelihood === "High" ? "rgba(239,68,68,0.2)" : r.likelihood === "Medium" ? "rgba(234,179,8,0.2)" : "rgba(107,114,128,0.2)",
                       backgroundColor: r.likelihood === "High" ? "rgba(239,68,68,0.03)" : "transparent" }}>
              <div>
                <p className="text-sm text-gray-900 font-medium">{r.risk}</p>
                <p className="text-xs text-gray-500 mt-0.5">Mitigation: {r.mitigation}</p>
              </div>
              <span className={`text-xs font-bold flex-shrink-0 ${r.likelihood === "High" ? "text-red-600" : r.likelihood === "Medium" ? "text-amber-600" : "text-gray-500"}`}>
                {r.likelihood}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button onClick={onNext} disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <>{nextLabel} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
