import { HeroSection } from "@/components/HeroSection";
import { WebSection } from "@/components/WebSection";
import { MusicSection } from "@/components/MusicSection";
import { WritingSection } from "@/components/WritingSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="cg-page" id="page-top">
      <HeroSection />

      <WebSection />

      <MusicSection />

      <WritingSection />

      <ContactSection />

      <AboutSection />

      <Footer />
    </main>
  );
}
