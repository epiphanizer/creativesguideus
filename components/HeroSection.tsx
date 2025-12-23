import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { LineGridMotif } from "@/components/motif/LineGridMotif";

const processSteps = [
  {
    title: "Listen",
    description: "Salons, shared references, and tone poems turn vision into language.",
    icon: (
      <svg className="cg-hero__process-icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <circle cx="32" cy="32" r="21" />
        <path d="M32 11v42" />
        <path d="M11 32h42" />
      </svg>
    )
  },
  {
    title: "Shape",
    description: "Grids, scripts, and score sketches develop in monochrome layers.",
    icon: (
      <svg className="cg-hero__process-icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <rect x="14" y="14" width="36" height="36" rx="6" />
        <path d="M14 32h36" />
        <path d="M32 14v36" />
      </svg>
    )
  },
  {
    title: "Score",
    description: "We arrange launch cadence, sonic cues, and delivery for calm debuts.",
    icon: (
      <svg className="cg-hero__process-icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <path d="M20 44c0-6 24-6 24 0" />
        <path d="M24 20v24" />
        <path d="M40 16v28" />
        <circle cx="24" cy="46" r="4" />
        <circle cx="40" cy="44" r="4" />
      </svg>
    )
  }
];

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

        <div className="cg-hero__process" aria-label="Studio process">
          {processSteps.map((step) => (
            <div key={step.title} className="cg-hero__process-step">
              {step.icon}
              <div className="cg-hero__process-copy">
                <p className="cg-hero__process-title">{step.title}</p>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LineGridMotif className="cg-hero__motif" />
    </SectionShell>
  );
}

export default HeroSection;
