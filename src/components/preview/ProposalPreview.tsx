"use client";

import { useProposalStore } from "@/store/proposalStore";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Block = ({ label, value }: { label: string; value?: string }) => {
  if (!value?.trim()) return null;
  return (
    <div className="preview-section">
      <p className="preview-label">{label}</p>
      <p className="preview-value whitespace-pre-wrap">{value}</p>
    </div>
  );
};

const Divider = () => (
  <div className="my-4 border-t border-dashed border-rocket-border" />
);

export default function ProposalPreview() {
  const { formData, computed } = useProposalStore();
  const { client } = formData;

  const hasAnyData =
    client.company || client.name || formData.problem || formData.solution;

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rocket-red/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-rocket-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-rocket-dark mb-1">
          Preview da Proposta
        </p>
        <p className="text-xs text-rocket-gray max-w-[200px]">
          Preencha os dados no formulário e a proposta aparecerá aqui em tempo
          real.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 text-sm font-sans animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm bg-rocket-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rocket-dark">
              ROCKET
            </span>
          </div>
          <p className="text-[10px] text-rocket-gray">Empresa Júnior</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-rocket-dark">
            {formData.proposalNumber}
          </p>
          <p className="text-[10px] text-rocket-gray">{formData.proposalDate}</p>
          {formData.validityDays > 0 && (
            <p className="text-[10px] text-rocket-gray">
              Válida por {formData.validityDays} dias
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-5 pb-4 border-b-2 border-rocket-red">
        <h1 className="text-lg font-black text-rocket-dark font-display leading-tight">
          Proposta Comercial
          {client.company && (
            <span className="text-rocket-red"> — {client.company}</span>
          )}
        </h1>
      </div>

      {/* Client */}
      {(client.name || client.company) && (
        <>
          <div>
            <p className="preview-label">Destinatário</p>
            {client.name && (
              <p className="text-sm font-semibold text-rocket-dark">{client.name}</p>
            )}
            {client.company && (
              <p className="text-xs text-rocket-gray">{client.company}</p>
            )}
            {client.city && (
              <p className="text-xs text-rocket-gray">{client.city}</p>
            )}
            {client.email && (
              <p className="text-xs text-rocket-gray">{client.email}</p>
            )}
          </div>
          <Divider />
        </>
      )}

      {/* Problem */}
      <Block label="Problema Identificado" value={formData.problem} />
      {formData.problem && <Divider />}

      {/* Solution */}
      <Block label="Solução Proposta" value={formData.solution} />
      {formData.solution && <Divider />}

      {/* Objectives */}
      {formData.objectives.some((o) => o.text.trim()) && (
        <>
          <div className="preview-section">
            <p className="preview-label">Objetivos</p>
            <ul className="space-y-1 mt-1">
              {formData.objectives
                .filter((o) => o.text.trim())
                .map((o, i) => (
                  <li key={o.id} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-rocket-red/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rocket-red text-[8px] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-xs text-rocket-dark">{o.text}</span>
                  </li>
                ))}
            </ul>
          </div>
          <Divider />
        </>
      )}

      {/* Deliverables */}
      {formData.deliverables.some((d) => d.title.trim()) && (
        <>
          <div className="preview-section">
            <p className="preview-label">Escopo de Entregáveis</p>
            <div className="mt-2 space-y-2">
              {formData.deliverables
                .filter((d) => d.title.trim())
                .map((d, i) => (
                  <div
                    key={d.id}
                    className="flex items-start justify-between gap-3 py-2 border-b border-rocket-border last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-rocket-dark">
                        {i + 1}. {d.title}
                      </p>
                      {d.description && (
                        <p className="text-[10px] text-rocket-gray mt-0.5 leading-relaxed">
                          {d.description}
                        </p>
                      )}
                    </div>
                    {d.value > 0 && (
                      <span className="text-xs font-bold text-rocket-dark flex-shrink-0">
                        {formatBRL(d.value)}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* Schedule */}
      {formData.schedulePhases.some((p) => p.phase.trim()) && (
        <>
          <div className="preview-section">
            <p className="preview-label">Cronograma</p>
            <div className="mt-2 space-y-1">
              {formData.schedulePhases
                .filter((p) => p.phase.trim())
                .map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-[10px]">
                    <div className="w-4 h-4 rounded-full bg-rocket-red flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold" style={{ fontSize: 7 }}>{i + 1}</span>
                    </div>
                    <span className="font-semibold text-rocket-dark">{p.phase}</span>
                    {p.duration && (
                      <span className="text-rocket-gray">· {p.duration}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* Investment */}
      {computed.subtotal > 0 && (
        <div className="preview-section">
          <p className="preview-label">Investimento</p>
          <div className="bg-rocket-dark rounded-xl p-4 mt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-rocket-gray-light">Subtotal</span>
                <span className="text-white">{formatBRL(computed.subtotal)}</span>
              </div>
              {computed.discountValue > 0 && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-orange-400">Desconto ({formData.discount}%)</span>
                  <span className="text-orange-400">- {formatBRL(computed.discountValue)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-1.5 flex justify-between">
                <span className="text-xs font-bold text-white">Total</span>
                <span className="text-sm font-black text-rocket-red font-display">
                  {formatBRL(computed.total)}
                </span>
              </div>
              {formData.installments > 1 && (
                <p className="text-[10px] text-rocket-gray-light text-right">
                  {formData.installments}x de {formatBRL(computed.installmentValue)}
                </p>
              )}
            </div>
            {formData.paymentMethod && (
              <p className="text-[10px] text-rocket-gray-light mt-2 pt-2 border-t border-white/10">
                💳 {formData.paymentMethod}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {formData.rocketResponsible && (
        <>
          <Divider />
          <div className="flex items-center justify-between text-[10px] text-rocket-gray">
            <span>Responsável: <strong className="text-rocket-dark">{formData.rocketResponsible}</strong></span>
            <span className="text-rocket-red font-bold">ROCKET EJ</span>
          </div>
        </>
      )}
    </div>
  );
}
