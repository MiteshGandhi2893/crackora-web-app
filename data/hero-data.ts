// hero-data.ts
// SEO-optimized hero slides for Crackora
// Slide 1: Platform overview (entrance)
// Slide 2: College Guidance — Azad Sir
// Slide 3: MCA Career Mentorship — Mitesh Sir

// ─── Slide type ────────────────────────────────────────────────────────────
export type RightKey = "orbit" | "college-mentor" | "guidance-mentor";

export interface Slide {
  id: string;
  eyebrow: "entrance" | "college" | "mentor";
  title: string;
  titleAccent: string;
  description: string;
  primaryBtn: { label: string; href: string };
  secondaryBtn: { label: string; href: string };
  right: RightKey;
  seoTitle: string;
  seoDescription: string;
}

// ─── Eyebrow labels ────────────────────────────────────────────────────────
export const eyebrowMap: Record<
  Slide["eyebrow"],
  { label: string; cls: string }
> = {
  entrance: {
    label: "MCA Entrance 2026 • NIMCET • MAH MCA CET • CUET PG",
    cls: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  college: {
    label: "1-on-1 College Counselling • Expert Guidance • Real Mentors",
    cls: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  },
  mentor: {
    label: "1-on-1 Career Mentorship • DSA • Placement • Real Experts",
    cls: "border-emerald-400/30 text-emerald-300 bg-emerald-500/10",
  },
};

// ─── Exams (for entrance panel) ────────────────────────────────────────────
export const EXAMS = [
  { label: "NIMCET", color: "#f59e0b", desc: "NIT seats via NIMCET" },
  { label: "MAH MCA\nCET", color: "#38bdf8", desc: "Maharashtra colleges" },
  { label: "CUET PG\nMCA", color: "#a78bfa", desc: "Central universities" },
  { label: "TANCET", color: "#34d399", desc: "Tamil Nadu colleges" },
  { label: "IPU CET\nMCA", color: "#fb923c", desc: "IP University, Delhi" },
  { label: "WB JECA", color: "#f472b6", desc: "West Bengal colleges" },
] as const;

// ─── Features (entrance panel) ─────────────────────────────────────────────
export const FEATURES = [
  { title: "Mock Tests", icon: "📝" },
  { title: "PYQ Bank", icon: "📚" },
  { title: "Study Planner", icon: "📅" },
  { title: "Doubt Solving", icon: "💡" },
  { title: "Analytics", icon: "📊" },
  { title: "Career Guidance", icon: "🎯" },
] as const;

// ─── Mentor data ────────────────────────────────────────────────────────────
export const MENTOR_DATA = {
  // Slide 2 — College Guidance
  college: {
    name: "Azad Sir",
    role: "MCA College Counsellor · 10+ years",
    photoSrc: "/Azad.jpeg",           // ← place your image here
    photoAlt: "Azad Sir — MCA College Counselling Expert at Crackora",
    programTitle: "MCA COUNSELLING PROGRAM 1:1",
    programSubtitle: "COLLEGE GUIDANCE",
    features: [
      "1-to-1 Personalized Counselling",
      "Smart College Shortlisting Strategy",
      "Fees vs ROI Comparison (Top Colleges)",
      "Backup College Planning",
      "Placement record deep-dive",
    ] as const,
    validity: "Valid for 30 days",
    bookHref:
      "https://learn.crackora.com/learn/MCA-Counselling-Program--1-1-College-Guidance",
    badge: "College Expert",
    price: "₹249",
    originalPrice: "₹599",
    discount: "58% OFF",
    sessionDuration: "45 min · Limited slots · Offer ends soon",
  },
  // Slide 3 — Career Mentorship
  guidance: {
    name: "Mitesh Sir",
    role: "MCA Career & Placement Mentor",
    photoSrc: "/Mitesh.jpeg",         // ← place your image here
    photoAlt: "Mitesh Sir — MCA Career Mentorship Expert at Crackora",
    programTitle: "MCA SUCCESS BLUEPRINT: 1-TO-1",
    programSubtitle: "CAREER MENTORSHIP PROGRAM",
    features: [
      "1-to-1 Personalized Mentorship",
      "Career Roadmap",
      "Technical Skill Planning (DSA + Development)",
      "Communication & Interview Guidance",
      "Semester-wise Action Plan",
    ] as const,
    validity: "Valid for 30 days",
    bookHref:
      "https://learn.crackora.com/learn/MCA-Success-Blueprint--1-to-1-Career-Mentorship-Program",
    badge: "Placement Expert",
    price: "₹249",
    originalPrice: "₹599",
    discount: "58% OFF",
    sessionDuration: "45 min · Limited slots · Offer ends soon",
  },
} as const;

// ─── Slides (3 slides) ─────────────────────────────────────────────────────
export const SLIDES: Slide[] = [
  {
  id: "entrance",
  eyebrow: "entrance",
  title: "Free NIMCET 2026 Mock Test — Score Higher in NIT MCA Entrance",
  titleAccent: "Free NIMCET 2026 Mock Test",
  description:
    "Exam on June 6 — only days away. 25,000 aspirants. 1,003 seats. Practice with full-length free mock tests built on the exact NIMCET pattern: 120 MCQs, sectional timer, detailed solutions & rank estimate.",
  primaryBtn: {
    label: "Attempt Free Mock Test Now →",
    href: "https://learn.crackora.com/learn/NIMCET-2026-FREE-Mock-Test-with-Detailed-Solutions",
  },
  secondaryBtn: {
    label: "View NIMCET Syllabus & Pattern",
    href: "/exam-info/nimcet",
  },
  right: "orbit",
  seoTitle:
    "Free NIMCET 2026 Mock Test — Full-Length Practice with Solutions | Crackora",
  seoDescription:
    "Attempt Crackora's free NIMCET 2026 mock test — 120 MCQs, sectional timing (Maths, Reasoning, Computer Awareness, English), detailed solutions and rank predictor. Prepare for the June 6 exam with India's most focused NIT MCA practice platform.",
},
  {
    id: "college-mentor",
    eyebrow: "college",
    title: "1-on-1 MCA College Counselling — Smart Shortlisting & ROI Clarity",
    titleAccent: "MCA College Counselling",
    description:
      "Don't guess your college. Get personalised guidance from Azad Sir — smart shortlisting, fees vs ROI comparison, backup strategy, and placement record deep-dives in one 45-min session.",
    primaryBtn: {
      label: "Book Session — ₹249 →",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+want+to+book+a+college+counselling+session+with+Azad+Sir",
    },
    secondaryBtn: {
      label: "Talk to Counsellor Free",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+need+college+guidance+for+MCA",
    },
    right: "college-mentor",
    seoTitle:
      "MCA College Counselling 1-on-1 — Expert Guidance by Azad Sir | Crackora",
    seoDescription:
      "Book a 45-min 1-on-1 MCA college counselling session with Azad Sir. Smart shortlisting, fees vs ROI analysis, backup college planning. Only ₹249.",
  },
  {
    id: "guidance-mentor",
    eyebrow: "mentor",
    title: "1-on-1 MCA Career Mentorship — DSA, Roadmap & Placement Strategy",
    titleAccent: "MCA Career Mentorship",
    description:
      "Get your personalised career blueprint from Mitesh Sir. DSA + development skill planning, interview guidance, semester-wise action plan — everything to go from MCA student to first job.",
    primaryBtn: {
      label: "Book Session — ₹249 →",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+want+to+book+a+career+mentorship+session+with+Mitesh+Sir",
    },
    secondaryBtn: {
      label: "Talk to Counsellor Free",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+need+career+guidance+for+MCA",
    },
    right: "guidance-mentor",
    seoTitle:
      "MCA Career Mentorship 1-on-1 — Expert Guidance by Mitesh Sir | Crackora",
    seoDescription:
      "Book a 45-min 1-on-1 MCA career mentorship session with Mitesh Sir. Career roadmap, DSA strategy, semester-wise action plan. Only ₹249.",
  },
];