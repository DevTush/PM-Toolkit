import {
  FileText, Users, BarChart3, BookOpen, CalendarDays, TrendingUp,
  FlaskConical, Star, DollarSign, Users2, Briefcase, RefreshCw, Pencil,
  CheckCircle2, ArrowRight, Loader2, Swords, Rocket, Target,
  FileSearch, UserCircle, Search, Eye, Clock, ChevronRight, Square,
  AlertTriangle, Info, Sparkles,
} from "lucide-react";

// ─── Workflow-based module organization ───
const WORKFLOW_SECTIONS = [
  {
    phase: "Discover",
    title: "Discover & Research",
    desc: "Understand your users, stakeholders, and problem space",
    color: "border-l-pink-400",
    badge: "bg-pink-50 text-pink-600",
    modules: [
      { key: "personas", label: "User Personas", desc: "Empathy maps & day-in-the-life scenarios", icon: Users, color: "bg-pink-50 text-pink-600", deps: [], bestWith: ["PRD audience & problem statement"] },
      { key: "stories", label: "User Stories", desc: "Epics, acceptance criteria & edge cases", icon: BookOpen, color: "bg-emerald-50 text-emerald-600", deps: [], bestWith: ["PRD features"] },
      { key: "stakeholderMap", label: "Stakeholder Map", desc: "Power/interest grid, RACI & comms plan", icon: Users2, color: "bg-indigo-50 text-indigo-600", deps: [], bestWith: ["PRD title & context"] },
    ],
    nextPhase: "Decide",
  },
  {
    phase: "Decide",
    title: "Decide & Strategize",
    desc: "Prioritize features, plan pricing, and assess competition",
    color: "border-l-blue-400",
    badge: "bg-blue-50 text-blue-600",
    modules: [
      { key: "prioritization", label: "Feature Prioritization", desc: "RICE scoring & execution order", icon: BarChart3, color: "bg-blue-50 text-blue-600", deps: [], bestWith: ["PRD features"] },
      { key: "pricing", label: "Pricing Strategy", desc: "Tiers, unit economics & revenue projection", icon: DollarSign, color: "bg-green-50 text-green-600", deps: [], bestWith: ["PRD audience & problem"] },
      { key: "battlecards", label: "Competitive Battlecards", desc: "Sales-ready intelligence & objection handling", icon: Swords, color: "bg-red-50 text-red-600", deps: [], bestWith: ["PRD competitors"] },
      { key: "okrs", label: "OKRs", desc: "Cascading company, team & individual OKRs", icon: Target, color: "bg-amber-50 text-amber-600", deps: [], bestWith: ["PRD goals & metrics"] },
    ],
    nextPhase: "Deliver",
  },
  {
    phase: "Deliver",
    title: "Deliver & Execute",
    desc: "Plan sprints, design experiments, and track metrics",
    color: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-600",
    modules: [
      { key: "sprintPlan", label: "Sprint Plan", desc: "Timeline, phases & launch checklist", icon: CalendarDays, color: "bg-amber-50 text-amber-600", deps: ["stories"], bestWith: ["User Stories", "Prioritization"] },
      { key: "experiments", label: "A/B Experiments", desc: "Hypotheses, guardrails & decision criteria", icon: FlaskConical, color: "bg-orange-50 text-orange-600", deps: [], bestWith: ["PRD features & metrics"] },
      { key: "metrics", label: "Metrics Framework", desc: "North Star, AARRR & dashboard blueprint", icon: Star, color: "bg-teal-50 text-teal-600", deps: [], bestWith: ["PRD goals"] },
      { key: "impact", label: "Impact Simulation", desc: "12-month adoption, revenue & ROI analysis", icon: TrendingUp, color: "bg-violet-50 text-violet-600", deps: [], bestWith: ["PRD features & goals"] },
    ],
    nextPhase: "Launch",
  },
  {
    phase: "Launch",
    title: "Launch & Communicate",
    desc: "Go-to-market strategy and stakeholder communication",
    color: "border-l-sky-400",
    badge: "bg-sky-50 text-sky-600",
    modules: [
      { key: "gtmPlaybook", label: "GTM Playbook", desc: "Launch timeline, messaging & channel strategy", icon: Rocket, color: "bg-sky-50 text-sky-600", deps: [], bestWith: ["PRD audience, features & positioning"] },
      { key: "brief", label: "Executive Brief", desc: "Stakeholder-ready document with PDF export", icon: Briefcase, color: "bg-slate-100 text-slate-600", deps: ["prioritization", "impact"], bestWith: ["Prioritization", "Impact Simulation"] },
    ],
    nextPhase: null,
  },
];

const CAREER_TOOLS = [
  { key: "resumeScorer", label: "PM Resume Scorer", desc: "Upload PDF for FAANG-level evaluation", icon: FileSearch, color: "bg-rose-50 text-rose-600" },
  { key: "linkedinEval", label: "LinkedIn Evaluator", desc: "Profile audit with headline rewrites", icon: UserCircle, color: "bg-blue-50 text-blue-600" },
  { key: "teardown", label: "Product Teardown", desc: "Full strategic teardown of any product", icon: Search, color: "bg-orange-50 text-orange-600" },
];

// Recommended next step logic based on what's already generated
const NEXT_STEP_MAP = {
  personas: "stories",
  stories: "prioritization",
  stakeholderMap: "prioritization",
  prioritization: "sprintPlan",
  pricing: "battlecards",
  battlecards: "gtmPlaybook",
  okrs: "metrics",
  sprintPlan: "experiments",
  experiments: "metrics",
  metrics: "impact",
  impact: "brief",
  gtmPlaybook: "brief",
  brief: null,
};

function getSmartNextModule(generatedModules) {
  // Walk the recommended path: Personas → Stories → Prioritization → Sprint → ... → Brief
  const orderedPath = ["personas", "stories", "prioritization", "sprintPlan", "experiments", "metrics", "impact", "okrs", "pricing", "battlecards", "gtmPlaybook", "brief", "stakeholderMap"];
  return orderedPath.find(k => !generatedModules[k]);
}

export default function Dashboard({ prd, generatedModules, onOpenModule, onRegeneratePRD, onEditIdea, onEditPRD, isLoading, onStop, prdUpdatedAt, moduleTimestamps }) {
  const productModuleKeys = WORKFLOW_SECTIONS.flatMap(s => s.modules.map(m => m.key));
  const genCount = productModuleKeys.filter(k => generatedModules[k]).length;
  const totalModules = productModuleKeys.length;
  const pct = Math.round((genCount / totalModules) * 100);

  const smartNext = getSmartNextModule(generatedModules);
  const smartNextMod = WORKFLOW_SECTIONS.flatMap(s => s.modules).find(m => m.key === smartNext);

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* ─── PRD Summary Strip ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-600 font-semibold">Source of Truth — Product PRD</span>
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

            {/* PRD data completeness indicators */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: "Features", ok: prd.features?.length > 0 },
                { label: "Goals", ok: prd.goals?.length > 0 },
                { label: "Metrics", ok: prd.success_metrics?.length > 0 },
                { label: "Competitors", ok: prd.competitive_landscape?.length > 0 },
                { label: "Risks", ok: prd.risks?.length > 0 },
              ].map(({ label, ok }) => (
                <span key={label} className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  {ok ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4 flex-shrink-0">
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
              {onEditPRD && (
                <button onClick={onEditPRD}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer flex items-center gap-2">
                  <Pencil className="w-3.5 h-3.5" /> Edit PRD
                </button>
              )}
              <button onClick={onRegeneratePRD} disabled={isLoading}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer flex items-center gap-2 disabled:opacity-40">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Loading / Recommended Next ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {isLoading && (
          <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            <p className="flex-1 text-[14px] text-indigo-700 font-medium">Generating module — this may take a moment...</p>
            {onStop && (
              <button onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer flex-shrink-0">
                <Square className="w-3 h-3" /> Stop
              </button>
            )}
          </div>
        )}

        {!isLoading && smartNextMod && (
          <button onClick={() => onOpenModule(smartNextMod.key)}
            className="flex-1 flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition cursor-pointer shadow-sm group">
            <div className={`w-10 h-10 rounded-xl ${smartNextMod.color} flex items-center justify-center flex-shrink-0`}>
              <smartNextMod.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-0.5">Recommended next step</p>
              <p className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-600 transition">{smartNextMod.label}</p>
              {smartNextMod.bestWith?.length > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">Best with: {smartNextMod.bestWith.join(", ")}</p>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition" />
          </button>
        )}

        {genCount > 0 && !isLoading && (
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm min-w-[200px]">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[12px] font-medium text-gray-400 tabular-nums whitespace-nowrap">{genCount}/{totalModules}</span>
          </div>
        )}
      </div>

      {/* ─── Workflow Phases ─── */}
      {WORKFLOW_SECTIONS.map((section) => {
        const sectionGenCount = section.modules.filter(m => generatedModules[m.key]).length;
        const sectionTotal = section.modules.length;
        const sectionComplete = sectionGenCount === sectionTotal;

        return (
          <div key={section.phase} className={`mb-10 border-l-4 ${section.color} pl-5`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${section.badge}`}>
                {sectionComplete ? <CheckCircle2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                {section.phase}
              </span>
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900">{section.title}</h3>
                <p className="text-[12px] text-gray-400">{section.desc}</p>
              </div>
              <span className="ml-auto text-[11px] text-gray-400 font-medium tabular-nums">{sectionGenCount}/{sectionTotal}</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.modules.map((mod) => {
                const Icon = mod.icon;
                const isGenerated = !!generatedModules[mod.key];
                const isStale = isGenerated && prdUpdatedAt && moduleTimestamps?.[mod.key] && moduleTimestamps[mod.key] < prdUpdatedAt;
                const missingDeps = mod.deps.filter(d => !generatedModules[d]);
                const hasMissingDeps = missingDeps.length > 0;

                return (
                  <button key={mod.key} onClick={() => !isLoading && onOpenModule(mod.key)} disabled={isLoading}
                    className={`card-hover text-left p-5 rounded-xl bg-white border transition-all group relative ${
                      isLoading ? "opacity-50 cursor-not-allowed border-gray-100" :
                      isStale ? "border-amber-300 cursor-pointer" :
                      isGenerated ? "border-emerald-200 cursor-pointer" :
                      "border-gray-200 cursor-pointer"
                    }`}>

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isStale ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" /> Stale
                        </span>
                      ) : isGenerated ? (
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
                    <p className="text-[12px] text-gray-400 leading-relaxed mb-2">{mod.desc}</p>

                    {/* Dependency hint */}
                    {!isGenerated && hasMissingDeps && (
                      <div className="flex items-start gap-1.5 mb-2 px-2 py-1.5 rounded-md bg-amber-50/60 border border-amber-100">
                        <Info className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 leading-snug">Better with: {mod.bestWith.join(", ")}</p>
                      </div>
                    )}

                    {isStale && (
                      <div className="flex items-start gap-1.5 mb-2 px-2 py-1.5 rounded-md bg-amber-50/60 border border-amber-100">
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 leading-snug">PRD updated since this was generated — regenerate for latest data</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        {isStale ? (
                          <span className="text-amber-600 flex items-center gap-1">Refresh <RefreshCw className="w-3 h-3" /></span>
                        ) : isGenerated ? (
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

            {/* Phase transition hint */}
            {section.nextPhase && sectionComplete && (
              <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-600 font-medium pl-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {section.phase} phase complete — proceed to {section.nextPhase}
              </div>
            )}
          </div>
        );
      })}

      {/* ─── Career & Analysis Tools (separate section) ─── */}
      <div className="mb-10 mt-14 pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4 px-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
            <Sparkles className="w-3 h-3" /> Standalone
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900">Career & Analysis Tools</h3>
            <p className="text-[12px] text-gray-400">Independent tools — no PRD required</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAREER_TOOLS.map((mod) => {
            const Icon = mod.icon;
            return (
              <button key={mod.key} onClick={() => !isLoading && onOpenModule(mod.key)} disabled={isLoading}
                className="card-hover text-left p-5 rounded-xl bg-white border border-gray-200 cursor-pointer transition-all group">
                <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-600 transition mb-1">{mod.label}</h4>
                <p className="text-[12px] text-gray-400 leading-relaxed mb-3">{mod.desc}</p>
                <span className="text-gray-400 group-hover:text-indigo-500 transition flex items-center gap-1 text-[11px] font-medium">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
