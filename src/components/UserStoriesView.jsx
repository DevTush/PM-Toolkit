import { BookOpen, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import SectionHeader from "./SectionHeader";

function Badge({ children, color }) {
  const colors = {
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.violet}`}>
      {children}
    </span>
  );
}

export default function UserStoriesView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Stories</h2>
        <p className="text-gray-500">Agile-ready stories with acceptance criteria</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Total Points</p>
          <p className="text-2xl font-bold text-indigo-600">{data.total_points}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Est. Sprints</p>
          <p className="text-2xl font-bold text-blue-600">{data.estimated_sprints}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Velocity</p>
          <p className="text-sm font-bold text-emerald-600 mt-1">{data.velocity_assumption}</p>
        </div>
      </div>

      {/* Epics */}
      {data.epics.map((epic, ei) => (
        <div key={ei}>
          <SectionHeader icon={BookOpen} title={epic.epic_name} moduleKey={moduleKey} sectionKey="epics" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
          <p className="text-sm text-gray-500 mb-4">{epic.description}</p>

          <div className="space-y-3">
            {epic.stories.map((story, si) => (
              <div key={si} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{story.id}</span>
                      <Badge color={story.priority === "P0" ? "red" : story.priority === "P1" ? "yellow" : "blue"}>
                        {story.priority}
                      </Badge>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {story.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium mb-3">{story.story}</p>

                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">Acceptance Criteria</p>
                    {story.acceptance_criteria.map((ac, ai) => (
                      <p key={ai} className="text-xs text-gray-700 flex items-start gap-2 mb-1">
                        <span className="text-emerald-600 mt-0.5">✓</span> {ac}
                      </p>
                    ))}
                  </div>

                  {story.edge_cases && story.edge_cases.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase text-yellow-500 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Edge Cases
                      </p>
                      {story.edge_cases.map((ec, eci) => (
                        <p key={eci} className="text-xs text-gray-500 flex items-start gap-2 mb-1">
                          <span className="text-amber-600 mt-0.5">⚠</span> {ec}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
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
