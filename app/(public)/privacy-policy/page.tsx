import { PageSection } from "@/interfaces/StaticPages.interface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Crackora",
  metadataBase: new URL("https://crackora.com"),
  alternates: {
    canonical: "/privacy-policy",
  },
  description:
    "Learn how Crackora collects, uses, and protects your personal information. Our privacy policy covers data retention, cookies, third-party sharing, and your rights.",
};

export default function PrivacyPolicy() {
  const sections: PageSection[] = [
    {
      number: "01",
      title: "Information We Collect",
      subSections: [
        {
          subTitle: "1.1 Personal Information",
          intro:
            "We may collect personal information that you voluntarily provide when you:",
          bullets: [
            "Register for an account or create a profile",
            "Enroll in courses, test series, or career guidance programs",
            "Subscribe to newsletters or updates",
            "Make purchases or access paid services",
            "Participate in surveys, contests, or interactive features",
            "Contact our support team",
          ],
          after:
            "This may include your name, email address, phone number, account credentials, educational background, preferences, career interests, transaction details, and billing information (processed securely via third-party payment gateways), along with any additional information you choose to provide.",
        },
        {
          subTitle: "1.2 Automatically Collected Information",
          intro:
            "When you interact with the Platform, we may automatically collect:",
          bullets: [
            "IP address, browser type, and device information",
            "Pages visited, time spent, clickstream data, and referral URLs",
            "Usage patterns and analytics data",
          ],
          after:
            "This information is collected using cookies, tracking pixels, and similar technologies to improve functionality and user experience.",
        },
      ],
    },
    {
      number: "02",
      title: "How We Use Your Information",
      bullets: [
        "Provide, operate, and maintain the Platform",
        "Manage registrations, subscriptions, and transactions",
        "Deliver personalized learning experiences and career guidance",
        "Improve content quality, recommendations, and user experience",
        "Respond to inquiries, support requests, and feedback",
        "Send important service updates and administrative communications",
        "Share marketing communications (where you have opted in)",
        "Monitor usage trends and platform performance",
      ],
    },
    {
      number: "03",
      title: "Cookies & Tracking Technologies",
      body: "We use cookies and similar technologies to remember user preferences, maintain login sessions, understand user behavior, and enhance platform performance. Users may manage or disable cookies through browser settings; however, doing so may affect certain functionalities.",
    },
    {
      number: "04",
      title: "Sharing & Disclosure of Information",
      intro:
        "Crackora does not sell or rent personal information. Information may be shared only under the following circumstances:",
      bullets: [
        "With trusted service providers (such as hosting, analytics, and payment processors) assisting in platform operations",
        "To comply with legal obligations, regulatory requirements, or lawful requests",
        "In connection with business transfers such as mergers, acquisitions, or restructuring",
        "With your explicit consent",
      ],
    },
    {
      number: "05",
      title: "Data Retention",
      body: "We retain personal information only for as long as necessary to fulfill the purposes outlined in this Policy and to comply with legal, regulatory, or contractual obligations. Once no longer required, data will be securely deleted, anonymized, or archived.",
    },
    {
      number: "06",
      title: "Data Security",
      body: "We implement appropriate technical and organizational measures including encryption, secure communication protocols, controlled access, and protected infrastructure to safeguard your data. However, no system can guarantee absolute security, and use of the Platform is at your own risk.",
    },
    {
      number: "07",
      title: "Children's Privacy",
      body: "The Platform is intended for individuals aged 18 years or older. We do not knowingly collect personal data from minors. If such data is identified, appropriate steps will be taken to remove it.",
    },
    {
      number: "08",
      title: "Third-Party Links",
      body: "The Platform may contain links to third-party websites or services. Crackora does not control and is not responsible for their content or privacy practices. Users are encouraged to review third-party policies before sharing personal information.",
    },
    {
      number: "09",
      title: "Your Rights & Choices",
      body: "Depending on applicable laws, you may have the right to access, update, correct, or delete your personal data, and to opt out of marketing communications. Requests can be submitted via the contact details provided below.",
    },
    {
      number: "10",
      title: "Policy Updates",
      body: "This Privacy Policy may be updated periodically to reflect changes in legal, technical, or business practices. Continued use of the Platform after updates constitutes acceptance of the revised Policy.",
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
          Privacy Policy
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-relaxed max-w-6xl text-[15px]">
          Crackora.com (“Crackora”, “we”, “us”, or “our”) is committed to
          safeguarding your privacy and protecting your personal information.
          This Privacy Policy explains how we collect, use, disclose, store, and
          protect your information when you access our website, mobile
          applications, and related services (collectively, the “Platform”).
        </p>
        <p className="text-gray-600 leading-relaxed max-w-6xl text-[15px] mt-4">
          By accessing or using the Platform, you acknowledge that you have
          read, understood, and agree to this Privacy Policy. If you do not
          agree, please discontinue use of the Platform.
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { icon: "📅", label: "Last Updated: March 1, 2026" },
            { icon: "✅", label: "Effective Date: March 3, 2026" },
          ].map((b) => (
            <div
              key={b.label}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm"
            >
              <span className="text-[10px] font-black text-amber-500">
                {b.icon}
              </span>
              <span className="text-xs font-semibold text-cyan-900">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-200" />
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        {sections.map((section) => (
          <div
            key={section.number}
            className="bg-white border border-gray-200 rounded-6xl p-6 sm:p-8 shadow"
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

        {/* Contact Card */}
        <div className="bg-cyan-900 rounded-6xl p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            11 · Contact Us
          </p>

          <h2 className="text-xl font-bold text-white mb-4">
            Questions about your privacy?
          </h2>

          <p className="text-cyan-300 text-sm leading-relaxed mb-5">
            If you have any questions or concerns regarding this Privacy Policy
            or your data, we’re here to help.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:support@crackora.com"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              📧 support@crackora.com
            </a>

            <a
              href="https://www.crackora.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors border border-white/20"
            >
              🌐 crackora.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
