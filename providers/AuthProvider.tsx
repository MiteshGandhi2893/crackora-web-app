"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AuthModal } from "@/modals/AuthModal";
import { authService } from "@/services/Authentication.service";

export interface User {
  username: string;
  fullname: string;
  email: string;
  roles: [string];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
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
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.signInStatus(); // endpoint that returns user if JWT is valid
        if (res?.user) {
          setUser(res?.user as User);
        }
      } catch (err) {
        console.log("No valid JWT or failed to fetch user", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
