import { HeroSection } from "@/components/HeroSection";
import { MusicSection } from "@/components/MusicSection";
import { ProjectHubSection } from "@/components/ProjectHubSection";
import { WorkSection } from "@/components/WorkSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="cg-page" id="page-top">
      <HeroSection />

      <ProjectHubSection />

      <MusicSection />

      <WorkSection />

      <ContactSection />

      <Footer />
    </main>
  );
}
