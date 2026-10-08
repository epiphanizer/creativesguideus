"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

/**
 * Ambient background harmonic canvas that pulses gently with audio playback
 */
function AmbientHarmonicCanvas({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const baseRadius = Math.min(width, height) * 0.28;
      const energy = isPlaying ? 1.0 : 0.25;

      ctx.save();
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = isPlaying ? "rgba(224, 185, 116, 0.08)" : "rgba(224, 185, 116, 0.03)";

      for (let r = 0; r < 4; r++) {
        const rad = baseRadius * (0.6 + r * 0.28) + Math.sin(phase * 0.001 + r) * 12 * energy;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, rad), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Delicate Lissajous harmonic figure in center
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isPlaying ? "rgba(224, 185, 116, 0.12)" : "rgba(224, 185, 116, 0.04)";
      const lissajousPoints = 120;
      for (let i = 0; i <= lissajousPoints; i++) {
        const t = (i / lissajousPoints) * Math.PI * 2;
        const x = centerX + Math.sin(3 * t + phase * 0.0008) * baseRadius * 0.5 * energy;
        const y = centerY + Math.cos(2 * t + phase * 0.0006) * baseRadius * 0.35 * energy;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      phase += isPlaying ? 16 : 4;
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export function JohnWallsStudioView() {
  const [tracks, setTracks] = useState<PublishedTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.9);
  const [currentPreset, setCurrentPreset] = useState<VisualizerPreset>("lissajous");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStageModalOpen, setIsStageModalOpen] = useState<boolean>(false);
  const [isDawDrawerOpen, setIsDawDrawerOpen] = useState<boolean>(false);
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
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleTrackChange = (index: number, shouldPlay = true) => {
    if (index < 0 || index >= tracks.length) return;
    setActiveTrackIndex(index);
    const selected = tracks[index];
    if (selected?.visualizerPreset) {
      setCurrentPreset(mapPreset(selected.visualizerPreset));
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (shouldPlay || isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Keyboard Escape listener to close stage modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsStageModalOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="jw-domain-view jw-studio-view" style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background Atmosphere: Archival parchment and subtle gold glow */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
        <AmbientHarmonicCanvas isPlaying={isPlaying} />
      </div>

      <div className="jw-domain-shell" style={{ position: "relative", zIndex: 1, paddingBottom: "7rem" }}>
        {/* Navigation Bar (Minimal Editorial) */}
        <nav className="jw-domain-nav" aria-label="johnwalls.studio">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label" style={{ letterSpacing: "0.14em", fontWeight: 700 }}>
              JOHN WALLS
            </span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
            <button
              type="button"
              onClick={() => setIsStageModalOpen(true)}
              className="jw-domain-pill"
              style={{
                color: "#b45309",
                borderColor: "rgba(224, 185, 116, 0.6)",
                background: "rgba(224, 185, 116, 0.18)",
                cursor: "pointer",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ fontSize: "10px", color: isPlaying ? "#10b981" : "#b45309" }}>●</span> ENTER LISTENING ROOM
            </button>
            <a
              href="/app"
              className="jw-domain-pill"
              style={{
                color: "#1e3a8a",
                borderColor: "rgba(30, 58, 138, 0.4)",
                background: "rgba(59, 130, 246, 0.10)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>⚡</span> LAUNCH STUDIO APP
            </a>
            <button
              type="button"
              onClick={() => setIsDawDrawerOpen((v) => !v)}
              className="jw-domain-pill"
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                color: "#475569",
              }}
            >
              FREE VST3 / AU ↓
            </button>
            <a
              href="https://github.com/epiphanizer/johnwalls.studio"
              target="_blank"
              rel="noreferrer"
              className="jw-domain-pill"
              style={{
                color: "#475569",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              GITHUB ↗
            </a>
          </div>
        </nav>

        {/* Hero Section (Light Mode Calligraphy Ink Title) */}
        <header className="jw-domain-hero jw-domain-hero--centered" style={{ marginBottom: "2rem", paddingTop: "1.5rem" }}>
          <CalligraphicSignatureTitle
            domain="johnwalls.studio"
            eyebrow="THE CREATIVE EPICENTER · DIRECT ABLETON SOUND LAB & ARCHIVE"
            badgeText="DIRECT DAW STREAMING · ACTIVE"
            kicker="Direct-to-listener sound architecture, master tape archives, and real-time generative audio engines."
          />

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => {
                if (!isPlaying) togglePlay();
                setIsStageModalOpen(true);
              }}
              style={{
                padding: "0.75rem 1.6rem",
                borderRadius: "30px",
                background: "#0f172a",
                color: "#e0b974",
                border: "1px solid rgba(224, 185, 116, 0.4)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.18)",
                transition: "all 0.2s ease",
              }}
            >
              <span>▶</span> ENTER LISTENING ROOM STAGE
            </button>
            <button
              type="button"
              onClick={togglePlay}
              style={{
                padding: "0.75rem 1.4rem",
                borderRadius: "30px",
                background: "rgba(255, 255, 255, 0.8)",
                color: "#1e293b",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <span>{isPlaying ? "❚❚ PAUSE STREAM" : "▶ PLAY STREAM"}</span>
            </button>
            <span
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "30px",
                background: "rgba(13, 148, 136, 0.08)",
                color: "#0d9488",
                border: "1px solid rgba(13, 148, 136, 0.3)",
                fontSize: "0.88rem",
                fontFamily: "ui-monospace, monospace",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              ● ABLETON DISPATCH LIVE
            </span>
          </div>
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
                handleTrackChange((activeTrackIndex + 1) % tracks.length, true);
              }
            }}
            crossOrigin="anonymous"
          />
        )}

        {/* Minimalist Sound Stream Gallery */}
        <section style={{ maxWidth: "860px", margin: "0 auto 3rem auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem", padding: "0 0.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#0f172a", letterSpacing: "-0.01em" }}>
                STUDIO SOUND STREAM
              </h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                Unedited live takes, master tape stems, and generative sound architecture ({tracks.length} takes).
              </p>
            </div>
            <button
              type="button"
              onClick={loadTracks}
              style={{
                background: "rgba(255, 255, 255, 0.7)",
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
            <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
              Loading master stream archives...
            </div>
          ) : tracks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255, 255, 255, 0.6)", borderRadius: "12px", color: "#64748b" }}>
              No tracks published yet. Record a take in Ableton Live and hit <strong>"Ship to johnwalls.studio"</strong>!
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {tracks.map((track, idx) => {
                const isSelected = idx === activeTrackIndex;
                const isCurrentPlaying = isSelected && isPlaying;
                return (
                  <div
                    key={track.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.9rem 1.25rem",
                      borderRadius: "12px",
                      background: isSelected ? "rgba(224, 185, 116, 0.15)" : "rgba(255, 255, 255, 0.75)",
                      border: isSelected ? "1px solid rgba(224, 185, 116, 0.6)" : "1px solid rgba(0, 0, 0, 0.06)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.18s ease",
                      boxShadow: isSelected ? "0 4px 14px rgba(224, 185, 116, 0.18)" : "0 2px 6px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            togglePlay();
                          } else {
                            handleTrackChange(idx, true);
                          }
                        }}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: isCurrentPlaying ? "#0f172a" : isSelected ? "rgba(224, 185, 116, 0.4)" : "rgba(15, 23, 42, 0.06)",
                          color: isCurrentPlaying ? "#e0b974" : "#0f172a",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isCurrentPlaying ? "12px" : "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                        }}
                        aria-label={isCurrentPlaying ? "Pause" : "Play"}
                      >
                        {isCurrentPlaying ? "❚❚" : "▶"}
                      </button>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>
                            {String(track.trackNumber || idx + 1).padStart(2, "0")}. {track.title}
                          </span>
                          {track.keySignature && (
                            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(0, 0, 0, 0.05)", color: "#64748b", fontFamily: "ui-monospace, monospace" }}>
                              {track.keySignature}
                            </span>
                          )}
                          {track.bpm > 0 && (
                            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(224, 185, 116, 0.2)", color: "#b45309", fontFamily: "ui-monospace, monospace" }}>
                              {track.bpm} BPM
                            </span>
                          )}
                        </div>
                        <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {track.description || track.artist}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, marginLeft: "1rem" }}>
                      <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#64748b" }}>
                        {formatTime(track.durationSeconds || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleTrackChange(idx, true);
                          setIsStageModalOpen(true);
                        }}
                        style={{
                          padding: "4px 9px",
                          borderRadius: "6px",
                          background: "rgba(15, 23, 42, 0.06)",
                          border: "1px solid rgba(15, 23, 42, 0.12)",
                          color: "#1e293b",
                          fontSize: "11px",
                          fontFamily: "ui-monospace, monospace",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        title="Open interactive SuperCollider visualizer stage"
                      >
                        STAGE ↗
                      </button>
                      <a
                        href={track.audioUrl}
                        download={track.fileName || "take.wav"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          color: "#64748b",
                          fontSize: "11px",
                          textDecoration: "none",
                        }}
                        title="Download WAV master"
                      >
                        WAV ↓
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Collapsible Ableton Live DAW & VST Station */}
        <section style={{ maxWidth: "860px", margin: "0 auto 3rem auto" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setIsDawDrawerOpen((v) => !v)}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.08em", color: "#b45309", fontWeight: 600 }}>
                  ABLETON LIVE DAW & SOFTWARE CRAFT
                </span>
                <span style={{ fontSize: "10px", background: "rgba(34, 197, 94, 0.15)", color: "#16a34a", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                  ● VST3/AU v1.0.0
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "ui-monospace, monospace" }}>
                {isDawDrawerOpen ? "COLLAPSE ↑" : "VIEW VST3 / CLI CRAFT ↓"}
              </span>
            </button>

            {isDawDrawerOpen && (
              <div style={{ padding: "0 1.25rem 1.5rem 1.25rem", borderTop: "1px solid rgba(0, 0, 0, 0.06)", color: "#334155" }}>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#475569", margin: "1rem 0" }}>
                  The <code>johnwalls.studio</code> VST3/Audio Unit plugin features zero-latency analog amp emulation,
                  a transparent -0.3 dBFS soft limiter, reactive MIDI rhythm analysis, and direct take streaming into this archive.
                </p>

                {/* 1-Click Terminal Command */}
                <div style={{ background: "#080a0e", color: "#f8fafc", padding: "1rem", borderRadius: "8px", fontFamily: "ui-monospace, monospace", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#94a3b8" }}># 1-Click Terminal Installer (macOS Universal):</span>
                    <button
                      type="button"
                      onClick={() => {
                        const cmd = "unzip -q ~/Downloads/johnwalls-studio-macos.zip -d ~/Downloads/johnwalls-studio && cd ~/Downloads/johnwalls-studio && chmod +x install.sh && ./install.sh";
                        navigator.clipboard.writeText(cmd);
                        setCopiedInstallCmd(true);
                        setTimeout(() => setCopiedInstallCmd(false), 2000);
                      }}
                      style={{
                        background: copiedInstallCmd ? "rgba(34, 197, 94, 0.3)" : "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: copiedInstallCmd ? "#4ade80" : "#cbd5e1",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      {copiedInstallCmd ? "✓ COPIED" : "📋 COPY COMMAND"}
                    </button>
                  </div>
                  <code style={{ color: "#e0b974" }}>
                    unzip -q ~/Downloads/johnwalls-studio-macos.zip -d ~/Downloads/johnwalls-studio &amp;&amp; cd ~/Downloads/johnwalls-studio &amp;&amp; chmod +x install.sh &amp;&amp; ./install.sh
                  </code>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "1rem", fontSize: "0.82rem", color: "#64748b" }}>
                  <div>✓ Installs to <code>~/Library/Audio/Plug-Ins/VST3/</code></div>
                  <div>✓ Installs to <code>~/Library/Audio/Plug-Ins/Components/</code></div>
                  <div>✓ Ableton Live 12, Logic Pro 11, Reaper &amp; Bitwig</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="jw-domain-footer jw-domain-footer--minimal" style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
          <p>
            © {new Date().getFullYear()} John Walls · The Creative Epicenter ·{" "}
            <a href="https://github.com/epiphanizer/johnwalls.studio" target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>
              GitHub Source ↗
            </a>
            {" · "}
            <a href="https://creativesguide.us" target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>
              creativesguide.us ↗
            </a>
          </p>
        </footer>
      </div>

      {/* ── Persistent Docked Listening Room Bar ─────────────────────────────── */}
      {activeTrack && (
        <aside
          role="region"
          aria-label="Studio Sound Stream Player"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(12, 15, 20, 0.94)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(224, 185, 116, 0.35)",
            padding: "0.75rem 1.5rem",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            color: "#f8fafc",
            boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Left: Active Track Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: "220px", maxWidth: "320px" }}>
            <button
              type="button"
              onClick={togglePlay}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: isPlaying ? "#f8fafc" : "#e0b974",
                color: "#0a0d12",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(224, 185, 116, 0.4)",
                flexShrink: 0,
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isPlaying ? "#22c55e" : "#64748b" }} />
                <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.08em", color: "#e0b974" }}>
                  {activeTrack.dawSource || "Sound Lab"}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {activeTrack.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                {activeTrack.artist}
              </div>
            </div>
          </div>

          {/* Center: Transport Scrub & Time */}
          <div style={{ flex: 1, maxWidth: "600px", display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#94a3b8", minWidth: "36px" }}>
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
                height: "4px",
              }}
              aria-label="Seek track"
            />
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#94a3b8", minWidth: "36px" }}>
              {formatTime(duration || activeTrack.durationSeconds || 0)}
            </span>
          </div>

          {/* Right: Stage Launcher & Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={handleVolumeChange}
                style={{ width: "65px", accentColor: "#e0b974", cursor: "pointer", height: "3px" }}
                aria-label="Volume"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsStageModalOpen(true)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(224, 185, 116, 0.25), rgba(224, 185, 116, 0.1))",
                border: "1px solid rgba(224, 185, 116, 0.5)",
                color: "#e0b974",
                fontWeight: 600,
                fontSize: "0.82rem",
                fontFamily: "ui-monospace, monospace",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.15s ease",
              }}
            >
              <span>STAGE</span> ↗
            </button>
          </div>
        </aside>
      )}

      {/* ── Full-Screen Atmospheric Listening Room Stage Modal ──────────────── */}
      {isStageModalOpen && activeTrack && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="John Walls Listening Room Stage"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#080a0e",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top Stage Bar */}
          <div
            style={{
              padding: "1rem 1.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(8, 10, 14, 0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(224, 185, 116, 0.2)",
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e0b974", fontWeight: 700 }}>
                JOHN WALLS · LISTENING ROOM STAGE
              </span>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1", fontSize: "0.88rem", fontWeight: 600 }}>
                {activeTrack.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => setIsStageModalOpen(false)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#cbd5e1",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ✕ CLOSE TO DOCK [ESC]
              </button>
            </div>
          </div>

          {/* Central Visualizer Backdrop Stage */}
          <div style={{ position: "relative", flex: 1, width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <SuperColliderVisualizer
              audioElement={audioRef.current}
              isPlaying={isPlaying}
              bpm={activeTrack.bpm || 120}
              trackTitle={activeTrack.title}
              initialPreset={currentPreset}
              onPresetChange={setCurrentPreset}
              stageMode={true}
              height="100%"
            />

            {/* Stage Foreground Glass Info Panel */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1.5rem",
                right: "1.5rem",
                background: "rgba(8, 10, 14, 0.85)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(224, 185, 116, 0.25)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                color: "#f8fafc",
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#e0b974", fontWeight: 600 }}>
                      TAKE {String(activeTrack.trackNumber || activeTrackIndex + 1).padStart(2, "0")} · {activeTrack.dawSource}
                    </span>
                    {activeTrack.keySignature && (
                      <span style={{ fontSize: "11px", padding: "1px 6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", color: "#94a3b8", fontFamily: "ui-monospace, monospace" }}>
                        KEY {activeTrack.keySignature}
                      </span>
                    )}
                    {activeTrack.bpm > 0 && (
                      <span style={{ fontSize: "11px", padding: "1px 6px", background: "rgba(224, 185, 116, 0.15)", borderRadius: "4px", color: "#e0b974", fontFamily: "ui-monospace, monospace" }}>
                        {activeTrack.bpm} BPM
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 4px 0", color: "#f8fafc" }}>
                    {activeTrack.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", maxWidth: "600px", lineHeight: 1.5 }}>
                    {activeTrack.description}
                  </p>
                </div>

                {/* Track change & WAV download */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleTrackChange((activeTrackIndex - 1 + tracks.length) % tracks.length, true)}
                    style={{ padding: "6px 12px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#cbd5e1", borderRadius: "6px", cursor: "pointer" }}
                  >
                    ⏮ PREV
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    style={{ padding: "6px 16px", background: isPlaying ? "#f8fafc" : "#e0b974", border: "none", color: "#080a0e", fontWeight: 700, borderRadius: "6px", cursor: "pointer" }}
                  >
                    {isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTrackChange((activeTrackIndex + 1) % tracks.length, true)}
                    style={{ padding: "6px 12px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#cbd5e1", borderRadius: "6px", cursor: "pointer" }}
                  >
                    NEXT ⏭
                  </button>
                  <a
                    href={activeTrack.audioUrl}
                    download={activeTrack.fileName || "take.wav"}
                    style={{ padding: "6px 12px", background: "rgba(224, 185, 116, 0.15)", border: "1px solid rgba(224, 185, 116, 0.4)", color: "#e0b974", borderRadius: "6px", textDecoration: "none", fontSize: "12px", display: "inline-flex", alignItems: "center" }}
                  >
                    WAV ↓
                  </a>
                </div>
              </div>

              {/* Progress Slider */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginTop: "1rem" }}>
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#94a3b8", minWidth: "36px" }}>
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || activeTrack.durationSeconds || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{ flex: 1, accentColor: "#e0b974", cursor: "pointer" }}
                />
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#94a3b8", minWidth: "36px" }}>
                  {formatTime(duration || activeTrack.durationSeconds || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JohnWallsStudioView;
