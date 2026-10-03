import type { Metadata } from "next";
import { JohnWallsRocksView } from "@/components/john-walls/JohnWallsRocksView";

export const metadata: Metadata = {
  title: "johnwalls.rocks | The Creative Epicenter · All The Music",
  description:
    "The creative epicenter for guitar cuts, multitrack sessions, original productions, and unreleased studio vaults by John Walls. It's really all of what I do in life here.",
  openGraph: {
    title: "johnwalls.rocks | The Creative Epicenter",
    description: "The creative epicenter for guitar cuts, multitrack sessions, and unreleased studio vaults.",
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
