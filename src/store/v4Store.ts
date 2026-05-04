import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { V4ProposalBlock, DeliverablesBlock } from '@/types/v4-blocks';
import { VisualIdentity } from '@/types/blocks';

interface V4Store {
  blocks: V4ProposalBlock[];
  isEditing: boolean;
  visualIdentity: VisualIdentity | null;
  startProposal: () => void;
  loadTemplate: (blocks: V4ProposalBlock[], identity?: VisualIdentity) => void;
  addBlock: (block: V4ProposalBlock) => void;
  updateBlock: (id: string, updates: Partial<V4ProposalBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  getTotal: () => number;
}

export const useV4Store = create<V4Store>()(
  persist(
    (set, get) => ({
      blocks: [],
      isEditing: false,
      visualIdentity: null,

      startProposal: () => set({ 
        isEditing: true, 
        blocks: [
          { 
            id: crypto.randomUUID(), 
            type: 'cover', 
            companyName: 'ROCKET', 
            companySubtitle: 'EMPRESA JÚNIOR', 
            title: 'PROPOSTA COMERCIAL', 
            clientName: 'Nome do Cliente', 
            date: new Date().toLocaleDateString('pt-BR'),
            bgColor: '#1a1a1a',
            accentColor: '#ff0000',
            textColor: '#ffffff'
          }
        ] 
      }),

      loadTemplate: (blocks, identity) => set({
        isEditing: true,
        blocks: blocks,
        visualIdentity: identity || null
      }),

      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),

      updateBlock: (id, updates) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { ...b, ...updates } : b) as V4ProposalBlock[]
      })),

      removeBlock: (id) => set((state) => ({ blocks: state.blocks.filter(b => b.id !== id) })),

      reorderBlocks: (oldIndex, newIndex) => set((state) => {
        const arr = [...state.blocks];
        const [removed] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, removed);
        return { blocks: arr };
      }),

      getTotal: () => get().blocks
        .filter((b): b is DeliverablesBlock => b.type === 'deliverables')
        .reduce((sum, block) => sum + block.items.reduce((s, i) => s + (Number(i.value) || 0), 0), 0)
    }),
    {
      name: 'rocket-proposal-v4-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
