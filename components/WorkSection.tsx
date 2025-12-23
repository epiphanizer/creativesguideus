"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const highlightProjects = [
  {
    title: "World Cup Dreams Foundation",
    eyebrow: "Ski fundraising platform",
    description:
      "World Cup Dreams Foundation is an athlete-first WordPress experience tailored to guide athletes and donors toward one mission: fund elite snowsport talent.",
    tags: ["Nonprofit", "Donations", "Grant Programs", "Athlete Support", "Community"],
    caseHref: "/work/world-cup-dreams",
    siteHref: "https://www.worldcupdreams.org",
    siteLabel: "Visit worldcupdreams.org",
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
    description: "Community-owned gratitude economy with on-chain rituals, editorial UX, and an innovation-led launch kit.",
    tags: ["Product", "Brand", "Web3"],
    caseHref: "/work/appreesh",
    siteHref: "https://appreesh.org",
    siteLabel: "Visit appreesh.org",
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
    description: "iOS scripture companion pairing daily prompts with original rehearsal cues for gospel choirs.",
    tags: ["Product", "Music", "Story"],
    caseHref: "/work/lead-me-guide-me",
    siteHref: "https://leadmeguideme.org",
    siteLabel: "Visit leadmeguideme.org",
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
  const router = useRouter();

  return (
    <SectionShell id="work" labelledBy="work-title" innerClassName="cg-work">
      <div className="cg-split cg-work__layout">
        <div className="cg-split__lede">
          <SectionHeader
            id="work-title"
            eyebrow="Integrated outcomes"
            title="Outcomes in motion"
            description="Cross-disciplinary engagements that launch next-generation platforms, scores, and stories in one trajectory."
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M4.5 15.5c2.5 0 4.5-2 6-5 1.5 3 3.5 5 6 5" />
                <path d="M6 9c1.2-2 3-4 6-4 3 0 4.8 2 6 4" />
                <path d="M4.5 15.5l3.5-1.5L6 20l4-3 1.5 3.5" />
              </svg>
            }
            iconLabel="Creative release emblem"
          />
          <p>
            We orchestrate software, sonic, and narrative teams so audiences, investors, and internal stakeholders witness the same
            commanding debut. Every move is architected for momentum, not maintenance.
          </p>
          <p>
            Weekly proofs, instrumentation, and cultural playbooks keep leadership aligned while we handle the build. Your teams stay
            focused on scaling impact—not stitching silos together.
          </p>
          <div className="cg-split__actions">
            <Button as="a" href="#contact">
              Schedule Your Blueprint
            </Button>
          </div>
        </div>

        <aside className="cg-work__aside" aria-label="Launch principles">
          <p className="cg-work__summary-lede">
            High-resonance launches merge design, story, and sound into one operating system so internal teams project the same
            authority as your audience perceives.
          </p>
          <ul className="cg-work__summary">
            <li>Launch playbooks covering content, interaction, score, and activation queues</li>
            <li>Analytics-ready builds hardened for growth long after handoff</li>
            <li>Executive voice kits, cue libraries, and enablement decks delivered day one</li>
            <li>High-resonance rituals—screenings, retros, signal reviews—that keep decisions in sync</li>
          </ul>
          <p className="cg-work__summary-footer">
            We stage internal premieres, evolve score stems, and optimize data loops post-launch so momentum compounds.
          </p>
        </aside>
      </div>

      <div className="cg-card-grid cg-work__grid">
        {highlightProjects.map((project) => (
          <div key={project.title}>
            <Card
              title={project.title}
              eyebrow={project.eyebrow}
              description={project.description}
              tags={project.tags}
              icon={project.icon}
              className="cg-work__card"
              onClick={() => router.push(project.caseHref)}
              ariaLabel={`Open case study for ${project.title}`}
              footer={
                project.siteHref ? (
                  <a
                    className="cg-work__card-link"
                    href={project.siteHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.stopPropagation();
                      }
                    }}
                  >
                    {project.siteLabel ?? `Visit ${project.title}`} <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : undefined
              }
            />
          </div>
        ))}
        <div className="cg-work__note">Every engagement fuses strategy, build, and sound into one future-ready engine.</div>
      </div>
    </SectionShell>
  );
}

export default WorkSection;
