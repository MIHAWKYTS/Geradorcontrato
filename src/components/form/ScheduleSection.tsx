"use client";

import { useProposalStore } from "@/store/proposalStore";
import { SchedulePhase } from "@/types/proposal";

const genId = () => Math.random().toString(36).substring(2, 10);

export default function ScheduleSection() {
  const { formData, updateField } = useProposalStore();
  const phases = formData.schedulePhases;

  const add = () => {
    updateField("schedulePhases", [
      ...phases,
      { id: genId(), phase: "", duration: "", startDate: "" },
    ]);
  };

  const remove = (id: string) => {
    if (phases.length === 1) return;
    updateField("schedulePhases", phases.filter((p) => p.id !== id));
  };

  const update = (id: string, field: keyof SchedulePhase, value: string) => {
    updateField(
      "schedulePhases",
      phases.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-rocket-gray">
          Defina as fases do projeto com seus respectivos prazos e datas.
        </p>
        <span className="badge-red">{phases.length} fases</span>
      </div>

      {/* Timeline visual */}
      <div className="relative">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex gap-3 mb-4 animate-fade-in">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rocket-red flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              {index < phases.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-rocket-red/40 to-transparent mt-1 min-h-[20px]" />
              )}
            </div>

            {/* Phase card */}
            <div className="flex-1 bg-rocket-surface border border-rocket-border rounded-xl p-4 mb-2">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-rocket-dark-3 uppercase tracking-wide">
                  Fase {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(phase.id)}
                  disabled={phases.length === 1}
                  className="btn-danger disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="field-label">Nome da Fase</label>
                  <input
                    className="field-input"
                    placeholder="Ex: Levantamento de Requisitos"
                    value={phase.phase}
                    onChange={(e) => update(phase.id, "phase", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Duração</label>
                  <input
                    className="field-input"
                    placeholder="Ex: 2 semanas"
                    value={phase.duration}
                    onChange={(e) => update(phase.id, "duration", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Data de Início</label>
                  <input
                    type="date"
                    className="field-input"
                    value={phase.startDate}
                    onChange={(e) => update(phase.id, "startDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={add} className="btn-ghost w-full justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Fase
      </button>
    </div>
  );
}
