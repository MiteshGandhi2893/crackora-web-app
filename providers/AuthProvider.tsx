/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthModal } from "@/modals/AuthModal";
import { authService } from "@/services/Authentication.service";

export interface User {
  username: string;
  fullname: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;

  openAuth: () => void;
  closeAuth: () => void;

  postAuthAction: (() => void) | null;
  setPostAuthAction: (action: (() => void) | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [postAuthAction, setPostAuthAction] = useState<(() => void) | null>(
    null,
  );

  // 🔥 Fetch user
  const refreshUser = async () => {
    try {
      const res = await authService.signInStatus();

      if (res.success && res.user) {
        setUser(res.user); // ✅ No TypeScript error
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // 🔥 Clear user
  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        logout,
        openAuth: () => setIsOpen(true),
        closeAuth: () => setIsOpen(false),
        postAuthAction,
        setPostAuthAction,
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
