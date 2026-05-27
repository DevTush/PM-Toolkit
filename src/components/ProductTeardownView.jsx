import { useState } from "react";
import { Search, Loader2, Star, TrendingUp, Lightbulb, Shield, ArrowRight, Square } from "lucide-react";
import { generateProductTeardown, hasApiKey, cancelCurrentRequest } from "../lib/gemini";

function RatingBadge({ value, max = 10 }) {
  const color = value >= 8 ? "text-emerald-700 bg-emerald-50" : value >= 6 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
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
    if (!hasApiKey()) { setError("Please add your Gemini API key first."); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await generateProductTeardown(productName, productUrl);
      setData(result);
    } catch (err) {
      if (err.name === "AbortError") { setLoading(false); return; }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleStop() {
    cancelCurrentRequest();
    setLoading(false);
  }

  if (!data && !loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Teardown</h2>
          <p className="text-gray-500">Enter any product for a full strategic teardown</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={productName} onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name (e.g. Notion, Stripe, Figma)"
            className="w-full p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none" />
          <input value={productUrl} onChange={(e) => setProductUrl(e.target.value)}
            placeholder="URL or additional context (optional)"
            className="w-full p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none" />
          <button type="submit" disabled={!productName.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Search className="w-4 h-4" /> Teardown Product
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <button onClick={onBack} className="mt-6 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition block mx-auto">← Back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-900 font-medium">Tearing down {productName}...</p>
        <button onClick={handleStop}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer">
          <Square className="w-3.5 h-3.5" /> Stop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.product_name}</h2>
        <p className="text-gray-500">{data.company} · {data.category}</p>
      </div>

      <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto">{data.summary}</p>

      {/* Ratings */}
      <div className="grid grid-cols-5 gap-3">
        {data.rating && Object.entries(data.rating).map(([key, val]) => (
          <div key={key} className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
            <p className="text-[10px] text-gray-500 uppercase mb-1">{key.replace(/_/g, " ")}</p>
            <p className={`text-2xl font-bold ${val >= 8 ? "text-emerald-600" : val >= 6 ? "text-amber-600" : "text-red-600"}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Business Model */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Business Model</h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">{data.business_model?.type}</span>
          <RatingBadge value={data.business_model?.monetization_rating} />
        </div>
        <p className="text-xs text-gray-500 mb-2">Est. ARR: <span className="text-gray-900 font-medium">{data.business_model?.estimated_arr}</span></p>
        <div className="flex flex-wrap gap-1.5">
          {data.business_model?.revenue_streams?.map((s, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{s}</span>
          ))}
        </div>
      </div>

      {/* UX */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">User Experience</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500">Onboarding:</span>
          <RatingBadge value={data.user_experience?.onboarding_score} />
        </div>
        <p className="text-xs text-gray-500 mb-3">{data.user_experience?.onboarding_notes}</p>
        <p className="text-xs text-gray-500 mb-2"><span className="text-gray-700 font-medium">Core Loop:</span> {data.user_experience?.core_loop}</p>
        <p className="text-xs text-indigo-600 mb-3"><span className="text-indigo-700 font-medium">Aha Moment:</span> {data.user_experience?.aha_moment}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-emerald-600 mb-1">Strengths</p>
            {data.user_experience?.ux_strengths?.map((s, i) => <p key={i} className="text-xs text-gray-700 mb-0.5">✓ {s}</p>)}
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 mb-1">Weaknesses</p>
            {data.user_experience?.ux_weaknesses?.map((w, i) => <p key={i} className="text-xs text-gray-700 mb-0.5">✗ {w}</p>)}
          </div>
        </div>
      </div>

      {/* Growth */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Growth Engine</h3>
        <p className="text-xs text-gray-500 mb-2">Primary Channel: <span className="text-gray-900 font-medium">{data.growth_engine?.primary_channel}</span></p>
        <p className="text-xs text-gray-500 mb-2">Viral Mechanics: <span className="text-gray-700">{data.growth_engine?.viral_mechanics}</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-indigo-600 mb-1">Growth Loops</p>
            {data.growth_engine?.growth_loops?.map((l, i) => <p key={i} className="text-xs text-gray-700 mb-0.5">🔄 {l}</p>)}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600 mb-1">Retention Hooks</p>
            {data.growth_engine?.retention_hooks?.map((h, i) => <p key={i} className="text-xs text-gray-700 mb-0.5">🪝 {h}</p>)}
          </div>
        </div>
      </div>

      {/* Moats */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Competitive Moats</h3>
        <div className="space-y-2">
          {data.competitive_moats?.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm text-sm text-gray-700">🏰 {m}</div>
          ))}
        </div>
      </div>

      {/* What I'd Change */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> What I'd Change</h3>
        <div className="space-y-3">
          {data.what_id_change?.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-900 font-medium mb-1">{c.area}</p>
              <p className="text-xs text-gray-500 mb-1">Current: {c.current_state}</p>
              <p className="text-xs text-emerald-600 mb-1">Proposed: {c.proposed_change}</p>
              <p className="text-xs text-indigo-600">Impact: {c.expected_impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PM Lessons */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-xs font-bold uppercase text-indigo-600 mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> PM Lessons</p>
        {data.pm_lessons?.map((l, i) => <p key={i} className="text-sm text-gray-700 mb-1">• {l}</p>)}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => setData(null)}
          className="flex-1 py-3 rounded-xl font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">
          Teardown Another
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
