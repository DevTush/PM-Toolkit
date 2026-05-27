import { FlaskConical, ArrowRight, Loader2, Beaker } from "lucide-react";
import SectionHeader from "./SectionHeader";

function Badge({ children, color }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.violet}`}>
      {children}
    </span>
  );
}

export default function ExperimentsView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">A/B Experiments</h2>
        <p className="text-gray-500">Data-driven experimentation plan</p>
      </div>

      <SectionHeader icon={FlaskConical} title="Experiments" moduleKey={moduleKey} sectionKey="experiments" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
      {/* Experiments */}
      <div className="space-y-4">
        {data.experiments.map((exp, i) => (
          <div key={i} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{exp.id}</span>
                  <h4 className="text-sm font-bold text-gray-900">{exp.name}</h4>
                </div>
                <Badge color="blue">{exp.type}</Badge>
              </div>

              {/* Hypothesis */}
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 mb-4">
                <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Hypothesis</p>
                <p className="text-sm text-gray-700">{exp.hypothesis}</p>
              </div>

              {/* Control vs Variant */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Control (A)</p>
                  <p className="text-sm text-gray-700">{exp.control}</p>
                </div>
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                  <p className="text-xs font-bold uppercase text-emerald-600 mb-1">Variant (B)</p>
                  <p className="text-sm text-gray-700">{exp.variant}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Primary Metric</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{exp.primary_metric}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Expected Lift</p>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{exp.expected_lift}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Sample Size</p>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{exp.sample_size}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">{exp.duration}</p>
                </div>
              </div>

              {/* Guardrails & Secondary */}
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Secondary Metrics</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.secondary_metrics.map((m, mi) => (
                      <Badge key={mi} color="violet">{m}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-red-600 mb-1">Guardrails</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.guardrail_metrics.map((m, mi) => (
                      <Badge key={mi} color="yellow">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decision Criteria */}
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Decision Criteria</p>
                <p className="text-xs text-gray-700">{exp.decision_criteria}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      {data.experiment_roadmap && (
        <div>
          <SectionHeader icon={Beaker} title="Experiment Roadmap" moduleKey={moduleKey} sectionKey="experiment_roadmap" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="flex gap-3 overflow-x-auto">
            {data.experiment_roadmap.map((q, i) => (
              <div key={i} className="flex-1 min-w-[160px] p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-indigo-600 mb-2">{q.quarter}</p>
                <div className="space-y-1">
                  {q.experiments.map((e, ei) => (
                    <p key={ei} className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{e}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Notes */}
      {data.culture_notes && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-gray-700">{data.culture_notes}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <>{nextLabel} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
