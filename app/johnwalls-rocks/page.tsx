import type { Metadata } from "next";
import { JohnWallsRocksView } from "@/components/john-walls/JohnWallsRocksView";

export const metadata: Metadata = {
  title: "johnwalls.rocks | All The Music · Official Discography & Master Tapes",
  description:
    "Official music archive and listening room for John Walls. Analog recordings, tape machine masters, pressed editions, and soundboard tapes.",
  openGraph: {
    title: "johnwalls.rocks | John Walls Music Vault",
    description: "Analog master recordings, vinyl editions, and soundboard cuts direct from the sound lab.",
    url: "https://johnwalls.rocks",
    siteName: "johnwalls.rocks"
  }
};

export default function JohnWallsRocksPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsRocksView />
    </main>
  );
}
