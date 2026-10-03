import type { Metadata } from "next";
import { JohnWallsStudioView } from "@/components/john-walls/JohnWallsStudioView";

export const metadata: Metadata = {
  title: "johnwalls.studio | The Creative Epicenter · Platform & Generative Sound Lab",
  description: "The creative epicenter for direct platform architecture, generative audio engines, and studio software craft."
};

export default function StudioPage() {
  return (
    <main id="hero" className="cg-page jw-page">
      <JohnWallsStudioView />
    </main>
  );
}
