// hero-data.ts — PLAIN DATA FILE, no "use client", no React imports
//
// WHY a separate file?
// Both the server component (HeroBanner) and the client component (HeroSlider)
// need access to the slides array. If it lived inside a "use client" file,
// importing it into the server component would pull in the client boundary too.
// A plain .ts file with no React hooks is neutral — importable from anywhere.

export type EyebrowKey = "platform" | "session";
export type RightKey = "orbit" | "college-mentor" | "guidance-mentor" | "webinar-cta";

export type Slide = {
  id: string;
  eyebrow: EyebrowKey;
  title: string;
  titleAccent: string;
  description: string;
  primaryBtn: { label: string; href: string };
  secondaryBtn: { label: string; href: string };
  right: RightKey;
};

export const slides: Slide[] = [
  {
    id: "platform",
    eyebrow: "platform",
    title:
      "Confused About MCA Colleges, Exams or Career? Get Real Guidance.",
    titleAccent: "Real Guidance",
    description:
      "From MAH MCA CET and NIMCET preparation to college selection, CAP rounds and placements — Crackora helps students and parents make confident decisions without wasting years or lakhs on the wrong path.",
    primaryBtn: {
      label: "📞 Talk to Counsellor",
      href: "https://wa.me/917738831585?text=Hi%20Crackora%2C%20I%20need%20guidance%20for%20MCA",
    },
    secondaryBtn: {
      label: "Start Free Mock Test",
      href: "https://learn.crackora.com/learn/Free-MAH-MCA-CET-2026-Mock-Test",
    },
    right: "orbit",
  },

  {
    id: "college-selection",
    eyebrow: "session",
    title:
      "Avoid Choosing the Wrong MCA College — Get Expert Counselling",
    titleAccent: "Wrong MCA College",
    description:
      "One wrong college decision can cost ₹8–15 lakhs and impact your placements for years. Get a personalised shortlist based on your score, budget, location and career goals with 1-on-1 guidance from Azad Sir.",
    primaryBtn: {
      label: "Book College Counselling →",
      href: "https://learn.crackora.com/learn/fast-checkout/264886?priceId=260251&cpst=1775810584196",
    },
    secondaryBtn: {
      label: "See What’s Included",
      href: "https://learn.crackora.com/learn/MCA-Counselling-Program--1-1-College-Guidance",
    },
    right: "college-mentor",
  },

  {
    id: "mca-guidance",
    eyebrow: "session",
    title:
      "MCA vs MTech vs Job? Stop Overthinking and Get Career Clarity",
    titleAccent: "Career Clarity",
    description:
      "Not sure which entrance exam to prepare for, which MCA specialisation fits you, or whether MCA is even the right move? Get honest guidance and a personalised roadmap from Mitesh Gandhi.",
    primaryBtn: {
      label: "Book Career Guidance →",
      href: "https://learn.crackora.com/learn/fast-checkout/264897?priceId=260255&cpst=1775810143484",
    },
    secondaryBtn: {
      label: "Explore Guidance Session",
      href: "https://learn.crackora.com/learn/MCA-Success-Blueprint--1-to-1-Career-Mentorship-Program",
    },
    right: "guidance-mentor",
  },
];

export const EXAMS = [
  { label: "NIMCET" },
  { label: "MAH\nMCA CET" },
  { label: "CUET\nPG MCA" },
  { label: "TANCET" },
  { label: "IPU\nCET MCA" },
  { label: "WB\nJECA" },
];

export const FEATURES = [
  {
    title: "Mock Tests",
    desc: "50+ NIMCET & MAH MCA CET pattern tests with detailed analysis.",
  },
  {
    title: "PYQ Bank",
    desc: "Previous year questions with video solutions and shortcuts.",
  },
  {
    title: "Study Planner",
    desc: "Create a personalised daily roadmap based on your target exam.",
  },
  {
    title: "Doubt Solving",
    desc: "Get unstuck quickly through mentor support and community help.",
  },
  {
    title: "Analytics",
    desc: "Track weak areas, accuracy, speed, and percentile trends.",
  },
  {
    title: "Career Guidance",
    desc: "Get clarity on colleges, placements, ROI, and MCA career paths.",
  },
];

export const eyebrowMap: Record<
  EyebrowKey,
  { cls: string; label: string; dot?: string }
> = {
  platform: {
    cls: "border-amber-400/60 bg-amber-950/60 text-amber-300",
    label: "Free tools, real guidance — from exam day to your first job offer",
  },
  session: {
    cls: "border-cyan-400/60 bg-cyan-950/60 text-cyan-300",
    label: "1-on-1 Session · Limited Slots",
  },
};

export const MENTOR_DATA = {
  college: {
    name: "Azad Sir",
    role: "MCA College Selection Expert · 6+ yrs mentoring",
    photoSrc: "/Azad.jpeg",
    photoAlt: "Azad Sir",
    badge: "Top Rated Mentor",
    features: [
      "Personalised college shortlist",
      "Score vs cutoff analysis",
      "Budget & ROI guidance",
      "NIT / IIIT vs private colleges",
      "Placement record deep-dive",
      "Application strategy",
    ],
    bookHref:
      "https://learn.crackora.com/learn/fast-checkout/264886?priceId=260251&cpst=1775810584196",
  },
  guidance: {
    name: "Mitesh Gandhi",
    role: "MCA Career Counsellor · BCA → MCA pathway expert",
    photoSrc: "/Mitesh.jpeg",
    photoAlt: "Mitesh Gandhi",
    badge: "Career Clarity Expert",
    features: [
      "MCA vs MTech comparison",
      "Right specialisation for you",
      "Exam selection strategy",
      "Study roadmap (0 to D-day)",
      "College tier planning",
      "Post-MCA career paths",
    ],
    bookHref:
      "https://learn.crackora.com/learn/fast-checkout/264897?priceId=260255&cpst=1775810143484",
  },
} as const;