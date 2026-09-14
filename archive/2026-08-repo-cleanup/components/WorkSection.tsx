"use client";

import workModule from "@/data/work/module.json";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { seanhallsWorkHref } from "@/lib/studio-links";

const iconBySlug = {
  "world-cup-dreams": (
    <svg viewBox="0 0 32 32" role="presentation">
      <path d="M6 23 16 9l10 14" />
      <path d="M6 23h20" />
    </svg>
  ),
  appreesh: (
    <svg viewBox="0 0 32 32" role="presentation">
      <path d="M9.5 12.5a3.5 3.5 0 1 1 5 5L16 19l1.5-1.5a3.5 3.5 0 1 1 5-5" />
      <path d="M8 20.5 16 24l8-3.5" />
    </svg>
  ),
  "lead-me-guide-me": (
    <svg viewBox="0 0 32 32" role="presentation">
      <path d="M9 7h14v18H9z" />
      <path d="M9 12h14" />
      <path d="M16 12v13" />
      <path d="M13 10h6" />
    </svg>
  )
} as const;

const highlightProjects = workModule.studies
  .filter((study) => Boolean(study.siteHref))
  .slice(0, 3)
  .map((study) => ({
    title: study.title,
    eyebrow: study.eyebrow,
    description: study.description,
    tags: study.tags,
    siteHref: study.siteHref,
    siteLabel: study.siteLabel,
    icon: iconBySlug[study.slug as keyof typeof iconBySlug]
  }));

const launchPrinciples = [
  {
    title: "Tempo blueprints",
    detail: "Product, narrative, and score run one shared cadence, ready for investors and teams alike.",
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path d="M4 17.5h16" />
        <path d="M4 12h10" />
        <path d="M4 6.5h6" />
      </svg>
    )
  },
  {
    title: "Proof sprints",
    detail: "Each cycle ships a shareable signal—live states, narrative cuts, and performance telemetry.",
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path d="M4 18 10 6l4 8 6-5" />
        <path d="M4 18h16" />
      </svg>
    )
  },
  {
    title: "Steady stewardship",
    detail: "After lift-off we stay embedded, tuning cues, dashboards, and handoffs so clarity compounds.",
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path d="M4 5h16v14H4z" />
        <path d="M9 9h6" />
        <path d="M9 12h6" />
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
            eyebrow="Selected work"
            title="Portfolio proof lives quietly on Sean Halls"
            description="CGU keeps the release worlds out front. Published portfolio proof sits on Sean Halls when someone asks for the broader build record."
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
            The public CGU surface should not split attention with a separate proof archive. When portfolio context matters, it should route
            outward quietly instead of competing with the live rooms.
          </p>
          <p>
            The shared module still preserves enough signal to syndicate selected projects elsewhere without turning this site into a case-study library.
          </p>
          <div className="cg-split__actions">
            <Button as="a" href={seanhallsWorkHref} target="_blank" rel="noreferrer">
              Open Selected Work
            </Button>
          </div>
        </div>

        <aside className="cg-work__aside" aria-label="Launch principles">
          <p className="cg-work__summary-lede">
            Launches land when the narrative, the build, and the score advance together. We choreograph that momentum and keep it in
            motion.
          </p>
          <ul className="cg-work__summary">
            {launchPrinciples.map((principle) => (
              <li key={principle.title} className="cg-work__summary-item">
                <span className="cg-work__summary-icon">{principle.icon}</span>
                <span className="cg-work__summary-text">
                  <strong>{principle.title}</strong>
                  <span>{principle.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="cg-work__summary-footer">
            We stay embedded post-launch, refining telemetry, evolving cues, and protecting the momentum we start together.
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
