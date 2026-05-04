"use client";

import { useProposalStore } from "@/store/proposalStore";
import { ClientData } from "@/types/proposal";

const segments = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Varejo",
  "Industria",
  "Serviços",
  "Alimentação",
  "Agronegócio",
  "Construção Civil",
  "Outro",
];

export default function ClientSection() {
  const { formData, setFormData } = useProposalStore();
  const client = formData.client;

  const update = (field: keyof ClientData, value: string) => {
    setFormData({ client: { ...client, [field]: value } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Nome do Contato *</label>
          <input
            className="field-input"
            placeholder="Ex: João Silva"
            value={client.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Empresa / Organização *</label>
          <input
            className="field-input"
            placeholder="Ex: Tech Solutions Ltda."
            value={client.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">E-mail</label>
          <input
            type="email"
            className="field-input"
            placeholder="contato@empresa.com"
            value={client.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Telefone / WhatsApp</label>
          <input
            className="field-input"
            placeholder="(00) 00000-0000"
            value={client.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Cidade / Estado</label>
          <input
            className="field-input"
            placeholder="Ex: Fortaleza - CE"
            value={client.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Segmento de Atuação</label>
          <select
            className="field-input"
            value={client.segment}
            onChange={(e) => update("segment", e.target.value)}
          >
            <option value="">Selecione...</option>
            {segments.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
