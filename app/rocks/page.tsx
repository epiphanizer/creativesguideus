import type { Metadata } from "next";
import { JohnWallsRocksView } from "@/components/john-walls/JohnWallsRocksView";

export const metadata: Metadata = {
  title: "johnwalls.rocks | The Creative Epicenter · All The Music",
  description: "The creative epicenter for guitar cuts, multitrack sessions, and unreleased studio vaults."
};

export default function RocksPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsRocksView />
    </main>
  );
}
