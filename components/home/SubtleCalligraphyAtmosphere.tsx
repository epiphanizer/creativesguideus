"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * SubtleCalligraphyAtmosphere
 * 
 * An organic, whisper-quiet atmospheric canvas that breathes softly behind
 * the broadsheet masthead. No buttons, no pills, no UI cards, no mode toggles.
 * Just pure, slow sumi ink and warm oxblood watercolor washes diffusing into
 * archival paper texture.
 */
export default function SubtleCalligraphyAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, width, height);
    };

    window.addEventListener("resize", handleResize);

    // Ink particles with delicate opacity
    type InkDrop = {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      color: "sumi" | "oxblood" | "amber";
      life: number;
      maxLife: number;
      vx: number;
      vy: number;
    };

    const drops: InkDrop[] = [];
    const maxDrops = 180;
    let time = 0;
    let animationFrameId: number;

    const renderStaticWash = () => {
      ctx.clearRect(0, 0, width, height);
      // Faint ambient ensō brush arc
      const cx = width * 0.72;
      const cy = height * 0.52;
      const r = Math.min(width, height) * 0.42;

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
      grad.addColorStop(0, "rgba(140, 29, 24, 0.05)");
      grad.addColorStop(0.5, "rgba(22, 22, 22, 0.04)");
      grad.addColorStop(1, "rgba(250, 248, 244, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    if (prefersReducedMotion) {
      renderStaticWash();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.008; // Very slow, meditative breathing

      // Very soft dissipation into the cream background
      ctx.fillStyle = "rgba(250, 248, 244, 0.035)";
      ctx.fillRect(0, 0, width, height);

      // Flow coordinate: A gentle, wide sweeping calligraphic ribbon across the right-center
      const minDim = Math.min(width, height);
      const cx = width * 0.65;
      const cy = height * 0.48;
      
      const angle = time * 0.7;
      const r = minDim * 0.38 + Math.sin(time * 1.8) * 22;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle * 1.2) * (r * 0.55);

      // Spawn delicate ink drops
      if (Math.random() < 0.6) {
        const isOxblood = Math.random() < 0.28;
        const isAmber = !isOxblood && Math.random() < 0.2;
        drops.push({
          x: px + (Math.random() - 0.5) * 28,
          y: py + (Math.random() - 0.5) * 28,
          radius: 1.5 + Math.random() * 4.5,
          alpha: 0.12 + Math.random() * 0.14,
          color: isOxblood ? "oxblood" : isAmber ? "amber" : "sumi",
          life: 0,
          maxLife: 140 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }

      // Update & Draw
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.99;
        d.vy *= 0.99;

        const progress = d.life / d.maxLife;
        const curAlpha = d.alpha * (1 - progress);

        if (curAlpha > 0) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * (1 + progress * 0.3), 0, Math.PI * 2);

          if (d.color === "oxblood") {
            ctx.fillStyle = `rgba(140, 29, 24, ${curAlpha * 0.85})`;
          } else if (d.color === "amber") {
            ctx.fillStyle = `rgba(194, 94, 26, ${curAlpha * 0.75})`;
          } else {
            ctx.fillStyle = `rgba(22, 22, 22, ${curAlpha * 0.8})`;
          }
          ctx.fill();
        }

        if (d.life >= d.maxLife) {
          drops.splice(i, 1);
        }
      }

      if (drops.length > maxDrops) {
        drops.splice(0, drops.length - maxDrops);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="cg-masthead__atmosphere" aria-hidden="true">
      <canvas ref={canvasRef} className="cg-masthead__atmosphere-canvas" />
    </div>
  );
}
