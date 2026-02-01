import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const heroTitle = "Bringing your project from noise to clarity.";

const heroSubhead = "A perpetual creative engine aligning product, narrative, and score so your vision keeps compounding.";

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
              <Button as="a" href="#contact">
                Connect
              </Button>
              <Button as="a" href="/work" variant="ghost">
                Our Work
              </Button>
            </div>
          }
        />
      </div>
    </SectionShell>
  );
}

export default HeroSection;
