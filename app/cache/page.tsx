import type { Metadata } from "next";

import { CacheFeature } from "@/components/cache/CacheFeature";

export const metadata: Metadata = {
  title: "Cache | Creatives Guide Us",
  description: "A new series from Creatives Guide Us. Coming soon — request early access through the studio contact route."
};

export default function CachePage() {
  return (
    <main id="hero" className="cg-page cache-page">
      <CacheFeature />
    </main>
  );
}
