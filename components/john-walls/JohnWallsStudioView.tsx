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
                  NOW AUDITIONING · {activeTrack.dawSource || "Ableton Live"}
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
