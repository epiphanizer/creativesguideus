"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type VisualizerPreset = "lissajous" | "waterfall" | "mandala";
export type ColorTheme = "gold" | "phosphor" | "neon";

interface SuperColliderVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  bpm?: number;
  trackTitle?: string;
  initialPreset?: VisualizerPreset;
  onPresetChange?: (preset: VisualizerPreset) => void;
}

const STORAGE_KEY = "jw_vis_settings";

export function SuperColliderVisualizer({
  audioElement,
  isPlaying,
  bpm = 120,
  trackTitle = "Live Session",
  initialPreset = "lissajous",
  onPresetChange,
}: SuperColliderVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Simple, rock-solid state (saved in localStorage)
  const [preset, setPreset] = useState<VisualizerPreset>(initialPreset);
  const [fxEnabled, setFxEnabled] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("gold");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rmsDb, setRmsDb] = useState<number>(-70);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.preset) setPreset(parsed.preset);
        if (typeof parsed.fxEnabled === "boolean") setFxEnabled(parsed.fxEnabled);
        if (parsed.colorTheme) setColorTheme(parsed.colorTheme);
      }
    } catch {}
  }, []);

  // Save preferences on change
  const saveSettings = (p: VisualizerPreset, fx: boolean, c: ColorTheme) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ preset: p, fxEnabled: fx, colorTheme: c }));
    } catch {}
  };

  const handleSelectPreset = (p: VisualizerPreset) => {
    setPreset(p);
    saveSettings(p, fxEnabled, colorTheme);
    if (onPresetChange) onPresetChange(p);
  };

  const handleToggleFx = () => {
    const nextFx = !fxEnabled;
    setFxEnabled(nextFx);
    saveSettings(preset, nextFx, colorTheme);
  };

  const handleCycleColor = () => {
    const nextColor: ColorTheme = colorTheme === "gold" ? "phosphor" : colorTheme === "phosphor" ? "neon" : "gold";
    setColorTheme(nextColor);
    saveSettings(preset, fxEnabled, nextColor);
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
        // Handled silently if already connected
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

  // Main 60FPS Single-Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let history: number[][] = [];
    const maxHistory = 20;

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
        // Idle gentle oscillation
        const t = performance.now() * 0.0015;
        for (let i = 0; i < bufferLength; i++) {
          timeData[i] = Math.round(Math.sin(t * 2 + i * 0.05) * 16 + 128);
          freqData[i] = Math.max(0, Math.round(Math.sin(t + i * 0.1) * 24));
        }
      }

      // Calculate instantaneous RMS
      let sumSq = 0;
      for (let i = 0; i < bufferLength; i++) {
        const norm = (timeData[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / bufferLength);
      const currentDb = rms > 0.001 ? Math.round(20 * Math.log10(rms)) : -70;
      setRmsDb(currentDb);

      // Colors
      let mainColor = "#e0b974"; // Gold
      let glowColor = "rgba(224, 185, 116, 0.7)";
      let subColor = "#2dd4bf"; // Cyan
      if (colorTheme === "phosphor") {
        mainColor = "#2dd4bf";
        glowColor = "rgba(45, 212, 191, 0.7)";
        subColor = "#10b981";
      } else if (colorTheme === "neon") {
        mainColor = "#ec4899";
        glowColor = "rgba(236, 72, 153, 0.7)";
        subColor = "#38bdf8";
      }

      // Background Phosphor Decay (Always pure dark mode)
      ctx.fillStyle = fxEnabled ? "rgba(8, 10, 14, 0.18)" : "rgba(8, 10, 14, 0.28)";
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
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

      // Draw active visualizer
      const tSec = performance.now() * 0.001;

      const drawCoreVisual = () => {
        if (preset === "lissajous") {
          // --- 1. LISSAJOUS PHOSPHOR SCOPE ---
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(tSec * 0.4);

          const radius = Math.min(width, height) * 0.38;
          ctx.shadowBlur = 10;
          ctx.shadowColor = glowColor;
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 1.8;

          ctx.beginPath();
          for (let i = 0; i < bufferLength - 100; i += 2) {
            const xVal = (timeData[i] - 128) / 128;
            const yVal = (timeData[(i + 96) % bufferLength] - 128) / 128;
            const angle = (i / (bufferLength - 100)) * Math.PI * 2;
            const rMod = radius * (0.7 + xVal * 0.4);
            const px = Math.cos(angle) * rMod + yVal * 45;
            const py = Math.sin(angle) * rMod + xVal * 45;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner gold beam
          ctx.shadowBlur = 4;
          ctx.strokeStyle = subColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < 180; i += 2) {
            const s1 = (timeData[i] - 128) / 128;
            const s2 = (timeData[i + 24] - 128) / 128;
            const x = s1 * radius * 0.75;
            const y = s2 * radius * 0.75;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();
        } else if (preset === "waterfall") {
          // --- 2. SPECTRAL WATERFALL ---
          const slice: number[] = [];
          const bars = 48;
          for (let b = 0; b < bars; b++) {
            const idx = Math.floor((b / bars) * (bufferLength / 2));
            slice.push(freqData[idx] / 255);
          }
          history.unshift(slice);
          if (history.length > maxHistory) history.pop();

          for (let h = history.length - 1; h >= 0; h--) {
            const row = history[h];
            const alpha = 1 - h / maxHistory;
            const yBase = height * 0.85 - h * 12;

            ctx.beginPath();
            ctx.strokeStyle = h === 0 ? mainColor : subColor;
            ctx.globalAlpha = alpha * 0.9;
            ctx.lineWidth = h === 0 ? 2 : 1.2;

            const barW = width / row.length;
            for (let b = 0; b < row.length; b++) {
              const mag = row[b];
              const px = b * barW;
              const py = yBase - mag * 110 * alpha;
              if (b === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
        } else {
          // --- 3. SACRED MANDALA PULSE ---
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(tSec * 0.2);

          const energy = rms * 2.5;
          const petals = 24;
          ctx.fillStyle = glowColor.replace("0.7", "0.06");
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          for (let p = 0; p <= petals; p++) {
            const theta = (p / petals) * Math.PI * 2;
            const freqVal = freqData[(p * 6) % bufferLength] / 255;
            const r = 50 + energy * 160 + freqVal * 70;
            const px = Math.cos(theta) * r;
            const py = Math.sin(theta) * r;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Outer spatter sparkles
          ctx.fillStyle = subColor;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2 + tSec * 0.5;
            const dist = 60 + (freqData[i * 8] / 255) * 140;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      };

      // If Psychedelic FX is ON: Mirror around center 6 times!
      if (fxEnabled) {
        const segments = 6;
        const angleStep = (Math.PI * 2) / segments;
        for (let s = 0; s < segments; s++) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(s * angleStep);
          if (s % 2 === 1) ctx.scale(1, -1);
          ctx.translate(-width / 2, -height / 2);
          drawCoreVisual();
          ctx.restore();
        }
      } else {
        drawCoreVisual();
      }
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, preset, fxEnabled, colorTheme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isFullscreen ? "100vh" : "380px",
        background: "#080a0e",
        borderRadius: isFullscreen ? "0" : "12px",
        overflow: "hidden",
        border: "1px solid rgba(224, 185, 116, 0.25)",
        boxShadow: "0 14px 34px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* 100% Hardware Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* Top HUD: Track Info & Telemetry */}
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

        <div style={{ display: "flex", gap: "12px" }}>
          <span>RMS: <strong style={{ color: "#e2e8f0" }}>{rmsDb} dB</strong></span>
        </div>
      </div>

      {/* Bottom HUD: Clean, Rock-Solid Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "16px",
          right: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {/* Preset Selector */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => handleSelectPreset("lissajous")}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: preset === "lissajous" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: preset === "lissajous" ? "rgba(224, 185, 116, 0.2)" : "rgba(0,0,0,0.6)",
              color: preset === "lissajous" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            LISSAJOUS
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("waterfall")}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: preset === "waterfall" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: preset === "waterfall" ? "rgba(224, 185, 116, 0.2)" : "rgba(0,0,0,0.6)",
              color: preset === "waterfall" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            WATERFALL
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("mandala")}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: preset === "mandala" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
              background: preset === "mandala" ? "rgba(224, 185, 116, 0.2)" : "rgba(0,0,0,0.6)",
              color: preset === "mandala" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            MANDALA
          </button>
        </div>

        {/* Action Toggles: Psychedelic FX, Color, Fullscreen */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleToggleFx}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              fontWeight: 600,
              borderRadius: "4px",
              border: fxEnabled ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.15)",
              background: fxEnabled ? "rgba(168, 85, 247, 0.25)" : "rgba(0,0,0,0.6)",
              color: fxEnabled ? "#d8b4fe" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            ✦ PSYCHEDELIC FX: {fxEnabled ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={handleCycleColor}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.6)",
              color: colorTheme === "gold" ? "#e0b974" : colorTheme === "phosphor" ? "#2dd4bf" : "#ec4899",
              cursor: "pointer",
            }}
          >
            COLOR: {colorTheme.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(0, 0, 0, 0.6)",
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
