import { FileText, Users, DollarSign, AlertTriangle, ArrowRight, Download } from "lucide-react";
import { useRef } from "react";

export default function StakeholderBrief({ data, prd, onExportPDF }) {
  const briefRef = useRef(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Stakeholder Brief</h2>
        <p className="text-gray-400">Executive-ready document for leadership review</p>
      </div>

      <div ref={briefRef} className="space-y-6">
        {/* Executive Summary */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
          <h3 className="text-sm uppercase tracking-wider text-violet-400 font-medium mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Executive Summary
          </h3>
          <p className="text-gray-200 text-sm leading-relaxed">{data.executive_summary}</p>
        </div>

        {/* Problem & Solution */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-sm uppercase tracking-wider text-red-400 font-medium mb-2">Problem / Opportunity</h3>
            <p className="text-sm text-gray-300">{data.problem_opportunity}</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-sm uppercase tracking-wider text-green-400 font-medium mb-2">Proposed Solution</h3>
            <p className="text-sm text-gray-300">{data.proposed_solution}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Key Metrics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.key_metrics.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
                <p className="text-xs text-gray-500 mb-1">{m.metric}</p>
                <p className="text-lg font-bold text-white">{m.target}</p>
                <p className="text-xs text-gray-500">{m.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Ask */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Resource Ask
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">Team</p>
              <p className="text-sm font-bold text-white">{data.resource_ask.team_size}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">Timeline</p>
              <p className="text-sm font-bold text-white">{data.resource_ask.timeline}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="text-sm font-bold text-green-400">{data.resource_ask.budget}</p>
            </div>
          </div>
        </div>

        {/* Risks */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Risks & Mitigations
          </h3>
          <div className="space-y-2">
            {data.risks_and_mitigations.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{r.risk}</p>
                  <p className="text-xs text-gray-400 mt-1">→ {r.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Next Steps</h3>
          <div className="space-y-2">
            {data.next_steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Needed */}
        <div className="p-5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <h3 className="text-sm uppercase tracking-wider text-yellow-400 font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Decision Needed
          </h3>
          <p className="text-sm text-gray-200">{data.decision_needed}</p>
        </div>
      </div>

      {/* Export */}
      <div className="pt-4">
        <button
          onClick={() => onExportPDF(briefRef.current)}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>
    </div>
  );
}
