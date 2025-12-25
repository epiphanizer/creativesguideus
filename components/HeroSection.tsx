import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const processSteps = [
  {
    title: "Signal Sweep",
    description: "Immersion crews compress market noise into the handful of signals worth scaling.",
    icon: (
      <svg className="cg-hero__process-icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <circle cx="32" cy="32" r="21" />
        <path d="M32 11v42" />
        <path d="M11 32h42" />
      </svg>
    )
  },
  {
    title: "System Chorus",
    description: "Design, engineering, and sonic drafts converge in one sprint to translate signals into clarity.",
    icon: (
      <svg className="cg-hero__process-icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <rect x="14" y="14" width="36" height="36" rx="6" />
        <path d="M14 32h36" />
        <path d="M32 14v36" />
      </svg>
    )
  },
  {
    title: "Rhythm Launch",
    description: "Enablement kits, playlists, and ops cadences keep momentum compounding after drop day.",
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

const heroTitle = "Bring your project from noise to clarity.";

const heroSubhead = "Partner directly with us to align software, story, and score until the launch vision is unmistakable.";

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
                Build Your Future
              </Button>
              <Button as="a" href="#work" variant="ghost">
                Scale Your Impact
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
