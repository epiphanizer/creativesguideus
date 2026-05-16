"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import homeImage from "@/app/walls-devine/assets/instagram/4.home.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import poetryImage from "@/app/walls-devine/assets/instagram/7.poetry.png";
import resolveImage from "@/app/walls-devine/assets/instagram/6.resolve.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { SongPostCard } from "@/components/walls-devine/content";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

type WallsDevinePlayerProps = {
  tracks: SongPostCard[];
};

type VisualizerPalette = {
  primary: string;
  secondary: string;
  glow: string;
  ink: string;
};

type VisualizerByteArray = Uint8Array<ArrayBuffer>;

type PlayerDockPosition = {
  x: number;
  y: number;
};

type PersistedPlayerState = {
  activeIndex?: number;
  isOpen?: boolean;
  isCollapsed?: boolean;
  dockPosition?: PlayerDockPosition | null;
};

type AudioContextWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const trackPosterImages: Record<number, StaticImageData> = {
  1: jointQueenImage,
  2: stashDaddyImage,
  3: spaceCruiserImage,
  4: homeImage,
  5: decayImage,
  6: resolveImage,
  7: poetryImage,
  8: gratitudeImage
};

const trackVisualizerPalettes: Record<number, VisualizerPalette> = {
  1: { primary: "#d96a1f", secondary: "#b31612", glow: "#ecbbba", ink: "#1a130d" },
  2: { primary: "#7e0705", secondary: "#29543b", glow: "#f4e7ce", ink: "#1a130d" },
  3: { primary: "#29543b", secondary: "#d96a1f", glow: "#f4e7ce", ink: "#1a130d" },
  4: { primary: "#ca3f3b", secondary: "#29543b", glow: "#fafaf9", ink: "#1a130d" },
  5: { primary: "#7e0705", secondary: "#ca3f3b", glow: "#ecbbba", ink: "#140d0d" },
  6: { primary: "#d96a1f", secondary: "#7e0705", glow: "#f7e0e0", ink: "#140d0d" },
  7: { primary: "#29543b", secondary: "#ca3f3b", glow: "#fafaf9", ink: "#1a130d" },
  8: { primary: "#d66e6c", secondary: "#d96a1f", glow: "#f4e7ce", ink: "#1a130d" }
};

const playerStorageKey = "walls-devine-player-state-v1";

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const normalized = sanitized.length === 3 ? sanitized.split("").map((part) => `${part}${part}`).join("") : sanitized;
  const numeric = Number.parseInt(normalized, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getTrackVisualizerSeed(track: SongPostCard) {
  return track.title.split("").reduce((sum, character) => sum + character.charCodeAt(0), track.trackNumber * 17);
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as AudioContextWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function drawRadialVisualizer({
  canvas,
  analyser,
  frequencyData,
  waveformData,
  track,
  isPlaying,
  elapsed
}: {
  canvas: HTMLCanvasElement;
  analyser: AnalyserNode | null;
  frequencyData: VisualizerByteArray | null;
  waveformData: VisualizerByteArray | null;
  track: SongPostCard;
  isPlaying: boolean;
  elapsed: number;
}) {
  const rect = canvas.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.round(rect.width * pixelRatio);
  const height = Math.round(rect.height * pixelRatio);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const palette = trackVisualizerPalettes[track.trackNumber] ?? trackVisualizerPalettes[1];
  const seed = getTrackVisualizerSeed(track);
  const tau = Math.PI * 2;
  const drawWidth = rect.width;
  const drawHeight = rect.height;
  const centerX = drawWidth / 2;
  const centerY = drawHeight / 2;
  const outerRadius = Math.min(drawWidth, drawHeight) * 0.48;
  const ringRadius = outerRadius * 0.74;
  const pulseRadius = outerRadius * 0.58;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const backdrop = context.createRadialGradient(centerX, centerY, outerRadius * 0.1, centerX, centerY, outerRadius);
  backdrop.addColorStop(0, hexToRgba(palette.glow, 0.08));
  backdrop.addColorStop(0.55, hexToRgba(palette.primary, 0.12));
  backdrop.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = backdrop;
  context.beginPath();
  context.arc(centerX, centerY, outerRadius, 0, tau);
  context.fill();

  for (const multiplier of [0.56, 0.72, 0.9]) {
    context.beginPath();
    context.lineWidth = multiplier === 0.72 ? 1.25 : 1;
    context.strokeStyle = hexToRgba(palette.ink, multiplier === 0.72 ? 0.12 : 0.08);
    context.arc(centerX, centerY, outerRadius * multiplier, 0, tau);
    context.stroke();
  }

  const bars = 72;
  const dynamicValues: number[] = [];
  let energy = 0;

  if (isPlaying && analyser && frequencyData && waveformData) {
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(waveformData);

    const step = Math.max(1, Math.floor(frequencyData.length / bars));

    for (let index = 0; index < bars; index += 1) {
      const value = frequencyData[index * step] / 255;
      dynamicValues.push(value);
      energy += value;
    }

    energy /= bars;
  } else {
    for (let index = 0; index < bars; index += 1) {
      const wave = Math.sin(seed * 0.07 + elapsed * 0.0012 + index * 0.34) * 0.28;
      const drift = Math.cos(seed * 0.05 + elapsed * 0.0007 + index * 0.18) * 0.18;
      dynamicValues.push(0.26 + Math.abs(wave + drift));
    }

    energy = 0.32;
  }

  context.lineCap = "round";

  dynamicValues.forEach((value, index) => {
    const angle = (index / bars) * tau + elapsed * 0.00016 + seed * 0.002;
    const startRadius = outerRadius * 0.73 + Math.sin(seed * 0.03 + index * 0.3) * 4;
    const endRadius = startRadius + 10 + value * outerRadius * 0.16;
    const startX = centerX + Math.cos(angle) * startRadius;
    const startY = centerY + Math.sin(angle) * startRadius;
    const endX = centerX + Math.cos(angle) * endRadius;
    const endY = centerY + Math.sin(angle) * endRadius;

    context.beginPath();
    context.lineWidth = 1.25 + value * 2.5;
    context.strokeStyle = index % 3 === 0 ? hexToRgba(palette.primary, 0.82) : hexToRgba(palette.secondary, 0.74);
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  });

  context.beginPath();
  const waveformPoints = 96;

  for (let index = 0; index <= waveformPoints; index += 1) {
    const angle = (index / waveformPoints) * tau - Math.PI / 2;
    const waveformSample = isPlaying && waveformData
      ? (waveformData[Math.min(waveformData.length - 1, Math.floor((index / waveformPoints) * waveformData.length))] - 128) / 128
      : Math.sin(seed * 0.06 + elapsed * 0.0008 + index * 0.26) * 0.32;
    const radius = ringRadius + waveformSample * 12;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = hexToRgba(palette.glow, 0.9);
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, pulseRadius + energy * 10, 0, tau);
  context.lineWidth = 2.5;
  context.strokeStyle = hexToRgba(palette.primary, 0.26 + energy * 0.22);
  context.stroke();

  for (let index = 0; index < 4; index += 1) {
    const angle = elapsed * 0.0004 * (index % 2 === 0 ? 1 : -1) + seed * 0.02 + index * (tau / 4);
    const radius = outerRadius * (0.44 + index * 0.09);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    context.beginPath();
    context.fillStyle = hexToRgba(index % 2 === 0 ? palette.primary : palette.secondary, 0.74);
    context.arc(x, y, 2.4 + energy * 2.6, 0, tau);
    context.fill();
  }
}

function formatTrackNumber(trackNumber: number) {
  return String(trackNumber).padStart(2, "0");
}

function getTrackAudioSrc(fileName: string) {
  return `/walls-devine/releases/volume1/${encodeURIComponent(fileName)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function WallsDevinePlayer({ tracks }: WallsDevinePlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dockPosition, setDockPosition] = useState<PlayerDockPosition | null>(null);
  const [isDraggingDock, setIsDraggingDock] = useState(false);
  const deepLinkHandledRef = useRef(false);
  const playerStateRestoredRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const dockPointerOffsetRef = useRef<PlayerDockPosition | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frequencyDataRef = useRef<VisualizerByteArray | null>(null);
  const waveformDataRef = useRef<VisualizerByteArray | null>(null);
  const titleId = useId();
  const activeTrack = tracks[activeIndex] ?? tracks[0];
  const activeSrc = getTrackAudioSrc(activeTrack.audioFileName);
  const activePosterImage = trackPosterImages[activeTrack.trackNumber] ?? volOneImage;
  const activePosterAlt = `${activeTrack.title} cover artwork`;
  const activeTrackMeta = `Track ${formatTrackNumber(activeTrack.trackNumber)} · ${activeTrack.phase} · ${activeTrack.duration}`;

  function normalizePlayerTarget(value: string | null | undefined) {
    return (value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function findTrackIndexFromPlayerTarget(value: string) {
    return tracks.findIndex((track) =>
      [track.journalSlug, track.bongTourCueId, track.title, String(track.trackNumber)]
        .map((candidate) => normalizePlayerTarget(candidate))
        .includes(value)
    );
  }

  useEffect(() => {
    if (typeof window === "undefined" || playerStateRestoredRef.current) {
      return;
    }

    playerStateRestoredRef.current = true;

    if (new URLSearchParams(window.location.search).get("player")) {
      return;
    }

    const rawState = window.localStorage.getItem(playerStorageKey);

    if (!rawState) {
      return;
    }

    try {
      const storedState = JSON.parse(rawState) as PersistedPlayerState;

      if (Number.isInteger(storedState.activeIndex)) {
        setActiveIndex(clamp(storedState.activeIndex ?? 0, 0, Math.max(0, tracks.length - 1)));
      }

      if (storedState.isOpen) {
        setIsOpen(true);
        setIsCollapsed(false);
      } else if (storedState.isCollapsed) {
        setIsCollapsed(true);
      }

      if (
        storedState.dockPosition &&
        Number.isFinite(storedState.dockPosition.x) &&
        Number.isFinite(storedState.dockPosition.y)
      ) {
        setDockPosition(storedState.dockPosition);
      }
    } catch {
      window.localStorage.removeItem(playerStorageKey);
    }
  }, [tracks.length]);

  useEffect(() => {
    if (typeof window === "undefined" || !playerStateRestoredRef.current) {
      return;
    }

    window.localStorage.setItem(
      playerStorageKey,
      JSON.stringify({
        activeIndex,
        isOpen,
        isCollapsed,
        dockPosition
      } satisfies PersistedPlayerState)
    );
  }, [activeIndex, dockPosition, isCollapsed, isOpen]);

  useEffect(() => {
    if (!isDraggingDock) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dockElement = dockRef.current;
      const pointerOffset = dockPointerOffsetRef.current;

      if (!dockElement || !pointerOffset) {
        return;
      }

      const maxX = Math.max(12, window.innerWidth - dockElement.offsetWidth - 12);
      const maxY = Math.max(12, window.innerHeight - dockElement.offsetHeight - 12);

      setDockPosition({
        x: clamp(event.clientX - pointerOffset.x, 12, maxX),
        y: clamp(event.clientY - pointerOffset.y, 12, maxY)
      });
    };

    const handlePointerUp = () => {
      dockPointerOffsetRef.current = null;
      setIsDraggingDock(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingDock]);

  async function ensureAudioVisualizer() {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const AudioContextConstructor = getAudioContextConstructor();

    if (!AudioContextConstructor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    if (!sourceNodeRef.current || !analyserRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;

      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      sourceNodeRef.current = source;
      analyserRef.current = analyser;
      frequencyDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)) as VisualizerByteArray;
      waveformDataRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize)) as VisualizerByteArray;
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }

  function teardownAudioVisualizer() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    frequencyDataRef.current = null;
    waveformDataRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }

    audioContextRef.current = null;
  }

  useEffect(() => {
    if (deepLinkHandledRef.current || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedPlayerTarget = normalizePlayerTarget(params.get("player"));

    if (!requestedPlayerTarget) {
      return;
    }

    const nextIndex = findTrackIndexFromPlayerTarget(requestedPlayerTarget);

    if (nextIndex === -1) {
      return;
    }

    deepLinkHandledRef.current = true;
    setActiveIndex(nextIndex);
    setIsCollapsed(false);
    setIsOpen(true);

    const hash = window.location.hash || "#walls-devine-listening-room";
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${hash}`);
  }, [tracks]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      teardownAudioVisualizer();
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        collapsePlayer();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    audioRef.current?.load();
  }, [activeSrc, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const handlePlay = async () => {
      setIsPlaying(true);
      await ensureAudioVisualizer();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handlePause);

    if (!audioElement.paused) {
      void handlePlay();
    } else {
      setIsPlaying(false);
    }

    return () => {
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handlePause);
    };
  }, [activeSrc, isOpen]);

  useEffect(() => {
    if (!isOpen || !visualizerCanvasRef.current) {
      return;
    }

    const drawFrame = (elapsed: number) => {
      if (!visualizerCanvasRef.current) {
        return;
      }

      drawRadialVisualizer({
        canvas: visualizerCanvasRef.current,
        analyser: analyserRef.current,
        frequencyData: frequencyDataRef.current,
        waveformData: waveformDataRef.current,
        track: activeTrack,
        isPlaying,
        elapsed
      });
    };

    if (prefersReducedMotion) {
      drawFrame(getTrackVisualizerSeed(activeTrack) * 18);
      return;
    }

    const render = (elapsed: number) => {
      drawFrame(elapsed);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [activeSrc, activeTrack, isOpen, isPlaying, prefersReducedMotion]);

  useEffect(() => () => {
    teardownAudioVisualizer();
  }, []);

  function openPlayer(index: number) {
    setActiveIndex(index);
    setIsCollapsed(false);
    setIsOpen(true);
  }

  function reopenPlayer() {
    setIsCollapsed(false);
    setIsOpen(true);
  }

  function collapsePlayer() {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsCollapsed(true);
    setIsOpen(false);
  }

  function dismissDock() {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsCollapsed(false);
    setIsOpen(false);
  }

  function showPreviousTrack() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? tracks.length - 1 : currentIndex - 1));
  }

  function showNextTrack() {
    setActiveIndex((currentIndex) => (currentIndex === tracks.length - 1 ? 0 : currentIndex + 1));
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      collapsePlayer();
    }
  }

  function handleDockDragStart(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    const dockElement = dockRef.current;

    if (!dockElement) {
      return;
    }

    const rect = dockElement.getBoundingClientRect();
    dockPointerOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    setDockPosition({ x: rect.left, y: rect.top });
    setIsDraggingDock(true);
    event.preventDefault();
  }

  return (
    <>
      <section className="wd-player" aria-labelledby="wd-player-title">
        <div className="wd-player__card">
          <figure className="wd-player__cover">
            <div className="wd-player__cover-frame">
              <Image src={activePosterImage} alt={activePosterAlt} sizes="(max-width: 720px) 42vw, 220px" />
            </div>
          </figure>

          <div className="wd-player__summary">
            <span className="wd-player__eyebrow">Listening room</span>
            <h3 id="wd-player-title">Volume 1 modular player</h3>
            <p>
              Open the album object, move song to song, and keep each track&apos;s journal access, making notes, and Bong Tour bridge inside the player
              instead of repeating them in page cards.
            </p>

            <div className="wd-player__actions">
              <Button type="button" onClick={() => openPlayer(activeIndex)}>
                Open player
              </Button>
              <Button type="button" variant="secondary" onClick={() => openPlayer(0)}>
                Start at track 01
              </Button>
            </div>

            <p className="wd-player__current">
              Current module: Track {formatTrackNumber(activeTrack.trackNumber)} · {activeTrack.title} · {activeTrack.duration}
            </p>
          </div>
        </div>

        <div className="wd-player__track-strip" aria-label="Album track modules">
          {tracks.map((track, index) => (
            <button
              key={track.title}
              type="button"
              className={cx("wd-player__track-chip", index === activeIndex && "wd-player__track-chip--active")}
              onClick={() => openPlayer(index)}
            >
              <span>{formatTrackNumber(track.trackNumber)}</span>
              <strong>{track.title}</strong>
              <em>{track.duration}</em>
            </button>
          ))}
        </div>
      </section>

      {isCollapsed && !isOpen ? (
        <div
          ref={dockRef}
          className={cx("wd-player-dock", isDraggingDock && "wd-player-dock--dragging")}
          style={dockPosition ? { left: `${dockPosition.x}px`, top: `${dockPosition.y}px`, right: "auto", bottom: "auto" } : undefined}
        >
          <button type="button" className="wd-player-dock__handle" onPointerDown={handleDockDragStart} aria-label="Drag listening room mini player">
            Drag
          </button>

          <div className="wd-player-dock__summary">
            <span>Listening room</span>
            <strong>{activeTrack.title}</strong>
            <p>{activeTrackMeta}</p>
          </div>

          <div className="wd-player-dock__actions">
            <button type="button" className="wd-player-dock__button" onClick={reopenPlayer}>
              Reopen
            </button>
            <button type="button" className="wd-player-dock__button wd-player-dock__button--close" onClick={dismissDock} aria-label="Hide listening room mini player">
              X
            </button>
          </div>
        </div>
      ) : null}

      {isOpen ? (
        <div className="wd-player-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={handleBackdropClick}>
          <div className="wd-player-modal__panel">
            <header className="wd-player-modal__header">
              <div>
                <span className="wd-player-modal__eyebrow">Volume 1 listening room</span>
                <h3 id={titleId}>{activeTrack.title}</h3>
                <p className="wd-player-modal__meta">{activeTrackMeta}</p>
                <p>{activeTrack.caption}</p>
              </div>

              <button type="button" className="wd-player-modal__close" onClick={collapsePlayer} aria-label="Collapse player">
                X
              </button>
            </header>

            <div className="wd-player-modal__layout">
              <section className="wd-player-modal__current" aria-label="Current track player">
                <div className="wd-player-modal__art">
                  <div className="wd-player-modal__visualizer">
                    <canvas ref={visualizerCanvasRef} className="wd-player-modal__visualizer-canvas" aria-hidden="true" />
                    <span className="wd-player-modal__visualizer-badge wd-player-modal__visualizer-badge--top">
                      Track {formatTrackNumber(activeTrack.trackNumber)}
                    </span>
                    <span className="wd-player-modal__visualizer-badge wd-player-modal__visualizer-badge--bottom">{activeTrack.duration} · WAV</span>
                    <div className="wd-player-modal__visualizer-core">
                      <div className="wd-player-modal__art-frame">
                        <Image src={activePosterImage} alt={activePosterAlt} sizes="(max-width: 960px) 72vw, 360px" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wd-player-modal__transport">
                  <audio ref={audioRef} controls preload="metadata" src={activeSrc} className="wd-player-modal__audio">
                    Your browser does not support audio playback.
                  </audio>

                  <div className="wd-player-modal__transport-actions">
                    <Button type="button" variant="ghost" onClick={showPreviousTrack}>
                      Previous
                    </Button>
                    <Button type="button" variant="secondary" onClick={showNextTrack}>
                      Next
                    </Button>
                  </div>
                </div>

                <div className="wd-player-modal__notes">
                  <article>
                    <span>Track hook</span>
                    <p>{activeTrack.hook}</p>
                  </article>
                  <article>
                    <span>Instagram synthesis</span>
                    <p>{activeTrack.storySummary}</p>
                  </article>
                  <article>
                    <span>Visual thread</span>
                    <p>{activeTrack.visualThread}</p>
                  </article>
                  <article>
                    <span>Making note</span>
                    <p>{activeTrack.makingNote}</p>
                  </article>
                  <article>
                    <span>Technical note</span>
                    <p>{activeTrack.technicalNote}</p>
                  </article>
                  {activeTrack.bongTourContext ? (
                    <article>
                      <span>Bong Tour bridge</span>
                      <p>{activeTrack.bongTourContext}</p>
                    </article>
                  ) : null}
                </div>

                <div className="wd-player-modal__links">
                  <a href={`/walls-devine/journals/${activeTrack.journalSlug}.md`}>Read journal entry</a>
                  {activeTrack.bongTourCueId ? <a href={`/bong-tour#${activeTrack.bongTourCueId}`}>View cue on Bong Tour</a> : null}
                </div>
              </section>

              <section className="wd-player-modal__queue" aria-label="Album track list">
                <ol>
                  {tracks.map((track, index) => (
                    <li key={track.title}>
                      <button
                        type="button"
                        className={cx("wd-player-modal__queue-item", index === activeIndex && "wd-player-modal__queue-item--active")}
                        onClick={() => setActiveIndex(index)}
                        aria-current={index === activeIndex ? "true" : undefined}
                      >
                        <span>{formatTrackNumber(track.trackNumber)}</span>
                        <div>
                          <strong>{track.title}</strong>
                          <p>{track.hook}</p>
                        </div>
                        <em>{track.duration}</em>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default WallsDevinePlayer;