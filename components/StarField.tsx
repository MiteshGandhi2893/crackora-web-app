"use client";
// StarField.tsx — CLIENT COMPONENT
// Isolated so the bento hero around it can stay a server component.
// This is the only piece of the hero that actually needs the browser.

import { useEffect, useRef, memo } from "react";
import { STARS } from "@/lib/util";

export const StarField = memo(function StarField() {
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