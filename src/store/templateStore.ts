import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProposalTemplate, VisualIdentity } from "@/types/blocks";
import { V4ProposalBlock } from "@/types/v4-blocks";

const genId = () => Math.random().toString(36).substring(2, 10);

export interface V5ProposalTemplate extends Omit<ProposalTemplate, 'defaultBlocks'> {
  defaultBlocks: V4ProposalBlock[];
}

const DEFAULT_TEMPLATES: V5ProposalTemplate[] = [
  {
    id: "template-rocket-2026",
    name: "Modelo ROCKET 2026",
    description: "Template padrão completo para propostas comerciais de alto impacto.",
    category: "Vendas",
    visualIdentity: {
      primaryColor: "#FF0000",
      secondaryColor: "#1A1A1A",
      fontFamily: "Inter",
    },
    defaultBlocks: [
      { id: genId(), type: 'cover', companyName: 'ROCKET', companySubtitle: 'EMPRESA JÚNIOR', title: 'PROPOSTA COMERCIAL', clientName: '[Nome do Cliente]', date: new Date().toLocaleDateString('pt-BR'), bgColor: '#1a1a1a', accentColor: '#ff0000', textColor: '#ffffff' },
      { id: genId(), type: 'text', content: 'Apresentamos nossa solução tecnológica para impulsionar seus resultados.' },
      { id: genId(), type: 'deliverables', items: [{ id: genId(), name: 'Desenvolvimento Web', desc: 'Landing page responsiva', value: 2000 }] },
      { id: genId(), type: 'investment', installments: 2, paymentConditions: '50% no ato, 50% na entrega' },
      { id: genId(), type: 'signatures', clientName: '[Nome do Cliente]', rocketResponsible: 'Diretor ROCKET' }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-contrato-rapido",
    name: "Modelo Contrato Rápido",
    description: "Template enxuto para fechamentos rápidos e escopos reduzidos.",
    category: "Vendas",
    visualIdentity: {
      primaryColor: "#2563EB",
      secondaryColor: "#1F2937",
      fontFamily: "Inter",
    },
    defaultBlocks: [
      { id: genId(), type: 'cover', companyName: 'ROCKET', companySubtitle: 'SERVIÇOS RÁPIDOS', title: 'TERMO DE ACORDO', clientName: '[Nome do Cliente]', date: new Date().toLocaleDateString('pt-BR'), bgColor: '#ffffff', accentColor: '#2563EB', textColor: '#1f2937' },
      { id: genId(), type: 'deliverables', items: [{ id: genId(), name: 'Serviço Express', desc: 'Entrega em 48h', value: 1500 }] },
      { id: genId(), type: 'signatures', clientName: '[Nome do Cliente]', rocketResponsible: 'Diretor ROCKET' }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-parceria-internacional",
    name: "Modelo Parceria Internacional",
    description: "Template focado em dados, inglês/português, com estilo sóbrio.",
    category: "Projetos",
    visualIdentity: {
      primaryColor: "#10B981",
      secondaryColor: "#064E3B",
      fontFamily: "Helvetica",
    },
    defaultBlocks: [
      { id: genId(), type: 'cover', companyName: 'ROCKET', companySubtitle: 'GLOBAL PARTNERSHIPS', title: 'INTERNATIONAL AGREEMENT', clientName: '[Client Name]', date: new Date().toLocaleDateString('en-US'), bgColor: '#064E3B', accentColor: '#10B981', textColor: '#ffffff' },
      { id: genId(), type: 'text', content: 'This document establishes the partnership terms...' },
    ],
    createdAt: new Date().toISOString(),
  }
];

interface TemplateStore {
  templates: V5ProposalTemplate[];
  activeTemplateId: string | null;
  addTemplate: (template: Omit<V5ProposalTemplate, 'id' | 'createdAt'>) => void;
  removeTemplate: (id: string) => void;
  setActiveTemplate: (id: string | null) => void;
  getActiveTemplate: () => V5ProposalTemplate | undefined;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: DEFAULT_TEMPLATES,
      activeTemplateId: null,

      addTemplate: (templateData) => {
        const newTemplate: V5ProposalTemplate = {
          ...templateData,
          id: `template-${genId()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
      },

      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          activeTemplateId: state.activeTemplateId === id ? null : state.activeTemplateId,
        }));
      },

      setActiveTemplate: (id) => set({ activeTemplateId: id }),

      getActiveTemplate: () => {
        const { templates, activeTemplateId } = get();
        return templates.find((t) => t.id === activeTemplateId);
      },
    }),
    {
      name: "rocket-templates-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
