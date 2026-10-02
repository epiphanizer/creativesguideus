import type { Metadata } from "next";

import { BongTourLanding } from "@/components/bong-tour/BongTourLanding";

export const metadata: Metadata = {
  title: "Bong Tour | A Masala Film | Creatives Guide Us",
  description: "A diaspora masala satire where Hollywood mania collides with Indian myth logic. Feature screenplay, original sound lab score, and Appreesh giveaway."
};

export default function BongTourPage() {
  return (
    <main id="hero" className="cg-page bt-page">
      <BongTourLanding />
    </main>
  );
}

