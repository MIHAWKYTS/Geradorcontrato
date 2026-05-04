"use client";
import React, { useState, useEffect, memo } from 'react';
import { useV4Store } from '@/store/v4Store';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { V4DynamicPDF } from './V4DynamicPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { V4ProposalBlock } from '@/types/v4-blocks';

import { useTemplateStore } from '@/store/templateStore';

export default function ProposalBuilder() {
  const { isEditing, startProposal, blocks, addBlock, updateBlock, removeBlock, reorderBlocks, getTotal, visualIdentity } = useV4Store();
  const { addTemplate } = useTemplateStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!isEditing) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-gray-50">
        <button 
          onClick={startProposal} 
          className="px-8 py-5 bg-[#ff0000] text-white rounded-xl font-bold text-xl hover:bg-[#cc0000] shadow-[0_8px_16px_rgba(255,0,0,0.2)] transition-all hover:scale-105 flex items-center gap-3"
        >
          <span className="text-2xl">+</span> Nova Proposta ROCKET
        </button>
      </div>
    );
  }

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over && e.active.id !== e.over.id) {
      const oldIndex = blocks.findIndex(b => b.id === e.active.id);
      const newIndex = blocks.findIndex(b => b.id === e.over?.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  const handleSaveToGallery = () => {
    const name = prompt("Dê um nome para este modelo:", "Meu Template Personalizado");
    if (!name) return;

    addTemplate({
      name,
      description: `Modelo criado em ${new Date().toLocaleDateString('pt-BR')} via Editor V4`,
      category: "Geral",
      visualIdentity: visualIdentity || {
        primaryColor: "#FF0000",
        secondaryColor: "#1A1A1A",
        fontFamily: "Inter",
      },
      defaultBlocks: blocks,
    });

    alert("Modelo salvo com sucesso na Galeria!");
  };

  const handleExportJSON = () => {
    const data = {
      name: "Exportação ROCKET",
      blocks,
      visualIdentity,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template_rocket_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#f5f5f5] overflow-hidden">
      {/* Sidebar - Componentes */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-lg p-6 flex flex-col gap-3 overflow-y-auto z-10">
        <h2 className="font-bold text-sm uppercase tracking-widest mb-4 text-[#ff0000]">Adicionar Bloco</h2>
        
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'cover', companyName: 'ROCKET', companySubtitle: 'EMPRESA JÚNIOR', title: 'PROPOSTA COMERCIAL', clientName: 'Nome do Cliente', date: new Date().toLocaleDateString('pt-BR'), bgColor: '#1a1a1a', accentColor: '#ff0000', textColor: '#ffffff' })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">📄 Capa Institucional</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'text', content: 'Insira seu texto de contexto...' })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">📝 Texto Livre</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'deliverables', items: [] })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">📋 Entregáveis</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'investment', installments: 1, paymentConditions: '50% entrada, 50% entrega' })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">💰 Investimento (Auto)</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'gallery', images: [] })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">🖼️ Galeria de Imagens</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'signatures', clientName: 'Nome do Cliente', rocketResponsible: 'ROCKET' })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">✍️ Assinaturas</button>
        <button onClick={() => addBlock({ id: crypto.randomUUID(), type: 'page-break' })} className="text-left p-3 border border-gray-100 rounded hover:border-[#ff0000] hover:bg-red-50 font-medium text-sm text-gray-700 transition-colors flex items-center gap-2">✂️ Quebra de Página</button>

        <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={handleSaveToGallery}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💾 Salvar na Galeria
            </button>
            <button 
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              📤 Exportar JSON
            </button>
          </div>

          <PDFDownloadLink
            document={<V4DynamicPDF blocks={blocks} total={getTotal()} visualIdentity={visualIdentity} />}
            fileName="proposta_v4.pdf"
            className="w-full flex items-center justify-center bg-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            {/* @ts-ignore */}
            {({ loading, error }) => loading ? "Preparando Documento..." : error ? "Erro no PDF" : "📥 Baixar PDF Final"}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Editor (Canvas) */}
      <div className="flex-1 overflow-y-auto p-12 custom-scroll pb-40">
        <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-card p-0 relative">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map(block => (
                <SortableBlock key={block.id} block={block} removeBlock={removeBlock} updateBlock={updateBlock} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

// ─── Sortable Wrapper (memoized) ───────────────────────────────────────────────
const SortableBlock = memo(function SortableBlock({ block, removeBlock, updateBlock }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`relative group p-10 border-2 ${isDragging ? 'border-[#ff0000] bg-red-50/10' : 'border-transparent hover:border-dashed hover:border-gray-200'} transition-all`}>
      <div {...attributes} {...listeners} className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 p-2 bg-white rounded shadow text-xs uppercase tracking-widest font-bold">
        ⣿ Arrastar
      </div>
      <button onClick={() => removeBlock(block.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded shadow transition-colors font-bold w-8 h-8 flex items-center justify-center">
        ✕
      </button>
      <BlockRenderer block={block} updateBlock={updateBlock} />
    </div>
  );
});

// Renderer Inline com contentEditable simulado para edição em tempo real
const BlockRenderer = memo(function BlockRenderer({ block, updateBlock }: { block: V4ProposalBlock, updateBlock: any }) {
  switch(block.type) {
    case 'cover':
      const bgColor = block.bgColor || '#1a1a1a';
      const accentColor = block.accentColor || '#ff0000';
      const textColor = block.textColor || '#ffffff';
      
      return (
        <div className="p-16 rounded-xl relative overflow-hidden min-h-[400px] flex flex-col justify-end shadow-lg group/cover" style={{ backgroundColor: bgColor, color: textColor }}>
          {/* Seletor de Cores Oculto (Aparece no Hover) */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity bg-black/50 p-2 rounded-lg backdrop-blur-sm z-20">
            <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
              Fundo
              <input type="color" value={bgColor} onChange={(e) => updateBlock(block.id, { bgColor: e.target.value })} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer ml-2">
              Detalhes
              <input type="color" value={accentColor} onChange={(e) => updateBlock(block.id, { accentColor: e.target.value })} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer ml-2">
              Texto
              <input type="color" value={textColor} onChange={(e) => updateBlock(block.id, { textColor: e.target.value })} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
            </label>
          </div>

          <div className="absolute top-0 left-0 w-3 h-full" style={{ backgroundColor: accentColor }} />
          
          <div className="absolute top-16 left-16 z-10">
            <h2 
              className="text-4xl font-black tracking-[0.2em] outline-none hover:bg-black/10 p-2 -ml-2 rounded transition-colors" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { companyName: e.target.textContent })}
            >
              {block.companyName || 'ROCKET'}
            </h2>
            <p 
              className="text-xs tracking-[0.3em] font-bold mt-1 outline-none hover:bg-black/10 p-2 -ml-2 rounded transition-colors" 
              style={{ opacity: 0.6 }}
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { companySubtitle: e.target.textContent })}
            >
              {block.companySubtitle || 'EMPRESA JÚNIOR'}
            </p>
            <div className="w-16 h-1 mt-4" style={{ backgroundColor: accentColor }} />
          </div>

          <div className="mt-40 relative z-10">
            <h1 
              className="text-5xl font-display font-bold mb-6 outline-none hover:bg-black/10 p-2 -ml-2 rounded transition-colors" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { title: e.target.textContent })}
            >
              {block.title}
            </h1>
            <p 
              className="text-2xl outline-none hover:bg-black/10 p-2 -ml-2 rounded transition-colors" 
              style={{ opacity: 0.8 }}
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { clientName: e.target.textContent })}
            >
              {block.clientName}
            </p>
            <p 
              className="text-sm mt-12 outline-none hover:bg-black/10 p-2 -ml-2 rounded inline-block w-auto" 
              style={{ opacity: 0.5 }}
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { date: e.target.textContent })}
            >
              {block.date}
            </p>
          </div>
        </div>
      );
      
    case 'text':
      // Detect ### prefix = title extracted from PDF (ROCKET red styling)
      const isTitle = block.content.startsWith('### ');
      const displayContent = isTitle ? block.content.replace(/^### /, '') : block.content;

      if (isTitle) {
        return (
          <div className="border-l-4 border-[#ff0000] pl-4 py-1">
            <h3
              className="text-lg font-black uppercase tracking-widest text-[#ff0000] outline-none hover:bg-red-50 p-1 -ml-1 rounded transition-colors"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlock(block.id, { content: `### ${e.target.textContent}` })}
            >
              {displayContent}
            </h3>
          </div>
        );
      }

      return (
        <p 
          className="text-base text-gray-800 leading-relaxed outline-none focus:bg-gray-50 p-3 -m-3 rounded border border-transparent focus:border-gray-200 min-h-[100px]" 
          contentEditable 
          suppressContentEditableWarning 
          onBlur={(e) => updateBlock(block.id, { content: e.target.textContent })}
        >
          {block.content}
        </p>
      );
      
    case 'deliverables':
      return (
        <div className="w-full">
          <h3 className="text-xl font-bold mb-6 border-b-2 border-[#ff0000] pb-2 text-[#1a1a1a] uppercase tracking-wider inline-block">Escopo de Entregáveis</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {block.items.length === 0 ? (
              <div className="p-8 text-center text-gray-400">Nenhum entregável adicionado.</div>
            ) : (
              block.items.map((item, idx) => (
                <div key={item.id} className="flex gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group/item relative">
                  <input 
                    value={item.name} 
                    onChange={(e) => { const n = [...block.items]; n[idx].name = e.target.value; updateBlock(block.id, { items: n }); }} 
                    className="flex-1 bg-transparent font-medium text-gray-800 outline-none" 
                    placeholder="Nome da entrega" 
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">R$</span>
                    <input 
                      type="number" 
                      value={item.value || ''} 
                      onChange={(e) => { const n = [...block.items]; n[idx].value = Number(e.target.value); updateBlock(block.id, { items: n }); }} 
                      className="w-32 bg-transparent outline-none text-right font-bold text-[#ff0000]" 
                      placeholder="0.00" 
                    />
                  </div>
                  <button onClick={() => { const n = block.items.filter(i => i.id !== item.id); updateBlock(block.id, { items: n }); }} className="absolute -left-12 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-600 opacity-0 group-hover/item:opacity-100 p-2">✕</button>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => updateBlock(block.id, { items: [...block.items, { id: crypto.randomUUID(), name: '', desc: '', value: 0 }] })} 
            className="mt-4 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#1a1a1a] text-sm font-semibold rounded transition-colors inline-flex items-center gap-2"
          >
            <span className="text-[#ff0000] text-lg leading-none">+</span> Adicionar Linha
          </button>
        </div>
      );
      
    case 'investment':
      const total = useV4Store.getState().getTotal();
      return (
        <div className="bg-[#f9f9f9] border border-gray-200 p-8 rounded-xl relative shadow-sm">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-[#ff0000] rounded-l-xl" />
          <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-2">Investimento Total</h3>
          <div className="text-5xl font-display font-bold text-[#ff0000] mb-6">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <input 
              className="w-full bg-transparent p-3 outline-none text-sm font-medium text-gray-700" 
              placeholder="Condições de pagamento (Ex: 50% no aceite...)" 
              value={block.paymentConditions} 
              onChange={(e) => updateBlock(block.id, { paymentConditions: e.target.value })} 
            />
          </div>
        </div>
      );
      
    case 'signatures':
      return (
        <div className="flex justify-between gap-16 mt-16 px-8">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-px bg-[#1a1a1a] mb-4" />
            <div 
              className="text-center outline-none font-bold text-[#1a1a1a] hover:bg-gray-50 p-1 px-4 rounded w-full" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { clientName: e.target.textContent })}
            >
              {block.clientName}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Cliente</div>
          </div>
          
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-px bg-[#1a1a1a] mb-4" />
            <div 
              className="text-center outline-none font-bold text-[#1a1a1a] hover:bg-gray-50 p-1 px-4 rounded w-full" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateBlock(block.id, { rocketResponsible: e.target.textContent })}
            >
              {block.rocketResponsible}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Responsável ROCKET</div>
          </div>
        </div>
      );
      
    case 'gallery':
      return (
        <div className="w-full">
          <h3 className="text-xl font-bold mb-6 text-[#1a1a1a]">Galeria</h3>
          <div className="grid grid-cols-2 gap-4">
            {block.images.map((img, i) => (
              <div key={i} className="relative group/img aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {img ? (
                  <img src={img} className="w-full h-full object-cover" alt="Galeria" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">Imagem {i+1}</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <input 
                    className="w-full text-xs p-2 rounded text-black outline-none" 
                    placeholder="URL da Imagem..." 
                    value={img} 
                    onChange={(e) => {
                      const newImgs = [...block.images];
                      newImgs[i] = e.target.value;
                      updateBlock(block.id, { images: newImgs });
                    }}
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateBlock(block.id, { images: [...block.images, ''] })} 
              className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#ff0000] hover:bg-red-50 hover:text-[#ff0000] rounded-lg flex flex-col items-center justify-center text-gray-400 font-bold transition-colors"
            >
              <span className="text-2xl mb-1">+</span> Imagem
            </button>
          </div>
        </div>
      );
      
    case 'page-break':
      return (
        <div className="text-center py-6 text-gray-400 font-bold tracking-[0.2em] text-xs uppercase border-y border-dashed border-gray-300 bg-gray-50/50">
          --- Quebra de Página no PDF ---
        </div>
      );
      
    default: 
      return null;
  }
});
