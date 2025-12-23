import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const processSteps = [
  {
    title: "Listen",
    description: "Workshops and tone poems surface the story worth telling.",
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
    description: "We draft grids, scripts, and cues together in monochrome clarity.",
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
    description: "Launch plans, sonic cues, and delivery kits land as one calm debut.",
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

const heroTitle = "Boutique web, score, and story direction.";

const heroSubhead = "One monochrome studio guiding every release from first outline to final premiere.";

export function HeroSection() {
  return (
    <SectionShell id="hero" variant="hero" labelledBy="hero-title" innerClassName="cg-hero">
      <div className="cg-hero__lede">
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
              <Button as="a" href="#work" variant="ghost">
                View Selected Work
              </Button>
            </div>
          }
        />
      </div>
      <div className="cg-hero__aside">
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
    </SectionShell>
  );
}

export default HeroSection;
