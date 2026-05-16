"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

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
import { createListeningRoomVisit } from "@/lib/firebase/listening-room-visits";
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

type VisualizerMotif = "crown" | "vault" | "orbit" | "porch" | "decay" | "resolve" | "poetry" | "gratitude";

type VisualizerTheme = VisualizerPalette & {
  motif: VisualizerMotif;
  field: string;
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

const playerQueryKeys = ["player", "song", "track", "slug"] as const;

type PlayerQueryKey = (typeof playerQueryKeys)[number];

type PlayerQueryRequest = {
  queryKey: PlayerQueryKey;
  value: string;
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

const trackVisualizerThemes: Record<number, VisualizerTheme> = {
  1: { primary: "#d96a1f", secondary: "#b31612", glow: "#ecbbba", ink: "#1a130d", field: "#f4e7ce", motif: "crown" },
  2: { primary: "#7e0705", secondary: "#29543b", glow: "#f4e7ce", ink: "#1a130d", field: "#ead7b1", motif: "vault" },
  3: { primary: "#29543b", secondary: "#d96a1f", glow: "#f4e7ce", ink: "#1a130d", field: "#dfe9e2", motif: "orbit" },
  4: { primary: "#ca3f3b", secondary: "#29543b", glow: "#fafaf9", ink: "#1a130d", field: "#f1ebe0", motif: "porch" },
  5: { primary: "#7e0705", secondary: "#ca3f3b", glow: "#ecbbba", ink: "#140d0d", field: "#ead4d4", motif: "decay" },
  6: { primary: "#d96a1f", secondary: "#7e0705", glow: "#f7e0e0", ink: "#140d0d", field: "#f4dfcf", motif: "resolve" },
  7: { primary: "#29543b", secondary: "#ca3f3b", glow: "#fafaf9", ink: "#1a130d", field: "#eef2ef", motif: "poetry" },
  8: { primary: "#d66e6c", secondary: "#d96a1f", glow: "#f4e7ce", ink: "#1a130d", field: "#f6ebd7", motif: "gratitude" }
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

function drawTrackMotif({
  context,
  theme,
  centerX,
  centerY,
  outerRadius,
  ringRadius,
  pulseRadius,
  energy,
  elapsed,
  seed
}: {
  context: CanvasRenderingContext2D;
  theme: VisualizerTheme;
  centerX: number;
  centerY: number;
  outerRadius: number;
  ringRadius: number;
  pulseRadius: number;
  energy: number;
  elapsed: number;
  seed: number;
}) {
  const tau = Math.PI * 2;

  if (theme.motif === "crown") {
    for (let index = 0; index < 5; index += 1) {
      const angle = -Math.PI / 2 + (index - 2) * 0.22;
      const leftAngle = angle - 0.08;
      const rightAngle = angle + 0.08;
      const innerRadius = ringRadius * 0.96;
      const tipRadius = outerRadius * 0.98 + energy * 10 + (index % 2 === 0 ? 6 : 0);

      context.beginPath();
      context.moveTo(centerX + Math.cos(leftAngle) * innerRadius, centerY + Math.sin(leftAngle) * innerRadius);
      context.lineTo(centerX + Math.cos(angle) * tipRadius, centerY + Math.sin(angle) * tipRadius);
      context.lineTo(centerX + Math.cos(rightAngle) * innerRadius, centerY + Math.sin(rightAngle) * innerRadius);
      context.closePath();
      context.fillStyle = hexToRgba(index % 2 === 0 ? theme.primary : theme.secondary, 0.22);
      context.fill();
      context.strokeStyle = hexToRgba(theme.ink, 0.18);
      context.lineWidth = 1;
      context.stroke();
    }

    return;
  }

  if (theme.motif === "vault") {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(elapsed * 0.00018);

    for (const scale of [0.92, 0.72]) {
      const size = pulseRadius * scale;
      context.beginPath();
      context.rect(-size, -size, size * 2, size * 2);
      context.strokeStyle = hexToRgba(scale === 0.92 ? theme.secondary : theme.primary, 0.22);
      context.lineWidth = scale === 0.92 ? 2 : 1.4;
      context.stroke();
      context.rotate(-elapsed * 0.00008 * scale);
    }

    context.restore();
    return;
  }

  if (theme.motif === "orbit") {
    for (let index = 0; index < 3; index += 1) {
      const ellipseWidth = ringRadius * (0.78 + index * 0.09);
      const ellipseHeight = ringRadius * (0.38 + index * 0.06);
      const rotation = seed * 0.002 + index * 0.54 + elapsed * 0.00008 * (index % 2 === 0 ? 1 : -1);

      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);
      context.beginPath();
      context.ellipse(0, 0, ellipseWidth, ellipseHeight, 0, 0, tau);
      context.strokeStyle = hexToRgba(index === 1 ? theme.secondary : theme.primary, 0.18);
      context.lineWidth = 1.25;
      context.stroke();

      const orbAngle = elapsed * 0.00042 * (index % 2 === 0 ? 1 : -1) + index * 1.4;
      const x = Math.cos(orbAngle) * ellipseWidth;
      const y = Math.sin(orbAngle) * ellipseHeight;
      context.beginPath();
      context.fillStyle = hexToRgba(index === 1 ? theme.secondary : theme.primary, 0.82);
      context.arc(x, y, 2.5 + energy * 2.2, 0, tau);
      context.fill();
      context.restore();
    }

    return;
  }

  if (theme.motif === "porch") {
    const houseWidth = ringRadius * 1.24;
    const houseHeight = ringRadius * 0.94;
    const roofY = centerY - houseHeight * 0.5;
    const baseY = centerY + houseHeight * 0.32;

    context.beginPath();
    context.moveTo(centerX - houseWidth * 0.42, roofY + houseHeight * 0.18);
    context.lineTo(centerX, roofY - houseHeight * 0.18);
    context.lineTo(centerX + houseWidth * 0.42, roofY + houseHeight * 0.18);
    context.lineTo(centerX + houseWidth * 0.42, baseY);
    context.lineTo(centerX - houseWidth * 0.42, baseY);
    context.closePath();
    context.strokeStyle = hexToRgba(theme.secondary, 0.22);
    context.lineWidth = 1.5;
    context.stroke();

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const x = centerX - houseWidth * 0.28 + column * houseWidth * 0.28;
        const y = centerY - houseHeight * 0.12 + row * houseHeight * 0.28;
        const glow = 0.22 + Math.max(0, Math.sin(elapsed * 0.002 + row * 0.7 + column * 0.4 + seed * 0.01)) * 0.18;

        context.fillStyle = hexToRgba(theme.glow, glow);
        context.fillRect(x, y, houseWidth * 0.12, houseHeight * 0.16);
      }
    }

    return;
  }

  if (theme.motif === "decay") {
    for (let index = 0; index < 6; index += 1) {
      let angle = index * (tau / 6) + seed * 0.01;
      let radius = pulseRadius * 0.76;

      context.beginPath();
      context.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);

      for (let segment = 0; segment < 4; segment += 1) {
        angle += Math.sin(seed * 0.02 + index * 0.5 + segment * 0.7) * 0.28;
        radius += outerRadius * 0.09;
        context.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      }

      context.strokeStyle = hexToRgba(index % 2 === 0 ? theme.primary : theme.secondary, 0.18);
      context.lineWidth = 1.2;
      context.stroke();
    }

    return;
  }

  if (theme.motif === "resolve") {
    for (let index = 0; index < 3; index += 1) {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.52 + index * 0.44 + Math.sin(elapsed * 0.0002 + index) * 0.04);
      context.beginPath();
      context.moveTo(-pulseRadius * 0.22, -outerRadius * 0.74);
      context.lineTo(pulseRadius * 0.04, -pulseRadius * 0.18);
      context.lineTo(-pulseRadius * 0.06, -pulseRadius * 0.18);
      context.lineTo(pulseRadius * 0.2, outerRadius * 0.58);
      context.strokeStyle = hexToRgba(index % 2 === 0 ? theme.primary : theme.secondary, 0.2 + energy * 0.1);
      context.lineWidth = 2.2;
      context.stroke();
      context.restore();
    }

    return;
  }

  if (theme.motif === "poetry") {
    for (let index = 0; index < 5; index += 1) {
      const y = centerY - ringRadius * 0.44 + index * ringRadius * 0.24;
      context.beginPath();
      context.moveTo(centerX - ringRadius * 0.92, y);
      context.lineTo(centerX + ringRadius * 0.92, y + Math.sin(seed * 0.02 + index) * 3);
      context.strokeStyle = hexToRgba(theme.secondary, 0.16);
      context.lineWidth = 1;
      context.stroke();
    }

    context.beginPath();
    context.moveTo(centerX - ringRadius * 0.6, centerY + ringRadius * 0.08);
    context.bezierCurveTo(
      centerX - ringRadius * 0.18,
      centerY - ringRadius * 0.26,
      centerX + ringRadius * 0.12,
      centerY + ringRadius * 0.3,
      centerX + ringRadius * 0.52,
      centerY - ringRadius * 0.04
    );
    context.strokeStyle = hexToRgba(theme.primary, 0.22);
    context.lineWidth = 2;
    context.stroke();
    return;
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = index * (tau / 8) + elapsed * 0.0001;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(angle);
    context.beginPath();
    context.ellipse(0, -outerRadius * 0.18, outerRadius * 0.12, outerRadius * 0.3, 0, 0, tau);
    context.fillStyle = hexToRgba(index % 2 === 0 ? theme.primary : theme.secondary, 0.14 + energy * 0.04);
    context.fill();
    context.restore();
  }
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

  const theme = trackVisualizerThemes[track.trackNumber] ?? trackVisualizerThemes[1];
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
  backdrop.addColorStop(0, hexToRgba(theme.glow, 0.08));
  backdrop.addColorStop(0.55, hexToRgba(theme.primary, 0.12));
  backdrop.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = backdrop;
  context.beginPath();
  context.arc(centerX, centerY, outerRadius, 0, tau);
  context.fill();

  for (const multiplier of [0.56, 0.72, 0.9]) {
    context.beginPath();
    context.lineWidth = multiplier === 0.72 ? 1.25 : 1;
    context.strokeStyle = hexToRgba(theme.ink, multiplier === 0.72 ? 0.12 : 0.08);
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

  drawTrackMotif({
    context,
    theme,
    centerX,
    centerY,
    outerRadius,
    ringRadius,
    pulseRadius,
    energy,
    elapsed,
    seed
  });

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
    context.strokeStyle = index % 3 === 0 ? hexToRgba(theme.primary, 0.82) : hexToRgba(theme.secondary, 0.74);
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
  context.strokeStyle = hexToRgba(theme.glow, 0.9);
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, pulseRadius + energy * 10, 0, tau);
  context.lineWidth = 2.5;
  context.strokeStyle = hexToRgba(theme.primary, 0.26 + energy * 0.22);
  context.stroke();

  for (let index = 0; index < 4; index += 1) {
    const angle = elapsed * 0.0004 * (index % 2 === 0 ? 1 : -1) + seed * 0.02 + index * (tau / 4);
    const radius = outerRadius * (0.44 + index * 0.09);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    context.beginPath();
    context.fillStyle = hexToRgba(index % 2 === 0 ? theme.primary : theme.secondary, 0.74);
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

function getPlayerViewportTopInset() {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawInset = window.getComputedStyle(document.documentElement).getPropertyValue("--cg-header-height");
  const parsedInset = Number.parseFloat(rawInset);
  return Number.isFinite(parsedInset) ? parsedInset : 0;
}

function isDockInteractiveTarget(target: EventTarget | null) {
  if (target instanceof HTMLElement) {
    return Boolean(target.closest("button, a, input, textarea, select, summary, [role='button']"));
  }

  if (target instanceof Node && target.parentElement) {
    return Boolean(target.parentElement.closest("button, a, input, textarea, select, summary, [role='button']"));
  }

  return false;
}

export function WallsDevinePlayer({ tracks }: WallsDevinePlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dockPosition, setDockPosition] = useState<PlayerDockPosition | null>(null);
  const [isDraggingDock, setIsDraggingDock] = useState(false);
  const deepLinkHandledRef = useRef(false);
  const trackedVisitRef = useRef<string | null>(null);
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
  const activeVisualizerTheme = trackVisualizerThemes[activeTrack.trackNumber] ?? trackVisualizerThemes[1];

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

  function getRequestedPlayerTarget(params: URLSearchParams): PlayerQueryRequest | null {
    for (const queryKey of playerQueryKeys) {
      const value = normalizePlayerTarget(params.get(queryKey));

      if (value) {
        return { queryKey, value };
      }
    }

    return null;
  }

  function syncPlayerUrl(nextTarget?: string | null) {
    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = new URL(window.location.href);

    for (const queryKey of playerQueryKeys) {
      nextUrl.searchParams.delete(queryKey);
    }

    if (nextTarget) {
      nextUrl.searchParams.set("player", nextTarget);
      nextUrl.hash = "walls-devine-listening-room";
    } else if (nextUrl.hash === "#walls-devine-listening-room") {
      nextUrl.hash = "";
    }

    window.history.replaceState(window.history.state, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  useEffect(() => {
    if (typeof window === "undefined" || playerStateRestoredRef.current) {
      return;
    }

    playerStateRestoredRef.current = true;

    if (getRequestedPlayerTarget(new URLSearchParams(window.location.search))) {
      return;
    }

    const rawState = window.localStorage.getItem(playerStorageKey);

    if (!rawState) {
      setIsCollapsed(true);
      return;
    }

    try {
      const storedState = JSON.parse(rawState) as PersistedPlayerState;

      if (Number.isInteger(storedState.activeIndex)) {
        setActiveIndex(clamp(storedState.activeIndex ?? 0, 0, Math.max(0, tracks.length - 1)));
      }

      setIsCollapsed(true);

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

      const minY = getPlayerViewportTopInset() + 12;
      const maxX = Math.max(12, window.innerWidth - dockElement.offsetWidth - 12);
      const maxY = Math.max(minY, window.innerHeight - dockElement.offsetHeight - 12);

      setDockPosition({
        x: clamp(event.clientX - pointerOffset.x, 12, maxX),
        y: clamp(event.clientY - pointerOffset.y, minY, maxY)
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
    const requestedPlayer = getRequestedPlayerTarget(params);

    if (!requestedPlayer) {
      return;
    }

    const nextIndex = findTrackIndexFromPlayerTarget(requestedPlayer.value);

    if (nextIndex === -1) {
      return;
    }

    deepLinkHandledRef.current = true;
    setActiveIndex(nextIndex);
    setIsCollapsed(false);
    setIsOpen(true);

    syncPlayerUrl(tracks[nextIndex]?.journalSlug ?? requestedPlayer.value);

    const visitKey = `${requestedPlayer.queryKey}:${tracks[nextIndex]?.journalSlug ?? requestedPlayer.value}`;

    if (trackedVisitRef.current !== visitKey) {
      trackedVisitRef.current = visitKey;

      void createListeningRoomVisit({
        songSlug: tracks[nextIndex]?.journalSlug ?? requestedPlayer.value,
        songTitle: tracks[nextIndex]?.title ?? requestedPlayer.value,
        queryKey: requestedPlayer.queryKey,
        pagePath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
        referrer: document.referrer,
        userAgent: window.navigator.userAgent
      }).catch(() => {
        trackedVisitRef.current = null;
      });
    }
  }, [tracks]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isOpen && getRequestedPlayerTarget(new URLSearchParams(window.location.search))) {
      return;
    }

    if (!isOpen) {
      syncPlayerUrl(null);
      return;
    }

    syncPlayerUrl(activeTrack.journalSlug);
  }, [activeTrack.journalSlug, isOpen]);

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
    audioRef.current?.load();
  }, [activeSrc]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const handlePlay = async () => {
      setIsPlaying(true);

      if (isOpen) {
        await ensureAudioVisualizer();
      }
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
  }, [isOpen]);

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

  async function playCurrentTrack() {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    try {
      await audioElement.play();
    } catch {
      setIsPlaying(false);
    }
  }

  function stopCurrentTrack() {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.pause();
    audioElement.currentTime = 0;
    setIsPlaying(false);
  }

  function collapsePlayer() {
    setIsCollapsed(true);
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

  function handleDockActionPointerDown(event: React.PointerEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function handleDockPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || isDockInteractiveTarget(event.target)) {
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
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  const floatingUiRoot = typeof document !== "undefined" ? document.body : null;

  return (
    <>
      {floatingUiRoot
        ? createPortal(
            <>
              {isCollapsed ? (
                <div
                  ref={dockRef}
                  className={cx("wd-player-dock", isDraggingDock && "wd-player-dock--dragging")}
                  style={dockPosition ? { left: `${dockPosition.x}px`, top: `${dockPosition.y}px`, right: "auto", bottom: "auto" } : undefined}
                  onPointerDown={handleDockPointerDown}
                >
                  <div className="wd-player-dock__grabber" aria-hidden="true">
                    <span className="wd-player-dock__grabber-pill" />
                    <span className="wd-player-dock__grabber-label">Drag player</span>
                  </div>

                  <div className="wd-player-dock__summary">
                    <span>Listening room</span>
                    <strong>{activeTrack.title}</strong>
                    <p>{activeTrackMeta}</p>
                  </div>

                  <audio
                    ref={audioRef}
                    preload="metadata"
                    src={activeSrc}
                    className="wd-player-dock__audio"
                    controls
                    controlsList="nodownload noplaybackrate"
                    onPointerDown={handleDockActionPointerDown}
                  >
                    Your browser does not support audio playback.
                  </audio>

                  <button type="button" className="wd-player-dock__tagline" onPointerDown={handleDockActionPointerDown} onClick={reopenPlayer}>
                    Enter the full Listening Room
                  </button>
                </div>
              ) : null}

              {isOpen ? (
                <div className="wd-player-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={handleBackdropClick}>
                  <div className="wd-player-modal__panel">
                    <div className="wd-player-modal__room-overlay" aria-hidden="true">
                      <span className="wd-player-modal__room-overlay-script">The Listening Room</span>
                      <span className="wd-player-modal__room-overlay-subtitle">Entering Volume 1</span>
                    </div>

                    <header className="wd-player-modal__header">
                      <div>
                        <span className="wd-player-modal__eyebrow">Walls/Devine Volume 1 listening room</span>
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
                          <div
                            className={cx("wd-player-modal__visualizer", `wd-player-modal__visualizer--${activeVisualizerTheme.motif}`)}
                            style={
                              {
                                "--wd-visualizer-primary": activeVisualizerTheme.primary,
                                "--wd-visualizer-secondary": activeVisualizerTheme.secondary,
                                "--wd-visualizer-glow": activeVisualizerTheme.glow,
                                "--wd-visualizer-field": activeVisualizerTheme.field
                              } as CSSProperties
                            }
                          >
                            <canvas ref={visualizerCanvasRef} className="wd-player-modal__visualizer-canvas" aria-hidden="true" />
                            <span className="wd-player-modal__visualizer-badge wd-player-modal__visualizer-badge--top">
                              Track {formatTrackNumber(activeTrack.trackNumber)}
                            </span>
                            <span className="wd-player-modal__visualizer-badge wd-player-modal__visualizer-badge--bottom">{activeTrack.duration} · WAV</span>
                            <div className="wd-player-modal__visualizer-core">
                              <div className="wd-player-modal__art-frame">
                                <Image src={activePosterImage} alt={activePosterAlt} sizes="(max-width: 960px) 78vw, 420px" />
                              </div>
                            </div>
                          </div>

                          <div className="wd-player-modal__audio-wrap">
                            <span className="wd-player-modal__audio-label">WAV player</span>
                            <audio
                              ref={audioRef}
                              preload="metadata"
                              src={activeSrc}
                              className="wd-player-modal__audio"
                              controls
                              controlsList="nodownload noplaybackrate"
                            >
                              Your browser does not support audio playback.
                            </audio>
                          </div>
                        </div>

                        <div className="wd-player-modal__transport">
                          <span className="wd-player-modal__transport-label">Room controls</span>
                          <div className="wd-player-modal__transport-actions">
                            <Button type="button" onClick={() => void playCurrentTrack()}>
                              Play track
                            </Button>
                            <Button type="button" variant="ghost" onClick={stopCurrentTrack}>
                              Restart track
                            </Button>
                            <Button type="button" variant="ghost" onClick={showPreviousTrack}>
                              Previous song
                            </Button>
                            <Button type="button" variant="secondary" onClick={showNextTrack}>
                              Next song
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
            </>,
            floatingUiRoot
          )
        : null}
    </>
  );
}

export default WallsDevinePlayer;