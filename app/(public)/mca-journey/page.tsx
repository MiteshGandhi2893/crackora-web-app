"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { STARS } from "@/lib/util";
import { StartJourneyCard } from "@/components/StartJourney";
import { API_BASE_URL } from "@/services/api.service";
import {
  mcaToolsService,
  type JourneyData,
  type JourneyExam,
  type JourneySalarySnapshot,
} from "@/services/mca-tools.service";

// ─── Stage definitions ────────────────────────────────────────────────────────

const STAGES = [
  { id: "what",     label: "What is MCA",    icon: "🎓", phase: "Foundation",  color: "cyan"   },
  { id: "why",      label: "Why MCA",        icon: "💡", phase: "Decision",    color: "amber"  },
  { id: "exams",    label: "Entrance Exams", icon: "✍️", phase: "Preparation", color: "blue"   },
  { id: "timeline", label: "Timeline",       icon: "📅", phase: "Planning",    color: "orange" },
  { id: "mca-life", label: "Inside MCA",     icon: "💻", phase: "Degree",      color: "purple" },
  { id: "career",   label: "After MCA",      icon: "🚀", phase: "Career",      color: "green"  },
] as const;

// ─── Static content ───────────────────────────────────────────────────────────

const WHY_POINTS = [
  { icon: "🎓", title: "UGC-recognised Master's degree", body: "MCA is a full postgraduate qualification. It qualifies you for government jobs, MNC campus placements, and higher studies abroad — all of which a BCA or BSc alone cannot." },
  { icon: "💼", title: "Strong IT industry demand", body: "IT companies actively recruit MCA graduates from NITs and state universities for software development, data, and cloud roles. Your specialisation and college tier determine which companies come to campus." },
  { icon: "📈", title: "Clear salary progression", body: "Starting salaries vary by college and skills. What matters more is the trajectory — MCA graduates who build real projects and skills consistently grow faster over 3–5 years." },
  { icon: "🌐", title: "Multiple career directions", body: "MCA keeps you technical. You can move into software, data, cloud, security, government IT, or research — and switch paths with upskilling. It does not lock you into one track." },
];

const MCA_SEMESTERS = [
  {
    sem: "Semester 1 & 2", label: "Foundation",
    subjects: ["Data Structures & Algorithms", "Database Management Systems", "Computer Architecture", "Discrete Mathematics", "Object Oriented Programming"],
    focus: "Build your CS fundamentals. This is where you either fall behind or get ahead.",
  },
  {
    sem: "Semester 3 & 4", label: "Core + Electives",
    subjects: ["Operating Systems", "Computer Networks", "Software Engineering", "Elective specialisation begins", "Minor project"],
    focus: "Choose your direction carefully here — Data, Web, Cloud, or Security.",
  },
  {
    sem: "Final Semester(s)", label: "Specialisation + Project",
    subjects: ["Advanced electives in chosen track", "Major project / dissertation", "Internship (most colleges)", "Placement preparation"],
    focus: "Your project and internship matter more than marks at this stage.",
  },
];

const CAREER_PATHS = [
  { path: "Software Development",      roles: "SDE I → SDE II → Senior → Tech Lead",          companies: "IT services, product companies, startups" },
  { path: "Data & Analytics",          roles: "Data Analyst → Data Engineer → Data Scientist",  companies: "Analytics, fintech, e-commerce" },
  { path: "Cloud & DevOps",            roles: "Cloud Support → DevOps Eng → Architect",         companies: "IT infra, consulting, cloud providers" },
  { path: "Cybersecurity",             roles: "SOC Analyst → Pentester → Security Lead",         companies: "BFSI, IT consulting, government" },
  { path: "Higher Studies / Research", roles: "MTech / MS abroad / PhD",                        companies: "Universities, research labs, academia" },
  { path: "Government IT",             roles: "NIC / DRDO / SSC / UPSC",                        companies: "Central and state government departments" },
];

const STATIC_TIMELINE = [
  { phase: "Oct – Dec", event: "Begin entrance exam preparation",           type: "prep"    },
  { phase: "Dec – Feb", event: "Application forms open for most exams",     type: "apply"   },
  { phase: "Mar – Jun", event: "Entrance exams conducted",                  type: "exam"    },
  { phase: "Apr – Jul", event: "Results and rank cards released",           type: "result"  },
  { phase: "Jun – Aug", event: "Counselling, preferences, seat allotment",  type: "admit"   },
  { phase: "Aug – Sep", event: "Reporting to college — MCA begins",         type: "college" },
];

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR: Record<string, {
  dot: string; ring: string; text: string; bg: string; border: string; btn: string;
}> = {
  cyan:   { dot: "bg-cyan-600",   ring: "ring-cyan-200",   text: "text-cyan-800",   bg: "bg-cyan-50",   border: "border-cyan-200",   btn: "bg-cyan-900 hover:bg-cyan-800"   },
  amber:  { dot: "bg-amber-500",  ring: "ring-amber-200",  text: "text-amber-800",  bg: "bg-amber-50",  border: "border-amber-200",  btn: "bg-amber-600 hover:bg-amber-500"  },
  blue:   { dot: "bg-blue-600",   ring: "ring-blue-200",   text: "text-blue-800",   bg: "bg-blue-50",   border: "border-blue-200",   btn: "bg-blue-700 hover:bg-blue-600"   },
  orange: { dot: "bg-orange-500", ring: "ring-orange-200", text: "text-orange-800", bg: "bg-orange-50", border: "border-orange-200", btn: "bg-orange-600 hover:bg-orange-500" },
  purple: { dot: "bg-purple-600", ring: "ring-purple-200", text: "text-purple-800", bg: "bg-purple-50", border: "border-purple-200", btn: "bg-purple-700 hover:bg-purple-600" },
  green:  { dot: "bg-green-600",  ring: "ring-green-200",  text: "text-green-800",  bg: "bg-green-50",  border: "border-green-200",  btn: "bg-green-700 hover:bg-green-600"  },
};

const TIMELINE_STYLES: Record<string, string> = {
  prep:    "bg-gray-50    border-gray-200   text-gray-700",
  apply:   "bg-blue-50   border-blue-200   text-blue-800",
  exam:    "bg-orange-50 border-orange-200 text-orange-800",
  result:  "bg-green-50  border-green-200  text-green-800",
  admit:   "bg-purple-50 border-purple-200 text-purple-800",
  college: "bg-teal-50   border-teal-200   text-teal-800",
};

// ─── Exam card ────────────────────────────────────────────────────────────────

function ExamCard({ exam, expanded, onToggle }: {
  exam: JourneyExam; expanded: boolean; onToggle: () => void;
}) {
  const date = exam.rule_exam_date || exam.config_exam_date || "";
  return (
    <div
      className={`border-2 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden bg-white
        ${expanded ? "shadow-md" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"}`}
      style={expanded ? { borderColor: exam.color } : {}}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4 p-4">
        {exam.icon ? (
          <div className="w-12 h-12 relative shrink-0">
            <Image
              src={`${API_BASE_URL}/public${exam.icon}`}
              alt={exam.full_name} fill unoptimized
              className="object-contain p-1"
            />
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border-2"
            style={{ backgroundColor: exam.bg_color, color: exam.color, borderColor: exam.border_color }}
          >
            {exam.short_name.split(" ")[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight">{exam.full_name}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {date && <span className="text-[11px] text-gray-500">📅 {date}</span>}
            {exam.seats && <span className="text-[11px] text-gray-400">· {exam.seats} seats</span>}
            {exam.states && <span className="text-[11px] text-gray-400 truncate">· {exam.states}</span>}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Eligibility</p>
              <p className="text-xs font-semibold text-gray-800">
                Min {exam.min_pct_general}% General · {exam.min_pct_reserved}% Reserved
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Maths: {exam.math_req ? (exam.math_level || "Required") : "Not required"}
              </p>
              {exam.streams?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exam.streams.slice(0, 5).map((s) => (
                    <span key={s} className="text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-600">{s}</span>
                  ))}
                  {exam.streams.length > 5 && <span className="text-[10px] text-gray-400">+{exam.streams.length - 5} more</span>}
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Exam Details</p>
              {exam.conductor   && <p className="text-xs text-gray-700">By: <span className="font-semibold">{exam.conductor}</span></p>}
              {exam.reg_start   && <p className="text-xs text-gray-600 mt-0.5">Reg opens: {exam.reg_start}</p>}
              {exam.reg_end     && <p className="text-xs text-gray-600 mt-0.5">Reg closes: {exam.reg_end}</p>}
              {exam.result_date && <p className="text-xs text-gray-600 mt-0.5">Result: {exam.result_date}</p>}
              {exam.note        && <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{exam.note}</p>}
            </div>
          </div>
          {exam.official_url && (
            <a
              href={exam.official_url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold underline"
              style={{ color: exam.color }}
            >
              Official website →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Panel components ─────────────────────────────────────────────────────────

function WhatPanel() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">Overview</p>
        <h2 className="text-2xl font-bold text-cyan-900 mb-3">Master of Computer Applications</h2>
        <div className="h-0.5 w-12 bg-amber-500 mb-4" />
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          MCA is a 2-year postgraduate degree in computer science and software applications,
          recognised by UGC and AICTE. It is designed for students from non-engineering backgrounds —
          primarily BCA, BSc (CS/IT/Maths) — who want a strong technical career in software.
        </p>
        <p className="text-gray-600 leading-relaxed max-w-2xl mt-3">
          The programme was restructured from 3 years to 2 years under NEP 2020.
          Most universities now offer a 4-semester programme.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Duration",      value: "2 years",         sub: "4 semesters"          },
          { label: "Level",         value: "Postgraduate",    sub: "UGC & AICTE approved"  },
          { label: "Who can apply", value: "BCA / BSc grads", sub: "+ BE / BTech eligible" },
        ].map((item) => (
          <div key={item.label} className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600 mb-1">{item.label}</p>
            <p className="text-base font-bold text-cyan-900">{item.value}</p>
            <p className="text-[11px] text-cyan-600 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-amber-600 mb-3">MCA vs MBA vs MTech</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { name: "MCA",   focus: "Software & tech",  path: "IT, product, government" },
            { name: "MBA",   focus: "Management & biz", path: "Consulting, BFSI, ops"   },
            { name: "MTech", focus: "Core engineering", path: "R&D, PSU, academia"      },
          ].map((item) => (
            <div key={item.name} className={`rounded-xl p-3 border-2 ${item.name === "MCA" ? "bg-amber-50 border-amber-300" : "bg-gray-50 border-gray-100"}`}>
              <p className={`text-base font-extrabold mb-1 ${item.name === "MCA" ? "text-amber-700" : "text-gray-400"}`}>{item.name}</p>
              <p className="text-[11px] text-gray-600 font-medium">{item.focus}</p>
              <p className="text-[10px] text-gray-400 mt-1">{item.path}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyPanel() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">The case for MCA</p>
        <div className="h-0.5 w-12 bg-amber-500 mb-3" />
        <p className="text-gray-600 max-w-2xl">
          MCA makes sense for specific students. Here is an honest breakdown — why it is worth it, and for whom.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WHY_POINTS.map((pt) => (
          <div key={pt.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <span className="text-2xl mb-3 block">{pt.icon}</span>
            <p className="text-sm font-bold text-cyan-900 mb-2">{pt.title}</p>
            <p className="text-[13px] text-gray-600 leading-relaxed">{pt.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚠️</span>
          <p className="text-sm font-bold text-cyan-900">Honest reality check</p>
        </div>
        <div className="space-y-2.5">
          {[
            "College tier matters significantly. An NIT or top state university gives far better placement support than a mid-tier private college charging the same fees.",
            "Skills matter more than the degree name. Students who build real projects and complete internships get better outcomes regardless of college.",
            "MCA is not a shortcut to high salaries. It is a foundation that you must build on actively.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <p className="text-[13px] text-gray-600 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamsPanel({ exams, loading }: { exams: JourneyExam[]; loading: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) return (
    <div className="py-12 text-center">
      <div className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-400">Loading exam data…</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">National & State exams</p>
        <div className="h-0.5 w-12 bg-amber-500 mb-3" />
        <p className="text-gray-600 max-w-2xl">
          MCA admissions happen through national, state, and university-level entrance exams.
          Most students apply to 2–3 exams to maximise college options. Click any exam to see details.
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100">
          Exam details are being updated. Check back soon.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exams.map((exam) => (
            <ExamCard key={exam.exam_id} exam={exam}
              expanded={expandedId === exam.exam_id}
              onToggle={() => setExpandedId(expandedId === exam.exam_id ? null : exam.exam_id)}
            />
          ))}
        </div>
      )}

      <div className="bg-cyan-900 rounded-2xl p-5">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-2">Which exams should you apply for?</p>
        <p className="text-[13px] text-cyan-300 leading-relaxed mb-3">
          Maharashtra students must take MAH MCA CET for state college admissions.
          For NITs, NIMCET is the only route. CUET PG covers central universities.
          State exams like TANCET and WB JECA cover good regional colleges.
          Apply to at least 2–3 exams every cycle.
        </p>
        <Link href="/tools/eligibility">
          <button className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-amber-900 px-4 py-2 rounded-xl transition-colors">
            Check your eligibility →
          </button>
        </Link>
      </div>
    </div>
  );
}

function TimelinePanel({ exams, loading }: { exams: JourneyExam[]; loading: boolean }) {
  const liveEvents = exams
    .filter((e) => e.rule_exam_date || e.config_exam_date)
    .map((e) => ({ exam: e.short_name, date: e.rule_exam_date || e.config_exam_date, color: e.color, bg: e.bg_color }));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">Oct → Sep cycle</p>
        <div className="h-0.5 w-12 bg-amber-500 mb-3" />
        <p className="text-gray-600 max-w-2xl">
          The full admission cycle runs from October to September. Here is the typical sequence —
          exact dates vary by exam and year. Do not wait for one result before applying elsewhere.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {STATIC_TIMELINE.map((item, i) => (
          <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl border-2 ${TIMELINE_STYLES[item.type]}`}>
            <span className="text-[11px] font-bold w-20 shrink-0">{item.phase}</span>
            <span className="text-[13px] font-medium flex-1">{item.event}</span>
          </div>
        ))}
      </div>

      {!loading && liveEvents.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
            This cycle — exam dates
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {liveEvents.map((ev) => (
              <div key={ev.exam} className="flex items-center gap-3 p-3 rounded-xl border-2"
                style={{ borderColor: ev.bg, backgroundColor: ev.bg }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white" style={{ color: ev.color }}>
                  {ev.exam}
                </span>
                <span className="text-[13px] text-gray-700 font-medium">{ev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span>💡</span>
          <p className="text-sm font-bold text-cyan-900">Key tip</p>
        </div>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          Keep all documents ready — marksheets, ID proof, and passport photos.
          Application windows overlap heavily. Having everything prepared means you can apply to
          multiple exams in one sitting.
        </p>
      </div>
    </div>
  );
}

function McaLifePanel() {
  const [openSem, setOpenSem] = useState(0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">The 2-year programme</p>
        <div className="h-0.5 w-12 bg-amber-500 mb-3" />
        <p className="text-gray-600 max-w-2xl">
          Here is what the 2-year MCA programme typically looks like. The exact syllabus varies
          by university — but the structure below is broadly common.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {MCA_SEMESTERS.map((sem, i) => (
          <div
            key={i}
            onClick={() => setOpenSem(openSem === i ? -1 : i)}
            className={`border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200
              ${openSem === i ? "border-purple-300 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${openSem === i ? "bg-purple-700 text-white" : "bg-cyan-50 text-amber-500"}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-cyan-900">{sem.sem}</p>
                <p className={`text-xs font-semibold mt-0.5 ${openSem === i ? "text-purple-600" : "text-gray-400"}`}>{sem.label}</p>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSem === i ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openSem === i && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <p className="text-[13px] text-amber-700 font-semibold mb-3 mt-3 border-l-2 border-amber-300 pl-3">
                  {sem.focus}
                </p>
                <div className="flex flex-col gap-1.5">
                  {sem.subjects.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span className="text-[13px] text-gray-600">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
          What actually decides your placement
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            { rank: "#1", item: "Projects",   sub: "1–2 strong GitHub projects"      },
            { rank: "#2", item: "Internship", sub: "Even 1 internship changes outcomes" },
            { rank: "#3", item: "DSA / CP",   sub: "LeetCode, competitive programming" },
          ].map((item) => (
            <div key={item.rank} className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
              <p className="text-xl font-black text-amber-500 mb-1">{item.rank}</p>
              <p className="text-sm font-bold text-cyan-900">{item.item}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerPanel({ salary, loading }: { salary: JourneySalarySnapshot[]; loading: boolean }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">Life after MCA</p>
        <div className="h-0.5 w-12 bg-amber-500 mb-3" />
        <p className="text-gray-600 max-w-2xl">
          After MCA you have multiple directions. Software development is most common, but data,
          cloud, security, government IT, and higher studies are all real and viable paths.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {CAREER_PATHS.map((cp) => (
          <div key={cp.path}
            className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-white
                       border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-cyan-900">{cp.path}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{cp.roles}</p>
            </div>
            <p className="text-[11px] text-gray-400 shrink-0 sm:text-right">{cp.companies}</p>
          </div>
        ))}
      </div>

      {!loading && salary.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
            Salary ranges by specialisation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {salary.map((item) => (
              <div key={item.specialisation}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <p className="text-sm font-bold text-cyan-900 mb-3">{item.specialisation}</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Entry",  val: item.entry_salary,  color: "text-blue-600"  },
                    { label: "Mid",    val: item.mid_salary,    color: "text-amber-600" },
                    { label: "Senior", val: item.senior_salary, color: "text-green-600" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">{row.label}</span>
                      <span className={`text-xs font-bold font-mono ${row.color}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
                  {item.tier_label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Ranges shown for the top college tier. Private college outcomes are lower.
            Individual results depend on skills, projects, and location.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/tools/salary" className="flex-1">
          <button className="w-full bg-amber-500 hover:bg-amber-400 text-amber-900 text-sm font-bold py-3 rounded-xl transition-colors">
            Open Salary Calculator →
          </button>
        </Link>
        <Link href="/tools/eligibility" className="flex-1">
          <button className="w-full bg-cyan-900 hover:bg-cyan-800 text-white text-sm font-bold py-3 rounded-xl transition-colors">
            Check Your Eligibility →
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Mobile stage sheet ───────────────────────────────────────────────────────

function MobileStageSheet({
  open,
  onClose,
  stageIndex,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  stageIndex: number;
  onSelect: (i: number) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full bg-[#f8f7f4] rounded-t-3xl shadow-2xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-0.5">Jump to stage</p>
            <h2 className="text-base font-bold text-cyan-900">All Stages</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stages list */}
        <nav className="px-4 py-3">
          {STAGES.map((s, i) => {
            const c = COLOR[s.color];
            const done   = i < stageIndex;
            const active = i === stageIndex;
            return (
              <button
                key={s.id}
                onClick={() => { onSelect(i); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left mb-1 transition-all
                  ${active ? `${c.bg} border-2 ${c.border}` : "hover:bg-white"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0
                  ${done   ? `${c.dot} text-white`           : ""}
                  ${active ? `${c.dot} text-white`           : ""}
                  ${!done && !active ? "bg-gray-100 text-gray-400" : ""}`}
                >
                  {done ? "✓" : s.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${active ? c.text : done ? "text-gray-600" : "text-gray-400"}`}>
                    {s.label}
                  </p>
                  <p className="text-[11px] text-gray-400">{s.phase}</p>
                </div>
                {active && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400 text-center">Tap any stage to jump there</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MCAJourneyPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    mcaToolsService.getJourneyData()
      .then(setJourneyData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const exams  = journeyData?.exams           ?? [];
  const salary = journeyData?.salary_snapshot ?? [];

  const stage   = STAGES[stageIndex];
  const c       = COLOR[stage.color];
  const isFirst = stageIndex === 0;
  const isLast  = stageIndex === STAGES.length - 1;

  const prev = () => setStageIndex((i) => Math.max(0, i - 1));
  const next = () => setStageIndex((i) => Math.min(STAGES.length - 1, i + 1));

  return (
    <main className="min-h-screen bg-[#f8f7f4]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-cyan-950 relative overflow-hidden">
        {/* Radial glows */}
       <div className="pointer-events-none absolute inset-0">
            {/* Deep space */}
            <div className="absolute inset-0 bg-[#020617]" />
            {/* Cyan nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
            {/* Green nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
            {/* Soft atmospheric diffusion */}
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* ── Stars ── */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            {STARS.map((s) => (
              <span
                key={s.id}
                className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.w,
                  height: s.w,
                  opacity: s.opacity,
                }}
              />
            ))}
          </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30
                          bg-amber-500/10 text-amber-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-5">
            Complete Roadmap · {new Date().getFullYear()}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3">
            The Complete{" "}
            <span className="text-amber-400">MCA Journey</span>
          </h1>
          <div className="h-0.5 w-16 bg-amber-500 mb-4" />
          <p className="text-white/50 text-sm max-w-xl leading-relaxed">
            6 stages from eligibility check to career — honest, practical, and backed by real data.
          </p>

          {/* Stage pills — hero preview */}
          <div className="flex flex-wrap gap-2 mt-7">
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
                  transition-all
                  ${i === stageIndex
                    ? "bg-amber-500 text-amber-900"
                    : "bg-white/10 text-white/50 border border-white/10"
                  }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky progress nav ──────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">

          {/* Desktop dots + connector */}
          <div className="hidden sm:flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 mx-5" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5
                         bg-gradient-to-r from-cyan-600 to-amber-500 transition-all duration-500 mx-5"
              style={{
                width: `calc(${(stageIndex / (STAGES.length - 1)) * 100}% - 2.5rem + ${stageIndex === STAGES.length - 1 ? "1.25rem" : "0px"})`,
              }}
            />
            {STAGES.map((s, i) => {
              const sc     = COLOR[s.color];
              const done   = i < stageIndex;
              const active = i === stageIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setStageIndex(i)}
                  className="relative z-10 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                    text-sm transition-all duration-300
                    ${done   ? `${sc.dot} border-transparent text-white shadow-sm` : ""}
                    ${active ? `bg-white ${sc.dot.replace("bg-", "border-")} ring-4 ${sc.ring} scale-110` : ""}
                    ${!done && !active ? "bg-white border-gray-200 text-gray-400 hover:border-gray-300" : ""}`}
                  >
                    {done ? "✓" : s.icon}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors
                    ${active ? sc.text : done ? "text-gray-500" : "text-gray-300"}`}>
                    {s.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile — compact current stage + open sheet button */}
          <div className="flex sm:hidden items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${c.dot} text-white`}>
                {stage.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400">{stage.phase}</p>
                <p className="text-sm font-bold text-cyan-900">{stage.label}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSheet(true)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full
                         border ${c.border} ${c.bg} ${c.text}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
              </svg>
              All stages
            </button>
          </div>

          {/* Stage label row (desktop) */}
          <div className="hidden sm:flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                Stage {stageIndex + 1} of {STAGES.length}
              </span>
              <span className="text-xs font-semibold text-gray-600">{stage.label}</span>
            </div>
            <span className="text-[11px] text-gray-400">{stage.phase}</span>
          </div>

          {/* Mobile progress bar */}
          <div className="sm:hidden mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Stage content ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">

        {/* Stage header card */}
        <div className={`rounded-2xl border-2 p-5 mb-7 ${c.bg} ${c.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stage.icon}</span>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${c.text} opacity-60`}>
                  {stage.phase}
                </p>
                <h2 className={`text-xl font-bold ${c.text}`}>{stage.label}</h2>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/60 ${c.text}`}>
              {stageIndex + 1} / {STAGES.length}
            </span>
          </div>
        </div>

        {/* Panel */}
        {stage.id === "what"     && <WhatPanel />}
        {stage.id === "why"      && <WhyPanel />}
        {stage.id === "exams"    && <ExamsPanel exams={exams} loading={loading} />}
        {stage.id === "timeline" && <TimelinePanel exams={exams} loading={loading} />}
        {stage.id === "mca-life" && <McaLifePanel />}
        {stage.id === "career"   && <CareerPanel salary={salary} loading={loading} />}

        {/* ── Prev / Next ── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={prev}
            disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all
              ${isFirst
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {isFirst ? "Start" : STAGES[stageIndex - 1].label}
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStageIndex(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer
                  ${i === stageIndex ? `w-5 h-2 ${c.dot}` : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={isLast}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${isLast
                ? "border border-gray-100 text-gray-300 cursor-not-allowed"
                : `${c.btn} text-white shadow-sm`}`}
          >
            {isLast ? "Done" : STAGES[stageIndex + 1].label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-14">
        <StartJourneyCard />
      </div>

      {/* ── Mobile stage sheet ── */}
      <MobileStageSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        stageIndex={stageIndex}
        onSelect={setStageIndex}
      />
    </main>
  );
}