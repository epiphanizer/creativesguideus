import { HeroSection } from "@/components/HeroSection";
import { WebSection } from "@/components/WebSection";
import { WhoWeAreSection } from "@/components/WhoWeAreSection";
import { MusicSection } from "@/components/MusicSection";
import { WritingSection } from "@/components/WritingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="cg-page" id="page-top">
      <HeroSection />

      <WhoWeAreSection />

      <WebSection />

      <MusicSection />

      <WritingSection />

      <ContactSection />

      <Footer />
    </main>
  );
}
