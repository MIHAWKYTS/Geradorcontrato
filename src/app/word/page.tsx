"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import mammoth from 'mammoth';
import logger from '@/lib/logger';

export default function WordEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        exec('insertImage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          if (editorRef.current) {
            editorRef.current.innerHTML = result.value;
          }
        } catch (error) {
          alert('Erro ao processar o arquivo .docx');
          logger.error({ error }, "Error processing .docx file");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handlePrint = () => {
    // Na hora de imprimir, o browser gera um PDF nativo e a classe "print:hidden" esconde os botões.
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center pb-20 print:bg-white print:p-0 print:m-0">
      
      {/* Input de arquivo invisível para imagens */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      {/* Input de arquivo invisível para DOCX */}
      <input 
        type="file" 
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        ref={docxInputRef} 
        onChange={handleDocxUpload} 
        className="hidden" 
      />

      {/* Toolbar - Hidden when printing */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm flex flex-wrap items-center justify-center p-2 gap-2 print:hidden">
        
        <Link href="/" className="mr-4 text-sm font-bold text-gray-500 hover:text-black">
          ← Voltar
        </Link>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button onClick={() => exec('bold')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded font-serif font-bold text-gray-700" title="Negrito">B</button>
        <button onClick={() => exec('italic')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded font-serif italic text-gray-700" title="Itálico">I</button>
        <button onClick={() => exec('underline')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded font-serif underline text-gray-700" title="Sublinhado">U</button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <select 
          onChange={(e) => exec('fontSize', e.target.value)} 
          className="p-1 border border-gray-300 rounded text-sm text-gray-700 outline-none hover:border-gray-400"
          title="Tamanho da Fonte"
          defaultValue=""
        >
          <option value="" disabled>Tamanho</option>
          <option value="1">Muito Pequeno</option>
          <option value="2">Pequeno</option>
          <option value="3">Normal</option>
          <option value="4">Médio</option>
          <option value="5">Grande</option>
          <option value="6">Muito Grande</option>
          <option value="7">Enorme</option>
        </select>
        
        <button onClick={() => exec('formatBlock', 'H1')} className="px-3 py-1 hover:bg-gray-100 rounded font-bold text-gray-700 text-sm">Título 1</button>
        <button onClick={() => exec('formatBlock', 'H2')} className="px-3 py-1 hover:bg-gray-100 rounded font-bold text-gray-700 text-sm">Título 2</button>
        <button onClick={() => exec('formatBlock', 'P')} className="px-3 py-1 hover:bg-gray-100 rounded text-gray-700 text-sm">Texto</button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button onClick={() => exec('justifyLeft')} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Alinhar à Esquerda">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
        </button>
        <button onClick={() => exec('justifyCenter')} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Centralizar">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
        </button>
        <button onClick={() => exec('justifyRight')} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Alinhar à Direita">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button onClick={() => exec('insertUnorderedList')} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Lista com Marcadores">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded font-bold text-sm flex items-center gap-1 transition-colors" title="Inserir Imagem do Computador">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Imagem
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button onClick={() => docxInputRef.current?.click()} className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded font-bold text-sm flex items-center gap-1 transition-colors" title="Importar arquivo DOCX">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Importar .docx
        </button>
        
        <div className="flex-1" />
        
        <button onClick={handlePrint} className="bg-[#ff0000] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 shadow flex items-center gap-2 transition-transform hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Salvar / Imprimir PDF
        </button>
      </div>

      {/* Documento Estilo Word (A4 Paper) */}
      <div 
        ref={editorRef}
        className="mt-8 bg-white shadow-2xl max-w-[210mm] w-full min-h-[297mm] p-[25mm] outline-none text-black print:shadow-none print:m-0 print:w-full print:p-0 print:min-h-0 focus:ring-4 focus:ring-blue-100 transition-all"
        contentEditable
        suppressContentEditableWarning
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', lineHeight: '1.7' }}
      >
        <h1 style={{ fontSize: '36px', color: '#1a1a1a', borderBottom: '6px solid #ff0000', paddingBottom: '10px', marginBottom: '20px', fontWeight: 'bold' }}>ROCKET EMPRESA JÚNIOR</h1>
        <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '40px' }}>Proposta Comercial</h2>
        
        <p><strong>Para:</strong> [Nome do Cliente]</p>
        <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
        <br/>
        
        <h2 style={{ fontSize: '22px', color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>1. Contexto e Objetivos</h2>
        <p>A ROCKET Empresa Júnior apresenta esta proposta visando solucionar os desafios de [Insira o problema].</p>
        <br/>
        
        <h2 style={{ fontSize: '22px', color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>2. Escopo do Projeto</h2>
        <p>Os seguintes entregáveis compõem a solução técnica:</p>
        <ul>
          <li><strong>Módulo 1:</strong> Descrição detalhada.</li>
          <li><strong>Módulo 2:</strong> Descrição detalhada.</li>
          <li><strong>Módulo 3:</strong> Descrição detalhada.</li>
        </ul>
        <br/>

        <h2 style={{ fontSize: '22px', color: '#ff0000', marginTop: '30px', fontWeight: 'bold' }}>3. Investimento</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f9f9f9' }}>Descrição</th>
              <th style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'right', backgroundColor: '#f9f9f9' }}>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '12px' }}>Desenvolvimento Completo da Solução</td>
              <td style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'right' }}>0,00</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '12px', fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ border: '1px solid #ccc', padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#ff0000' }}>0,00</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}><em>Condições de pagamento: [Descreva as condições].</em></p>
        
        <br/><br/><br/><br/>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
              <strong>Assinatura do Cliente</strong>
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
              <strong>Consultor ROCKET</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
