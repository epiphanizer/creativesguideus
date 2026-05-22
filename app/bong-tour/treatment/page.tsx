import type { Metadata } from "next";

import { BongTourTreatmentGate } from "@/components/bong-tour/BongTourTreatmentGate";

export const metadata: Metadata = {
  title: "Bong Tour Treatment | Creatives Guide Us",
  description: "Private Bong Tour treatment access for approved readers, collaborators, and soundtrack partners.",
  robots: {
    index: false,
    follow: false
  }
};

export default function BongTourTreatmentPage() {
  return (
    <main className="cg-page bt-page bt-treatment-page" id="hero">
      <div className="bt-stage">
        <BongTourTreatmentGate />
      </div>
    </main>
  );
}