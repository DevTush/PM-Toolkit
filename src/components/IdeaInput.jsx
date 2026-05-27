import { useState } from "react";
import {
  ArrowRight, Loader2, Trash2,
  Users, BarChart3, BookOpen, CalendarDays, TrendingUp, FlaskConical,
  Star, DollarSign, Users2, Briefcase, Swords, Rocket, Target,
  FileSearch, UserCircle, Search, Clock, FileText, Layers, Zap,
  CheckCircle2, ChevronRight,
} from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";

const DOMAINS = [
  "Payments & Fintech", "Adtech & Marketing", "E-commerce & Retail",
  "SaaS & B2B", "Healthcare & Wellness", "Edtech & Learning",
  "Social & Community", "Logistics & Supply Chain", "AI & ML Platform", "Developer Tools",
];

const EXAMPLES = [
  { idea: "Smart checkout that reduces cart abandonment via real-time intent prediction and personalized incentives", domain: "E-commerce & Retail", users: "Online shoppers aged 18-45 on mobile" },
  { idea: "Real-time fraud detection with ML that minimizes false positives for legitimate transactions", domain: "Payments & Fintech", users: "Payment processors and merchants" },
  { idea: "Contextual ad engine using on-page content signals for privacy-first, post-cookie targeting", domain: "Adtech & Marketing", users: "Digital advertisers and publishers" },
];

const PROOF_CARDS = [
  {
    icon: FileText, color: "bg-indigo-50 text-indigo-600",
    title: "PRD Generation",
    desc: "Structured, investor-ready product requirements with goals, features, and success metrics.",
    items: ["Problem statement", "Feature specs", "Success metrics", "Target audience"],
  },
  {
    icon: Layers, color: "bg-violet-50 text-violet-600",
    title: "Decision Modules",
    desc: "13 specialized modules covering every stage from discovery to go-to-market.",
    items: ["RICE prioritization", "Impact simulation", "Sprint planning", "Competitive analysis"],
  },
  {
    icon: Zap, color: "bg-amber-50 text-amber-600",
    title: "Career & Analysis",
    desc: "Standalone tools for PM career growth and competitive product analysis.",
    items: ["Resume scoring", "LinkedIn evaluation", "Product teardown", "Executive briefs"],
  },
];

const QUICK_MODULES = [
  { key: "personas", label: "User Personas", desc: "Empathy maps & scenarios", icon: Users, color: "bg-pink-50 text-pink-600" },
  { key: "prioritization", label: "Prioritization", desc: "RICE scoring framework", icon: BarChart3, color: "bg-blue-50 text-blue-600" },
  { key: "stories", label: "User Stories", desc: "Epics & acceptance criteria", icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
  { key: "sprintPlan", label: "Sprint Plan", desc: "Timeline & launch checklist", icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
  { key: "impact", label: "Impact Simulation", desc: "12-month revenue & ROI", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
  { key: "experiments", label: "A/B Experiments", desc: "Hypotheses & guardrails", icon: FlaskConical, color: "bg-orange-50 text-orange-600" },
  { key: "metrics", label: "Metrics Framework", desc: "North Star & AARRR", icon: Star, color: "bg-teal-50 text-teal-600" },
  { key: "pricing", label: "Pricing Strategy", desc: "Tiers & unit economics", icon: DollarSign, color: "bg-green-50 text-green-600" },
  { key: "battlecards", label: "Battlecards", desc: "Competitive intelligence", icon: Swords, color: "bg-red-50 text-red-600" },
  { key: "gtmPlaybook", label: "GTM Playbook", desc: "Launch & channel strategy", icon: Rocket, color: "bg-sky-50 text-sky-600" },
  { key: "okrs", label: "OKRs", desc: "Cascading objectives", icon: Target, color: "bg-amber-50 text-amber-600" },
  { key: "stakeholderMap", label: "Stakeholder Map", desc: "RACI & comms plan", icon: Users2, color: "bg-indigo-50 text-indigo-600" },
  { key: "brief", label: "Executive Brief", desc: "Stakeholder-ready PDF", icon: Briefcase, color: "bg-slate-100 text-slate-600" },
  { key: "resumeScorer", label: "Resume Scorer", desc: "Upload PDF for scoring", icon: FileSearch, color: "bg-rose-50 text-rose-600" },
  { key: "linkedinEval", label: "LinkedIn Evaluator", desc: "Profile audit & rewrites", icon: UserCircle, color: "bg-blue-50 text-blue-600" },
  { key: "teardown", label: "Product Teardown", desc: "Full strategic analysis", icon: Search, color: "bg-orange-50 text-orange-600" },
];

export default function IdeaInput({ onSubmit, isLoading, savedProjects = [], onLoadProject, onDeleteProject, initialValues, onOpenTool, apiKey, onSaveApiKey, onClearApiKey }) {
  const [idea, setIdea] = useState(initialValues?.idea || "");
  const [domain, setDomain] = useState(initialValues?.domain || "");
  const [users, setUsers] = useState(initialValues?.targetUsers || "");
  const [tab, setTab] = useState("start");

  function handleExample(ex) { setIdea(ex.idea); setDomain(ex.domain); setUsers(ex.users); setTab("start"); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!idea.trim() || !domain || !users.trim()) return;
    onSubmit({ idea, domain, targetUsers: users });
  }

  const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

  return (
    <div className="animate-fade-up">

      {/* ─── Hero Section ─── */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[12px] font-medium mb-5">
          <Zap className="w-3 h-3" /> A smarter workspace for product teams
        </div>
        <h1 className="text-[34px] sm:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12] mb-4">
          Clarity for every<br />product decision
        </h1>
        <p className="text-[16px] sm:text-[17px] text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          Generate PRDs, run impact simulations, build GTM playbooks, score resumes, and more — all in one workspace.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { setTab("start"); document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition cursor-pointer flex items-center gap-2">
            Start Building <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => { setTab("modules"); document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-6 py-2.5 rounded-lg text-[14px] font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition cursor-pointer">
            Browse Modules
          </button>
        </div>
      </div>

      {/* ─── Proof Cards ─── */}
      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-4 mb-16">
        {PROOF_CARDS.map(({ icon: Icon, color, title, desc, items }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{desc}</p>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Workspace Section ─── */}
      <div id="workspace" className="max-w-5xl mx-auto">

        {/* API Key Input */}
        <div className="mb-6">
          <ApiKeyInput apiKey={apiKey} onSave={onSaveApiKey} onClear={onClearApiKey} />
        </div>

        {/* Section Header + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">Workspace</h2>
            <p className="text-[13px] text-gray-400 mt-0.5">Choose how you want to get started</p>
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg self-start">
            <button onClick={() => setTab("start")}
              className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition cursor-pointer ${tab === "start" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              New Product
            </button>
            <button onClick={() => setTab("modules")}
              className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition cursor-pointer ${tab === "modules" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Quick Modules
            </button>
          </div>
        </div>

        {/* ─── Tab: New Product ─── */}
        {tab === "start" && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form Card — takes 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Describe your product</h3>
              <p className="text-[13px] text-gray-400 mb-6">We'll generate a full PRD with 13+ specialized modules.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Product Idea</label>
                  <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3}
                    placeholder="Describe what you're building and the problem it solves..."
                    className={`${inputCls} resize-none`} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Domain</label>
                    <select value={domain} onChange={(e) => setDomain(e.target.value)} className={`${inputCls} pr-10`}>
                      <option value="">Select domain...</option>
                      {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Target Users</label>
                    <input value={users} onChange={(e) => setUsers(e.target.value)}
                      placeholder="e.g. Mobile-first millennials"
                      className={inputCls} />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !idea.trim() || !domain || !users.trim() || !apiKey}
                  className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PRD...</> : <>Generate Full PRD <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>

            {/* Right Sidebar — takes 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Try an example */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Try an example</h4>
                <div className="space-y-2">
                  {EXAMPLES.map((ex, i) => (
                    <button key={i} onClick={() => handleExample(ex)}
                      className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition cursor-pointer group">
                      <p className="text-[13px] font-medium text-gray-700 group-hover:text-indigo-600 transition leading-snug">{ex.domain}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{ex.idea}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview: What you'll get */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-[13px] font-semibold text-gray-900 mb-3">What you'll get</h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Product Requirements Doc", sub: "Goals, features, audience, metrics" },
                    { label: "User Personas & Stories", sub: "Empathy maps, epics, acceptance criteria" },
                    { label: "Prioritization & Sprint Plan", sub: "RICE scores, timeline, launch checklist" },
                    { label: "GTM & Executive Brief", sub: "Go-to-market strategy, stakeholder PDF" },
                  ].map(({ label, sub }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] font-medium text-gray-700">{label}</p>
                        <p className="text-[11px] text-gray-400">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Tab: Quick Modules ─── */}
        {tab === "modules" && onOpenTool && (
          <div>
            <p className="text-[14px] text-gray-500 mb-6">
              Already have a product? Pick a module and provide quick context.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {QUICK_MODULES.map(({ key, label, desc, icon: Icon, color }) => (
                <button key={key} onClick={() => onOpenTool(key)}
                  className="card-hover text-left p-4 rounded-xl bg-white border border-gray-200 cursor-pointer group">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-800 group-hover:text-indigo-600 transition mb-0.5">{label}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Recent Projects ─── */}
        {savedProjects.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-[14px] font-semibold text-gray-900">Recent Projects</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {savedProjects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between group hover:bg-gray-50 transition px-5 py-3.5">
                  <button onClick={() => onLoadProject(proj)} className="flex-1 text-left cursor-pointer bg-transparent border-none p-0 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[14px] text-gray-800 group-hover:text-indigo-600 transition font-medium">{proj.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{proj.generated_count || 0} modules · {new Date(proj.created_at).toLocaleDateString()}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onDeleteProject(proj.id); }}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
