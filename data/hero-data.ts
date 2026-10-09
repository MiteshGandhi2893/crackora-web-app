// data/bento-hero-data.ts
// Copy + link data for the homepage bento hero. Kept separate from
// the component so copy / CTAs are a one-file edit.

export const THESIS_CONTENT = {
  eyebrow: "MCA ENTRANCE · COLLEGE · CAREER",

  title: "Crack the exam.",

  titleAccent: "We'll cover the rest of the journey.",

  description:
    "Prepare for your MCA entrance, understand your college options, and make better decisions at every step — with practical guidance built around the journey from entrance to career.",

  offerBadges: [
    "Entrance Preparation",
    "Free Mock Tests",
    "College Guidance",
    "Career Direction",
  ],

  primaryCta: {
    label: "Try Free Mock Test",
    href:
      "https://learn.crackora.com/learn/NIMCET-2026-FREE-Mock-Test-with-Detailed-Solutions",
  },

    secondaryCta: {
    label: "Explore Courses",
    href:
      "/courses",
  },
  
};
export const JOURNEY_CONTENT = {
  eyebrow: "Beyond the exam",
  title: "The MCA journey",
  description:
    "College selection, academics and placement — with mentorship from someone who's worked the roles you're aiming for.",
  mentor: { initials: "MS", name: "Mitesh Sir" },
  cta: { label: "See the journey", href: "/mca-journey" },
};

export const BLOG_CONTENT = {
  eyebrow: "Free resource",
  title: "Read the blog",
  description: "Guides on exams, college selection and careers.",
  cta: { label: "Browse articles", href: "/blog" },
};