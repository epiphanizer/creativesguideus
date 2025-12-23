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
    href: "https://www.worldcupdreams.org"
  },
  {
    title: "Appreesh",
    eyebrow: "Gratitude gifting co-op",
    description: "Built a community-owned platform with monochrome UX, token rituals, and a composed launch kit.",
    tags: ["Product", "Brand", "Web"],
    href: "https://appreesh.org"
  },
  {
    title: "Gratitude Sessions",
    eyebrow: "Original score release",
    description: "Small-batch score release we license for film, campaigns, and event sound—stream the anchor track anytime.",
    tags: ["Music", "Licensing", "Score"],
    href: "https://open.spotify.com/track/62hskoBw5Vl1LLZeR1oiBi"
  }
];

export function WorkSection() {
  return (
    <SectionShell id="work" labelledBy="work-title" innerClassName="cg-work cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="work-title"
          eyebrow="Composed releases"
          title="Proof in the field"
          description="Digital, score, and story engagements that ship as one calm sequence."
        />
        <p>
          We lead cross-disciplinary launches where donors, fans, and leadership experience the same crafted release—no crash
          landings, no overtime triage.
        </p>
        <p>
          Each engagement moves through weekly proofs, composed music cues, and a narrative kit so partners can act quickly
          without spinning up new teams.
        </p>
        <ul className="cg-work__summary">
          <li>Launch playbooks with content, motion, and score guidelines</li>
          <li>Analytics-ready builds that stay maintainable after handoff</li>
          <li>Calm stakeholder rituals that keep decisions in sync</li>
        </ul>
        <div className="cg-split__actions">
          <Button as="a" href="#contact">
            Book a case review
          </Button>
          <Button as="a" href="#music" variant="ghost">
            Listen to Gratitude
          </Button>
        </div>
      </div>

      <div className="cg-split__body cg-work__body">
        <div className="cg-card-grid cg-work__grid" role="list">
          {highlightProjects.map((project) => (
            <div key={project.title} role="listitem">
              <Card
                title={project.title}
                eyebrow={project.eyebrow}
                description={project.description}
                tags={project.tags}
                href={project.href}
                className="cg-work__card"
              />
            </div>
          ))}
        </div>
        <p className="cg-work__note">Every release stacks strategy, build, and score into one composed kit.</p>
      </div>
    </SectionShell>
  );
}

export default WorkSection;
