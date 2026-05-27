import { Star, ArrowRight, Loader2, BarChart3, Bell, Anchor } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PIRATE_LABELS = {
  acquisition: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: "🏴‍☠️" },
  activation: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: "⚡" },
  retention: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: "🔄" },
  revenue: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: "💰" },
  referral: { color: "text-pink-700", bg: "bg-pink-50 border-pink-200", icon: "📣" },
};

export default function MetricsView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Metrics Framework</h2>
        <p className="text-gray-500">North Star + AARRR pirate metrics</p>
      </div>

      {/* North Star */}
      <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h3 className="text-sm uppercase tracking-wider text-indigo-600 font-medium">North Star Metric</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{data.north_star.metric}</p>
        <p className="text-sm text-gray-600 mb-4">{data.north_star.definition}</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-center">
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-sm font-bold text-gray-700">{data.north_star.current}</p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-center">
            <p className="text-xs text-gray-500">6M Target</p>
            <p className="text-sm font-bold text-blue-600">{data.north_star.target_6m}</p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-center">
            <p className="text-xs text-gray-500">12M Target</p>
            <p className="text-sm font-bold text-emerald-600">{data.north_star.target_12m}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">{data.north_star.why}</p>
      </div>

      {/* Input Metrics */}
      <div>
        <SectionHeader icon={Anchor} title="Input Metrics (Drivers)" moduleKey={moduleKey} sectionKey="input_metrics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.input_metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{m.metric}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.relationship}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">{m.owner}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{m.cadence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AARRR Pirate Metrics */}
      <div>
        <SectionHeader title="AARRR Pirate Metrics" moduleKey={moduleKey} sectionKey="pirate_metrics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(data.pirate_metrics).map(([key, val]) => {
            const style = PIRATE_LABELS[key];
            return (
              <div key={key} className={`p-4 rounded-xl border ${style.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{style.icon}</span>
                  <p className={`text-xs font-bold uppercase ${style.color}`}>{key}</p>
                </div>
                <p className="text-sm text-gray-900 font-medium mb-1">{val.metric}</p>
                <p className="text-xs text-gray-500">Target: <span className="text-gray-700">{val.target}</span></p>
                <p className="text-xs text-gray-500">
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
        <SectionHeader icon={BarChart3} title="Dashboard Blueprint" moduleKey={moduleKey} sectionKey="dashboard_layout" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 gap-3">
          {data.dashboard_layout.map((section, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-900 font-medium">{section.section}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{section.chart_type}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {section.metrics.map((m, mi) => (
                  <span key={mi} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-200">
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
        <SectionHeader icon={Bell} title="Alert Rules" moduleKey={moduleKey} sectionKey="alert_rules" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.alert_rules.map((rule, i) => (
            <div key={i} className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
              rule.severity === "Critical" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
            }`}>
              <div>
                <p className="text-sm text-gray-900 font-medium">{rule.metric}</p>
                <p className="text-xs text-gray-500">{rule.condition} → {rule.action}</p>
              </div>
              <span className={`text-xs font-bold ${rule.severity === "Critical" ? "text-red-600" : "text-amber-600"}`}>
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
