"use client";
// HeroSlider.tsx — CLIENT COMPONENT
// Left side is static. Right side is an auto-sliding image carousel
// (Swiper) where each slide links to its own page, with Tailwind-styled
// dot pagination underneath. No style jsx anywhere — pure Tailwind.
//
// npm install swiper   (if not already installed)

import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { STARS } from "@/lib/util";
import { eyebrow, HERO_CONTENT, RIGHT_IMAGES } from "../data/hero-data";
import { Socials } from "./SocialButtons";

// ─── StarField ──────────────────────────────────────
const StarField = memo(function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      STARS.forEach((s) => {
        const x = (parseFloat(s.left) / 100) * canvas.width;
        const y = (parseFloat(s.top) / 100) * canvas.height;
        const r = parseFloat(s.w + "") / 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.amber
          ? `rgba(252,211,77,${s.opacity})`
          : `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });
    };

    draw();
    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
});

// ─── HeroTitle ──────────────────────────────────────
const HeroTitle = memo(function HeroTitle({
  title,
  accent,
}: {
  title: string;
  accent: string;
}) {
  const parts = title.split(accent);
  return (
    <div className="font-roboto">
      {parts[0]}
      <span className="text-amber-500 font-display italic">{accent}</span>
      {parts[1]}
    </div>
  );
});

// Tailwind classes injected into each Swiper bullet via renderBullet.
// Base state + active state are toggled by Swiper adding/removing
// "swiper-pagination-bullet-active" — we key off that class name.
const BULLET_BASE =
  "inline-block h-1.5 w-2 rounded-full bg-white/20 hover:bg-white/45 transition-all duration-300 cursor-pointer mx-1";
const BULLET_ACTIVE = "!w-6 !bg-amber-600";

// ─── HeroSlider (main export) ────────────────────────
export function HeroSlider() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4">
      <StarField />

      <div className="relative lg:min-h-screen flex flex-col lg:flex-row lg:items-center pt-15 sm:pt-15 lg:pt-12 pb-6 sm:pb-8 lg:pb-14 gap-6 lg:gap-10 xl:gap-14">
        {/* LEFT — static */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start">
       

          <h1 className="lg:text-[2.5rem] md:text-[2rem] text-[2rem] font-bold lg:mt-0 mg-5 leading-tight text-white text-center lg:text-left mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            <HeroTitle
              title={HERO_CONTENT.title}
              accent={HERO_CONTENT.titleAccent}
            />
          </h1>

          <p className="text-amber-50 leading-relaxed font-light font-roboto text-center lg:text-[1.2rem] lg:text-left max-w-77.5 sm:max-w-md lg:max-w-none my-5 line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
            {HERO_CONTENT.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href={HERO_CONTENT.secondaryBtn.href}
              className="w-full sm:w-auto"
              target="_blank"
            >
              <button className="w-full border border-white/25 font-medium font-roboto cursor-pointer px-5 py-2.5 text-white bg-green-600 text-[12px] sm:text-[13px] xl:text-sm rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-green-500 hover:border-green-500 hover:scale-105">
                {HERO_CONTENT.secondaryBtn.label}
              </button>
            </Link>
          </div>
          <div className="mt-8" />
          <Socials />
        </div>

        {/* RIGHT — auto-sliding image carousel, each slide links out */}
        <div className="relative w-full lg:w-[45%] flex flex-col items-center lg:items-end min-h-[420px] lg:min-h-[480px]">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: ".hero-pagination",
              renderBullet: (_index, activeClass) =>
                `<span class="${BULLET_BASE} ${
                  activeClass === "swiper-pagination-bullet-active" ? "" : ""
                }"></span>`,
              bulletActiveClass: BULLET_ACTIVE,
            }}
            loop
            className="w-full max-w-100 sm:max-w-90 lg:max-w-95 xl:max-w-110 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            {RIGHT_IMAGES.map((img) => (
              <SwiperSlide key={img.id}>
                <Link
                  href={img.href}
                  target="_blank"
                  className="relative block w-full aspect-4/5 rounded-2xl overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dots — Swiper injects the renderBullet markup in here */}
          <div className="hero-pagination flex justify-center items-center mt-4 z-20" />
        </div>
      </div>
    </div>
  );
}
