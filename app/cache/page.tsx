import type { Metadata } from "next";

import { CacheFeature } from "@/components/cache/CacheFeature";

export const metadata: Metadata = {
  title: "Cache | Creatives Guide Us",
  description: "A hand-numbered print monograph and archival audio edition from Creatives Guide Us documenting unreleased takes and studio typography."
};

export default function CachePage() {
  return (
    <main id="hero" className="cg-page cache-page">
      <CacheFeature />
    </main>
  );
}
