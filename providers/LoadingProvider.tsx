"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
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

      {/* ✅ Full screen blackout overlay */}
      <Backdrop
        open={open}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // darkness level
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Image src={"/monogram.svg"} alt="loader" fill />
          </div>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoader must be used inside LoadingProvider");
  return ctx;
}
