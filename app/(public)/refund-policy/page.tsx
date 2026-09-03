import { PageSection } from "@/interfaces/StaticPages.interface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Crackora",
  description:
    "Read Crackora’s refund and cancellation policy for courses, mock tests, ebooks, and subscriptions. Learn eligibility criteria, refund timelines, and how to request a refund.",

  metadataBase: new URL("https://crackora.com"),

  alternates: {
    canonical: "/refund-policy",
  },

  openGraph: {
    title: "Refund & Cancellation Policy | Crackora",
    description:
      "Understand Crackora’s refund rules for digital products including courses, mock tests, and subscriptions.",
    url: "https://crackora.com/refund-policy",
    siteName: "Crackora",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Refund & Cancellation Policy | Crackora",
    description:
      "Refund eligibility, timelines, and cancellation process for Crackora products and subscriptions.",
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RefundPolicy() {
  const sections: PageSection[] = [
    {
      number: "01",
      title: "Applicability",
      bullets: [
        "Online courses and recorded programs",
        "Test series and mock examinations",
        "Subscription-based services",
        "Career guidance and related services",
      ],
      intro:
        "This Policy applies to all paid offerings available on the Platform, including but not limited to:",
    },
    {
      number: "02",
      title: "Refund Eligibility",
      body: "Crackora provides a limited refund window to ensure fairness while protecting proprietary content.",
      subSections: [
        {
          subTitle: "3-Day No-Questions-Asked Refund",
          bullets: [
            "Full refund within 3 (three) days from the date of purchase",
            "Content consumption must not exceed 10% of the course or service",
            "No explanation or justification required",
          ],
        },
        {
          subTitle: "Refund Requests Between 3 to 5 Days",
          bullets: [
            "Content consumption must remain below 10%",
            "A valid reason must be provided",
            "Subject to review and approval at Crackora’s sole discretion",
          ],
        },
        {
          subTitle: "Post 5-Day Period",
          bullets: [
            "No refund requests will be entertained after 5 days from purchase",
          ],
        },
      ],
    },
    {
      number: "03",
      title: "Non-Refundable Cases",
      subSections: [
        {
          subTitle: "Content Consumption Limit",
          bullets: [
            "No refund if more than 10% of the content has been accessed or consumed",
          ],
        },
        {
          subTitle: "Mock Tests and Test Series (Strict Policy)",
          bullets: [
            "No refunds once a mock test has been started, accessed, or attempted",
            "Accessing solutions, answer keys, or analytics counts as full usage",
            "Test series become non-refundable immediately upon access",
          ],
        },
        {
          subTitle: "Discounted or Promotional Purchases",
          bullets: [
            "Purchases made using discounts, coupons, bundles, or promotional pricing are non-refundable",
          ],
        },
        {
          subTitle: "Change of Mind or Preferences",
          bullets: [
            "Change of mind after purchase",
            "Dissatisfaction with teaching style or difficulty level",
            "General dissatisfaction after consuming content",
          ],
        },
        {
          subTitle: "Outcome-Based Requests",
          bullets: [
            "Exam performance, scores, ranks, or admissions",
            "Placement or career outcomes",
          ],
        },
        {
          subTitle: "Downloadable or Premium Resources",
          bullets: [
            "Accessing or downloading PDFs, notes, or recordings may make the purchase non-refundable",
          ],
        },
        {
          subTitle: "Misuse or Abuse of Policy",
          bullets: [
            "Repeated refund requests or suspicious activity",
            "Intentional misuse or exploitation of content",
          ],
          after:
            "Crackora reserves the right to suspend or terminate such accounts without prior notice.",
        },
      ],
    },
    {
      number: "04",
      title: "Subscription Plans",
      bullets: [
        "Monthly subscriptions are non-refundable once activated",
        "Annual subscriptions may be eligible for limited or pro-rata refunds within 5 days, subject to deductions and approval",
        "Access to services may be revoked upon successful refund processing",
      ],
    },
    {
      number: "05",
      title: "Administrative and Processing Fees",
      body: "Crackora reserves the right to deduct a processing fee of up to 10% of the total amount while issuing refunds. This includes payment gateway charges and administrative costs.",
    },
    {
      number: "06",
      title: "Refund Request Process",
      bullets: [
        "Submit a request via the account dashboard or email support@crackora.com",
        "Provide registered email ID",
        "Provide Order ID or transaction reference",
        "Provide reason (mandatory after 3 days)",
      ],
      body: "Incomplete or unverifiable requests may be rejected.",
    },
    {
      number: "07",
      title: "Refund Processing Timeline",
      bullets: [
        "Approved refunds will be processed within 5 to 15 business days",
        "Refunds will be credited to the original payment method",
        "Timelines may vary depending on banks or payment providers",
      ],
    },
    {
      number: "08",
      title: "Cancellation Policy",
      bullets: [
        "Users may cancel future subscriptions before the next billing cycle",
        "Cancellation prevents future charges but does not guarantee a refund for the current billing period",
      ],
    },
    {
      number: "09",
      title: "No Guarantee of Results",
      body: "Crackora provides educational content and career guidance services. We do not guarantee any specific academic or career outcomes. Refunds will not be granted based on unmet expectations regarding results.",
    },
    {
      number: "10",
      title: "Final Authority",
      body: "All decisions regarding refunds, cancellations, and eligibility shall be made at the sole discretion of Crackora and shall be final and binding.",
    },
    {
      number: "11",
      title: "Policy Updates",
      body: "Crackora reserves the right to modify this Policy at any time without prior notice. Changes will take effect immediately upon publication on the Platform.",
    },
  ];

  return (
    <section className="bg-[#f8f7f4] min-h-screen">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 pt-20 pb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-900 leading-tight lg:max-w-6xl sm:max-w-3xl">
          Refund & Cancellation Policy
        </h1>
        <div className="h-0.5 w-16 bg-amber-500 mt-4 mb-6" />
        <p className="text-gray-600 leading-relaxed lg:max-w-6xl sm:max-w-3xl text-[15px]">
          This policy governs all paid services offered on Crackora.com,
          including courses, mock test series, ebooks, and subscriptions. By
          purchasing any service on the Platform, you agree to the terms set out
          below.
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
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 py-12 space-y-6">
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

        {/* ── Contact card ────────────────────────────────── */}
        <div className="bg-cyan-900 rounded-6xl p-6 sm:p-8">
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

/* Terms and condition


**Terms of Use / Terms & Conditions – Crackora.com**
**Last Updated: [Insert Date]**

Welcome to Crackora.com (“Crackora”, “we”, “us”, or “our”). These Terms of Use (“Terms”) govern your access to and use of our website, mobile applications, and related services (collectively, the “Platform”).

By accessing, registering, or using the Platform, or by clicking “I Agree”, “I Accept”, or similar, you confirm that you have read, understood, and agree to be bound by these Terms and all associated policies. If you do not agree with any part of these Terms, you must discontinue use of the Platform immediately.

---

### 1. Definitions

* **“User”** means any individual who accesses or uses the Platform.
* **“Subscriber”** means a User who has purchased or subscribed to paid Services.
* **“Services”** means all courses, test series, study materials, career guidance, and related offerings provided through the Platform.
* **“Content”** includes all text, videos, graphics, audio, quizzes, questions, notes, and other materials made available on the Platform.

---

### 2. Acceptance of Terms

These Terms constitute a legally binding agreement between you and Crackora. By using the Platform, you agree to comply with these Terms and all applicable laws and regulations.

---

### 3. Eligibility

* You must be at least **18 years of age** to use the Platform independently.
* If you are under 18, you may use the Platform only with the consent and supervision of a parent or legal guardian.
* You agree to provide accurate, current, and complete information during registration and to keep it updated.

Crackora reserves the right to suspend or terminate accounts that provide false or misleading information.

---

### 4. Account Registration & Security

* Certain features require account registration using email, phone number, or other identification methods.
* You are solely responsible for maintaining the confidentiality of your login credentials.
* You must notify us immediately of any unauthorized access or use of your account.

Crackora shall not be liable for any loss resulting from unauthorized account access due to your negligence.

---

### 5. Services and Subscriptions

* Crackora may offer free, trial, or paid Services.
* Access to paid Services is granted only upon successful payment confirmation.
* We reserve the right to modify pricing, features, or availability at any time without prior notice.
* All purchases provide a **limited, personal, non-transferable, and non-exclusive right** to access the Services.

Users are strictly prohibited from sharing, reselling, sublicensing, or distributing access to their accounts or subscriptions.

---

### 6. Intellectual Property & Content Usage

* All Content is owned by or licensed to Crackora and is protected under applicable intellectual property laws.
* Users are granted a **limited, revocable license** to access Content solely for personal educational purposes.
* You may not copy, reproduce, distribute, modify, publish, transmit, or commercially exploit any Content without prior written permission.

Unauthorized use may result in legal action.

---

### 7. User-Generated Content

By submitting or uploading any content (including comments, feedback, or responses), you:

* Grant Crackora a **worldwide, perpetual, non-exclusive, royalty-free license** to use, reproduce, modify, publish, and display such content
* Represent that your content does not violate any laws or third-party rights

Crackora reserves the right to remove or moderate user content at its discretion.

---

### 8. Code of Conduct

You agree not to:

* Violate any applicable laws or regulations
* Attempt to hack, disrupt, or compromise the Platform or its security
* Upload or share harmful, abusive, defamatory, or unlawful content
* Infringe on the rights of others

Crackora may take appropriate action, including suspension or termination, for violations of this section.

---

### 9. Payments & Refunds

* All fees are displayed in the applicable currency on the Platform
* Payments may be processed via third-party service providers; Crackora is not responsible for their failures or errors
* Refunds, if applicable, shall be governed by our **Refund & Cancellation Policy**, which forms an integral part of these Terms

---

### 10. Disclaimers

* The Platform and Services are provided on an **“as is” and “as available”** basis
* Crackora makes no warranties regarding accuracy, reliability, or availability
* We do not guarantee academic performance, exam results, or career outcomes

---

### 11. Limitation of Liability

To the maximum extent permitted by law:

* Crackora shall not be liable for any indirect, incidental, or consequential damages
* Our total liability shall not exceed the amount paid by you for the relevant Service

---

### 12. Third-Party Links

The Platform may contain links to third-party websites or services. Crackora does not control or endorse such platforms and is not responsible for their content or practices.

---

### 13. Suspension and Termination

* Crackora reserves the right to suspend or terminate access to the Platform at its sole discretion, including for violation of these Terms
* Users may discontinue use at any time

Termination shall not affect rights or obligations accrued prior to termination.

---

### 14. Governing Law and Jurisdiction

These Terms shall be governed by and construed in accordance with the laws of India.

Any disputes arising out of or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the courts located in **[Insert City, e.g., Mumbai]**.

---

### 15. Amendments

Crackora reserves the right to modify or update these Terms at any time. Changes will become effective immediately upon posting. Continued use of the Platform constitutes acceptance of the revised Terms.

---

### 16. Contact Information

For any questions or concerns regarding these Terms, please contact:

* **Email:** [support@crackora.com](mailto:support@crackora.com)
* **Address:** [Insert Registered Office Address]

---


*/
