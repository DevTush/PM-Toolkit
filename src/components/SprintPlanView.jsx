import { CalendarDays, ArrowRight, Loader2, CheckSquare, Link } from "lucide-react";

const PHASE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function SprintPlanView({ data, onNext, isLoading, nextLabel }) {
  const maxWeek = data.total_duration_weeks || data.sprints.reduce((acc, s) => acc + (s.duration_weeks || 2), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Sprint Plan</h2>
        <p className="text-gray-400">
          {data.sprints.length} sprints · {maxWeek} weeks total
        </p>
      </div>

      {/* Gantt-like Timeline */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 overflow-x-auto">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Timeline
        </h3>
        <div className="min-w-[600px]">
          {/* Week labels */}
          <div className="flex mb-2 ml-36">
            {Array.from({ length: Math.ceil(maxWeek / 2) }, (_, i) => (
              <div key={i} className="flex-1 text-xs text-gray-500 text-center">
                W{i * 2 + 1}-{i * 2 + 2}
              </div>
            ))}
          </div>

          {/* Sprint bars */}
          {data.sprints.map((sprint, i) => {
            const startWeek = data.sprints.slice(0, i).reduce((acc, s) => acc + (s.duration_weeks || 2), 0);
            const widthPct = ((sprint.duration_weeks || 2) / maxWeek) * 100;
            const leftPct = (startWeek / maxWeek) * 100;
            const phase = data.phases?.find(p => p.sprints?.includes(sprint.sprint_number));
            const phaseIdx = data.phases?.indexOf(phase) ?? 0;
            const color = phase?.color || PHASE_COLORS[phaseIdx % PHASE_COLORS.length];

            return (
              <div key={i} className="flex items-center mb-2">
                <div className="w-36 flex-shrink-0 text-xs text-gray-400 truncate pr-2">
                  S{sprint.sprint_number}: {sprint.name}
                </div>
                <div className="flex-1 h-8 bg-gray-800 rounded relative">
                  <div
                    className="absolute h-full rounded flex items-center px-2"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: color + "40", borderLeft: `3px solid ${color}` }}
                  >
                    <span className="text-[10px] text-white truncate">{sprint.milestone}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Phase legend */}
          {data.phases && (
            <div className="flex gap-4 mt-4 ml-36">
              {data.phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: phase.color || PHASE_COLORS[i % PHASE_COLORS.length] }} />
                  <span className="text-xs text-gray-400">{phase.phase}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sprint Details */}
      <div className="space-y-3">
        {data.sprints.map((sprint, i) => (
          <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                    Sprint {sprint.sprint_number}
                  </span>
                  <h4 className="text-sm font-bold text-white">{sprint.name}</h4>
                </div>
                <p className="text-xs text-gray-400">{sprint.goal}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{sprint.duration_weeks}w</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">Deliverables</p>
                {sprint.deliverables.map((d, di) => (
                  <p key={di} className="text-xs text-gray-300 flex items-start gap-2 mb-1">
                    <span className="text-green-400 mt-0.5">▸</span> {d}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">Stories</p>
                <div className="flex flex-wrap gap-1">
                  {sprint.stories.map((s, si) => (
                    <span key={si} className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-300">{s}</span>
                  ))}
                </div>
                {sprint.risks && (
                  <p className="text-xs text-yellow-400 mt-2">⚠ {sprint.risks}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dependencies */}
      {data.dependencies && data.dependencies.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <Link className="w-4 h-4" /> Dependencies
          </h3>
          <div className="space-y-2">
            {data.dependencies.map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300 flex items-center gap-2">
                <span className="text-violet-400 font-medium">{d.from}</span>
                <ArrowRight className="w-3 h-3 text-gray-500" />
                <span className="text-blue-400 font-medium">{d.to}</span>
                <span className="text-gray-500">— {d.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Launch Checklist */}
      {data.launch_checklist && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Launch Checklist
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {data.launch_checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                <div className="w-5 h-5 rounded border border-gray-600 flex-shrink-0" />
                <span className="text-xs text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <>{nextLabel} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
