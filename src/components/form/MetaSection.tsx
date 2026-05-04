"use client";

import { useProposalStore } from "@/store/proposalStore";

export default function MetaSection() {
  const { formData, updateField } = useProposalStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Número da Proposta</label>
          <input
            className="field-input"
            placeholder="Ex: ROCKET-2024-001"
            value={formData.proposalNumber}
            onChange={(e) => updateField("proposalNumber", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Data da Proposta</label>
          <input
            className="field-input"
            placeholder="DD/MM/AAAA"
            value={formData.proposalDate}
            onChange={(e) => updateField("proposalDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Validade (dias)</label>
          <input
            type="number"
            min="1"
            className="field-input"
            placeholder="7"
            value={formData.validityDays || ""}
            onChange={(e) =>
              updateField("validityDays", parseInt(e.target.value) || 7)
            }
          />
          <p className="text-xs text-rocket-gray-light mt-1">
            A proposta expira após {formData.validityDays} dias.
          </p>
        </div>
        <div>
          <label className="field-label">Responsável ROCKET</label>
          <input
            className="field-input"
            placeholder="Nome do consultor/diretor responsável"
            value={formData.rocketResponsible}
            onChange={(e) => updateField("rocketResponsible", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
