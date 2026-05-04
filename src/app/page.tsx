"use client"

import { useState, useMemo } from "react";
import { useProposalStore } from "@/store/proposalStore";
import dynamic from "next/dynamic";
import Link from "next/link"; // Adicionado para o link do V4

// Form sections
import ClientSection from "@/components/form/ClientSection";
import ProblemSection from "@/components/form/ProblemSection";
import SolutionSection from "@/components/form/SolutionSection";
import ObjectivesSection from "@/components/form/ObjectivesSection";
import DeliverablesSection from "@/components/form/DeliverablesSection";
import ScheduleSection from "@/components/form/ScheduleSection";
import InvestmentSection from "@/components/form/InvestmentSection";
import MetaSection from "@/components/form/MetaSection";

// Preview
import ProposalPreview from "@/components/preview/ProposalPreview";

// PDF (dynamic to avoid SSR)
const PDFDownloadButton = dynamic(
  () => import("@/components/pdf/PDFDownloadButton"),
  { ssr: false }
);

// ─── Section config ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "meta",
    label: "Dados da Proposta",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    component: MetaSection,
  },
  {
    id: "client",
    label: "Dados do Cliente",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    component: ClientSection,
  },
  {
    id: "problem",
    label: "Problema Identificado",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    component: ProblemSection,
  },
  {
    id: "solution",
    label: "Solução Proposta",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7V3z" />
      </svg>
    ),
    component: SolutionSection,
  },
  {
    id: "objectives",
    label: "Objetivos",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    component: ObjectivesSection,
  },
  {
    id: "deliverables",
    label: "Entregáveis",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    component: DeliverablesSection,
  },
  {
    id: "schedule",
    label: "Cronograma",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    component: ScheduleSection,
  },
  {
    id: "investment",
    label: "Investimento",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    component: InvestmentSection,
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState("meta");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { computed, resetForm } = useProposalStore();

  const { activeSection, currentIndex } = useMemo(() => {
    const index = SECTIONS.findIndex((s) => s.id === activeId);
    return {
      activeSection: SECTIONS[index] || SECTIONS[0],
      currentIndex: index === -1 ? 0 : index
    };
  }, [activeId]);

  const CurrentStepComponent = activeSection.component;

  const goNext = () => {
    if (currentIndex < SECTIONS.length - 1) {
      setActiveId(SECTIONS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActiveId(SECTIONS[currentIndex - 1].id);
    }
  };

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen flex flex-col bg-rocket-surface">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-rocket-dark border-b border-white/5 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-rocket-red rounded-md flex items-center justify-center shadow-red">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-widest font-display">ROCKET</p>
                <p className="text-rocket-gray-light text-[9px] tracking-widest uppercase -mt-0.5">Empresa Júnior</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <span className="hidden sm:block text-rocket-gray-light text-xs font-medium">Gerador de Propostas</span>
          </div>

          <div className="flex items-center gap-3">
            {computed.total > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                <span className="text-rocket-gray-light text-xs">Total:</span>
                <span className="text-rocket-red font-bold text-sm font-display">{formatBRL(computed.total)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-rocket-gray-light hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => { if (confirm("Resetar todos os dados da proposta?")) resetForm(); }}
              className="hidden sm:flex p-2 rounded-lg bg-white/5 text-rocket-gray-light hover:bg-white/10 hover:text-white transition-all duration-200"
              title="Limpar formulário"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* BOTAO PARA A VERSÃO WORD
            <Link 
              href="/word" 
              className="hidden sm:flex items-center gap-2 bg-blue-500/10 border border-blue-500/50 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Edição style wors
            </Link>
            */}

            {/* BOTAO PARA A VERSÃO V4
            <Link 
              href="/v4" 
              className="hidden sm:flex items-center gap-2 bg-[#ff0000]/10 border border-[#ff0000]/50 text-[#ff0000] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#ff0000] hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              Editar por Drop
            </Link>
            */}

            {/* BOTAO PARA A BIBLIOTECA DE MODELOS (V5) */}
            <Link 
              href="/templates" 
              className="hidden sm:flex items-center gap-2 bg-purple-500/10 border border-purple-500/50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-600 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Galeria de Templates
            </Link>

            <PDFDownloadButton />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full flex gap-0 lg:gap-6 px-0 lg:px-6 py-0 lg:py-6">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="card sticky top-[80px]">
            <div className="p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rocket-gray px-2 mb-2">Seções</p>
              <nav className="space-y-0.5">
                {SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveId(section.id)}
                    className={`nav-pill w-full text-left ${activeId === section.id ? "active" : ""}`}
                  >
                    <span className={`${activeId === section.id ? "text-rocket-red" : "text-rocket-gray"}`}>
                      {section.icon}
                    </span>
                    <span className="flex-1 text-xs">{section.label}</span>
                    <span className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                      ${activeId === section.id ? "bg-rocket-red text-white" : "bg-rocket-border text-rocket-gray"}`}>
                      {index + 1}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="border-t border-rocket-border p-3">
              <div className="h-1.5 bg-rocket-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-rocket-red rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(((currentIndex + 1) / SECTIONS.length) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-rocket-gray mt-1 text-right">{currentIndex + 1}/{SECTIONS.length}</p>
            </div>
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {showMobilePreview && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/60 flex items-end" onClick={() => setShowMobilePreview(false)}>
              <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-rocket-border px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-rocket-dark">Preview da Proposta</span>
                  <button onClick={() => setShowMobilePreview(false)} className="text-rocket-gray"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <ProposalPreview />
              </div>
            </div>
          )}

          <div className="card flex-1 rounded-none lg:rounded-xl animate-slide-up">
            <div className="card-header">
              <div className="section-icon">{activeSection.icon}</div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-rocket-dark">{activeSection.label}</h2>
                <p className="text-xs text-rocket-gray">Passo {currentIndex + 1} de {SECTIONS.length}</p>
              </div>
            </div>

            <div className="card-body animate-fade-in" key={activeId}>
              {/* RENDERIZAÇÃO DO COMPONENTE DINÂMICO */}
              <CurrentStepComponent />
            </div>

            <div className="px-6 py-4 border-t border-rocket-border flex items-center justify-between">
              <button type="button" onClick={goPrev} disabled={currentIndex === 0} className="btn-secondary disabled:opacity-30">
                Anterior
              </button>

              <div className="flex items-center gap-1.5 lg:hidden">
                {SECTIONS.map((s, i) => (
                  <div key={s.id} className={`rounded-full ${i === currentIndex ? "w-4 h-2 bg-rocket-red" : "w-2 h-2 bg-rocket-border"}`} />
                ))}
              </div>

              {currentIndex < SECTIONS.length - 1 ? (
               <button type="button" onClick={goNext} className="btn-primary">Próximo</button>
              ) : (
                <PDFDownloadButton />
              )}
            </div>
          </div>
        </main>

        {/* Right Preview Sidebar */}
        <aside className="hidden lg:flex flex-col w-[340px] flex-shrink-0">
          <div className="card sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto custom-scroll">
            <div className="card-header">
              <h3 className="text-sm font-bold text-rocket-dark">Preview</h3>
              <span className="ml-auto text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Ao vivo</span>
            </div>
            <ProposalPreview />
          </div>
        </aside>
      </div>
    </div>
  );
}