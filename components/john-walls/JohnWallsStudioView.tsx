"use client";

import React, { useState, useEffect, useRef } from "react";
import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";
import { SuperColliderVisualizer, VisualizerPreset } from "./SuperColliderVisualizer";

export interface PublishedTrack {
  id: string;
  trackNumber?: number;
  title: string;
  artist: string;
  description: string;
  audioUrl: string;
  fileName: string;
  fileSizeBytes: number;
  bpm: number;
  durationSeconds: number;
  barLength: number;
  keySignature?: string;
  dawSource: string;
  alsProject?: string;
  visualizerPreset?: string;
  tags: string[];
  publishedAt: string;
}

function mapPreset(p?: string): VisualizerPreset {
  if (p === "spectral-waterfall" || p === "waterfall") return "waterfall";
  if (p === "sumi-ink-pulse" || p === "mandala" || p === "golden-mandala") return "mandala";
  return "lissajous";
}

export function JohnWallsStudioView() {
  const [tracks, setTracks] = useState<PublishedTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentPreset, setCurrentPreset] = useState<VisualizerPreset>("lissajous");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedInstallCmd, setCopiedInstallCmd] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch published tracks on load
  const loadTracks = async () => {
    try {
      const res = await fetch("/api/johnwalls/tracks");
      const data = await res.json();
      if (data.ok && Array.isArray(data.tracks) && data.tracks.length > 0) {
        setTracks(data.tracks);
        if (data.tracks[0]?.visualizerPreset) {
          setCurrentPreset(mapPreset(data.tracks[0].visualizerPreset));
        }
      }
    } catch (err) {
      console.error("Failed to load tracks from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const activeTrack = tracks[activeTrackIndex] || null;

  const togglePlay = () => {
    if (!audioRef.current || !activeTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTrackChange = (index: number) => {
    setActiveTrackIndex(index);
    const selected = tracks[index];
    if (selected?.visualizerPreset) {
      setCurrentPreset(mapPreset(selected.visualizerPreset));
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="jw-domain-view jw-studio-view">
      {/* Background Atmosphere: Archival parchment and subtle gold glow */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell">
        {/* Navigation Bar (Light Mode) */}
        <nav className="jw-domain-nav" aria-label="johnwalls.studio">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
            <a
              href="#free-vst"
              className="jw-domain-pill"
              style={{
                color: "#b45309",
                borderColor: "rgba(224, 185, 116, 0.5)",
                background: "rgba(224, 185, 116, 0.15)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>↓</span> FREE VST3 / AU
            </a>
            <a
              href="https://github.com/epiphanizer/johnwalls.studio"
              target="_blank"
              rel="noreferrer"
              className="jw-domain-pill"
              style={{
                color: "#1e293b",
                borderColor: "rgba(30, 41, 59, 0.3)",
                background: "rgba(30, 41, 59, 0.06)",
                textDecoration: "none",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: "middle" }}>
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GITHUB ↗
            </a>
            <a
              href="/app"
              className="jw-domain-pill"
              style={{
                color: "#1e3a8a",
                borderColor: "rgba(30, 58, 138, 0.4)",
                background: "rgba(59, 130, 246, 0.12)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>⚡</span> LAUNCH STUDIO APP
            </a>
            <span
              className="jw-domain-pill"
              style={{
                color: "#0d9488",
                borderColor: "rgba(13, 148, 136, 0.3)",
                background: "rgba(13, 148, 136, 0.08)",
              }}
            >
              ● ABLETON DISPATCH LIVE
            </span>
          </div>
        </nav>

        {/* Hero Section (Light Mode Calligraphy Ink Title) */}
        <header className="jw-domain-hero jw-domain-hero--centered" style={{ marginBottom: "2rem" }}>
          <CalligraphicSignatureTitle
            domain="johnwalls.studio"
            eyebrow="THE CREATIVE EPICENTER · DIRECT ABLETON SOUND LAB & ARCHIVE"
            badgeText="DIRECT DAW STREAMING · ACTIVE"
            kicker="Live takes and generative sound architecture shipped direct from Ableton Live into the studio sound stream, accompanied by real-time reactive SuperCollider visualizers."
          />
        </header>

        {/* Hidden Audio Element */}
        {activeTrack && (
          <audio
            ref={audioRef}
            src={activeTrack.audioUrl}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              if (tracks.length > 1) {
                handleTrackChange((activeTrackIndex + 1) % tracks.length);
              }
            }}
            crossOrigin="anonymous"
          />
        )}

        {/* SuperCollider Visualizer (Sleek Dark Mode Console) */}
        <section style={{ marginBottom: "1.5rem" }}>
          <SuperColliderVisualizer
            audioElement={audioRef.current}
            isPlaying={isPlaying}
            bpm={activeTrack ? activeTrack.bpm : 120}
            trackTitle={activeTrack ? activeTrack.title : "Standby Scope"}
            initialPreset={currentPreset}
            onPresetChange={setCurrentPreset}
          />
        </section>

        {/* Audio Player Deck (Dark Mode Hardware Console) */}
        {activeTrack ? (
          <section
            style={{
              background: "#0c0f14",
              border: "1px solid rgba(224, 185, 116, 0.35)",
              borderRadius: "14px",
              padding: "1.5rem",
              marginBottom: "3rem",
              boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e0b974",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  NOW PLAYING · {activeTrack.dawSource || "Album Master"}
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 6px 0", color: "#f8fafc" }}>
                  {activeTrack.title}
                </h2>
                {activeTrack.description ? (
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.5 }}>
                    {activeTrack.description}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {activeTrack.bpm > 0 && (
                  <span style={{ padding: "4px 10px", background: "rgba(224, 185, 116, 0.15)", border: "1px solid rgba(224, 185, 116, 0.3)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#e0b974" }}>
                    BPM {activeTrack.bpm}
                  </span>
                )}
                {activeTrack.barLength > 0 && (
                  <span style={{ padding: "4px 10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#cbd5e1" }}>
                    {activeTrack.barLength} BARS
                  </span>
                )}
                {activeTrack.keySignature && (
                  <span style={{ padding: "4px 10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#cbd5e1" }}>
                    KEY {activeTrack.keySignature}
                  </span>
                )}
                <a
                  href={activeTrack.audioUrl}
                  download={activeTrack.fileName || "take.wav"}
                  className="cg-btn"
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    background: "rgba(224, 185, 116, 0.12)",
                    border: "1px solid rgba(224, 185, 116, 0.4)",
                    color: "#e0b974",
                    borderRadius: "6px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Download WAV ↗
                </a>
              </div>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.2rem" }}>
              <button
                type="button"
                onClick={togglePlay}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: isPlaying ? "#f8fafc" : "#e0b974",
                  color: "#0a0d12",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(224, 185, 116, 0.4)",
                  transition: "all 0.2s ease",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", minWidth: "42px", color: "#94a3b8" }}>
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min={0}
                max={duration || activeTrack.durationSeconds || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  accentColor: "#e0b974",
                  cursor: "pointer",
                }}
              />

              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", minWidth: "42px", color: "#94a3b8" }}>
                {formatTime(duration || activeTrack.durationSeconds || 0)}
              </span>
            </div>
          </section>
        ) : (
          <section
            style={{
              background: "#0c0f14",
              border: "1px dashed rgba(224, 185, 116, 0.35)",
              borderRadius: "14px",
              padding: "2rem 1.5rem",
              marginBottom: "3rem",
              textAlign: "center",
              boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#e0b974",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              STUDIO STREAM // STANDBY
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 8px 0", color: "#f8fafc" }}>
              Awaiting Live Dispatch from Ableton Live
            </h2>
            <p style={{ margin: "0 auto", maxWidth: "540px", fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Arm the <code>johnwalls.studio</code> plugin in Ableton Live, click <strong>[DISPATCH]</strong> in the top menu, record a take, and ship it direct to this stream.
            </p>
          </section>
        )}

        {/* Free VST3 & Audio Unit Plugin & Nightly Build Station */}
        <section
          id="free-vst"
          style={{
            background: "#0c0f14",
            border: "1px solid rgba(224, 185, 116, 0.35)",
            borderRadius: "14px",
            padding: "2rem 1.75rem",
            marginBottom: "3.5rem",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.28)",
            color: "#f8fafc",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e0b974",
                    fontWeight: 600,
                  }}
                >
                  FREE & OPEN SOURCE · VST3 / AUDIO UNIT PLUGIN
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "ui-monospace, monospace",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.35)",
                    color: "#4ade80",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: 600,
                  }}
                >
                  ● v1.0.0 READY
                </span>
              </div>
              <h2
                style={{
                  fontSize: "1.65rem",
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                  color: "#f8fafc",
                  letterSpacing: "-0.01em",
                }}
              >
                Download the johnwalls.studio Plugin
              </h2>
              <p
                style={{
                  margin: 0,
                  maxWidth: "680px",
                  fontSize: "0.92rem",
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                Generative sound synthesis, direct Ableton Live audio streaming, reactive SuperCollider
                visualizer telemetry, and live take dispatch straight into the archive. Universal macOS 64-bit
                binary for Ableton Live 12, Logic Pro 11, Bitwig, and Reaper.
              </p>
            </div>

            {/* Nightly CI Status Link & Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontFamily: "ui-monospace, monospace",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                AUTOMATED NIGHTLY CI
              </div>
              <a
                href="https://github.com/epiphanizer/johnwalls.studio/actions/workflows/nightly.yml"
                target="_blank"
                rel="noreferrer"
                title="View GitHub Actions Nightly CI Build History"
                style={{ display: "inline-flex", textDecoration: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github.com/epiphanizer/johnwalls.studio/workflows/Nightly%20VST%20Build%20&%20Release/badge.svg"
                  alt="Nightly VST Build Status"
                  style={{ height: "20px", borderRadius: "3px" }}
                />
              </a>
            </div>
          </div>

          {/* Spec Badges Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1.75rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
              }}
            >
              <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#e0b974", marginBottom: "3px" }}>
                ARCHITECTURE
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>
                Apple Silicon (M1–M4) + Intel
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
              }}
            >
              <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#e0b974", marginBottom: "3px" }}>
                INCLUDED FORMATS
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>
                VST3 (12.7 MB) + AU (12.4 MB)
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
              }}
            >
              <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#e0b974", marginBottom: "3px" }}>
                DAW COMPATIBILITY
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>
                Ableton Live 12, Logic, Bitwig, Reaper
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
              }}
            >
              <div style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#e0b974", marginBottom: "3px" }}>
                LICENSE & SOURCE
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>
                100% Free · GitHub Open-Source
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.75rem",
            }}
          >
            <a
              href="/downloads/johnwalls-studio-macos.zip"
              download="johnwalls-studio-macos.zip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 1.6rem",
                background: "linear-gradient(135deg, #e0b974 0%, #b88b32 100%)",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "9px",
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(224, 185, 116, 0.35)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download VST3 & AU Bundle (.zip · 9.0 MB)</span>
            </a>

            <a
              href="https://github.com/epiphanizer/johnwalls.studio"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.85rem 1.4rem",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#f8fafc",
                fontWeight: 600,
                fontSize: "0.92rem",
                borderRadius: "9px",
                textDecoration: "none",
                transition: "background 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>GitHub Repository & Nightly Releases ↗</span>
            </a>

            <a
              href="https://github.com/epiphanizer/johnwalls.studio/releases/tag/nightly"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.85rem 1.1rem",
                background: "transparent",
                border: "1px dashed rgba(224, 185, 116, 0.4)",
                color: "#e0b974",
                fontWeight: 600,
                fontSize: "0.88rem",
                borderRadius: "9px",
                textDecoration: "none",
              }}
            >
              <span>⚡</span> Nightly CI Pre-Releases
            </a>
          </div>

          {/* 1-Click Terminal Installer Console */}
          <div
            style={{
              background: "#05070a",
              border: "1px solid rgba(224, 185, 116, 0.22)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "6px" }}>
                  terminal — 1-click install (macOS)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cmd = "unzip -q ~/Downloads/johnwalls-studio-macos.zip -d ~/Downloads/johnwalls-studio && cd ~/Downloads/johnwalls-studio && chmod +x install.sh && ./install.sh";
                  navigator.clipboard.writeText(cmd);
                  setCopiedInstallCmd(true);
                  setTimeout(() => setCopiedInstallCmd(false), 2200);
                }}
                style={{
                  background: copiedInstallCmd ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.08)",
                  border: copiedInstallCmd ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: copiedInstallCmd ? "#4ade80" : "#cbd5e1",
                  borderRadius: "5px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copiedInstallCmd ? (
                  <>✓ COPIED</>
                ) : (
                  <>📋 COPY COMMAND</>
                )}
              </button>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#e2e8f0",
                lineHeight: 1.6,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              <span style={{ color: "#64748b" }}># Unzip and run the automated installer:</span>
              <br />
              <span style={{ color: "#e0b974" }}>unzip -q</span> ~/Downloads/johnwalls-studio-macos.zip <span style={{ color: "#e0b974" }}>-d</span> ~/Downloads/johnwalls-studio <span style={{ color: "#38bdf8" }}>&&</span> <span style={{ color: "#e0b974" }}>cd</span> ~/Downloads/johnwalls-studio <span style={{ color: "#38bdf8" }}>&&</span> <span style={{ color: "#e0b974" }}>chmod +x</span> install.sh <span style={{ color: "#38bdf8" }}>&&</span> ./install.sh
            </div>

            <div
              style={{
                marginTop: "0.85rem",
                paddingTop: "0.65rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                fontSize: "11px",
                color: "#94a3b8",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "0.5rem",
              }}
            >
              <div>✓ Installs to <code>~/Library/Audio/Plug-Ins/VST3/</code> & <code>.../Components/</code></div>
              <div>✓ Removes macOS Gatekeeper quarantine flags automatically</div>
              <div>✓ Open Ableton Live / Logic Pro / Bitwig / Reaper and rescan plugins</div>
            </div>
          </div>
        </section>

        {/* Sound Archive: Published Album & Ableton Takes List (Light Mode on Parchment) */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
              STUDIO SOUND ARCHIVE ({tracks.length})
            </h3>
            <button
              type="button"
              onClick={loadTracks}
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                cursor: "pointer",
                color: "#475569",
              }}
            >
              ↻ REFRESH STREAM
            </button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
              Loading studio sound archive...
            </div>
          ) : tracks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255, 255, 255, 0.6)", borderRadius: "12px", color: "#64748b" }}>
              No tracks published yet. Record a take in Ableton Live and hit <strong>"Ship to johnwalls.studio"</strong> in the plugin!
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {tracks.map((track, idx) => {
                const isSelected = idx === activeTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrackChange(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.25rem",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(224, 185, 116, 0.18)" : "rgba(255, 255, 255, 0.75)",
                      border: isSelected ? "1px solid #e0b974" : "1px solid rgba(0, 0, 0, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 4px 12px rgba(224, 185, 116, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isSelected && isPlaying ? "#0f172a" : isSelected ? "rgba(224, 185, 116, 0.3)" : "rgba(0, 0, 0, 0.06)",
                          color: isSelected && isPlaying ? "#e0b974" : isSelected ? "#0f172a" : "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {isSelected && isPlaying ? "❚❚" : idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>
                          {track.title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", gap: "12px", marginTop: "2px" }}>
                          <span>{track.artist}</span>
                          <span>•</span>
                          <span>{track.dawSource || "Ableton Live"}</span>
                          {track.alsProject && (
                            <>
                              <span>•</span>
                              <span>Project: {track.alsProject}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "#b45309", background: "rgba(224, 185, 116, 0.22)", padding: "2px 8px", borderRadius: "4px" }}>
                        {track.bpm} BPM
                      </span>
                      <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#64748b" }}>
                        {formatTime(track.durationSeconds || 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Minimal Footer (Light Mode) */}
        <footer className="jw-domain-footer jw-domain-footer--minimal">
          <p>
            © {new Date().getFullYear()} John Walls ·{" "}
            <a
              href="https://github.com/epiphanizer/johnwalls.studio"
              target="_blank"
              rel="noreferrer"
              className="jw-footer-link"
            >
              GitHub Source & Nightly CI ↗
            </a>
            {" · "}
            <a
              href="#free-vst"
              className="jw-footer-link"
            >
              Free VST3/AU Plugin
            </a>
            {" · "}
            <a
              href="https://creativesguide.us"
              target="_blank"
              rel="noreferrer"
              className="jw-footer-link"
            >
              creativesguide.us ↗
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default JohnWallsStudioView;
