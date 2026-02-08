"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { coursesService } from "@/services/courses.service";
import { Entrance } from "@/interfaces/entrance-interface";

type ExamContextType = {
  entrances: Entrance[];
  loading: boolean;
  error?: string;
};

const ExamContext = createContext<ExamContextType | null>(null);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    coursesService
      .getCoursesByExam()
      .then(setEntrances)
      .catch((err) => {
        console.error(err);
        setError("Failed to load exams");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ExamContext.Provider value={{ entrances, loading, error }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExams() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExams must be used inside ExamProvider");
  return ctx;
}
