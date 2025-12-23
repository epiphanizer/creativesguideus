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
    description: "Modular cue series we adapt for film, campaign, and event licensing—stream the anchor track anytime.",
    tags: ["Music", "Licensing", "Score"],
    href: "https://open.spotify.com/track/62hskoBw5Vl1LLZeR1oiBi"
  }
];

export function WorkSection() {
  return (
    <SectionShell id="work" labelledBy="work-title" innerClassName="cg-work">
      <SectionHeader
        id="work-title"
        eyebrow="Our Work"
        title="Selected work — 2025 highlights"
        description="Three recent engagements that show how we blend product, narrative, and score into one composed release."
      />

      <div className="cg-work__list" role="list">
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

      <Button as="a" href="#contact" className="cg-work__cta">
        Book a case review
      </Button>
    </SectionShell>
  );
}

export default WorkSection;
