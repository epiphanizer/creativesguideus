import type { Metadata } from "next";
import { JohnWallsStudioView } from "@/components/john-walls/JohnWallsStudioView";

export const metadata: Metadata = {
  title: "johnwalls.studio | Direct-to-Consumer Platform & Generative Sound Haven",
  description:
    "Direct-to-consumer platform, resource site, generative music haven, and artisan tape sample library by John Walls.",
  openGraph: {
    title: "johnwalls.studio | Direct Platform & Sound Haven",
    description: "Generative music engines, 24-bit reel-to-reel analog samples, and producer workflows.",
    url: "https://johnwalls.studio",
    siteName: "johnwalls.studio"
  }
};

export default function JohnWallsStudioPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsStudioView />
    </main>
  );
}
