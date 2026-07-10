"use client";

import { useEffect, useState } from "react";
import {
  mcaToolsService,
  type EligibilityRule,
} from "@/services/mca-tools.service";
import { useLoader } from "@/providers/LoadingProvider";

const STREAM_OPTS = [
  "BCA", "BSc CS", "BSc IT", "BSc Maths", "BSc Statistics",
  "BE/BTech", "BCom with Maths", "BCom (no Maths)",
  "BA with Maths", "BA (no Maths)", "BIT", "Other",
];

export function EligibilityCheckerTool() {
  const { showLoader, hideLoader } = useLoader();

  // All rules — loaded once just for total count display
  const [allRules, setAllRules]       = useState<EligibilityRule[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Form
  const [stream, setStream] = useState("");
  const [pct, setPct]       = useState("");
  const [maths, setMaths]   = useState(true);

  // Results
  const [results, setResults] = useState<EligibilityRule[] | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    mcaToolsService
      .getEligibilityRules()
      .then(setAllRules)
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, []);

  const handleCheck = async () => {
    if (!stream || !pct) return;
    showLoader();
    try {
      const res = await mcaToolsService.checkEligibility({
        stream,
        percentage: parseFloat(pct),
        has_maths:  maths,
      });
      // res is EligibilityCheckResult — { eligible: EligibilityRule[], total_checked: number }
      setResults(res.eligible);
      setChecked(true);
    } catch (e) {
      console.error(e);
    } finally {
      hideLoader();
    }
  };

  const handleReset = () => {
    setStream(""); setPct(""); setMaths(true);
    setResults(null); setChecked(false);
  };

  if (dataLoading) return (
    <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
  );

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            Your graduation stream
          </label>
          <select
            value={stream}
            onChange={(e) => { setStream(e.target.value); setChecked(false); setResults(null); }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                       text-gray-700 outline-none focus:border-amber-400 bg-white"
          >
            <option value="">Select stream</option>
            {STREAM_OPTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            Graduation percentage
          </label>
          <input
            type="number" min={40} max={100} step={0.5} placeholder="e.g. 68.5"
            value={pct}
            onChange={(e) => { setPct(e.target.value); setChecked(false); setResults(null); }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                       text-gray-800 placeholder:text-gray-400 outline-none
                       focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox" checked={maths}
          onChange={(e) => { setMaths(e.target.checked); setChecked(false); setResults(null); }}
          className="accent-amber-600 w-4 h-4"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          I had <strong>Mathematics</strong> as a subject in 10+2 or graduation
        </span>
      </label>

      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          disabled={!stream || !pct}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all
            ${stream && pct
              ? "bg-amber-600 hover:bg-amber-500 text-white hover:scale-[1.01] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          Check My Eligibility →
        </button>
        {checked && (
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200
                       text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {results !== null && (
        <div className="space-y-2">
          {results.length > 0 ? (
            <>
              <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                ✓ You qualify for {results.length} out of {allRules.length} exam
                {allRules.length !== 1 ? "s" : ""}
              </p>
              {results.map((rule) => (
                <div key={rule.exam_id} className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: rule.bg_color,
                          color:           rule.color,
                          borderColor:     rule.border_color,
                        }}
                      >
                        {rule.short_name}
                      </span>
                      <span className="text-[11px] text-gray-500">{rule.states}</span>
                      <span className="text-[11px] text-gray-400">·</span>
                      <span className="text-[11px] font-semibold text-gray-600">
                        {rule.seats} seats
                      </span>
                    </div>
                    <span className="text-green-600 text-sm font-bold shrink-0">✓</span>
                  </div>
                  <p className="text-xs text-gray-500">{rule.note}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    📅 {rule.exam_date} · Min %:{" "}
                    {rule.min_pct_general}% (General) / {rule.min_pct_reserved}% (Reserved)
                  </p>
                </div>
              ))}
              {allRules.length - results.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-gray-500">
                    {allRules.length - results.length} exam
                    {allRules.length - results.length > 1 ? "s" : ""} not matching your profile.
                    Change stream or percentage to see more options.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-orange-700">
                No exams match your current profile.
              </p>
              <p className="text-xs text-orange-500 mt-1">
                Most exams need 50%+ with a Maths background. CUET PG is the most
                flexible — it accepts BCom/BA without mandatory Maths.
              </p>
              <a
                href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20eligibility%20guidance%20for%20MCA"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-semibold text-green-700 underline"
              >
                Chat with a mentor free →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}