// data/bento-hero-data.ts
// Copy + link data for the homepage bento hero. Kept separate from
// the component so copy / CTAs are a one-file edit.

export const THESIS_CONTENT = {
  eyebrow: "MCA Entrance . career mentorship",
  title: "Crack the exam.",
  titleAccent: "We'll cover the rest of the journey.",
  description:
    "Structured prep for MCA entrance exams, real course packages, and mentorship through college, academics and placement — from someone who's actually worked the roles you're aiming for.",
  offerBadges: ["MCA Entrance",  "College Counselling", "MCA Academics", "Placement Prep"],
  // Points at the packages card below, not a page that doesn't exist yet.
  primaryCta: { label: "Try Free Mock Test", href: "#courses-packages" },
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