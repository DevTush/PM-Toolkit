import { DollarSign, ArrowRight, Loader2, TrendingUp, Swords } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function PricingView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Pricing Strategy</h2>
        <p className="text-gray-500">
          Model: <span className="text-indigo-600 font-medium">{data.pricing_model}</span>
        </p>
      </div>

      {/* Rationale */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-sm text-gray-700">{data.rationale}</p>
      </div>

      {/* Pricing Tiers */}
      <div>
        <SectionHeader title="Pricing Tiers" moduleKey={moduleKey} sectionKey="tiers" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tiers.map((tier, i) => {
            const isPopular = i === 1;
            return (
              <div key={i} className={`rounded-xl border overflow-hidden ${
                isPopular ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white shadow-sm"
              }`}>
                {isPopular && (
                  <div className="bg-indigo-600 text-white text-xs font-bold text-center py-1">MOST POPULAR</div>
                )}
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{tier.name}</h4>
                  <p className="text-2xl font-bold text-indigo-600 mb-1">{tier.price}</p>
                  <p className="text-xs text-gray-500 mb-3">{tier.target_segment}</p>
                  <ul className="space-y-1.5 mb-4">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
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
        <SectionHeader icon={DollarSign} title="Unit Economics" moduleKey={moduleKey} sectionKey="unit_economics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "CAC", value: data.unit_economics.cac, color: "text-red-600" },
            { label: "LTV", value: data.unit_economics.ltv, color: "text-emerald-600" },
            { label: "LTV:CAC", value: data.unit_economics.ltv_cac_ratio, color: "text-indigo-600" },
            { label: "Payback", value: `${data.unit_economics.payback_months}mo`, color: "text-blue-600" },
            { label: "Gross Margin", value: data.unit_economics.gross_margin, color: "text-emerald-600" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Projection */}
      <div>
        <SectionHeader icon={TrendingUp} title="Revenue Projection" moduleKey={moduleKey} sectionKey="revenue_projection" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="grid grid-cols-3 gap-3">
          {data.revenue_projection.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Month {r.month}</p>
              <p className="text-xl font-bold text-emerald-600">{r.mrr}</p>
              <p className="text-xs text-gray-500">MRR</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Pricing */}
      <div>
        <SectionHeader icon={Swords} title="Competitive Pricing" moduleKey={moduleKey} sectionKey="competitive_pricing" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.competitive_pricing.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-900 font-medium">{c.competitor}</p>
                <p className="text-xs text-gray-500">{c.positioning}</p>
              </div>
              <p className="text-sm font-bold text-gray-700">{c.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Experiments */}
      <div>
        <SectionHeader title="Pricing Experiments" moduleKey={moduleKey} sectionKey="pricing_experiments" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
        <div className="space-y-2">
          {data.pricing_experiments.map((exp, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-900 font-medium mb-1">{exp.test}</p>
              <p className="text-xs text-emerald-600">Hypothesis: {exp.hypothesis}</p>
              <p className="text-xs text-red-600 mt-0.5">Risk: {exp.risk}</p>
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
