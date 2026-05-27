import { useState } from "react";
import { Search, Loader2, Star, TrendingUp, Lightbulb, Shield, ArrowRight } from "lucide-react";
import { generateProductTeardown } from "../lib/gemini";

function RatingBadge({ value, max = 10 }) {
  const color = value >= 8 ? "text-green-400 bg-green-500/10" : value >= 6 ? "text-yellow-400 bg-yellow-500/10" : "text-red-400 bg-red-500/10";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${color}`}>{value}/{max}</span>;
}

export default function ProductTeardownView({ onBack }) {
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!productName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateProductTeardown(productName, productUrl);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!data && !loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Product Teardown</h2>
          <p className="text-gray-400">Enter any product for a full strategic teardown</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={productName} onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name (e.g. Notion, Stripe, Figma)"
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500/50 focus:outline-none" />
          <input value={productUrl} onChange={(e) => setProductUrl(e.target.value)}
            placeholder="URL or additional context (optional)"
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500/50 focus:outline-none" />
          <button type="submit" disabled={!productName.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Search className="w-4 h-4" /> Teardown Product
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
        <button onClick={onBack} className="mt-6 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition block mx-auto">← Back to Dashboard</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin mx-auto mb-4" />
        <p className="text-lg text-white font-medium">Tearing down {productName}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">{data.product_name}</h2>
        <p className="text-gray-400">{data.company} · {data.category}</p>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">{data.summary}</p>

      {/* Ratings */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(data.rating).map(([key, val]) => (
          <div key={key} className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
            <p className="text-[10px] text-gray-500 uppercase mb-1">{key.replace(/_/g, " ")}</p>
            <p className={`text-2xl font-bold ${val >= 8 ? "text-green-400" : val >= 6 ? "text-yellow-400" : "text-red-400"}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Business Model */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Business Model</h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-300">{data.business_model.type}</span>
          <RatingBadge value={data.business_model.monetization_rating} />
        </div>
        <p className="text-xs text-gray-400 mb-2">Est. ARR: <span className="text-white">{data.business_model.estimated_arr}</span></p>
        <div className="flex flex-wrap gap-1.5">
          {data.business_model.revenue_streams.map((s, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{s}</span>
          ))}
        </div>
      </div>

      {/* UX */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">User Experience</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400">Onboarding:</span>
          <RatingBadge value={data.user_experience.onboarding_score} />
        </div>
        <p className="text-xs text-gray-400 mb-3">{data.user_experience.onboarding_notes}</p>
        <p className="text-xs text-gray-400 mb-2"><span className="text-gray-300 font-medium">Core Loop:</span> {data.user_experience.core_loop}</p>
        <p className="text-xs text-violet-300 mb-3"><span className="text-violet-400 font-medium">Aha Moment:</span> {data.user_experience.aha_moment}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-green-400 mb-1">Strengths</p>
            {data.user_experience.ux_strengths.map((s, i) => <p key={i} className="text-xs text-gray-300 mb-0.5">✓ {s}</p>)}
          </div>
          <div>
            <p className="text-xs font-bold text-red-400 mb-1">Weaknesses</p>
            {data.user_experience.ux_weaknesses.map((w, i) => <p key={i} className="text-xs text-gray-300 mb-0.5">✗ {w}</p>)}
          </div>
        </div>
      </div>

      {/* Growth */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Growth Engine</h3>
        <p className="text-xs text-gray-400 mb-2">Primary Channel: <span className="text-white">{data.growth_engine.primary_channel}</span></p>
        <p className="text-xs text-gray-400 mb-2">Viral Mechanics: <span className="text-gray-300">{data.growth_engine.viral_mechanics}</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-violet-400 mb-1">Growth Loops</p>
            {data.growth_engine.growth_loops.map((l, i) => <p key={i} className="text-xs text-gray-300 mb-0.5">🔄 {l}</p>)}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">Retention Hooks</p>
            {data.growth_engine.retention_hooks.map((h, i) => <p key={i} className="text-xs text-gray-300 mb-0.5">🪝 {h}</p>)}
          </div>
        </div>
      </div>

      {/* Moats */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Competitive Moats</h3>
        <div className="space-y-2">
          {data.competitive_moats.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300">🏰 {m}</div>
          ))}
        </div>
      </div>

      {/* What I'd Change */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> What I'd Change</h3>
        <div className="space-y-3">
          {data.what_id_change.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
              <p className="text-sm text-white font-medium mb-1">{c.area}</p>
              <p className="text-xs text-gray-500 mb-1">Current: {c.current_state}</p>
              <p className="text-xs text-green-400 mb-1">Proposed: {c.proposed_change}</p>
              <p className="text-xs text-violet-300">Impact: {c.expected_impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PM Lessons */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <p className="text-xs font-bold uppercase text-violet-400 mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> PM Lessons</p>
        {data.pm_lessons.map((l, i) => <p key={i} className="text-sm text-gray-300 mb-1">• {l}</p>)}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => setData(null)}
          className="flex-1 py-3 rounded-xl font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition cursor-pointer">
          Teardown Another
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
