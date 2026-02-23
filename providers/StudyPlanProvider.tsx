"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { StudyPlannerModal } from "@/modals/StudyPlannerModal";
import { Entrance, Exam } from "@/interfaces/entrance-interface";

// --- Type Definitions ---

export interface StudyPlanForm {
  entrance: Entrance | null;
  exam: Exam | null;
  examDate: Date | null;
  prepStartDate: Date | null;
  hoursPerWeekday: number;
  hoursPerWeekend: number;
  examPrepLevel: string;
}

interface StudyPlannerContextType {
  isOpen: boolean;
  openPlanner: () => void;
  closePlanner: () => void;
  studyPlanForm: StudyPlanForm;
  setStudyPlanForm: (plan: Partial<StudyPlanForm>) => void;
  resetStudyPlanForm: () => void;
}

const defaultPlan: StudyPlanForm = {
  entrance: null,
  exam: null,
  examDate: null,
  prepStartDate: null,
  hoursPerWeekday: 4,
  hoursPerWeekend: 4,
  examPrepLevel: "intermediate",
};

const StudyPlannerContext = createContext<StudyPlannerContextType | undefined>(
  undefined
);

// --- Provider Component ---

export function StudyPlannerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [studyPlanForm, setStudyPlanFormInternal] = useState<StudyPlanForm>(
    defaultPlan
  );

  const openPlanner = () => setIsOpen(true);
  const closePlanner = () => setIsOpen(false);

  const setStudyPlanForm = useCallback(
    (plan: Partial<StudyPlanForm>) => {
      setStudyPlanFormInternal((prev) => ({
        ...prev,
        ...plan,
      }));
    },
    []
  );

  const resetStudyPlanForm = () => {
    setStudyPlanFormInternal(defaultPlan);
  };

  return (
    <StudyPlannerContext.Provider
      value={{
        isOpen,
        openPlanner,
        closePlanner,
        studyPlanForm,
        setStudyPlanForm,
        resetStudyPlanForm,
      }}
    >
      {children}

      {isOpen && (
        <StudyPlannerModal
          onClose={() => {
            closePlanner();
            resetStudyPlanForm();
          }}
        />
      )}
    </StudyPlannerContext.Provider>
  );
}

// --- Hook for Components ---

export function useStudyPlanner() {
  const ctx = useContext(StudyPlannerContext);
  if (!ctx) throw new Error("useStudyPlanner must be used inside StudyPlannerProvider");
  return ctx;
}
