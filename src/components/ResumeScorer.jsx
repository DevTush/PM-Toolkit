import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Target, AlertTriangle, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { extractTextFromPDF } from "../lib/pdfParser";
import { scoreResume } from "../lib/gemini";

function ScoreRing({ score, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

export default function ResumeScorer({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError(null);
    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 50) throw new Error("Could not extract enough text from the PDF. Try a different file.");
      const result = await scoreResume(text);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!data && !loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-2">PM Resume Scorer</h2>
        <p className="text-gray-400 mb-8">Upload your resume PDF and get a FAANG-level PM evaluation</p>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-700 hover:border-violet-500/50 rounded-2xl p-12 cursor-pointer transition-all hover:bg-violet-500/5 group"
        >
          <Upload className="w-12 h-12 text-gray-600 group-hover:text-violet-400 mx-auto mb-4 transition" />
          <p className="text-lg text-gray-300 font-medium mb-1">Drop your resume PDF here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
        </div>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <button onClick={onBack} className="mt-6 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto mb-4" />
        <p className="text-lg text-white font-medium">Analyzing your resume...</p>
        <p className="text-sm text-gray-400 mt-1">Our AI hiring manager is reviewing {fileName}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Resume Score</h2>
        <p className="text-gray-400">{fileName}</p>
      </div>

      {/* Overall Score + Grade */}
      <div className="flex items-center justify-center gap-8 p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <ScoreRing score={data.overall_score} size={100} strokeWidth={8} />
        <div>
          <p className="text-4xl font-bold text-white">{data.grade}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md">{data.summary}</p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid sm:grid-cols-2 gap-3">
        {data.categories.map((cat, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white font-medium">{cat.name}</p>
              <span className={`text-sm font-bold ${cat.score >= 80 ? "text-green-400" : cat.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                {cat.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full mb-2">
              <div className={`h-full rounded-full ${cat.score >= 80 ? "bg-green-500" : cat.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${cat.score}%` }} />
            </div>
            <p className="text-xs text-gray-400 mb-2">{cat.feedback}</p>
            {cat.suggestions.map((s, si) => (
              <p key={si} className="text-xs text-violet-300 flex items-start gap-1.5 mb-0.5">
                <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" /> {s}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <p className="text-xs font-bold uppercase text-green-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
          </p>
          {data.strengths.map((s, i) => (
            <p key={i} className="text-sm text-gray-300 mb-1">• {s}</p>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <p className="text-xs font-bold uppercase text-red-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Critical Gaps
          </p>
          {data.critical_gaps.map((g, i) => (
            <p key={i} className="text-sm text-gray-300 mb-1">• {g}</p>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Missing Keywords (for ATS)</p>
        <div className="flex flex-wrap gap-2">
          {data.keywords_missing.map((k, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">{k}</span>
          ))}
        </div>
      </div>

      {/* Bullet Rewrites */}
      {data.rewrite_bullets?.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">Bullet Rewrites</p>
          <div className="space-y-3">
            {data.rewrite_bullets.map((b, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-xs text-red-400 line-through mb-2">{b.original}</p>
                <p className="text-xs text-green-300 flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" /> {b.improved}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Companies */}
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> Target Companies
        </p>
        {data.target_companies.map((c, i) => (
          <p key={i} className="text-sm text-gray-300 mb-1">• {c}</p>
        ))}
      </div>

      {/* Action Plan */}
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 mb-3">Action Plan</p>
        <div className="space-y-2">
          {data.action_plan.map((a, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${a.priority === "P0" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {a.priority}
                </span>
                <p className="text-sm text-gray-300">{a.action}</p>
              </div>
              <span className="text-xs text-gray-500">{a.effort}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Re-upload + Back */}
      <div className="flex gap-3 pt-4">
        <button onClick={() => { setData(null); setFileName(null); }}
          className="flex-1 py-3 rounded-xl font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition cursor-pointer">
          Upload Another Resume
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
