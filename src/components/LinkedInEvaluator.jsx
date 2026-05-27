import { useState } from "react";
import { UserCircle, Loader2, Zap, CheckCircle2, AlertTriangle, Square } from "lucide-react";
import { evaluateLinkedIn, hasApiKey, cancelCurrentRequest } from "../lib/gemini";

function ScoreBar({ label, score }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full">
        <div className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600"}`}>{score}</span>
    </div>
  );
}

export default function LinkedInEvaluator({ onBack }) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isUrlValid = linkedinUrl.trim().length > 0 && /linkedin\.com\/in\//i.test(linkedinUrl);
  const isTextValid = profileText.trim().length >= 50;
  const canSubmit = isUrlValid || isTextValid;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    if (!hasApiKey()) { setError("Please add your Gemini API key first."); return; }
    setLoading(true);
    setError(null);
    try {
      // Build the input: combine URL context + any pasted text
      let input = "";
      if (isUrlValid) input += `LinkedIn Profile URL: ${linkedinUrl.trim()}\n\n`;
      if (profileText.trim()) input += profileText.trim();
      if (!input.trim()) return;
      const result = await evaluateLinkedIn(input);
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn PM Evaluator</h2>
          <p className="text-gray-500">Enter your LinkedIn URL or paste your profile text for expert PM feedback</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/your-profile"
              className="w-full p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-2.5">
              <span className="bg-gray-50 px-2 text-xs text-gray-400">and / or paste your profile text</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Profile Text <span className="text-gray-400 font-normal">(optional if URL provided)</span>
            </label>
            <textarea
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              rows={8}
              placeholder="Paste your LinkedIn headline, about, experience, skills here for more detailed analysis..."
              className="w-full p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCircle className="w-4 h-4" /> Evaluate Profile
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <button onClick={onBack} className="mt-6 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition block mx-auto">
          ← Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-900 font-medium">Evaluating your LinkedIn profile...</p>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Evaluation</h2>
        <p className="text-gray-500">Overall Score: <span className={`font-bold text-lg ${data.overall_score >= 80 ? "text-emerald-600" : data.overall_score >= 60 ? "text-amber-600" : "text-red-600"}`}>{data.overall_score}/100</span></p>
      </div>

      {/* Score Bars */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-3">
        <ScoreBar label="Overall" score={data.overall_score} />
        <ScoreBar label="Headline" score={data.headline_score} />
        <ScoreBar label="About" score={data.about_section?.score || 0} />
        <ScoreBar label="Experience" score={data.experience_score} />
      </div>

      {/* Headline */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Current Headline</p>
        <p className="text-sm text-gray-500 italic mb-3">"{data.current_headline}"</p>
        <p className="text-xs font-bold uppercase text-emerald-600 mb-2">Suggested Headlines</p>
        {data.suggested_headlines?.map((h, i) => (
          <p key={i} className="text-sm text-gray-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mb-2">💡 {h}</p>
        ))}
      </div>

      {/* About Section Rewrite */}
      {data.about_section && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500 mb-2">About Section</p>
          <p className="text-xs text-gray-500 mb-3">{data.about_section.feedback}</p>
          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-xs font-bold uppercase text-indigo-600 mb-1.5">Suggested Rewrite</p>
            <p className="text-sm text-gray-700 leading-relaxed">{data.about_section.suggested_rewrite}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs font-bold uppercase text-emerald-700 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Skills Present
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_analysis?.present?.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{s}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs font-bold uppercase text-red-700 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Missing Critical Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_analysis?.missing_critical?.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Strategy */}
      {data.content_strategy && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">Content Strategy</p>
          <p className="text-sm text-gray-500 mb-2">Post frequency: <span className="text-gray-900 font-medium">{data.content_strategy.post_frequency}</span></p>
          <p className="text-xs font-bold uppercase text-indigo-600 mb-1.5">Topics to Post About</p>
          {data.content_strategy.should_post_about?.map((t, i) => (
            <p key={i} className="text-sm text-gray-700 mb-1">• {t}</p>
          ))}
        </div>
      )}

      {/* Action Plan */}
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Action Plan
        </p>
        <div className="space-y-2">
          {data.action_plan?.map((a, i) => (
            <div key={i} className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${a.priority === "P0" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                  {a.priority}
                </span>
                <p className="text-sm text-gray-700">{a.action}</p>
              </div>
              <span className="text-xs text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => { setData(null); setLinkedinUrl(""); setProfileText(""); }}
          className="flex-1 py-3 rounded-xl font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">
          Evaluate Another
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
