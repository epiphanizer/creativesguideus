import type { Metadata } from "next";
import { JohnWallsRocksView } from "@/components/john-walls/JohnWallsRocksView";

export const metadata: Metadata = {
  title: "johnwalls.rocks | All The Music · Official Discography",
  description: "Official music archive and listening room for John Walls."
};

export default function RocksPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsRocksView />
    </main>
  );
}
