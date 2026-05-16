import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import { parseFile } from "music-metadata";

import type { AdminAudioAnalysis } from "./types";

const releaseAudioDir = path.join(process.cwd(), "public", "walls-devine", "releases", "volume1");

function toRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function formatDuration(durationSeconds: number | null) {
  if (!durationSeconds || Number.isNaN(durationSeconds)) {
    return "—";
  }

  const rounded = Math.round(durationSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

export async function analyzeWallsDevineReleaseAudio() {
  const fileNames = (await readdir(releaseAudioDir))
    .filter((fileName) => fileName.toLowerCase().endsWith(".wav"))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  return Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(releaseAudioDir, fileName);
      const relativePath = toRelativePath(filePath);

      try {
        const [fileStats, metadata] = await Promise.all([stat(filePath), parseFile(filePath)]);

        return {
          fileName,
          relativePath,
          fileSizeBytes: fileStats.size,
          fileSizeLabel: formatFileSize(fileStats.size),
          durationSeconds: metadata.format.duration ?? null,
          durationLabel: formatDuration(metadata.format.duration ?? null),
          sampleRate: metadata.format.sampleRate ?? null,
          channels: metadata.format.numberOfChannels ?? null,
          bitDepth: metadata.format.bitsPerSample ?? null,
          bitrateKbps: metadata.format.bitrate ? Math.round(metadata.format.bitrate / 1000) : null,
          codec: metadata.format.codec ?? null,
          container: metadata.format.container ?? null,
          lossless: typeof metadata.format.lossless === "boolean" ? metadata.format.lossless : null,
          title: metadata.common.title ?? null,
          album: metadata.common.album ?? null,
          artist: metadata.common.artist ?? null,
          albumArtist: metadata.common.albumartist ?? null,
          trackNumber: metadata.common.track.no ?? null,
          year: metadata.common.year ?? null
        } satisfies AdminAudioAnalysis;
      } catch (error) {
        const fileStats = await stat(filePath);

        return {
          fileName,
          relativePath,
          fileSizeBytes: fileStats.size,
          fileSizeLabel: formatFileSize(fileStats.size),
          durationSeconds: null,
          durationLabel: "—",
          sampleRate: null,
          channels: null,
          bitDepth: null,
          bitrateKbps: null,
          codec: null,
          container: null,
          lossless: null,
          title: null,
          album: null,
          artist: null,
          albumArtist: null,
          trackNumber: null,
          year: null,
          error: error instanceof Error ? error.message : "Could not inspect this WAV file."
        } satisfies AdminAudioAnalysis;
      }
    })
  );
}