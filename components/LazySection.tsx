/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, memo, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** px before the element enters viewport to start loading. Default: 200 */
  rootMargin?: string;
  /** Skeleton/placeholder shown while not yet in view */
  fallback?: ReactNode;
  className?: string;
}

/**
 * LazySection — renders children only when they are near the viewport.
 *
 * Drop it around any below-the-fold section:
 *
 *   <LazySection>
 *     <HeavySection />
 *   </LazySection>
 *
 * Once the section has entered the viewport it is permanently mounted
 * (no flickering on scroll-back).
 */
export const LazySection = memo(function LazySection({
  children,
  rootMargin = "200px",
  fallback = null,
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver isn't available (old browsers) just render immediately
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire once, then stop observing
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
});