import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveFirestorePublishedTake } from "@/lib/firebase/johnwalls-takes";

export const dynamic = "force-dynamic";

interface PublishedTrack {
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
  visualizerPreset: string;
  visualizerConfig?: Record<string, unknown>;
  tags: string[];
  publishedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "johnwalls_tracks.json");
const AUDIO_DIR = path.join(process.cwd(), "public", "audio", "johnwalls-studio", "takes");

function readTracks(): PublishedTrack[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PublishedTrack[];
  } catch (err) {
    console.error("Error reading johnwalls_tracks.json:", err);
    return [];
  }
}

function writeTracks(tracks: PublishedTrack[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(tracks, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing johnwalls_tracks.json:", err);
  }
}

export async function POST(request: Request) {
  try {
    if (!fs.existsSync(AUDIO_DIR)) {
      fs.mkdirSync(AUDIO_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { ok: false, error: "No audio file provided in request (field 'audio' required)" },
        { status: 400 }
      );
    }

    const requestedId = (formData.get("id") as string) || "";
    const title = (formData.get("title") as string) || "Ableton Studio Take";
    const artist = (formData.get("artist") as string) || "John Walls";
    const description = (formData.get("description") as string) || "";
    const visualizerPreset = (formData.get("visualizerPreset") as string) || "supercollider-lissajous";

    let metaObj: Record<string, unknown> = {};
    const rawMeta = formData.get("metadata") as string | null;
    if (rawMeta) {
      try {
        metaObj = JSON.parse(rawMeta);
      } catch {
        metaObj = {};
      }
    }

    const bpmVal = Number(formData.get("bpm") || metaObj.bpm || 120);
    const durationVal = Number(formData.get("duration") || metaObj.durationSeconds || 0);
    const barCountVal = Number(formData.get("barLength") || metaObj.barCount || 8);
    const dawSource = (formData.get("dawSource") as string) || (metaObj.dawSource as string) || "Ableton Live";
    const alsProject = (formData.get("project") as string) || (metaObj.projectName as string) || "Live Session";

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 24);
    const trackId = requestedId || `jwt_${timestamp}_${safeTitle}`;
    const fileName = `${trackId}.wav`;
    const targetFilePath = path.join(AUDIO_DIR, fileName);

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(targetFilePath, buffer);

    const trackRecord: PublishedTrack = {
      id: trackId,
      title,
      artist,
      description,
      audioUrl: `/audio/johnwalls-studio/takes/${fileName}`,
      fileName,
      fileSizeBytes: buffer.length,
      bpm: bpmVal > 0 ? bpmVal : 120,
      durationSeconds: durationVal > 0 ? durationVal : Math.round((buffer.length / (48000 * 2 * 3)) * 10) / 10,
      barLength: barCountVal,
      keySignature: (metaObj.keySignature as string) || undefined,
      dawSource,
      alsProject,
      visualizerPreset,
      visualizerConfig: (metaObj.visualizerConfig as Record<string, unknown>) || {
        oscMode: "reactive-lissajous",
        colorTheme: "studio-gold-cyan",
        fftBands: 64,
        phosphorTrail: 0.88,
      },
      tags: Array.isArray(metaObj.tags) ? (metaObj.tags as string[]) : ["ableton", "sound-lab", "supercollider"],
      publishedAt: new Date().toISOString(),
    };

    // Persist to Firestore database
    await saveFirestorePublishedTake(trackRecord);

    const existingTracks = readTracks();
    const updatedTracks = [trackRecord, ...existingTracks.filter((t) => t.id !== trackId)];
    writeTracks(updatedTracks);

    return NextResponse.json(
      {
        ok: true,
        message: "Track published successfully to johnwalls.studio",
        track: trackRecord,
        publicUrl: `https://johnwalls.studio/audio/johnwalls-studio/takes/${fileName}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to process publish request:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
