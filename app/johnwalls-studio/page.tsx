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
    siteName: "johnwalls.studio",
    images: [
      {
        url: "https://johnwalls.studio/images/johnwalls-studio-og.png",
        width: 1200,
        height: 630,
        alt: "johnwalls.studio — Generative Audio DSP Lab & Ableton Live VST3/AU"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "johnwalls.studio | Generative Audio DSP Lab",
    description: "Direct platform architecture, generative music engines, and studio software craft.",
    images: ["https://johnwalls.studio/images/johnwalls-studio-og.png"]
  }
};

export default function JohnWallsStudioPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsStudioView />
    </main>
  );
}
