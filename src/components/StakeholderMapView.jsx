import { Users, ArrowRight, Loader2, Grid3X3, MessageSquare } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from "recharts";
import SectionHeader from "./SectionHeader";

const TEAM_COLORS = {
  Engineering: "#3b82f6",
  Design: "#ec4899",
  Marketing: "#f59e0b",
  Sales: "#10b981",
  Legal: "#ef4444",
  Finance: "#6366f1",
  Leadership: "#8b5cf6",
  Support: "#06b6d4",
  Data: "#14b8a6",
};

const STRATEGY_COLORS = {
  "Manage closely": "bg-red-50 text-red-700 border-red-200",
  "Keep satisfied": "bg-amber-50 text-amber-700 border-amber-200",
  "Keep informed": "bg-blue-50 text-blue-700 border-blue-200",
  Monitor: "bg-gray-100 text-gray-600 border-gray-200",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
      <p className="text-gray-900 font-bold">{d.name}</p>
      <p className="text-gray-500">{d.team}</p>
      <p className="text-gray-500">Power: {d.power} · Interest: {d.interest}</p>
      <p className="text-indigo-600">{d.strategy}</p>
    </div>
  );
}

export default function StakeholderMapView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  const scatterData = data.stakeholders.map((s) => ({
    x: s.interest,
    y: s.power,
    name: s.name,
    team: s.team,
    strategy: s.strategy,
    power: s.power,
    interest: s.interest,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Map</h2>
        <p className="text-gray-500">Power/Interest grid with RACI matrix</p>
      </div>

      {/* Power/Interest Grid */}
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
        <SectionHeader icon={Grid3X3} title="Power / Interest Grid" moduleKey={moduleKey} sectionKey="stakeholders" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number" dataKey="x" name="Interest" domain={[0, 10]}
              stroke="#9ca3af" tick={{ fontSize: 11 }}
              label={{ value: "Interest →", position: "bottom", offset: 10, style: { fill: "#6b7280", fontSize: 12 } }}
            />
            <YAxis
              type="number" dataKey="y" name="Power" domain={[0, 10]}
              stroke="#9ca3af" tick={{ fontSize: 11 }}
              label={{ value: "Power →", angle: -90, position: "left", offset: 10, style: { fill: "#6b7280", fontSize: 12 } }}
            />
            <ZAxis range={[120, 120]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={scatterData}>
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={TEAM_COLORS[entry.team] || "#8b5cf6"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-center p-2 rounded bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500">High Power, Low Interest</p>
            <p className="text-xs text-amber-600 font-medium">Keep Satisfied</p>
          </div>
          <div className="text-center p-2 rounded bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500">High Power, High Interest</p>
            <p className="text-xs text-red-600 font-medium">Manage Closely</p>
          </div>
          <div className="text-center p-2 rounded bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500">Low Power, Low Interest</p>
            <p className="text-xs text-gray-500 font-medium">Monitor</p>
          </div>
          <div className="text-center p-2 rounded bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500">Low Power, High Interest</p>
            <p className="text-xs text-blue-600 font-medium">Keep Informed</p>
          </div>
        </div>
      </div>

      {/* Stakeholder Details */}
      <div>
        <SectionHeader icon={Users} title="Stakeholder Details" moduleKey={moduleKey} sectionKey="stakeholders" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.stakeholders.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TEAM_COLORS[s.team] || "#8b5cf6" }} />
                  <p className="text-sm text-gray-900 font-medium">{s.name}</p>
                  <span className="text-xs text-gray-500">({s.team})</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${STRATEGY_COLORS[s.strategy] || STRATEGY_COLORS.Monitor}`}>
                  {s.strategy}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Concern: {s.key_concern}</p>
              <p className="text-xs text-emerald-600">Win strategy: {s.how_to_win}</p>
              <p className="text-xs text-gray-500 mt-1">{s.communication}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Matrix */}
      <div>
        <SectionHeader title="RACI Matrix" moduleKey={moduleKey} sectionKey="raci_matrix" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 uppercase border-b border-gray-200">
                <th className="text-left py-2 px-3">Activity</th>
                <th className="text-left py-2 px-3">R</th>
                <th className="text-left py-2 px-3">A</th>
                <th className="text-left py-2 px-3">C</th>
                <th className="text-left py-2 px-3">I</th>
              </tr>
            </thead>
            <tbody>
              {data.raci_matrix.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 text-gray-900 font-medium">{row.activity}</td>
                  <td className="py-2.5 px-3 text-emerald-600">{row.responsible}</td>
                  <td className="py-2.5 px-3 text-blue-600">{row.accountable}</td>
                  <td className="py-2.5 px-3 text-amber-600">{row.consulted?.join(", ")}</td>
                  <td className="py-2.5 px-3 text-gray-500">{row.informed?.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Communication Plan */}
      <div>
        <SectionHeader icon={MessageSquare} title="Communication Plan" moduleKey={moduleKey} sectionKey="communication_plan" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.communication_plan.map((c, i) => (
            <div key={i} className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Audience</p>
                <p className="text-gray-900 font-medium">{c.audience}</p>
              </div>
              <div>
                <p className="text-gray-500">Channel</p>
                <p className="text-blue-600">{c.channel}</p>
              </div>
              <div>
                <p className="text-gray-500">Frequency</p>
                <p className="text-gray-700">{c.frequency}</p>
              </div>
              <div>
                <p className="text-gray-500">Content</p>
                <p className="text-gray-700">{c.content}</p>
              </div>
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
