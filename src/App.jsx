import { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Header from "./components/Header";
import ApiKeyInput from "./components/ApiKeyInput";
import IdeaInput from "./components/IdeaInput";
import Dashboard from "./components/Dashboard";
import ModuleWrapper from "./components/ModuleWrapper";
import PRDView from "./components/PRDView";
import PersonasView from "./components/PersonasView";
import PrioritizationView from "./components/PrioritizationView";
import UserStoriesView from "./components/UserStoriesView";
import SprintPlanView from "./components/SprintPlanView";
import ImpactView from "./components/ImpactView";
import ExperimentsView from "./components/ExperimentsView";
import MetricsView from "./components/MetricsView";
import PricingView from "./components/PricingView";
import StakeholderMapView from "./components/StakeholderMapView";
import StakeholderBrief from "./components/StakeholderBrief";
import BattlecardView from "./components/BattlecardView";
import GTMPlaybookView from "./components/GTMPlaybookView";
import OKRView from "./components/OKRView";
import ResumeScorer from "./components/ResumeScorer";
import LinkedInEvaluator from "./components/LinkedInEvaluator";
import ProductTeardownView from "./components/ProductTeardownView";
import QuickContext from "./components/QuickContext";
import {
  generatePRD, runPrioritization, simulateImpact, generateStakeholderBrief,
  generatePersonas, generateUserStories, generateSprintPlan,
  designExperiments, analyzeMetricsFramework, analyzePricing, mapStakeholders,
  generateBattlecards, generateGTMPlaybook, generateOKRs,
} from "./lib/gemini";
import { loadProjects, saveProject, deleteProject, createProjectId } from "./lib/storage";
import { getApiKey, setApiKey, hasApiKey } from "./lib/gemini";
import html2pdf from "html2pdf.js";
import "./App.css";

// view: "input" | "dashboard" | module key
function App() {
  const [view, setView] = useState("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryInfo, setRetryInfo] = useState(null); // { waitSec, attempt, maxRetries }
  const [projectId, setProjectId] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [ideaCache, setIdeaCache] = useState(null); // { idea, domain, targetUsers }
  const [quickContextTarget, setQuickContextTarget] = useState(null); // module key for quick-generate
  const [apiKey, setApiKeyState] = useState(getApiKey());

  function handleSaveApiKey(key) {
    setApiKey(key);
    setApiKeyState(key);
  }

  function handleClearApiKey() {
    setApiKey("");
    setApiKeyState("");
  }

  const [prd, setPrd] = useState(null);
  const [personas, setPersonas] = useState(null);
  const [prioritization, setPrioritization] = useState(null);
  const [stories, setStories] = useState(null);
  const [sprintPlan, setSprintPlan] = useState(null);
  const [impact, setImpact] = useState(null);
  const [experiments, setExperiments] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [stakeholderMap, setStakeholderMap] = useState(null);
  const [brief, setBrief] = useState(null);
  const [battlecards, setBattlecards] = useState(null);
  const [gtmPlaybook, setGtmPlaybook] = useState(null);
  const [okrs, setOkrs] = useState(null);

  const modules = { personas, prioritization, stories, sprintPlan, impact, experiments, metrics, pricing, battlecards, gtmPlaybook, okrs, stakeholderMap, brief };

  useEffect(() => {
    setSavedProjects(loadProjects());
  }, []);

  // Listen for API retry events to show countdown
  useEffect(() => {
    function onRetry(e) {
      const { waitSec, attempt, maxRetries } = e.detail;
      setRetryInfo({ waitSec, attempt, maxRetries });
      let remaining = waitSec;
      const interval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(interval);
          setRetryInfo(null);
        } else {
          setRetryInfo(prev => prev ? { ...prev, waitSec: remaining } : null);
        }
      }, 1000);
    }
    window.addEventListener("api-retry", onRetry);
    return () => window.removeEventListener("api-retry", onRetry);
  }, []);

  // Auto-save
  useEffect(() => {
    if (!prd || !projectId) return;
    const generated = Object.keys(modules).filter(k => modules[k]).length;
    const project = {
      id: projectId,
      title: prd.title,
      elevator_pitch: prd.elevator_pitch,
      created_at: new Date().toISOString(),
      generated_count: generated,
      ideaCache,
      data: { prd, personas, prioritization, stories, sprintPlan, impact, experiments, metrics, pricing, battlecards, gtmPlaybook, okrs, stakeholderMap, brief },
    };
    const updated = saveProject(project);
    setSavedProjects(updated);
  }, [prd, personas, prioritization, stories, sprintPlan, impact, experiments, metrics, pricing, battlecards, gtmPlaybook, okrs, stakeholderMap, brief]);

  function handleLoadProject(project) {
    setProjectId(project.id);
    setIdeaCache(project.ideaCache || null);
    const d = project.data;
    setPrd(d.prd || null);
    setPersonas(d.personas || null);
    setPrioritization(d.prioritization || null);
    setStories(d.stories || null);
    setSprintPlan(d.sprintPlan || null);
    setImpact(d.impact || null);
    setExperiments(d.experiments || null);
    setMetrics(d.metrics || null);
    setPricing(d.pricing || null);
    setBattlecards(d.battlecards || null);
    setGtmPlaybook(d.gtmPlaybook || null);
    setOkrs(d.okrs || null);
    setStakeholderMap(d.stakeholderMap || null);
    setBrief(d.brief || null);
    setError(null);
    setView("dashboard");
  }

  function handleDeleteProject(id) {
    setSavedProjects(deleteProject(id));
  }

  const handleReset = useCallback(() => {
    setView("input");
    setProjectId(null);
    setIdeaCache(null);
    setPrd(null);
    setPersonas(null);
    setPrioritization(null);
    setStories(null);
    setSprintPlan(null);
    setImpact(null);
    setExperiments(null);
    setMetrics(null);
    setPricing(null);
    setBattlecards(null);
    setGtmPlaybook(null);
    setOkrs(null);
    setStakeholderMap(null);
    setBrief(null);
    setError(null);
  }, []);

  async function generate(fn, setter, targetView) {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setter(result);
      if (targetView) setView(targetView);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Something went wrong. Please try again. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Module generators - maps module key to its generate function
  const generators = {
    personas:       () => generate(() => generatePersonas(prd), setPersonas, "personas"),
    prioritization: () => generate(() => runPrioritization(prd.features, "RICE"), setPrioritization, "prioritization"),
    stories:        () => generate(() => generateUserStories(prd), setStories, "stories"),
    sprintPlan:     () => generate(() => generateSprintPlan(prd, stories), setSprintPlan, "sprintPlan"),
    impact:         () => generate(() => simulateImpact(prd), setImpact, "impact"),
    experiments:    () => generate(() => designExperiments(prd), setExperiments, "experiments"),
    metrics:        () => generate(() => analyzeMetricsFramework(prd), setMetrics, "metrics"),
    pricing:        () => generate(() => analyzePricing(prd), setPricing, "pricing"),
    battlecards:    () => generate(() => generateBattlecards(prd), setBattlecards, "battlecards"),
    gtmPlaybook:    () => generate(() => generateGTMPlaybook(prd), setGtmPlaybook, "gtmPlaybook"),
    okrs:           () => generate(() => generateOKRs(prd), setOkrs, "okrs"),
    stakeholderMap: () => generate(() => mapStakeholders(prd), setStakeholderMap, "stakeholderMap"),
    brief:          () => generate(() => generateStakeholderBrief(prd, prioritization, impact), setBrief, "brief"),
  };

  // Standalone tools don't need generation, just navigate
  const STANDALONE_KEYS = ["resumeScorer", "linkedinEval", "teardown"];
  const PRODUCT_MODULE_KEYS = Object.keys(generators);

  function handleOpenModule(key) {
    if (key === "prd") {
      setView("prd");
      return;
    }
    if (STANDALONE_KEYS.includes(key)) {
      setView(key);
      return;
    }
    // If already generated, just show it
    if (modules[key]) {
      setView(key);
    } else {
      // Generate it
      generators[key]?.();
    }
  }

  // Quick-generate: user picks a module from input page without a PRD
  function handleOpenToolFromInput(key) {
    if (STANDALONE_KEYS.includes(key)) {
      setView(key);
      return;
    }
    // Product modules need context — show QuickContext form
    setQuickContextTarget(key);
    setView("quickContext");
  }

  // Build generators that accept a custom miniPrd instead of using the state prd
  function getGeneratorForMiniPrd(key, miniPrd) {
    const map = {
      personas:       () => generate(() => generatePersonas(miniPrd), setPersonas, "personas"),
      prioritization: () => generate(() => runPrioritization(miniPrd.features, "RICE"), setPrioritization, "prioritization"),
      stories:        () => generate(() => generateUserStories(miniPrd), setStories, "stories"),
      sprintPlan:     () => generate(() => generateSprintPlan(miniPrd, stories), setSprintPlan, "sprintPlan"),
      impact:         () => generate(() => simulateImpact(miniPrd), setImpact, "impact"),
      experiments:    () => generate(() => designExperiments(miniPrd), setExperiments, "experiments"),
      metrics:        () => generate(() => analyzeMetricsFramework(miniPrd), setMetrics, "metrics"),
      pricing:        () => generate(() => analyzePricing(miniPrd), setPricing, "pricing"),
      battlecards:    () => generate(() => generateBattlecards(miniPrd), setBattlecards, "battlecards"),
      gtmPlaybook:    () => generate(() => generateGTMPlaybook(miniPrd), setGtmPlaybook, "gtmPlaybook"),
      okrs:           () => generate(() => generateOKRs(miniPrd), setOkrs, "okrs"),
      stakeholderMap: () => generate(() => mapStakeholders(miniPrd), setStakeholderMap, "stakeholderMap"),
      brief:          () => generate(() => generateStakeholderBrief(miniPrd, prioritization, impact), setBrief, "brief"),
    };
    return map[key];
  }

  function handleQuickContextSubmit(miniPrd) {
    if (!prd) setPrd(miniPrd); // set as PRD so module views can reference it
    const gen = getGeneratorForMiniPrd(quickContextTarget, miniPrd);
    if (gen) gen();
  }

  function handleRegeneratePRD() {
    if (!ideaCache) return;
    generate(() => generatePRD(ideaCache.idea, ideaCache.domain, ideaCache.targetUsers), setPrd, "dashboard");
  }

  function handleEditIdea() {
    setView("input");
  }

  function goToDashboard() {
    setView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    // If we came from quick-context (mini PRD, no real dashboard), go to input
    if (quickContextTarget && !ideaCache) {
      setQuickContextTarget(null);
      setView("input");
    } else {
      setView(prd ? "dashboard" : "input");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleExportPDF(element) {
    if (!element) return;
    html2pdf().set({
      margin: 0.5,
      filename: `${prd?.title || "PM-Brief"}-Full-Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }).from(element).save();
  }

  // Progress for header: count generated modules + prd
  const generated = Object.keys(modules).filter(k => modules[k]).length;
  const totalModules = 14; // prd + 13 modules
  const currentStep = prd ? 1 + generated : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-900">
      <Header currentStep={currentStep} onReset={handleReset} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {retryInfo && (
          <div className="mb-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
            <div>
              <p className="text-[13px] text-amber-800 font-medium">Rate limited — retrying in {retryInfo.waitSec}s</p>
              <p className="text-[11px] text-amber-600 mt-0.5">Attempt {retryInfo.attempt}/{retryInfo.maxRetries}. Normal for free-tier keys.</p>
            </div>
          </div>
        )}

        {error && !retryInfo && (
          <div className="mb-8 flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <span className="text-[13px] text-red-700 font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-[12px] text-red-400 hover:text-red-600 transition cursor-pointer ml-4">dismiss</button>
          </div>
        )}

        {/* Input screen */}
        {view === "input" && (
          <IdeaInput
            onSubmit={({ idea, domain, targetUsers }) => {
              const pid = projectId || createProjectId();
              setProjectId(pid);
              setIdeaCache({ idea, domain, targetUsers });
              return generate(() => generatePRD(idea, domain, targetUsers), setPrd, "dashboard");
            }}
            isLoading={loading}
            savedProjects={savedProjects}
            onLoadProject={handleLoadProject}
            onDeleteProject={handleDeleteProject}
            initialValues={ideaCache}
            onOpenTool={handleOpenToolFromInput}
            apiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
            onClearApiKey={handleClearApiKey}
          />
        )}

        {/* Dashboard hub */}
        {view === "dashboard" && prd && (
          <Dashboard
            prd={prd}
            generatedModules={modules}
            onOpenModule={handleOpenModule}
            onRegeneratePRD={handleRegeneratePRD}
            onEditIdea={handleEditIdea}
            isLoading={loading}
          />
        )}

        {/* PRD detail view */}
        {view === "prd" && prd && (
          <ModuleWrapper onBack={goBack} onRegenerate={handleRegeneratePRD} isRegenerating={loading}>
            <PRDView prd={prd} onPrioritize={goBack} isLoading={false} />
          </ModuleWrapper>
        )}

        {/* Personas */}
        {view === "personas" && personas && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.personas} isRegenerating={loading}>
            <PersonasView data={personas} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Prioritization */}
        {view === "prioritization" && prioritization && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.prioritization} isRegenerating={loading}>
            <PrioritizationView data={prioritization} onSimulate={goBack} isLoading={false} />
          </ModuleWrapper>
        )}

        {/* User Stories */}
        {view === "stories" && stories && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.stories} isRegenerating={loading}>
            <UserStoriesView data={stories} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Sprint Plan */}
        {view === "sprintPlan" && sprintPlan && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.sprintPlan} isRegenerating={loading}>
            <SprintPlanView data={sprintPlan} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Impact */}
        {view === "impact" && impact && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.impact} isRegenerating={loading}>
            <ImpactView data={impact} onBrief={goBack} isLoading={false} />
          </ModuleWrapper>
        )}

        {/* Experiments */}
        {view === "experiments" && experiments && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.experiments} isRegenerating={loading}>
            <ExperimentsView data={experiments} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Metrics */}
        {view === "metrics" && metrics && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.metrics} isRegenerating={loading}>
            <MetricsView data={metrics} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Pricing */}
        {view === "pricing" && pricing && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.pricing} isRegenerating={loading}>
            <PricingView data={pricing} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Stakeholder Map */}
        {view === "stakeholderMap" && stakeholderMap && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.stakeholderMap} isRegenerating={loading}>
            <StakeholderMapView data={stakeholderMap} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Battlecards */}
        {view === "battlecards" && battlecards && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.battlecards} isRegenerating={loading}>
            <BattlecardView data={battlecards} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* GTM Playbook */}
        {view === "gtmPlaybook" && gtmPlaybook && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.gtmPlaybook} isRegenerating={loading}>
            <GTMPlaybookView data={gtmPlaybook} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* OKRs */}
        {view === "okrs" && okrs && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.okrs} isRegenerating={loading}>
            <OKRView data={okrs} onNext={goBack} isLoading={false} nextLabel="Back" />
          </ModuleWrapper>
        )}

        {/* Executive Brief */}
        {view === "brief" && brief && (
          <ModuleWrapper onBack={goBack} onRegenerate={generators.brief} isRegenerating={loading}>
            <StakeholderBrief data={brief} prd={prd} onExportPDF={handleExportPDF} />
          </ModuleWrapper>
        )}

        {/* Quick Context form */}
        {view === "quickContext" && quickContextTarget && (
          <QuickContext
            moduleKey={quickContextTarget}
            onSubmit={handleQuickContextSubmit}
            onBack={goBack}
            isLoading={loading}
          />
        )}

        {/* Standalone: Resume Scorer */}
        {view === "resumeScorer" && (
          <ResumeScorer onBack={goBack} />
        )}

        {/* Standalone: LinkedIn Evaluator */}
        {view === "linkedinEval" && (
          <LinkedInEvaluator onBack={goBack} />
        )}

        {/* Standalone: Product Teardown */}
        {view === "teardown" && (
          <ProductTeardownView onBack={goBack} />
        )}
      </main>

      <footer className="border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Product Brand */}
            <div>
              <p className="text-[14px] font-semibold text-gray-800 mb-1">A smarter workspace for product teams</p>
              <p className="text-[12px] text-gray-400 italic">Clarity for every product decision.</p>
            </div>

            {/* Personal Signature */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-[13px] font-bold text-indigo-600">TS</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-700">Built by Tushar Setia</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">PM + Systems Builder</span>
                  <span className="text-gray-300">·</span>
                  <a href="https://www.linkedin.com/in/tushar-setia" target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium transition">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
