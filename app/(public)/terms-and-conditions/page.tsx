import { PageSection } from "@/interfaces/StaticPages.interface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use / Terms & Conditions | Crackora.com",
  description: `Welcome to Crackora.com (“Crackora”, “we”, “us”, or “our”). These
          Terms of Use (“Terms”) govern your access to and use of our website,
          mobile applications, and related services (collectively, the
          “Platform”). By accessing, registering, or using the Platform, or by
          clicking “I Agree”, “I Accept”, or similar, you confirm that you have
          read, understood, and agree to be bound by these Terms and all
          associated policies. If you do not agree with any part of these Terms,
          you must discontinue use of the Platform immediately.`,
};

export default function RefundPolicy() {
  const sections: PageSection[] = [
    {
      number: "01",
      title: "Definitions",
      bullets: [
        "“User” means any individual who accesses or uses the Platform.",
        "“Subscriber” means a User who has purchased or subscribed to paid Services.",
        "“Services” means all courses, test series, study materials, career guidance, and related offerings provided through the Platform.",
        "“Content” includes all text, videos, graphics, audio, quizzes, questions, notes, and other materials made available on the Platform.",
      ],
    },
    {
      number: "02",
      title: "Acceptance of Terms",
      body: "These Terms constitute a legally binding agreement between you and Crackora. By using the Platform, you agree to comply with these Terms and all applicable laws and regulations.",
    },
    {
      number: "03",
      title: "Eligibility",
      bullets: [
        "You must be at least 18 years of age to use the Platform independently.",
        "If you are under 18, you may use the Platform only with the consent and supervision of a parent or legal guardian.",
        "You agree to provide accurate, current, and complete information during registration and to keep it updated.",
      ],
      body: "Crackora reserves the right to suspend or terminate accounts that provide false or misleading information.",
    },
    {
      number: "04",
      title: "Account Registration & Security",
      bullets: [
        "Certain features require account registration using email, phone number, or other identification methods.",
        "You are solely responsible for maintaining the confidentiality of your login credentials.",
        "You must notify us immediately of any unauthorized access or use of your account.",
      ],
      body: "Crackora shall not be liable for any loss resulting from unauthorized account access due to your negligence.",
    },
    {
      number: "05",
      title: "Services and Subscriptions",
      bullets: [
        "Crackora may offer free, trial, or paid Services.",
        "Access to paid Services is granted only upon successful payment confirmation.",
        "We reserve the right to modify pricing, features, or availability at any time without prior notice.",
        "All purchases provide a limited, personal, non-transferable, and non-exclusive right to access the Services.",
      ],
      body: "Users are strictly prohibited from sharing, reselling, sublicensing, or distributing access to their accounts or subscriptions.",
    },
    {
      number: "06",
      title: "Intellectual Property & Content Usage",
      bullets: [
        "All Content is owned by or licensed to Crackora and is protected under applicable intellectual property laws.",
        "Users are granted a limited, revocable license to access Content solely for personal educational purposes.",
        "You may not copy, reproduce, distribute, modify, publish, transmit, or commercially exploit any Content without prior written permission.",
      ],
      body: "Unauthorized use may result in legal action.",
    },
    {
      number: "07",
      title: "User-Generated Content",
      bullets: [
        "You grant Crackora a worldwide, perpetual, non-exclusive, royalty-free license to use, reproduce, modify, publish, and display such content.",
        "You represent that your content does not violate any laws or third-party rights.",
      ],
      body: "Crackora reserves the right to remove or moderate user content at its discretion.",
    },
    {
      number: "08",
      title: "Code of Conduct",
      intro: "You agree not to:",
      bullets: [
        "Violate any applicable laws or regulations.",
        "Attempt to hack, disrupt, or compromise the Platform or its security.",
        "Upload or share harmful, abusive, defamatory, or unlawful content.",
        "Infringe on the rights of others.",
      ],
      body: "Crackora may take appropriate action, including suspension or termination, for violations of this section.",
    },
    {
      number: "09",
      title: "Payments & Refunds",
      bullets: [
        "All fees are displayed in the applicable currency on the Platform.",
        "Payments may be processed via third-party service providers; Crackora is not responsible for their failures or errors.",
        "Refunds are governed by the Refund & Cancellation Policy.",
      ],
      body: "The Refund & Cancellation Policy forms an integral part of these Terms.",
    },
    {
      number: "10",
      title: "Disclaimers",
      bullets: [
        "The Platform and Services are provided on an “as is” and “as available” basis.",
        "Crackora makes no warranties regarding accuracy, reliability, or availability.",
        "We do not guarantee academic performance, exam results, or career outcomes.",
      ],
    },
    {
      number: "11",
      title: "Limitation of Liability",
      intro: "To the maximum extent permitted by law:",
      bullets: [
        "Crackora shall not be liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount paid by you for the relevant Service.",
      ],
    },
    {
      number: "12",
      title: "Third-Party Links",
      body: "The Platform may contain links to third-party websites or services. Crackora does not control or endorse such platforms and is not responsible for their content or practices.",
    },
    {
      number: "13",
      title: "Suspension and Termination",
      bullets: [
        "Crackora reserves the right to suspend or terminate access to the Platform at its sole discretion, including for violation of these Terms.",
        "Users may discontinue use at any time.",
      ],
      body: "Termination shall not affect rights or obligations accrued prior to termination.",
    },
    {
      number: "14",
      title: "Governing Law and Jurisdiction",
      body: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Mumbai.",
    },
    {
      number: "15",
      title: "Amendments",
      body: "Crackora reserves the right to modify or update these Terms at any time. Changes will become effective immediately upon posting. Continued use of the Platform constitutes acceptance of the revised Terms.",
    },
  ];

  return (
    <section className="bg-[#f8f7f4] min-h-screen">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-900 leading-tight max-w-6xl">
          Terms of Use / Terms & Conditions – Crackora.com
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-normal max-w-6xl text-[15px]">
          Welcome to Crackora.com (“Crackora”, “we”, “us”, or “our”). These
          Terms of Use (“Terms”) govern your access to and use of our website,
          mobile applications, and related services (collectively, the
          “Platform”). By accessing, registering, or using the Platform, or by
          clicking “I Agree”, “I Accept”, or similar, you confirm that you have
          read, understood, and agree to be bound by these Terms and all
          associated policies. If you do not agree with any part of these Terms,
          you must discontinue use of the Platform immediately.
        </p>

        {/* Quick-reference highlights */}
        <div className="flex flex-wrap gap-3 mt-7">
          {[
            { icon: "⏱️", label: "Request within 5 days of purchase" },
            { icon: "📊", label: "Less than 5% content consumed" },
            { icon: "💳", label: "Up to 10% processing fee on approvals" },
            { icon: "📅", label: "Refund in 5–15 business days" },
          ].map((b) => (
            <div
              key={b.label}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200
                         rounded-full px-3 py-1.5 shadow-sm"
            >
              <span className="text-[11px]">{b.icon}</span>
              <span className="text-xs font-semibold text-cyan-900">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-gray-200" />
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        {sections.map((section) => (
          <div
            key={section.number}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow"
          >
            <div className="flex items-start gap-5">
              {/* Number Badge */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <span className="text-[11px] font-black text-amber-500">
                  {section.number}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                {/* Title */}
                <h2 className="text-base font-bold text-cyan-900">
                  {section.title}
                </h2>

                {/* Intro (only if no subSections) */}
                {section.intro && !section.subSections && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {section.intro}
                  </p>
                )}

                {/* Bullets (main section) */}
                {section.bullets && !section.subSections && (
                  <ul className="space-y-2">
                    {section.bullets.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Body */}
                {section.body && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {section.body}
                  </p>
                )}

                {/* subSections */}
                {section.subSections && (
                  <div className="space-y-5">
                    {section.subSections.map((sub, subIdx) => (
                      <div key={subIdx}>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-amber-600 mb-2">
                          {sub.subTitle}
                        </p>

                        {sub.intro && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            {sub.intro}
                          </p>
                        )}

                        {sub.bullets && (
                          <ul className="space-y-1.5 mb-3">
                            {sub.bullets.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                <span className="text-gray-600 text-sm leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sub.after && (
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {sub.after}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Contact card ────────────────────────────────── */}
        <div className="bg-cyan-900 rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            Contact Us
          </p>
          <h2 className="text-xl font-bold text-white mb-4">
            Questions about a purchase or refund?
          </h2>
          <p className="text-cyan-300 text-sm leading-relaxed mb-5">
            Reach out to our support team with your order details and we will
            get back to you as quickly as possible.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:support@crackora.com"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400
                         text-amber-900 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              📧 support@crackora.com
            </a>
            <a
              href="https://www.crackora.com"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white
                         font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors
                         border border-white/20"
            >
              🌐 crackora.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
