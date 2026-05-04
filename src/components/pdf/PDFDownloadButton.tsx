"use client";

import { useProposalStore } from "@/store/proposalStore";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Create a client-only wrapper for the PDF link to avoid any SSR/Hydration issues
const PDFLinkWrapper = dynamic(
  async () => {
    const { PDFDownloadLink } = await import("@react-pdf/renderer");
    const ProposalDocument = (await import("./ProposalDocument")).default;
    
    return function Link({ formData, computed, fileName }: any) {
      return (
        <PDFDownloadLink
          document={<ProposalDocument formData={formData} computed={computed} />}
          fileName={fileName}
        >
          {/* @ts-ignore - Erro de tipagem conhecido no react-pdf para render props */}
          {({ loading, error }: { loading: boolean; error: any }) => (
            <button
              type="button"
              disabled={loading}
              className="btn-primary text-sm disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Gerando...
                </>
              ) : error ? (
                String(error)
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
          )}
        </PDFDownloadLink>
      );
    };
  },
  { 
    ssr: false,
    loading: () => (
      <button type="button" className="btn-primary text-sm opacity-60">
        Iniciando...
      </button>
    )
  }
);

export default function PDFDownloadButton() {
  const { formData, computed } = useProposalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clientName = formData.client.company || formData.client.name || "proposta";
  const fileName = `ROCKET-Proposta-${clientName.replace(/\s+/g, "-")}.pdf`;

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3">
      <PDFLinkWrapper 
        formData={formData} 
        computed={computed} 
        fileName={fileName} 
      />
    </div>
  );
}
