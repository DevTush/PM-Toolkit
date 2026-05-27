import { ArrowLeft, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Info, ArrowRight } from "lucide-react";

// Maps module keys to what PRD fields they use and what upstream modules improve them
const MODULE_CONTEXT = {
  personas:       { used: ["title", "problem_statement", "target_audience"], inferred: ["daily routines", "frustrations", "tech stack"], bestWith: [] },
  prioritization: { used: ["features"], inferred: ["reach scores", "effort estimates"], bestWith: [] },
  stories:        { used: ["title", "features"], inferred: ["acceptance criteria", "edge cases"], bestWith: [] },
  sprintPlan:     { used: ["title", "features"], inferred: ["velocity", "sprint capacity", "dependencies"], bestWith: ["stories"] },
  impact:         { used: ["title", "features", "goals", "success_metrics"], inferred: ["adoption curves", "revenue projections"], bestWith: [] },
  experiments:    { used: ["title", "features", "success_metrics"], inferred: ["sample sizes", "statistical power"], bestWith: [] },
  metrics:        { used: ["title", "goals"], inferred: ["AARRR breakdown", "dashboard layout"], bestWith: [] },
  pricing:        { used: ["title", "problem_statement", "target_audience"], inferred: ["willingness-to-pay", "tier structure"], bestWith: [] },
  battlecards:    { used: ["title", "problem_statement", "competitive_landscape"], inferred: ["objection handling", "win/loss tactics"], bestWith: [] },
  gtmPlaybook:    { used: ["title", "problem_statement", "target_audience", "features"], inferred: ["channel mix", "messaging", "timeline"], bestWith: [] },
  okrs:           { used: ["title", "goals", "success_metrics"], inferred: ["team-level OKRs", "key result targets"], bestWith: [] },
  stakeholderMap: { used: ["title"], inferred: ["stakeholder roles", "RACI", "communication cadence"], bestWith: [] },
  brief:          { used: ["title", "problem_statement", "goals"], inferred: ["executive narrative", "risk summary"], bestWith: ["prioritization", "impact"] },
};

const FIELD_LABELS = {
  title: "Title", problem_statement: "Problem", target_audience: "Audience",
  features: "Features", goals: "Goals", success_metrics: "Metrics",
  competitive_landscape: "Competitors", risks: "Risks",
};

function ContextBanner({ moduleKey, prd, generatedModules, nextStep, onOpenModule }) {
  const ctx = MODULE_CONTEXT[moduleKey];
  if (!ctx) return null;

  const usedFields = ctx.used.filter(f => {
    const val = prd?.[f];
    return Array.isArray(val) ? val.length > 0 : !!val;
  });
  const missingFields = ctx.used.filter(f => {
    const val = prd?.[f];
    return Array.isArray(val) ? val.length === 0 : !val;
  });
  const missingUpstream = ctx.bestWith.filter(k => !generatedModules?.[k]);

  return (
    <div className="max-w-4xl mx-auto mb-6 space-y-2">
      {/* Used from PRD */}
      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[11px] font-semibold text-emerald-700">Used from PRD: </span>
          <span className="text-[11px] text-emerald-600">{usedFields.map(f => FIELD_LABELS[f] || f).join(", ") || "Basic context"}</span>
        </div>
      </div>

      {/* Inferred */}
      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
        <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[11px] font-semibold text-blue-700">Inferred by AI: </span>
          <span className="text-[11px] text-blue-600">{ctx.inferred.join(", ")}</span>
        </div>
      </div>

      {/* Missing from PRD */}
      {missingFields.length > 0 && (
        <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-semibold text-amber-700">Missing from PRD: </span>
            <span className="text-[11px] text-amber-600">{missingFields.map(f => FIELD_LABELS[f] || f).join(", ")} — edit PRD for better results</span>
          </div>
        </div>
      )}

      {/* Better with upstream modules */}
      {missingUpstream.length > 0 && (
        <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-violet-50/60 border border-violet-100">
          <Info className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-semibold text-violet-700">Better with: </span>
            <span className="text-[11px] text-violet-600">{missingUpstream.join(", ")} — generate those first for richer output</span>
          </div>
        </div>
      )}

      {/* Recommended next step */}
      {nextStep && onOpenModule && (
        <button onClick={() => onOpenModule(nextStep.key)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer w-full text-left">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          Recommended next: {nextStep.label}
        </button>
      )}
    </div>
  );
}

export default function ModuleWrapper({ children, onBack, onRegenerate, isRegenerating, moduleKey, prd, generatedModules, nextStep, onOpenModule }) {
  return (
    <div className="animate-fade-up">
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button onClick={onRegenerate} disabled={isRegenerating}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition cursor-pointer disabled:opacity-30">
          {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Regenerate
        </button>
      </div>

      {moduleKey && prd && (
        <ContextBanner moduleKey={moduleKey} prd={prd} generatedModules={generatedModules} nextStep={nextStep} onOpenModule={onOpenModule} />
      )}

      {children}
    </div>
  );
}
