"use client";

import React, { useState, useEffect, useRef } from "react";
import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";
import { SuperColliderVisualizer, VisualizerPreset } from "./SuperColliderVisualizer";

export interface PublishedTrack {
  id: string;
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
  visualizerPreset: VisualizerPreset;
  tags: string[];
  publishedAt: string;
}

export function JohnWallsStudioView() {
  const [tracks, setTracks] = useState<PublishedTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentPreset, setCurrentPreset] = useState<VisualizerPreset>("supercollider-lissajous");
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
          setCurrentPreset(data.tracks[0].visualizerPreset);
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
      setCurrentPreset(selected.visualizerPreset);
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
      {/* Background Canvas: Archival Sumi Ink & Studio Gold Glow */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="johnwalls.studio">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
            <span className="jw-domain-pill" style={{ color: "#2dd4bf", borderColor: "rgba(45, 212, 191, 0.3)" }}>
              ● ABLETON DISPATCH LIVE
            </span>
          </div>
        </nav>

        {/* Hero Section */}
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
              // Auto advance
              if (tracks.length > 1) {
                handleTrackChange((activeTrackIndex + 1) % tracks.length);
              }
            }}
            crossOrigin="anonymous"
          />
        )}

        {/* Interactive SuperCollider Visualizer */}
        <section style={{ marginBottom: "2.5rem" }}>
          <SuperColliderVisualizer
            audioElement={audioRef.current}
            isPlaying={isPlaying}
            preset={currentPreset}
            bpm={activeTrack ? activeTrack.bpm : 120}
            trackTitle={activeTrack ? activeTrack.title : "Standby Oscilloscope"}
            onPresetChange={setCurrentPreset}
          />
        </section>

        {/* Audio Player & Track Deck */}
        {activeTrack ? (
          <section
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(224, 185, 116, 0.4)",
              borderRadius: "14px",
              padding: "1.5rem",
              marginBottom: "3rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
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
                    color: "#b45309",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  NOW AUDITIONING · {activeTrack.dawSource || "Ableton Live"}
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 6px 0", color: "#0f172a" }}>
                  {activeTrack.title}
                </h2>
                {activeTrack.description ? (
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>
                    {activeTrack.description}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {activeTrack.bpm > 0 && (
                  <span style={{ padding: "4px 10px", background: "rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#334155" }}>
                    BPM {activeTrack.bpm}
                  </span>
                )}
                {activeTrack.barLength > 0 && (
                  <span style={{ padding: "4px 10px", background: "rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#334155" }}>
                    {activeTrack.barLength} BARS
                  </span>
                )}
                {activeTrack.keySignature && (
                  <span style={{ padding: "4px 10px", background: "rgba(0,0,0,0.06)", borderRadius: "6px", fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#334155" }}>
                    KEY {activeTrack.keySignature}
                  </span>
                )}
                <a
                  href={activeTrack.audioUrl}
                  download={activeTrack.fileName || "take.wav"}
                  className="cg-btn cg-btn--outline"
                  style={{ padding: "4px 12px", fontSize: "12px" }}
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
                  background: isPlaying ? "#0f172a" : "#e0b974",
                  color: isPlaying ? "#f8fafc" : "#0f172a",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(224, 185, 116, 0.4)",
                  transition: "all 0.2s ease",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", minWidth: "42px", color: "#64748b" }}>
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

              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", minWidth: "42px", color: "#64748b" }}>
                {formatTime(duration || activeTrack.durationSeconds || 0)}
              </span>
            </div>
          </section>
        ) : (
          <section
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(12px)",
              border: "1px dashed rgba(224, 185, 116, 0.5)",
              borderRadius: "14px",
              padding: "2rem 1.5rem",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#92400e",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              STUDIO STREAM // STANDBY
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>
              Awaiting Live Dispatch from Ableton Live
            </h2>
            <p style={{ margin: "0 auto", maxWidth: "540px", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
              Arm the <code>johnwalls.studio</code> plugin in Ableton Live, click <strong>[DISPATCH]</strong> in the top menu, record a take, and ship it direct to this stream.
            </p>
          </section>
        )}

        {/* Sound Archive: Published Ableton Takes List */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
              STUDIO SOUND ARCHIVE ({tracks.length})
            </h3>
            <button
              type="button"
              onClick={loadTracks}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.15)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "ui-monospace, monospace",
                cursor: "pointer",
                color: "#64748b",
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
            <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.5)", borderRadius: "12px", color: "#64748b" }}>
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
                      background: isSelected ? "rgba(224, 185, 116, 0.15)" : "rgba(255, 255, 255, 0.6)",
                      border: isSelected ? "1px solid #e0b974" : "1px solid rgba(0, 0, 0, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isSelected && isPlaying ? "#0f172a" : "rgba(0,0,0,0.06)",
                          color: isSelected && isPlaying ? "#e0b974" : "#475569",
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
                        <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", gap: "12px" }}>
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
                      <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "#b45309", background: "rgba(224, 185, 116, 0.2)", padding: "2px 8px", borderRadius: "4px" }}>
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

        {/* Minimal Footer */}
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
