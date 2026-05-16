import { HeroSection } from "@/components/HeroSection";
import { MusicSection } from "@/components/MusicSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="cg-page cg-home-page" id="page-top">
      <HeroSection />

      <MusicSection />

      <ContactSection />

      <Footer />
    </main>
  );
}
