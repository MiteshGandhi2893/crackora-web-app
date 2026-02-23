"use client";
import Image from "next/image";
import { Navbar } from "./Navbar";
import { LoginStatus } from "../app-buttons/login-button";
import { useState } from "react";
import { MegaExamInfoMenu } from "./meg-menus/ExamMegaMenu";
import Link from "next/link";
import { BiAlignRight } from "react-icons/bi";
import { MobileMenu } from "./mobile-menu";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = () => {
    const flag = !mobileMenu;
    setMobileMenu(flag);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b shadow z-50 lg:px-30 md:px-10 px-5 ">
        <div className="h-full flex items-center justify-between">
         <Logo/>
          <div className="lg:block hidden">
            <Navbar onExamsInfoClicked={() => setOpen(true)} />
          </div>

          <div className="hidden lg:block">
            <LoginStatus />
          </div>
          <div onClick={toggleMenu} className="lg:hidden block">
            <BiAlignRight className="w-8 h-8 text-cyan-950/95 cursor-pointer" />
          </div>
        </div>
      </header>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-30"
            onClick={() => setOpen(false)}
          ></div>
          <div
            className="
    fixed
    top-16
    left-1/2
    -translate-x-1/2
    w-[70%]
    h-[calc(100vh-4rem)]
    z-40
    bg-white
    border border-gray-200
    shadow-2xl
    rounded-b-md
    transition-all
    duration-200
  "
          >
            <MegaExamInfoMenu onClose={() => setOpen(false)} />
          </div>
        </>
      )}

      <MobileMenu open={mobileMenu} onClose={toggleMenu} />
    </>
  );
}
