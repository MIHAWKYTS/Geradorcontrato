import TemplateGallery from "@/components/templates/TemplateGallery";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-rocket-surface">
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
                <p className="text-rocket-gray-light text-[9px] tracking-widest uppercase -mt-0.5">Gestão de Templates</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <TemplateGallery />
      </main>
    </div>
  );
}
