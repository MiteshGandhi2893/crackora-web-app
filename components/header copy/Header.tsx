import { useEffect, useRef, useState } from "react";
import { Info } from "./Info";
import { LoginRegister } from "./LoginRegister";
import { Logo } from "./Logo";
import { DashboardButton } from "./DashboardButton";
import { Navbar } from "./Navbar";
import { Search } from "./Search";
import { SocialMedia } from "./SocialMedia";
import { useLocation } from "react-router-dom";
import { UserStatus } from "./UserStatus";
import { useAuth } from "../../context/AuthContext";

function MobileMenu({ isMenuOpen, setIsMenuOpen, isLoggedIn }: any) {
  return (
    <div
      className={`lg:hidden fixed inset-0 w-full h-screen bg-gradient-to-b z-999 from-white to-sky-100 transform transition-transform duration-500 ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-end cursor-pointer z-200">
        <div className="w-full h-16 flex bg-white px-5 border-b items-center justify-between border-gray-200">
          <Logo />
          <img
            src="/assets/close.svg"
            alt="Close Menu"
            className="w-8 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
        <div className="p-5">
          <Search />
        </div>
        <div className="p-5">
          <Navbar mobile />
        </div>
        <div className="flex justify-center gap-5">
          <LoginRegister mobile />
          <DashboardButton isVisible={isLoggedIn} />
        </div>
        <div className="flex justify-center mt-5">
          <Info mobile />
        </div>
        <div className="flex justify-center mt-5">
          <SocialMedia mobile />
        </div>
      </div>
    </div>
  );
}

export function Header({
  onCoursesClicked,
  onScrolled,
  onExamsInfoClicked,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const triggerRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();

  const isLoggedIn = user?.username ? true : false;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const scrolled = y > 50;
      setIsScrolled(scrolled);
      onScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize once

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Hide header on dashboard route
  if (location.pathname === "/dashboard") return null;

  return (
    <>
      {/* Desktop Header (Sticky on scroll) */}
      <div
        className={`hidden lg:flex flex-col w-full bg-white z-200 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 shadow-md" : "relative"
        }`}
      >
        {/* Logo + Search + Buttons */}
        <div className="w-full h-20 px-28 border-b border-gray-200 flex items-center gap-5 pt-3">
          <Logo />
          <div className="flex-grow flex">{/* <Search /> */}</div>
          <div className="flex items-center gap-5">
            {!isLoggedIn && <LoginRegister mobile={true} />}
            <DashboardButton isVisible={isLoggedIn} />
          </div>
        </div>

        {/* Navbar */}
        <div className="w-full h-13 px-30 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <Navbar
            onCoursesClicked={onCoursesClicked}
            onExamsInfoClicked={onExamsInfoClicked}
          />
          {isLoggedIn && <UserStatus />}
        </div>
      </div>

      {/* Mobile Menu (slide-in) */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
      />

      {/* Sticky Mobile Header */}
      {!isMenuOpen && (
        <div
          className={`lg:hidden w-full h-16 flex items-center bg-white px-5 border-b border-gray-200 z-100 ${
            isScrolled ? "fixed top-0 left-0 w-full shadow-md " : ""
          }`}
        >
          <Logo />
          <img
            src="/assets/hamburger.png"
            alt="Open Menu"
            className="w-8 cursor-pointer ml-auto"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      )}

      {/* Scroll Trigger */}
      <div
        ref={triggerRef}
        className="absolute lg:top-[100px] top-[10px] w-full h-[1px]"
      ></div>
    </>
  );
}
