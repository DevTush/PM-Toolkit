import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRight, Loader2, ListOrdered } from "lucide-react";

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#eab308", "#f97316", "#ef4444"];

export default function PrioritizationView({ data, onSimulate, isLoading }) {
  const chartData = data.scored_features.map((f) => ({
    name: f.name.length > 20 ? f.name.slice(0, 20) + "..." : f.name,
    score: f.scores.total || 0,
    fullName: f.name,
  })).sort((a, b) => b.score - a.score);

  function recColor(rec) {
    if (rec.includes("now")) return "text-green-400";
    if (rec.includes("next")) return "text-yellow-400";
    if (rec.includes("later") || rec.includes("Consider")) return "text-blue-400";
    return "text-red-400";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Feature Prioritization</h2>
        <p className="text-gray-400">
          Framework: <span className="text-violet-300 font-medium">{data.framework}</span>
        </p>
      </div>

      {/* Chart */}
      {chartData.length > 0 && chartData[0].score > 0 && (
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4">Priority Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} width={140} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#c4b5fd" }}
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
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Detailed Breakdown</h3>
        <div className="space-y-3">
          {data.scored_features.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-white font-medium text-sm">{f.name}</p>
                <span className={`text-xs font-semibold whitespace-nowrap ${recColor(f.recommendation)}`}>
                  {f.recommendation}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                {Object.entries(f.scores).map(([key, val]) => (
                  key !== "total" && (
                    <div key={key} className="text-xs">
                      <span className="text-gray-500 capitalize">{key}: </span>
                      <span className="text-white font-medium">{typeof val === "boolean" ? (val ? "✓" : "✗") : val}</span>
                    </div>
                  )
                ))}
                {f.scores.total !== undefined && (
                  <div className="text-xs">
                    <span className="text-violet-400 font-bold">Total: {f.scores.total}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">{f.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Order */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <ListOrdered className="w-4 h-4" /> Recommended Execution Order
        </h3>
        <div className="space-y-2">
          {data.execution_order.map((name, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-white">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <p className="text-sm text-gray-300">{data.summary}</p>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onSimulate}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
