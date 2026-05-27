import { Target, ArrowRight, Loader2, Building, Code, Palette, TrendingUp, Ban } from "lucide-react";

function OKRSection({ title, icon: Icon, color, objectives }) {
  return (
    <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
      <h3 className="text-sm uppercase tracking-wider font-medium mb-4 flex items-center gap-2" style={{ color }}>
        <Icon className="w-4 h-4" /> {title}
      </h3>
      <div className="space-y-4">
        {objectives.map((obj, i) => (
          <div key={i}>
            <p className="text-sm text-white font-bold mb-2 flex items-start gap-2">
              <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
              {obj.objective}
            </p>
            <div className="ml-6 space-y-1.5">
              {obj.key_results.map((kr, ki) => (
                <div key={ki} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-gray-800/50">
                  <div className="flex-1">
                    <p className="text-xs text-gray-300">{kr.kr}</p>
                    {kr.owner && <p className="text-[10px] text-gray-500 mt-0.5">Owner: {kr.owner}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-white">{kr.target}</p>
                    {kr.current && <p className="text-[10px] text-gray-500">from {kr.current}</p>}
                    {kr.metric_type && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${kr.metric_type === "Leading" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}>
                        {kr.metric_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OKRView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">OKRs</h2>
        <p className="text-gray-400">{data.time_horizon}</p>
      </div>

      {/* Vision */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-center">
        <p className="text-xs text-violet-400 uppercase font-medium mb-1">Product Vision</p>
        <p className="text-lg text-white font-medium">{data.vision}</p>
      </div>

      {/* Company Level */}
      <div className="p-5 rounded-xl bg-gray-900 border border-violet-500/20">
        <h3 className="text-sm uppercase tracking-wider text-violet-400 font-medium mb-3 flex items-center gap-2">
          <Building className="w-4 h-4" /> Company Level
        </h3>
        <p className="text-sm text-white font-bold mb-3 flex items-start gap-2">
          <Target className="w-4 h-4 mt-0.5 text-violet-400 flex-shrink-0" />
          {data.company_level.objective}
        </p>
        <div className="ml-6 space-y-1.5">
          {data.company_level.key_results.map((kr, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gray-800/50">
              <p className="text-xs text-gray-300 flex-1">{kr.kr}</p>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-white">{kr.target}</p>
                {kr.current && <p className="text-[10px] text-gray-500">from {kr.current}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team OKRs */}
      <OKRSection title="Product Team" icon={Target} color="#8b5cf6" objectives={data.product_team} />
      <OKRSection title="Engineering Team" icon={Code} color="#3b82f6" objectives={data.engineering_team} />
      <OKRSection title="Design Team" icon={Palette} color="#ec4899" objectives={data.design_team} />
      <OKRSection title="Growth Team" icon={TrendingUp} color="#10b981" objectives={data.growth_team} />

      {/* Alignment */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <p className="text-xs font-bold uppercase text-violet-400 mb-1">Alignment Notes</p>
        <p className="text-sm text-gray-300">{data.alignment_notes}</p>
        <p className="text-xs text-gray-500 mt-2">Review cadence: <span className="text-gray-300">{data.review_cadence}</span></p>
      </div>

      {/* Anti-Goals */}
      {data.anti_goals?.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <Ban className="w-4 h-4" /> Anti-Goals (Not Doing This Quarter)
          </h3>
          <div className="space-y-2">
            {data.anti_goals.map((ag, i) => (
              <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm text-gray-300 flex items-center gap-2">
                <span className="text-red-400">✗</span> {ag}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button onClick={onNext} disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <>{nextLabel} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
