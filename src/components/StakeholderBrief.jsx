import { FileText, Users, DollarSign, AlertTriangle, ArrowRight, Download } from "lucide-react";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";

export default function StakeholderBrief({ data, prd, onExportPDF, moduleKey, onSectionUpdate }) {
  const briefRef = useRef(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Brief</h2>
        <p className="text-gray-500">Executive-ready document for leadership review</p>
      </div>

      <div ref={briefRef} className="space-y-6">
        {/* Executive Summary */}
        <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200">
          <SectionHeader icon={FileText} title="Executive Summary" moduleKey={moduleKey} sectionKey="executive_summary" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <p className="text-gray-700 text-sm leading-relaxed">{data.executive_summary}</p>
        </div>

        {/* Problem & Solution */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-sm uppercase tracking-wider text-red-600 font-medium mb-2">Problem / Opportunity</h3>
            <p className="text-sm text-gray-700">{data.problem_opportunity}</p>
          </div>
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-sm uppercase tracking-wider text-emerald-600 font-medium mb-2">Proposed Solution</h3>
            <p className="text-sm text-gray-700">{data.proposed_solution}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <SectionHeader title="Key Metrics" moduleKey={moduleKey} sectionKey="key_metrics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.key_metrics.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">{m.metric}</p>
                <p className="text-lg font-bold text-gray-900">{m.target}</p>
                <p className="text-xs text-gray-500">{m.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Ask */}
        <div>
          <SectionHeader icon={Users} title="Resource Ask" moduleKey={moduleKey} sectionKey="resource_ask" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Team</p>
              <p className="text-sm font-bold text-gray-900">{data.resource_ask.team_size}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Timeline</p>
              <p className="text-sm font-bold text-gray-900">{data.resource_ask.timeline}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="text-sm font-bold text-emerald-600">{data.resource_ask.budget}</p>
            </div>
          </div>
        </div>

        {/* Risks */}
        <div>
          <SectionHeader icon={AlertTriangle} title="Risks & Mitigations" moduleKey={moduleKey} sectionKey="risks_and_mitigations" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="space-y-2">
            {data.risks_and_mitigations.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{r.risk}</p>
                  <p className="text-xs text-gray-500 mt-1">→ {r.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <SectionHeader title="Next Steps" moduleKey={moduleKey} sectionKey="next_steps" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="space-y-2">
            {data.next_steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-900">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Needed */}
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
          <h3 className="text-sm uppercase tracking-wider text-amber-600 font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Decision Needed
          </h3>
          <p className="text-sm text-gray-700">{data.decision_needed}</p>
        </div>
      </div>

      {/* Export */}
      <div className="pt-4">
        <button
          onClick={() => onExportPDF(briefRef.current)}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>
    </div>
  );
}
