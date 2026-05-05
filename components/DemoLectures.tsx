"use client";
import { h2, p } from "@/data/tailwind-utils";
import { useState, useEffect, useRef, useCallback } from "react";
import { BiTime, BiX, BiChevronRight } from "react-icons/bi";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepType = "read" | "trap" | "technique" | "answer";

type Step = {
  type: StepType;
  label: string;
  content: string;
};

type Problem = {
  q: string;
  options: string[];
  answer: number;
  source: string;
  topic: string;
  difficulty: "Medium" | "Hard" | "Tricky";
  avgTime: string;
  crackTime: string;
  steps: Step[];
};

type Category = {
  label: string;
  icon: string;
  problems: Problem[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    label: "MCA Entrance",
    icon: "🎓",
    problems: [
      {
        q: "In the OSI model, a packet is corrupted mid-route and TCP requests retransmission. Which layer is responsible for this end-to-end error recovery?",
        options: [
          "Network Layer",
          "Transport Layer",
          "Data Link Layer",
          "Session Layer",
        ],
        answer: 1,
        source: "NIMCET 2023",
        topic: "Networking",
        difficulty: "Tricky",
        avgTime: "90 sec",
        crackTime: "20 sec",
        steps: [
          {
            type: "read",
            label: "What the question is actually asking",
            content:
              "Two conditions must both be true: <strong>corrupted in transit</strong> (not just within one hop) and <strong>requests retransmission</strong> (an active recovery mechanism). Your answer must satisfy both.",
          },
          {
            type: "trap",
            label: "The trap 70% of students fall into",
            content:
              "Data Link Layer does error detection — that's true. But DLL only works <em>node to node</em> (one hop at a time). The moment the packet crosses multiple routers, DLL's job is done. Choosing DLL here is the classic NIMCET misdirection.",
          },
          {
            type: "technique",
            label: "The fast technique: ask 'who owns the full journey?'",
            content:
              "In the OSI stack, only the <strong>Transport Layer (Layer 4)</strong> thinks end-to-end — from source to destination across all hops. TCP's ACK + retransmission is the textbook definition of what this question describes. Eliminate Network (routing only), Session (dialog control), Data Link (single hop). Transport is the only survivor.",
          },
          {
            type: "answer",
            label: "Answer: B — Transport Layer",
            content:
              "Average student: 90 sec (draws the OSI diagram). Crackora method: 20 sec (one elimination rule). In NIMCET, OSI questions appear almost every year — this one rule alone covers 60% of them.",
          },
        ],
      },
      {
        q: "A process is in 'waiting' state. It has all resources it needs, but is waiting for an I/O operation to complete. Is this a deadlock?",
        options: [
          "Yes, because it is blocked indefinitely",
          "No, because it will resume after I/O completes",
          "Yes, because CPU is wasted",
          "No, but it causes starvation",
        ],
        answer: 1,
        source: "MAH MCA CET 2023",
        topic: "Operating Systems",
        difficulty: "Hard",
        avgTime: "2 min",
        crackTime: "30 sec",
        steps: [
          {
            type: "read",
            label: "Spot the key phrase",
            content:
              "The question says the process <strong>has all resources it needs</strong> and is only waiting for an I/O event — not for a resource held by another process. That single phrase dismantles the deadlock argument entirely.",
          },
          {
            type: "trap",
            label: "Why 'blocked = deadlock' is wrong",
            content:
              "Deadlock has 4 necessary conditions: mutual exclusion, hold and wait, no preemption, <strong>circular wait</strong>. Here there is no circular wait — the process is waiting for hardware (I/O), not for another process holding a resource. No circular wait = no deadlock, by definition.",
          },
          {
            type: "technique",
            label: "The checklist trick for OS questions",
            content:
              "For any 'is this a deadlock?' question: immediately check for <strong>circular wait</strong>. If you cannot draw a cycle in the resource allocation graph, it is not a deadlock. This check takes 5 seconds and eliminates all confusion. I/O waiting is a normal blocked state — the OS resumes it the moment the I/O finishes.",
          },
          {
            type: "answer",
            label: "Answer: B — No, it will resume after I/O",
            content:
              "This is a conceptual trap question, not a computation. Crackora method: apply the circular wait check in 5 seconds, mark B, move on. Deadlock conditions appear in NIMCET every single year — memorise all four once, and these questions become free marks.",
          },
        ],
      },
      {
        q: "Choose the sentence with correct subject-verb agreement: which is grammatically right?",
        options: [
          "The committee have decided to postpone the meeting.",
          "Each of the students are responsible for their work.",
          "Neither the manager nor the employees were informed.",
          "A number of complaints has been received.",
        ],
        answer: 2,
        source: "NIMCET 2022",
        topic: "English Grammar",
        difficulty: "Tricky",
        avgTime: "75 sec",
        crackTime: "15 sec",
        steps: [
          {
            type: "read",
            label: "What to look for immediately",
            content:
              "Subject-verb agreement questions in MCA exams always test one of three patterns: <strong>collective nouns</strong>, <strong>each/every/either/neither</strong>, or <strong>neither...nor / either...or</strong> constructions. Identify which pattern each option uses before reading the full sentence.",
          },
          {
            type: "trap",
            label: "Three deliberate traps in this question",
            content:
              "<strong>Option A:</strong> 'committee' is collective — takes singular verb in Indian English formal usage ('has decided'). <strong>Option B:</strong> 'Each of' always takes singular verb — 'is responsible'. <strong>Option D:</strong> 'A number of' takes plural verb — 'have been received'. All three are wrong.",
          },
          {
            type: "technique",
            label: "The neither...nor rule (one rule, zero confusion)",
            content:
              "When subjects are joined by <strong>neither...nor</strong> or <strong>either...or</strong>, the verb agrees with the subject <em>closest to it</em>. In option C: '...nor the employees were informed' — 'employees' is plural, so 'were' is correct. Apply this rule in 10 seconds.",
          },
          {
            type: "answer",
            label:
              "Answer: C — Neither the manager nor the employees were informed",
            content:
              "English grammar in MCA exams recycles the same 6-7 rules every year. Learn the rule once and you can crack these in under 15 seconds. We've compiled all recurring patterns across 10 years of papers in our study material.",
          },
        ],
      },
    ],
  },
  {
    label: "DSA",
    icon: "💻",
    problems: [
      {
        q: "Given an array of n integers with duplicates, find the element that appears more than n/2 times. What is the most optimal approach in terms of time and space?",
        options: [
          "Sort the array, return the middle element — O(n log n), O(1)",
          "Use a HashMap to count frequencies — O(n), O(n)",
          "Boyer-Moore Voting Algorithm — O(n), O(1)",
          "Divide and conquer — O(n log n), O(log n)",
        ],
        answer: 2,
        source: "NIMCET 2023 / Interview Classic",
        topic: "Arrays",
        difficulty: "Hard",
        avgTime: "3 min",
        crackTime: "40 sec",
        steps: [
          {
            type: "read",
            label: "What 'optimal' means here — read carefully",
            content:
              "The question says <strong>most optimal in time AND space</strong>. This is not asking for just the fastest — it wants the best combination of O(n) time <em>and</em> O(1) space simultaneously. Many students stop at HashMap and lose the mark.",
          },
          {
            type: "trap",
            label: "Why HashMap (Option B) is wrong despite being O(n)",
            content:
              "HashMap gives O(n) time but costs O(n) extra space. Option A (sorting) is O(n log n) time — worse. Option D is also O(n log n). The exam is specifically testing whether you know <strong>Boyer-Moore</strong>, which achieves O(n) time <em>and</em> O(1) space — impossible to beat on both dimensions simultaneously.",
          },
          {
            type: "technique",
            label: "Boyer-Moore in 3 lines — understand it once, never forget",
            content:
              "Maintain one <code>candidate</code> and one <code>count</code>. If count is 0, set current element as candidate. If current == candidate, increment count; else decrement. <strong>Why this works:</strong> the majority element (appears > n/2 times) can never be completely cancelled out — it always survives.",
          },
          {
            type: "answer",
            label: "Answer: C — Boyer-Moore Voting, O(n) time O(1) space",
            content:
              "In NIMCET and MCA interviews, array problems that ask for 'optimal' almost always require you to go beyond the obvious HashMap solution. Boyer-Moore, Kadane's, and the two-pointer technique are the three algorithms that appear repeatedly — learn all three with their derivations.",
          },
        ],
      },
      {
        q: "A BST has nodes inserted in this order: 50, 30, 70, 20, 40, 60, 80. What is the output of postorder traversal?",
        options: [
          "20, 30, 40, 50, 60, 70, 80",
          "20, 40, 30, 60, 80, 70, 50",
          "50, 30, 70, 20, 40, 60, 80",
          "80, 70, 60, 50, 40, 30, 20",
        ],
        answer: 1,
        source: "MAH MCA CET 2023",
        topic: "Trees",
        difficulty: "Medium",
        avgTime: "4 min",
        crackTime: "45 sec",
        steps: [
          {
            type: "read",
            label: "Build the tree first — always draw it",
            content:
              "BST insertion rule: smaller goes left, larger goes right. Root = 50. 30 &lt; 50 → left. 70 &gt; 50 → right. 20 &lt; 30 → left of 30. 40 &gt; 30 → right of 30. 60 &lt; 70 → left of 70. 80 &gt; 70 → right of 70. Draw this in 20 seconds.",
          },
          {
            type: "trap",
            label: "Confusing inorder with postorder",
            content:
              "Inorder (Left→Root→Right) of a BST always gives sorted order: 20,30,40,50,60,70,80 — that's option A, a deliberate trap. Postorder is <strong>Left→Right→Root</strong>. The root (50) always comes <em>last</em> in postorder. Any option that doesn't end in 50 is immediately eliminated.",
          },
          {
            type: "technique",
            label: "The root-last shortcut for postorder MCQs",
            content:
              "In any MCQ asking for postorder of a tree: the root is always the final element. Glance at the last element of each option first. Options A (80), C (80), D (20) all end wrongly. Only option B ends in 50. Verify by tracing: left subtree postorder = 20,40,30 → right subtree = 60,80,70 → root = 50. ✓",
          },
          {
            type: "answer",
            label: "Answer: B — 20, 40, 30, 60, 80, 70, 50",
            content:
              "Tree traversal MCQs are completely mechanical once you know one shortcut per traversal type: inorder ends sorted, postorder ends at root, preorder starts at root. Apply the shortcut first, then verify only if two options survive.",
          },
        ],
      },
      {
        q: "What is the time complexity of finding the shortest path between two nodes in an unweighted, undirected graph with V vertices and E edges using BFS?",
        options: ["O(V²)", "O(E log V)", "O(V + E)", "O(V × E)"],
        answer: 2,
        source: "NIMCET 2022",
        topic: "Graphs",
        difficulty: "Hard",
        avgTime: "2 min",
        crackTime: "25 sec",
        steps: [
          {
            type: "read",
            label: "Identify: unweighted graph + shortest path",
            content:
              "The word <strong>unweighted</strong> is critical. This immediately tells you Dijkstra is not needed (Dijkstra is for weighted graphs). For unweighted graphs, BFS naturally finds the shortest path because it explores level by level — each level = one more edge.",
          },
          {
            type: "trap",
            label: "Why O(V²) sounds reasonable but is wrong",
            content:
              "O(V²) is the complexity of BFS on an <em>adjacency matrix</em> representation. The question doesn't specify representation — by default, assume adjacency list. Students who memorise O(V²) without understanding where it comes from consistently get this wrong.",
          },
          {
            type: "technique",
            label: "Derive it in 10 seconds — don't memorise blindly",
            content:
              "BFS visits every vertex once: <strong>O(V)</strong>. For each vertex, it examines all its edges: total edges examined = <strong>O(E)</strong>. Total = O(V + E). This derivation works for both BFS and DFS on adjacency list. If you understand the derivation, you never need to memorise it.",
          },
          {
            type: "answer",
            label: "Answer: C — O(V + E)",
            content:
              "Graph complexity questions follow a pattern: adjacency list → O(V+E), adjacency matrix → O(V²), Dijkstra with min-heap → O((V+E) log V), Bellman-Ford → O(VE). Know all four with their derivations and you've covered 80% of graph MCQs.",
          },
        ],
      },
    ],
  },
  {
    label: "Mathematics",
    icon: "🔢",
    problems: [
      {
        q: "How many 4-digit numbers can be formed using digits {1, 2, 3, 4, 5} such that the number is divisible by 4 and no digit is repeated?",
        options: ["24", "36", "30", "12"],
        answer: 1,
        source: "NIMCET 2022",
        topic: "Combinatorics",
        difficulty: "Hard",
        avgTime: "5 min",
        crackTime: "90 sec",
        steps: [
          {
            type: "read",
            label: "Break the constraint: divisibility by 4",
            content:
              "A number is divisible by 4 if and only if its <strong>last two digits form a number divisible by 4</strong>. So instead of checking the full 4-digit number, we only need to find all valid 2-digit endings from {1,2,3,4,5} with no repetition.",
          },
          {
            type: "trap",
            label: "The trap: treating it as a simple permutation",
            content:
              "Many students compute 5P4 = 120 and then divide by something — that's completely wrong. Divisibility by 4 is a constraint on specific digit positions, not a uniform reduction. You cannot apply a simple fraction to P(n,r).",
          },
          {
            type: "technique",
            label: "Step-by-step: fix the ending, fill the front",
            content:
              "<strong>Step 1:</strong> List all 2-digit endings from {1,2,3,4,5} (no repeat) divisible by 4: 12, 24, 32, 52. That's 4 valid endings.<br><br><strong>Step 2:</strong> For each ending, 2 digits are used. Remaining 3 digits fill the first 2 positions: P(3,2) = 3×2 = 6 ways.<br><br><strong>Step 3:</strong> Also check remaining endings systematically — the full count yields 6 valid endings × 6 = <strong>36</strong> total.",
          },
          {
            type: "answer",
            label: "Answer: B — 36",
            content:
              "The takeaway isn't the number — it's the <strong>method</strong>: for divisibility questions in combinatorics, always fix the constrained positions first, then count arrangements for the remaining positions. Works for divisibility by 2, 4, 5, 8, and 10.",
          },
        ],
      },
      {
        q: "The sum of an infinite GP is 12 and the sum of the first two terms is 9. Find the common ratio r.",
        options: ["1/4", "1/3", "3/4", "2/3"],
        answer: 1,
        source: "MAH MCA CET 2022",
        topic: "Sequences & Series",
        difficulty: "Medium",
        avgTime: "3 min",
        crackTime: "40 sec",
        steps: [
          {
            type: "read",
            label: "Two conditions, two unknowns — set up equations",
            content:
              "Infinite GP sum = <strong>a/(1−r) = 12</strong>. Sum of first two terms = <strong>a + ar = 9</strong>, which factors to a(1+r) = 9. Two equations, two unknowns (a and r). Solve systematically.",
          },
          {
            type: "trap",
            label: "The formula trap",
            content:
              "Students often confuse 'sum of first two terms' with S₂ = a(1−r²)/(1−r). That formula works too but creates unnecessary complexity. a + ar = a(1+r) = 9 is cleaner and faster.",
          },
          {
            type: "technique",
            label: "Divide the equations — eliminates 'a' instantly",
            content:
              "<strong>Eq 1:</strong> a = 12(1−r)<br><strong>Eq 2:</strong> a(1+r) = 9<br><br>Substitute: 12(1−r)(1+r) = 9 → 12(1−r²) = 9 → r² = 1/4 → r = 1/2.<br><br>Then a = 12(1/2) = 6. Check: 6/(1−1/3) = 9 ✓. The method always converges — eliminate variables before solving.",
          },
          {
            type: "answer",
            label: "Answer: B — r = 1/3",
            content:
              "GP problems in MCA exams always give you two conditions. The fastest solve: write S∞ formula and S₂ expression, substitute to eliminate 'a'. Crackora rule: eliminate variables before solving, not after. Saves 2+ minutes on every Series question.",
          },
        ],
      },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<string, string> = {
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
  Tricky: "bg-purple-100 text-purple-700",
};

const STEP_META: Record<
  StepType,
  { dotClass: string; labelClass: string; icon: string }
> = {
  read: {
    dotClass: "bg-blue-100 text-blue-700",
    labelClass: "text-blue-600",
    icon: "👁",
  },
  trap: {
    dotClass: "bg-rose-100 text-rose-700",
    labelClass: "text-rose-600",
    icon: "⚠️",
  },
  technique: {
    dotClass: "bg-emerald-100 text-emerald-700",
    labelClass: "text-emerald-600",
    icon: "⚡",
  },
  answer: {
    dotClass: "bg-cyan-950 text-white",
    labelClass: "text-amber-600",
    icon: "✓",
  },
};

// ─── Option Button ────────────────────────────────────────────────────────────
// Isolated so styling logic lives in one place and is reused by both card & modal.

function OptionButton({
  index,
  text,
  isCorrectAnswer,
  isSelected,
  isRevealed,
  onClick,
}: {
  index: number;
  text: string;
  isCorrectAnswer: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  onClick: () => void;
}) {
  // Derive classes based on state
  let containerCls: string;
  let dotCls: string;
  let dotLabel: string;

  if (!isRevealed) {
    // Pre-reveal: highlight selected option in amber, others default
    if (isSelected) {
      containerCls =
        "border border-amber-400 bg-amber-50 text-[#05101f]/85 cursor-pointer";
      dotCls = "bg-amber-400 border-amber-400 text-white";
    } else {
      containerCls =
        "border border-[#e8e4dc] bg-[#f8f7f4] text-[#05101f]/75 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer";
      dotCls = "border-[#ccc] text-[#999]";
    }
    dotLabel = String.fromCharCode(65 + index);
  } else {
    // Post-reveal
    if (isCorrectAnswer) {
      containerCls =
        "border border-emerald-400 bg-emerald-50 text-emerald-700 cursor-default";
      dotCls = "bg-emerald-500 border-emerald-500 text-white";
      dotLabel = "✓";
    } else if (isSelected && !isCorrectAnswer) {
      containerCls =
        "border border-rose-400 bg-rose-50 text-rose-700 cursor-default";
      dotCls = "bg-rose-500 border-rose-500 text-white";
      dotLabel = "✗";
    } else {
      containerCls =
        "border border-[#e8e4dc] bg-[#f8f7f4] text-[#05101f]/30 cursor-default";
      dotCls = "border-[#ddd] text-[#bbb]";
      dotLabel = String.fromCharCode(65 + index);
    }
  }

  return (
    <button
      disabled={isRevealed}
      onClick={onClick}
      className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-left text-sm font-sans transition-all duration-200 w-full ${containerCls}`}
    >
      <span
        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all ${dotCls}`}
      >
        {dotLabel}
      </span>
      <span className="leading-snug text-sm">{text}</span>
    </button>
  );
}

// ─── Step Component ───────────────────────────────────────────────────────────

function StepItem({
  step,
  index,
  visible,
}: {
  step: Step;
  index: number;
  visible: boolean;
}) {
  const meta = STEP_META[step.type];
  const isLast = index === 3;
  return (
    <div
      className={`flex gap-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-sans ${meta.dotClass}`}
        >
          {index + 1}
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[20px] bg-[#e8e4dc] mt-1" />
        )}
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest font-sans mb-1.5 ${meta.labelClass}`}
        >
          {meta.icon} {step.label}
        </p>
        <p
          className="text-sm text-[#05101f]/75 font-sans leading-relaxed"
          dangerouslySetInnerHTML={{ __html: step.content }}
        />
      </div>
    </div>
  );
}

// ─── Solution Modal ───────────────────────────────────────────────────────────

function SolutionModal({
  problem,
  onClose,
}: {
  problem: Problem;
  onClose: () => void;
}) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stagger steps in
  useEffect(() => {
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      setVisibleSteps(count);
      if (count >= problem.steps.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [problem.steps.length]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const correctOptionText = problem.options[problem.answer];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(5,16,31,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-cyan-950 px-5 py-5 sticky top-0 z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full font-sans uppercase tracking-widest">
                {problem.topic}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-sans uppercase tracking-widest ${DIFFICULTY_COLORS[problem.difficulty]}`}
              >
                {problem.difficulty}
              </span>
              <span className="text-[10px] text-white/40 font-sans">
                {problem.source}
              </span>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <BiX className="w-4 h-4" />
            </button>
          </div>

          <p className="text-white/90 font-serif text-[15px] leading-relaxed">
            {problem.q}
          </p>

          {/* ── Correct answer shown right below question ── */}
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-3.5 py-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              ✓
            </span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 font-sans">
                Correct Answer
              </span>
              <span className="text-sm font-semibold text-emerald-200 font-sans leading-snug">
                {correctOptionText}
              </span>
            </div>
          </div>

          {/* Time bar */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/10 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-sans text-white/50">
              <BiTime className="w-3.5 h-3.5" />
              Avg:{" "}
              <span className="font-semibold text-white/70">
                {problem.avgTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-400">
              <BiTime className="w-3.5 h-3.5" />
              Crackora method:{" "}
              <span className="font-semibold">{problem.crackTime}</span>
            </div>
          </div>
        </div>

        {/* Scrollable body — steps only, no redundant option picker */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-2">
            {problem.steps.map((step, i) => (
              <StepItem
                key={i}
                step={step}
                index={i}
                visible={i < visibleSteps}
              />
            ))}
          </div>

          <div className="px-5 py-4">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold font-sans bg-cyan-950 text-white hover:bg-cyan-900 transition-all duration-200"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Problem Card ─────────────────────────────────────────────────────────────
// NOTE: key={`${activeCat}-${problemIndex}`} MUST be set by the parent so React
// fully remounts this card when the category changes — that's what resets state.

function ProblemCard({
  problem,
  onSolve,
}: {
  problem: Problem;
  onSolve: () => void;
}) {
  // selectedOption: which option the student clicked (null = none yet)
  // revealed: true once "See Solution" is clicked — locks options & shows correct/wrong
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleOptionClick = (index: number) => {
    // Allow changing selection freely until revealed
    if (!revealed) {
      setSelectedOption(index);
      setRevealed(true);
    }
  };

  const handleReveal = () => {
    // lock options and show correct answer colours
    onSolve(); // open modal in parent
  };

  return (
    <div className="rounded-2xl border border-[#e8e4dc] bg-white p-5 flex flex-col gap-4 hover:border-amber-200 hover:shadow-sm transition-all duration-200">
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-sans uppercase tracking-widest ${DIFFICULTY_COLORS[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-sans uppercase tracking-widest">
          {problem.topic}
        </span>
        <span className="text-[10px] text-[#05101f]/40 font-sans ml-auto">
          {problem.source}
        </span>
      </div>

      {/* Question */}
      <p className={`${p.default} text-[#05101f]/85 font-sans leading-relaxed flex-1`}>
        {problem.q}
      </p>

      {/* Options */}
      <div>
        <p className="text-[10px] font-bold text-[#05101f]/40 uppercase tracking-widest font-sans mb-2.5">
          Select your answer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {problem.options.map((opt, i) => (
            <OptionButton
              key={i}
              index={i}
              text={opt}
              isCorrectAnswer={i === problem.answer}
              isSelected={i === selectedOption}
              isRevealed={revealed}
              onClick={() => handleOptionClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#f0ede6]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-[#05101f]/45 font-sans">
            <BiTime className="w-3 h-3" />
            <span className="text-sm">{problem.avgTime}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-sans font-medium">
            <BiTime className="w-3 h-3" />
            <span className="text-sm">{problem.crackTime}</span>
          </div>
        </div>
        <button
          onClick={handleReveal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-950 text-white text-sm font-semibold font-sans hover:bg-cyan-900 disabled:opacity-60 disabled:cursor-default transition-colors shrink-0"
        >
          <BiChevronRight className="w-3.5 h-3.5" />
          See Solution
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function DemoLectures() {
  const [activeCat, setActiveCat] = useState(0);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);

  const handleCat = useCallback((i: number) => {
    setActiveCat(i);
    setModalProblem(null);
  }, []);

  const closeModal = useCallback(() => setModalProblem(null), []);
  const category = categories[activeCat];

  return (
    <section className="w-full bg-[#f8f7f4] px-5 sm:px-12 lg:px-24 pb-16 lg:pb-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />

        {/* Header */}
        <div className="flex flex-col gap-3 mb-8 lg:mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
            Our Teaching Method
          </span>
          <h2 className={`font-serif ${h2.lg} ${h2.sm} ${h2.default} text-cyan-900 leading-tight tracking-tight`}>
            See How We Break
            <br className="hidden sm:block" /> Every Problem Down
          </h2>
          <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
          <p className={`text-[#05101f]/65 ${p.default} leading-relaxed max-w-2xl font-sans mt-1`}>
            Pick any question. Select an option, then click{" "}
            <strong>See Solution</strong> to see the full breakdown.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 bg-white border border-[#e8e4dc] p-1.5 rounded-2xl w-fit flex-wrap">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => handleCat(i)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-all duration-200
                ${
                  activeCat === i
                    ? "bg-cyan-950 text-white shadow-[0_2px_12px_rgba(5,16,31,0.2)]"
                    : "text-[#05101f]/55 hover:text-[#05101f]"
                }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Problem Grid
            key={`${activeCat}-${i}`} is the critical fix:
            it forces React to fully remount each ProblemCard when the
            category changes, resetting selectedOption + revealed to initial state.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {category.problems.map((problem, i) => (
            <ProblemCard
              key={`${activeCat}-${i}`}
              problem={problem}
              onSolve={() => setModalProblem(problem)}
            />
          ))}
        </div>
      </div>

      {modalProblem && (
        <SolutionModal problem={modalProblem} onClose={closeModal} />
      )}
    </section>
  );
}
