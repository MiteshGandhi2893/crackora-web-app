import Image from "next/image";

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://crackora.com"),

  title: {
    default: "Crackora - Clarity Before Confidence",
    template: "%s | Crackora",
  },

  description:
    "Crackora helps students crack MCA entrance exams, succeed throughout their MCA journey, and prepare for placements and jobs with PYQs, mock tests, study resources, placement guidance, and career-focused learning tools.",

  keywords: [
    "Crackora",
    "MCA entrance preparation",
    "MCA CET",
    "NIMCET",
    "MCA journey",
    "placement preparation",
    "job preparation",
    "mock tests",
    "PYQ practice",
    "competitive exam preparation",
    "student learning platform",
    "coding interview preparation",
  ],

  authors: [{ name: "Crackora" }],
  creator: "Crackora",
  publisher: "Crackora",
  applicationName: "Crackora",

  alternates: {
    canonical: "https://crackora.com",
  },

  openGraph: {
    title: "Crackora - Clarity Before Confidence",
    description:
      "From MCA entrance preparation to placements and jobs — Crackora helps students with PYQs, mock tests, study resources, interview preparation, and career guidance.",
    url: "https://crackora.com",
    siteName: "Crackora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Crackora Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Crackora - Clarity Before Confidence",
    description:
      "Prepare for MCA entrances, placements, and jobs with Crackora’s PYQs, mock tests, study resources, and career-focused learning tools.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};
export default function AboutUs() {
  return (
    <section className="bg-[#f8f7f4] min-h-screen">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 pt-20 pb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          Who we are
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-900 leading-tight max-w-2xl">
          The people behind Crackora
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-relaxed max-w-2xl text-base">
          Crackora was built by two people who have seen, up close, what it takes for an MCA 
          student to truly succeed — not just crack an entrance exam, but build a career worth 
          being proud of. One of us has spent years inside classrooms, helping students unlock 
          their potential. The other has spent years inside the industry, building software and 
          understanding what it actually takes to get hired and grow.
        </p>
        <p className="text-gray-600 leading-relaxed max-w-2xl text-base mt-4">
          Together, we cover every stage of your MCA journey — from the moment you start 
          preparing for your entrance exam, all the way to your first job offer.
        </p>

        {/* Journey steps */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { step: "01", label: "Entrance Prep" },
            { step: "02", label: "College Selection" },
            { step: "03", label: "MCA Academics" },
            { step: "04", label: "Skill Building" },
            { step: "05", label: "Placements" },
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
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6">
        <div className="border-t border-gray-200" />
      </div>

      {/* ── Co-Founder 1: Mohd Azad — photo LEFT, text RIGHT ── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Photo frame */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl border-2 border-amber-600" />
              <div className="relative rounded-2xl overflow-hidden aspect-4/5 w-full max-w-xs mx-auto lg:max-w-none flex flex-col items-center justify-end pb-8 px-6 h-85">
                <Image
                  src={"/Azad.jpeg"}
                  fill
                  alt="Azad Sir — Co-Founder Crackora, MCA entrance exam mentor"
                  className="object-cover object-center "
                />
                <div className="absolute z-10 text-center top-10 right-5">
                  <div className="inline-block bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                    Co-Founder
                  </div>
                  <p className="text-white font-bold text-lg leading-tight drop-shadow">
                    Azad Sir
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
                Academics & Entrance Coaching
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900">
                Azad Sir
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Co-Founder · MCA Entrance Mentor · 10+ Years Teaching Experience
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Most students who don`t crack their entrance exam aren`t short on intelligence — 
              they`re short on the right guidance. Azad Sir has spent over a decade fixing 
              exactly that. He has personally mentored hundreds of students through 
              <strong className="text-gray-800"> MAH MCA CET, NIMCET, CAT, CLAT</strong>, 
              and more — and he understands what it actually takes to get selected in the 
              first attempt.
            </p>

            <p className="text-gray-600 leading-relaxed">
              His strength lies in making hard things feel simple. Whether it`s Quantitative 
              Aptitude, Logical Reasoning, or Computer Concepts, Azad Sir doesn`t just 
              teach — he builds the exam temperament, speed, and accuracy that separates 
              selected students from the rest.
            </p>

            {/* Subjects */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                What he teaches at Crackora
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Quantitative Aptitude",
                  "Logical Reasoning",
                  "Computer Concepts",
                  "Basic Mathematics",
                  "MCA Entrance Strategy",
                  "College Selection Guidance",
                ].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-amber-400">✦</span> {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-900 mb-3">
                His teaching philosophy
              </p>
              {[
                ["Clarity", "He breaks down complex topics until they feel obvious."],
                ["Strategy", "He teaches you how to think in an exam, not just what to study."],
                ["Consistency", "He believes pressure burns students out — the right system sustains them."],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">{title} over confusion. </strong>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-amber-400 pl-4 italic">
              If you`re serious about selection, you need more than preparation — you need 
              the right mentor. With Azad Sir, you don`t just study… you prepare to win.
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 py-2">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* ── Co-Founder 2: Mitesh Gandhi — text LEFT, photo RIGHT ── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">

          {/* Photo frame */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border-2 border-cyan-800" />
              <div className="relative rounded-2xl overflow-hidden aspect-4/5 w-full max-w-xs mx-auto lg:max-w-none flex flex-col items-center justify-end pb-8 px-6 h-80">
                <Image
                  src={"/Mitesh.jpeg"}
                  fill
                  alt="Mitesh Gandhi — Co-Founder Crackora, MCA career mentor and software developer"
                  className="object-cover object-center"
                />
                <div className="relative z-10 text-center">
                  <div className="inline-block bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                    Co-Founder
                  </div>
                  <p className="text-white font-bold text-lg leading-tight drop-shadow">
                    Mitesh Gandhi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
                Technology, Academics & Career Mentorship
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900">
                Mitesh Gandhi
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Co-Founder · Software Developer · 8+ Years of Industry Experience
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Mitesh has spent 8 years building real software — not just studying it. 
              He has worked across automation testing, full-stack development, and data science, 
              and he brings that ground-level industry perspective directly to Crackora`s 
              students. When he tells you what skills actually matter for getting hired after 
              MCA, it`s not guesswork — it comes from having been in the industry himself.
            </p>

            <p className="text-gray-600 leading-relaxed">
              He noticed something important: most MCA students reach their final year 
              without knowing how to write a resume, how to approach a DSA problem in an 
              interview, or even which companies are actually hiring MCA graduates. Crackora 
              was built to fix that — one student at a time.
            </p>

            {/* Qualifications */}
            <div className="flex flex-wrap gap-2">
              {[
                "MSc Computer Science — State University of New York",
                "MSc Advanced CS with Data Science — University of Strathclyde, Scotland",
              ].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full"
                >
                  <span className="text-cyan-400">🎓</span> {c}
                </span>
              ))}
            </div>

            {/* Subjects */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">
                What he teaches at Crackora
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mathematics (Entrance)",
                  "English (Entrance)",
                  "Computer Concepts",
                  "Data Structures & Algorithms",
                  "Programming & Skill Building",
                  "Interview Preparation",
                  "MCA Academics Guidance",
                ].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-cyan-400">✦</span> {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-900 mb-3">
                What he focuses on
              </p>
              {[
                ["Real skills over certificates.", "He teaches DSA, programming, and problem-solving the way industry actually expects it."],
                ["Academics that lead somewhere.", "He helps you navigate the MCA syllabus with an eye on what will matter in your career."],
                ["Honest career guidance.", "No inflated promises — just a clear-eyed view of where MCA graduates can go and how to get there."],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">{title} </strong>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-cyan-700 pl-4 italic">
              There are thousands of MCA students out there who are capable of building 
              great careers — they just never got the right guidance at the right time. 
              That`s the gap Crackora is here to close.
            </p>
          </div>
        </div>
      </div>

      {/* ── Full journey section ─────────────────────────────── */}
      <div className="bg-cyan-950 mt-4">
        <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            What we cover
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            We stay with you through the entire MCA journey
          </h2>
          <p className="text-cyan-300 text-sm leading-relaxed max-w-2xl mb-10">
            Most platforms stop at entrance prep. We don`t. Getting into an MCA college is 
            just the beginning — what happens after matters just as much, and we`ve built 
            Crackora to be there for every stage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "📚",
                stage: "Stage 1",
                title: "Entrance Preparation",
                body: "MAH MCA CET, NIMCET, and beyond. Expert coaching in Maths, English, Reasoning, and Computer Concepts — with cutoff data, mock tests, and college predictors built in.",
              },
              {
                icon: "🏫",
                stage: "Stage 2",
                title: "College Selection",
                body: "Once you have your score, we help you choose wisely — comparing colleges on placements, fees, location, and reputation so you don't spend two years somewhere you regret.",
              },
              {
                icon: "💡",
                stage: "Stage 3",
                title: "MCA Academics",
                body: "The MCA syllabus is vast. We help you focus on what actually builds your foundation, not just what's in the exam paper — because your degree should mean something.",
              },
              {
                icon: "💻",
                stage: "Stage 4",
                title: "Skill Building",
                body: "DSA, programming, problem-solving — the skills that actually get you hired. We teach these the way industry expects, not the way textbooks present them.",
              },
              {
                icon: "🚀",
                stage: "Stage 5",
                title: "Placements & Jobs",
                body: "Resume writing, interview prep, company research — we prepare you for placements like a mentor who has actually been through the hiring process, because we have.",
              },
              {
                icon: "🎯",
                stage: "Always",
                title: "Honest Guidance",
                body: "No fluff. No false promises. Just clear, practical advice from two people who genuinely care where you end up — not just whether you cleared an entrance exam.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">
                  {card.stage}
                </p>
                <h3 className="text-white font-bold text-sm mb-2">{card.title}</h3>
                <p className="text-cyan-200 text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="text-cyan-400 text-xs leading-relaxed mt-10 max-w-2xl border-t border-white/10 pt-8">
            Crackora is not just another content platform. It is a long-term companion — 
            built by two people who genuinely care about where MCA students end up, not 
            just whether they cleared an entrance exam.
          </p>
        </div>
      </div>
    </section>
  );
}