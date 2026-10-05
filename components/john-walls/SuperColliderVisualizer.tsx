"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type VisualizerPreset =
  | "supercollider-lissajous"
  | "spectral-waterfall"
  | "sumi-ink-pulse";

interface SuperColliderVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  preset?: VisualizerPreset;
  bpm?: number;
  trackTitle?: string;
  onPresetChange?: (preset: VisualizerPreset) => void;
}

export function SuperColliderVisualizer({
  audioElement,
  isPlaying,
  preset = "supercollider-lissajous",
  bpm = 120,
  trackTitle = "Live Session",
  onPresetChange,
}: SuperColliderVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activePreset, setActivePreset] = useState<VisualizerPreset>(preset);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rmsLevel, setRmsLevel] = useState<number>(-70);
  const [peakLevel, setPeakLevel] = useState<number>(-70);

  // Sync internal preset state with prop
  useEffect(() => {
    setActivePreset(preset);
  }, [preset]);

  // Attach Web Audio API to Audio Element safely
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
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.82;
      analyserRef.current = analyser;

      try {
        // Guard against connecting multiple times to same HTMLMediaElement
        if (!sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioElement);
          sourceNodeRef.current = source;
          source.connect(analyser);
          analyser.connect(ctx.destination);
        }
      } catch (err) {
        console.warn("MediaElementAudioSourceNode already attached:", err);
      }
    }

    const unlockAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [audioElement]);

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

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let historyBuffer: number[][] = [];
    const maxHistory = 24;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      const analyser = analyserRef.current;
      const bufferLength = analyser ? analyser.frequencyBinCount : 1024;
      const timeData = new Uint8Array(bufferLength);
      const freqData = new Uint8Array(bufferLength);

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);
      } else {
        // Idle subtle harmonic oscillation when paused
        const t = performance.now() * 0.0015;
        for (let i = 0; i < bufferLength; i++) {
          const sinVal = Math.sin(t * 2 + i * 0.04) * 12 + 128;
          timeData[i] = Math.round(sinVal);
          freqData[i] = Math.max(0, Math.round(Math.sin(t + i * 0.08) * 20));
        }
      }

      // Calculate instantaneous Peak & RMS
      let sumSq = 0;
      let maxVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        const norm = (timeData[i] - 128) / 128;
        const absVal = Math.abs(norm);
        if (absVal > maxVal) maxVal = absVal;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / bufferLength);
      const currentPeakDb = maxVal > 0.001 ? Math.round(20 * Math.log10(maxVal)) : -70;
      const currentRmsDb = rms > 0.001 ? Math.round(20 * Math.log10(rms)) : -70;
      setPeakLevel(currentPeakDb);
      setRmsLevel(currentRmsDb);

      // Phosphor decay dark canvas
      ctx.fillStyle = "rgba(11, 13, 16, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Render Sub-Grid & SuperCollider Scope Reticle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSteps = 8;
      for (let i = 1; i < gridSteps; i++) {
        const gx = (width / gridSteps) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();

        const gy = (height / gridSteps) * i;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = "rgba(224, 185, 116, 0.12)";
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // RENDER PRESETS
      if (activePreset === "supercollider-lissajous") {
        // --- 1. SuperCollider Phosphor Lissajous & Vector Scope ---
        ctx.save();
        ctx.translate(width / 2, height / 2);

        const radius = Math.min(width, height) * 0.42;
        const step = 2;

        // Outer glow
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(45, 212, 191, 0.65)";
        ctx.strokeStyle = "#2dd4bf";
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        for (let i = 0; i < bufferLength - 200; i += step) {
          const xSample = (timeData[i] - 128) / 128;
          // 90 degree phase-shifted sample for XY Lissajous figure
          const ySample = (timeData[(i + 128) % bufferLength] - 128) / 128;

          const angle = (i / (bufferLength - 200)) * Math.PI * 2;
          const rMod = radius * (0.65 + xSample * 0.45);
          const px = Math.cos(angle) * rMod + ySample * 60;
          const py = Math.sin(angle) * rMod + xSample * 60;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner Gold Vector Beam
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(224, 185, 116, 0.8)";
        ctx.strokeStyle = "#e0b974";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        for (let i = 0; i < 256; i += 2) {
          const s1 = (timeData[i] - 128) / 128;
          const s2 = (timeData[i + 32] - 128) / 128;
          const x = s1 * radius * 0.85;
          const y = s2 * radius * 0.85;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (activePreset === "spectral-waterfall") {
        // --- 2. Spectral Harmonic Waterfall ---
        const currentSlice: number[] = [];
        const sliceSteps = 64;
        for (let b = 0; b < sliceSteps; b++) {
          const idx = Math.floor((b / sliceSteps) * (bufferLength / 2));
          currentSlice.push(freqData[idx] / 255);
        }
        historyBuffer.unshift(currentSlice);
        if (historyBuffer.length > maxHistory) historyBuffer.pop();

        for (let h = historyBuffer.length - 1; h >= 0; h--) {
          const slice = historyBuffer[h];
          const alpha = 1 - h / maxHistory;
          const yBase = height * 0.88 - h * 12;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(224, 185, 116, ${alpha * 0.85})`;
          ctx.lineWidth = 1.5;

          const barWidth = width / slice.length;
          for (let b = 0; b < slice.length; b++) {
            const mag = slice[b];
            const px = b * barWidth;
            const py = yBase - mag * 130 * alpha;
            if (b === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else {
        // --- 3. Archival Sumi Ink Pulse ---
        ctx.save();
        ctx.translate(width / 2, height / 2);

        const energy = rms * 2.2;
        const petals = 32;
        ctx.fillStyle = "rgba(224, 185, 116, 0.08)";
        ctx.strokeStyle = "rgba(224, 185, 116, 0.4)";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        for (let p = 0; p <= petals; p++) {
          const theta = (p / petals) * Math.PI * 2;
          const freqSample = freqData[(p * 8) % bufferLength] / 255;
          const r = 60 + energy * 180 + freqSample * 80;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // High frequency ink spatter points
        ctx.fillStyle = "rgba(45, 212, 191, 0.6)";
        for (let i = 0; i < 24; i++) {
          const angle = (i / 24) * Math.PI * 2 + performance.now() * 0.0005;
          const dist = 70 + (freqData[i * 12] / 255) * 160;
          const dotX = Math.cos(angle) * dist;
          const dotY = Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activePreset]);

  const handleSelectPreset = (p: VisualizerPreset) => {
    setActivePreset(p);
    if (onPresetChange) onPresetChange(p);
  };

  return (
    <div
      ref={containerRef}
      className={`jw-sc-visualizer ${isFullscreen ? "jw-sc-visualizer--fullscreen" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: isFullscreen ? "100vh" : "380px",
        background: "#080a0c",
        borderRadius: isFullscreen ? "0" : "12px",
        overflow: "hidden",
        border: "1px solid rgba(224, 185, 116, 0.25)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Visualizer Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* Top HUD Overlay: Telemetry & SuperCollider Status */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "18px",
          right: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isPlaying ? "#2dd4bf" : "#64748b",
              boxShadow: isPlaying ? "0 0 10px #2dd4bf" : "none",
              transition: "all 0.3s ease",
            }}
          />
          <span style={{ color: "#f8fafc", fontWeight: 600 }}>
            SC-OSC // {trackTitle}
          </span>
          <span style={{ color: "#e0b974" }}>BPM {bpm}</span>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <span>PEAK: <strong style={{ color: peakLevel > -3 ? "#ef4444" : "#e2e8f0" }}>{peakLevel} dB</strong></span>
          <span>RMS: <strong style={{ color: "#e2e8f0" }}>{rmsLevel} dB</strong></span>
        </div>
      </div>

      {/* Bottom HUD: Mode Selection & Fullscreen Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "18px",
          right: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => handleSelectPreset("supercollider-lissajous")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: activePreset === "supercollider-lissajous" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.1)",
              background: activePreset === "supercollider-lissajous" ? "rgba(224, 185, 116, 0.15)" : "rgba(0,0,0,0.5)",
              color: activePreset === "supercollider-lissajous" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            LISSAJOUS SCOPE
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("spectral-waterfall")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: activePreset === "spectral-waterfall" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.1)",
              background: activePreset === "spectral-waterfall" ? "rgba(224, 185, 116, 0.15)" : "rgba(0,0,0,0.5)",
              color: activePreset === "spectral-waterfall" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            SPECTRAL WATERFALL
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("sumi-ink-pulse")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              borderRadius: "4px",
              border: activePreset === "sumi-ink-pulse" ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.1)",
              background: activePreset === "sumi-ink-pulse" ? "rgba(224, 185, 116, 0.15)" : "rgba(0,0,0,0.5)",
              color: activePreset === "sumi-ink-pulse" ? "#e0b974" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            SUMI INK PULSE
          </button>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          style={{
            padding: "4px 10px",
            fontSize: "11px",
            fontFamily: "ui-monospace, monospace",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(0, 0, 0, 0.5)",
            color: "#cbd5e1",
            cursor: "pointer",
          }}
        >
          {isFullscreen ? "✕ EXIT FULLSCREEN" : "⛶ FULLSCREEN"}
        </button>
      </div>
    </div>
  );
}
export default SuperColliderVisualizer;
