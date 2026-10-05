import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFirestorePublishedTakes } from "@/lib/firebase/johnwalls-takes";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "johnwalls_tracks.json");

export async function GET() {
  try {
    // Primary: fetch from database
    const dbTracks = await getFirestorePublishedTakes(50);
    if (dbTracks.length > 0) {
      return NextResponse.json({ ok: true, tracks: dbTracks }, { status: 200 });
    }

    // Fallback: check file-system cache
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const tracks = JSON.parse(raw);
      return NextResponse.json({ ok: true, tracks: Array.isArray(tracks) ? tracks : [] }, { status: 200 });
    }

    return NextResponse.json({ ok: true, tracks: [] }, { status: 200 });
  } catch (error) {
    console.error("Failed to load tracks:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal Server Error", tracks: [] },
      { status: 500 }
    );
  }
}
