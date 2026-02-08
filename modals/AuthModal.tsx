/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { SignIn } from "@/components/login/SignIn";
import { SignUp } from "@/components/login/SignUp";

export function AuthModal() {
  const router = useRouter();
  const { closeAuth, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // toggle forms

  const handleSuccess = (user: any) => {
    setUser(user); // save user globally
    closeAuth(); // close modal
    router.push("/dashboard"); // redirect
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={closeAuth} // <-- closes modal on backdrop click
      disableEscapeKeyDown // keep escape key disabled
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.9)" } }}
    >
      <div className="lg:h-[80vh] flex">
        {/* Left Image */}
        <div className="w-1/2 bg-cyan-950 lg:flex hidden p-5 justify-center items-center h-full relative">
          <Image src="/login.svg" fill alt="Login illustration" />
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 w-full h-full p-4 flex flex-col overflow-y-auto justify-center">
          <div className="flex items-center justify-center text-2xl text-cyan-900 font-sans tracking-wider relative mb-1">
            Welcome to
            <div className="relative w-35 h-15 ml-2 flex items-start">
              <Image src="/crackora-logo.svg" fill alt="Crackora" />
            </div>
          </div>
          <div className="flex w-full justify-center text-amber-700 mt-[-2%] text-sm">
            More Than Prep. It’s a Mindset.
          </div>

          {/* Form */}
          {isLogin ? (
            <SignIn
              handleIsLogin={setIsLogin}
              sendMessage={(msg) => console.log(msg)}
              onSuccess={handleSuccess}
            />
          ) : (
            <SignUp
              handleIsLogin={setIsLogin}
              sendMessage={(msg: any) => console.log(msg)}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
