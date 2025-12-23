import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { LineGridMotif } from "@/components/motif/LineGridMotif";

const heroTitle = "Art-led digital, sound, and story direction.";

const heroSubhead =
  "We help emerging studios slow down, make room for intention, and release work that feels composed rather than rushed.";

export function HeroSection() {
  return (
    <SectionShell id="hero" variant="hero" labelledBy="hero-title" innerClassName="cg-hero">
      <div className="cg-hero__content">
        <SectionHeader
          headingLevel="h1"
          id="hero-title"
          title={heroTitle}
          description={heroSubhead}
          actions={
            <div className="cg-hero__actions">
              <Button as="a" href="#contact">
                Start a Project
              </Button>
              <Button as="a" href="#music" variant="ghost">
                Hear Gratitude
              </Button>
            </div>
          }
        />
      </div>
      <LineGridMotif className="cg-hero__motif" />
    </SectionShell>
  );
}

export default HeroSection;
