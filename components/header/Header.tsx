"use client";
import { Navbar } from "./Navbar";
import { LoginStatus } from "../app-buttons/login-button";
import { useState } from "react";
import { MegaExamInfoMenu } from "./meg-menus/ExamMegaMenu";
import { BiAlignRight } from "react-icons/bi";
import { MobileMenu } from "./mobile-menu";
import { Logo } from "./Logo";
import { useExamMenu } from "@/providers/MenuUIProvider";
import { PackageMegaMenu } from "./meg-menus/PackageExamMenu";
import { PreviousPaperMegaMenu } from "./meg-menus/PreviousPaperMegaMenu";

export function Header() {
  const { openExams, setOpenExams, openPackages, setOpenPackage, openPaperSets, setOpenPaperSets } =
    useExamMenu();
  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = () => {
    const flag = !mobileMenu;
    setMobileMenu(flag);
  };

  const examsInfoHandler = () => {
    setOpenPackage(false);
    setOpenExams(true);
    setOpenPaperSets(false);
  };

  const packagesInfoHandler = () => {
    setOpenExams(false);
    setOpenPackage(true);
    setOpenPaperSets(false);

  };

  
  const papersInfoHandler = () => {
    setOpenExams(false);
    setOpenPackage(false);
    setOpenPaperSets(true);

  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b shadow z-50 lg:px-24 md:px-10 px-5">
        {/* Row 1: Logo · paid nav (Courses etc.) · login/profile */}
        <div className="h-16 flex items-center justify-between lg:max-w-6xl sm:max-w-3xl mx-auto border-b border-b-amber-600/20">
          <div className="flex justify-center items-center gap-5">
            <Logo />
            <div className="lg:block hidden">
              <Navbar
                group="paid"
                onExamsInfoClicked={examsInfoHandler}
                onPackagesInfoClicked={packagesInfoHandler}
                onPreviousPaperInfoClicked={papersInfoHandler}

              />
            </div>
          </div>

          <div className="hidden lg:block">
            <LoginStatus />
          </div>
          <div onClick={toggleMenu} className="lg:hidden block">
            <BiAlignRight className="w-8 h-8 text-cyan-950/95 cursor-pointer" />
          </div>
        </div>

        {/* Row 2: free resources (Exams, Papers etc.) */}
        <div className="hidden lg:flex lg:flex-col items-start  lg:max-w-6xl sm:max-w-3xl mx-auto pb-2 mt-2">
          <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-amber-900/50 whitespace-nowrap">
            Free Resources
          </span>
          <Navbar
            group="free"
            onExamsInfoClicked={examsInfoHandler}
            onPackagesInfoClicked={packagesInfoHandler}
             onPreviousPaperInfoClicked={papersInfoHandler}
          />
        </div>
      </header>

      {openExams && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-30"
            onClick={() => setOpenExams(false)}
          ></div>
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 shadow-2xl rounded-b-md transition-all duration-200 w-[70%]">
            <MegaExamInfoMenu onClose={() => setOpenExams(false)} />
          </div>
        </>
      )}

      {openPackages && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-30"
            onClick={() => setOpenPackage(false)}
          ></div>
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 shadow-2xl rounded-b-md transition-all duration-200 w-[70%]">
            <PackageMegaMenu onClose={() => setOpenPackage(false)} />
          </div>
        </>
      )}

      {openPaperSets && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-30"
            onClick={() => setOpenPaperSets(false)}
          ></div>
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 shadow-2xl rounded-b-md transition-all duration-200 w-[70%]">
            <PreviousPaperMegaMenu onClose={() => setOpenPaperSets(false)} />
          </div>
        </>
      )}
      <MobileMenu open={mobileMenu} onClose={toggleMenu} />
    </>
  );
}
