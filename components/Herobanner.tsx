// ─────────────────────────────────────────────────────
// HeroBanner.tsx  — SERVER COMPONENT (no "use client")
//
// APPROACH: "Server shell, client islands"
//
// The outer section, background layers, and static slide data
// live here as a server component. Only the truly interactive
// pieces (slider logic, canvas, auto-advance) are isolated
// into a single child client component: <HeroSlider />.
//
// Server component responsibilities here:
//   - Renders the outer <section> wrapper (SEO sees this immediately)
//   - Passes the slides data as a plain prop to the client slider
//   - Any future data fetching (e.g. mentor availability from DB)
//     would go here as async/await — no useEffect needed
//
// ─────────────────────────────────────────────────────

import { HeroSlider } from "./HeroSlider";         // client component (below)
import { SLIDES } from "../data/hero-data";              // plain data file (below)

// Because this is a server component, it CAN be async.
// Example: if you needed live slot counts from your DB:
//   const slots = await db.query("SELECT remaining FROM sessions")
// Then pass it: <HeroSlider slides={slides} slotsRemaining={slots} />
export function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden mt-5 bg-[#020817]">
      {/* 
        These background layers are pure CSS — no JS.
        Server-rendering them means Google sees a styled page,
        not a blank white box while JS loads.
      */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/*
        <HeroSlider> is the ONLY client component in this tree.
        It owns: slide state, auto-advance timer, canvas starfield,
        resize detection, and dot navigation.

        RULE: a server component CAN render a client component as a child.
        The reverse is not true — a client component cannot render a
        server component directly (it can receive one as a prop/children though).
      */}
      <HeroSlider slides={SLIDES} />
    </div>
  );
}