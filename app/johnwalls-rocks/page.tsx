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
    siteName: "johnwalls.rocks",
    images: [
      {
        url: "https://johnwalls.rocks/images/walls-devine-vol1-og.png",
        width: 1254,
        height: 1254,
        alt: "Walls/Devine — Volume 1 Album Cover"
      }
    ],
    type: "music.album"
  },
  twitter: {
    card: "summary_large_image",
    title: "johnwalls.rocks | The Creative Epicenter",
    description: "The creative epicenter for guitar cuts, multitrack sessions, and unreleased studio vaults.",
    images: ["https://johnwalls.rocks/images/walls-devine-vol1-og.png"]
  }
};

export default function JohnWallsRocksPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsRocksView />
    </main>
  );
}
