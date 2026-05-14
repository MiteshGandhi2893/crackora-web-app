import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://crackora.com"),

  title: "Disclaimer | Crackora",

  description:
    "Read the official Crackora disclaimer regarding educational content, MCA entrance preparation, career guidance, placements, external links, and limitation of liability.",

  keywords: [
    "Crackora disclaimer",
    "educational disclaimer",
    "MCA entrance guidance",
    "career guidance disclaimer",
    "placement disclaimer",
    "MAH MCA CET preparation",
    "NIMCET preparation",
    "Crackora legal",
    "online education disclaimer",
  ],

  alternates: {
    canonical: "https://crackora.com/disclaimer",
  },

  openGraph: {
    title: "Disclaimer | Crackora",
    description:
      "Understand the terms, limitations, and legal disclaimer governing the use of Crackora’s educational platform and services.",
    url: "https://crackora.com/disclaimer",
    siteName: "Crackora",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Crackora Disclaimer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | Crackora",
    description:
      "Official legal disclaimer for Crackora’s educational platform, mentorship, and career guidance services.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function DisclaimerPage() {
  const sections = [
    {
      number: "01",
      title: "No Guarantee of Results",
      body: (
        <>
          Crackora strives to support students in their academic and career
          journeys; however, we do not guarantee any specific results, including
          but not limited to examination scores, ranks, admissions, placements,
          or career outcomes.
          <br />
          <br />

          Individual performance depbodys on several factors such as personal
          effort, consistency, prior knowledge, skills, and external conditions
          beyond our control.
          <br />
          <br />
          Any success stories, testimonials, or case studies shared on the
          Platform are for illustrative purposes only and should not be
          interpreted as assurances or guarantees of similar outcomes.
        </>
      ),
    },
    {
      number: "02",
      title: "Accuracy and Updates of Content",
      intro:
        "We make reasonable efforts to ensure that the content available on Crackora is accurate, up-to-date, and reliable. However:",
      bullets: [
        "we do not warrant the completeness, accuracy, or timeliness of any information.",
        "Examination patterns, syllabi, eligibility criteria, cut-offs, and schedules are subject to change by the respective authorities without prior notice.",
        "We do not guarantee that all content will be error-free or fully comprehensive.",
      ],
      body: "Users are strongly advised to verify critical information through official sources or governing authorities.",
    },
    {
      number: "03",
      title: "Educational and Career Guidance",
      intro: "Crackora provides academic support and career guidance to help users make informed decisions. However:",
      bullets: [
        "All lectures, materials, strategies, and guidance are general in nature.",
        "They should not be considered as professional, legal, financial, or binding career advice.",
      ],
      body: "While we aim to guide users effectively, final decisions regarding education, examinations, and career paths remain the sole responsibility of the user.",
    },
    {
      number: "04",
      title: "Third-Party Content and External Links",
      intro:
        "The Platform may include references or links to third-party websites, tools, or services for user convenience. Crackora:",

      bullets: [
        "Does not control, bodyorse, or guarantee the accuracy of such external content",
        "Is not responsible for the availability, policies, or practices of third-party platforms",
        "Shall not be liable for any loss or damage arising from the use of third-party resources",
      ],

      body: "Users are encouraged to review the terms and policies of any external platforms they access.",
    },
    {
      number: "05",
      title: "Technical Limitations",

      intro:
        "While we aim to provide a seamless experience, Crackora does not guarantee uninterrupted or error-free access to the Platform. Issues may arise due to:",

      bullets: [
        "Internet connectivity problems",
        "Scheduled maintenance or system upgrades",
        "Device or browser compatibility issues",
        "Circumstances beyond our reasonable control",
      ],

      body: "Crackora shall not be held liable for any losses resulting from such interruptions.",
    },
    {
      number: "06",
      title: "Limitation of Liability",
      intro:
        "To the maximum extent permitted under applicable law, Crackora shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:",

      bullets: [
        "The use or inability to use the Platform",
        "Reliance on any content or guidance provided",
        "Any loss of data, opportunities, academic outcomes, or financial losses",
      ],
    },
    {
      number: "07",
      title: "User Responsibility",
      intro:
        "By using Crackora, you acknowledge that you are solely responsible for:",

      bullets: [
        "Evaluating the relevance and suitability of the content",
        "Verifying eligibility criteria and official requirements for examinations",
        "Making indepbodyent academic and career decisions",
      ],

      body: "You agree to use the Platform at your own discretion and risk.",
    },
    {
      number: "08",
      title: "Changes to Disclaimer",
      body: "Crackora reserves the right to update or modify this Disclaimer at any time without prior notice. Any changes will become effective immediately upon publication on the Platform. Continued use of the Platform constitutes acceptance of the updated Disclaimer.",
    },
    {
      number: "09",
      title: "Governing Law",
      body: "This Disclaimer shall be governed by and interpreted in accordance with the laws of India. Any disputes arising in connection with this Disclaimer shall be subject to the exclusive jurisdiction of the courts located in **[Insert City]**.",
    },
  ];

  return (
    <section className="bg-[#f8f7f4] min-h-screen">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          Legal
        </p>
        <h1 className="text-6xl sm:text-5xl font-bold text-cyan-900 leading-tight max-w-6xl">
          Disclaimer
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-relaxed max-w-6xl text-[15px]">
          The information, content, courses, test series, study materials,
          career guidance, and services provided on Crackora.com (“Crackora”,
          “we”, “us”, or “our”) are intbodyed solely for educational and
          informational purposes. By accessing or using this platform, you
          acknowledge and agree to the terms outlined in this Disclaimer.
        </p>

        {/* Meta badge */}
        <div className="flex flex-wrap gap-3 mt-6">
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-[10px] font-black text-amber-500">📅</span>
            <span className="text-xs font-semibold text-cyan-900">
              Last Updated: March 1, 2026
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-[10px] font-black text-amber-500">⚖️</span>
            <span className="text-xs font-semibold text-cyan-900">
              Governed by Indian Law · Mumbai Jurisdiction
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-200" />
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        {sections.map((s) => (
          <div
            key={s.number}
            className="bg-white border border-gray-200 rounded-6xl p-6 sm:p-8 shadow"
          >
            <div className="flex items-start gap-5">
              {/* Number badge */}
              <div
                className="shrink-0 w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100
                              flex items-center justify-center"
              >
                <span className="text-[11px] font-black text-amber-500">
                  {s.number}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-cyan-900 mb-3">
                  {s.title}
                </h2>

                {s.intro && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {s.intro}
                  </p>
                )}

                {s.bullets && (
                  <ul className="space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.body && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {s.body}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Contact card ────────────────────────────────── */}
        <div className="bg-cyan-900 rounded-6xl p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            10 · Contact Us
          </p>
          <h2 className="text-xl font-bold text-white mb-4">
            Questions about this Disclaimer?
          </h2>
          <p className="text-cyan-300 text-sm leading-relaxed mb-5">
            If you have any questions or concerns regarding this Disclaimer,
            feel free to reach out.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:support@crackora.com"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-900
                         font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              📧 support@crackora.com
            </a>
            <a
              href="https://www.crackora.com"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white
                         font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors border border-white/20"
            >
              🌐 crackora.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

