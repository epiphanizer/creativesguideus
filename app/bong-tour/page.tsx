import type { Metadata } from "next";

import { BongTourFeature } from "@/components/bong-tour/BongTourFeature";

export const metadata: Metadata = {
  title: "Bong Tour | Creatives Guide Us",
  description: "Explore the Bong Tour screenplay world, cue rooms, soundtrack bridge, collector reward layer, and request path for private treatment access."
};

export default function BongTourPage() {
  return (
    <main id="hero" className="cg-page bt-page">
      <BongTourFeature />
    </main>
  );
}
