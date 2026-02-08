// context/ExamProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { Entrance } from "@/interfaces/entrance-interface";

const ExamContext = createContext<Entrance[] | null>(null);

export function ExamProvider({
  entrances,
  children,
}: {
  entrances: Entrance[];
  children: React.ReactNode;
}) {
  return (
    <ExamContext.Provider value={entrances}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExams() {
  const ctx = useContext(ExamContext);
  if (!ctx) {
    throw new Error("useExams must be used inside ExamProvider");
  }
  return ctx;
}
