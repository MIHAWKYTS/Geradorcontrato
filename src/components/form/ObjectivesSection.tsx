"use client";

import { useProposalStore } from "@/store/proposalStore";
import { Objective } from "@/types/proposal";

const genId = () => Math.random().toString(36).substring(2, 10);

export default function ObjectivesSection() {
  const { formData, updateField } = useProposalStore();
  const objectives = formData.objectives;

  const add = () => {
    updateField("objectives", [...objectives, { id: genId(), text: "" }]);
  };

  const remove = (id: string) => {
    if (objectives.length === 1) return;
    updateField("objectives", objectives.filter((o) => o.id !== id));
  };

  const update = (id: string, text: string) => {
    updateField(
      "objectives",
      objectives.map((o) => (o.id === id ? { ...o, text } : o))
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-rocket-gray">
          Liste os resultados concretos que o cliente obterá ao final do
          projeto.
        </p>
        <span className="badge-red">{objectives.length} objetivos</span>
      </div>

      {objectives.map((obj, index) => (
        <div key={obj.id} className="flex items-center gap-2 animate-fade-in">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rocket-red flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">{index + 1}</span>
          </div>
          <input
            className="field-input flex-1"
            placeholder={`Objetivo ${index + 1}...`}
            value={obj.text}
            onChange={(e) => update(obj.id, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(obj.id)}
            disabled={objectives.length === 1}
            className="p-2 rounded-lg text-rocket-gray hover:text-red-500 hover:bg-red-50
                       transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Remover objetivo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full justify-center mt-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Objetivo
      </button>
    </div>
  );
}
