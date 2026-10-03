import type { Metadata } from "next";
import { JohnWallsStudioView } from "@/components/john-walls/JohnWallsStudioView";

export const metadata: Metadata = {
  title: "johnwalls.studio | Direct Platform & Generative Sound Haven",
  description: "Direct-to-consumer platform, resource site, and generative music haven by John Walls."
};

export default function StudioPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsStudioView />
    </main>
  );
}
