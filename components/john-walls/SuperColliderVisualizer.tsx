"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";

export type VisualizerPreset =
  | "supercollider-lissajous"
  | "spectral-waterfall"
  | "sumi-ink-pulse"
  | "acid-kaleidoscope"
  | "cyberpunk-drift"
  | "golden-mandala"
  | "crt-phosphor"
  | "solar-flare-warp"
  | "custom";

export type ColorTheme =
  | "gold-amber"
  | "phosphor-emerald"
  | "acid-rainbow"
  | "cyberpunk"
  | "monochrome-sumi"
  | "solar-flare";

export interface VisualizerConfig {
  id?: string;
  name?: string;
  layers: {
    lissajous: boolean;
    waterfall: boolean;
    sumi: boolean;
    particles: boolean;
    waveform: boolean;
  };
  layerOpacity: {
    lissajous: number;
    waterfall: number;
    sumi: number;
    particles: number;
    waveform: number;
  };
  effects: {
    kaleidoscope: boolean;
    kaleidoscopeSegments: number; // 4, 6, 8, 12
    feedbackEcho: boolean;
    feedbackDecay: number; // 0.70 to 0.98
    chromaticAberration: boolean;
    chromaticOffset: number; // 2 to 24
  };
  colorTheme: ColorTheme;
  sensitivity: number; // 0.5 to 2.5
  rotationSpeed: number; // 0.0 to 3.0
}

export interface SavedUserPreset {
  id: string;
  name: string;
  config: VisualizerConfig;
  savedAt: string;
}

// Built-in Curated Presets
export const CURATED_PRESETS: Record<string, { label: string; tag: string; config: VisualizerConfig }> = {
  "supercollider-lissajous": {
    label: "Phosphor Lissajous",
    tag: "SC-OSC",
    config: {
      layers: { lissajous: true, waterfall: false, sumi: false, particles: false, waveform: false },
      layerOpacity: { lissajous: 1.0, waterfall: 0.7, sumi: 0.8, particles: 0.7, waveform: 0.8 },
      effects: { kaleidoscope: false, kaleidoscopeSegments: 6, feedbackEcho: true, feedbackDecay: 0.82, chromaticAberration: false, chromaticOffset: 6 },
      colorTheme: "phosphor-emerald",
      sensitivity: 1.2,
      rotationSpeed: 0.8,
    },
  },
  "golden-mandala": {
    label: "Golden Mandala",
    tag: "SACRED GEOMETRY",
    config: {
      layers: { lissajous: true, waterfall: false, sumi: true, particles: true, waveform: false },
      layerOpacity: { lissajous: 0.9, waterfall: 0.7, sumi: 0.85, particles: 0.75, waveform: 0.8 },
      effects: { kaleidoscope: true, kaleidoscopeSegments: 8, feedbackEcho: true, feedbackDecay: 0.91, chromaticAberration: true, chromaticOffset: 6 },
      colorTheme: "gold-amber",
      sensitivity: 1.3,
      rotationSpeed: 1.0,
    },
  },
  "spectral-waterfall": {
    label: "Spectral Waterfall",
    tag: "HARMONIC 3D",
    config: {
      layers: { lissajous: false, waterfall: true, sumi: false, particles: true, waveform: true },
      layerOpacity: { lissajous: 0.8, waterfall: 1.0, sumi: 0.8, particles: 0.6, waveform: 0.7 },
      effects: { kaleidoscope: false, kaleidoscopeSegments: 4, feedbackEcho: true, feedbackDecay: 0.88, chromaticAberration: true, chromaticOffset: 8 },
      colorTheme: "cyberpunk",
      sensitivity: 1.4,
      rotationSpeed: 0.5,
    },
  },
  "acid-kaleidoscope": {
    label: "Acid Kaleidoscope",
    tag: "PSYCHEDELIC PRISM",
    config: {
      layers: { lissajous: true, waterfall: true, sumi: true, particles: true, waveform: false },
      layerOpacity: { lissajous: 0.9, waterfall: 0.75, sumi: 0.8, particles: 0.8, waveform: 0.6 },
      effects: { kaleidoscope: true, kaleidoscopeSegments: 6, feedbackEcho: true, feedbackDecay: 0.94, chromaticAberration: true, chromaticOffset: 14 },
      colorTheme: "acid-rainbow",
      sensitivity: 1.5,
      rotationSpeed: 1.6,
    },
  },
  "sumi-ink-pulse": {
    label: "Sumi Zen Blossom",
    tag: "ARCHIVAL INK",
    config: {
      layers: { lissajous: false, waterfall: false, sumi: true, particles: true, waveform: true },
      layerOpacity: { lissajous: 0.7, waterfall: 0.7, sumi: 1.0, particles: 0.6, waveform: 0.8 },
      effects: { kaleidoscope: false, kaleidoscopeSegments: 4, feedbackEcho: true, feedbackDecay: 0.80, chromaticAberration: false, chromaticOffset: 4 },
      colorTheme: "monochrome-sumi",
      sensitivity: 1.1,
      rotationSpeed: 0.4,
    },
  },
  "solar-flare-warp": {
    label: "Solar Flare Warp",
    tag: "MOLTEN CORONA",
    config: {
      layers: { lissajous: true, waterfall: true, sumi: false, particles: true, waveform: true },
      layerOpacity: { lissajous: 0.9, waterfall: 0.8, sumi: 0.7, particles: 0.85, waveform: 0.7 },
      effects: { kaleidoscope: true, kaleidoscopeSegments: 4, feedbackEcho: true, feedbackDecay: 0.93, chromaticAberration: true, chromaticOffset: 10 },
      colorTheme: "solar-flare",
      sensitivity: 1.4,
      rotationSpeed: 1.2,
    },
  },
};

const DEFAULT_CONFIG = CURATED_PRESETS["supercollider-lissajous"].config;
const LOCALSTORAGE_ACTIVE_KEY = "jw_visualizer_active_config";
const LOCALSTORAGE_SAVED_KEY = "jw_visualizer_saved_presets";

interface SuperColliderVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  preset?: VisualizerPreset;
  bpm?: number;
  trackTitle?: string;
  trackVisualizerConfig?: Partial<VisualizerConfig>;
  onPresetChange?: (preset: VisualizerPreset) => void;
}

export function SuperColliderVisualizer({
  audioElement,
  isPlaying,
  preset = "supercollider-lissajous",
  bpm = 120,
  trackTitle = "Live Session",
  trackVisualizerConfig,
  onPresetChange,
}: SuperColliderVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const feedbackCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Studio drawer toggle
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"layers" | "effects" | "themes" | "presets">("layers");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Meter levels
  const [rmsLevel, setRmsLevel] = useState<number>(-70);
  const [peakLevel, setPeakLevel] = useState<number>(-70);

  // Active configuration
  const [config, setConfig] = useState<VisualizerConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCALSTORAGE_ACTIVE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.layers && parsed.effects) {
            return parsed;
          }
        }
      } catch {}
    }
    return DEFAULT_CONFIG;
  });

  // Saved user presets list
  const [savedPresets, setSavedPresets] = useState<SavedUserPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>("");
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Load saved presets from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_SAVED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedPresets(parsed);
        }
      }
    } catch {}
  }, []);

  // Save active config to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCALSTORAGE_ACTIVE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Sync when preset or trackVisualizerConfig prop changes
  useEffect(() => {
    if (trackVisualizerConfig) {
      setConfig((prev) => ({
        ...prev,
        ...trackVisualizerConfig,
        layers: { ...prev.layers, ...(trackVisualizerConfig.layers || {}) },
        layerOpacity: { ...prev.layerOpacity, ...(trackVisualizerConfig.layerOpacity || {}) },
        effects: { ...prev.effects, ...(trackVisualizerConfig.effects || {}) },
      }));
    } else if (preset && CURATED_PRESETS[preset]) {
      setConfig(CURATED_PRESETS[preset].config);
    }
  }, [preset, trackVisualizerConfig]);

  // Web Audio Context setup
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

  const notifyUser = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification(null);
    }, 2800);
  };

  const handleSavePreset = () => {
    const trimmed = newPresetName.trim();
    if (!trimmed) return;
    const newEntry: SavedUserPreset = {
      id: `usr_preset_${Date.now()}`,
      name: trimmed,
      config: { ...config, name: trimmed },
      savedAt: new Date().toISOString(),
    };
    const nextList = [newEntry, ...savedPresets.filter((p) => p.name.toLowerCase() !== trimmed.toLowerCase())];
    setSavedPresets(nextList);
    setNewPresetName("");
    try {
      localStorage.setItem(LOCALSTORAGE_SAVED_KEY, JSON.stringify(nextList));
    } catch {}
    notifyUser(`Saved preset: "${trimmed}"`);
  };

  const handleDeletePreset = (id: string, name: string) => {
    const nextList = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(nextList);
    try {
      localStorage.setItem(LOCALSTORAGE_SAVED_KEY, JSON.stringify(nextList));
    } catch {}
    notifyUser(`Deleted preset: "${name}"`);
  };

  const handleApplyPreset = (pConfig: VisualizerConfig, presetKey?: VisualizerPreset) => {
    setConfig(pConfig);
    if (presetKey && onPresetChange) {
      onPresetChange(presetKey);
    } else if (onPresetChange) {
      onPresetChange("custom");
    }
    notifyUser(`Loaded preset`);
  };

  // Setup offscreen canvas buffers for multi-pass effects
  useEffect(() => {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    if (!feedbackCanvasRef.current) {
      feedbackCanvasRef.current = document.createElement("canvas");
    }
  }, []);

  // Particle System Pool
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      hueOffset: number;
    }>
  >([]);

  useEffect(() => {
    const count = 120;
    const pool = [];
    for (let i = 0; i < count; i++) {
      pool.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        hueOffset: Math.random() * 60,
      });
    }
    particlesRef.current = pool;
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

      if (width === 0 || height === 0) return;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      // Sync offscreen buffers
      const offCanvas = offscreenCanvasRef.current;
      if (offCanvas) {
        if (offCanvas.width !== width || offCanvas.height !== height) {
          offCanvas.width = width;
          offCanvas.height = height;
        }
      }
      const feedCanvas = feedbackCanvasRef.current;
      if (feedCanvas) {
        if (feedCanvas.width !== width || feedCanvas.height !== height) {
          feedCanvas.width = width;
          feedCanvas.height = height;
        }
      }

      const offCtx = offCanvas?.getContext("2d");
      const feedCtx = feedCanvas?.getContext("2d");
      if (!offCtx) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser ? analyser.frequencyBinCount : 1024;
      const timeData = new Uint8Array(bufferLength);
      const freqData = new Uint8Array(bufferLength);

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);
      } else {
        const t = performance.now() * 0.0015;
        for (let i = 0; i < bufferLength; i++) {
          const sinVal = Math.sin(t * 2 + i * 0.04) * 12 + 128;
          timeData[i] = Math.round(sinVal);
          freqData[i] = Math.max(0, Math.round(Math.sin(t + i * 0.08) * 20));
        }
      }

      // Instantaneous Peak & RMS
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

      const timeSec = performance.now() * 0.001;
      const sens = config.sensitivity || 1.2;
      const rotSpd = config.rotationSpeed || 1.0;

      // Color Theme computation
      let primaryColor = "#e0b974";
      let secondaryColor = "#2dd4bf";
      let accentColor = "#f59e0b";
      let glowColor = "rgba(224, 185, 116, 0.75)";
      let bgColor = "#080a0c";

      if (config.colorTheme === "phosphor-emerald") {
        primaryColor = "#2dd4bf";
        secondaryColor = "#10b981";
        accentColor = "#34d399";
        glowColor = "rgba(45, 212, 191, 0.75)";
        bgColor = "#040d0a";
      } else if (config.colorTheme === "acid-rainbow") {
        const h1 = (timeSec * 50) % 360;
        const h2 = (timeSec * 50 + 120) % 360;
        const h3 = (timeSec * 50 + 240) % 360;
        primaryColor = `hsl(${h1}, 95%, 62%)`;
        secondaryColor = `hsl(${h2}, 95%, 60%)`;
        accentColor = `hsl(${h3}, 95%, 65%)`;
        glowColor = `hsla(${h1}, 95%, 55%, 0.8)`;
        bgColor = "#070712";
      } else if (config.colorTheme === "cyberpunk") {
        primaryColor = "#ec4899";
        secondaryColor = "#06b6d4";
        accentColor = "#a855f7";
        glowColor = "rgba(236, 72, 153, 0.75)";
        bgColor = "#090514";
      } else if (config.colorTheme === "monochrome-sumi") {
        primaryColor = "#f8fafc";
        secondaryColor = "#94a3b8";
        accentColor = "#cbd5e1";
        glowColor = "rgba(255, 255, 255, 0.6)";
        bgColor = "#09090b";
      } else if (config.colorTheme === "solar-flare") {
        primaryColor = "#f97316";
        secondaryColor = "#ef4444";
        accentColor = "#fbbf24";
        glowColor = "rgba(249, 115, 22, 0.8)";
        bgColor = "#0e0603";
      }

      // Step 1: Render Layers onto offCanvas
      offCtx.clearRect(0, 0, width, height);

      // Subtle Background Grid & Scope Reticle on offCanvas
      offCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      offCtx.lineWidth = 1;
      const gridSteps = 8;
      for (let i = 1; i < gridSteps; i++) {
        const gx = (width / gridSteps) * i;
        offCtx.beginPath();
        offCtx.moveTo(gx, 0);
        offCtx.lineTo(gx, height);
        offCtx.stroke();

        const gy = (height / gridSteps) * i;
        offCtx.beginPath();
        offCtx.moveTo(0, gy);
        offCtx.lineTo(width, gy);
        offCtx.stroke();
      }

      // Center crosshairs
      offCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      offCtx.beginPath();
      offCtx.moveTo(width / 2, 0);
      offCtx.lineTo(width / 2, height);
      offCtx.moveTo(0, height / 2);
      offCtx.lineTo(width, height / 2);
      offCtx.stroke();

      // --- LAYER 1: Spectral Harmonic Waterfall ---
      if (config.layers.waterfall) {
        offCtx.save();
        offCtx.globalAlpha = config.layerOpacity.waterfall;
        const currentSlice: number[] = [];
        const sliceSteps = 56;
        for (let b = 0; b < sliceSteps; b++) {
          const idx = Math.floor((b / sliceSteps) * (bufferLength / 2));
          currentSlice.push(freqData[idx] / 255);
        }
        historyBuffer.unshift(currentSlice);
        if (historyBuffer.length > maxHistory) historyBuffer.pop();

        for (let h = historyBuffer.length - 1; h >= 0; h--) {
          const slice = historyBuffer[h];
          const alpha = 1 - h / maxHistory;
          const yBase = height * 0.88 - h * 11;

          offCtx.beginPath();
          offCtx.strokeStyle = h === 0 ? primaryColor : secondaryColor;
          offCtx.globalAlpha = alpha * config.layerOpacity.waterfall * 0.85;
          offCtx.lineWidth = h === 0 ? 2 : 1.2;

          const barWidth = width / slice.length;
          for (let b = 0; b < slice.length; b++) {
            const mag = slice[b] * sens;
            const px = b * barWidth;
            const py = yBase - mag * 125 * alpha;
            if (b === 0) offCtx.moveTo(px, py);
            else offCtx.lineTo(px, py);
          }
          offCtx.stroke();
        }
        offCtx.restore();
      }

      // --- LAYER 2: Archival Sumi Ink Blossom ---
      if (config.layers.sumi) {
        offCtx.save();
        offCtx.globalAlpha = config.layerOpacity.sumi;
        offCtx.translate(width / 2, height / 2);

        const energy = rms * 2.2 * sens;
        const petals = 28;
        offCtx.fillStyle = `${glowColor.replace("0.75", "0.08").replace("0.8", "0.08")}`;
        offCtx.strokeStyle = primaryColor;
        offCtx.lineWidth = 1.4;

        offCtx.beginPath();
        for (let p = 0; p <= petals; p++) {
          const theta = (p / petals) * Math.PI * 2;
          const freqSample = (freqData[(p * 8) % bufferLength] / 255) * sens;
          const r = 55 + energy * 160 + freqSample * 75;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;
          if (p === 0) offCtx.moveTo(px, py);
          else offCtx.lineTo(px, py);
        }
        offCtx.closePath();
        offCtx.fill();
        offCtx.stroke();

        // High frequency spatter
        offCtx.fillStyle = secondaryColor;
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2 + timeSec * 0.4 * rotSpd;
          const dist = 65 + (freqData[i * 12] / 255) * 150 * sens;
          const dotX = Math.cos(angle) * dist;
          const dotY = Math.sin(angle) * dist;
          offCtx.beginPath();
          offCtx.arc(dotX, dotY, 2.0, 0, Math.PI * 2);
          offCtx.fill();
        }
        offCtx.restore();
      }

      // --- LAYER 3: Cosmic Stardust / Particle Nebula ---
      if (config.layers.particles && particlesRef.current.length > 0) {
        offCtx.save();
        offCtx.globalAlpha = config.layerOpacity.particles;
        const bassMag = (freqData[4] / 255) * sens;
        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx * (1 + bassMag * 1.5);
          p.y += p.vy * (1 + bassMag * 1.5);

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const pRadius = p.radius * (1 + bassMag * 0.8);
          offCtx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
          offCtx.beginPath();
          offCtx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
          offCtx.fill();
        }
        offCtx.restore();
      }

      // --- LAYER 4: SuperCollider Vector Scope (Lissajous) ---
      if (config.layers.lissajous) {
        offCtx.save();
        offCtx.globalAlpha = config.layerOpacity.lissajous;
        offCtx.translate(width / 2, height / 2);
        offCtx.rotate(timeSec * 0.3 * rotSpd);

        const radius = Math.min(width, height) * 0.4 * sens;
        const step = 2;

        offCtx.shadowBlur = 12;
        offCtx.shadowColor = glowColor;
        offCtx.strokeStyle = primaryColor;
        offCtx.lineWidth = 1.8;

        offCtx.beginPath();
        for (let i = 0; i < bufferLength - 200; i += step) {
          const xSample = ((timeData[i] - 128) / 128) * sens;
          const ySample = ((timeData[(i + 128) % bufferLength] - 128) / 128) * sens;

          const angle = (i / (bufferLength - 200)) * Math.PI * 2;
          const rMod = radius * (0.65 + xSample * 0.42);
          const px = Math.cos(angle) * rMod + ySample * 55;
          const py = Math.sin(angle) * rMod + xSample * 55;

          if (i === 0) offCtx.moveTo(px, py);
          else offCtx.lineTo(px, py);
        }
        offCtx.closePath();
        offCtx.stroke();

        // Inner Vector Beam Core
        offCtx.shadowBlur = 6;
        offCtx.shadowColor = glowColor;
        offCtx.strokeStyle = accentColor;
        offCtx.lineWidth = 1.2;

        offCtx.beginPath();
        for (let i = 0; i < 256; i += 2) {
          const s1 = ((timeData[i] - 128) / 128) * sens;
          const s2 = ((timeData[i + 32] - 128) / 128) * sens;
          const x = s1 * radius * 0.85;
          const y = s2 * radius * 0.85;
          if (i === 0) offCtx.moveTo(x, y);
          else offCtx.lineTo(x, y);
        }
        offCtx.stroke();
        offCtx.restore();
      }

      // --- LAYER 5: CRT Oscilloscope Waveform Beam ---
      if (config.layers.waveform) {
        offCtx.save();
        offCtx.globalAlpha = config.layerOpacity.waveform;
        offCtx.strokeStyle = secondaryColor;
        offCtx.lineWidth = 1.6;
        offCtx.shadowBlur = 8;
        offCtx.shadowColor = glowColor;

        offCtx.beginPath();
        const sliceWidth = width / 256;
        let x = 0;
        for (let i = 0; i < 256; i++) {
          const v = timeData[i * 4] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) offCtx.moveTo(x, y);
          else offCtx.lineTo(x, y);
          x += sliceWidth;
        }
        offCtx.stroke();
        offCtx.restore();
      }

      // Step 2: Post-Processing & Psychedelic Compositing onto Main Canvas
      // Base background fill with phosphor persistence
      const decay = config.effects.feedbackEcho ? config.effects.feedbackDecay : 0.25;
      ctx.fillStyle = `rgba(8, 10, 12, ${1 - decay})`;
      ctx.fillRect(0, 0, width, height);

      // Feedback Echo accumulation
      if (config.effects.feedbackEcho && feedCanvas && feedCtx) {
        ctx.save();
        ctx.globalAlpha = decay;
        ctx.drawImage(feedCanvas, 0, 0);
        ctx.restore();
      }

      // Apply Kaleidoscope or Direct Draw
      if (config.effects.kaleidoscope && offCanvas) {
        const segments = Math.max(4, config.effects.kaleidoscopeSegments || 6);
        const theta = (Math.PI * 2) / segments;
        const cx = width / 2;
        const cy = height / 2;

        for (let k = 0; k < segments; k++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(k * theta + timeSec * 0.08 * rotSpd);
          if (k % 2 === 1) {
            ctx.scale(1, -1);
          }

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.max(width, height) * 1.5, -Math.tan(theta / 2) * Math.max(width, height) * 1.5);
          ctx.lineTo(Math.max(width, height) * 1.5, Math.tan(theta / 2) * Math.max(width, height) * 1.5);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(offCanvas, -cx, -cy);
          ctx.restore();
        }
      } else if (offCanvas) {
        ctx.drawImage(offCanvas, 0, 0);
      }

      // Chromatic Aberration Pass (RGB Prism Shift)
      if (config.effects.chromaticAberration && offCanvas) {
        const bassVal = (freqData[2] / 255) * sens;
        const shift = Math.round(config.effects.chromaticOffset * (0.8 + bassVal * 1.5));

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.65;
        // Cyan / Blue shift
        ctx.drawImage(canvas, shift, 0);
        // Red shift
        ctx.drawImage(canvas, -shift, 0);
        ctx.restore();
      }

      // Save output to feedback canvas for next frame recursive trail
      if (config.effects.feedbackEcho && feedCanvas && feedCtx) {
        feedCtx.clearRect(0, 0, width, height);
        feedCtx.save();
        feedCtx.translate(width / 2, height / 2);
        // Subtle rotational zoom feedback trail
        feedCtx.scale(1.008, 1.008);
        feedCtx.rotate(0.003 * rotSpd);
        feedCtx.drawImage(canvas, -width / 2, -height / 2);
        feedCtx.restore();
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, config]);

  const uniqueId = useId();

  return (
    <div
      ref={containerRef}
      className={`jw-sc-visualizer ${isFullscreen ? "jw-sc-visualizer--fullscreen" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: isFullscreen ? "100vh" : isStudioOpen ? "580px" : "400px",
        background: "#080a0c",
        borderRadius: isFullscreen ? "0" : "12px",
        overflow: "hidden",
        border: "1px solid rgba(224, 185, 116, 0.3)",
        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.65)",
        display: "flex",
        flexDirection: "column",
        transition: "height 0.3s ease",
      }}
    >
      {/* Visualizer Canvas Area */}
      <div style={{ position: "relative", flex: 1, width: "100%", minHeight: "280px" }}>
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
            zIndex: 10,
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
              SC-AUDIO // {trackTitle}
            </span>
            <span style={{ color: "#e0b974" }}>BPM {bpm}</span>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {config.effects.kaleidoscope && (
              <span style={{ color: "#a855f7", background: "rgba(168, 85, 247, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                KALEIDOSCOPE {config.effects.kaleidoscopeSegments}X
              </span>
            )}
            {config.effects.feedbackEcho && (
              <span style={{ color: "#2dd4bf", background: "rgba(45, 212, 191, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                FEEDBACK
              </span>
            )}
            <span>PEAK: <strong style={{ color: peakLevel > -3 ? "#ef4444" : "#e2e8f0" }}>{peakLevel} dB</strong></span>
            <span>RMS: <strong style={{ color: "#e2e8f0" }}>{rmsLevel} dB</strong></span>
          </div>
        </div>

        {/* Temporary Notification Banner */}
        {statusNotification && (
          <div
            style={{
              position: "absolute",
              top: "48px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid #e0b974",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              color: "#e0b974",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              zIndex: 20,
            }}
          >
            ✦ {statusNotification}
          </div>
        )}

        {/* Bottom Bar: Presets & Studio Drawer Toggle */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "16px",
            right: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Quick Curated Preset Pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {Object.entries(CURATED_PRESETS).slice(0, 4).map(([key, item]) => {
              const isActive = preset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(item.config, key as VisualizerPreset)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    fontFamily: "ui-monospace, monospace",
                    borderRadius: "4px",
                    border: isActive ? "1px solid #e0b974" : "1px solid rgba(255,255,255,0.12)",
                    background: isActive ? "rgba(224, 185, 116, 0.2)" : "rgba(0,0,0,0.6)",
                    color: isActive ? "#e0b974" : "#94a3b8",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {item.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setIsStudioOpen(!isStudioOpen)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                fontWeight: 600,
                borderRadius: "4px",
                border: "1px solid #e0b974",
                background: isStudioOpen ? "#e0b974" : "rgba(224, 185, 116, 0.15)",
                color: isStudioOpen ? "#0f172a" : "#e0b974",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
            >
              <span>✦</span> {isStudioOpen ? "HIDE CONTROLS" : "VISUALIZER STUDIO"}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(0, 0, 0, 0.6)",
                color: "#cbd5e1",
                cursor: "pointer",
              }}
            >
              {isFullscreen ? "✕ EXIT" : "⛶ FULL"}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Studio Controls Drawer */}
      {isStudioOpen && (
        <div
          style={{
            background: "rgba(11, 15, 22, 0.96)",
            borderTop: "1px solid rgba(224, 185, 116, 0.25)",
            padding: "1rem 1.25rem",
            color: "#e2e8f0",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "12px",
            overflowY: "auto",
            maxHeight: "220px",
          }}
        >
          {/* Studio Navigation Tabs */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "8px", marginBottom: "12px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("layers")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                fontWeight: activeTab === "layers" ? 700 : 400,
                color: activeTab === "layers" ? "#e0b974" : "#94a3b8",
                cursor: "pointer",
                padding: "2px 8px",
                borderBottom: activeTab === "layers" ? "2px solid #e0b974" : "none",
              }}
            >
              1. OVERLAY LAYERS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("effects")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                fontWeight: activeTab === "effects" ? 700 : 400,
                color: activeTab === "effects" ? "#e0b974" : "#94a3b8",
                cursor: "pointer",
                padding: "2px 8px",
                borderBottom: activeTab === "effects" ? "2px solid #e0b974" : "none",
              }}
            >
              2. PSYCHEDELIC FX
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("themes")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                fontWeight: activeTab === "themes" ? 700 : 400,
                color: activeTab === "themes" ? "#e0b974" : "#94a3b8",
                cursor: "pointer",
                padding: "2px 8px",
                borderBottom: activeTab === "themes" ? "2px solid #e0b974" : "none",
              }}
            >
              3. COLOR THEMES
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                fontWeight: activeTab === "presets" ? 700 : 400,
                color: activeTab === "presets" ? "#e0b974" : "#94a3b8",
                cursor: "pointer",
                padding: "2px 8px",
                borderBottom: activeTab === "presets" ? "2px solid #e0b974" : "none",
              }}
            >
              4. MY PRESETS & STORAGE
            </button>
          </div>

          {/* TAB 1: OVERLAY LAYERS */}
          {activeTab === "layers" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
              {/* Lissajous */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor={`${uniqueId}-layer-lissajous`} style={{ fontWeight: 600, fontSize: "11px", cursor: "pointer" }}>Lissajous Vector Scope</label>
                  <input
                    id={`${uniqueId}-layer-lissajous`}
                    type="checkbox"
                    checked={config.layers.lissajous}
                    onChange={(e) => setConfig({ ...config, layers: { ...config.layers, lissajous: e.target.checked } })}
                    style={{ accentColor: "#e0b974", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.layerOpacity.lissajous}
                    onChange={(e) => setConfig({ ...config, layerOpacity: { ...config.layerOpacity, lissajous: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#e0b974" }}
                  />
                </div>
              </div>

              {/* Waterfall */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor={`${uniqueId}-layer-waterfall`} style={{ fontWeight: 600, fontSize: "11px", cursor: "pointer" }}>Spectral Waterfall</label>
                  <input
                    id={`${uniqueId}-layer-waterfall`}
                    type="checkbox"
                    checked={config.layers.waterfall}
                    onChange={(e) => setConfig({ ...config, layers: { ...config.layers, waterfall: e.target.checked } })}
                    style={{ accentColor: "#e0b974", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.layerOpacity.waterfall}
                    onChange={(e) => setConfig({ ...config, layerOpacity: { ...config.layerOpacity, waterfall: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#e0b974" }}
                  />
                </div>
              </div>

              {/* Sumi Ink */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor={`${uniqueId}-layer-sumi`} style={{ fontWeight: 600, fontSize: "11px", cursor: "pointer" }}>Sumi Ink Blossom</label>
                  <input
                    id={`${uniqueId}-layer-sumi`}
                    type="checkbox"
                    checked={config.layers.sumi}
                    onChange={(e) => setConfig({ ...config, layers: { ...config.layers, sumi: e.target.checked } })}
                    style={{ accentColor: "#e0b974", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.layerOpacity.sumi}
                    onChange={(e) => setConfig({ ...config, layerOpacity: { ...config.layerOpacity, sumi: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#e0b974" }}
                  />
                </div>
              </div>

              {/* Particles */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor={`${uniqueId}-layer-particles`} style={{ fontWeight: 600, fontSize: "11px", cursor: "pointer" }}>Cosmic Particles</label>
                  <input
                    id={`${uniqueId}-layer-particles`}
                    type="checkbox"
                    checked={config.layers.particles}
                    onChange={(e) => setConfig({ ...config, layers: { ...config.layers, particles: e.target.checked } })}
                    style={{ accentColor: "#e0b974", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.layerOpacity.particles}
                    onChange={(e) => setConfig({ ...config, layerOpacity: { ...config.layerOpacity, particles: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#e0b974" }}
                  />
                </div>
              </div>

              {/* Waveform */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label htmlFor={`${uniqueId}-layer-waveform`} style={{ fontWeight: 600, fontSize: "11px", cursor: "pointer" }}>CRT Waveform Beam</label>
                  <input
                    id={`${uniqueId}-layer-waveform`}
                    type="checkbox"
                    checked={config.layers.waveform}
                    onChange={(e) => setConfig({ ...config, layers: { ...config.layers, waveform: e.target.checked } })}
                    style={{ accentColor: "#e0b974", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.layerOpacity.waveform}
                    onChange={(e) => setConfig({ ...config, layerOpacity: { ...config.layerOpacity, waveform: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#e0b974" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PSYCHEDELIC FX */}
          {activeTab === "effects" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {/* Kaleidoscope */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "#a855f7" }}>✦ Kaleidoscope Mirror</span>
                  <input
                    type="checkbox"
                    checked={config.effects.kaleidoscope}
                    onChange={(e) => setConfig({ ...config, effects: { ...config.effects, kaleidoscope: e.target.checked } })}
                    style={{ accentColor: "#a855f7", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  {[4, 6, 8, 12].map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => setConfig({ ...config, effects: { ...config.effects, kaleidoscopeSegments: seg } })}
                      style={{
                        flex: 1,
                        padding: "3px",
                        fontSize: "10px",
                        fontFamily: "ui-monospace, monospace",
                        borderRadius: "4px",
                        border: config.effects.kaleidoscopeSegments === seg ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                        background: config.effects.kaleidoscopeSegments === seg ? "rgba(168, 85, 247, 0.25)" : "transparent",
                        color: config.effects.kaleidoscopeSegments === seg ? "#c084fc" : "#94a3b8",
                        cursor: "pointer",
                      }}
                    >
                      {seg}X
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Echo */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "#2dd4bf" }}>✦ Feedback Phosphor Trail</span>
                  <input
                    type="checkbox"
                    checked={config.effects.feedbackEcho}
                    onChange={(e) => setConfig({ ...config, effects: { ...config.effects, feedbackEcho: e.target.checked } })}
                    style={{ accentColor: "#2dd4bf", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Decay ({Math.round(config.effects.feedbackDecay * 100)}%)</span>
                  <input
                    type="range"
                    min="0.75"
                    max="0.97"
                    step="0.01"
                    value={config.effects.feedbackDecay}
                    onChange={(e) => setConfig({ ...config, effects: { ...config.effects, feedbackDecay: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#2dd4bf" }}
                  />
                </div>
              </div>

              {/* Chromatic Aberration */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "#ec4899" }}>✦ Chromatic RGB Prism</span>
                  <input
                    type="checkbox"
                    checked={config.effects.chromaticAberration}
                    onChange={(e) => setConfig({ ...config, effects: { ...config.effects, chromaticAberration: e.target.checked } })}
                    style={{ accentColor: "#ec4899", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>Offset ({config.effects.chromaticOffset}px)</span>
                  <input
                    type="range"
                    min="2"
                    max="22"
                    step="1"
                    value={config.effects.chromaticOffset}
                    onChange={(e) => setConfig({ ...config, effects: { ...config.effects, chromaticOffset: Number(e.target.value) } })}
                    style={{ flex: 1, accentColor: "#ec4899" }}
                  />
                </div>
              </div>

              {/* Audio Sensitivity & Rotation */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontWeight: 600, color: "#e0b974", display: "block", marginBottom: "6px" }}>Dynamics & Motion</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", minWidth: "65px" }}>Audio Sens:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={config.sensitivity}
                      onChange={(e) => setConfig({ ...config, sensitivity: Number(e.target.value) })}
                      style={{ flex: 1, accentColor: "#e0b974" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", minWidth: "65px" }}>Spin Rate:</span>
                    <input
                      type="range"
                      min="0.0"
                      max="3.0"
                      step="0.2"
                      value={config.rotationSpeed}
                      onChange={(e) => setConfig({ ...config, rotationSpeed: Number(e.target.value) })}
                      style={{ flex: 1, accentColor: "#e0b974" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLOR THEMES */}
          {activeTab === "themes" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
              {[
                { id: "gold-amber", label: "Studio Gold", bg: "#e0b974", color: "#000" },
                { id: "phosphor-emerald", label: "Phosphor CRT", bg: "#2dd4bf", color: "#000" },
                { id: "acid-rainbow", label: "Acid Rainbow", bg: "linear-gradient(45deg, #f43f5e, #3b82f6, #10b981)", color: "#fff" },
                { id: "cyberpunk", label: "Cyberpunk Neon", bg: "linear-gradient(45deg, #ec4899, #06b6d4)", color: "#fff" },
                { id: "monochrome-sumi", label: "Archival Sumi", bg: "#f8fafc", color: "#000" },
                { id: "solar-flare", label: "Solar Flare", bg: "linear-gradient(45deg, #ef4444, #f97316)", color: "#fff" },
              ].map((th) => {
                const isSelected = config.colorTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setConfig({ ...config, colorTheme: th.id as ColorTheme })}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "6px",
                      border: isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(0,0,0,0.5)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: isSelected ? "0 0 12px rgba(255,255,255,0.3)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: th.bg,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                      }}
                    />
                    <span style={{ fontSize: "11px", fontWeight: isSelected ? 700 : 500, color: isSelected ? "#fff" : "#94a3b8" }}>
                      {th.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 4: PRESETS & LOCALSTORAGE */}
          {activeTab === "presets" && (
            <div>
              {/* Save New Preset Form */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Name your custom visualizer preset..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    color: "#f8fafc",
                    fontFamily: "ui-monospace, monospace",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSavePreset}
                  style={{
                    padding: "6px 14px",
                    background: "#e0b974",
                    border: "none",
                    borderRadius: "6px",
                    color: "#0f172a",
                    fontWeight: 700,
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  SAVE TO LOCALSTORAGE
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(DEFAULT_CONFIG, "supercollider-lissajous")}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  RESET DEFAULTS
                </button>
              </div>

              {/* Saved Presets List */}
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Saved In Your Browser ({savedPresets.length})
                </span>
                {savedPresets.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "11px", margin: 0, fontStyle: "italic" }}>
                    No custom presets saved yet. Adjust your layers and effects above, type a name, and click Save!
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {savedPresets.map((sp) => (
                      <div
                        key={sp.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "rgba(255,255,255,0.06)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#f8fafc" }}>{sp.name}</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(sp.config)}
                          style={{
                            background: "#e0b974",
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            color: "#0f172a",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          LOAD
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(sp.id, sp.name)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "0 2px",
                          }}
                          aria-label="Delete preset"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SuperColliderVisualizer;
