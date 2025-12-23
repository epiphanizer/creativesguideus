import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { LineGridMotif } from "@/components/motif/LineGridMotif";

export const heroHeadlineOptions = [
  "Boutique digital editors for the restless.",
  "We score, script, and ship in grayscale.",
  "Tasteful internet for studios with something to say."
];

const heroSubhead =
  "Websites, scores, and writing systems built in one monochrome language so your story never fractures.";

export function HeroSection() {
  return (
    <SectionShell id="hero" variant="hero" labelledBy="hero-title" innerClassName="cg-hero">
      <div className="cg-hero__content">
        <SectionHeader
          headingLevel="h1"
          id="hero-title"
          title={heroHeadlineOptions[0]}
          description={heroSubhead}
          actions={
            <div className="cg-hero__actions">
              <Button>Start a Project</Button>
              <Button as="a" href="#work" variant="ghost">
                View Work
              </Button>
            </div>
          }
        />
        <div className="cg-hero__options" aria-label="Alternate hero headline options">
          <span className="cg-hero__options-label">Also exploring:</span>
          <ul className="cg-hero__options-list">
            {heroHeadlineOptions.slice(1).map((option) => (
              <li key={option} className="cg-hero__options-item">
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <LineGridMotif className="cg-hero__motif" />
    </SectionShell>
  );
}

export default HeroSection;
