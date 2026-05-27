import { useState } from "react";
import { Key, ExternalLink, Eye, EyeOff, CheckCircle2, Trash2 } from "lucide-react";

export default function ApiKeyInput({ apiKey, onSave, onClear }) {
  const [key, setKey] = useState(apiKey || "");
  const [show, setShow] = useState(false);
  const hasKey = !!apiKey;

  function handleSave(e) {
    e.preventDefault();
    if (key.trim()) onSave(key.trim());
  }

  if (hasKey) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-emerald-800">API key configured</p>
          <p className="text-[11px] text-emerald-600 font-mono truncate">{apiKey.slice(0, 8)}...{apiKey.slice(-4)}</p>
        </div>
        <button onClick={onClear}
          className="p-1.5 rounded-lg text-emerald-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
          title="Remove API key">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Key className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900">Enter your Gemini API Key</p>
          <p className="text-[11px] text-gray-400">Required to use the toolkit. Stored locally in your browser.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition font-mono"
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-indigo-500 hover:text-indigo-700 font-medium transition flex items-center gap-1">
            Get a free API key <ExternalLink className="w-3 h-3" />
          </a>
          <button type="submit" disabled={!key.trim()}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
            Save Key
          </button>
        </div>
      </form>

      <p className="text-[10px] text-gray-300 mt-3 leading-relaxed">
        Your key is stored only in your browser's localStorage. It is never sent to any server other than Google's Gemini API.
      </p>
    </div>
  );
}
