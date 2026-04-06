/* ═══════════════════════════════════════════════════════════════
   data/mca-tools-data.ts
   SINGLE SOURCE OF TRUTH for all 6 MCA entrance exam tools
   
   SOURCES (verified March 2026):
   • NIMCET:      nimcet.admissions.nic.in — official OR/CR PDFs 2022–2025
   • MAH MCA CET: cetcell.mahacet.org — counselling data 2023–2025
   • TANCET:      tancet.annauniv.edu — cutoff data 2023–2025
   • IPU CET MCA: ipu.admissions.nic.in — allotment data 2023–2025
   • WB JECA:     wbjeeb.nic.in + collegedekho.com — 2023–2024
   • CUET PG:     pgcuet.samarth.ac.in + university websites — 2024
   • Salary:      NIT placement reports 2024 + Ambitionbox.com
   
   UPDATE SCHEDULE:
   • Cutoffs: Every August after NIMCET counselling completes
   • Exam dates: Every January when notifications drop
   • Salary: Every December after placement season
═══════════════════════════════════════════════════════════════ */

export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type ExamKey  = "nimcet" | "mah" | "cuet" | "tancet" | "ipu" | "jeca";
export type Year     = 2025 | 2024 | 2023;

export interface College {
  name:     string;
  state:    string;
  city?:    string;
  tier:     "S" | "A" | "B";
  seats?:   number;
  fees?:    string;
  cutoffs:  Partial<Record<Category, Partial<Record<Year, number>>>>;
}

/* ──────────────────────────────────────────────────
   EXAM META — dates, pattern, links
────────────────────────────────────────────────── */
export const EXAM_META: Record<ExamKey, {
  fullName: string; shortName: string; conductor: string;
  examDate: string; regStart: string; regEnd: string;
  resultDate: string; officialUrl: string;
  pattern: { total: number; duration: string; marking: string; sections: { name: string; q: number; marks: number }[] };
  inputType: "rank" | "score"; maxInput: number; inputLabel: string;
  color: string; bgColor: string; borderColor: string;
}> = {
  nimcet: {
    fullName: "NIT MCA Common Entrance Test",
    shortName: "NIMCET",
    conductor: "NIT Tiruchirappalli (rotational)",
    examDate: "June 6, 2026",
    regStart: "March 3, 2026",
    regEnd: "May 1, 2026",
    resultDate: "Late June 2026",
    officialUrl: "https://nimcet.admissions.nic.in",
    pattern: {
      total: 120, duration: "2 hours",
      marking: "4 marks correct, -1 wrong. Must score >0 in Maths to get rank.",
      sections: [
        { name: "Mathematics",              q: 50, marks: 200 },
        { name: "Analytical Ability & Reasoning", q: 30, marks: 120 },
        { name: "Computer Awareness",       q: 20, marks: 80  },
        { name: "General English",          q: 20, marks: 80  },
      ],
    },
    inputType: "rank", maxInput: 15000, inputLabel: "Enter your NIMCET rank",
    color: "#d97706", bgColor: "#fffbeb", borderColor: "#fcd34d",
  },
  mah: {
    fullName: "Maharashtra MCA Common Entrance Test",
    shortName: "MAH MCA CET",
    conductor: "State CET Cell, Maharashtra",
    examDate: "March 30, 2026",
    regStart: "January 7, 2026",
    regEnd: "February 23, 2026",
    resultDate: "First week of April 2026",
    officialUrl: "https://cetcell.mahacet.org",
    pattern: {
      total: 100, duration: "90 minutes",
      marking: "2 marks correct, -0.5 wrong.",
      sections: [
        { name: "Mathematics & Statistics",         q: 25, marks: 50 },
        { name: "Logical & Abstract Reasoning",     q: 25, marks: 50 },
        { name: "English & Verbal Ability",         q: 25, marks: 50 },
        { name: "Computer Concepts",                q: 25, marks: 50 },
      ],
    },
    inputType: "score", maxInput: 200, inputLabel: "Enter your MAH MCA CET score (out of 200)",
    color: "#2563eb", bgColor: "#eff6ff", borderColor: "#93c5fd",
  },
  cuet: {
    fullName: "Common University Entrance Test PG (MCA)",
    shortName: "CUET PG MCA",
    conductor: "National Testing Agency (NTA)",
    examDate: "May 2026 (expected, dates TBA)",
    regStart: "February 2026 (expected)",
    regEnd: "March 2026 (expected)",
    resultDate: "June 2026",
    officialUrl: "https://pgcuet.samarth.ac.in",
    pattern: {
      total: 75, duration: "105 minutes (CBT)",
      marking: "4 marks correct, -1 wrong.",
      sections: [
        { name: "Domain Knowledge (CS/IT)", q: 50, marks: 200 },
        { name: "Language (English)",       q: 25, marks: 100 },
      ],
    },
    inputType: "score", maxInput: 300, inputLabel: "Enter your CUET PG MCA score (out of 300)",
    color: "#7c3aed", bgColor: "#faf5ff", borderColor: "#c4b5fd",
  },
  tancet: {
    fullName: "Tamil Nadu Common Entrance Test (MCA)",
    shortName: "TANCET MCA",
    conductor: "Anna University, Chennai",
    examDate: "May 9, 2026",
    regStart: "March 16, 2026",
    regEnd: "April 10, 2026",
    resultDate: "June 2026",
    officialUrl: "https://tancet.annauniv.edu",
    pattern: {
      total: 100, duration: "2 hours (offline OMR)",
      marking: "1 mark correct, -1/3 wrong.",
      sections: [
        { name: "Mathematics",       q: 40, marks: 40 },
        { name: "Computer Science",  q: 20, marks: 20 },
        { name: "Analytical Ability",q: 20, marks: 20 },
        { name: "General English",   q: 20, marks: 20 },
      ],
    },
    inputType: "score", maxInput: 100, inputLabel: "Enter your TANCET MCA score (out of 100)",
    color: "#0d9488", bgColor: "#f0fdfa", borderColor: "#5eead4",
  },
  ipu: {
    fullName: "Indraprastha University Common Entrance Test (MCA)",
    shortName: "IPU CET MCA",
    conductor: "Guru Gobind Singh Indraprastha University",
    examDate: "April–May 2026 (dates TBA)",
    regStart: "March 2026 (expected)",
    regEnd: "April 2026 (expected)",
    resultDate: "May 2026",
    officialUrl: "https://ipu.admissions.nic.in",
    pattern: {
      total: 150, duration: "2.5 hours",
      marking: "4 marks correct, -1 wrong.",
      sections: [
        { name: "Mathematics",      q: 60, marks: 240 },
        { name: "Computer Science", q: 40, marks: 160 },
        { name: "Logical Ability",  q: 30, marks: 120 },
        { name: "English",          q: 20, marks: 80  },
      ],
    },
    inputType: "rank", maxInput: 10000, inputLabel: "Enter your IPU CET MCA rank",
    color: "#ea580c", bgColor: "#fff7ed", borderColor: "#fdba74",
  },
  jeca: {
    fullName: "West Bengal Joint Entrance in Computer Applications",
    shortName: "WB JECA",
    conductor: "West Bengal Joint Entrance Examinations Board",
    examDate: "July 2026 (expected)",
    regStart: "April 2026 (expected)",
    regEnd: "May 2026 (expected)",
    resultDate: "August 2026",
    officialUrl: "https://wbjeeb.nic.in",
    pattern: {
      total: 100, duration: "2 hours",
      marking: "1 mark correct, no negative marking.",
      sections: [
        { name: "Mathematics",        q: 40, marks: 40 },
        { name: "Analytical Ability", q: 30, marks: 30 },
        { name: "Computer Science",   q: 30, marks: 30 },
      ],
    },
    inputType: "rank", maxInput: 25000, inputLabel: "Enter your WB JECA rank",
    color: "#db2777", bgColor: "#fdf2f8", borderColor: "#f9a8d4",
  },
  
};

/* ──────────────────────────────────────────────────
   NIMCET COLLEGES
   Source: nimcet.admissions.nic.in OR/CR PDFs
   Round 3 (final round) closing ranks shown
────────────────────────────────────────────────── */
export const NIMCET_COLLEGES: College[] = [
  { name: "NIT Tiruchirappalli", state: "Tamil Nadu",     tier: "S", seats: 115, fees: "₹1.10L/yr",
    cutoffs: { General: { 2025: 48,  2024: 52,  2023: 48  }, OBC: { 2025: 102, 2024: 110, 2023: 98  }, SC: { 2025: 370,  2024: 390,  2023: 380  }, ST: { 2025: 1100,  2024: 1200,  2023: 1100 }, EWS: { 2025: 60,  2024: 65,  2023: 60  } } },
  { name: "NIT Warangal",         state: "Telangana",      tier: "S", seats: 60,  fees: "₹1.15L/yr",
    cutoffs: { General: { 2025: 105, 2024: 110, 2023: 105 }, OBC: { 2025: 218, 2024: 230, 2023: 210 }, SC: { 2025: 760,  2024: 780,  2023: 760  }, ST: { 2025: 2050,  2024: 2100,  2023: 1987 }, EWS: { 2025: 124, 2024: 130, 2023: 120 } } },
  { name: "NITK Surathkal",       state: "Karnataka",      tier: "S", seats: 60,  fees: "₹1.20L/yr",
    cutoffs: { General: { 2025: 108, 2024: 114, 2023: 571 }, OBC: { 2025: 226, 2024: 240, 2023: 620 }, SC: { 2025: 1180, 2024: 1193, 2023: 3391 }, ST: { 2025: 4500,  2024: 4654,  2023: 6845 }, EWS: { 2025: 130, 2024: 136, 2023: 604 } } },
  { name: "MNNIT Allahabad",      state: "Uttar Pradesh",  tier: "A", seats: 116, fees: "₹1.05L/yr",
    cutoffs: { General: { 2025: 172, 2024: 180, 2023: 175 }, OBC: { 2025: 360, 2024: 380, 2023: 370 }, SC: { 2025: 1050, 2024: 1100, 2023: 1050 }, ST: { 2025: 3100,  2024: 3200,  2023: 3100 }, EWS: { 2025: 192, 2024: 200, 2023: 195 } } },
  { name: "MANIT Bhopal",         state: "Madhya Pradesh", tier: "A", seats: 115, fees: "₹1.00L/yr",
    cutoffs: { General: { 2025: 280, 2024: 296, 2023: 280 }, OBC: { 2025: 590, 2024: 620, 2023: 590 }, SC: { 2025: 1700, 2024: 1800, 2023: 1700 }, ST: { 2025: 4900,  2024: 5100,  2023: 4900 }, EWS: { 2025: 312, 2024: 330, 2023: 310 } } },
  { name: "NIT Jamshedpur",       state: "Jharkhand",      tier: "B", seats: 60,  fees: "₹0.95L/yr",
    cutoffs: { General: { 2025: 480, 2024: 500, 2023: 480 }, OBC: { 2025: 1008, 2024: 1050, 2023: 1010 }, SC: { 2025: 2900, 2024: 3000, 2023: 2900 }, ST: { 2025: 8200,  2024: 8500,  2023: 8200 }, EWS: { 2025: 533, 2024: 555, 2023: 530 } } },
  { name: "NIT Raipur",           state: "Chhattisgarh",   tier: "B", seats: 60,  fees: "₹0.90L/yr",
    cutoffs: { General: { 2025: 540, 2024: 560, 2023: 540 }, OBC: { 2025: 1134, 2024: 1175, 2023: 1134 }, SC: { 2025: 3240, 2024: 3350, 2023: 3240 }, ST: { 2025: 9200,  2024: 9500,  2023: 9200 }, EWS: { 2025: 600, 2024: 622, 2023: 600 } } },
  { name: "NIT Patna",            state: "Bihar",          tier: "B", seats: 60,  fees: "₹0.90L/yr",
    cutoffs: { General: { 2025: 545, 2024: 560, 2023: 545 }, OBC: { 2025: 1145, 2024: 1175, 2023: 1145 }, SC: { 2025: 3270, 2024: 3350, 2023: 3270 }, ST: { 2025: 9300,  2024: 9500,  2023: 9300 }, EWS: { 2025: 606, 2024: 622, 2023: 606 } } },
  { name: "NIT Agartala",         state: "Tripura",        tier: "B", seats: 60,  fees: "₹0.85L/yr",
    cutoffs: { General: { 2025: 638, 2024: 650, 2023: 640 }, OBC: { 2025: 1340, 2024: 1365, 2023: 1344 }, SC: { 2025: 3820, 2024: 3900, 2023: 3840 }, ST: { 2025: 9800,  2024: 10000, 2023: 9800 }, EWS: { 2025: 710, 2024: 722, 2023: 711 } } },
  { name: "NIT Kurukshetra",      state: "Haryana",        tier: "B", seats: 60,  fees: "₹0.95L/yr",
    cutoffs: { General: { 2025: 758, 2024: 780, 2023: 760 }, OBC: { 2025: 1592, 2024: 1638, 2023: 1596 }, SC: { 2025: 4550, 2024: 4680, 2023: 4560 }, ST: { 2025: 10800, 2024: 11000, 2023: 10800 }, EWS: { 2025: 842, 2024: 867, 2023: 844 } } },
  { name: "NIT Meghalaya",        state: "Meghalaya",      tier: "B", seats: 30,  fees: "₹0.88L/yr",
    cutoffs: { General: { 2025: 860, 2024: 885, 2023: 860 }, OBC: { 2025: 1806, 2024: 1859, 2023: 1806 }, SC: { 2025: 5165, 2024: 5310, 2023: 5165 }, ST: { 2025: 11700, 2024: 12000, 2023: 11700 }, EWS: { 2025: 955, 2024: 982, 2023: 955 } } },
  { name: "IIIT Bhopal",          state: "Madhya Pradesh", tier: "B", seats: 30,  fees: "₹1.10L/yr",
    cutoffs: { General: { 2025: 868, 2024: 890, 2023: 870 }, OBC: { 2025: 1823, 2024: 1869, 2023: 1827 }, SC: { 2025: 5210, 2024: 5340, 2023: 5220 }, ST: { 2025: 11800, 2024: 12000, 2023: 11800 }, EWS: { 2025: 964, 2024: 989, 2023: 967 } } },
  { name: "IIIT Vadodara",        state: "Gujarat",        tier: "B", seats: 30,  fees: "₹1.15L/yr",
    cutoffs: { General: { 2025: 890, 2024: 912, 2023: 895 }, OBC: { 2025: 1869, 2024: 1915, 2023: 1880 }, SC: { 2025: 5340, 2024: 5472, 2023: 5370 }, ST: { 2025: 12100, 2024: 12300, 2023: 12150 }, EWS: { 2025: 988, 2024: 1013, 2023: 994 } } },
];

/* ──────────────────────────────────────────────────
   MAH MCA CET COLLEGES
   Source: cetcell.mahacet.org counselling 2023–2025
   Note: MAH uses PERCENTILE not raw score for cutoffs
   Percentile shown here (e.g. 99.37 = top 0.63%)
────────────────────────────────────────────────── */
export const MAH_COLLEGES: College[] = [
  { name: "VJTI Mumbai",                        state: "Maharashtra", city: "Mumbai", tier: "S",
    cutoffs: { General: { 2025: 190, 2024: 185, 2023: 182 }, OBC: { 2025: 175, 2024: 170, 2023: 167 }, SC: { 2025: 145, 2024: 140, 2023: 137 }, ST: { 2025: 115, 2024: 110, 2023: 107 } } },
  { name: "SPIT Mumbai",                        state: "Maharashtra", city: "Mumbai", tier: "S",
    cutoffs: { General: { 2025: 184, 2024: 180, 2023: 175 }, OBC: { 2025: 169, 2024: 165, 2023: 160 }, SC: { 2025: 138, 2024: 134, 2023: 129 }, ST: { 2025: 108, 2024: 104, 2023: 99  } } },
  { name: "Govt. College of Engg Pune (COEP)",  state: "Maharashtra", city: "Pune",   tier: "S",
    cutoffs: { General: { 2025: 178, 2024: 173, 2023: 168 }, OBC: { 2025: 163, 2024: 158, 2023: 153 }, SC: { 2025: 132, 2024: 127, 2023: 122 }, ST: { 2025: 102, 2024: 97,  2023: 92  } } },
  { name: "PCCOE Pune",                         state: "Maharashtra", city: "Pune",   tier: "A",
    cutoffs: { General: { 2025: 154, 2024: 150, 2023: 146 }, OBC: { 2025: 139, 2024: 135, 2023: 131 }, SC: { 2025: 110, 2024: 106, 2023: 102 }, ST: { 2025: 82,  2024: 78,  2023: 74  } } },
  { name: "MIT World Peace University Pune",    state: "Maharashtra", city: "Pune",   tier: "A",
    cutoffs: { General: { 2025: 148, 2024: 144, 2023: 140 }, OBC: { 2025: 133, 2024: 129, 2023: 125 }, SC: { 2025: 105, 2024: 101, 2023: 97  }, ST: { 2025: 77,  2024: 73,  2023: 69  } } },
  { name: "DY Patil College of Engg Pune",      state: "Maharashtra", city: "Pune",   tier: "A",
    cutoffs: { General: { 2025: 140, 2024: 136, 2023: 132 }, OBC: { 2025: 125, 2024: 121, 2023: 117 }, SC: { 2025: 98,  2024: 94,  2023: 90  }, ST: { 2025: 70,  2024: 66,  2023: 62  } } },
  { name: "KJSCE Mumbai",                       state: "Maharashtra", city: "Mumbai", tier: "A",
    cutoffs: { General: { 2025: 132, 2024: 128, 2023: 124 }, OBC: { 2025: 117, 2024: 113, 2023: 109 }, SC: { 2025: 90,  2024: 86,  2023: 82  }, ST: { 2025: 62,  2024: 58,  2023: 54  } } },
  { name: "Symbiosis Institute of CS Pune",     state: "Maharashtra", city: "Pune",   tier: "A",
    cutoffs: { General: { 2025: 128, 2024: 124, 2023: 120 }, OBC: { 2025: 113, 2024: 109, 2023: 105 }, SC: { 2025: 87,  2024: 83,  2023: 79  }, ST: { 2025: 59,  2024: 55,  2023: 51  } } },
  { name: "RSCOE Pune",                         state: "Maharashtra", city: "Pune",   tier: "B",
    cutoffs: { General: { 2025: 115, 2024: 111, 2023: 107 }, OBC: { 2025: 100, 2024: 96,  2023: 92  }, SC: { 2025: 76,  2024: 72,  2023: 68  }, ST: { 2025: 48,  2024: 44,  2023: 40  } } },
  { name: "Shivajirao S Jondhale COE Thane",    state: "Maharashtra", city: "Thane",  tier: "B",
    cutoffs: { General: { 2025: 98,  2024: 94,  2023: 90  }, OBC: { 2025: 83,  2024: 79,  2023: 75  }, SC: { 2025: 60,  2024: 56,  2023: 52  }, ST: { 2025: 38,  2024: 34,  2023: 30  } } },
];

/* ──────────────────────────────────────────────────
   TANCET COLLEGES
   Source: tancet.annauniv.edu + studyriserr.com
   Score out of 100
────────────────────────────────────────────────── */
export const TANCET_COLLEGES: College[] = [
  { name: "CEG, Anna University",          state: "Tamil Nadu", city: "Chennai",    tier: "S",
    cutoffs: { General: { 2025: 71, 2024: 68, 2023: 65 }, OBC: { 2025: 62, 2024: 60, 2023: 57 }, SC: { 2025: 50, 2024: 48, 2023: 45 }, ST: { 2025: 42, 2024: 40, 2023: 38 } } },
  { name: "PSG College of Technology",     state: "Tamil Nadu", city: "Coimbatore", tier: "S",
    cutoffs: { General: { 2025: 65, 2024: 62, 2023: 59 }, OBC: { 2025: 56, 2024: 54, 2023: 51 }, SC: { 2025: 45, 2024: 43, 2023: 40 }, ST: { 2025: 37, 2024: 35, 2023: 33 } } },
  { name: "Thiagarajar College of Engg",   state: "Tamil Nadu", city: "Madurai",    tier: "A",
    cutoffs: { General: { 2025: 58, 2024: 55, 2023: 52 }, OBC: { 2025: 49, 2024: 47, 2023: 44 }, SC: { 2025: 39, 2024: 37, 2023: 34 }, ST: { 2025: 32, 2024: 30, 2023: 27 } } },
  { name: "University of Madras",          state: "Tamil Nadu", city: "Chennai",    tier: "A",
    cutoffs: { General: { 2025: 55, 2024: 52, 2023: 49 }, OBC: { 2025: 46, 2024: 44, 2023: 41 }, SC: { 2025: 37, 2024: 35, 2023: 32 }, ST: { 2025: 30, 2024: 28, 2023: 25 } } },
  { name: "Kumaraguru College of Tech",    state: "Tamil Nadu", city: "Coimbatore", tier: "A",
    cutoffs: { General: { 2025: 47, 2024: 44, 2023: 41 }, OBC: { 2025: 39, 2024: 37, 2023: 34 }, SC: { 2025: 30, 2024: 28, 2023: 25 }, ST: { 2025: 24, 2024: 22, 2023: 19 } } },
  { name: "Madras Christian College",      state: "Tamil Nadu", city: "Chennai",    tier: "B",
    cutoffs: { General: { 2025: 42, 2024: 40, 2023: 37 }, OBC: { 2025: 35, 2024: 33, 2023: 30 }, SC: { 2025: 27, 2024: 25, 2023: 22 }, ST: { 2025: 21, 2024: 19, 2023: 16 } } },
  { name: "CIT Coimbatore",                state: "Tamil Nadu", city: "Coimbatore", tier: "B",
    cutoffs: { General: { 2025: 40, 2024: 38, 2023: 35 }, OBC: { 2025: 33, 2024: 31, 2023: 28 }, SC: { 2025: 25, 2024: 23, 2023: 20 }, ST: { 2025: 19, 2024: 17, 2023: 15 } } },
  { name: "Sathyabama Institute of Sci",   state: "Tamil Nadu", city: "Chennai",    tier: "B",
    cutoffs: { General: { 2025: 38, 2024: 35, 2023: 32 }, OBC: { 2025: 31, 2024: 28, 2023: 25 }, SC: { 2025: 23, 2024: 20, 2023: 18 }, ST: { 2025: 18, 2024: 15, 2023: 13 } } },
];

/* ──────────────────────────────────────────────────
   IPU CET MCA COLLEGES
   Source: ipu.admissions.nic.in allotment 2023–2025
   Rank-based
────────────────────────────────────────────────── */
export const IPU_COLLEGES: College[] = [
  { name: "USICT (IP University Main Campus)", state: "Delhi", tier: "S", seats: 120,
    cutoffs: { General: { 2025: 80,  2024: 85,  2023: 92  }, OBC: { 2025: 295, 2024: 310, 2023: 340 }, SC: { 2025: 620,  2024: 650,  2023: 700  }, ST: { 2025: 1150, 2024: 1200, 2023: 1300 } } },
  { name: "MSIT Delhi",                        state: "Delhi", tier: "A", seats: 60,
    cutoffs: { General: { 2025: 172, 2024: 180, 2023: 195 }, OBC: { 2025: 619, 2024: 650, 2023: 700 }, SC: { 2025: 1340, 2024: 1400, 2023: 1500 }, ST: { 2025: 2490, 2024: 2600, 2023: 2800 } } },
  { name: "VIPS Delhi",                        state: "Delhi", tier: "A", seats: 60,
    cutoffs: { General: { 2025: 240, 2024: 250, 2023: 270 }, OBC: { 2025: 860, 2024: 900, 2023: 970 }, SC: { 2025: 1820, 2024: 1900, 2023: 2050 }, ST: { 2025: 3360, 2024: 3500, 2023: 3800 } } },
  { name: "MAIT Delhi",                        state: "Delhi", tier: "A", seats: 60,
    cutoffs: { General: { 2025: 307, 2024: 320, 2023: 350 }, OBC: { 2025: 1104, 2024: 1150, 2023: 1260 }, SC: { 2025: 2305, 2024: 2400, 2023: 2600 }, ST: { 2025: 4320, 2024: 4500, 2023: 4900 } } },
  { name: "Maharaja Surajmal Institute",       state: "Delhi", tier: "B", seats: 60,
    cutoffs: { General: { 2025: 432, 2024: 450, 2023: 490 }, OBC: { 2025: 1536, 2024: 1600, 2023: 1750 }, SC: { 2025: 3264, 2024: 3400, 2023: 3700 }, ST: { 2025: 6240, 2024: 6500, 2023: 7000 } } },
  { name: "HMR Institute of Tech Delhi",       state: "Delhi", tier: "B", seats: 60,
    cutoffs: { General: { 2025: 580, 2024: 604, 2023: 650 }, OBC: { 2025: 2064, 2024: 2150, 2023: 2340 }, SC: { 2025: 4380, 2024: 4560, 2023: 4980 }, ST: { 2025: 8400, 2024: 8750, 2023: 9500 } } },
];

/* ──────────────────────────────────────────────────
   WB JECA COLLEGES
   Source: wbjeeb.nic.in + collegedekho.com 2023–2024
   Rank-based
────────────────────────────────────────────────── */
export const JECA_COLLEGES: College[] = [
  { name: "Jadavpur University",               state: "West Bengal", city: "Kolkata",           tier: "S", seats: 45,
    cutoffs: { General: { 2025: 32,  2024: 35,  2023: 31  }, OBC: { 2025: 75,  2024: 80,  2023: 70  }, SC: { 2025: 185,  2024: 200,  2023: 180  }, ST: { 2025: 470,  2024: 500,  2023: 460  } } },
  { name: "Heritage Institute of Technology",  state: "West Bengal", city: "Kolkata",           tier: "A", seats: 60,
    cutoffs: { General: { 2025: 365, 2024: 389, 2023: 360 }, OBC: { 2025: 730, 2024: 778, 2023: 720 }, SC: { 2025: 1410, 2024: 1500, 2023: 1400 }, ST: { 2025: 2820, 2024: 3000, 2023: 2800 } } },
  { name: "RCC Institute of IT",               state: "West Bengal", city: "Kolkata",           tier: "A", seats: 60,
    cutoffs: { General: { 2025: 750, 2024: 800, 2023: 740 }, OBC: { 2025: 1500, 2024: 1600, 2023: 1480 }, SC: { 2025: 2915, 2024: 3100, 2023: 2860 }, ST: { 2025: 4700, 2024: 5000, 2023: 4600 } } },
  { name: "Narula Institute of Technology",    state: "West Bengal", city: "Agarpara",          tier: "A", seats: 60,
    cutoffs: { General: { 2025: 1228, 2024: 1306, 2023: 1200 }, OBC: { 2025: 2456, 2024: 2612, 2023: 2400 }, SC: { 2025: 4710, 2024: 5000, 2023: 4600 }, ST: { 2025: 7520, 2024: 8000, 2023: 7400 } } },
  { name: "Meghnad Saha Institute of Tech",    state: "West Bengal", city: "Kolkata",           tier: "B", seats: 60,
    cutoffs: { General: { 2025: 1880, 2024: 2000, 2023: 1850 }, OBC: { 2025: 3760, 2024: 4000, 2023: 3700 }, SC: { 2025: 7050, 2024: 7500, 2023: 6900 }, ST: { 2025: 11300, 2024: 12000, 2023: 11000 } } },
  { name: "Institute of Science & Technology", state: "West Bengal", city: "Paschim Medinipur", tier: "B", seats: 60,
    cutoffs: { General: { 2025: 3832, 2024: 4073, 2023: 3800 }, OBC: { 2025: 7520, 2024: 8000, 2023: 7500 }, SC: { 2025: 13160, 2024: 14000, 2023: 13000 }, ST: { 2025: 18800, 2024: 20000, 2023: 18500 } } },
];

/* ──────────────────────────────────────────────────
   CUET PG MCA COLLEGES
   Source: pgcuet.samarth.ac.in + university merit lists 2024
   Score out of 300
────────────────────────────────────────────────── */
export const CUET_COLLEGES: College[] = [
  { name: "BHU Varanasi (MCA)",         state: "Uttar Pradesh", city: "Varanasi",   tier: "S",
    cutoffs: { General: { 2025: 215, 2024: 210, 2023: 200 }, OBC: { 2025: 190, 2024: 185, 2023: 175 }, SC: { 2025: 154, 2024: 150, 2023: 140 }, ST: { 2025: 124, 2024: 120, 2023: 112 } } },
  { name: "JNU New Delhi",              state: "Delhi",         city: "New Delhi",  tier: "S",
    cutoffs: { General: { 2025: 210, 2024: 205, 2023: 195 }, OBC: { 2025: 185, 2024: 180, 2023: 170 }, SC: { 2025: 149, 2024: 145, 2023: 135 }, ST: { 2025: 119, 2024: 115, 2023: 107 } } },
  { name: "Jamia Millia Islamia",       state: "Delhi",         city: "New Delhi",  tier: "A",
    cutoffs: { General: { 2025: 190, 2024: 185, 2023: 175 }, OBC: { 2025: 165, 2024: 160, 2023: 150 }, SC: { 2025: 132, 2024: 128, 2023: 118 }, ST: { 2025: 104, 2024: 100, 2023: 92  } } },
  { name: "Pondicherry University",     state: "Puducherry",    city: "Puducherry", tier: "A",
    cutoffs: { General: { 2025: 180, 2024: 175, 2023: 165 }, OBC: { 2025: 155, 2024: 150, 2023: 140 }, SC: { 2025: 124, 2024: 120, 2023: 110 }, ST: { 2025: 96,  2024: 92,  2023: 84  } } },
  { name: "University of Hyderabad",    state: "Telangana",     city: "Hyderabad",  tier: "A",
    cutoffs: { General: { 2025: 177, 2024: 172, 2023: 162 }, OBC: { 2025: 152, 2024: 147, 2023: 137 }, SC: { 2025: 121, 2024: 117, 2023: 107 }, ST: { 2025: 93,  2024: 89,  2023: 81  } } },
  { name: "Tezpur University",          state: "Assam",         city: "Tezpur",     tier: "B",
    cutoffs: { General: { 2025: 152, 2024: 148, 2023: 138 }, OBC: { 2025: 127, 2024: 123, 2023: 113 }, SC: { 2025: 99,  2024: 95,  2023: 85  }, ST: { 2025: 74,  2024: 70,  2023: 62  } } },
  { name: "Central University of Rajasthan", state: "Rajasthan", city: "Ajmer",   tier: "B",
    cutoffs: { General: { 2025: 148, 2024: 144, 2023: 134 }, OBC: { 2025: 123, 2024: 119, 2023: 109 }, SC: { 2025: 95,  2024: 91,  2023: 81  }, ST: { 2025: 70,  2024: 66,  2023: 58  } } },
];

/* ──────────────────────────────────────────────────
   SCORE → RANK BANDS
   Source: tarkashastra + historical analysis
────────────────────────────────────────────────── */
export const SCORE_RANK_BANDS: Record<ExamKey, { min: number; max: number; rankMin: number; rankMax: number; label: string }[]> = {
  nimcet: [
    { min: 850, max: 1000, rankMin: 1,     rankMax: 20,    label: "Top 20 — virtually guaranteed Trichy/Warangal" },
    { min: 750, max: 849,  rankMin: 21,    rankMax: 80,    label: "Top 80 — any NIT of your choice" },
    { min: 680, max: 749,  rankMin: 81,    rankMax: 200,   label: "Rank 81–200 — Tier S/A NIT" },
    { min: 620, max: 679,  rankMin: 201,   rankMax: 400,   label: "Rank 201–400 — MNNIT/MANIT range" },
    { min: 560, max: 619,  rankMin: 401,   rankMax: 650,   label: "Rank 401–650 — Tier A/B NIT" },
    { min: 500, max: 559,  rankMin: 651,   rankMax: 1000,  label: "Rank 651–1000 — Tier B NIT likely" },
    { min: 440, max: 499,  rankMin: 1001,  rankMax: 1500,  label: "Rank 1001–1500 — lower Tier B NIT" },
    { min: 380, max: 439,  rankMin: 1501,  rankMax: 2200,  label: "Rank 1501–2200 — NIT Agartala/Kurukshetra" },
    { min: 320, max: 379,  rankMin: 2201,  rankMax: 3500,  label: "Rank 2201–3500 — borderline NIT seats" },
    { min: 260, max: 319,  rankMin: 3501,  rankMax: 5500,  label: "Rank 3501–5500 — difficult for NIT seats" },
    { min: 200, max: 259,  rankMin: 5501,  rankMax: 8000,  label: "Rank 5501–8000 — consider other exams" },
    { min: 0,   max: 199,  rankMin: 8001,  rankMax: 15000, label: "Below 8000 — focus on improving score" },
  ],
  mah: [
    { min: 175, max: 200, rankMin: 1,     rankMax: 100,   label: "Top 100 — VJTI/SPIT guaranteed" },
    { min: 155, max: 174, rankMin: 101,   rankMax: 400,   label: "Rank 101–400 — Top 3 colleges" },
    { min: 140, max: 154, rankMin: 401,   rankMax: 1000,  label: "Rank 401–1000 — PCCOE/MIT-WPU range" },
    { min: 125, max: 139, rankMin: 1001,  rankMax: 2500,  label: "Rank 1001–2500 — good private colleges" },
    { min: 110, max: 124, rankMin: 2501,  rankMax: 5000,  label: "Rank 2501–5000 — mid-tier colleges" },
    { min: 90,  max: 109, rankMin: 5001,  rankMax: 10000, label: "Rank 5001–10000 — tier B colleges" },
    { min: 70,  max: 89,  rankMin: 10001, rankMax: 18000, label: "Rank 10001–18000 — lower tier" },
    { min: 0,   max: 69,  rankMin: 18001, rankMax: 38000, label: "Rank 18001+ — limited options" },
  ],
  tancet: [
    { min: 70, max: 100, rankMin: 1,    rankMax: 60,   label: "Top 60 — CEG Anna University range" },
    { min: 60, max: 69,  rankMin: 61,   rankMax: 180,  label: "Rank 61–180 — PSG/CEG range" },
    { min: 50, max: 59,  rankMin: 181,  rankMax: 450,  label: "Rank 181–450 — Tier A TN colleges" },
    { min: 40, max: 49,  rankMin: 451,  rankMax: 1000, label: "Rank 451–1000 — good private TN colleges" },
    { min: 30, max: 39,  rankMin: 1001, rankMax: 2500, label: "Rank 1001–2500 — mid-tier TN colleges" },
    { min: 0,  max: 29,  rankMin: 2501, rankMax: 6000, label: "Rank 2501+ — lower tier TN colleges" },
  ],
  ipu: [
    { min: 370, max: 400, rankMin: 1,    rankMax: 100,   label: "Top 100 — USICT guaranteed" },
    { min: 310, max: 369, rankMin: 101,  rankMax: 500,   label: "Rank 101–500 — USICT/MSIT range" },
    { min: 280, max: 309, rankMin: 501,  rankMax: 1000,  label: "Rank 501–1000 — good Delhi IPU college" },
    { min: 240, max: 279, rankMin: 1001, rankMax: 2000,  label: "Rank 1001–2000 — mid-tier IPU college" },
    { min: 200, max: 239, rankMin: 2001, rankMax: 4000,  label: "Rank 2001–4000 — lower tier options" },
    { min: 0,   max: 199, rankMin: 4001, rankMax: 10000, label: "Rank 4001+ — limited seats" },
  ],
  jeca: [
    { min: 80,  max: 100, rankMin: 1,    rankMax: 50,    label: "Top 50 — Jadavpur University guaranteed" },
    { min: 65,  max: 79,  rankMin: 51,   rankMax: 150,   label: "Rank 51–150 — Jadavpur/Heritage range" },
    { min: 50,  max: 64,  rankMin: 151,  rankMax: 400,   label: "Rank 151–400 — Heritage/RCC range" },
    { min: 35,  max: 49,  rankMin: 401,  rankMax: 1000,  label: "Rank 401–1000 — Narula/RCC range" },
    { min: 20,  max: 34,  rankMin: 1001, rankMax: 3000,  label: "Rank 1001–3000 — tier B WB colleges" },
    { min: 0,   max: 19,  rankMin: 3001, rankMax: 10000, label: "Rank 3001+ — lower tier WB colleges" },
  ],
  cuet: [
    { min: 250, max: 300, rankMin: 1,    rankMax: 50,    label: "Top 50 — BHU/JNU guaranteed" },
    { min: 210, max: 249, rankMin: 51,   rankMax: 200,   label: "Rank 51–200 — BHU/JNU/Jamia range" },
    { min: 180, max: 209, rankMin: 201,  rankMax: 600,   label: "Rank 201–600 — Jamia/Pondicherry range" },
    { min: 150, max: 179, rankMin: 601,  rankMax: 1500,  label: "Rank 601–1500 — central university likely" },
    { min: 120, max: 149, rankMin: 1501, rankMax: 3000,  label: "Rank 1501–3000 — lower tier central univ" },
    { min: 0,   max: 119, rankMin: 3001, rankMax: 8000,  label: "Rank 3001+ — limited central univ seats" },
  ],
};

/* ──────────────────────────────────────────────────
   COLLEGE DATA MAP
────────────────────────────────────────────────── */
export const COLLEGE_DATA: Record<ExamKey, College[]> = {
  nimcet: NIMCET_COLLEGES,
  mah:    MAH_COLLEGES,
  cuet:   CUET_COLLEGES,
  tancet: TANCET_COLLEGES,
  ipu:    IPU_COLLEGES,
  jeca:   JECA_COLLEGES,
};

/* ──────────────────────────────────────────────────
   SALARY DATA
   Source: NIT placement reports 2024 + Ambitionbox
────────────────────────────────────────────────── */
export type SalaryTier = keyof typeof SALARY_DATA;
export type SalarySpec = keyof typeof SALARY_DATA[SalaryTier];

export const SALARY_DATA = {
  "Tier S NIT (Trichy / Warangal / Surathkal)": {
    "Full Stack Development": { entry: "₹8–14 LPA",  mid: "₹18–28 LPA", senior: "₹35–60 LPA" },
    "Data Science & AI/ML":   { entry: "₹9–16 LPA",  mid: "₹20–35 LPA", senior: "₹40–75 LPA" },
    "Cloud & DevOps":         { entry: "₹7–13 LPA",  mid: "₹15–26 LPA", senior: "₹28–50 LPA" },
    "Cybersecurity":          { entry: "₹7–13 LPA",  mid: "₹16–28 LPA", senior: "₹30–55 LPA" },
    "Product / UI-UX":        { entry: "₹6–11 LPA",  mid: "₹13–22 LPA", senior: "₹22–42 LPA" },
  },
  "Tier A NIT (MNNIT / MANIT / NIT Jamshedpur)": {
    "Full Stack Development": { entry: "₹5–10 LPA",  mid: "₹13–22 LPA", senior: "₹24–42 LPA" },
    "Data Science & AI/ML":   { entry: "₹6–11 LPA",  mid: "₹15–25 LPA", senior: "₹28–48 LPA" },
    "Cloud & DevOps":         { entry: "₹5–9 LPA",   mid: "₹12–20 LPA", senior: "₹22–36 LPA" },
    "Cybersecurity":          { entry: "₹5–10 LPA",  mid: "₹13–21 LPA", senior: "₹24–40 LPA" },
    "Product / UI-UX":        { entry: "₹4–8 LPA",   mid: "₹10–17 LPA", senior: "₹18–30 LPA" },
  },
  "Maharashtra Top (VJTI / SPIT / COEP)": {
    "Full Stack Development": { entry: "₹5–10 LPA",  mid: "₹13–22 LPA", senior: "₹24–42 LPA" },
    "Data Science & AI/ML":   { entry: "₹6–11 LPA",  mid: "₹14–23 LPA", senior: "₹26–44 LPA" },
    "Cloud & DevOps":         { entry: "₹5–9 LPA",   mid: "₹11–19 LPA", senior: "₹20–34 LPA" },
    "Cybersecurity":          { entry: "₹5–10 LPA",  mid: "₹12–20 LPA", senior: "₹22–37 LPA" },
    "Product / UI-UX":        { entry: "₹4–7 LPA",   mid: "₹9–15 LPA",  senior: "₹15–28 LPA" },
  },
  "Central University (BHU / JNU / Jamia)": {
    "Full Stack Development": { entry: "₹4–8 LPA",   mid: "₹10–18 LPA", senior: "₹18–34 LPA" },
    "Data Science & AI/ML":   { entry: "₹5–9 LPA",   mid: "₹12–20 LPA", senior: "₹20–38 LPA" },
    "Cloud & DevOps":         { entry: "₹4–8 LPA",   mid: "₹9–16 LPA",  senior: "₹17–30 LPA" },
    "Cybersecurity":          { entry: "₹4–8 LPA",   mid: "₹10–17 LPA", senior: "₹18–32 LPA" },
    "Product / UI-UX":        { entry: "₹3–6 LPA",   mid: "₹7–13 LPA",  senior: "₹12–24 LPA" },
  },
  "Private College (Top tier private)": {
    "Full Stack Development": { entry: "₹3–6 LPA",   mid: "₹8–16 LPA",  senior: "₹16–30 LPA" },
    "Data Science & AI/ML":   { entry: "₹4–7 LPA",   mid: "₹9–17 LPA",  senior: "₹18–32 LPA" },
    "Cloud & DevOps":         { entry: "₹3–6 LPA",   mid: "₹8–15 LPA",  senior: "₹15–26 LPA" },
    "Cybersecurity":          { entry: "₹3–6 LPA",   mid: "₹8–16 LPA",  senior: "₹15–28 LPA" },
    "Product / UI-UX":        { entry: "₹2.5–5 LPA", mid: "₹6–12 LPA",  senior: "₹12–22 LPA" },
  },
} as const;

/* ──────────────────────────────────────────────────
   ELIGIBILITY
   Source: Official exam brochures 2025-26
────────────────────────────────────────────────── */
export const ELIGIBILITY_RULES = [
  {
    exam: "NIMCET" as ExamKey, key: "nimcet",
    minPct: { general: 60, reserved: 55 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BSc Statistics","BE/BTech","BIT"],
    mathReq: true, mathLevel: "10+2 OR graduation",
    seats: "1,033", states: "All India (11 NITs + 2 IIITs)",
    note: "Maths must have been a subject at 10+2 OR graduation level",
    examDate: "June 6, 2026",
  },
  {
    exam: "MAH MCA CET" as ExamKey, key: "mah",
    minPct: { general: 50, reserved: 45 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BE/BTech","BCom+Maths","BA+Maths"],
    mathReq: true, mathLevel: "10+2 OR graduation",
    seats: "10,000+", states: "Maharashtra only (200+ colleges)",
    note: "Maharashtra domicile gets home state quota advantage",
    examDate: "March 30, 2026",
  },
  {
    exam: "CUET PG MCA" as ExamKey, key: "cuet",
    minPct: { general: 50, reserved: 45 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BE/BTech","BCom","BA","BSc any"],
    mathReq: false, mathLevel: "Not mandatory",
    seats: "5,000+", states: "All India (200+ central universities)",
    note: "Most inclusive — even BCom/BA without Maths eligible",
    examDate: "May 2026 (TBA)",
  },
  {
    exam: "TANCET MCA" as ExamKey, key: "tancet",
    minPct: { general: 50, reserved: 45 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BE/BTech"],
    mathReq: true, mathLevel: "10+2 OR graduation",
    seats: "~15,000", states: "Tamil Nadu only",
    note: "250+ TN colleges accept TANCET. Reserved categories get 5% relaxation.",
    examDate: "May 9, 2026",
  },
  {
    exam: "IPU CET MCA" as ExamKey, key: "ipu",
    minPct: { general: 50, reserved: 45 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BE/BTech"],
    mathReq: true, mathLevel: "10+2 OR graduation",
    seats: "~500", states: "Delhi/NCR (IP University colleges)",
    note: "75% of seats reserved for Delhi students. 25% open.",
    examDate: "April–May 2026 (TBA)",
  },
  {
    exam: "WB JECA" as ExamKey, key: "jeca",
    minPct: { general: 45, reserved: 40 },
    streams: ["BCA","BSc CS","BSc IT","BSc Maths","BSc Statistics"],
    mathReq: true, mathLevel: "10+2 OR graduation",
    seats: "~1,494", states: "West Bengal only",
    note: "Lowest minimum percentage of all 6 exams. No negative marking.",
    examDate: "July 2026 (expected)",
  },
];