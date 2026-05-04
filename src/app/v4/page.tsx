"use client";

import ProposalBuilder from '@/components/v4/ProposalBuilder';

export default function V4EditorPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header do Dashboard V4 */}
      <header className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-4">
          <div className="bg-[#ff0000] text-white font-black px-3 py-1.5 rounded text-sm tracking-widest">
            ROCKET
          </div>
          <h1 className="text-xl font-bold text-white">
            Dashboard <span className="text-gray-400 font-normal">/</span> Criação de Propostas <span className="text-[#ff0000]">V4</span>
          </h1>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-700 px-3 py-1 rounded">
          Drag & Drop Builder
        </div>
      </header>

      {/* Editor Principal V4 */}
      <ProposalBuilder />
    </main>
  );
}
