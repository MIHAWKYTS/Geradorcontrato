"use client";

import DocumentBuilder from '@/components/v3/DocumentBuilder';

export default function V3EditorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Um header simples para a página de teste */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white font-bold p-2 rounded-lg text-sm">
            ROCKET
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Gerador de Propostas <span className="text-red-600">V3</span>
          </h1>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Versão Modular Baseada em Blocos
        </div>
      </header>

      {/* Carrega o Builder que acabamos de criar */}
      <DocumentBuilder />
    </main>
  );
}
