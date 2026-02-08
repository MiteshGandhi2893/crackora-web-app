"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/modals/AuthModal";

export interface User {
  id: string;
  name: string;
  email: string;
  // add other fields as needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  openAuth: () => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        openAuth: () => setIsOpen(true),
        closeAuth: () => setIsOpen(false),
      }}
    >
      {children}
      {isOpen && <AuthModal />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
