import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const highlightProjects = [
  {
    title: "World Cup Dreams Foundation",
    eyebrow: "Ski fundraising platform",
    description: "Story-led giving site with an athlete journal cadence to rally donors for the 2025 season.",
    tags: ["Web", "Story", "Donor UX"],
    href: "https://www.worldcupdreams.org",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <path d="M6 23 16 9l10 14" />
        <path d="M6 23h20" />
      </svg>
    )
  },
  {
    title: "Appreesh",
    eyebrow: "Gratitude gifting co-op",
    description: "Built a community-owned platform with monochrome UX, token rituals, and a composed launch kit.",
    tags: ["Product", "Brand", "Web"],
    href: "https://appreesh.org",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <path d="M9.5 12.5a3.5 3.5 0 1 1 5 5L16 19l1.5-1.5a3.5 3.5 0 1 1 5-5" />
        <path d="M8 20.5 16 24l8-3.5" />
      </svg>
    )
  },
  {
    title: "Lead Me Guide Me",
    eyebrow: "Scripture application",
    description: "Shaped a responsive scripture companion with daily prompts, bespoke scoring cues, and guided reflection flows.",
    tags: ["Product", "Music", "Story"],
    href: "https://leadmeguideme.app",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <path d="M9 7h14v18H9z" />
        <path d="M9 12h14" />
        <path d="M16 12v13" />
        <path d="M13 10h6" />
      </svg>
    )
  }
];

export function WorkSection() {
  return (
    <SectionShell id="work" labelledBy="work-title" innerClassName="cg-work">
      <div className="cg-split cg-work__layout">
        <div className="cg-split__lede">
          <SectionHeader
            id="work-title"
            eyebrow="Composed releases"
            title="Proof in the field"
            description="Digital, score, and story engagements that ship as one calm sequence."
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M4.5 15.5c2.5 0 4.5-2 6-5 1.5 3 3.5 5 6 5" />
                <path d="M6 9c1.2-2 3-4 6-4 3 0 4.8 2 6 4" />
                <path d="M4.5 15.5l3.5-1.5L6 20l4-3 1.5 3.5" />
              </svg>
            }
            iconLabel="Creative release emblem"
            badge="Creative!!!"
          />
          <p>
            We lead cross-disciplinary launches where donors, fans, and leadership experience the same crafted release—no crash
            landings, no overtime triage.
          </p>
          <p>
            Each engagement moves through weekly proofs, composed music cues, and a narrative kit so partners can act quickly
            without spinning up new teams.
          </p>
          <div className="cg-split__actions">
            <Button as="a" href="#contact">
              Book a case review
            </Button>
            <Button as="a" href="#music" variant="ghost">
              Listen to Gratitude
            </Button>
          </div>
        </div>

        <aside className="cg-work__aside" aria-label="Launch principles">
          <ul className="cg-work__summary">
            <li>Launch playbooks with content, motion, and score guidelines</li>
            <li>Analytics-ready builds that stay maintainable after handoff</li>
            <li>Calm stakeholder rituals that keep decisions in sync</li>
          </ul>
        </aside>
      </div>

      <div className="cg-card-grid cg-work__grid" role="list">
        {highlightProjects.map((project) => (
          <div key={project.title} role="listitem">
            <Card
              title={project.title}
              eyebrow={project.eyebrow}
              description={project.description}
              tags={project.tags}
              href={project.href}
              icon={project.icon}
              className="cg-work__card"
            />
          </div>
        ))}
      </div>

      <p className="cg-work__note">Every release stacks strategy, build, and score into one composed kit.</p>
    </SectionShell>
  );
}

export default WorkSection;
