import { useState } from "react";
import { Loader2, ArrowLeft, ArrowRight, Zap } from "lucide-react";

const MODULE_LABELS = {
  personas: "User Personas", prioritization: "Feature Prioritization", stories: "User Stories",
  sprintPlan: "Sprint Plan", impact: "Impact Simulation", experiments: "A/B Experiments",
  metrics: "Metrics Framework", pricing: "Pricing Strategy", battlecards: "Competitive Battlecards",
  gtmPlaybook: "GTM Playbook", okrs: "OKRs", stakeholderMap: "Stakeholder Map", brief: "Executive Brief",
};

export default function QuickContext({ moduleKey, onSubmit, onBack, isLoading }) {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");
  const [competitors, setCompetitors] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !problem.trim()) return;
    const miniPrd = {
      title: title.trim(),
      problem_statement: problem.trim(),
      elevator_pitch: problem.trim().slice(0, 80),
      target_audience: audience ? audience.split(",").map(a => a.trim()).filter(Boolean) : ["General users"],
      features: features
        ? features.split(",").map((f, i) => ({ name: f.trim(), priority: i < 3 ? "must-have" : "nice-to-have" }))
        : [{ name: "Core product feature", priority: "must-have" }],
      goals: [{ goal: "Achieve product-market fit" }, { goal: "Drive user adoption" }],
      success_metrics: [{ metric: "Monthly Active Users", target: "10,000" }, { metric: "Retention Rate", target: "40%" }],
      competitive_landscape: competitors
        ? competitors.split(",").map(c => ({ competitor: c.trim(), strength: "Established player", our_edge: "Innovation" }))
        : [],
    };
    onSubmit(miniPrd);
  }

  const label = MODULE_LABELS[moduleKey] || moduleKey;
  const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition cursor-pointer mb-8">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-4">
          <Zap className="w-3 h-3" /> Quick Generate
        </div>
        <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">{label}</h2>
        <p className="text-[15px] text-gray-500">Provide product context and we'll generate this module instantly.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Product Name *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Notion, Stripe, your product" className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Problem & Description *</label>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3}
              placeholder="Describe the product and the core problem it addresses..."
              className={`${inputCls} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Target Audience</label>
              <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="PMs, engineers, founders..." className={inputCls} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Competitors</label>
              <input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="Asana, Monday, ClickUp..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Key Features</label>
            <input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="AI sorting, real-time collab, analytics..." className={inputCls} />
          </div>

          <button type="submit" disabled={isLoading || !title.trim() || !problem.trim()}
            className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating {label}...</> : <>Generate {label} <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
