"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "@mui/material";
import { useState } from "react";
import { SignIn } from "../components/login/SignIn";
import { SignUp } from "../components/login/SignUp";
import { useModal } from "../context/ModalContext";
import Image from "next/image";

export function LoginModal(props: any) {
  const { onClose, source, loginFlag } = props;
  const [isLogin, setIsLogin] = useState(loginFlag);
  const { openModal, closeModal } = useModal();
  // const navigate = useNavigate();

  const handleIsLogin = (flag: boolean) => {
    setIsLogin(flag);
  };



  const handleMessage = (message: any) => {
    const messageType = message.messageType.toLowerCase();

    if (messageType === "success") {
      onClose({ success: true }); // Close login modal
      if (source === "header-click" && isLogin) {
        // navigate("/dashboard"); // Immediately redirect
      }
      openModal("MessageModal", {
        message: message.text,
        title: message.messageType,

        
        type: messageType,
      });
    } else {
      onClose({ success: false });
      openModal("MessageModal", {
        message: message.text,
        title: message.messageType,
        type: messageType,
        onClose: () => {
          closeModal();
          if (messageType === "error") {
            openModal("LoginModal", {});
          }
        },
      });
    }
  };



  return (
    <>
      <Dialog
        open
        disableEscapeKeyDown
        fullWidth
        maxWidth="md"
        onClose={(event, reason) => {
          console.log(event)
          if (source !== 'header-click' && (reason === "backdropClick" || reason === "escapeKeyDown")) {
            return; // Block closing from outside or ESC
          }
          onClose(); // Allow only explicit close
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        <div className="lg:h-[80vh] flex">
          <div className="w-1/2 bg-cyan-950 lg:flex hidden p-5 justify-center items-center h-full relative">
            <Image src="/assets/login.svg" className="opacity-85" fill  alt=""/>
          </div>
          <div className="lg:w-1/2 w-full h-full p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center text-2xl w-full justify-center text-cyan-900 font-sans tracking-wider relative">
              Welcome to{" "}
              <Image src="/assets/crackora-logo.svg" className="w-35 h-15" fill alt=""/>
            </div>
            <div className="flex w-full justify-center text-amber-700 mt-[-2%] text-sm">
              More Than Prep. It’s a Mindset.
            </div>

            {isLogin && (
              <SignIn
                handleIsLogin={handleIsLogin}
                sendMessage={handleMessage}
              />
            )}
            {!isLogin && <SignUp handleIsLogin={handleIsLogin} sendMessage={handleMessage} />}
          </div>
        </div>
      </Dialog>
    </>
  );
}
