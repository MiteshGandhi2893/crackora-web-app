"use client";

import { createContext, useContext, useState } from "react";

type MenuContextType = {
  openExams: boolean;
  openPackages: boolean;
  setOpenExams: (val: boolean) => void;
  setOpenPackage: (val: boolean) => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuUIProvider({ children }: { children: React.ReactNode }) {
  const [openExams, setOpenExams] = useState(false);
  const [openPackages, setOpenPackage] = useState(false);

  return (
    <MenuContext.Provider
      value={{ openExams, openPackages, setOpenExams, setOpenPackage }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useExamMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within PublicUIProvider");
  }
  return context;
}
