import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const heroTitle = "Two living worlds. One front door.";

const heroSubhead =
  "Creatives Guide Us now opens through the worlds already in motion: Walls & Devine, Bong Tour, and the release signal connecting album, screenplay, and rollout.";

const heroSignals = [
  {
    label: "Album world",
    value: "Walls & Devine",
    note: "Collector grid, journals, rollout logic, and cue bridges."
  },
  {
    label: "Screenplay world",
    value: "Bong Tour",
    note: "Poster-first pitch surface with score sketches and myth architecture."
  },
  {
    label: "Release signal",
    value: "One shared portal",
    note: "Score, story, and rollout stay in dialogue instead of breaking into separate lanes."
  }
];

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
                Browse the Worlds
              </Button>
            </div>
          }
        />

        <ul className="cg-hero__signals" aria-label="Creative portal signals">
          {heroSignals.map((signal) => (
            <li key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <p>{signal.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

export default HeroSection;
