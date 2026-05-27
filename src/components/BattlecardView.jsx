import { Swords, Shield, ArrowRight, Target, AlertTriangle, Loader2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function BattlecardView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Competitive Battlecards</h2>
        <p className="text-gray-500">Sales-ready competitive intelligence</p>
      </div>

      {/* Our Positioning */}
      <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-xs font-bold uppercase text-indigo-600 mb-2">Our Positioning</p>
        <p className="text-lg text-gray-900 font-medium mb-3">{data.our_product.positioning}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.our_product.key_differentiators.map((d2, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">{d2}</span>
          ))}
        </div>
        <p className="text-xs text-gray-500">Ideal Customer: <span className="text-gray-900 font-medium">{data.our_product.ideal_customer}</span></p>
      </div>

      <SectionHeader icon={Swords} title="Battlecards" moduleKey={moduleKey} sectionKey="battlecards" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
      {/* Battlecards */}
      {data.battlecards.map((card, i) => (
        <div key={i} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <Swords className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">vs. {card.competitor}</h3>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-500 italic">"{card.their_positioning}"</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-red-600 mb-1.5">Their Strengths</p>
                {card.their_strengths.map((s, si) => (
                  <p key={si} className="text-xs text-gray-700 mb-0.5 flex items-start gap-1.5">
                    <Shield className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" /> {s}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1.5">Their Weaknesses</p>
                {card.their_weaknesses.map((w, wi) => (
                  <p key={wi} className="text-xs text-gray-700 mb-0.5 flex items-start gap-1.5">
                    <Target className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" /> {w}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1">We Win When</p>
                <p className="text-xs text-gray-700">{card.we_win_when}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-bold uppercase text-red-600 mb-1">We Lose When</p>
                <p className="text-xs text-gray-700">{card.we_lose_when}</p>
              </div>
            </div>

            {/* Objection Handling */}
            <div>
              <p className="text-xs font-bold uppercase text-amber-600 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Objection Handling
              </p>
              <div className="space-y-2">
                {card.objection_handling.map((obj, oi) => (
                  <div key={oi} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-xs text-amber-700 font-medium mb-1">"{obj.objection}"</p>
                    <p className="text-xs text-emerald-700 flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" /> {obj.response}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trap Questions */}
            {card.trap_questions?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase text-indigo-600 mb-1.5">Trap Questions to Ask Prospect</p>
                {card.trap_questions.map((q, qi) => (
                  <p key={qi} className="text-xs text-gray-700 mb-0.5">❓ {q}</p>
                ))}
              </div>
            )}

            {/* Migration Points */}
            {card.migration_talking_points?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase text-blue-600 mb-1.5">Migration Talking Points</p>
                {card.migration_talking_points.map((tp, ti) => (
                  <p key={ti} className="text-xs text-gray-700 mb-0.5">→ {tp}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Feature Comparison */}
      {data.feature_comparison?.length > 0 && (
        <div>
          <SectionHeader title="Feature Comparison" moduleKey={moduleKey} sectionKey="feature_comparison" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 uppercase border-b border-gray-200">
                  <th className="text-left py-2 px-3">Feature</th>
                  <th className="text-left py-2 px-3 text-indigo-600">Us</th>
                  {data.feature_comparison[0]?.competitors && Object.keys(data.feature_comparison[0].competitors).map((c, ci) => (
                    <th key={ci} className="text-left py-2 px-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.feature_comparison.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-2.5 px-3 text-emerald-600">{row.us}</td>
                    {row.competitors && Object.values(row.competitors).map((v, vi) => (
                      <td key={vi} className="py-2.5 px-3 text-gray-500">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Win/Loss Patterns */}
      {data.win_loss_patterns && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-bold uppercase text-emerald-600 mb-2">Common Win Reasons</p>
            {data.win_loss_patterns.common_win_reasons.map((w, i) => (
              <p key={i} className="text-xs text-gray-700 mb-0.5">✓ {w}</p>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-xs font-bold uppercase text-red-600 mb-2">Common Loss Reasons</p>
            {data.win_loss_patterns.common_loss_reasons.map((l, i) => (
              <p key={i} className="text-xs text-gray-700 mb-0.5">✗ {l}</p>
            ))}
            {data.win_loss_patterns.deal_killers?.map((dk, i) => (
              <p key={i} className="text-xs text-red-600 mt-1">🚫 Deal killer: {dk}</p>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button onClick={onNext} disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <>{nextLabel} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
