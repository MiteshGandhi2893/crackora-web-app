"use client";

import { useEffect, useState } from "react";
import {
  mcaToolsService,
  type SalarySpecialisation,
  type SalaryResult,
} from "@/services/mca-tools.service";
import { useLoader } from "@/providers/LoadingProvider";

export function SalaryCalculatorTool() {
  const { showLoader, hideLoader } = useLoader();

  const [specialisations, setSpecialisations] = useState<SalarySpecialisation[]>([]);
  const [dataLoading, setDataLoading]         = useState(true);

  // "tier_label" in controller terms = the career track (Full Stack, DS/ML…)
  const [selectedLabel, setSelectedLabel]     = useState("");
  // "specialisation" in controller terms = the role track (MERN, Java…)
  const [selectedRole, setSelectedRole]       = useState("");

  const [result, setResult]         = useState<SalaryResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  // ── Load on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    mcaToolsService
      .getSalaryData()
      .then(({ tiers }) => {
        setSpecialisations(tiers ?? []);
        if (tiers?.length > 0) {
          setSelectedLabel(tiers[0].label);
          setSelectedRole(tiers[0].specialisations?.[0]?.specialisation ?? "");
        }
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentSpec = specialisations.find((s) => s.label === selectedLabel);
  const roles       = currentSpec?.specialisations ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSpecChange = (label: string) => {
    setSelectedLabel(label);
    setResult(null);
    setCalculated(false);
    const spec = specialisations.find((s) => s.label === label);
    setSelectedRole(spec?.specialisations?.[0]?.specialisation ?? "");
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setResult(null);
    setCalculated(false);
  };

  const handleCalculate = async () => {
    if (!selectedLabel || !selectedRole) return;
    showLoader();
    try {
      // Payload keys must match controller: tier_label + specialisation
      const data = await mcaToolsService.calculateSalary({
        tier_label:     selectedLabel,
        specialisation: selectedRole,
      });
      setResult(data);
      setCalculated(true);
    } catch (e) {
      console.error(e);
    } finally {
      hideLoader();
    }
  };

  const handleReset = () => {
    setResult(null);
    setCalculated(false);
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (dataLoading) return (
    <div className="py-8 text-center text-sm text-gray-400">Loading salary data…</div>
  );

  if (!specialisations.length) return (
    <div className="py-8 text-center text-sm text-gray-400">No salary data available yet.</div>
  );

  return (
    <div className="space-y-4">

      {/* ── Selectors ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            Specialisation
          </label>
          <select
            value={selectedLabel}
            onChange={(e) => handleSpecChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                       text-gray-700 outline-none focus:border-amber-400 bg-white"
          >
            {specialisations.map((s) => (
              <option key={s.id} value={s.label}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            Role Track
          </label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                       text-gray-700 outline-none focus:border-amber-400 bg-white"
          >
            {roles.map((r) => (
              <option key={r.specialisation} value={r.specialisation}>
                {r.specialisation}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Specialisation description ─────────────────────────────────── */}
      {currentSpec?.description && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          {currentSpec.icon} {currentSpec.description}
        </p>
      )}

      {/* ── CTA row ───────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl
                     text-sm font-semibold transition-all hover:scale-[1.01] cursor-pointer"
        >
          Calculate Expected Salary →
        </button>
        {calculated && (
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200
                       text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Result ────────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-3">

          {/* Salary bands — result fields are entry / mid / senior */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { label: "Entry Level", sub: "0–2 years", val: result.entry,  bg: "bg-blue-50 border-blue-100",   text: "text-blue-800",  icon: "🌱" },
              { label: "Mid Level",   sub: "3–5 years", val: result.mid,    bg: "bg-amber-50 border-amber-100", text: "text-amber-800", icon: "🚀" },
              { label: "Senior",      sub: "5+ years",  val: result.senior, bg: "bg-green-50 border-green-100", text: "text-green-800", icon: "⭐" },
            ] as const).map((item) => (
              <div key={item.label} className={`border rounded-xl p-3 text-center ${item.bg}`}>
                <p className="text-lg mb-1">{item.icon}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wide opacity-70 ${item.text}`}>
                  {item.label}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${item.text}`}>{item.val}</p>
                <p className={`text-[10px] opacity-60 mt-0.5 ${item.text}`}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Career progression */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2">
              Career progression
            </p>
            <div className="space-y-1">
              {[
                { yr: "Year 1–2", role: "Junior / Entry roles",    note: result.entry  },
                { yr: "Year 3–5", role: "Mid-level / Tech Lead",   note: result.mid    },
                { yr: "Year 5+",  role: "Senior / Architect",      note: result.senior },
              ].map((row) => (
                <div key={row.yr} className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400 w-16 shrink-0">{row.yr}</span>
                  <span className="text-gray-600 flex-1">{row.role}</span>
                  <span className="text-amber-700 font-semibold">{row.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typical titles */}
          {result.typical_titles && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2">
                Typical job titles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.typical_titles.split(",").map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-white border border-gray-200 text-gray-600
                               rounded-full px-2.5 py-0.5"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top companies */}
          {result.top_companies && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2">
                Top hiring companies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.top_companies.split(",").map((co) => (
                  <span
                    key={co}
                    className="text-[11px] bg-amber-50 border border-amber-100 text-amber-800
                               rounded-full px-2.5 py-0.5 font-medium"
                  >
                    {co.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}