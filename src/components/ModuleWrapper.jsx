import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";

export default function ModuleWrapper({ children, onBack, onRegenerate, isRegenerating }) {
  return (
    <div className="animate-fade-up">
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
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
      {children}
    </div>
  );
}
