"use client";

import { useProposalStore } from "@/store/proposalStore";

export default function ProblemSection() {
  const { formData, updateField } = useProposalStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Problema Identificado *</label>
        <p className="text-xs text-rocket-gray mb-2">
          Descreva o cenário atual do cliente, dores, desafios e oportunidades
          mapeadas.
        </p>
        <textarea
          className="field-textarea"
          style={{ minHeight: "120px" }}
          placeholder="Ex: A empresa X enfrenta dificuldades em gerenciar seus processos de vendas de forma eficiente. A ausência de uma ferramenta centralizada gera retrabalho, perda de dados e lentidão nas tomadas de decisão..."
          value={formData.problem}
          onChange={(e) => updateField("problem", e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-rocket-gray-light">
            {formData.problem.length} caracteres
          </span>
        </div>
      </div>

      <div className="bg-rocket-red/5 border border-rocket-red/15 rounded-lg p-3">
        <p className="text-xs text-rocket-gray-light">
          <span className="font-semibold text-rocket-red">💡 Dica: </span>
          Use a técnica{" "}
          <strong className="text-rocket-dark">situação → complicação → questão</strong>{" "}
          para estruturar o problema de forma convincente.
        </p>
      </div>
    </div>
  );
}
