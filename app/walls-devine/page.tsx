import type { Metadata } from "next";

import WallsDevineLanding from "@/components/walls-devine/WallsDevineLanding";

export const metadata: Metadata = {
  title: "Walls/Devine Volume 1 | Creatives Guide Us",
  description: "Enter the Walls/Devine Volume 1 listening room, journals, merch, and collector pieces ahead of the September 1 opening."
};

export default function WallsDevinePage() {
  return (
    <main className="cg-page wd-page">
      <WallsDevineLanding />
    </main>
  );
}