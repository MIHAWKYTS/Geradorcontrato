"use client";

import { useProposalStore } from "@/store/proposalStore";

export default function SolutionSection() {
  const { formData, updateField } = useProposalStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Solução Proposta *</label>
        <p className="text-xs text-rocket-gray mb-2">
          Explique como a ROCKET vai resolver o problema. Destaque sua abordagem
          e metodologia.
        </p>
        <textarea
          className="field-textarea"
          style={{ minHeight: "140px" }}
          placeholder="Ex: A ROCKET propõe o desenvolvimento de um sistema web personalizado que centralizará toda a gestão de vendas da empresa. Nossa abordagem ágil garante entregas rápidas e com qualidade..."
          value={formData.solution}
          onChange={(e) => updateField("solution", e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-rocket-gray-light">
            {formData.solution.length} caracteres
          </span>
        </div>
      </div>

      <div className="bg-rocket-red/5 border border-rocket-red/15 rounded-lg p-3">
        <p className="text-xs text-rocket-gray-light">
          <span className="font-semibold text-rocket-red">🚀 Lembre-se: </span>
          Conecte a solução diretamente ao problema descrito na seção anterior.
          O cliente precisa ver a{" "}
          <strong className="text-rocket-dark">causa e efeito</strong>{" "}
          claramente.
        </p>
      </div>
    </div>
  );
}
