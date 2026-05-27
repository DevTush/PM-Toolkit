import { User, Brain, Heart, MessageCircle, Activity, ArrowRight, Loader2 } from "lucide-react";

function EmpathyQuadrant({ icon: Icon, title, items, color }) {
  return (
    <div className={`p-3 rounded-lg border ${color}`}>
      <p className="text-xs font-bold uppercase mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-300">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PersonasView({ data, onNext, isLoading, nextLabel }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">User Personas</h2>
        <p className="text-gray-400">Empathy-driven user research for your product</p>
      </div>

      <div className="space-y-8">
        {data.personas.map((p, i) => (
          <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            {/* Persona Header */}
            <div className="p-5 border-b border-gray-800 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {p.tech_savviness} Tech
                  </span>
                </div>
                <p className="text-sm text-gray-400">{p.role} · {p.age} · {p.location}</p>
                <p className="text-sm text-gray-300 mt-2">{p.bio}</p>
              </div>
            </div>

            {/* Goals & Frustrations */}
            <div className="grid sm:grid-cols-2 gap-4 p-5 border-b border-gray-800">
              <div>
                <p className="text-xs font-bold uppercase text-green-400 mb-2">Goals</p>
                {p.goals.map((g, j) => (
                  <p key={j} className="text-sm text-gray-300 flex items-start gap-2 mb-1">
                    <span className="text-green-400 mt-0.5">✓</span> {g}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-red-400 mb-2">Frustrations</p>
                {p.frustrations.map((f, j) => (
                  <p key={j} className="text-sm text-gray-300 flex items-start gap-2 mb-1">
                    <span className="text-red-400 mt-0.5">✗</span> {f}
                  </p>
                ))}
              </div>
            </div>

            {/* Empathy Map */}
            <div className="p-5 border-b border-gray-800">
              <p className="text-xs font-bold uppercase text-gray-500 mb-3">Empathy Map</p>
              <div className="grid grid-cols-2 gap-3">
                <EmpathyQuadrant
                  icon={Brain} title="Thinks" items={p.empathy_map.thinks}
                  color="border-blue-500/20 bg-blue-500/5"
                />
                <EmpathyQuadrant
                  icon={Heart} title="Feels" items={p.empathy_map.feels}
                  color="border-pink-500/20 bg-pink-500/5"
                />
                <EmpathyQuadrant
                  icon={MessageCircle} title="Says" items={p.empathy_map.says}
                  color="border-yellow-500/20 bg-yellow-500/5"
                />
                <EmpathyQuadrant
                  icon={Activity} title="Does" items={p.empathy_map.does}
                  color="border-green-500/20 bg-green-500/5"
                />
              </div>
            </div>

            {/* Scenario */}
            <div className="p-5">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">Day-in-the-Life Scenario</p>
              <p className="text-sm text-gray-300 italic">"{p.scenario}"</p>
            </div>
          </div>
        ))}
      </div>

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
