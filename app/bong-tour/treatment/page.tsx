import type { Metadata } from "next";

import { BongTourTreatmentGate } from "@/components/bong-tour/BongTourTreatmentGate";

export const metadata: Metadata = {
  title: "Bong Tour Treatment | Creatives Guide Us",
  description: "Preview the protected Bong Tour treatment route. No screenplay pages are exposed publicly before the June 30 gate opens.",
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