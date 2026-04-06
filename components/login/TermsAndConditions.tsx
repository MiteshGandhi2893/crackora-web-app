/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useState, useEffect } from "react";

interface SubSection {
  subTitle: string;
  intro?: string;
  bullets?: string[];
  after?: string;
}

interface PageSection {
  number: string;
  title: string;
  intro?: string;
  body?: string;
  bullets?: string[];
  subSections?: SubSection[];
}

interface TermsAndConditionsProps {
  onAgree: (agreedOn: Date) => void;
  onDisagree: () => void;
}

const sections: PageSection[] = [
  {
    number: "01",
    title: "Definitions",
    bullets: [
      '"User" means any individual who accesses or uses the Platform.',
      '"Subscriber" means a User who has purchased or subscribed to paid Services.',
      '"Services" means all courses, test series, study materials, career guidance, and related offerings provided through the Platform.',
      '"Content" includes all text, videos, graphics, audio, quizzes, questions, notes, and other materials made available on the Platform.',
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
      'The Platform and Services are provided on an "as is" and "as available" basis.',
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

export function TermsAndConditions({
  onAgree,
  onDisagree,
}: TermsAndConditionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [disagreed, setDisagreed] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    if (atBottom) setHasScrolledToEnd(true);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) setHasScrolledToEnd(true);
  }, []);

  const handleAgree = () => onAgree(new Date());

  const handleDisagree = () => {
    setDisagreed(true);
    setTimeout(() => onDisagree(), 2500);
  };

  return (
    <div className="flex flex-col w-full h-full gap-3 px-5 py-4">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
          Legal
        </p>
        <h2 className="text-base font-bold text-cyan-900 leading-snug">
          Terms of Use – Crackora.com
        </h2>
        <div className="h-0.5 w-10 bg-amber-500 mt-2 mb-2" />
        <p className="text-gray-500 text-xs leading-relaxed">
          Please read and scroll through the full terms before proceeding.
        </p>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto border border-gray-200 rounded-xl bg-[#f8f7f4]"
        style={{ maxHeight: "360px", minHeight: "200px" }}
      >
        {/* Intro banner */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white rounded-t-xl">
          <p className="text-gray-500 text-xs leading-relaxed">
            Welcome to Crackora.com ("Crackora", "we", "us", or "our"). These
            Terms of Use govern your access to and use of our website, mobile
            applications, and related services. By registering, you confirm you
            have read, understood, and agree to be bound by these Terms. If you
            do not agree, you must discontinue use of the Platform immediately.
          </p>
        </div>

        {/* Sections */}
        <div className="p-3 space-y-2">
          {sections.map((section) => (
            <div
              key={section.number}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Number badge */}
                <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center mt-0.5">
                  <span className="text-[9px] font-black text-amber-500">
                    {section.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="text-xs font-bold text-cyan-900">
                    {section.title}
                  </h3>

                  {section.intro && !section.subSections && (
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {section.intro}
                    </p>
                  )}

                  {section.bullets && !section.subSections && (
                    <ul className="space-y-1">
                      {section.bullets.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-gray-500 text-xs leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.body && (
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {section.body}
                    </p>
                  )}

                  {section.subSections && (
                    <div className="space-y-3">
                      {section.subSections.map((sub, subIdx) => (
                        <div key={subIdx}>
                          <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-600 mb-1">
                            {sub.subTitle}
                          </p>
                          {sub.intro && (
                            <p className="text-gray-500 text-xs leading-relaxed mb-1">
                              {sub.intro}
                            </p>
                          )}
                          {sub.bullets && (
                            <ul className="space-y-1 mb-2">
                              {sub.bullets.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                  <span className="text-gray-500 text-xs leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {sub.after && (
                            <p className="text-gray-400 text-xs leading-relaxed">
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

          {/* Contact card — very end so user must scroll here */}
          <div className="bg-cyan-900 rounded-xl p-4">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-400 mb-1">
              Contact Us
            </p>
            <h3 className="text-sm font-bold text-white mb-1">
              Questions about our terms?
            </h3>
            <p className="text-cyan-300 text-xs leading-relaxed mb-3">
              Reach out to our support team and we will get back to you as
              quickly as possible.
            </p>
            <a
              href="mailto:support@crackora.com"
              className="inline-flex items-center gap-1.5 bg-amber-500 text-amber-900 font-bold text-xs px-3 py-2 rounded-lg"
            >
              📧 support@crackora.com
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {!hasScrolledToEnd && (
        <p className="text-center text-xs text-amber-600 animate-pulse">
          ↓ Scroll to the end to enable the buttons
        </p>
      )}

      {/* Disagree message */}
      {disagreed && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
          <p className="text-red-700 text-xs font-medium">
            Sorry, you cannot create an account without agreeing to the Terms &amp; Conditions.
          </p>
        </div>
      )}

      {/* Action buttons */}
      {!disagreed && (
        <div className="flex w-full gap-3">
          <button
            disabled={!hasScrolledToEnd}
            onClick={handleDisagree}
            className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
              hasScrolledToEnd
                ? "border-gray-400 text-gray-600 hover:bg-gray-100 cursor-pointer"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
          >
            Disagree
          </button>
          <button
            disabled={!hasScrolledToEnd}
            onClick={handleAgree}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              hasScrolledToEnd
                ? "bg-amber-600 text-white hover:scale-105 cursor-pointer"
                : "bg-amber-200 text-white cursor-not-allowed"
            }`}
          >
            Agree &amp; Continue
          </button>
        </div>
      )}
    </div>
  );
}