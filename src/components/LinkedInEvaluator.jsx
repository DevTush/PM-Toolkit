import { useState } from "react";
import { UserCircle, Loader2, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { evaluateLinkedIn } from "../lib/gemini";

function ScoreBar({ label, score }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full">
        <div className={`h-full rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{score}</span>
    </div>
  );
}

export default function LinkedInEvaluator({ onBack }) {
  const [profileText, setProfileText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!profileText.trim() || profileText.length < 50) return;
    setLoading(true);
    setError(null);
    try {
      const result = await evaluateLinkedIn(profileText);
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
          <h2 className="text-3xl font-bold text-white mb-2">LinkedIn PM Evaluator</h2>
          <p className="text-gray-400">Paste your LinkedIn profile text and get expert PM positioning feedback</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Copy-paste your LinkedIn profile (headline, about, experience, skills)
            </label>
            <textarea
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              rows={12}
              placeholder="Paste your full LinkedIn profile text here...&#10;&#10;Include: Headline, About section, Experience, Skills, Education"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500/50 focus:outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!profileText.trim() || profileText.length < 50}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCircle className="w-4 h-4" /> Evaluate Profile
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        <button onClick={onBack} className="mt-6 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition block mx-auto">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-lg text-white font-medium">Evaluating your LinkedIn profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">LinkedIn Evaluation</h2>
        <p className="text-gray-400">Overall Score: <span className={`font-bold text-lg ${data.overall_score >= 80 ? "text-green-400" : data.overall_score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{data.overall_score}/100</span></p>
      </div>

      {/* Score Bars */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
        <ScoreBar label="Overall" score={data.overall_score} />
        <ScoreBar label="Headline" score={data.headline_score} />
        <ScoreBar label="About" score={data.about_section?.score || 0} />
        <ScoreBar label="Experience" score={data.experience_score} />
      </div>

      {/* Headline */}
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Current Headline</p>
        <p className="text-sm text-gray-400 italic mb-3">"{data.current_headline}"</p>
        <p className="text-xs font-bold uppercase text-green-400 mb-2">Suggested Headlines</p>
        {data.suggested_headlines.map((h, i) => (
          <p key={i} className="text-sm text-white bg-green-500/5 border border-green-500/20 rounded-lg p-2.5 mb-2">💡 {h}</p>
        ))}
      </div>

      {/* About Section Rewrite */}
      {data.about_section && (
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <p className="text-xs font-bold uppercase text-gray-500 mb-2">About Section</p>
          <p className="text-xs text-gray-400 mb-3">{data.about_section.feedback}</p>
          <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
            <p className="text-xs font-bold uppercase text-violet-400 mb-1.5">Suggested Rewrite</p>
            <p className="text-sm text-gray-200 leading-relaxed">{data.about_section.suggested_rewrite}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <p className="text-xs font-bold uppercase text-green-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Skills Present
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_analysis?.present?.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-300">{s}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <p className="text-xs font-bold uppercase text-red-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Missing Critical Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_analysis?.missing_critical?.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-300">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Strategy */}
      {data.content_strategy && (
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">Content Strategy</p>
          <p className="text-sm text-gray-400 mb-2">Post frequency: <span className="text-white">{data.content_strategy.post_frequency}</span></p>
          <p className="text-xs font-bold uppercase text-violet-400 mb-1.5">Topics to Post About</p>
          {data.content_strategy.should_post_about.map((t, i) => (
            <p key={i} className="text-sm text-gray-300 mb-1">• {t}</p>
          ))}
        </div>
      )}

      {/* Action Plan */}
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Action Plan
        </p>
        <div className="space-y-2">
          {data.action_plan.map((a, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${a.priority === "P0" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {a.priority}
                </span>
                <p className="text-sm text-gray-300">{a.action}</p>
              </div>
              <span className="text-xs text-gray-500">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => setData(null)}
          className="flex-1 py-3 rounded-xl font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition cursor-pointer">
          Evaluate Another
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
