import type { Metadata } from "next";

import { BongTourTreatmentReader } from "@/components/bong-tour/BongTourTreatmentReader";

export const metadata: Metadata = {
  title: "Bong Tour Treatment | Official Reading Copy | Creatives Guide Us",
  description: "Official reading copy and screenplay treatment for Bong Tour: A Masala Film by Sean Halls & Collaborators."
};

export default function BongTourTreatmentPage() {
  return (
    <main className="cg-page bt-page bt-treatment-page" id="hero">
      <BongTourTreatmentReader />
    </main>
  );
}