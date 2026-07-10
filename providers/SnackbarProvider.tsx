"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Severity } from "@/interfaces/authentication-interface";

interface SnackbarContextType {
  showMessage: (message: string, severity?: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("info");

  const showMessage = (msg: string, sev: Severity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  // ✅ Auto close (same as MUI)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [open]);

  // ✅ Color mapping
  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  }[severity];

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      {/* ✅ Only render when needed */}
      {open && (
        <div className="fixed top-5 right-5 z-[9999] animate-slide-in">
          <div
            className={`text-white px-4 py-3 rounded-lg shadow-lg ${bgColor} min-w-[250px] max-w-sm`}
          >
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm">{message}</span>

              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used inside SnackbarProvider");
  return ctx;
}