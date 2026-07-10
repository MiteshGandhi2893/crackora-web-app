import Link from "next/link";

export function StartJourneyCard() {
  return (
    <div className="mt-10 bg-[#020817] rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(120,60,5,0.3),transparent_60%)]" />
      <div className="relative p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            Guided preparation
          </p>
          <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-2">
            Want someone to guide you through all of this?
          </h3>
          <p className="text-white/50 text-sm max-w-md leading-relaxed">
            Our 2027 live batch covers NIMCET + MAH MCA CET with live sessions
            3×/week, doubt solving, mock tests, and a personalised study plan.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 shrink-0">
          <Link href="/live-classes">
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all hover:scale-105 cursor-pointer whitespace-nowrap">
              View 2027 Live Batch →
            </button>
          </Link>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20MCA%20guidance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full border border-white/20 text-white/70 px-7 py-3 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap">
              Talk to a mentor free
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
