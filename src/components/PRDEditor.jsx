import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from "lucide-react";

const SECTION_CONFIG = [
  { key: "title", label: "Product Name", type: "text" },
  { key: "elevator_pitch", label: "Elevator Pitch", type: "text" },
  { key: "problem_statement", label: "Problem Statement", type: "textarea" },
  { key: "target_audience", label: "Target Audience", type: "list" },
  { key: "goals", label: "Goals", type: "objectList", fields: ["goal", "metric", "target"] },
  { key: "features", label: "Features", type: "objectList", fields: ["name", "description", "priority", "effort"] },
  { key: "success_metrics", label: "Success Metrics", type: "objectList", fields: ["metric", "target", "timeframe"] },
  { key: "risks", label: "Risks", type: "objectList", fields: ["risk", "impact", "mitigation"] },
  { key: "technical_considerations", label: "Technical Considerations", type: "list" },
  { key: "competitive_landscape", label: "Competitive Landscape", type: "objectList", fields: ["competitor", "strength", "our_edge"] },
];

export default function PRDEditor({ prd, onSave, onBack }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(prd)));
  const [saved, setSaved] = useState(false);

  function updateField(key, value) {
    setDraft(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function updateListItem(key, index, value) {
    const list = [...(draft[key] || [])];
    list[index] = value;
    updateField(key, list);
  }

  function addListItem(key) {
    updateField(key, [...(draft[key] || []), ""]);
  }

  function removeListItem(key, index) {
    updateField(key, (draft[key] || []).filter((_, i) => i !== index));
  }

  function updateObjectListItem(key, index, field, value) {
    const list = [...(draft[key] || [])];
    list[index] = { ...list[index], [field]: value };
    updateField(key, list);
  }

  function addObjectListItem(key, fields) {
    const newItem = {};
    fields.forEach(f => newItem[f] = "");
    updateField(key, [...(draft[key] || []), newItem]);
  }

  function removeObjectListItem(key, index) {
    updateField(key, (draft[key] || []).filter((_, i) => i !== index));
  }

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition cursor-pointer ${
            saved
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          }`}>
          {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save PRD</>}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-gray-900 tracking-tight mb-1">Edit PRD</h2>
        <p className="text-[14px] text-gray-500">Update fields below. Downstream modules will use the latest saved version.</p>
      </div>

      <div className="space-y-6">
        {SECTION_CONFIG.map(({ key, label, type, fields }) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-[13px] font-semibold text-gray-700 mb-3">{label}</h3>

            {type === "text" && (
              <input
                value={draft[key] || ""}
                onChange={(e) => updateField(key, e.target.value)}
                className={inputCls}
              />
            )}

            {type === "textarea" && (
              <textarea
                value={draft[key] || ""}
                onChange={(e) => updateField(key, e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            )}

            {type === "list" && (
              <div className="space-y-2">
                {(draft[key] || []).map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(e) => updateListItem(key, i, e.target.value)}
                      className={`${inputCls} flex-1`}
                    />
                    <button onClick={() => removeListItem(key, i)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addListItem(key)}
                  className="flex items-center gap-1.5 text-[12px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer mt-1">
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
            )}

            {type === "objectList" && (
              <div className="space-y-3">
                {(draft[key] || []).map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
                      {fields.map((field) => (
                        <input
                          key={field}
                          value={item[field] || ""}
                          onChange={(e) => updateObjectListItem(key, i, field, e.target.value)}
                          placeholder={field}
                          className={inputCls}
                        />
                      ))}
                    </div>
                    <button onClick={() => removeObjectListItem(key, i)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addObjectListItem(key, fields)}
                  className="flex items-center gap-1.5 text-[12px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer mt-1">
                  <Plus className="w-3 h-3" /> Add {label.toLowerCase().replace(/s$/, "")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 mb-4 flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer ${
            saved
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          }`}>
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save PRD</>}
        </button>
      </div>
    </div>
  );
}
