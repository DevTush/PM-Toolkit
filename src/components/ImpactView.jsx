import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import { TrendingUp, DollarSign, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ImpactView({ data, onBrief, isLoading }) {
  const adoption = data.adoption_curve || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Impact Simulation</h2>
        <p className="text-gray-400">12-month projected impact based on your PRD</p>
      </div>

      {/* User Adoption Chart */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> User Adoption Curve
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={adoption}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(m) => `M${m}`} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="url(#colorUsers)" strokeWidth={2} name="Users" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & Engagement Chart */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Revenue & Engagement
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={adoption}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(m) => `M${m}`} />
            <YAxis yAxisId="left" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="engagement_rate" stroke="#f59e0b" strokeWidth={2} name="Engagement (%)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROI Cards */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">ROI Analysis</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Estimated Cost", value: data.roi_analysis.estimated_cost, color: "text-red-400" },
            { label: "12M Revenue", value: data.roi_analysis.estimated_revenue_12m, color: "text-green-400" },
            { label: "ROI", value: data.roi_analysis.roi_percentage, color: "text-violet-400" },
            { label: "Break-even", value: `Month ${data.roi_analysis.break_even_month}`, color: "text-blue-400" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Risk-Adjusted Outcomes
        </h3>
        <div className="grid gap-3">
          {[
            { label: "Best Case", value: data.risk_adjusted_outcomes.best_case, color: "border-green-500/30 bg-green-500/5", textColor: "text-green-400" },
            { label: "Expected Case", value: data.risk_adjusted_outcomes.expected_case, color: "border-blue-500/30 bg-blue-500/5", textColor: "text-blue-400" },
            { label: "Worst Case", value: data.risk_adjusted_outcomes.worst_case, color: "border-red-500/30 bg-red-500/5", textColor: "text-red-400" },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-xs font-bold uppercase mb-1 ${s.textColor}`}>{s.label}</p>
              <p className="text-sm text-gray-300">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Key Assumptions</h3>
        <ul className="space-y-1.5">
          {data.key_assumptions.map((a, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">•</span> {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <p className="text-sm text-gray-300 font-medium">{data.recommendation}</p>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onBrief}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
