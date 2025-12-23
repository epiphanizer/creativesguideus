import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const highlightProjects = [
  {
    title: "World Cup Dreams 2025",
    eyebrow: "Sports docu-series",
    description: "Digital storytelling hub, weekly vignette cadence, and broadcast-ready score suite for NBC Sports.",
    tags: ["Brand", "Web", "Score"]
  },
  {
    title: "Appreesh.org",
    eyebrow: "Web3 gratitude economy",
    description: "On-chain gifting platform built with calm UX, tokenized rituals, and agentic release tooling.",
    tags: ["Web3", "Product", "Systems"]
  },
  {
    title: "Modern Rituals Studio",
    eyebrow: "Cultural collective",
    description: "WordPress-to-React migration with monochrome identity, content ops, and adaptive score palette.",
    tags: ["Identity", "React", "Music"]
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
