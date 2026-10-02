"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow } from "@/lib/launch-state";

const homeConversationHref = buildContactHref({ pathname: "/contact" });

// Dot particle model for calligraphic ink flow
class DotParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  hue: number; // 0 = Sumi ink, 1 = CGU Oxblood, 2 = Tube-amp amber/gold
  life: number;
  maxLife: number;
  vx: number;
  vy: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    alpha: number,
    hue: number,
    life: number,
    maxLife: number,
    vx: number,
    vy: number
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = alpha;
    this.hue = hue;
    this.life = life;
    this.maxLife = maxLife;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.985;
    this.vy *= 0.985;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const progress = this.life / this.maxLife;
    const currentAlpha = this.alpha * (1 - progress);
    if (currentAlpha <= 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (1 + progress * 0.4), 0, Math.PI * 2);

    let fill: string;
    let shadow: string;

    if (this.hue === 1) {
      // CGU Oxblood Red
      fill = `rgba(140, 29, 24, ${currentAlpha * 0.95})`;
      shadow = "rgba(140, 29, 24, 0.35)";
    } else if (this.hue === 2) {
      // Tube-Amp Amber / Vinyl Wax Gold
      fill = `rgba(194, 94, 26, ${currentAlpha * 0.9})`;
      shadow = "rgba(194, 94, 26, 0.3)";
    } else {
      // Sumi Ink / Analog Tape Black
      fill = `rgba(22, 22, 22, ${currentAlpha * 0.92})`;
      shadow = "rgba(22, 22, 22, 0.22)";
    }

    ctx.fillStyle = fill;
    ctx.shadowColor = shadow;
    ctx.shadowBlur = this.radius * 2;
    ctx.fill();
    ctx.restore();
  }
}

const FLOW_MODES = [
  { name: "Turntable Vinyl Groove", kicker: "33⅓ RPM Analog Circle" },
  { name: "Reel-to-Reel Tape Loop", kicker: "2-Inch Tape Lemniscate" },
  { name: "Harmonic Audio Wave", kicker: "Broadcast Signal Swell" }
] as const;

export default function CalligraphySignatureHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentMode, setCurrentMode] = useState<number>(0);
  const modeRef = useRef<number>(0);

  useEffect(() => {
    modeRef.current = currentMode;
  }, [currentMode]);

  useEffect(() => {
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
      ctx.fillStyle = "#faf8f4";
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener("resize", handleResize);

    const particles: DotParticle[] = [];
    const maxParticles = 650;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handlePointerLeave = () => {
      mouseActive = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    let time = 0;
    let animationFrameId: number;

    const getPathPoint = (t: number, mode: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);

      if (mode === 0) {
        // Turntable Vinyl Groove (Ensō circle with slight hand-cut wobble)
        const rBase = minDim * 0.29;
        const angle = t * 0.65;
        const r = rBase + Math.sin(angle * 3) * 14 + Math.cos(angle * 5) * 8;
        return {
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * (r * 0.92)
        };
      } else if (mode === 1) {
        // 2-Inch Tape Loop Lemniscate (Continuous Infinity)
        const a = minDim * 0.36;
        const angle = t * 0.55;
        const scale = 2 / (3 - Math.cos(2 * angle));
        const x = cx + a * scale * Math.cos(angle);
        const y = cy + (a * 0.65) * scale * (Math.sin(2 * angle) / 2);
        return { x, y };
      } else {
        // Harmonic Audio Wave (Signal swell)
        const a = minDim * 0.34;
        const angle = t * 0.7;
        return {
          x: cx + Math.cos(angle) * a + Math.sin(t * 1.5) * 20,
          y: cy + Math.sin(angle * 2) * (a * 0.45) + Math.cos(t * 0.9) * 25
        };
      }
    };

    // Initial background wash
    ctx.fillStyle = "#faf8f4";
    ctx.fillRect(0, 0, width, height);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      time += 0.022;

      // Soft persistent ink fade on archival paper
      ctx.fillStyle = "rgba(250, 248, 244, 0.16)";
      ctx.fillRect(0, 0, width, height);

      const pt = getPathPoint(time, modeRef.current);
      const breath = Math.sin(time * 0.75) * 0.5 + 0.5;
      const mainRadius = 2.0 + breath * 7.5;

      // Main calligraphic ink stroke
      particles.push(
        new DotParticle(
          pt.x,
          pt.y,
          mainRadius,
          0.85 + Math.random() * 0.15,
          Math.random() < 0.35 ? 1 : Math.random() < 0.5 ? 2 : 0,
          0,
          120 + Math.random() * 40,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      );

      // Trailing ink droplets
      if (Math.random() < 0.45) {
        const spread = mainRadius * 1.6;
        particles.push(
          new DotParticle(
            pt.x + (Math.random() - 0.5) * spread,
            pt.y + (Math.random() - 0.5) * spread,
            0.8 + Math.random() * 2.2,
            0.4 + Math.random() * 0.4,
            Math.random() < 0.4 ? 1 : 0,
            0,
            90 + Math.random() * 30,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6
          )
        );
      }

      // Pointer interactive ink trail
      if (mouseActive) {
        particles.push(
          new DotParticle(
            mouseX + (Math.random() - 0.5) * 12,
            mouseY + (Math.random() - 0.5) * 12,
            1.5 + Math.random() * 3.5,
            0.65,
            1, // Oxblood red trail
            0,
            80,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8
          )
        );
      }

      // Update & render
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const handleToggleFlow = () => {
    setCurrentMode((prev) => (prev + 1) % FLOW_MODES.length);
  };

  const handleScrollToDispatches = () => {
    const target = document.getElementById("broadsheet-editorial");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="cg-calligraphy-hero" aria-label="Creatives Guide Us Studio Signature">
      {/* Animated Calligraphy Canvas */}
      <canvas ref={canvasRef} className="cg-calligraphy-canvas" aria-hidden="true" />

      {/* Ambient Archival Paper Vignette */}
      <div className="cg-calligraphy-vignette" aria-hidden="true" />

      {/* Main Overlay Content */}
      <div className="cg-calligraphy-overlay">
        {/* Top Masthead Bar */}
        <header className="cg-calligraphy-top-bar">
          <div className="cg-calligraphy-top-bar__location">
            <span>Los Angeles · Hawaiʻi</span>
            <span className="cg-calligraphy-tube-dot" title="Vacuum Tube Glow" />
            <span>Independent Studio &amp; Record Label</span>
          </div>
          <div className="cg-calligraphy-top-bar__tag">
            <span>Est. 2026</span>
          </div>
        </header>

        {/* Center Signature Broadsheet Card */}
        <div className="cg-calligraphy-card">
          <h1 className="cg-calligraphy-title">CREATIVES GUIDE US</h1>
          <p className="cg-calligraphy-subtitle">sound · story · signal · independent practice</p>

          {/* Gateway Navigation Pills */}
          <nav className="cg-calligraphy-pills" aria-label="Quick Gateways">
            <Link href="/walls-devine" className="cg-calligraphy-pill cg-calligraphy-pill--active">
              <span className="cg-calligraphy-pill__icon">📻</span>
              <span>Walls/Devine · Vol. 1</span>
            </Link>
            <Link href="/bong-tour" className="cg-calligraphy-pill">
              <span className="cg-calligraphy-pill__icon">🎬</span>
              <span>Bong Tour · Screenplay</span>
            </Link>
            <Link href="/contact" className="cg-calligraphy-pill">
              <span className="cg-calligraphy-pill__icon">⚡</span>
              <span>Appreesh · Layer</span>
            </Link>
            <button
              type="button"
              onClick={handleScrollToDispatches}
              className="cg-calligraphy-pill cg-calligraphy-pill--ghost"
              title="Scroll down to read the broadsheet dispatches"
            >
              <span>📜 Read Broadsheet ↓</span>
            </button>
          </nav>

          {/* Editorial Manifesto Prose */}
          <p className="cg-calligraphy-prose">
            We cut records on <strong>analog tape</strong>, write screenplays about bad ideas, and print physical things because digital files don&apos;t smell like ink or warm tubes. An independent studio and record label based in <strong>Los Angeles &amp; Hawaiʻi</strong>.
          </p>

          {/* Featured Release Ribbon */}
          <div className="cg-calligraphy-ribbon">
            <span className="cg-calligraphy-ribbon__icon">📻</span>
            <span className="cg-calligraphy-ribbon__text">
              <strong>Cover Feature:</strong> Walls/Devine — Volume 1 · 8 Master Tracks Recorded Live on 2-Inch Tape · In the Listening Room Now.
            </span>
          </div>

          {/* Actions Row */}
          <div className="cg-calligraphy-actions">
            <Link href="/walls-devine" className="cg-calligraphy-btn-primary">
              <span>Enter Listening Room</span>
              <span>→</span>
            </Link>
            <Link href="/bong-tour" className="cg-calligraphy-btn-secondary">
              <span>Bong Tour Screenplay</span>
              <span>↗</span>
            </Link>
            <ContactModalLink href={homeConversationHref} buttonVariant="ghost" className="cg-calligraphy-btn-ghost">
              Start a Conversation
            </ContactModalLink>
          </div>
        </div>

        {/* Bottom Cadence Bar */}
        <footer className="cg-calligraphy-bottom-bar">
          <div className="cg-calligraphy-bottom-bar__meta">
            Independent Studio &amp; Record Label · Sound · Screen · Print
          </div>
          <div
            className="cg-calligraphy-cadence"
            onClick={handleToggleFlow}
            role="button"
            tabIndex={0}
            title="Click to change rhythm cadence"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleToggleFlow();
            }}
          >
            <div className="cg-calligraphy-cadence__ring">
              <div className="cg-calligraphy-cadence__dot" />
            </div>
            <span>
              {FLOW_MODES[currentMode].kicker} · 33⅓ RPM / 15 IPS Flow
            </span>
          </div>
          <div className="cg-calligraphy-bottom-bar__scroll">
            <button
              type="button"
              onClick={handleScrollToDispatches}
              className="cg-calligraphy-scroll-link"
            >
              <span>Scroll to Full Broadsheet ↓</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
