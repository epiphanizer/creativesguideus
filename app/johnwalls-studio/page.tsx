import type { Metadata } from "next";
import { JohnWallsStudioView } from "@/components/john-walls/JohnWallsStudioView";

export const metadata: Metadata = {
  title: "johnwalls.studio | The Creative Epicenter · Platform & Generative Sound Lab",
  description:
    "The creative epicenter for direct-to-listener sound architecture, generative engines, and studio software craft by John Walls.",
  openGraph: {
    title: "johnwalls.studio | The Creative Epicenter",
    description: "Direct platform architecture, generative music engines, and studio software craft.",
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
