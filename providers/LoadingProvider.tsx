"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";

interface LoadingContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        showLoader: () => setOpen(true),
        hideLoader: () => setOpen(false),
      }}
    >
      {children}

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center bg-amber-100/80 p-2 rounded-lg">
            <div
              className="relative w-16 h-16 animate-spin"
            >
              <Image src="/monogram.svg" alt="loader" fill />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoader must be used inside LoadingProvider");
  return ctx;
}