import { Star, ArrowRight, Loader2, BarChart3, Bell, Anchor } from "lucide-react";

const PIRATE_LABELS = {
  acquisition: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: "🏴‍☠️" },
  activation: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: "⚡" },
  retention: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: "🔄" },
  revenue: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: "💰" },
  referral: { color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", icon: "📣" },
};

export default function MetricsView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Metrics Framework</h2>
        <p className="text-gray-400">North Star + AARRR pirate metrics</p>
      </div>

      {/* North Star */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h3 className="text-sm uppercase tracking-wider text-violet-400 font-medium">North Star Metric</h3>
        </div>
        <p className="text-2xl font-bold text-white mb-2">{data.north_star.metric}</p>
        <p className="text-sm text-gray-300 mb-4">{data.north_star.definition}</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gray-900/50 text-center">
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-sm font-bold text-gray-300">{data.north_star.current}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/50 text-center">
            <p className="text-xs text-gray-500">6M Target</p>
            <p className="text-sm font-bold text-blue-400">{data.north_star.target_6m}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/50 text-center">
            <p className="text-xs text-gray-500">12M Target</p>
            <p className="text-sm font-bold text-green-400">{data.north_star.target_12m}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">{data.north_star.why}</p>
      </div>

      {/* Input Metrics */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Anchor className="w-4 h-4" /> Input Metrics (Drivers)
        </h3>
        <div className="space-y-2">
          {data.input_metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{m.metric}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.relationship}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">{m.owner}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{m.cadence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AARRR Pirate Metrics */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">AARRR Pirate Metrics</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(data.pirate_metrics).map(([key, val]) => {
            const style = PIRATE_LABELS[key];
            return (
              <div key={key} className={`p-4 rounded-xl border ${style.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{style.icon}</span>
                  <p className={`text-xs font-bold uppercase ${style.color}`}>{key}</p>
                </div>
                <p className="text-sm text-white font-medium mb-1">{val.metric}</p>
                <p className="text-xs text-gray-400">Target: <span className="text-gray-200">{val.target}</span></p>
                <p className="text-xs text-gray-400">
                  {key === "acquisition" && `Channel: ${val.channel}`}
                  {key === "activation" && `Trigger: ${val.trigger}`}
                  {key === "retention" && `Cohort: ${val.cohort}`}
                  {key === "revenue" && `Model: ${val.model}`}
                  {key === "referral" && `Mechanism: ${val.mechanism}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dashboard Layout */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Dashboard Blueprint
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.dashboard_layout.map((section, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white font-medium">{section.section}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{section.chart_type}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {section.metrics.map((m, mi) => (
                  <span key={mi} className="text-xs bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Rules */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Alert Rules
        </h3>
        <div className="space-y-2">
          {data.alert_rules.map((rule, i) => (
            <div key={i} className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
              rule.severity === "Critical" ? "border-red-500/20 bg-red-500/5" : "border-yellow-500/20 bg-yellow-500/5"
            }`}>
              <div>
                <p className="text-sm text-white font-medium">{rule.metric}</p>
                <p className="text-xs text-gray-400">{rule.condition} → {rule.action}</p>
              </div>
              <span className={`text-xs font-bold ${rule.severity === "Critical" ? "text-red-400" : "text-yellow-400"}`}>
                {rule.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

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
