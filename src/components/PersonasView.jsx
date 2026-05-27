import { User, Brain, Heart, MessageCircle, Activity, ArrowRight, Loader2, Users } from "lucide-react";
import SectionHeader from "./SectionHeader";

function EmpathyQuadrant({ icon: Icon, title, items, color }) {
  return (
    <div className={`p-3 rounded-lg border ${color}`}>
      <p className="text-xs font-bold uppercase mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-700">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PersonasView({ data, onNext, isLoading, nextLabel, moduleKey, prd, onSectionUpdate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Personas</h2>
        <p className="text-gray-500">Empathy-driven user research for your product</p>
      </div>

      <SectionHeader icon={Users} title="Personas" moduleKey={moduleKey} sectionKey="personas" currentData={data} prd={prd} onUpdate={onSectionUpdate} />
      <div className="space-y-8">
        {data.personas.map((p, i) => (
          <div key={i} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Persona Header */}
            <div className="p-5 border-b border-gray-100 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {p.tech_savviness} Tech
                  </span>
                </div>
                <p className="text-sm text-gray-500">{p.role} · {p.age} · {p.location}</p>
                <p className="text-sm text-gray-600 mt-2">{p.bio}</p>
              </div>
            </div>

            {/* Goals & Frustrations */}
            <div className="grid sm:grid-cols-2 gap-4 p-5 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-600 mb-2">Goals</p>
                {p.goals.map((g, j) => (
                  <p key={j} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                    <span className="text-emerald-600 mt-0.5">✓</span> {g}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-red-600 mb-2">Frustrations</p>
                {p.frustrations.map((f, j) => (
                  <p key={j} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                    <span className="text-red-600 mt-0.5">✗</span> {f}
                  </p>
                ))}
              </div>
            </div>

            {/* Empathy Map */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-xs font-bold uppercase text-gray-500 mb-3">Empathy Map</p>
              <div className="grid grid-cols-2 gap-3">
                <EmpathyQuadrant
                  icon={Brain} title="Thinks" items={p.empathy_map.thinks}
                  color="border-blue-200 bg-blue-50"
                />
                <EmpathyQuadrant
                  icon={Heart} title="Feels" items={p.empathy_map.feels}
                  color="border-pink-200 bg-pink-50"
                />
                <EmpathyQuadrant
                  icon={MessageCircle} title="Says" items={p.empathy_map.says}
                  color="border-amber-200 bg-amber-50"
                />
                <EmpathyQuadrant
                  icon={Activity} title="Does" items={p.empathy_map.does}
                  color="border-emerald-200 bg-emerald-50"
                />
              </div>
            </div>

            {/* Scenario */}
            <div className="p-5">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">Day-in-the-Life Scenario</p>
              <p className="text-sm text-gray-600 italic">"{p.scenario}"</p>
            </div>
          </div>
        ))}
      </div>

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
