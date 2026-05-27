import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import { TrendingUp, DollarSign, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function ImpactView({ data, onBrief, isLoading, moduleKey, prd, onSectionUpdate }) {
  const adoption = data.adoption_curve || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Impact Simulation</h2>
        <p className="text-gray-500">12-month projected impact based on your PRD</p>
      </div>

      {/* User Adoption Chart */}
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
        <SectionHeader icon={TrendingUp} title="User Adoption Curve" moduleKey={moduleKey} sectionKey="adoption_curve" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={adoption}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(m) => `M${m}`} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="url(#colorUsers)" strokeWidth={2} name="Users" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & Engagement Chart */}
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
        <SectionHeader icon={DollarSign} title="Revenue & Engagement" moduleKey={moduleKey} sectionKey="adoption_curve" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={adoption}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(m) => `M${m}`} />
            <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
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
        <SectionHeader title="ROI Analysis" moduleKey={moduleKey} sectionKey="roi_analysis" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Estimated Cost", value: data.roi_analysis.estimated_cost, color: "text-red-600" },
            { label: "12M Revenue", value: data.roi_analysis.estimated_revenue_12m, color: "text-emerald-600" },
            { label: "ROI", value: data.roi_analysis.roi_percentage, color: "text-indigo-600" },
            { label: "Break-even", value: `Month ${data.roi_analysis.break_even_month}`, color: "text-blue-600" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div>
        <SectionHeader icon={AlertCircle} title="Risk-Adjusted Outcomes" moduleKey={moduleKey} sectionKey="risk_adjusted_outcomes" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid gap-3">
          {[
            { label: "Best Case", value: data.risk_adjusted_outcomes.best_case, color: "border-emerald-200 bg-emerald-50", textColor: "text-emerald-600" },
            { label: "Expected Case", value: data.risk_adjusted_outcomes.expected_case, color: "border-blue-200 bg-blue-50", textColor: "text-blue-600" },
            { label: "Worst Case", value: data.risk_adjusted_outcomes.worst_case, color: "border-red-200 bg-red-50", textColor: "text-red-600" },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-xs font-bold uppercase mb-1 ${s.textColor}`}>{s.label}</p>
              <p className="text-sm text-gray-700">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <SectionHeader title="Key Assumptions" moduleKey={moduleKey} sectionKey="key_assumptions" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <ul className="space-y-1.5">
          {data.key_assumptions.map((a, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-indigo-600 mt-0.5">•</span> {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-sm text-gray-700 font-medium">{data.recommendation}</p>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onBrief}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
