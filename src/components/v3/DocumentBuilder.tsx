"use client";

import React, { useState } from 'react';
import { useProposalV3Store } from '@/store/v3Store';
import { ProposalBlock } from '@/types/blocks';
import { DynamicPDFDocument } from './DynamicPDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

// Importações do dnd-kit para arrastar e soltar
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DocumentBuilder() {
  const { blocks, addBlock, removeBlock, updateBlock, reorderBlocks, identity, getTotalInvestment } = useProposalV3Store();
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  const handleAddBlock = (type: string, extraArgs = {}) => {
    addBlock({ id: crypto.randomUUID(), type, ...extraArgs } as any);
  };

  if (!isClient) return <div className="p-8 text-center">Carregando editor...</div>;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar de Ferramentas */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-bold text-xl text-gray-800 mb-2">Blocos</h2>
        
        <button onClick={() => handleAddBlock('text', { content: 'Novo bloco de texto...' })} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center gap-3 transition-colors text-sm font-medium">
          <span className="text-xl">📝</span> Texto
        </button>
        <button onClick={() => handleAddBlock('image', { url: '' })} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center gap-3 transition-colors text-sm font-medium">
          <span className="text-xl">🖼️</span> Imagem
        </button>
        <button onClick={() => handleAddBlock('table', { title: 'Cronograma', rows: [] })} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center gap-3 transition-colors text-sm font-medium">
          <span className="text-xl">📊</span> Tabela / Valores
        </button>
        <button onClick={() => handleAddBlock('investment', { discount: 0, installments: 1, paymentConditions: '50% no aceite da proposta, 50% na entrega.', paymentMethod: 'PIX' })} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center gap-3 transition-colors text-sm font-medium">
          <span className="text-xl">💰</span> Investimento
        </button>
        <button onClick={() => handleAddBlock('page-break')} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center gap-3 transition-colors text-sm font-medium">
          <span className="text-xl">✂️</span> Quebra de Página
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">Exportar</h3>
          <PDFDownloadLink
            document={<DynamicPDFDocument blocks={blocks} identity={identity} totalInvestment={getTotalInvestment()} />}
            fileName="proposta_rocket.pdf"
            className="w-full bg-[#ff0000] text-white p-3 rounded-lg font-bold text-center hover:bg-red-700 transition-colors block"
          >
            {/* @ts-ignore - Erro de tipagem conhecido no react-pdf para render props */}
            {({ loading, error }: { loading: boolean; error: any }) => (
              loading ? "Gerando PDF..." : error ? `Erro: ${String(error)}` : "📥 Baixar PDF"
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Área de Preview / Edição */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100">
        <div className="w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm] p-16" style={{ fontFamily: identity.fontFamily }}>
          {blocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-32">
              <span className="text-4xl mb-4">📄</span>
              <p>Adicione blocos pela barra lateral para iniciar a montagem da proposta.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                  <SortableBlockItem key={block.id} block={block} removeBlock={removeBlock} updateBlock={updateBlock} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper Sortable para cada bloco
function SortableBlockItem({ block, removeBlock, updateBlock }: { block: ProposalBlock, removeBlock: (id: string) => void, updateBlock: (id: string, updates: Partial<ProposalBlock>) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group mb-4 p-4 border rounded-lg transition-colors ${isDragging ? 'bg-blue-50/50 border-blue-300' : 'border-transparent hover:border-blue-200 hover:bg-blue-50/30'}`}>
      
      {/* Alça de Arrastar (Drag Handle) */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 bg-white border shadow-sm rounded text-gray-400 hover:text-gray-600 transition-opacity"
        title="Arraste para reordenar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>

      {/* Etiqueta de Tipo */}
      <div className="absolute -left-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
          {block.type.toUpperCase()}
        </span>
      </div>

      {/* Botão Remover */}
      <button 
        onClick={() => removeBlock(block.id)}
        className="absolute -right-3 -top-3 bg-red-500 hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
        title="Remover bloco"
      >
        ✕
      </button>

      <BlockRendererEditor block={block} onChange={(updates) => updateBlock(block.id, updates)} />
    </div>
  );
}

function BlockRendererEditor({ block, onChange }: { block: ProposalBlock, onChange: (u: Partial<ProposalBlock>) => void }) {
  switch (block.type) {
    case 'text':
      return (
        <textarea
          className="w-full min-h-[120px] p-2 bg-transparent border-none resize-y focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-800"
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Digite seu texto..."
          style={{ fontSize: block.style?.fontSize, color: block.style?.color, textAlign: block.style?.alignment }}
        />
      );
      
    case 'image':
      return (
        <div className="flex flex-col gap-2">
          {block.url ? (
            <div className="relative inline-block group/img">
              <img src={block.url} alt="Bloco de Imagem" className="max-w-full h-auto rounded border" style={{ width: block.width ? `${block.width}%` : '100%' }} />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <button onClick={() => onChange({ width: (block.width || 100) - 10 })} className="bg-white/90 p-1 px-2 text-xs font-bold rounded shadow">- Tam</button>
                <button onClick={() => onChange({ width: (block.width || 100) + 10 })} className="bg-white/90 p-1 px-2 text-xs font-bold rounded shadow">+ Tam</button>
                <button onClick={() => onChange({ url: '' })} className="bg-red-500/90 text-white p-1 px-2 text-xs font-bold rounded shadow">Limpar</button>
              </div>
            </div>
          ) : (
            <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 gap-3">
              <span>Cole a URL ou Base64 da imagem:</span>
              <input 
                type="text" 
                className="w-full max-w-md border border-gray-300 rounded p-2 text-sm"
                placeholder="https://..."
                onChange={(e) => onChange({ url: e.target.value })}
              />
            </div>
          )}
        </div>
      );

    case 'table':
      return (
        <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm">
          <input 
            type="text" 
            className="font-bold text-xl mb-4 w-full outline-none text-gray-800 placeholder-gray-300" 
            value={block.title} 
            onChange={(e) => onChange({ title: e.target.value })} 
            placeholder="Título da Tabela"
          />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-sm text-gray-500 w-2/3">Descrição</th>
                <th className="py-2 text-sm text-gray-500">Valor (R$)</th>
                <th className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 group/row">
                  <td className="py-2 pr-2">
                    <input 
                      className="w-full p-1 border border-transparent hover:border-gray-200 focus:border-blue-300 rounded outline-none"
                      value={row.description}
                      onChange={(e) => {
                        const newRows = block.rows.map(r => r.id === row.id ? { ...r, description: e.target.value } : r);
                        onChange({ rows: newRows });
                      }}
                      placeholder="Item..."
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input 
                      type="number"
                      className="w-full p-1 border border-transparent hover:border-gray-200 focus:border-blue-300 rounded outline-none"
                      value={row.value || ''}
                      onChange={(e) => {
                        const newRows = block.rows.map(r => r.id === row.id ? { ...r, value: parseFloat(e.target.value) || 0 } : r);
                        onChange({ rows: newRows });
                      }}
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button 
                      onClick={() => onChange({ rows: block.rows.filter(r => r.id !== row.id) })}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover/row:opacity-100 font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={() => onChange({ rows: [...block.rows, { id: crypto.randomUUID(), description: '', value: 0 }] })}
            className="mt-4 text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            + Adicionar Linha
          </button>
        </div>
      );

    case 'investment':
      const store = useProposalV3Store();
      const total = store.getTotalInvestment();
      
      return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-2xl mb-4" style={{ color: store.identity.primaryColor }}>Investimento Total</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-light text-gray-800">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            {total === 0 && <span className="text-sm text-orange-500 bg-orange-100 px-2 py-1 rounded">Adicione valores nas tabelas</span>}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Condições de Pagamento</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-y" 
                placeholder="Ex: 50% de entrada e 50% na entrega..."
                rows={3}
                value={block.paymentConditions}
                onChange={(e) => onChange({ paymentConditions: e.target.value })}
              />
            </div>
          </div>
        </div>
      );

    case 'page-break':
      return (
        <div className="border-t-2 border-dashed border-gray-300 w-full my-4 py-2 flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest pointer-events-none select-none">
          Quebra de Página no PDF
        </div>
      );
      
    default:
      return null;
  }
}
