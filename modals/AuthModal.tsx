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
import { BiX } from "react-icons/bi";

export function AuthModal() {
  const { closeAuth, setUser, postAuthAction, setPostAuthAction } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showLeft, setShowLeft] = useState(true);
  const { showMessage } = useSnackbar();

  const handleSuccess = (user: any) => {
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
      disableEscapeKeyDown
      // ── removed onClose so clicking the backdrop does nothing ──
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.9)" } }}
    >
      <div className="lg:h-[80vh] flex relative">

        {/* ── Close button ───────────────────────────────────────── */}
        <button
          onClick={closeAuth}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-lg bg-cyan-950 hover:bg-rose-600 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          <BiX className="w-5 h-5 text-white" />
        </button>

        {/* Left panel */}
        {showLeft && (
          <div className="w-1/2 bg-cyan-950 lg:flex hidden p-5 justify-center items-center h-full relative">
            <Image src="/login.svg" fill alt="Login illustration" />
          </div>
        )}

        {/* Right form */}
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