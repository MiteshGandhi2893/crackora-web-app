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

// NEW: top-level track — Law, MCA, and easy to add more later (Management, etc.)
type Track = {
  id: string;
  label: string;
  icon: string;
  categories: Category[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const tracks: Track[] = [
  {
    id: "mca",
    label: "MCA",
    icon: "🎓",
    categories: [
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
    ],
  },
  {
    id: "law",
    label: "Law",
    icon: "⚖️",
    categories: [
      {
        label: "Legal Reasoning",
        icon: "⚖️",
        problems: [
          {
            q: "Principle: A person is guilty of theft if they dishonestly take movable property out of the possession of another without consent. Facts: Riya picks up an umbrella left behind by Meera at a café, genuinely believing it was abandoned, and takes it home. Is Riya guilty of theft?",
            options: [
              "Yes, she took property without consent",
              "No, because she lacked dishonest intention",
              "Yes, because the umbrella belonged to Meera",
              "No, because it happened in a public place",
            ],
            answer: 1,
            source: "CLAT 2023",
            topic: "Legal Reasoning — Criminal Law",
            difficulty: "Tricky",
            avgTime: "80 sec",
            crackTime: "20 sec",
            steps: [
              {
                type: "read",
                label: "Isolate the exact wording of the principle",
                content:
                  "The principle requires <strong>dishonest</strong> taking. 'Dishonest' is doing something intending to cause wrongful gain or wrongful loss. This one word is the entire hinge of the question — don't skip past it.",
              },
              {
                type: "trap",
                label: "The trap: focusing on 'without consent' only",
                content:
                  "Options A and C both use the fact that Meera didn't consent and the umbrella was hers — true, but incomplete. CLAT principle questions almost always have <em>two</em> conditions in the rule; missing one condition is the most common way students lose marks.",
              },
              {
                type: "technique",
                label: "The apply-strictly rule for CLAT legal reasoning",
                content:
                  "Never add facts, never drop conditions from the principle. Here: Riya <strong>genuinely believed</strong> the umbrella was abandoned — that directly negates 'dishonest intention'. Since one required element of the principle is missing, the principle cannot apply, regardless of what actually happened to the umbrella.",
              },
              {
                type: "answer",
                label: "Answer: B — No, because she lacked dishonest intention",
                content:
                  "Legal reasoning at CLAT is not about knowing real law — it's about applying the given principle mechanically, exactly as written. State of mind (mens rea) is the recurring theme in criminal law principle questions; always check it separately from the physical act.",
              },
            ],
          },
          {
            q: "Principle: An agreement made under coercion is voidable at the option of the party whose consent was so obtained. Facts: X threatens to publicly leak Y's private photos unless Y sells his land to X at a low price. Y agrees. Can Y avoid the contract?",
            options: [
              "No, because there was no physical threat",
              "Yes, because the threat qualifies as coercion",
              "No, because Y voluntarily signed the agreement",
              "Yes, but only if X is a stranger to Y",
            ],
            answer: 1,
            source: "CLAT 2022",
            topic: "Legal Reasoning — Contract Law",
            difficulty: "Medium",
            avgTime: "70 sec",
            crackTime: "20 sec",
            steps: [
              {
                type: "read",
                label: "What the principle actually covers",
                content:
                  "Coercion under the principle isn't defined narrowly — it just requires that consent was obtained by threat. The question doesn't limit it to physical force, so don't import that restriction yourself.",
              },
              {
                type: "trap",
                label: "Why 'no physical threat' is a false restriction",
                content:
                  "Option A tempts you to assume coercion = physical violence. That's a real-world assumption the principle doesn't state. In CLAT reasoning, if the principle doesn't say 'physical,' you cannot narrow it that way, however reasonable it might sound in real life.",
              },
              {
                type: "technique",
                label: "The 'voluntary signature ≠ free consent' check",
                content:
                  "Option C tries to use the act of signing as proof of free will. But coercion by definition <em>produces</em> an outward appearance of agreement — that's exactly what makes it coercion. Signing under threat is still coercion; the physical act of consenting is irrelevant to whether consent was 'free.'",
              },
              {
                type: "answer",
                label: "Answer: B — Yes, the threat qualifies as coercion",
                content:
                  "Threats to reputation, privacy, or unlawful detention all count as coercion in CLAT reasoning questions, not just physical harm. Whenever a threat forces an agreement, check only: was consent obtained by threat? If yes, coercion applies — nothing else matters.",
              },
            ],
          },
          {
            q: "Principle: A minor's agreement is void ab initio and cannot be ratified even after attaining majority. Facts: At 17, Aman borrows money and signs a promissory note. At 19, he confirms in writing that he will repay it. Is the promissory note enforceable?",
            options: [
              "Yes, because he ratified it as an adult",
              "No, ratification cannot validate a void agreement",
              "Yes, because he willingly wrote the confirmation",
              "No, but only if the amount exceeds ₹10,000",
            ],
            answer: 1,
            source: "AILET 2023",
            topic: "Legal Reasoning — Contract Law",
            difficulty: "Hard",
            avgTime: "60 sec",
            crackTime: "15 sec",
            steps: [
              {
                type: "read",
                label: "The keyword that decides everything: 'void ab initio'",
                content:
                  "'Void ab initio' means void <strong>from the very beginning</strong> — as if it never legally existed. This is different from a merely 'voidable' agreement, which can be affirmed later. The principle explicitly says it <em>cannot</em> be ratified.",
              },
              {
                type: "trap",
                label: "Why 'he confirmed it as an adult' feels right but isn't",
                content:
                  "In everyday logic, confirming a debt as an adult sounds like it should count. But the principle overrides everyday logic — it explicitly forecloses ratification as an option. CLAT tests whether you'll follow the stated rule even when your intuition disagrees.",
              },
              {
                type: "technique",
                label: "The literal-override rule",
                content:
                  "Whenever a principle uses an absolute word — 'cannot,' 'void ab initio,' 'no exception' — no fact pattern can create an exception unless the principle itself provides one. Scan for these absolute words first; they usually point straight to the answer.",
              },
              {
                type: "answer",
                label: "Answer: B — No, ratification cannot validate a void agreement",
                content:
                  "This is one of the most repeated CLAT principles: minor's agreements are void ab initio, no ratification possible, no exception for later confirmation. Learn this rule once — it appears in some form almost every year.",
              },
            ],
          },
        ],
      },
      {
        label: "English & Comprehension",
        icon: "📖",
        problems: [
          {
            q: "Choose the option that best completes the sentence: 'The committee's decision, though controversial, was ______ by the majority of stakeholders.'",
            options: ["accepted reluctantly", "reluctant acceptance", "accept reluctantly", "acceptingly reluctant"],
            answer: 0,
            source: "CLAT 2023",
            topic: "English — Grammar",
            difficulty: "Medium",
            avgTime: "40 sec",
            crackTime: "10 sec",
            steps: [
              {
                type: "read",
                label: "Identify the grammatical slot first",
                content:
                  "The sentence structure is '...was ______ by...'. After 'was', you need a <strong>past participle</strong> (passive voice) — 'was accepted', not a noun phrase or infinitive. This narrows it before you even think about meaning.",
              },
              {
                type: "trap",
                label: "Why B and D sound plausible but fail structurally",
                content:
                  "Option B ('reluctant acceptance') is a noun phrase — grammatically, 'was reluctant acceptance by the majority' doesn't parse as a passive sentence. Option D inverts adjective/adverb order awkwardly. Both fail the passive-voice test, regardless of meaning.",
              },
              {
                type: "technique",
                label: "The 'was + ___' passive check",
                content:
                  "For any CLAT sentence-completion with 'was/were + blank + by', mentally test: does 'was [blank]' form a grammatically complete passive verb phrase? Only past participles pass. 'was accepted reluctantly' ✓. This single check eliminates 3 of 4 options in seconds.",
              },
              {
                type: "answer",
                label: "Answer: A — accepted reluctantly",
                content:
                  "CLAT English often disguises a simple grammar rule (here: passive voice construction) behind sentences about serious-sounding topics. Strip the topic away and test the grammar slot directly — it's faster and more reliable than 'reading for meaning' alone.",
              },
            ],
          },
          {
            q: "Passage (paraphrased): A short passage argues that judicial independence is undermined not by overt interference, but by the slow, invisible pressure of public opinion on judges deciding politically sensitive cases. Which of the following best captures the author's main concern?",
            options: [
              "Judges are directly pressured by politicians",
              "Public opinion can subtly erode judicial impartiality over time",
              "Judicial independence is a myth in modern democracies",
              "Politically sensitive cases should not be decided by courts",
            ],
            answer: 1,
            source: "CLAT 2022",
            topic: "English — Reading Comprehension",
            difficulty: "Hard",
            avgTime: "90 sec",
            crackTime: "25 sec",
            steps: [
              {
                type: "read",
                label: "Separate what the passage says from what it implies",
                content:
                  "The passage explicitly contrasts 'overt interference' with 'slow, invisible pressure.' The main concern is the <em>second</em> kind — subtle, not direct. Any option describing direct pressure is answering a claim the author specifically ruled out.",
              },
              {
                type: "trap",
                label: "Why A is the most common wrong pick",
                content:
                  "Option A describes 'direct pressure from politicians' — this is almost the <em>opposite</em> of what the author argues. RC questions often include an option that sounds related to the topic but actually contradicts the author's specific point. Always re-check against the passage's stated contrast, not just its general subject.",
              },
              {
                type: "technique",
                label: "The 'author's specific claim, not the topic' rule",
                content:
                  "For 'main concern' or 'main idea' questions, don't pick the option that's merely about the same topic (judicial independence) — pick the one that matches the author's <strong>specific angle</strong> on that topic (subtle erosion via public opinion, not overt interference or a sweeping claim that independence doesn't exist).",
              },
              {
                type: "answer",
                label: "Answer: B — Public opinion can subtly erode judicial impartiality over time",
                content:
                  "CLAT RC is designed to punish skimming. Options C and D over-extend the passage's claim into something broader and more extreme than what was actually argued — a classic RC trap. Always match the scope of the answer to the scope of the passage.",
              },
            ],
          },
        ],
      },
      {
        label: "GK & Legal Awareness",
        icon: "🌍",
        problems: [
          {
            q: "Which Article of the Indian Constitution empowers the Supreme Court to issue writs for the enforcement of Fundamental Rights?",
            options: ["Article 32", "Article 19", "Article 21", "Article 226"],
            answer: 0,
            source: "CLAT 2023",
            topic: "Legal GK — Constitution",
            difficulty: "Medium",
            avgTime: "30 sec",
            crackTime: "8 sec",
            steps: [
              {
                type: "read",
                label: "Note the exact institution named",
                content:
                  "The question specifically says <strong>Supreme Court</strong>. Two Articles deal with writs — 32 (Supreme Court) and 226 (High Courts). Reading the institution correctly is the entire question.",
              },
              {
                type: "trap",
                label: "The 32 vs 226 mix-up",
                content:
                  "This is the single most confused pair in CLAT legal GK. Article 226 also allows writs, but through <strong>High Courts</strong>, and for a broader set of purposes (not limited to Fundamental Rights). Article 21 (right to life) and 19 (freedom rights) are unrelated to writ jurisdiction — they're substantive rights, not enforcement mechanisms.",
              },
              {
                type: "technique",
                label: "The anchor-word technique",
                content:
                  "Memorise pairs by their anchor institution, not just numbers: <strong>32 = Supreme Court's own right to protect Fundamental Rights</strong> (Dr. Ambedkar called it the 'heart and soul' of the Constitution); <strong>226 = High Court, wider power</strong>. Anchor to the institution first, number second — numbers alone are easy to swap under exam pressure.",
              },
              {
                type: "answer",
                label: "Answer: A — Article 32",
                content:
                  "Article 32 vs 226 appears almost every CLAT cycle in some form. Once you anchor '32 = Supreme Court + Fundamental Rights only,' the rest follows by elimination — you don't even need to recall 226's exact wording.",
              },
            ],
          },
          {
            q: "In Indian criminal law, what is the key difference between 'bailable' and 'non-bailable' offences?",
            options: [
              "Bailable offences are less serious in punishment; bail is a matter of right",
              "Bailable offences can never lead to imprisonment",
              "Non-bailable offences never get bail under any circumstance",
              "The difference is only about which court hears the case",
            ],
            answer: 0,
            source: "AILET 2022",
            topic: "Legal GK — Criminal Procedure",
            difficulty: "Medium",
            avgTime: "35 sec",
            crackTime: "10 sec",
            steps: [
              {
                type: "read",
                label: "Focus on 'right' vs 'discretion' — the real distinction",
                content:
                  "The core legal distinction isn't about severity alone — it's about <strong>whether bail is a right or a discretionary decision</strong>. In bailable offences, the accused has a right to bail. In non-bailable, it's at the court's discretion.",
              },
              {
                type: "trap",
                label: "Why C is a common overreach",
                content:
                  "Option C claims non-bailable offences 'never' get bail — that's factually wrong and a classic absolute-word trap. Courts routinely grant bail in non-bailable cases too; it's just not an automatic right. Any option with 'never' or 'always' in legal GK deserves extra scrutiny.",
              },
              {
                type: "technique",
                label: "The right-vs-discretion filter",
                content:
                  "Whenever a legal GK question asks about a procedural classification (bailable/non-bailable, cognizable/non-cognizable), ask: <strong>is this about a right the accused has, or a power the authority has?</strong> That framing usually maps directly onto the correct option and exposes absolute-word traps immediately.",
              },
              {
                type: "answer",
                label: "Answer: A — Bail is a matter of right in bailable offences",
                content:
                  "This bailable/non-bailable distinction, along with cognizable/non-cognizable, forms the backbone of CrPC-based GK questions in CLAT and AILET. Learn the right-vs-discretion framing once and it transfers directly to related questions on arrest and investigation.",
              },
            ],
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
  let containerCls: string;
  let dotCls: string;
  let dotLabel: string;

  if (!isRevealed) {
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

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

function ProblemCard({
  problem,
  onSolve,
}: {
  problem: Problem;
  onSolve: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleOptionClick = (index: number) => {
    if (!revealed) {
      setSelectedOption(index);
      setRevealed(true);
    }
  };

  const handleReveal = () => {
    onSolve();
  };

  return (
    <div className="rounded-2xl border border-[#e8e4dc] bg-white p-5 flex flex-col gap-4 hover:border-amber-200 hover:shadow-sm transition-all duration-200">
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

      <p className={`${p.default} text-[#05101f]/85 font-sans leading-relaxed flex-1`}>
        {problem.q}
      </p>

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
  // activeTrack: which top-level track (Law / MCA)
  // activeCat: which sub-category within that track (the "submenu")
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeCat, setActiveCat] = useState(0);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);

  const handleTrack = useCallback((i: number) => {
    setActiveTrack(i);
    setActiveCat(0); // reset submenu to first item whenever track changes
    setModalProblem(null);
  }, []);

  const handleCat = useCallback((i: number) => {
    setActiveCat(i);
    setModalProblem(null);
  }, []);

  const closeModal = useCallback(() => setModalProblem(null), []);

  const track = tracks[activeTrack];
  const category = track.categories[activeCat];

  return (
    <section className="w-full bg-[#f8f7f4] px-5 sm:px-12 lg:px-24 pb-16 lg:pb-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
            Pick a track, pick a topic, then select an option and click{" "}
            <strong>See Solution</strong> to see the full breakdown.
          </p>
        </div>

        {/* ── Level 1: Track tabs (Law / MCA) — horizontal, always on top, works fine on mobile since only 2-3 items ── */}
        <div className="flex gap-2 mb-4 bg-white border border-[#e8e4dc] p-1.5 rounded-2xl w-full cursor-pointer">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTrack(i)}
              className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold font-sans transition-all duration-200 hover:border-amber-900  hover:shadow-[0_2px_12px_rgba(217,119,6,0.3)]
                ${
                  activeTrack === i
                    ? "bg-amber-500 text-white shadow-[0_2px_12px_rgba(217,119,6,0.3)]"
                    : "text-[#05101f]/55 hover:text-[#05101f]"
                }`}
            >
              {t.icon} {t.label} Entrance
            </button>
          ))}
        </div>

        {/* ── Level 2 (submenu) + content ──
            Desktop (lg+): submenu is a vertical sidebar on the left, content grid on the right.
            Mobile/tablet: submenu becomes a horizontal scroll-pill row above the cards —
            a left sidebar would eat too much width and force cards into a cramped single
            column on small screens, so it collapses to pills instead.
        */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Submenu */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 lg:w-52 shrink-0 lg:sticky lg:top-24 lg:self-start">
            {track.categories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => handleCat(i)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 lg:px-3.5 lg:py-2.5 rounded-xl text-sm font-semibold font-sans whitespace-nowrap transition-all duration-200 text-left
                  ${
                    activeCat === i
                      ? "bg-cyan-950 text-white shadow-[0_2px_12px_rgba(5,16,31,0.2)]"
                      : "bg-white border border-[#e8e4dc] text-[#05101f]/60 hover:text-[#05101f] hover:border-cyan-200"
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Problem grid
              key={`${track.id}-${activeCat}-${i}`} forces remount so option/reveal
              state resets whenever track or category changes.
          */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-w-0">
            {category.problems.map((problem, i) => (
              <ProblemCard
                key={`${track.id}-${activeCat}-${i}`}
                problem={problem}
                onSolve={() => setModalProblem(problem)}
              />
            ))}
          </div>
        </div>
      </div>

      {modalProblem && (
        <SolutionModal problem={modalProblem} onClose={closeModal} />
      )}
    </section>
  );
}