import { useState } from "react";
import { Loader2, ArrowLeft, ArrowRight, Zap, Square } from "lucide-react";
import { hasApiKey } from "../lib/gemini";

// Each module's metadata: label, description, and which fields it needs
const MODULE_CONFIG = {
  personas: {
    label: "User Personas",
    desc: "Generate empathy maps and day-in-the-life scenarios for your target users.",
    fields: ["title", "problem", "audience"],
  },
  prioritization: {
    label: "Feature Prioritization",
    desc: "Score and rank your features using the RICE framework.",
    fields: ["title", "features"],
  },
  stories: {
    label: "User Stories",
    desc: "Generate epics with acceptance criteria and edge cases.",
    fields: ["title", "features"],
  },
  sprintPlan: {
    label: "Sprint Plan",
    desc: "Create a sprint-by-sprint execution timeline with dependencies.",
    fields: ["title", "features", "userStories"],
  },
  impact: {
    label: "Impact Simulation",
    desc: "Simulate 12-month adoption, revenue, and ROI projections.",
    fields: ["title", "features", "goals", "successMetrics"],
  },
  experiments: {
    label: "A/B Experiments",
    desc: "Design experiments with hypotheses, guardrails, and decision criteria.",
    fields: ["title", "features", "successMetrics"],
  },
  metrics: {
    label: "Metrics Framework",
    desc: "Build a North Star metric tree with AARRR pirate metrics.",
    fields: ["title", "goals"],
  },
  pricing: {
    label: "Pricing Strategy",
    desc: "Design pricing tiers with unit economics and revenue projection.",
    fields: ["title", "problem", "audience"],
  },
  battlecards: {
    label: "Competitive Battlecards",
    desc: "Create sales-ready competitive intelligence and objection handling.",
    fields: ["title", "problem", "competitors"],
  },
  gtmPlaybook: {
    label: "GTM Playbook",
    desc: "Plan launch strategy, messaging, channel mix, and timeline.",
    fields: ["title", "problem", "audience", "features"],
  },
  okrs: {
    label: "OKRs",
    desc: "Generate cascading objectives and key results across teams.",
    fields: ["title", "goals", "successMetrics"],
  },
  stakeholderMap: {
    label: "Stakeholder Map",
    desc: "Map stakeholders with RACI matrix and communication plan.",
    fields: ["title"],
  },
  brief: {
    label: "Executive Brief",
    desc: "Generate a stakeholder-ready executive summary document.",
    fields: ["title", "problem", "goals", "successMetrics"],
  },
};

// Field definitions: label, placeholder, type, required
const FIELD_DEFS = {
  title:          { label: "Product Name",       placeholder: "e.g. Notion, Stripe, your product",                   type: "input",    required: true },
  problem:        { label: "Problem / Description", placeholder: "Describe the product and the core problem it solves...", type: "textarea", required: true },
  audience:       { label: "Target Audience",    placeholder: "e.g. PMs, startup founders, enterprise teams...",       type: "input",    required: false },
  features:       { label: "Key Features",       placeholder: "e.g. AI sorting, real-time collab, analytics (comma-separated)", type: "input", required: false },
  competitors:    { label: "Competitors",        placeholder: "e.g. Asana, Monday, ClickUp (comma-separated)",        type: "input",    required: false },
  goals:          { label: "Product Goals",      placeholder: "e.g. Increase retention, reduce churn, expand to enterprise (comma-separated)", type: "input", required: false },
  successMetrics: { label: "Success Metrics",    placeholder: "e.g. MAU: 10K, Retention: 40%, NPS: 50 (comma-separated)", type: "input", required: false },
  userStories:    { label: "Key User Stories / Requirements", placeholder: "e.g. As a PM, I want to prioritize features; As a user, I want to sign up via SSO (one per line)", type: "textarea", required: false },
};

export default function QuickContext({ moduleKey, onSubmit, onBack, isLoading, onStop }) {
  const config = MODULE_CONFIG[moduleKey] || { label: moduleKey, desc: "", fields: ["title", "problem"] };
  const label = config.label;

  // Dynamic state for all possible fields
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);

  function set(key, val) { setValues(prev => ({ ...prev, [key]: val })); }
  function get(key) { return values[key] || ""; }

  // Check required fields are filled
  const requiredOk = config.fields.every(f => {
    const def = FIELD_DEFS[f];
    return !def?.required || get(f).trim().length > 0;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!requiredOk) return;
    if (!hasApiKey()) { setError("Please add your Gemini API key first."); return; }
    setError(null);

    // Build a miniPrd with only the relevant populated fields
    const v = (key) => get(key).trim();
    const csvToList = (key) => v(key) ? v(key).split(",").map(s => s.trim()).filter(Boolean) : [];

    const miniPrd = {
      title: v("title") || "Product",
      problem_statement: v("problem") || "",
      elevator_pitch: (v("problem") || v("title")).slice(0, 80),
      target_audience: csvToList("audience").length > 0 ? csvToList("audience") : ["General users"],
      features: csvToList("features").length > 0
        ? csvToList("features").map((f, i) => ({ name: f, priority: i < 3 ? "P0" : "P1" }))
        : [{ name: "Core feature", priority: "P0" }],
      goals: csvToList("goals").length > 0
        ? csvToList("goals").map(g => ({ goal: g }))
        : [{ goal: "Achieve product-market fit" }, { goal: "Drive user adoption" }],
      success_metrics: csvToList("successMetrics").length > 0
        ? csvToList("successMetrics").map(m => {
            const [metric, ...rest] = m.split(":");
            return { metric: metric.trim(), target: rest.join(":").trim() || "TBD" };
          })
        : [{ metric: "Monthly Active Users", target: "10,000" }, { metric: "Retention Rate", target: "40%" }],
      competitive_landscape: csvToList("competitors").length > 0
        ? csvToList("competitors").map(c => ({ competitor: c, strength: "Established player", our_edge: "Innovation" }))
        : [],
    };

    // For sprintPlan, attach user stories text as a structured stories object
    if (moduleKey === "sprintPlan" && v("userStories")) {
      miniPrd._userStoriesText = v("userStories");
    }

    onSubmit(miniPrd);
  }

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
        <p className="text-[15px] text-gray-500">{config.desc}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {config.fields.map((fieldKey) => {
            const def = FIELD_DEFS[fieldKey];
            if (!def) return null;
            return (
              <div key={fieldKey}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {def.label}{def.required ? " *" : ""}
                </label>
                {def.type === "textarea" ? (
                  <textarea
                    value={get(fieldKey)}
                    onChange={(e) => set(fieldKey, e.target.value)}
                    rows={3}
                    placeholder={def.placeholder}
                    className={`${inputCls} resize-none`}
                  />
                ) : (
                  <input
                    value={get(fieldKey)}
                    onChange={(e) => set(fieldKey, e.target.value)}
                    placeholder={def.placeholder}
                    className={inputCls}
                  />
                )}
              </div>
            );
          })}

          {isLoading ? (
            <div className="flex gap-2">
              <div className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 flex items-center justify-center gap-2 opacity-80">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating {label}...
              </div>
              {onStop && (
                <button type="button" onClick={onStop}
                  className="px-4 py-2.5 rounded-lg text-[14px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5" /> Stop
                </button>
              )}
            </div>
          ) : (
            <button type="submit" disabled={!requiredOk}
              className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer">
              Generate {label} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
