import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProposalBlock, VisualIdentity, TableBlock } from '@/types/blocks';

interface ProposalV3Store {
  blocks: ProposalBlock[];
  identity: VisualIdentity;
  
  // Ações
  addBlock: (block: ProposalBlock) => void;
  updateBlock: (id: string, updates: Partial<ProposalBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  updateIdentity: (identity: Partial<VisualIdentity>) => void;
  
  // Helpers Computados
  getTotalInvestment: () => number;
}

const defaultIdentity: VisualIdentity = {
  primaryColor: '#ff0000',
  secondaryColor: '#333333',
  fontFamily: 'Helvetica',
};

export const useProposalV3Store = create<ProposalV3Store>()(
  persist(
    (set, get) => ({
      blocks: [],
      identity: defaultIdentity,

      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),

      updateBlock: (id, updates) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)) as ProposalBlock[],
        })),

      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),

      reorderBlocks: (startIndex, endIndex) =>
        set((state) => {
          const newBlocks = Array.from(state.blocks);
          const [removed] = newBlocks.splice(startIndex, 1);
          newBlocks.splice(endIndex, 0, removed);
          return { blocks: newBlocks };
        }),

      updateIdentity: (newIdentity) =>
        set((state) => ({ identity: { ...state.identity, ...newIdentity } })),

      // Soma automática dos valores de todos os blocos de Tabela
      getTotalInvestment: () => {
        const { blocks } = get();
        return blocks
          .filter((b): b is TableBlock => b.type === 'table')
          .reduce((sum, table) => {
            const tableTotal = table.rows.reduce((tSum, row) => tSum + (Number(row.value) || 0), 0);
            return sum + tableTotal;
          }, 0);
      },
    }),
    {
      name: 'rocket-proposal-v3-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
