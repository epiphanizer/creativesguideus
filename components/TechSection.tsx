import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const modernizationPath = [
  {
    era: "WordPress foundations",
    detail: "Custom themes and editorial tooling that gave teams full control without breaking story pacing."
  },
  {
    era: "React acceleration",
    detail: "Design systems in Next.js, component libraries, and score-aware routing for truly synchronized launches."
  },
  {
    era: "Agentic operations",
    detail: "AI-assisted cadences that pair content, code, and music into iterative release pilots beyond traditional CMS."
  }
];

const techProofs = [
  {
    title: "Appreesh.org",
    eyebrow: "Web3 gratitude economy",
    summary: "Co-founded crypto-powered gifting platform—smart contracts, on-chain analytics, and community rituals."
  },
  {
    title: "Agentic release kits",
    eyebrow: "Automation",
    summary: "Composable pipelines that transform briefs into staged deploys, soundtrack cues, and newsletter drops."
  },
  {
    title: "Hybrid stack guidance",
    eyebrow: "Advisory",
    summary: "We guide teams migrating legacy WordPress stacks into React clouds, then extend into protocol-native surfaces."
  }
];

export function TechSection() {
  return (
    <SectionShell id="tech" labelledBy="tech-title" innerClassName="cg-tech">
      <SectionHeader
        id="tech-title"
        eyebrow="Technology"
        title="Code, crypto, and agentic systems that keep releases alive"
        description="We build black-and-white worlds, but the stack underneath is anything but simple—engineered for calm updates, on-chain trust, and rapid iteration."
        icon={
          <svg viewBox="0 0 24 24">
            <path d="M4 8h16v8H4z" />
            <path d="M8 4h8v4H8z" />
            <path d="M8 16h8v4H8z" />
          </svg>
        }
        iconLabel="Creative systems emblem"
        badge="Creative!!!"
      />

      <div className="cg-tech__grid">
        <div className="cg-tech__story">
          <Tag className="cg-tech__tag">Code-driven studio</Tag>
          <p>
            Our build practice spans product, protocol, and performance. We write the code, tune the infrastructure, and pair every
            launch with the score and narrative it deserves. From Web2 migrations to Web3 pilots, we act as both designers and
            engineers.
          </p>
          <div className="cg-tech__actions">
            <Button
              as="a"
              href="https://appreesh.org"
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              className="cg-tech__cta"
            >
              Explore Appreesh.org
            </Button>
            <Button as="a" href="#contact" variant="secondary">
              Start a systems brief
            </Button>
          </div>
        </div>

        <aside className="cg-tech__path" aria-label="Modernization timeline">
          <h3 className="cg-tech__path-title">Modernization path</h3>
          <ol>
            {modernizationPath.map((step) => (
              <li key={step.era}>
                <span className="cg-tech__path-era">{step.era}</span>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="cg-tech__proof" role="list">
        {techProofs.map((proof) => (
          <div key={proof.title} role="listitem" className="cg-tech__proof-card">
            <div className="cg-tech__proof-icon" aria-hidden>
              <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="22" />
                <path d="M20 32h24" />
                <path d="M32 20v24" />
                <path d="M26 26l12 12" />
              </svg>
            </div>
            <div className="cg-tech__proof-copy">
              <p className="cg-tech__proof-eyebrow">{proof.eyebrow}</p>
              <h3>{proof.title}</h3>
              <p>{proof.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export default TechSection;
