"use client";

import { useProposalStore } from "@/store/proposalStore";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const paymentMethods = [
  "Transferência bancária (PIX/TED)",
  "Boleto bancário",
  "Cartão de crédito",
  "Cheque",
  "Outro",
];

export default function InvestmentSection() {
  const { formData, updateField, computed } = useProposalStore();

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-rocket-surface border border-rocket-border rounded-xl p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rocket-gray mb-1">
            Subtotal
          </p>
          <p className="text-base font-bold text-rocket-dark font-display">
            {formatBRL(computed.subtotal)}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-500 mb-1">
            Desconto
          </p>
          <p className="text-base font-bold text-orange-600 font-display">
            - {formatBRL(computed.discountValue)}
          </p>
        </div>
        <div className="bg-rocket-red/5 border border-rocket-red/20 rounded-xl p-4 text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rocket-red mb-1">
            Total
          </p>
          <p className="text-lg font-bold text-rocket-red font-display">
            {formatBRL(computed.total)}
          </p>
        </div>
        <div className="bg-rocket-dark rounded-xl p-4 text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rocket-gray-light mb-1">
            Por Parcela
          </p>
          <p className="text-base font-bold text-white font-display">
            {formatBRL(computed.installmentValue)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Desconto (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              className="field-input pr-8"
              placeholder="0"
              value={formData.discount || ""}
              onChange={(e) =>
                updateField("discount", parseFloat(e.target.value) || 0)
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rocket-gray text-sm font-medium">
              %
            </span>
          </div>
        </div>

        <div>
          <label className="field-label">Número de Parcelas</label>
          <select
            className="field-input"
            value={formData.installments}
            onChange={(e) =>
              updateField("installments", parseInt(e.target.value))
            }
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n}x {n === 1 ? "(à vista)" : `de ${formatBRL(computed.total / n)}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Forma de Pagamento</label>
          <select
            className="field-input"
            value={formData.paymentMethod}
            onChange={(e) => updateField("paymentMethod", e.target.value)}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">Observações sobre Pagamento</label>
        <textarea
          className="field-textarea"
          placeholder="Ex: 50% no início do projeto e 50% na entrega final..."
          value={formData.paymentObservations}
          onChange={(e) => updateField("paymentObservations", e.target.value)}
        />
      </div>

      {/* Installment breakdown */}
      {formData.installments > 1 && computed.total > 0 && (
        <div className="bg-rocket-surface border border-rocket-border rounded-xl p-4">
          <p className="text-xs font-semibold text-rocket-dark-3 uppercase tracking-wide mb-3">
            Cronograma de Parcelas Sugerido
          </p>
          <div className="space-y-2">
            {Array.from({ length: formData.installments }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-rocket-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-rocket-red/10 flex items-center justify-center">
                    <span className="text-rocket-red text-[10px] font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-sm text-rocket-dark">
                    {i === 0
                      ? "1ª Parcela (Entrada)"
                      : i === formData.installments - 1
                      ? `${i + 1}ª Parcela (Final)`
                      : `${i + 1}ª Parcela`}
                  </span>
                </div>
                <span className="text-sm font-semibold text-rocket-dark">
                  {formatBRL(computed.installmentValue)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-rocket-border mt-2">
            <span className="text-sm font-bold text-rocket-dark">Total</span>
            <span className="text-sm font-bold text-rocket-red">
              {formatBRL(computed.total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
