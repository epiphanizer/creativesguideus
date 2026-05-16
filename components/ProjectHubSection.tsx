import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

type ProjectHub = {
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  bullets: string[];
  actions: Array<{
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "ghost";
  }>;
  open?: boolean;
};

const projectHubs: ProjectHub[] = [
  {
    eyebrow: "Release world",
    title: "Walls & Devine",
    summary: "Volume 1 now lives in a dedicated release hub with song journals, artwork strategy, and rollout notes.",
    description:
      "This is the clearest entry point into the record: one place for the 9-grid cover system, per-song notes, release planning, and the album's relationship to Bong Tour.",
    bullets: [
      "Volume 1 rollout, cover strategy, and release standards",
      "Journal entries and technical notes for every song",
      "Direct links from the first three songs into Bong Tour cue moments"
    ],
    actions: [
      { label: "Open Walls & Devine", href: "/walls-devine" },
      { label: "Read post kit", href: "/walls-devine#walls-devine-post-kit", variant: "ghost" }
    ],
    open: true
  },
  {
    eyebrow: "Screenplay hub",
    title: "Bong Tour",
    summary: "Feature screenplay surface with poster art, cast energy, tone comps, storyboard beats, and score sketches.",
    description:
      "Bong Tour is no longer buried under a generic writing category. It stands on its own as a financing and collaboration surface with direct score crossover from Walls & Devine.",
    bullets: [
      "Dedicated pitch page for producers, financiers, and collaborators",
      "Score-sketch section featuring Joint Queen, Stash Daddy, and Space Cruiser",
      "Story, tone, and packaging language in one focused deck"
    ],
    actions: [
      { label: "Open Bong Tour", href: "/bong-tour" },
      { label: "Jump to score sketches", href: "/bong-tour#score-sketches", variant: "ghost" }
    ]
  }
];

export function ProjectHubSection() {
  return (
    <SectionShell id="projects" labelledBy="projects-title" innerClassName="cg-project-hub">
      <div className="cg-project-hub__lead">
        <SectionHeader
          id="projects-title"
          eyebrow="World map"
          title="Jump into the live worlds"
          description="The homepage now opens through the active release worlds instead of splitting disciplines into generic claims. Pick the chamber you want and go straight in."
        />
      </div>

      <div className="cg-project-hub__accordion" role="list" aria-label="Current project hubs">
        {projectHubs.map((hub) => (
          <details key={hub.title} className="cg-project-hub__item" open={hub.open}>
            <summary className="cg-project-hub__summary">
              <span className="cg-project-hub__eyebrow">{hub.eyebrow}</span>
              <div className="cg-project-hub__summary-copy">
                <h3>{hub.title}</h3>
                <p>{hub.summary}</p>
              </div>
            </summary>

            <div className="cg-project-hub__panel">
              <p className="cg-project-hub__description">{hub.description}</p>
              <ul className="cg-project-hub__bullets">
                {hub.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="cg-project-hub__actions">
                {hub.actions.map((action) => (
                  <Button key={action.label} as="a" href={action.href} variant={action.variant ?? "primary"}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

export default ProjectHubSection;
