import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";
import { albumLaunchCampaignWindow, june30LaunchDateLabel } from "@/lib/launch-state";

const systemsRoadmapHref = buildContactHref({
  overrides: {
    context: "systems-build",
    goal: "systems",
    surface: "internal-platform",
    engagement: "systems-layer"
  }
});
const appreeshPreviewHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "appreesh-preview",
    inquiryType: "mailing-list",
    project: "Appreesh",
    surface: "product-app",
    sourceRoute: "/",
    campaignWindow: albumLaunchCampaignWindow
  }
});

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
    title: "Appreesh preview",
    eyebrow: "Prelaunch gratitude layer",
    summary: `A ritual-first cryptographic layer staged toward ${june30LaunchDateLabel} while CGU keeps preview interest, launch-window routing, and the live reward path internal for now.`
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
        title="Engineer future-ready systems that never plateau"
        description="We blend full-stack engineering, protocol design, and automation to deliver infrastructure that scales momentum across platforms, chains, and channels."
        icon={
          <svg viewBox="0 0 24 24">
            <path d="M4 8h16v8H4z" />
            <path d="M8 4h8v4H8z" />
            <path d="M8 16h8v4H8z" />
          </svg>
        }
        iconLabel="Creative systems emblem"
      />

      <div className="cg-tech__grid">
        <div className="cg-tech__story">
          <Tag className="cg-tech__tag">Future-built practice</Tag>
          <p>
            Our engineers, composers, and strategists architect platforms where data, experience, and sound reinforce each other.
            We migrate legacy stacks, prototype emerging tech, and weave automation so teams stay focused on commanding the market.
          </p>
          <div className="cg-tech__actions">
            <ContactModalLink href={appreeshPreviewHref} buttonVariant="ghost">
              Request Appreesh Notice
            </ContactModalLink>
            <ContactModalLink href={systemsRoadmapHref} buttonVariant="secondary">
              Build Your Systems Roadmap
            </ContactModalLink>
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
