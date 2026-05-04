"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useTemplateStore } from "@/store/templateStore";
import { useV4Store } from "@/store/v4Store";
import { TemplateCategory } from "@/types/blocks";
import { UploadCloud, FileText, Search, Check, Trash2, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { V5ProposalTemplate } from "@/store/templateStore";
import logger from "@/lib/logger";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES: ("Todas" | TemplateCategory)[] = ["Todas", "Vendas", "RH", "Projetos", "Geral"];
const MAX_FILE_SIZE_MB = 20;
const ACCEPTED_EXTENSIONS = [".pdf", ".json"];

// ─── Error Toast Component ─────────────────────────────────────────────────────
const ErrorToast = memo(function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 shadow-xl animate-slide-up">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700 mb-0.5">Erro no Upload</p>
        <p className="text-xs text-red-600">{message}</p>
      </div>
      <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

// ─── Upload Progress Component ─────────────────────────────────────────────────
const UploadProgress = memo(function UploadProgress({ fileName }: { fileName: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-rocket-border rounded-xl p-4 shadow-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-rocket-red/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-rocket-red animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-rocket-dark">Processando PDF...</p>
          <p className="text-xs text-rocket-gray truncate max-w-[200px]">{fileName}</p>
        </div>
      </div>
      <div className="h-1.5 bg-rocket-surface rounded-full overflow-hidden">
        <div className="h-full bg-rocket-red rounded-full animate-pulse w-3/4" />
      </div>
      <p className="text-[10px] text-rocket-gray mt-2">Extraindo texto e mapeando blocos editáveis...</p>
    </div>
  );
});

// ─── Template Card Component (memoized) ───────────────────────────────────────
const TemplateCard = memo(function TemplateCard({
  template,
  isActive,
  onUse,
  onDelete,
}: {
  template: V5ProposalTemplate;
  isActive: boolean;
  onUse: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <div
      className={`group flex flex-col bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:shadow-xl relative
        ${isActive ? "border-rocket-red shadow-lg scale-[1.02]" : "border-rocket-border hover:border-rocket-red/30 hover:-translate-y-1"}`}
    >
      {/* Delete Button */}
      <button
        onClick={(e) => onDelete(e, template.id)}
        className="absolute top-3 left-3 z-20 p-2 bg-white/90 backdrop-blur hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        title="Excluir Modelo"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Thumbnail */}
      <div
        className="h-40 w-full relative p-6 flex flex-col justify-end"
        style={{
          background: `linear-gradient(135deg, ${template.visualIdentity.primaryColor}18 0%, ${template.visualIdentity.secondaryColor}10 100%)`,
          borderBottom: `3px solid ${template.visualIdentity.primaryColor}`,
        }}
      >
        <div className="absolute top-4 right-4">
          <span className="bg-white/85 backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-rocket-dark shadow-sm">
            {template.category}
          </span>
        </div>

        {/* Blocks count badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/80 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg text-rocket-gray shadow-sm">
            {template.defaultBlocks.length} blocos
          </span>
        </div>

        {/* Skeleton preview */}
        <div className="space-y-2 opacity-40">
          <div className="h-2 w-4/5 rounded-full" style={{ backgroundColor: template.visualIdentity.primaryColor }} />
          <div className="h-1.5 w-3/5 rounded-full bg-gray-300" />
          <div className="h-6 w-full rounded-lg border border-gray-200 bg-white/50 mt-3" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-rocket-dark font-display mb-1 line-clamp-1">{template.name}</h3>
        <p className="text-xs text-rocket-gray line-clamp-2 mb-4 flex-1">{template.description}</p>

        <div className="flex items-center gap-2 mb-5">
          <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-rocket-surface rounded-md text-rocket-dark">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: template.visualIdentity.primaryColor }} />
            {template.visualIdentity.primaryColor}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-rocket-surface rounded-md text-rocket-dark">
            <span className="text-[10px] font-black text-rocket-gray">Aa</span>
            {template.visualIdentity.fontFamily}
          </span>
        </div>

        <button
          onClick={() => onUse(template.id)}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200
            ${isActive ? "bg-rocket-red text-white shadow-red" : "bg-rocket-surface text-rocket-dark hover:bg-rocket-dark hover:text-white"}`}
        >
          {isActive ? (
            <>
              <Check className="w-4 h-4" /> Modelo Selecionado
            </>
          ) : (
            <>
              Usar este Modelo
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TemplateGallery() {
  const router = useRouter();
  const { templates, activeTemplateId, setActiveTemplate, addTemplate, removeTemplate } = useTemplateStore();
  const { loadTemplate } = useV4Store();

  const [filter, setFilter] = useState<"Todas" | TemplateCategory>("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadState, setUploadState] = useState<{ status: "idle" | "uploading"; fileName: string }>({ status: "idle", fileName: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredTemplates = useMemo(
    () =>
      templates.filter((t) => {
        const matchesCategory = filter === "Todas" || t.category === filter;
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [templates, filter, searchTerm]
  );

  const handleUseTemplate = useCallback(
    (id: string) => {
      const template = templates.find((t) => t.id === id);
      if (template) {
        setActiveTemplate(id);
        loadTemplate(template.defaultBlocks, template.visualIdentity);
        router.push("/v4");
      }
    },
    [templates, setActiveTemplate, loadTemplate, router]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirm("Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.")) {
        removeTemplate(id);
      }
    },
    [removeTemplate]
  );

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Formato não suportado: "${file.name}". Envie um arquivo .pdf ou .json.`;
    }
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return `Arquivo muito grande (${sizeMB.toFixed(1)}MB). O limite é ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Client-side validation first
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        e.target.value = "";
        return;
      }

      setUploadState({ status: "uploading", fileName: file.name });
      setErrorMessage(null);

      try {
        // Send to server API for robust processing
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-template", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Erro desconhecido no servidor.");
        }

        addTemplate({
          name: result.name,
          description:
            result.type === "pdf"
              ? `Template extraído do PDF: ${file.name} (${result.blocks.length} blocos)`
              : `Template importado do JSON: ${file.name}`,
          category: "Geral",
          visualIdentity: result.visualIdentity || {
            primaryColor: "#FF0000",
            secondaryColor: "#1a1a1a",
            fontFamily: "Inter",
          },
          defaultBlocks: result.blocks,
        });

      } catch (err: any) {
        const msg = err?.message || "Erro inesperado. Verifique o console para mais detalhes.";
        setErrorMessage(msg);
        logger.error({ error: err, fileName: file.name }, "[TemplateGallery Upload]");
      } finally {
        setUploadState({ status: "idle", fileName: "" });
        e.target.value = "";
      }
    },
    [addTemplate]
  );

  const isUploading = uploadState.status === "uploading";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-rocket-dark tracking-tight">
            Biblioteca de Modelos
          </h1>
          <p className="text-rocket-gray mt-1.5 text-sm">
            Selecione um template ou importe um PDF para transformar em blocos editáveis.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="relative group">
          <input
            type="file"
            accept=".pdf,.json"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            disabled={isUploading}
          />
          <div
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border-2 border-dashed transition-all duration-200
              ${isUploading
                ? "border-rocket-red/50 bg-rocket-red/5 cursor-wait"
                : "border-rocket-border bg-white group-hover:border-rocket-red/60 group-hover:bg-rocket-red/5 cursor-pointer"
              }`}
          >
            <UploadCloud
              className={`w-5 h-5 transition-colors ${isUploading ? "text-rocket-red animate-bounce" : "text-rocket-gray group-hover:text-rocket-red"}`}
            />
            <div>
              <p className="text-sm font-semibold text-rocket-dark">
                {isUploading ? "Processando..." : "Importar Modelo"}
              </p>
              <p className="text-[10px] text-rocket-gray">
                {isUploading ? uploadState.fileName : "PDF ou JSON · máx. 20MB"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-2xl border border-rocket-border shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === cat
                  ? "bg-rocket-dark text-white shadow-md"
                  : "bg-rocket-surface text-rocket-gray hover:bg-rocket-border hover:text-rocket-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rocket-gray pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-rocket-surface border border-rocket-border rounded-lg text-sm focus:border-rocket-dark focus:ring-1 focus:ring-rocket-dark outline-none transition-all"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isActive={activeTemplateId === template.id}
            onUse={handleUseTemplate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-rocket-border mx-auto mb-4" />
          <h3 className="text-lg font-bold text-rocket-dark mb-1">Nenhum modelo encontrado</h3>
          <p className="text-rocket-gray text-sm">
            {searchTerm ? `Nenhum resultado para "${searchTerm}".` : "Tente mudar a categoria ou importe um novo modelo."}
          </p>
        </div>
      )}

      {/* Overlays */}
      {isUploading && <UploadProgress fileName={uploadState.fileName} />}
      {errorMessage && <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  );
}
