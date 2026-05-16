"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import { type CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import homeImage from "@/app/walls-devine/assets/instagram/4.home.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import poetryImage from "@/app/walls-devine/assets/instagram/7.poetry.png";
import resolveImage from "@/app/walls-devine/assets/instagram/6.resolve.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { SongPlatformLinks, SongPostCard } from "@/components/walls-devine/content";
import { createListeningRoomVisit } from "@/lib/firebase/listening-room-visits";
import {
  dispatchWallsDevinePlayerDismissedChange,
  type PlayerDockPosition,
  type PersistedWallsDevinePlayerState,
  wallsDevinePlayerOpenRequestEventName,
  wallsDevinePlayerRestoreRequestEventName,
  wallsDevinePlayerStorageKey
} from "@/lib/wallsDevinePlayerBridge";
import { cx } from "@/lib/cx";

type WallsDevinePlayerProps = {
  tracks: SongPostCard[];
  showDockWhenCollapsed?: boolean;
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
type StreamingPlatformKey = keyof SongPlatformLinks;

type StreamingPlatformDestination = {
  key: StreamingPlatformKey;
  label: string;
  shortLabel: string;
  href: string;
  isDirect: boolean;
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

function buildListeningRoomShareUrl(origin: string, track: SongPostCard) {
  if (!origin) {
    return "";
  }

  const nextUrl = new URL("/walls-devine", origin);
  nextUrl.searchParams.set("player", track.journalSlug);
  nextUrl.hash = "walls-devine-listening-room";
  return nextUrl.toString();
}

function buildListeningRoomShareText(track: SongPostCard) {
  return `Listen to "${track.title}" in the Walls/Devine Volume 1 Listening Room. ${track.hook}`;
}

function buildListeningRoomSocialShareLinks(title: string, text: string, url: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedSubject = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(`${text}\n\n${url}`);

  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    email: `mailto:?subject=${encodedSubject}&body=${encodedBody}`
  };
}

const streamingPlatformCatalog: Array<{
  key: StreamingPlatformKey;
  label: string;
  shortLabel: string;
  buildSearchUrl: (encodedQuery: string) => string;
}> = [
  {
    key: "spotify",
    label: "Spotify",
    shortLabel: "Spotify",
    buildSearchUrl: (encodedQuery) => `https://open.spotify.com/search/${encodedQuery}`
  },
  {
    key: "appleMusic",
    label: "Apple Music",
    shortLabel: "Apple",
    buildSearchUrl: (encodedQuery) => `https://music.apple.com/us/search?term=${encodedQuery}`
  },
  {
    key: "youtubeMusic",
    label: "YouTube Music",
    shortLabel: "YouTube",
    buildSearchUrl: (encodedQuery) => `https://music.youtube.com/search?q=${encodedQuery}`
  },
  {
    key: "tidal",
    label: "TIDAL",
    shortLabel: "TIDAL",
    buildSearchUrl: (encodedQuery) => `https://listen.tidal.com/search?q=${encodedQuery}`
  },
  {
    key: "amazonMusic",
    label: "Amazon Music",
    shortLabel: "Amazon",
    buildSearchUrl: (encodedQuery) => `https://music.amazon.com/search/${encodedQuery}`
  },
  {
    key: "soundcloud",
    label: "SoundCloud",
    shortLabel: "SoundCloud",
    buildSearchUrl: (encodedQuery) => `https://soundcloud.com/search/sounds?q=${encodedQuery}`
  },
  {
    key: "bandcamp",
    label: "Bandcamp",
    shortLabel: "Bandcamp",
    buildSearchUrl: (encodedQuery) => `https://bandcamp.com/search?q=${encodedQuery}&item_type=t`
  }
];

function buildListeningRoomStreamingLinks(track: SongPostCard) {
  const encodedQuery = encodeURIComponent(`${track.title} Walls Devine Volume 1`);

  return streamingPlatformCatalog.map((platform) => {
    const directHref = track.platformLinks?.[platform.key]?.trim();

    return {
      key: platform.key,
      label: platform.label,
      shortLabel: platform.shortLabel,
      href: directHref || platform.buildSearchUrl(encodedQuery),
      isDirect: Boolean(directHref)
    } satisfies StreamingPlatformDestination;
  });
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

export function WallsDevinePlayer({ tracks, showDockWhenCollapsed = true }: WallsDevinePlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareOrigin, setShareOrigin] = useState("");
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "shared" | "copied">("idle");
  const [dockPosition, setDockPosition] = useState<PlayerDockPosition | null>(null);
  const [isDraggingDock, setIsDraggingDock] = useState(false);
  const deepLinkHandledRef = useRef(false);
  const trackedVisitRef = useRef<string | null>(null);
  const playerStateRestoredRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockAudioSlotRef = useRef<HTMLDivElement | null>(null);
  const modalAudioSlotRef = useRef<HTMLDivElement | null>(null);
  const audioPortalHostRef = useRef<HTMLDivElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const dockPointerOffsetRef = useRef<PlayerDockPosition | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const visualizerAudioElementRef = useRef<HTMLAudioElement | null>(null);
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
  const activeShareTitle = `${activeTrack.title} · Walls/Devine Volume 1`;
  const activeShareText = buildListeningRoomShareText(activeTrack);
  const activeShareUrl = buildListeningRoomShareUrl(shareOrigin, activeTrack);
  const activeSocialShareLinks = activeShareUrl ? buildListeningRoomSocialShareLinks(activeShareTitle, activeShareText, activeShareUrl) : null;
  const activeStreamingLinks = buildListeningRoomStreamingLinks(activeTrack);
  const hasDirectStreamingLinks = activeStreamingLinks.some((platform) => platform.isDirect);
  const isDockVisible = isCollapsed && showDockWhenCollapsed && !isDismissed;

  if (typeof document !== "undefined" && !audioPortalHostRef.current) {
    const audioHost = document.createElement("div");
    audioHost.className = "wd-player-audio-host";
    audioPortalHostRef.current = audioHost;
  }

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
    if (typeof window === "undefined") {
      return;
    }

    setShareOrigin(window.location.origin);
    setSupportsNativeShare(typeof window.navigator.share === "function");
  }, []);

  useEffect(() => {
    setShareFeedback("idle");
  }, [activeTrack.journalSlug]);

  useEffect(() => {
    if (shareFeedback === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setShareFeedback("idle");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [shareFeedback]);

  useEffect(() => {
    if (typeof window === "undefined" || playerStateRestoredRef.current) {
      return;
    }

    playerStateRestoredRef.current = true;

    if (getRequestedPlayerTarget(new URLSearchParams(window.location.search))) {
      return;
    }

    const rawState = window.localStorage.getItem(wallsDevinePlayerStorageKey);

    if (!rawState) {
      setIsDismissed(false);
      setIsCollapsed(true);
      return;
    }

    try {
      const storedState = JSON.parse(rawState) as PersistedWallsDevinePlayerState;

      if (Number.isInteger(storedState.activeIndex)) {
        setActiveIndex(clamp(storedState.activeIndex ?? 0, 0, Math.max(0, tracks.length - 1)));
      }

      setIsDismissed(false);
      setIsCollapsed(true);

      // Always boot the listening-room dock at the default top-right anchor.
      // Persisted drag coordinates can place it off-screen between sessions.
      setDockPosition(null);
    } catch {
      window.localStorage.removeItem(wallsDevinePlayerStorageKey);
    }
  }, [tracks.length]);

  useEffect(() => {
    if (typeof window === "undefined" || !playerStateRestoredRef.current) {
      return;
    }

    window.localStorage.setItem(
      wallsDevinePlayerStorageKey,
      JSON.stringify({
        activeIndex,
        isOpen,
        isCollapsed,
        isDismissed: false
      } satisfies PersistedWallsDevinePlayerState)
    );
  }, [activeIndex, isCollapsed, isDismissed, isOpen]);

  useEffect(() => {
    dispatchWallsDevinePlayerDismissedChange(isDismissed);
  }, [isDismissed]);

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

  useLayoutEffect(() => {
    const audioHost = audioPortalHostRef.current;
    const targetSlot = isOpen ? modalAudioSlotRef.current : isDockVisible ? dockAudioSlotRef.current : null;

    if (!audioHost || !targetSlot) {
      return;
    }

    targetSlot.appendChild(audioHost);

    return () => {
      if (audioHost.parentElement === targetSlot) {
        targetSlot.removeChild(audioHost);
      }
    };
  }, [isDockVisible, isOpen]);

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

    if (visualizerAudioElementRef.current && visualizerAudioElementRef.current !== audioElement) {
      sourceNodeRef.current?.disconnect();
      sourceNodeRef.current = null;
      analyserRef.current?.disconnect();
      analyserRef.current = null;
      frequencyDataRef.current = null;
      waveformDataRef.current = null;
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
      visualizerAudioElementRef.current = audioElement;
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
    visualizerAudioElementRef.current = null;
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
    setIsDismissed(false);
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

  useEffect(() => {
    const handleRestoreRequest = () => {
      setIsDismissed(false);
      setIsCollapsed(true);
      setIsOpen(false);
      setDockPosition(null);
    };

    const handleOpenRequest = () => {
      setIsDismissed(false);
      setIsCollapsed(false);
      setIsOpen(true);
      setDockPosition(null);
    };

    window.addEventListener(wallsDevinePlayerRestoreRequestEventName, handleRestoreRequest);
    window.addEventListener(wallsDevinePlayerOpenRequestEventName, handleOpenRequest);

    return () => {
      window.removeEventListener(wallsDevinePlayerRestoreRequestEventName, handleRestoreRequest);
      window.removeEventListener(wallsDevinePlayerOpenRequestEventName, handleOpenRequest);
    };
  }, []);

  function openPlayer(index: number) {
    setActiveIndex(index);
    setIsDismissed(false);
    setIsCollapsed(false);
    setIsOpen(true);
  }

  function reopenPlayer() {
    setIsDismissed(false);
    setIsCollapsed(false);
    setIsOpen(true);
  }

  function dismissPlayer() {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsDismissed(true);
    setIsCollapsed(true);
    setIsOpen(false);
    setDockPosition(null);
    syncPlayerUrl(null);
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

  async function handleCopyTrackLink() {
    if (typeof window === "undefined" || !activeShareUrl) {
      return;
    }

    if (!window.navigator.clipboard?.writeText) {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(activeShareUrl);
      setShareFeedback("copied");
    } catch {
      setShareFeedback("idle");
    }
  }

  async function handleShareTrack() {
    if (typeof window === "undefined" || !activeShareUrl) {
      return;
    }

    const browserNavigator = window.navigator;

    if (typeof browserNavigator.share === "function") {
      try {
        await browserNavigator.share({
          title: activeShareTitle,
          text: activeShareText,
          url: activeShareUrl
        });
        setShareFeedback("shared");
      } catch {
        return;
      }

      return;
    }

    await handleCopyTrackLink();
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
              {audioPortalHostRef.current
                ? createPortal(
                    <audio ref={audioRef} preload="metadata" src={activeSrc} className="wd-player-audio" controls controlsList="nodownload noplaybackrate">
                      Your browser does not support audio playback.
                    </audio>,
                    audioPortalHostRef.current
                  )
                : null}

              {isDockVisible ? (
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

                  <div ref={dockAudioSlotRef} className="wd-player-dock__audio-slot" onPointerDown={handleDockActionPointerDown} />

                  <div className="wd-player-dock__share" onPointerDown={handleDockActionPointerDown}>
                    <div className="wd-player-dock__share-head">
                      <span>Currently playing</span>
                      <div className="wd-player-dock__share-actions">
                        <button
                          type="button"
                          className="wd-player-dock__icon-button"
                          onClick={handleShareTrack}
                          disabled={!activeShareUrl}
                          aria-label={supportsNativeShare ? (shareFeedback === "shared" ? "Shared" : "Share track") : shareFeedback === "copied" ? "Link copied" : "Copy room link"}
                          title={supportsNativeShare ? (shareFeedback === "shared" ? "Shared" : "Share track") : shareFeedback === "copied" ? "Link copied" : "Copy room link"}
                        >
                          {shareFeedback !== "idle" ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2.5 8 6.5 12 13.5 4" /></svg>
                          ) : supportsNativeShare ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 10V3M5 6l3-3 3 3" /><path d="M3 10v3a1 1 0 001 1h8a1 1 0 001-1v-3" /></svg>
                          ) : (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" /><path d="M9.5 6.5a3.5 3.5 0 00-5 0L2.5 8.5a3.5 3.5 0 005 5L9 12" /></svg>
                          )}
                        </button>
                        <button
                          type="button"
                          className="wd-player-dock__icon-button"
                          onClick={handleCopyTrackLink}
                          disabled={!activeShareUrl}
                          aria-label={shareFeedback === "copied" ? "Link copied" : "Copy direct link"}
                          title={shareFeedback === "copied" ? "Link copied" : "Copy direct link"}
                        >
                          {shareFeedback === "copied" ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2.5 8 6.5 12 13.5 4" /></svg>
                          ) : (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" /><path d="M9.5 6.5a3.5 3.5 0 00-5 0L2.5 8.5a3.5 3.5 0 005 5L9 12" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="wd-player-dock__share-platforms" aria-label={`Open ${activeTrack.title} on music platforms`}>
                      {activeStreamingLinks.map((platform) => (
                        <a key={platform.key} className="wd-player-dock__share-platform" href={platform.href} target="_blank" rel="noreferrer">
                          {platform.shortLabel}
                        </a>
                      ))}
                    </div>

                    <p className="wd-player-dock__share-note">
                      {hasDirectStreamingLinks ? "Direct song links are live where they have already been mapped." : "Platform chips currently open search results. They will switch to direct song pages as platform URLs are added."}
                    </p>
                  </div>

                  <div className="wd-player-dock__actions" onPointerDown={handleDockActionPointerDown}>
                    <button type="button" className="wd-player-dock__tagline" onClick={reopenPlayer}>
                      Enter the full Listening Room
                    </button>
                    <button type="button" className="wd-player-dock__button wd-player-dock__button--close" onClick={dismissPlayer}>
                      Hide player
                    </button>
                  </div>
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
                      <div className="wd-player-modal__header-main">
                        <div className="wd-player-modal__album-cover" aria-hidden="true">
                          <div className="wd-player-modal__album-cover-frame">
                            <Image src={volOneImage} alt="Walls/Devine Volume 1 album cover artwork" sizes="112px" />
                          </div>
                        </div>

                        <div className="wd-player-modal__header-copy">
                          <span className="wd-player-modal__eyebrow">Walls/Devine Volume 1 listening room</span>
                          <h3 id={titleId}>{activeTrack.title}</h3>
                          <p className="wd-player-modal__meta">{activeTrackMeta}</p>
                          <p>{activeTrack.caption}</p>
                        </div>
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
                            <div ref={modalAudioSlotRef} className="wd-player-modal__audio-slot" />
                          </div>
                        </div>

                        <section className="wd-player-modal__share" aria-label={`Share ${activeTrack.title}`}>
                          <div className="wd-player-modal__share-intro">
                            <span className="wd-player-modal__share-kicker">Share</span>
                            <h4>Send {activeTrack.title} out with the room already open.</h4>
                            <p>
                              Native share and direct room links keep the Listening Room open on this exact track. Music-platform destinations fall back to
                              search now and automatically switch to direct song pages once those URLs are wired in.
                            </p>
                          </div>

                          <div className="wd-player-modal__share-actions">
                            <Button
                              type="button"
                              variant="primary"
                              className="wd-player-modal__share-button wd-player-modal__share-button--primary"
                              onClick={handleShareTrack}
                              disabled={!activeShareUrl}
                            >
                              {supportsNativeShare ? (shareFeedback === "shared" ? "Shared" : "Mobile share") : shareFeedback === "copied" ? "Link copied" : "Copy room link"}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="wd-player-modal__share-button"
                              onClick={handleCopyTrackLink}
                              disabled={!activeShareUrl}
                            >
                              {shareFeedback === "copied" ? "Link copied" : "Copy direct link"}
                            </Button>
                          </div>

                          <div className="wd-player-modal__share-group">
                            <span className="wd-player-modal__share-label">Music platforms</span>
                            <div className="wd-player-modal__share-platforms" aria-label="Open current track on music platforms">
                              {activeStreamingLinks.map((platform) => (
                                <a key={platform.key} className="wd-player-modal__share-platform" href={platform.href} target="_blank" rel="noreferrer">
                                  {platform.isDirect ? `Open on ${platform.label}` : `Search ${platform.label}`}
                                </a>
                              ))}
                            </div>
                            <p className="wd-player-modal__share-note">
                              {hasDirectStreamingLinks ? "Direct song links open wherever those destinations are already mapped." : "These currently open platform search results. They switch to direct song pages as per-track links are added to the data layer."}
                            </p>
                          </div>

                          {activeSocialShareLinks ? (
                            <div className="wd-player-modal__share-group">
                              <span className="wd-player-modal__share-label">Social and message share</span>
                              <div className="wd-player-modal__share-platforms" aria-label="Share to social and messaging platforms">
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.x} target="_blank" rel="noreferrer">
                                  Share on X
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.facebook} target="_blank" rel="noreferrer">
                                  Share on Facebook
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.whatsapp} target="_blank" rel="noreferrer">
                                  Share on WhatsApp
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.linkedin} target="_blank" rel="noreferrer">
                                  Share on LinkedIn
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.telegram} target="_blank" rel="noreferrer">
                                  Share on Telegram
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.reddit} target="_blank" rel="noreferrer">
                                  Share on Reddit
                                </a>
                                <a className="wd-player-modal__share-platform" href={activeSocialShareLinks.email}>
                                  Share by email
                                </a>
                              </div>
                            </div>
                          ) : null}

                          <div className="wd-player-modal__share-preview">
                            <article>
                              <span>Share line</span>
                              <p>{activeTrack.hook}</p>
                            </article>
                            <article>
                              <span>Landing note</span>
                              <p>The link reopens the Listening Room directly on {activeTrack.title}.</p>
                            </article>
                          </div>
                        </section>

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