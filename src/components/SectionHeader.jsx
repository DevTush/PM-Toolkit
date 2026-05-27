import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { regenerateSection, cancelCurrentRequest } from "../lib/gemini";

export default function SectionHeader({ icon: Icon, title, moduleKey, sectionKey, currentData, prd, onUpdate, children }) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh(e) {
    e.stopPropagation();
    if (!moduleKey || !sectionKey || !currentData || refreshing) return;
    setRefreshing(true);
    try {
      const newSectionData = await regenerateSection(moduleKey, sectionKey, currentData, prd);
      if (onUpdate) onUpdate(sectionKey, newSectionData);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Section refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  }

  const canRefresh = moduleKey && sectionKey && currentData && onUpdate;

  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />} {title}
      </h3>
      {canRefresh && (
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title={`Regenerate ${title}`}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition cursor-pointer disabled:opacity-40"
        >
          {refreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Refresh
        </button>
      )}
      {children}
    </div>
  );
}
