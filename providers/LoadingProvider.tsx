"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Backdrop } from "@mui/material";
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

      <Backdrop
        open={open}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Spinning logo */}
        <div className="flex flex-col items-center bg-amber-100/80 p-2 rounded-lg">
          <div
            style={{
              animation: "spin 2s linear infinite",
              width: 64,
              height: 64,
              position: "relative",
            }}
          >
            <Image src={"/monogram.svg"} alt="loader" fill />
          </div>
          
        </div>

        <style>{`
          @keyframes spin {
            0%   { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      </Backdrop>
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoader must be used inside LoadingProvider");
  return ctx;
}
