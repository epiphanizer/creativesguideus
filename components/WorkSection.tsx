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
            Projects stop stalling when strategy, product, and performance share one tempo. We embed with leadership, translate the
            vision, and ship proof that momentum is real.
          </p>
          <p>
            Every sprint braids code, composition, and narrative so investors, internal teams, and your audience feel the same story—clarity
            in market, culture, and product all at once.
          </p>
          <div className="cg-split__actions">
            <Button as="a" href="#contact">
              Schedule Your Blueprint
            </Button>
          </div>
        </div>

        <aside className="cg-work__aside" aria-label="Launch principles">
          <div className="cg-work__summary-visual" aria-hidden="true">
            <span>Signal → Launch</span>
            <svg viewBox="0 0 160 120" role="presentation">
              <defs>
                <linearGradient id="workPulse" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#7f7bff" stopOpacity="0.18" />
                  <stop offset="45%" stopColor="#39ff14" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path d="M8 92L34 68l22 18 30-54 18 32 24-14 24 30" fill="none" stroke="url(#workPulse)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="34" cy="68" r="6" fill="#39ff14" opacity="0.6" />
              <circle cx="84" cy="56" r="6" fill="#ff00ff" opacity="0.6" />
              <circle cx="134" cy="80" r="6" fill="#7f7bff" opacity="0.6" />
            </svg>
          </div>
          <p className="cg-work__summary-lede">
            High-resonance launches let teams and markets feel the same move—signal captured, systems composed, story amplified.
          </p>
          <ul className="cg-work__summary">
            <li>Launch playbooks choreographing product states, narrative beats, and score cues.</li>
            <li>Growth-ready platforms with telemetry, governance, and automation wired in.</li>
            <li>Voice kits, cue libraries, and creative assets engineered for every stakeholder.</li>
            <li>Signal reviews, retros, and premiere rituals that keep leadership in tempo.</li>
          </ul>
          <p className="cg-work__summary-footer">
            After launch we stay on deck—optimizing data loops, evolving score stems, and fine-tuning culture so clarity keeps compounding.
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
