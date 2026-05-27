import {
  FileText, Users, BarChart3, BookOpen, CalendarDays, TrendingUp,
  FlaskConical, Star, DollarSign, Users2, Briefcase, RefreshCw, Pencil,
  CheckCircle2, ArrowRight, Loader2, Swords, Rocket, Target,
  FileSearch, UserCircle, Search, Eye, Clock, ChevronRight,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Discovery & Research",
    desc: "Understand your users and stakeholders",
    modules: [
      { key: "personas", label: "User Personas", desc: "Empathy maps & day-in-the-life scenarios", preview: "3-5 detailed personas with goals, frustrations & behavior patterns", icon: Users, color: "bg-pink-50 text-pink-600" },
      { key: "stories", label: "User Stories", desc: "Epics, acceptance criteria & edge cases", preview: "Structured epics with story points and test scenarios", icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
      { key: "stakeholderMap", label: "Stakeholder Map", desc: "Power/interest grid, RACI & comms plan", preview: "Visual stakeholder matrix with communication cadence", icon: Users2, color: "bg-indigo-50 text-indigo-600" },
    ],
  },
  {
    title: "Strategy & Planning",
    desc: "Prioritize, price, and position your product",
    modules: [
      { key: "prioritization", label: "Feature Prioritization", desc: "RICE scoring & execution order", preview: "Ranked features with reach, impact, confidence & effort scores", icon: BarChart3, color: "bg-blue-50 text-blue-600" },
      { key: "pricing", label: "Pricing Strategy", desc: "Tiers, unit economics & revenue projection", preview: "Pricing tiers with LTV/CAC analysis and revenue model", icon: DollarSign, color: "bg-green-50 text-green-600" },
      { key: "battlecards", label: "Competitive Battlecards", desc: "Sales-ready intelligence & objection handling", preview: "Side-by-side competitor analysis with win/loss tactics", icon: Swords, color: "bg-red-50 text-red-600" },
      { key: "okrs", label: "OKRs", desc: "Cascading company, team & individual OKRs", preview: "Aligned objectives with measurable key results", icon: Target, color: "bg-amber-50 text-amber-600" },
    ],
  },
  {
    title: "Execution & Analysis",
    desc: "Plan sprints, run experiments, track metrics",
    modules: [
      { key: "sprintPlan", label: "Sprint Plan", desc: "Timeline, phases & launch checklist", preview: "Phase-by-phase roadmap with milestones and owners", icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
      { key: "experiments", label: "A/B Experiments", desc: "Hypotheses, guardrails & decision criteria", preview: "Structured experiment designs with statistical frameworks", icon: FlaskConical, color: "bg-orange-50 text-orange-600" },
      { key: "metrics", label: "Metrics Framework", desc: "North Star, AARRR & dashboard blueprint", preview: "Metric tree with acquisition, activation & retention KPIs", icon: Star, color: "bg-teal-50 text-teal-600" },
      { key: "impact", label: "Impact Simulation", desc: "12-month adoption, revenue & ROI analysis", preview: "Month-by-month projections with scenario modeling", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
    ],
  },
  {
    title: "Go-to-Market",
    desc: "Launch strategy and stakeholder communication",
    modules: [
      { key: "gtmPlaybook", label: "GTM Playbook", desc: "Launch timeline, messaging & channel strategy", preview: "Channel-by-channel launch plan with messaging templates", icon: Rocket, color: "bg-sky-50 text-sky-600" },
      { key: "brief", label: "Executive Brief", desc: "Stakeholder-ready document with PDF export", preview: "One-pager with key decisions, risks, and recommendations", icon: Briefcase, color: "bg-slate-100 text-slate-600" },
    ],
  },
  {
    title: "Career & Analysis Tools",
    desc: "Standalone tools for PM growth",
    modules: [
      { key: "resumeScorer", label: "PM Resume Scorer", desc: "Upload PDF for FAANG-level evaluation", preview: "Section-by-section scoring with rewrite suggestions", icon: FileSearch, color: "bg-rose-50 text-rose-600" },
      { key: "linkedinEval", label: "LinkedIn Evaluator", desc: "Profile audit with headline rewrites", preview: "Headline, summary & experience audit with AI rewrites", icon: UserCircle, color: "bg-blue-50 text-blue-600" },
      { key: "teardown", label: "Product Teardown", desc: "Full strategic teardown of any product", preview: "Business model, UX, moat & growth strategy analysis", icon: Search, color: "bg-orange-50 text-orange-600" },
    ],
  },
];

export default function Dashboard({ prd, generatedModules, onOpenModule, onRegeneratePRD, onEditIdea, isLoading }) {
  const genCount = Object.keys(generatedModules).filter(k => generatedModules[k]).length;
  const totalModules = SECTIONS.reduce((sum, s) => sum + s.modules.length, 0);
  const pct = Math.round((genCount / totalModules) * 100);

  // Find a recommended next module (first un-generated one)
  const nextModule = SECTIONS.flatMap(s => s.modules).find(m => !generatedModules[m.key]);

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* ─── Summary Strip ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          {/* Left: Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-600 font-semibold">Product PRD</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-tight mb-1.5">{prd.title}</h2>
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-xl">{prd.elevator_pitch}</p>

            {prd.target_audience?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {prd.target_audience.map((a, i) => (
                  <span key={i} className="text-[11px] text-gray-500 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">{a}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Stats + Actions */}
          <div className="flex flex-col items-start lg:items-end gap-4 flex-shrink-0">
            {/* Progress ring */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center bg-indigo-50 rounded-xl px-5 py-3 min-w-[80px]">
                <span className="text-[22px] font-bold text-indigo-600 tabular-nums">{pct}%</span>
                <span className="text-[10px] text-indigo-400 font-medium">Complete</span>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-gray-800">{genCount} of {totalModules}</p>
                <p className="text-[11px] text-gray-400">modules generated</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={onOpenModule.bind(null, "prd")}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition cursor-pointer flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> View PRD
              </button>
              <button onClick={onRegeneratePRD} disabled={isLoading}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer flex items-center gap-2 disabled:opacity-40">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Regenerate
              </button>
              <button onClick={onEditIdea}
                className="px-3 py-2 rounded-lg text-[13px] font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recommended Next + Progress ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            <p className="text-[14px] text-indigo-700 font-medium">Generating module — this may take a moment...</p>
          </div>
        )}

        {/* Recommended next */}
        {!isLoading && nextModule && (
          <button onClick={() => onOpenModule(nextModule.key)}
            className="flex-1 flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition cursor-pointer shadow-sm group">
            <div className={`w-10 h-10 rounded-xl ${nextModule.color} flex items-center justify-center flex-shrink-0`}>
              <nextModule.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-0.5">Recommended next</p>
              <p className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-600 transition">{nextModule.label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition" />
          </button>
        )}

        {/* Progress bar */}
        {genCount > 0 && !isLoading && (
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm min-w-[200px]">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[12px] font-medium text-gray-400 tabular-nums whitespace-nowrap">{genCount}/{totalModules}</span>
          </div>
        )}
      </div>

      {/* ─── Module Sections ─── */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-10">
          <div className="mb-4 px-1">
            <h3 className="text-[14px] font-semibold text-gray-900">{section.title}</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">{section.desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.modules.map((mod) => {
              const Icon = mod.icon;
              const isGenerated = !!generatedModules[mod.key];
              return (
                <button key={mod.key} onClick={() => !isLoading && onOpenModule(mod.key)} disabled={isLoading}
                  className={`card-hover text-left p-5 rounded-xl bg-white border transition-all group relative ${
                    isLoading ? "opacity-50 cursor-not-allowed border-gray-100" :
                    isGenerated ? "border-emerald-200 cursor-pointer" :
                    "border-gray-200 cursor-pointer"
                  }`}>

                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isGenerated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-medium">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-600 transition mb-1">{mod.label}</h4>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-3">{mod.desc}</p>

                  {/* Output preview hint */}
                  <div className="text-[11px] text-gray-300 leading-relaxed mb-3 border-t border-gray-100 pt-3">
                    {mod.preview}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-medium">
                      {isGenerated ? (
                        <span className="text-indigo-600 flex items-center gap-1">View results <ChevronRight className="w-3 h-3" /></span>
                      ) : (
                        <span className="text-gray-400 group-hover:text-indigo-500 transition flex items-center gap-1">
                          Generate <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
