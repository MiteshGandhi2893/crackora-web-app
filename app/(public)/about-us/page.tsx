export default function AboutUs() {
  return (
    <section className="bg-[#f8f7f4] min-h-screen">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          Who we are
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-900 leading-tight max-w-2xl">
          About Crackora
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-relaxed max-w-2xl text-base">
          Crackora is your complete companion for the MCA journey — from the day you start
          preparing for your entrance exam, all the way to landing your first job after
          graduation. We don`t stop at helping you crack the exam. We stay with you through
          college selection, academics, internships, and career growth.
        </p>
        <p className="text-gray-600 leading-relaxed max-w-2xl text-base mt-4">
          Built equally by two partners who bring technology and teaching together, Crackora
          combines smart tools with real classroom expertise — so every student gets both
          the strategy and the support they need at every stage.
        </p>

        {/* Journey steps */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { step: "01", label: "Entrance Prep" },
            { step: "02", label: "College Selection" },
            { step: "03", label: "MCA Academics" },
            { step: "04", label: "Internships" },
            { step: "05", label: "Job Placements" },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                <span className="text-[10px] font-black text-amber-500">{s.step}</span>
                <span className="text-xs font-semibold text-cyan-900">{s.label}</span>
              </div>
              {i < 4 && <span className="text-gray-300 text-sm">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-200" />
      </div>

      {/* ── Co-Founder 1: Mitesh Gandhi — photo LEFT, text RIGHT ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Photo frame */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl border-2 border-amber-300" />
              <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-cyan-800 to-cyan-950 aspect-4/5 w-full max-w-xs mx-auto lg:max-w-none flex flex-col items-center justify-end pb-8 px-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 240" className="w-48 opacity-10 text-white fill-current">
                    <circle cx="100" cy="75" r="50"/>
                    <path d="M20 240 Q20 160 100 160 Q180 160 180 240Z"/>
                  </svg>
                </div>
                <div className="relative z-10 text-center">
                  <div className="inline-block bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                    Co-Founder
                  </div>
                  <p className="text-white font-bold text-lg leading-tight">Mitesh Gandhi</p>
                  <p className="text-cyan-200 text-xs mt-1">Add your photo here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
                Technology & Product
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900">
                Mitesh Gandhi
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Co-Founder · Software Developer · 7+ Years of Experience
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Mitesh drives the technology and product vision behind Crackora. With over{" "}
              <strong className="text-gray-800">7 years of software development experience</strong>,
              he built Crackora`s tools to be genuinely useful for students — not just pretty
              dashboards, but things that actually solve real problems at every stage of the
              MCA journey.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "MSc Computer Science — Binghamton University, New York",
                "MSc Advanced CS with Data Science — University of Strathclyde, Scotland",
              ].map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-100 px-3 py-1.5 rounded-full">
                  <span className="text-cyan-400">🎓</span> {c}
                </span>
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed">
              Having guided students through MCA entrance preparation himself, Mitesh
              noticed something most platforms miss — students don`t stop needing help after
              the entrance exam. Questions about which college to choose, how to handle the
              MCA curriculum, how to get internships, how to crack placements — these are just
              as important, and nobody was answering them in one place.
            </p>

            <p className="text-gray-600 leading-relaxed">
              That`s why Crackora was built to cover the entire journey. From entrance cutoffs
              and college predictors to career guidance and placement support — it`s all here.
            </p>
          </div>
        </div>
      </div>

      {/* ── Equal partners divider ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-2">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          {/* <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 shadow-sm shrink-0">
            <span className="text-amber-500 text-base">🤝</span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-900">Equal Partners · 50 / 50</span>
            <span className="text-amber-500 text-base">🤝</span>
          </div> */}
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* ── Co-Founder 2: Mohd Azad — text LEFT, photo RIGHT ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">

          {/* Photo frame */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border-2 border-cyan-300" />
              <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-amber-700 to-amber-900 aspect-4/5 w-full max-w-xs mx-auto lg:max-w-none flex flex-col items-center justify-end pb-8 px-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 240" className="w-48 opacity-10 text-white fill-current">
                    <circle cx="100" cy="75" r="50"/>
                    <path d="M20 240 Q20 160 100 160 Q180 160 180 240Z"/>
                  </svg>
                </div>
                <div className="relative z-10 text-center">
                  <div className="inline-block bg-cyan-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                    Co-Founder
                  </div>
                  <p className="text-white font-bold text-lg leading-tight">Mohd Azad</p>
                  <p className="text-amber-200 text-xs mt-1">Add your photo here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
                Academics & Teaching
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900">
                Mohd Azad
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Co-Founder · Educator · 10+ Years of Teaching Experience
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Mohd Azad brings the academic and teaching backbone to Crackora. With over{" "}
              <strong className="text-gray-800">10 years of hands-on teaching experience</strong>,
              he ensures that every piece of content and guidance on the platform is accurate,
              practical, and genuinely exam-relevant — not just theoretically correct.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Current Affairs",
                "General Knowledge",
                "Logical Reasoning",
                "CAT Preparation",
                "MCA Entrance Coaching",
              ].map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full">
                  <span className="text-amber-400">✦</span> {s}
                </span>
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed">
              Having worked directly with hundreds of students, Azad understands that most
              students don`t struggle because they`re not smart — they struggle because nobody
              gave them a clear roadmap. What to study, how to study it, which college is
              actually worth it, what skills get you hired after MCA — these are questions
              real students ask and rarely get straight answers to.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Crackora`s content and guidance is built around those exact questions — practical,
              honest, and designed for students who are navigating the MCA path for the first time.
            </p>
          </div>
        </div>
      </div>

      {/* ── Full journey section ─────────────────────────────── */}
      <div className="bg-cyan-950 mt-4">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            What we cover
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            We are with you through the entire MCA journey
          </h2>
          <p className="text-cyan-300 text-sm leading-relaxed max-w-2xl mb-10">
            Most platforms stop at entrance prep. We don`t. Getting into an MCA college is just
            the beginning — what happens after matters just as much.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "📚",
                stage: "Stage 1",
                title: "Entrance Preparation",
                body: "NIMCET, MAH MCA CET, and other entrance exams. Study plans, practice questions, cutoff data, and college predictors — everything you need to crack the exam.",
              },
              {
                icon: "🏫",
                stage: "Stage 2",
                title: "College Selection",
                body: "Once you have your rank, we help you choose the right college — comparing cutoffs, fees, placements, and location so you make a decision you won't regret.",
              },
              {
                icon: "💡",
                stage: "Stage 3",
                title: "MCA Academics",
                body: "Inside MCA, the syllabus can be overwhelming. We help you focus on what actually matters for both exams and your career, not just what's in the textbook.",
              },
              {
                icon: "💼",
                stage: "Stage 4",
                title: "Internships",
                body: "Getting your first internship during MCA opens doors that are hard to open later. We guide you on where to look, how to apply, and how to prepare.",
              },
              {
                icon: "🚀",
                stage: "Stage 5",
                title: "Placements & Jobs",
                body: "From resume building to interview prep to understanding which companies hire MCA graduates — we help you walk into placements with confidence.",
              },
              {
                icon: "🎯",
                stage: "Always",
                title: "Honest Guidance",
                body: "No fluff. No false promises. Just clear, practical advice from people who have actually been through this journey and helped hundreds of students navigate it.",
              },
            ].map(card => (
              <div key={card.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">{card.stage}</p>
                <h3 className="text-white font-bold text-sm mb-2">{card.title}</h3>
                <p className="text-cyan-200 text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="text-cyan-400 text-xs leading-relaxed mt-10 max-w-2xl border-t border-white/10 pt-8">
            Crackora is not just another content platform. It is a long-term companion — built
            by two people who genuinely care about where MCA students end up, not just whether
            they cleared an entrance exam.
          </p>
        </div>
      </div>

    </section>
  );
}