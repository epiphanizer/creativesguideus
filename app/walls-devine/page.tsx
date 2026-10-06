import type { Metadata } from "next";

import WallsDevineLanding from "@/components/walls-devine/WallsDevineLanding";

export const metadata: Metadata = {
  title: "Walls/Devine Volume 1 | Creatives Guide Us",
  description: "Walls/Devine Volume 1, released September 1, 2026. Listen to the record, read the journals, join the list, and shop the release.",
  openGraph: {
    title: "Walls/Devine Volume 1 | Creatives Guide Us",
    description: "Debut 8-track studio master album tracked live on 2-inch tape in Los Angeles.",
    url: "https://creativesguide.us/walls-devine",
    siteName: "Creatives Guide Us",
    images: [
      {
        url: "/images/walls-devine-vol1-og.png",
        width: 1254,
        height: 1254,
        alt: "Walls/Devine — Volume 1 Album Cover"
      }
    ],
    type: "music.album"
  },
  twitter: {
    card: "summary_large_image",
    title: "Walls/Devine Volume 1 | Creatives Guide Us",
    description: "Debut 8-track studio master album tracked live on 2-inch tape in Los Angeles.",
    images: ["/images/walls-devine-vol1-og.png"]
  }
};

export default function WallsDevinePage() {
  return (
    <main className="cg-page wd-page">
      <WallsDevineLanding />
    </main>
  );
}