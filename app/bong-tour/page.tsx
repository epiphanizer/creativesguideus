import type { Metadata } from "next";

import { BongTourFeature } from "@/components/bong-tour/BongTourFeature";

export const metadata: Metadata = {
  title: "Bong Tour | Creatives Guide Us",
  description: "Preview the Bong Tour poster world, launch lane, and protected treatment posture while Walls/Devine opens first on September 1 and Bong Tour holds November 4 for the deeper gate."
};

export default function BongTourPage() {
  return (
    <main id="hero" className="cg-page bt-page">
      <BongTourFeature />
    </main>
  );
}
