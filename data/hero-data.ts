// hero-data.ts
// SEO-optimized hero slides for Crackora
// 4 slides: MCA Entrance → MCA Journey → Skill Development → Placement Mentor

// ─── Slide type ────────────────────────────────────────────────────────────
export type RightKey = "entrance" | "journey" | "skills" | "mentor";

export interface Slide {
  id: string;
  eyebrow: "entrance" | "journey" | "skills" | "mentor";
  title: string;
  titleAccent: string;
  description: string;
  primaryBtn: { label: string; href: string };
  secondaryBtn: { label: string; href: string };
  right: RightKey;
  // SEO metadata — the parent page/server component should inject these
  // into the <title> and <meta name="description"> for the hero section
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
  journey: {
    label: "The Full MCA Journey • Entrance to First Job",
    cls: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  },
  skills: {
    label: "Skill Development • Full Stack • AI/ML • Cloud",
    cls: "border-violet-400/30 text-violet-300 bg-violet-500/10",
  },
  mentor: {
    label: "1-on-1 Mentorship • Expert Guidance • Real Mentors",
    cls: "border-emerald-400/30 text-emerald-300 bg-emerald-500/10",
  },
};

// ─── Exams (for entrance panel orbit) ──────────────────────────────────────
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

// ─── Journey steps ─────────────────────────────────────────────────────────
export const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Check Eligibility",
    sub: "BCA · BSc · BCom with Maths",
    color: "#f59e0b",
    href: "/tools/eligibility",
  },
  {
    num: "02",
    title: "Crack the Entrance",
    sub: "NIMCET · MAH CET · CUET PG",
    color: "#38bdf8",
    href: "/exam-info/nimcet",
  },
  {
    num: "03",
    title: "Choose Your NIT",
    sub: "Rank predictor · Cutoffs",
    color: "#a78bfa",
    href: "/tools/college",
  },
  {
    num: "04",
    title: "Complete MCA",
    sub: "Subjects · Notes · Projects",
    color: "#34d399",
    href: "/mca-journey",
  },
  {
    num: "05",
    title: "Build Real Skills",
    sub: "Full Stack · AI · Cloud · DSA",
    color: "#fb923c",
    href: "/mca-journey",
  },
  {
    num: "06",
    title: "Land Your First Job",
    sub: "₹4–10 LPA · NIT Placements",
    color: "#f472b6",
    href: "/mca-journey",
  },
] as const;

// ─── Skill tracks ──────────────────────────────────────────────────────────
export const SKILL_TRACKS = [
  {
    id: "fullstack",
    icon: "🌐",
    title: "Full Stack Dev",
    tags: ["React", "Node.js", "SQL"],
    salary: "₹5–9 LPA",
    demand: "Very High",
    color: "#38bdf8",
    colorBg: "rgba(56,189,248,0.08)",
    colorBorder: "rgba(56,189,248,0.25)",
  },
  {
    id: "aiml",
    icon: "🤖",
    title: "AI / ML",
    tags: ["Python", "TensorFlow", "DS"],
    salary: "₹6–12 LPA",
    demand: "Highest",
    color: "#a78bfa",
    colorBg: "rgba(167,139,250,0.08)",
    colorBorder: "rgba(167,139,250,0.25)",
  },
  {
    id: "cloud",
    icon: "☁️",
    title: "Cloud & DevOps",
    tags: ["AWS", "Docker", "CI/CD"],
    salary: "₹5–10 LPA",
    demand: "High",
    color: "#34d399",
    colorBg: "rgba(52,211,153,0.08)",
    colorBorder: "rgba(52,211,153,0.25)",
  },
  {
    id: "data",
    icon: "📊",
    title: "Data Analytics",
    tags: ["Python", "Power BI", "SQL"],
    salary: "₹4–8 LPA",
    demand: "High",
    color: "#fb923c",
    colorBg: "rgba(251,146,60,0.08)",
    colorBorder: "rgba(251,146,60,0.25)",
  },
] as const;

// ─── Mentor data ────────────────────────────────────────────────────────────
export const MENTOR_DATA = {
  college: {
    name: "Nitin Parmar",
    role: "MCA Entrance Expert · 8+ years",
    photoSrc: "/mentor-nitin.jpg",
    photoAlt: "Nitin Parmar — MCA College Selection Mentor",
    features: [
      "NIMCET strategy",
      "College selection",
      "NIT cutoff analysis",
      "CAP round guidance",
    ] as const,
    bookHref: "https://wa.me/917738831585?text=Hi+Crackora,+I+want+to+book+a+college+selection+session",
    badge: "Entrance Specialist",
  },
  guidance: {
    name: "Priya Sharma",
    role: "Placement & Career Mentor",
    photoSrc: "/mentor-priya.jpg",
    photoAlt: "Priya Sharma — MCA Placement and Career Mentor at Crackora",
    features: [
      "DSA interview prep",
      "Resume building",
      "Company-wise strategy",
      "Offer negotiation",
    ] as const,
    bookHref: "https://wa.me/917738831585?text=Hi+Crackora,+I+want+to+book+a+placement+guidance+session",
    badge: "Placement Expert",
  },
} as const;

// ─── Slides ────────────────────────────────────────────────────────────────
// Each slide H1 targets a primary search keyword cluster.
// titleAccent is the substring that will be rendered in amber.
// Parent server component should use seoTitle + seoDescription for meta tags.
export const SLIDES: Slide[] = [
  {
    id: "entrance",
    eyebrow: "entrance",
    title: "Crack NIMCET & MAH MCA CET 2026 with Free Mock Tests & PYQs",
    titleAccent: "NIMCET & MAH MCA CET 2026",
    description:
      "India's most focused MCA entrance platform. 50+ free mock tests, PYQ bank with solutions, rank predictor, and expert guidance — everything you need to get into NIT MCA.",
    primaryBtn: {
      label: "Start Free Mock Test →",
      href: "https://learn.crackora.com/learn/Free-MAH-MCA-CET-2026-Mock-Test",
    },
    secondaryBtn: {
      label: "Check NIMCET Eligibility",
      href: "/tools/eligibility",
    },
    right: "entrance",
    seoTitle: "NIMCET & MAH MCA CET 2026 Preparation — Free Mock Tests | Crackora",
    seoDescription:
      "Crack NIMCET, MAH MCA CET, CUET PG, TANCET, IPU CET and WB JECA with Crackora's free mock tests, PYQ bank, rank predictor, and expert guidance. India's #1 MCA entrance platform.",
  },
  {
    id: "journey",
    eyebrow: "journey",
    title: "Your Complete MCA Journey — Entrance to First Job, Step by Step",
    titleAccent: "MCA Journey",
    description:
      "From checking eligibility to cracking NIMCET, choosing the right NIT, surviving semesters, building skills, and landing a ₹4–10 LPA job — Crackora guides you at every stage.",
    primaryBtn: {
      label: "Explore Full MCA Guide →",
      href: "/mca-journey",
    },
    secondaryBtn: {
      label: "Predict Your College",
      href: "/tools/college",
    },
    right: "journey",
    seoTitle: "MCA Journey Guide 2026 — Eligibility to Placement | Crackora",
    seoDescription:
      "Complete MCA journey guide — eligibility, NIMCET preparation, NIT college selection, semester subjects, skill development, and placement preparation. Free tools at every stage.",
  },
  {
    id: "skills",
    eyebrow: "skills",
    title: "Build Placement-Ready Skills During MCA — Full Stack, AI & Cloud",
    titleAccent: "Placement-Ready Skills",
    description:
      "Don't waste 2 years of MCA. Get a clear semester-wise roadmap to pick Full Stack, AI/ML, Cloud, or Data Analytics — with free resources, project ideas, and what companies actually hire for.",
    primaryBtn: {
      label: "Explore Skills Roadmap →",
      href: "/mca-journey",
    },
    secondaryBtn: {
      label: "View Final Year Projects",
      href: "/mca-placements/project-ideas",
    },
    right: "skills",
    seoTitle: "Skills to Learn During MCA 2026 — Full Stack vs AI/ML vs Cloud | Crackora",
    seoDescription:
      "Semester-wise skill roadmap for MCA students — Full Stack, AI/ML, Cloud, Data Analytics. Free resources, project ideas, and placement-focused learning paths.",
  },
  {
    id: "mentor",
    eyebrow: "mentor",
    title: "1-on-1 Placement Mentorship for MCA Students — Real Experts",
    titleAccent: "Placement Mentorship",
    description:
      "Get personalized guidance from mentors who've been through NIMCET, NIT placements, and the job hunt. Resume reviews, DSA strategy, company-wise prep — all in one 45-min session.",
    primaryBtn: {
      label: "Book a Session — ₹249 →",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+want+to+book+a+mentorship+session",
    },
    secondaryBtn: {
      label: "Talk to Counsellor Free",
      href: "https://wa.me/917738831585?text=Hi+Crackora,+I+need+guidance+for+MCA",
    },
    right: "mentor",
    seoTitle: "MCA Placement Mentorship — 1-on-1 Expert Guidance | Crackora",
    seoDescription:
      "Book a 45-min 1-on-1 mentorship session with MCA placement experts. Resume review, DSA interview prep, company-wise strategy. Only ₹249.",
  },
];