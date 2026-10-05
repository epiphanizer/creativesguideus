import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFirestorePublishedTakes } from "@/lib/firebase/johnwalls-takes";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "johnwalls_tracks.json");

export async function GET() {
  try {
    // 1. Load base tracks from data/johnwalls_tracks.json
    let baseTracks: any[] = [];
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          baseTracks = parsed;
        }
      } catch (e) {
        console.error("Failed to parse data/johnwalls_tracks.json:", e);
      }
    }

    // 2. Fetch live takes from Firestore
    let dbTracks: any[] = [];
    try {
      dbTracks = await getFirestorePublishedTakes(50);
    } catch (e) {
      console.warn("Firestore query error (falling back to base tracks):", e);
    }

    // 3. Merge: db takes override or prepend base tracks by ID
    const trackMap = new Map<string, any>();
    for (const t of baseTracks) {
      if (t && t.id) trackMap.set(t.id, t);
    }
    for (const t of dbTracks) {
      if (t && t.id) trackMap.set(t.id, t);
    }

    const allTracks = Array.from(trackMap.values()).sort((a, b) => {
      const timeA = new Date(a.publishedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ ok: true, tracks: allTracks }, { status: 200 });
  } catch (error) {
    console.error("Failed to load tracks:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal Server Error", tracks: [] },
      { status: 500 }
    );
  }
}
