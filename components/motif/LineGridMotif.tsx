"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cx } from "@/lib/cx";

type LineGridMotifProps = {
  className?: string;
  parallaxFactor?: number;
};

const DEFAULT_PARALLAX = 0.08;

export function LineGridMotif({ className, parallaxFactor = DEFAULT_PARALLAX }: LineGridMotifProps) {
  const motifRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const motif = motifRef.current;
    if (!motif) {
      return;
    }

    motif.style.setProperty("--cg-motif-shift", "0px");

    if (prefersReducedMotion) {
      return;
    }

    let raf = 0;

    const update = () => {
      const scrollY = window.scrollY || 0;
      const shift = scrollY * parallaxFactor;
      motif.style.setProperty("--cg-motif-shift", `${shift}px`);
    };

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [parallaxFactor, prefersReducedMotion]);

  return (
    <div ref={motifRef} className={cx("cg-line-grid", className)} aria-hidden>
      <div className="cg-line-grid__layer cg-line-grid__layer--base" />
      <div className="cg-line-grid__layer cg-line-grid__layer--accent" />
      <div className="cg-line-grid__layer cg-line-grid__layer--cross" />
      <div className="cg-line-grid__noise" />
    </div>
  );
}

export default LineGridMotif;
