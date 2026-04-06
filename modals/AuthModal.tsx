/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog } from "@mui/material";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { SignIn } from "@/components/login/SignIn";
import { SignUp } from "@/components/login/SignUp";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Logo } from "@/components/header/Logo";

export function AuthModal() {
  const { closeAuth, setUser, postAuthAction, setPostAuthAction } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showLeft, setShowLeft] = useState(true);
  const { showMessage } = useSnackbar();

  const handleSuccess = (user: any) => {
    // user object is already stored in tokenStore by authService.signIn —
    // we just push it into context so the UI reacts immediately
    setUser(user);
    closeAuth();
    if (postAuthAction) {
      postAuthAction();
      setPostAuthAction(null);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={closeAuth}
      disableEscapeKeyDown
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.9)" } }}
    >
      <div className="lg:h-[80vh] flex">
        {/* Left panel — hidden when T&C overlay is shown */}
        {showLeft && (
          <div className="w-1/2 bg-cyan-950 lg:flex hidden p-5 justify-center items-center h-full relative">
            <Image src="/login.svg" fill alt="Login illustration" />
          </div>
        )}

        {/* Right form — expands to full width when T&C is shown */}
        <div
          className={`${
            showLeft ? "lg:w-1/2" : "w-full"
          } w-full h-full p-4 flex flex-col overflow-y-auto justify-center bg-[#f8f7f4]`}
        >
          <div className="flex gap-3 items-center justify-center text-2xl text-cyan-900 font-sans tracking-wider relative">
            <Logo />
          </div>

          {isLogin ? (
            <SignIn
              handleIsLogin={setIsLogin}
              sendMessage={(msg) => showMessage(msg.text, msg.severity)}
              onSuccess={handleSuccess}
            />
          ) : (
            <SignUp
              handleIsLogin={setIsLogin}
              isTermsShown={(shown: boolean) => setShowLeft(!shown)}
              sendMessage={(msg: any) => showMessage(msg.text, msg.severity)}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}