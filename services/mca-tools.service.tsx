/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";

// ─── Existing types ───────────────────────────────────────────────────────────

export interface EligibilityRule {
  exam_id:          string;
  full_name:        string;
  slug:             string;
  short_name:       string;
  color:            string;
  bg_color:         string;
  border_color:     string;
  min_pct_general:  number;
  min_pct_reserved: number;
  streams:          string[];
  math_req:         boolean;
  math_level:       string;
  seats:            string;
  states:           string;
  note:             string;
  exam_date:        string;
}

export interface EligibilityCheckResult {
  eligible:      EligibilityRule[];
  total_checked: number;
}

// ─── Salary types — wired to actual controller response shapes ────────────────

/**
 * One role inside a specialisation as returned by GET /mca-tools/salary.
 * Controller maps mca_salary_roles → { specialisation, entry, mid, senior, ... }
 */
export interface SalaryRole {
  specialisation: string;   // role_track value, e.g. "React / Node.js (MERN)"
  entry:          string;   // "₹3–7 LPA"
  mid:            string;   // "₹8–15 LPA"
  senior:         string;   // "₹16–30 LPA"
  typical_titles: string;
  top_companies:  string;
}

/**
 * One career-track specialisation as returned by GET /mca-tools/salary.
 * Controller returns these under the key "tiers" (kept for back-compat).
 * Each item's roles live under the key "specialisations".
 */
export interface SalarySpecialisation {
  id:              string;
  label:           string;        // "Full Stack Development"
  icon:            string;        // "💻"
  description:     string;
  sort_order:      number;
  data_source:     string;
  verified_on:     string;        // ISO date
  specialisations: SalaryRole[];  // role tracks within this career track
}

/** Shape returned by GET /mca-tools/salary */
export interface SalaryData {
  tiers: SalarySpecialisation[];
}

/**
 * Payload for POST /mca-tools/calculate-salary.
 * Controller reads req.body.tier_label + req.body.specialisation.
 */
export interface CalculateSalaryPayload {
  tier_label:     string;   // e.g. "Full Stack Development"
  specialisation: string;   // e.g. "React / Node.js (MERN)"
}

/**
 * Shape returned by POST /mca-tools/calculate-salary.
 * Fields match the raw SQL column aliases in the controller.
 */
export interface SalaryResult {
  specialisation: string;   // role_track
  entry:          string;
  mid:            string;
  senior:         string;
  typical_titles: string;
  top_companies:  string;
  tier_label:     string;   // specialisation label
  icon:           string;
  description:    string;
}

// ─── Journey types ────────────────────────────────────────────────────────────

export interface JourneyExam {
  exam_id:          string;
  full_name:        string;
  slug:             string;
  short_name:       string;
  color:            string;
  bg_color:         string;
  border_color:     string;
  official_url:     string;
  config_exam_date: string;
  conductor:        string;
  reg_start:        string;
  reg_end:          string;
  result_date:      string;
  icon:             string;
  min_pct_general:  number;
  min_pct_reserved: number;
  streams:          string[];
  math_req:         boolean;
  math_level:       string;
  seats:            string;
  states:           string;
  note:             string;
  rule_exam_date:   string;
}

export interface JourneySalarySnapshot {
  specialisation: string;
  entry_salary:   string;
  mid_salary:     string;
  senior_salary:  string;
  tier_label:     string;
}

export interface JourneyData {
  exams:           JourneyExam[];
  salary_snapshot: JourneySalarySnapshot[];
}

// ─── College predictor types ──────────────────────────────────────────────────

export type ExamKey     = 'nimcet' | 'mah';
export type Category    = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
export type CollegeTier = 'S' | 'A' | 'B';

export type CutoffMap = Partial<Record<Category, Partial<Record<number, number>>>>;

export interface AnalyserCollege {
  name   : string;
  state  : string;
  city   : string | null;
  tier   : CollegeTier;
  seats  : number | null;
  fees   : string | null;
  cutoffs: CutoffMap;
}

export interface CollegesByExamResult {
  exam      : ExamKey;
  input_type: 'rank' | 'percentile';
  colleges  : AnalyserCollege[];
}

export interface CollegeResult {
  name    : string;
  state   : string;
  city    : string | null;
  tier    : CollegeTier;
  seats   : number | null;
  fees    : string | null;
  cutoff  : number;
  category: Category;
  year    : number;
}

export interface PredictCollegesResult {
  exam       : ExamKey;
  input_type : 'rank' | 'percentile';
  input_value: number;
  category   : Category;
  year       : number;
  total      : number;
  colleges   : CollegeResult[];
}

export interface ExamPatternSection {
  name : string;
  q    : number;
  marks: number;
}

export interface ExamPattern {
  sections : ExamPatternSection[];
  marking  : string;
  total    : number;
  duration?: string;
}

export interface ExamMeta {
  key        : ExamKey;
  examId     : string;
  shortName  : string;
  fullName   : string;
  inputType  : 'rank' | 'percentile';
  maxInput   : number;
  inputLabel : string;
  color      : string;
  bgColor    : string;
  borderColor: string;
  categories : Category[];
  years      : number[];
  pattern    : ExamPattern;
  conductor  : string;
  officialUrl: string;
  examDate   : string;
  regStart   : string;
  regEnd     : string;
  resultDate : string;
}

export interface PredictRankResult {
  exam            : ExamKey;
  score           : number;
  predicted_rank  : { min: number; max: number; label: string };
  colleges_preview: Pick<CollegeResult, 'name' | 'state' | 'tier' | 'fees' | 'cutoff'>[];
  note            : string;
}

// ─── College Compare types ────────────────────────────────────────────────────

export interface CompareCollege {
  name             : string;
  city             : string | null;
  state            : string;
  tier             : CollegeTier;
  seats            : number | null;
  fees             : string | null;
  cutoffs          : CutoffMap;
  college_type     : string | null;
  naac_grade       : string | null;
  official_website : string | null;
  duration_years   : number | null;
  admission_process: string | null;
  syllabus_overview: string | null;
  seats_general    : number | null;
  seats_obc        : number | null;
  seats_sc         : number | null;
  seats_st         : number | null;
  avg_lpa          : number | null;
  highest_lpa      : number | null;
  placement_perc   : number | null;
  top_companies    : string | null;
}

export interface CompareCollegesResult {
  exam      : ExamKey;
  input_type: 'rank' | 'percentile';
  colleges  : CompareCollege[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function unwrap<T>(
  promise: Promise<{ success: boolean; data?: T; error?: string }>
): Promise<T> {
  const res = await promise;
  if (!res.success || res.data === undefined) {
    throw new Error(res.error || "Request failed");
  }
  return res.data as T;
}

function parseCutoffMap(raw: any): CutoffMap {
  return Object.fromEntries(
    Object.entries(raw ?? {}).map(([cat, yearMap]) => [
      cat,
      Object.fromEntries(
        Object.entries(yearMap as Record<string, any>).map(([yr, val]) => [yr, Number(val)])
      ),
    ])
  ) as CutoffMap;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const mcaToolsService = {

  // ── Eligibility ───────────────────────────────────────────────────────────

  getEligibilityRules: (): Promise<EligibilityRule[]> =>
    unwrap(apiService.get<EligibilityRule[]>("/mca-tools/eligibility")),

  checkEligibility: (payload: {
    stream:     string;
    percentage: number;
    has_maths:  boolean;
  }): Promise<EligibilityCheckResult> =>
    unwrap(apiService.post<EligibilityCheckResult>("/mca-tools/check-eligibility", payload)),

  // ── Salary ────────────────────────────────────────────────────────────────

  /**
   * GET /mca-tools/salary
   * Returns { tiers: SalarySpecialisation[] }.
   * Each specialisation's role tracks live under the key "specialisations".
   */
  getSalaryData: (): Promise<SalaryData> =>
    unwrap(apiService.get<SalaryData>("/mca-tools/salary")),

  /**
   * POST /mca-tools/calculate-salary
   * Payload keys must match controller: tier_label + specialisation.
   * Response fields: entry / mid / senior (not entry_salary etc.).
   */
  calculateSalary: (payload: CalculateSalaryPayload): Promise<SalaryResult> =>
    unwrap(apiService.post<SalaryResult>("/mca-tools/calculate-salary", payload)),

  // ── Journey ───────────────────────────────────────────────────────────────

  getJourneyData: (): Promise<JourneyData> =>
    unwrap(apiService.get<JourneyData>("/mca-tools/journey")),

  // ── College predictor ─────────────────────────────────────────────────────

  getExamMeta: (): Promise<ExamMeta[]> =>
    unwrap(apiService.get<ExamMeta[]>("/mca-tools/exam-meta")),

 predictColleges: async (payload: {
  exam    : ExamKey;
  value   : number;
  category: Category;
}): Promise<PredictCollegesResult> => {
  const res = await unwrap(apiService.post<PredictCollegesResult>("/mca-tools/predict-colleges", payload));
  return {
    ...res,
    colleges: res.colleges.map((c: any) => ({ ...c, cutoff: Number(c.cutoff) })),
  };
},

  getCollegesByExam: async (exam: ExamKey): Promise<CollegesByExamResult> => {
    const res = await unwrap(apiService.get<CollegesByExamResult>(`/mca-tools/colleges/${exam}`));
    return {
      ...res,
      colleges: res.colleges.map((c: any) => ({
        ...c,
        cutoffs: parseCutoffMap(c.cutoffs),
      })),
    };
  },

  predictRank: async (payload: {
    exam : 'nimcet';
    score: number;
  }): Promise<PredictRankResult> => {
    const res = await unwrap(apiService.post<PredictRankResult>("/mca-tools/predict-rank", payload));
    return {
      ...res,
      colleges_preview: res.colleges_preview.map((c: any) => ({ ...c, cutoff: Number(c.cutoff) })),
    };
  },

  // ── College Compare ───────────────────────────────────────────────────────

  getCompareColleges: async (exam: ExamKey): Promise<CompareCollegesResult> => {
    const res = await unwrap(
      apiService.get<CompareCollegesResult>(`/mca-tools/compare-colleges/${exam}`)
    );
    return {
      ...res,
      colleges: res.colleges.map((c: any) => ({
        ...c,
        fees          : c.fees          != null ? String(c.fees)          : null,
        avg_lpa       : c.avg_lpa       != null ? Number(c.avg_lpa)       : null,
        highest_lpa   : c.highest_lpa   != null ? Number(c.highest_lpa)   : null,
        placement_perc: c.placement_perc != null ? Number(c.placement_perc) : null,
        cutoffs       : parseCutoffMap(c.cutoffs),
      })),
    };
  },
};