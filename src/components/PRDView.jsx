import { Target, AlertTriangle, Cpu, Megaphone, Swords, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function Badge({ children, color = "gray" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

function priorityColor(p) {
  if (p === "P0") return "red";
  if (p === "P1") return "yellow";
  return "blue";
}

function impactColor(i) {
  if (i === "High") return "red";
  if (i === "Medium") return "yellow";
  return "green";
}

export default function PRDView({ prd, onPrioritize, isLoading }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{prd.title}</h2>
        <p className="text-indigo-600 text-lg italic">"{prd.elevator_pitch}"</p>
        <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-700 text-sm">{prd.problem_statement}</p>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" /> Target Audience
        </h3>
        <div className="flex flex-wrap gap-2">
          {prd.target_audience.map((a, i) => (
            <Badge key={i} color="violet">{a}</Badge>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Goals & Metrics
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {prd.goals.map((g, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p className="text-gray-900 text-sm font-medium mb-1">{g.goal}</p>
              <p className="text-xs text-gray-500">Metric: {g.metric}</p>
              <p className="text-xs text-indigo-600 mt-1">Target: {g.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Features</h3>
        <div className="space-y-2">
          {prd.features.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-900 text-sm font-medium">{f.name}</p>
                  <Badge color={priorityColor(f.priority)}>{f.priority}</Badge>
                </div>
                <p className="text-xs text-gray-500">{f.description}</p>
              </div>
              <Badge color="gray">Effort: {f.effort}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Success Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
                <th className="text-left py-2 px-3">Metric</th>
                <th className="text-left py-2 px-3">Baseline</th>
                <th className="text-left py-2 px-3">Target</th>
                <th className="text-left py-2 px-3">Timeframe</th>
              </tr>
            </thead>
            <tbody>
              {prd.success_metrics.map((m, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 text-gray-900">{m.metric}</td>
                  <td className="py-2.5 px-3 text-gray-500">{m.current_baseline}</td>
                  <td className="py-2.5 px-3 text-emerald-600">{m.target}</td>
                  <td className="py-2.5 px-3 text-gray-500">{m.timeframe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risks */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Risks
        </h3>
        <div className="space-y-2">
          {prd.risks.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-gray-900 text-sm font-medium">{r.risk}</p>
                <Badge color={impactColor(r.impact)}>{r.impact}</Badge>
              </div>
              <p className="text-xs text-gray-500">Mitigation: {r.mitigation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Technical Considerations
        </h3>
        <ul className="space-y-1.5">
          {prd.technical_considerations.map((t, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* GTM */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4" /> Go-to-Market
        </h3>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">{prd.go_to_market.strategy}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {prd.go_to_market.channels.map((c, i) => (
              <Badge key={i} color="blue">{c}</Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500">Timeline: {prd.go_to_market.timeline}</p>
        </div>
      </div>

      {/* Competitive */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Swords className="w-4 h-4" /> Competitive Landscape
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {prd.competitive_landscape.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p className="text-gray-900 text-sm font-bold mb-2">{c.competitor}</p>
              <p className="text-xs text-gray-500 mb-1">
                <span className="text-red-600">Strength:</span> {c.strength}
              </p>
              <p className="text-xs text-gray-500">
                <span className="text-emerald-600">Our Edge:</span> {c.our_edge}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onPrioritize}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
