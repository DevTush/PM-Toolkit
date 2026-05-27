import { DollarSign, ArrowRight, Loader2, TrendingUp, Swords } from "lucide-react";

export default function PricingView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Pricing Strategy</h2>
        <p className="text-gray-400">
          Model: <span className="text-violet-300 font-medium">{data.pricing_model}</span>
        </p>
      </div>

      {/* Rationale */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <p className="text-sm text-gray-300">{data.rationale}</p>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Pricing Tiers</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tiers.map((tier, i) => {
            const isPopular = i === 1;
            return (
              <div key={i} className={`rounded-xl border overflow-hidden ${
                isPopular ? "border-violet-500/40 bg-violet-500/5" : "border-gray-800 bg-gray-900"
              }`}>
                {isPopular && (
                  <div className="bg-violet-500 text-white text-xs font-bold text-center py-1">MOST POPULAR</div>
                )}
                <div className="p-5">
                  <h4 className="text-lg font-bold text-white mb-1">{tier.name}</h4>
                  <p className="text-2xl font-bold text-violet-400 mb-1">{tier.price}</p>
                  <p className="text-xs text-gray-500 mb-3">{tier.target_segment}</p>
                  <ul className="space-y-1.5 mb-4">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                    <span>Limits: {tier.limits}</span>
                    <span>{tier.expected_mix}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit Economics */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Unit Economics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "CAC", value: data.unit_economics.cac, color: "text-red-400" },
            { label: "LTV", value: data.unit_economics.ltv, color: "text-green-400" },
            { label: "LTV:CAC", value: data.unit_economics.ltv_cac_ratio, color: "text-violet-400" },
            { label: "Payback", value: `${data.unit_economics.payback_months}mo`, color: "text-blue-400" },
            { label: "Gross Margin", value: data.unit_economics.gross_margin, color: "text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Projection */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Revenue Projection
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {data.revenue_projection.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-1">Month {r.month}</p>
              <p className="text-xl font-bold text-green-400">{r.mrr}</p>
              <p className="text-xs text-gray-500">MRR</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Pricing */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
          <Swords className="w-4 h-4" /> Competitive Pricing
        </h3>
        <div className="space-y-2">
          {data.competitive_pricing.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white font-medium">{c.competitor}</p>
                <p className="text-xs text-gray-400">{c.positioning}</p>
              </div>
              <p className="text-sm font-bold text-gray-300">{c.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Experiments */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Pricing Experiments</h3>
        <div className="space-y-2">
          {data.pricing_experiments.map((exp, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <p className="text-sm text-white font-medium mb-1">{exp.test}</p>
              <p className="text-xs text-green-400">Hypothesis: {exp.hypothesis}</p>
              <p className="text-xs text-red-400 mt-0.5">Risk: {exp.risk}</p>
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
