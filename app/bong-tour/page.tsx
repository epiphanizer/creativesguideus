import type { Metadata } from "next";

import { BongTourFeature } from "@/components/bong-tour/BongTourFeature";

export const metadata: Metadata = {
  title: "Bong Tour | Creatives Guide Us",
  description: "Discover the Bong Tour poster, premise, and soundtrack world ahead of the November 4 opening."
};

export default function BongTourPage() {
  return (
    <main id="hero" className="cg-page bt-page">
      <BongTourFeature />
    </main>
  );
}
