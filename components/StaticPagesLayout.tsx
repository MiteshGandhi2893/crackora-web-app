// ─── shared component: PolicyLayout.tsx ───────────────────────────────────────
// Place in: components/PolicyLayout.tsx

export function StaticPagesLayout({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Hero */}
      <div className="relative bg-[#05101f] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(8,60,100,0.6),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-16 lg:py-20">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400 border border-amber-400/30 bg-amber-400/5 rounded-full px-4 py-1.5 mb-4">
            {eyebrow}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-white/35 text-sm mt-3">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 lg:py-16">
        <div className="bg-white rounded-2xl border border-[#e8e4dc] shadow-[0_2px_16px_rgba(5,16,31,0.06)] px-6 sm:px-10 py-10 lg:py-14 prose-custom">
          {children}
        </div>
      </div>

    
    </div>
  );
}