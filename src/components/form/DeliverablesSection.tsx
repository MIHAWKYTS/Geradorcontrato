"use client";

import { useProposalStore } from "@/store/proposalStore";
import { Deliverable } from "@/types/proposal";

const genId = () => Math.random().toString(36).substring(2, 10);

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function DeliverablesSection() {
  const { formData, updateField, computed } = useProposalStore();
  const deliverables = formData.deliverables;

  const add = () => {
    updateField("deliverables", [
      ...deliverables,
      { id: genId(), title: "", description: "", value: 0 },
    ]);
  };

  const remove = (id: string) => {
    if (deliverables.length === 1) return;
    updateField("deliverables", deliverables.filter((d) => d.id !== id));
  };

  const update = (id: string, field: keyof Deliverable, value: string | number) => {
    updateField(
      "deliverables",
      deliverables.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-rocket-gray">
          Cada entregável representa um produto/serviço com seu valor individual.
        </p>
        <span className="badge-red">{deliverables.length} itens</span>
      </div>

      {deliverables.map((item, index) => (
        <div key={item.id} className="array-item">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rocket-red flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{index + 1}</span>
              </div>
              <span className="text-xs font-semibold text-rocket-dark-3 uppercase tracking-wide">
                Entregável {index + 1}
              </span>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              disabled={deliverables.length === 1}
              className="btn-danger disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remover
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="field-label">Título</label>
              <input
                className="field-input"
                placeholder="Ex: Desenvolvimento do Sistema Web"
                value={item.title}
                onChange={(e) => update(item.id, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Valor (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-rocket-gray font-medium">
                  R$
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="field-input pl-9"
                  placeholder="0,00"
                  value={item.value || ""}
                  onChange={(e) => update(item.id, "value", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="field-label">Descrição</label>
            <textarea
              className="field-textarea"
              style={{ minHeight: "70px" }}
              placeholder="Descreva o que será entregue, o escopo e as especificações..."
              value={item.description}
              onChange={(e) => update(item.id, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn-ghost w-full justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Entregável
      </button>

      {/* Subtotal preview */}
      <div className="flex justify-end">
        <div className="bg-rocket-dark rounded-xl px-5 py-3 min-w-[220px]">
          <p className="text-xs text-rocket-gray-light mb-1">Subtotal dos Entregáveis</p>
          <p className="text-xl font-bold text-white font-display">
            {formatBRL(computed.subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
