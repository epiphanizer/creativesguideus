import type { Metadata } from "next";

import WallsDevineLanding from "@/components/walls-devine/WallsDevineLanding";

export const metadata: Metadata = {
  title: "Walls/Devine Volume 1 | Creatives Guide Us",
  description: "Walls/Devine Volume 1, released September 1, 2026. Listen to the record, read the journals, join the list, and shop the release."
};

export default function WallsDevinePage() {
  return (
    <main className="cg-page wd-page">
      <WallsDevineLanding />
    </main>
  );
}