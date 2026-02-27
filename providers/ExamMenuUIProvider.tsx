"use client";

import { createContext, useContext, useState } from "react";

type ExamMenuContextType = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const ExamMenuContext = createContext<ExamMenuContextType | null>(null);

export function ExamMenuUIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ExamMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </ExamMenuContext.Provider>
  );
}

export function useExamMenu() {
  const context = useContext(ExamMenuContext);
  if (!context) {
    throw new Error("useExamMenu must be used within PublicUIProvider");
  }
  return context;
}