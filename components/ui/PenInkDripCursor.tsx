"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type InkParticle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  isDrip: boolean;
  dripLength: number;
  maxDripLength: number;
};

/**
 * PenInkDripCursor
 * 
 * Renders an authentic vintage pen and ink dripping effect following the cursor.
 * As the user moves across the broadsheet parchment, rich black India ink
 * flows, splatters subtly, and drips with gravity from the pen nib tip.
 */
export default function PenInkDripCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Only activate for fine pointers (mouse/trackpad), not touch screens
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: InkParticle[] = [];
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let hoverTime = 0;
    let isMouseMoving = false;
    let moveTimeout: NodeJS.Timeout | null = null;
    let animId: number;

    const addDrop = (
      x: number,
      y: number,
      radius: number,
      vx = 0,
      vy = 0,
      gravity = 0.04,
      isDrip = false
    ) => {
      if (particles.length > 250) {
        particles.shift();
      }
      particles.push({
        x,
        y,
        radius,
        alpha: 0.85 + Math.random() * 0.15,
        maxAlpha: 0.85 + Math.random() * 0.15,
        life: 0,
        maxLife: isDrip ? 130 + Math.random() * 50 : 90 + Math.random() * 40,
        vx,
        vy,
        gravity,
        drag: isDrip ? 0.96 : 0.94,
        isDrip,
        dripLength: 0,
        maxDripLength: isDrip ? 15 + Math.random() * 25 : 0
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (prevMouseX < 0) {
        prevMouseX = currentX;
        prevMouseY = currentY;
      }

      const dx = currentX - prevMouseX;
      const dy = currentY - prevMouseY;
      const distance = Math.hypot(dx, dy);
      const speed = Math.min(distance, 40);

      mouseX = currentX;
      mouseY = currentY;
      hoverTime = 0;
      isMouseMoving = true;

      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 80);

      // Interpolate ink along movement path for smooth calligraphy flow
      if (distance > 0) {
        const stepCount = Math.max(1, Math.floor(distance / 5));
        for (let i = 0; i < stepCount; i++) {
          const t = i / stepCount;
          const ix = prevMouseX + dx * t;
          const iy = prevMouseY + dy * t;

          // Natural pen pressure: slower movement deposits more ink
          const baseRadius = Math.max(1.1, 3.2 - speed * 0.05) * (0.85 + Math.random() * 0.3);

          if (Math.random() < 0.55) {
            addDrop(
              ix + (Math.random() - 0.5) * 1.5,
              iy + (Math.random() - 0.5) * 1.5,
              baseRadius,
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.3,
              0.02,
              false
            );
          }

          // Occasional trailing drip when moving swiftly or curving
          if (speed > 8 && Math.random() < 0.12) {
            addDrop(
              ix,
              iy,
              0.9 + Math.random() * 1.2,
              (Math.random() - 0.5) * 0.6,
              0.5 + Math.random() * 1.2,
              0.08,
              true
            );
          }
        }
      }

      prevMouseX = currentX;
      prevMouseY = currentY;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      animId = requestAnimationFrame(render);

      // When resting in place, form a gentle ink drip from the pen nib
      if (!isMouseMoving && mouseX > 0 && mouseY > 0) {
        hoverTime++;
        // Every ~40 frames (~650ms), a heavy ink drop wells up and drips downward
        if (hoverTime % 36 === 0 && hoverTime < 200) {
          addDrop(
            mouseX + (Math.random() - 0.5) * 1,
            mouseY + (Math.random() - 0.5) * 1,
            1.8 + Math.random() * 1.4,
            0,
            0.6 + Math.random() * 0.8,
            0.09,
            true
          );
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Render each ink drop / drip
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.isDrip && p.dripLength < p.maxDripLength) {
          p.vy += p.gravity;
          p.y += p.vy;
          p.x += p.vx;
          p.vx *= p.drag;
          p.dripLength += Math.abs(p.vy);
        } else if (!p.isDrip) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= p.drag;
          p.vy *= p.drag;
        }

        const progress = p.life / p.maxLife;
        // Natural ink dry curve: stays dark, then fades into parchment
        const currentAlpha = progress < 0.4 
          ? p.maxAlpha 
          : p.maxAlpha * (1 - (progress - 0.4) / 0.6);

        if (currentAlpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // 1. Soft paper bleed halo (absorbs into parchment)
        const bleedRadius = p.radius * (1.3 + progress * 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, bleedRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(28, 24, 22, ${currentAlpha * 0.22})`;
        ctx.fill();

        // 2. Dense ink core (deep lampblack India ink)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 14, 13, ${currentAlpha * 0.95})`;
        ctx.fill();

        // 3. Ultra-dense center point
        if (p.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${currentAlpha})`;
          ctx.fill();
        }

        // If it is an active drip, draw a fine descending ink tear/tail
        if (p.isDrip && p.dripLength > 2 && p.dripLength < p.maxDripLength) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.vy * 2);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(16, 14, 13, ${currentAlpha * 0.75})`;
          ctx.lineWidth = Math.max(0.6, p.radius * 0.6);
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      if (moveTimeout) clearTimeout(moveTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="cg-pen-ink-canvas"
      aria-hidden="true"
    />
  );
}
