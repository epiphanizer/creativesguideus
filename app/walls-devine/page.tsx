import type { Metadata } from "next";

import WallsDevineLanding from "@/components/walls-devine/WallsDevineLanding";

export const metadata: Metadata = {
  title: "Walls/Devine Volume 1 | Creatives Guide Us",
  description: "Preview the Walls/Devine Volume 1 listening room, collector grid, booking lane, merch storefront, and CGU signal path ahead of the September 1 opening."
};

export default function WallsDevinePage() {
  return (
    <main className="cg-page wd-page">
      <WallsDevineLanding />
    </main>
  );
}