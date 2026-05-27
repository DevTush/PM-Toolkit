import { FlaskConical, ArrowRight, Loader2, Beaker } from "lucide-react";

function Badge({ children, color }) {
  const colors = {
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.violet}`}>
      {children}
    </span>
  );
}

export default function ExperimentsView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">A/B Experiments</h2>
        <p className="text-gray-400">Data-driven experimentation plan</p>
      </div>

      {/* Experiments */}
      <div className="space-y-4">
        {data.experiments.map((exp, i) => (
          <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">{exp.id}</span>
                  <h4 className="text-sm font-bold text-white">{exp.name}</h4>
                </div>
                <Badge color="blue">{exp.type}</Badge>
              </div>

              {/* Hypothesis */}
              <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 mb-4">
                <p className="text-xs font-bold uppercase text-violet-400 mb-1">Hypothesis</p>
                <p className="text-sm text-gray-200">{exp.hypothesis}</p>
              </div>

              {/* Control vs Variant */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg border border-gray-700">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Control (A)</p>
                  <p className="text-sm text-gray-300">{exp.control}</p>
                </div>
                <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <p className="text-xs font-bold uppercase text-green-400 mb-1">Variant (B)</p>
                  <p className="text-sm text-gray-300">{exp.variant}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Primary Metric</p>
                  <p className="text-xs font-bold text-white mt-0.5">{exp.primary_metric}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Expected Lift</p>
                  <p className="text-xs font-bold text-green-400 mt-0.5">{exp.expected_lift}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Sample Size</p>
                  <p className="text-xs font-bold text-blue-400 mt-0.5">{exp.sample_size}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-xs font-bold text-yellow-400 mt-0.5">{exp.duration}</p>
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
                  <p className="text-xs font-bold uppercase text-red-400 mb-1">Guardrails</p>
                  <div className="flex flex-wrap gap-1">
                    {exp.guardrail_metrics.map((m, mi) => (
                      <Badge key={mi} color="yellow">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decision Criteria */}
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Decision Criteria</p>
                <p className="text-xs text-gray-300">{exp.decision_criteria}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      {data.experiment_roadmap && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <Beaker className="w-4 h-4" /> Experiment Roadmap
          </h3>
          <div className="flex gap-3 overflow-x-auto">
            {data.experiment_roadmap.map((q, i) => (
              <div key={i} className="flex-1 min-w-[160px] p-4 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-sm font-bold text-violet-400 mb-2">{q.quarter}</p>
                <div className="space-y-1">
                  {q.experiments.map((e, ei) => (
                    <p key={ei} className="text-xs font-mono text-gray-300 bg-gray-800 px-2 py-1 rounded">{e}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Notes */}
      {data.culture_notes && (
        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
          <p className="text-sm text-gray-300">{data.culture_notes}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
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
