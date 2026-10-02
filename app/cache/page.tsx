import type { Metadata } from "next";

import { CacheFeature } from "@/components/cache/CacheFeature";

export const metadata: Metadata = {
  title: "Cache | Creatives Guide Us",
  description: "An upcoming adventure series. Field expeditions, treasure hunting, and the pursuit of things left off the map."
};

export default function CachePage() {
  return (
    <main id="hero" className="cg-page cache-page">
      <CacheFeature />
    </main>
  );
}
