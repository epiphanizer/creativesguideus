import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const heroTitle = "Active projects, clearer entry points.";

const heroSubhead =
  "Creatives Guide Us now leads with the work already in motion: Walls & Devine, Bong Tour, and the client builds that prove how product, score, and story align.";

export function HeroSection() {
  return (
    <SectionShell id="hero" variant="hero" labelledBy="hero-title" innerClassName="cg-hero">
      <div className="cg-hero__content">
        <SectionHeader
          headingLevel="h1"
          id="hero-title"
          title={heroTitle}
          description={heroSubhead}
          align="center"
          actions={
            <div className="cg-hero__actions">
              <Button as="a" href="/walls-devine">
                Open Walls & Devine
              </Button>
              <Button as="a" href="/bong-tour" variant="secondary">
                Open Bong Tour
              </Button>
              <Button as="a" href="#projects" variant="ghost">
                Browse Project Map
              </Button>
            </div>
          }
        />
      </div>
    </SectionShell>
  );
}

export default HeroSection;
