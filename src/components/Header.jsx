import { LayoutGrid } from "lucide-react";

const TOTAL_MODULES = 14;

export default function Header({ currentStep, onReset }) {
  const pct = Math.min((currentStep / TOTAL_MODULES) * 100, 100);

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <button onClick={onReset} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-gray-900 tracking-tight leading-none">PMToolkit</span>
              <span className="text-[10px] text-gray-400 leading-none mt-0.5 hidden sm:block">Product workspace</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {currentStep > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] font-medium text-gray-400 tabular-nums">{currentStep}/{TOTAL_MODULES}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
