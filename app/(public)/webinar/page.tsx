/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
// app/webinar/page.tsx — Crackora Webinar Registration Page
// All webinar data is fetched from the backend. Nothing is hardcoded here.

import { useState, useEffect } from "react";
import { STARS } from "@/lib/util";
import { apiService } from "@/services/api.service";

type AttendeeType = "aspirant" | "current_student" | "working_professional";

interface Webinar {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  host_name: string;
  host_role: string | null;
  host_bio: string | null;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  is_free: boolean;
  price: string;
  meeting_platform: string;
  topics: string[];
  tags: string[];
  thumbnail_url: string | null;
  max_seats: number | null;
  seats_filled: number;
  status: "published" | "completed";
}

interface FormState {
  full_name: string;
  mobile: string;
  email: string;
  attendee_type: AttendeeType | "";
  biggest_doubt: string;
}

const ATTENDEE_OPTIONS: { value: AttendeeType; label: string; emoji: string }[] = [
  { value: "aspirant",             label: "MCA Aspirant",          emoji: "🎯" },
  { value: "current_student",      label: "Current MCA Student",   emoji: "📚" },
  { value: "working_professional", label: "Working Professional",  emoji: "💼" },
];

function formatDate(isoString: string, tz = "Asia/Kolkata") {
  return new Date(isoString).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    timeZone: tz,
  });
}

function formatTime(isoString: string, tz = "Asia/Kolkata") {
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", timeZone: tz,
  }) + " IST";
}

function seatsLeft(w: Webinar) {
  if (!w.max_seats) return null;
  return w.max_seats - w.seats_filled;
}

export default function WebinarPage() {
  const [upcoming, setUpcoming] = useState<Webinar[]>([]);
  const [past,     setPast]     = useState<Webinar[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const webinar = upcoming.find((w) => w.id === selectedId) ?? upcoming[0] ?? null;

  const [form, setForm] = useState<FormState>({
    full_name: "", mobile: "", email: "", attendee_type: "", biggest_doubt: "",
  });
  const [status,      setStatus]      = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg,    setErrorMsg]    = useState("");
  const [successData, setSuccessData] = useState<{ name: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [upRes, pastRes] = await Promise.all([
          apiService.get<{ webinars: Webinar[] }>("/webinars/upcoming"),
          apiService.get<{ webinars: Webinar[] }>("/webinars/past"),
        ]);
        const up   = upRes.data?.webinars   ?? [];
        const done = pastRes.data?.webinars ?? [];
        setUpcoming(up);
        setPast(done);
        if (up.length > 0) setSelectedId(up[0].id);
      } catch { /* empty state handled below */ }
      finally { setLoading(false); }
    })();
  }, []);

  const update = (f: keyof FormState, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const selectWebinar = (id: string) => {
    setSelectedId(id);
    setStatus("idle"); setErrorMsg(""); setSuccessData(null);
    setForm({ full_name: "", mobile: "", email: "", attendee_type: "", biggest_doubt: "" });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!webinar) return;
    if (!form.attendee_type) { setErrorMsg("Please select who you are."); return; }
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await apiService.post(`/webinars/${webinar.id}/register`, {
        full_name: form.full_name, mobile: form.mobile,
        email: form.email, attendee_type: form.attendee_type,
        biggest_doubt: form.biggest_doubt,
      });
      if (!res.success) {
        setErrorMsg(typeof res.error === "string" ? res.error : "Please check your details and try again.");
        setStatus("error"); return;
      }
      setSuccessData({ name: res.data.data.name });
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-[#f8f7f4]flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Loading webinars...</p>
      </div>
    </main>
  );

  if (status === "success" && successData && webinar) return (
    <main className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 shadow border-amber-500 flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-amber-700 mb-2">You&apos;re In!</h2>
        <p className="text-gray-700 mb-1">Hey <span className="text-amber-600 font-semibold">{successData.name}</span>, your spot is confirmed.</p>
        <p className="text-gray-500 text-sm mb-4">We&apos;ll send the webinar link on your WhatsApp &amp; email before the session.</p>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5 text-left shadow">
          <p className="text-amber-700 font-semibold text-sm mb-1">📲 Meeting link coming soon!</p>
          <p className="text-gray-600 text-xs leading-relaxed">
            The {webinar.meeting_platform} link will be sent at least <span className="text-amber-700 font-medium">30 minutes before</span> the session.
          </p>
        </div>
        <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4 text-left mb-6 shadow">
          <p className="text-amber-700 font-semibold text-sm mb-2">{webinar.title}</p>
          <p className="text-amber-800 text-sm mb-1">📅 {formatDate(webinar.scheduled_at, webinar.timezone)}</p>
          <p className="text-gray-500 text-sm">⏰ {formatTime(webinar.scheduled_at, webinar.timezone)}</p>
          <p className="text-cyan-800 text-sm mt-1">🎤 {webinar.host_role ? ` — ${webinar.host_role}` : ""}</p>
        </div>
        <a href="/" className="inline-block px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors">Back to Crackora</a>
      </div>
    </main>
  );

  const hasUpcoming = upcoming.length > 0;

  return (
    <main className="min-h-screen bg-[#020617]">
      {/* Hero */}
      <div className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(20,83,45,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {STARS.map((s) => (
            <span key={s.id} className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
              style={{ top: s.top, left: s.left, width: s.w, height: s.w, opacity: s.opacity }} />
          ))}
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 sm:py-30">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-amber-600 text-[11px] font-bold tracking-widest uppercase border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-full">
              FREE Webinar{upcoming.length > 1 ? "s" : ""}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 text-[11px]">Live · Google Meet</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 text-[11px]">No cost · No recording sold</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-500 leading-tight mb-3 max-w-3xl">
            {!hasUpcoming ? "MCA Webinars by Crackora" : upcoming.length === 1 ? upcoming[0].title : "Upcoming MCA Webinars"}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl">
            {!hasUpcoming
              ? "Free live sessions by Crackora mentors. New sessions are announced regularly — check back soon!"
              : upcoming.length === 1 ? (upcoming[0].subtitle ?? "")
              : "Free live sessions by Crackora mentors. Pick the one that's right for you and register below."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f8f7f4] min-h-[calc(100vh-220px)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12">

          {/* No upcoming */}
          {!hasUpcoming && (
            <div className="mb-10">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm max-w-xl mx-auto">
                <div className="text-5xl mb-4">📭</div>
                <h2 className="text-gray-800 font-bold text-xl mb-2">No free webinars scheduled right now</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  We run free sessions regularly. Follow us or check back soon — the next webinar will be announced here.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="https://chat.whatsapp.com/YOUR_COMMUNITY_LINK" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors">
                    💬 Join WhatsApp Community
                  </a>
                  <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors">
                    Explore Crackora
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming */}
          {hasUpcoming && webinar && (
            <>
              {upcoming.length > 1 && (
                <div className="mb-8">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">Choose a session</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {upcoming.map((w) => {
                      const left = seatsLeft(w);
                      return (
                        <button key={w.id} onClick={() => selectWebinar(w.id)}
                          className={`flex-1 text-left px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedId === w.id ? "border-amber-500 bg-white shadow-md shadow-amber-100" : "border-gray-200 bg-white/60 hover:border-amber-300 hover:bg-white"
                          }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`font-bold text-sm leading-tight ${selectedId === w.id ? "text-amber-600" : "text-gray-700"}`}>{w.title}</p>
                              {w.subtitle && <p className="text-gray-500 text-[11px] mt-0.5">{w.subtitle}</p>}
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                {w.is_free ? "FREE" : `₹${parseFloat(w.price).toFixed(0)}`}
                              </span>
                              {left !== null && left <= 10 && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">{left} seats left</span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-400 text-[10px] mt-2">📅 {formatDate(w.scheduled_at, w.timezone)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left — info */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                      <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider">
                        {webinar.is_free ? "Free" : `₹${parseFloat(webinar.price).toFixed(0)}`} · Live Session
                      </span>
                    </div>
                    {upcoming.length > 1 && (
                      <h2 className="text-gray-900 text-xl sm:text-2xl font-bold leading-tight mb-3">
                        {webinar.title}
                        {webinar.subtitle && <span className="block text-amber-600 text-base sm:text-lg font-semibold mt-0.5">{webinar.subtitle}</span>}
                      </h2>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: "📅", text: formatDate(webinar.scheduled_at, webinar.timezone) },
                        { icon: "⏰", text: formatTime(webinar.scheduled_at, webinar.timezone) },
                        { icon: "🎤", text:   (webinar.host_role ? ` ${webinar.host_role}` : "") },
                        { icon: "🖥️", text: webinar.meeting_platform },
                      ].map((c) => (
                        <span key={c.text} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                          {c.icon} {c.text}
                        </span>
                      ))}
                      {seatsLeft(webinar) !== null && (
                        <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg shadow-sm font-semibold">
                          🔥 {seatsLeft(webinar)} seats left
                        </span>
                      )}
                    </div>
                    {webinar.host_bio && <p className="mt-3 text-gray-500 text-xs leading-relaxed">{webinar.host_bio}</p>}
                    {webinar.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {webinar.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {webinar.topics?.length > 0 && (
                    <>
                      <h3 className="text-gray-700 font-semibold text-sm mb-3">What we&apos;ll cover in this session</h3>
                      <div className="space-y-2.5">
                        {webinar.topics.map((topic, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                            <span className="text-amber-500 font-bold text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <span className="text-gray-700 text-sm leading-relaxed">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-amber-700 text-sm font-semibold mb-1">After the webinar</p>
                    <p className="text-gray-600 text-sm">Still have doubts? Book a <span className="text-amber-700 font-semibold">1-on-1 session</span> with the host — available to all attendees at a special rate.</p>
                  </div>
                </div>

                {/* Right — form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-md">
                  <h2 className="text-gray-900 font-bold text-lg mb-1">Reserve your free seat</h2>
                  <div className="h-0.5 w-10 bg-amber-500 rounded-full mb-1" />
                  <p className="text-gray-400 text-[11px] mb-5">
                    Registering for: <span className="text-amber-600 font-semibold">{webinar.title}</span> · {formatDate(webinar.scheduled_at, webinar.timezone)}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-500 text-xs font-medium mb-1.5">Full Name <span className="text-amber-500">*</span></label>
                      <input type="text" placeholder="e.g. Rahul Sharma" value={form.full_name}
                        onChange={(e) => update("full_name", e.target.value)} required maxLength={150}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs font-medium mb-1.5">WhatsApp Number <span className="text-amber-500">*</span></label>
                      <div className="flex">
                        <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-gray-500 text-sm">+91</span>
                        <input type="tel" placeholder="10-digit mobile" value={form.mobile}
                          onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          required pattern="[6-9][0-9]{9}"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-r-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors" />
                      </div>
                      <p className="text-gray-400 text-[11px] mt-1">Webinar link &amp; reminder will be sent here</p>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs font-medium mb-1.5">Email Address <span className="text-amber-500">*</span></label>
                      <input type="email" placeholder="you@email.com" value={form.email}
                        onChange={(e) => update("email", e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs font-medium mb-2">I am a... <span className="text-amber-500">*</span></label>
                      <div className="grid grid-cols-1 gap-2">
                        {ATTENDEE_OPTIONS.map((opt) => (
                          <button type="button" key={opt.value} onClick={() => update("attendee_type", opt.value)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                              form.attendee_type === opt.value ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-300"
                            }`}>
                            <span>{opt.emoji}</span><span>{opt.label}</span>
                            {form.attendee_type === opt.value && <span className="ml-auto text-amber-500">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs font-medium mb-1.5">Your biggest doubt about MCA <span className="text-gray-400">(optional)</span></label>
                      <textarea placeholder="e.g. Is MCA worth it? When should I start DSA prep?"
                        value={form.biggest_doubt} onChange={(e) => update("biggest_doubt", e.target.value)}
                        rows={3} maxLength={500}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors resize-none" />
                      <p className="text-gray-400 text-[11px] mt-1">The host may answer your doubt live 👆</p>
                    </div>
                    {errorMsg && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-sm">{errorMsg}</div>}
                    <button type="submit" disabled={status === "loading"}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg shadow-amber-200">
                      {status === "loading" ? "Registering..." : `Register for ${webinar.is_free ? "Free" : `₹${parseFloat(webinar.price).toFixed(0)}`} →`}
                    </button>
                    <p className="text-gray-400 text-[11px] text-center">No spam · Only the webinar link + 1 reminder</p>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* Past sessions */}
          {past.length > 0 && (
            <div className={hasUpcoming ? "mt-16" : "mt-0"}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-gray-700 font-bold text-base">Past Sessions</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs">{past.length} session{past.length > 1 ? "s" : ""} held</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {past.map((w) => (
                  <div key={w.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm opacity-80">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Session Completed</span>
                      {w.is_free && <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Was Free</span>}
                    </div>
                    <h3 className="text-gray-800 font-bold text-sm leading-tight mb-1">{w.title}</h3>
                    {w.subtitle && <p className="text-gray-400 text-[11px] mb-3">{w.subtitle}</p>}
                    <p className="text-gray-400 text-[11px]">📅 {formatDate(w.scheduled_at, w.timezone)}</p>
                    <p className="text-gray-400 text-[11px]">🎤 {w.host_name}{w.host_role ? ` — ${w.host_role}` : ""}</p>
                    {w.topics?.length > 0 && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="text-gray-500 text-[11px] font-semibold mb-1.5">Topics covered</p>
                        <ul className="space-y-1">
                          {w.topics.slice(0, 3).map((t, i) => (
                            <li key={i} className="text-gray-400 text-[11px] flex items-start gap-1.5">
                              <span className="text-amber-400 mt-0.5 shrink-0">›</span>
                              <span className="line-clamp-1">{t}</span>
                            </li>
                          ))}
                          {w.topics.length > 3 && <li className="text-gray-400 text-[11px]">+{w.topics.length - 3} more topics</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs text-center mt-4">Recordings are not sold. Attend live to get the full value. 🎯</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}