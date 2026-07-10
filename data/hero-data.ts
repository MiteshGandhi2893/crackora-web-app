// hero-data.ts
// Crackora Hero data — single static hero + right-side image slider

// ─── Eyebrow ────────────────────────────────────────────────────────────
export const eyebrow = {
  label: "1-on-1 College Counselling & Career Mentorship",
  cls: "border-amber-500/30 text-amber-700 bg-amber-100",
};

// ─── Static left-hand hero content ─────────────────────────────────────
export const HERO_CONTENT = {
  title: "India's Trusted Platform for Law & MCA Entrance",
  titleAccent: "Law & MCA Entrance",
  description:
    "Crack CLAT, NIMCET & top MCA entrance exams with expert mock tests, PYQs and 1-on-1 college & career guidance — all under one roof.",
  secondaryBtn: {
    label: "Talk to Counsellor Free",
    href: "https://wa.me/919004782989?text=Hi+Crackora,+I+need+guidance+for+Law/MCA",
  },
};

// ─── Exams (for entrance panel elsewhere) ──────────────────────────────
export const EXAMS = [
  { label: "NIMCET", color: "#f59e0b", desc: "NIT seats via NIMCET" },
  { label: "MAH MCA\nCET", color: "#38bdf8", desc: "Maharashtra colleges" },
  { label: "CUET PG\nMCA", color: "#a78bfa", desc: "Central universities" },
  { label: "TANCET", color: "#34d399", desc: "Tamil Nadu colleges" },
  { label: "IPU CET\nMCA", color: "#fb923c", desc: "IP University, Delhi" },
  { label: "WB JECA", color: "#f472b6", desc: "West Bengal colleges" },
] as const;

// ─── Features (entrance panel elsewhere) ───────────────────────────────
export const FEATURES = [
  { title: "Mock Tests", icon: "📝" },
  { title: "PYQ Bank", icon: "📚" },
  { title: "Study Planner", icon: "📅" },
  { title: "Doubt Solving", icon: "💡" },
  { title: "Analytics", icon: "📊" },
  { title: "Career Guidance", icon: "🎯" },
] as const;

// ─── Right-side image slider ───────────────────────────────────────────
export interface RightImage {
  id: string;
  src: string;
  alt: string;
  href: string;
}

export const RIGHT_IMAGES: RightImage[] = [
  {
    id: "college-mentor",
    src: "/college-counselling.png",
    alt: "Azad Sir — MCA College Counselling Expert at Crackora",
    href: "https://learn.crackora.com/learn/MCA-Counselling-Program--1-1-College-Guidance",
  },
  {
    id: "guidance-mentor",
    src: "/career-mentorship.png",
    alt: "Mitesh Sir — MCA Career Mentorship Expert at Crackora",
    href: "https://learn.crackora.com/learn/MCA-Success-Blueprint--1-to-1-Career-Mentorship-Program",
  },
];