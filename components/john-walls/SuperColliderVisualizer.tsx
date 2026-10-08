"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type ColorTheme = "gold" | "phosphor" | "acid" | "neon";

export interface StackLayers {
  scope: boolean;
  waterfall: boolean;
  mandala: boolean;
  stardust: boolean;
}

export interface VisualizerState {
  layers: StackLayers;
  kaleidoscope: boolean;
  trails: boolean;
  colorTheme: ColorTheme;
}

export type VisualizerPreset = "lissajous" | "waterfall" | "mandala" | "custom";

interface SuperColliderVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  bpm?: number;
  trackTitle?: string;
  initialPreset?: VisualizerPreset;
  onPresetChange?: (preset: VisualizerPreset) => void;
  stageMode?: boolean;
  height?: string;
}

const STORAGE_KEY = "jw_stacked_vis_state";

const DEFAULT_STATE: VisualizerState = {
  layers: {
    scope: true,
    waterfall: false,
    mandala: true,
    stardust: true,
  },
  kaleidoscope: false,
  trails: true,
  colorTheme: "gold",
};

export function SuperColliderVisualizer({
  audioElement,
  isPlaying,
  bpm = 120,
  trackTitle = "Live Session",
  initialPreset,
  onPresetChange,
  stageMode = false,
  height,
}: SuperColliderVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Persistent visualizer state
  const [state, setState] = useState<VisualizerState>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.layers) {
            return {
              layers: { ...DEFAULT_STATE.layers, ...parsed.layers },
              kaleidoscope: Boolean(parsed.kaleidoscope),
              trails: typeof parsed.trails === "boolean" ? parsed.trails : true,
              colorTheme: parsed.colorTheme || "gold",
            };
          }
        }
      } catch {}
    }
    return DEFAULT_STATE;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rmsDb, setRmsDb] = useState<number>(-70);

  // Save state on change
  const updateState = (updater: (prev: VisualizerState) => VisualizerState) => {
    setState((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  // Toggle individual stackable layer
  const toggleLayer = (layerKey: keyof StackLayers) => {
    updateState((prev) => {
      const currentVal = prev.layers[layerKey];
      const nextLayers = { ...prev.layers, [layerKey]: !currentVal };
      // Ensure at least one layer remains active
      const hasAny = Object.values(nextLayers).some(Boolean);
      if (!hasAny) {
        nextLayers[layerKey] = true;
      }
      return { ...prev, layers: nextLayers };
    });
  };

  // Toggle Kaleidoscope
  const toggleKaleidoscope = () => {
    updateState((prev) => ({ ...prev, kaleidoscope: !prev.kaleidoscope }));
  };

  // Toggle Trails
  const toggleTrails = () => {
    updateState((prev) => ({ ...prev, trails: !prev.trails }));
  };

  // Cycle Color Theme
  const cycleColorTheme = () => {
    updateState((prev) => {
      const order: ColorTheme[] = ["gold", "phosphor", "acid", "neon"];
      const nextIdx = (order.indexOf(prev.colorTheme) + 1) % order.length;
      return { ...prev, colorTheme: order[nextIdx] };
    });
  };

  // Apply quick curated combo
  const applyPresetCombo = (combo: "gold-mandala" | "acid-stack" | "cyber-waterfall" | "pure-scope") => {
    if (combo === "gold-mandala") {
      updateState((prev) => ({
        ...prev,
        layers: { scope: true, waterfall: false, mandala: true, stardust: true },
        kaleidoscope: true,
        trails: true,
        colorTheme: "gold",
      }));
    } else if (combo === "acid-stack") {
      updateState((prev) => ({
        ...prev,
        layers: { scope: true, waterfall: true, mandala: false, stardust: true },
        kaleidoscope: true,
        trails: true,
        colorTheme: "acid",
      }));
    } else if (combo === "cyber-waterfall") {
      updateState((prev) => ({
        ...prev,
        layers: { scope: false, waterfall: true, mandala: false, stardust: true },
        kaleidoscope: false,
        trails: true,
        colorTheme: "neon",
      }));
    } else if (combo === "pure-scope") {
      updateState((prev) => ({
        ...prev,
        layers: { scope: true, waterfall: false, mandala: false, stardust: false },
        kaleidoscope: false,
        trails: false,
        colorTheme: "phosphor",
      }));
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Web Audio Context initialization
  useEffect(() => {
    if (!audioElement) return;

    let ctx = audioCtxRef.current;
    if (!ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;
    }

    if (!analyserRef.current && ctx) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      try {
        if (!sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioElement);
          sourceNodeRef.current = source;
          source.connect(analyser);
          analyser.connect(ctx.destination);
        }
      } catch (err) {
        // Silently handled
      }
    }

    const unlock = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [audioElement]);

  // Particle System Pool (Fixed size, zero allocation per frame)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; radius: number }>>([]);
  useEffect(() => {
    const pPool = [];
    for (let i = 0; i < 75; i++) {
      pPool.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        radius: Math.random() * 1.8 + 1,
      });
    }
    particlesRef.current = pPool;
  }, []);

  // Main 60FPS Single-Canvas Render Loop with Layer Stacking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let history: number[][] = [];
    const maxHistory = 18;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      const analyser = analyserRef.current;
      const bufferLength = analyser ? analyser.frequencyBinCount : 512;
      const timeData = new Uint8Array(bufferLength);
      const freqData = new Uint8Array(bufferLength);

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);
      } else {
        // Subtle ambient harmonic wave when paused
        const t = performance.now() * 0.0015;
        for (let i = 0; i < bufferLength; i++) {
          timeData[i] = Math.round(Math.sin(t * 2 + i * 0.05) * 14 + 128);
          freqData[i] = Math.max(0, Math.round(Math.sin(t + i * 0.1) * 22));
        }
      }

      // Calculate instantaneous RMS dB
      let sumSq = 0;
      for (let i = 0; i < bufferLength; i++) {
        const norm = (timeData[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / bufferLength);
      const currentDb = rms > 0.001 ? Math.round(20 * Math.log10(rms)) : -70;
      setRmsDb(currentDb);

      const tSec = performance.now() * 0.001;

      // Color Theme computation
      let mainColor = "#e0b974"; // Gold
      let glowColor = "rgba(224, 185, 116, 0.7)";
      let subColor = "#2dd4bf"; // Cyan
      let altColor = "#f59e0b"; // Warm Amber

      if (state.colorTheme === "phosphor") {
        mainColor = "#2dd4bf";
        glowColor = "rgba(45, 212, 191, 0.75)";
        subColor = "#10b981";
        altColor = "#34d399";
      } else if (state.colorTheme === "acid") {
        const h1 = (tSec * 50) % 360;
        const h2 = (tSec * 50 + 120) % 360;
        const h3 = (tSec * 50 + 240) % 360;
        mainColor = `hsl(${h1}, 95%, 62%)`;
        glowColor = `hsla(${h1}, 95%, 55%, 0.75)`;
        subColor = `hsl(${h2}, 95%, 60%)`;
        altColor = `hsl(${h3}, 95%, 65%)`;
      } else if (state.colorTheme === "neon") {
        mainColor = "#ec4899";
        glowColor = "rgba(236, 72, 153, 0.75)";
        subColor = "#06b6d4";
        altColor = "#a855f7";
      }

      // 1. Background Phosphor Persistence / Clear
      ctx.fillStyle = state.trails ? "rgba(8, 10, 14, 0.22)" : "rgba(8, 10, 14, 0.42)";
      ctx.fillRect(0, 0, width, height);

      // 2. Reticle Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const x = (width / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        const y = (height / 6) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Composite Stacked Layers Function
      const drawStackedLayers = () => {
        // --- LAYER A: SPECTRAL WATERFALL ---
        if (state.layers.waterfall) {
          const slice: number[] = [];
          const bars = 44;
          for (let b = 0; b < bars; b++) {
            const idx = Math.floor((b / bars) * (bufferLength / 2));
            slice.push(freqData[idx] / 255);
          }
          history.unshift(slice);
          if (history.length > maxHistory) history.pop();

          for (let h = history.length - 1; h >= 0; h--) {
            const row = history[h];
            const alpha = 1 - h / maxHistory;
            const yBase = height * 0.84 - h * 11;

            ctx.beginPath();
            ctx.strokeStyle = h === 0 ? mainColor : subColor;
            ctx.globalAlpha = alpha * 0.85;
            ctx.lineWidth = h === 0 ? 1.8 : 1.1;

            const barW = width / row.length;
            for (let b = 0; b < row.length; b++) {
              const mag = row[b];
              const px = b * barW;
              const py = yBase - mag * 105 * alpha;
              if (b === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
        }

        // --- LAYER B: COSMIC STARDUST PARTICLES ---
        if (state.layers.stardust && particlesRef.current.length > 0) {
          const bassBoost = (freqData[3] / 255) * 1.8;
          const particles = particlesRef.current;
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx * (1 + bassBoost * 1.4);
            p.y += p.vy * (1 + bassBoost * 1.4);

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            const r = p.radius * (1 + bassBoost * 0.7);
            ctx.fillStyle = i % 2 === 0 ? mainColor : subColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // --- LAYER C: SACRED MANDALA PULSE ---
        if (state.layers.mandala) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(tSec * 0.25);

          const energy = rms * 2.4;
          const petals = 24;
          ctx.fillStyle = glowColor.replace("0.7", "0.06").replace("0.75", "0.06");
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 1.4;

          ctx.beginPath();
          for (let p = 0; p <= petals; p++) {
            const theta = (p / petals) * Math.PI * 2;
            const freqVal = freqData[(p * 6) % bufferLength] / 255;
            const r = 48 + energy * 150 + freqVal * 68;
            const px = Math.cos(theta) * r;
            const py = Math.sin(theta) * r;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // High frequency spatter
          ctx.fillStyle = subColor;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2 + tSec * 0.4;
            const dist = 58 + (freqData[i * 8] / 255) * 130;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // --- LAYER D: LISSAJOUS PHOSPHOR SCOPE ---
        if (state.layers.scope) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(tSec * 0.4);

          const radius = Math.min(width, height) * 0.36;
          ctx.shadowBlur = 10;
          ctx.shadowColor = glowColor;
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 1.8;

          ctx.beginPath();
          for (let i = 0; i < bufferLength - 100; i += 2) {
            const xVal = (timeData[i] - 128) / 128;
            const yVal = (timeData[(i + 96) % bufferLength] - 128) / 128;
            const angle = (i / (bufferLength - 100)) * Math.PI * 2;
            const rMod = radius * (0.68 + xVal * 0.38);
            const px = Math.cos(angle) * rMod + yVal * 42;
            const py = Math.sin(angle) * rMod + xVal * 42;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner vector core
          ctx.shadowBlur = 4;
          ctx.strokeStyle = altColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < 180; i += 2) {
            const s1 = (timeData[i] - 128) / 128;
            const s2 = (timeData[i + 24] - 128) / 128;
            const x = s1 * radius * 0.72;
            const y = s2 * radius * 0.72;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();
        }
      };

      // 4. Render with or without Kaleidoscope mirror
      if (state.kaleidoscope) {
        const segments = 6;
        const angleStep = (Math.PI * 2) / segments;
        for (let s = 0; s < segments; s++) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(s * angleStep);
          if (s % 2 === 1) ctx.scale(1, -1);
          ctx.translate(-width / 2, -height / 2);
          drawStackedLayers();
          ctx.restore();
        }
      } else {
        drawStackedLayers();
      }
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, state]);

  // Color display labels
  const colorDisplayMap: Record<ColorTheme, { label: string; color: string }> = {
    gold: { label: "GOLD", color: "#e0b974" },
    phosphor: { label: "PHOSPHOR", color: "#2dd4bf" },
    acid: { label: "ACID PRISM", color: "#f43f5e" },
    neon: { label: "CYBER NEON", color: "#ec4899" },
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: height || (isFullscreen ? "100vh" : stageMode ? "100%" : "420px"),
        background: "#080a0e",
        borderRadius: isFullscreen || stageMode ? "0" : "14px",
        overflow: "hidden",
        border: stageMode ? "none" : "1px solid rgba(224, 185, 116, 0.3)",
        boxShadow: stageMode ? "none" : "0 16px 38px rgba(0, 0, 0, 0.65)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Visualizer Canvas Frame */}
      <div style={{ position: "relative", flex: 1, width: "100%", minHeight: "260px" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {/* Top HUD: Track Info, BPM & dB Meter */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "16px",
            right: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
            fontFamily: "ui-monospace, monospace",
            fontSize: "11px",
            color: "#94a3b8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isPlaying ? "#2dd4bf" : "#64748b",
                boxShadow: isPlaying ? "0 0 10px #2dd4bf" : "none",
              }}
            />
            <span style={{ color: "#f8fafc", fontWeight: 600 }}>{trackTitle}</span>
            <span style={{ color: "#e0b974" }}>BPM {bpm}</span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {state.kaleidoscope && (
              <span style={{ color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                KALEIDOSCOPE
              </span>
            )}
            <span>RMS: <strong style={{ color: "#e2e8f0" }}>{rmsDb} dB</strong></span>
          </div>
        </div>
      </div>

      {/* Integrated Hardware Control Toolbar (Rock-Solid Stacking & FX Controls) */}
      <div
        style={{
          background: "#0c0f14",
          borderTop: "1px solid rgba(224, 185, 116, 0.2)",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          zIndex: 10,
        }}
      >
        {/* Layer Stacking Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "2px" }}>
            STACK:
          </span>

          <button
            type="button"
            onClick={() => toggleLayer("scope")}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: state.layers.scope ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: state.layers.scope ? "rgba(224, 185, 116, 0.22)" : "rgba(0,0,0,0.5)",
              color: state.layers.scope ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {state.layers.scope ? "● " : "○ "}SCOPE
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("waterfall")}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: state.layers.waterfall ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: state.layers.waterfall ? "rgba(224, 185, 116, 0.22)" : "rgba(0,0,0,0.5)",
              color: state.layers.waterfall ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {state.layers.waterfall ? "● " : "○ "}WATERFALL
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("mandala")}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: state.layers.mandala ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: state.layers.mandala ? "rgba(224, 185, 116, 0.22)" : "rgba(0,0,0,0.5)",
              color: state.layers.mandala ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {state.layers.mandala ? "● " : "○ "}MANDALA
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("stardust")}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: state.layers.stardust ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: state.layers.stardust ? "rgba(224, 185, 116, 0.22)" : "rgba(0,0,0,0.5)",
              color: state.layers.stardust ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {state.layers.stardust ? "● " : "○ "}STARDUST
          </button>
        </div>

        {/* Psychedelic FX & Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {/* Kaleidoscope Button */}
          <button
            type="button"
            onClick={toggleKaleidoscope}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: state.kaleidoscope ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.15)",
              background: state.kaleidoscope ? "rgba(192, 132, 252, 0.2)" : "rgba(0,0,0,0.5)",
              color: state.kaleidoscope ? "#c084fc" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ✦ KALEIDOSCOPE
          </button>

          {/* Trails Button */}
          <button
            type="button"
            onClick={toggleTrails}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: state.trails ? "1px solid #2dd4bf" : "1px solid rgba(255,255,255,0.15)",
              background: state.trails ? "rgba(45, 212, 191, 0.18)" : "rgba(0,0,0,0.5)",
              color: state.trails ? "#2dd4bf" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            TRAILS
          </button>

          {/* Color Theme Cycler */}
          <button
            type="button"
            onClick={cycleColorTheme}
            style={{
              padding: "4px 9px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.5)",
              color: colorDisplayMap[state.colorTheme].color,
              cursor: "pointer",
            }}
          >
            {colorDisplayMap[state.colorTheme].label}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            {isFullscreen ? "✕" : "⛶"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperColliderVisualizer;
