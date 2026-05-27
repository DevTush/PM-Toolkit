import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRight, Loader2, ListOrdered, BarChart3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#eab308", "#f97316", "#ef4444"];

export default function PrioritizationView({ data, onSimulate, isLoading, moduleKey, prd, onSectionUpdate }) {
  const chartData = data.scored_features.map((f) => ({
    name: f.name.length > 20 ? f.name.slice(0, 20) + "..." : f.name,
    score: f.scores.total || 0,
    fullName: f.name,
  })).sort((a, b) => b.score - a.score);

  function recColor(rec) {
    if (rec.includes("now")) return "text-emerald-600";
    if (rec.includes("next")) return "text-amber-600";
    if (rec.includes("later") || rec.includes("Consider")) return "text-blue-600";
    return "text-red-600";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Feature Prioritization</h2>
        <p className="text-gray-500">
          Framework: <span className="text-indigo-600 font-medium">{data.framework}</span>
        </p>
      </div>

      {/* Chart */}
      {chartData.length > 0 && chartData[0].score > 0 && (
        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4">Priority Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} width={140} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#111827" }}
                itemStyle={{ color: "#4f46e5" }}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Feature Details */}
      <div>
        <SectionHeader title="Detailed Breakdown" moduleKey={moduleKey} sectionKey="scored_features" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-3">
          {data.scored_features.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-gray-900 font-medium text-sm">{f.name}</p>
                <span className={`text-xs font-semibold whitespace-nowrap ${recColor(f.recommendation)}`}>
                  {f.recommendation}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                {Object.entries(f.scores).map(([key, val]) => (
                  key !== "total" && (
                    <div key={key} className="text-xs">
                      <span className="text-gray-500 capitalize">{key}: </span>
                      <span className="text-gray-900 font-medium">{typeof val === "boolean" ? (val ? "✓" : "✗") : val}</span>
                    </div>
                  )
                ))}
                {f.scores.total !== undefined && (
                  <div className="text-xs">
                    <span className="text-indigo-600 font-bold">Total: {f.scores.total}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">{f.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Order */}
      <div>
        <SectionHeader icon={ListOrdered} title="Recommended Execution Order" moduleKey={moduleKey} sectionKey="execution_order" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.execution_order.map((name, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-gray-900">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onSimulate}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
