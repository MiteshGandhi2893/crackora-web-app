import { BiCalendarCheck, BiVideo, BiQuestionMark, BiBookOpen } from "react-icons/bi";

const features = [
  {
    icon: <BiCalendarCheck className="w-5 h-5" />,
    title: "Personalized Study Plan",
    description: "Tailored schedules that adapt to your exam date and available hours.",
    accent: "amber",
  },
  {
    icon: <BiQuestionMark className="w-5 h-5" />,
    title: "Live Doubt Sessions",
    description: "Get expert answers whenever you're stuck — don't let doubts slow you down.",
    accent: "cyan",
  },
  {
    icon: <BiBookOpen className="w-5 h-5" />,
    title: "Exam-Specific Resources",
    description: "Curated, high-quality materials focused exactly on your target exam.",
    accent: "amber",
  },
  {
    icon: <BiVideo className="w-5 h-5" />,
    title: "Live & Recorded Sessions",
    description: "Learn at your own pace — anytime, anywhere, on any device.",
    accent: "cyan",
  },
];

const accentMap: Record<string, { card: string; icon: string; bar: string }> = {
  amber: {
    card: "bg-white border border-amber-100 hover:border-amber-300",
    icon: "bg-amber-50 text-amber-600",
    bar: "bg-amber-400",
  },
  cyan: {
    card: "bg-white border border-cyan-100 hover:border-cyan-300",
    icon: "bg-cyan-50 text-cyan-700",
    bar: "bg-cyan-500",
  },
};

export function WhyCrackora() {
  return (
    <section className="w-full bg-[#f8f7f4] px-6 sm:px-12 lg:px-24 py-16 lg:py-10 relative overflow-hidden lg:pb-24">

      {/* Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />

      {/* Header + video row */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start lg:items-center mb-14">

        {/* Left copy */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <span className="text-3xl font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
            Why Crackora
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#05101f] leading-tight tracking-tight">
            Expert-led learning,<br />
            <span className="text-cyan-800">tailored for you</span>
          </h2>
          <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
          <p className="text-[#05101f]/70 text-base leading-relaxed max-w-lg font-sans">
            A focused platform that prioritizes realistic mock tests and meaningful practice.
            Instead of overwhelming you, we deliver the right tools at the right time — growing
            into a complete exam-prep ecosystem, step by step.
          </p>

          {/* Stat row */}
          <div className="flex gap-8 pt-2">
            {[["10K+", "Students"], ["50+", "Mock Tests"], ["95%", "Satisfaction"]].map(([num, label]) => (
              <div key={label} className="flex flex-col">
                <span className="font-serif text-2xl text-[#05101f] font-bold">{num}</span>
                <span className="text-[11px] text-[#05101f]/40 font-sans tracking-wide uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right video */}
        <div className="lg:w-1/2 w-full">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(5,16,31,0.12)] border border-[#e8e4dc]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/5UA_XiBI-hk?si=9xr5Dlb9j4A64euL"
              title="Crackora intro"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const a = accentMap[f.accent];
          return (
            <div
              key={i}
              className={`${a.card} rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(5,16,31,0.09)] hover:-translate-y-0.5 group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${a.icon} flex items-center justify-center shrink-0`}>
                  {f.icon}
                </div>
                <div className={`h-0.75 flex-1 rounded-full ${a.bar} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
              </div>
              <h3 className="text-cyan-900 text-md font-semibold font-sans leading-snug">{f.title}</h3>
              <p className="text-cyan-950/60 text-xs leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>

      
    </section>
  );
}