import { ProcessStrip } from "@/components/ProcessStrip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const studioValues = [
  {
    title: "One bespoke engine",
    detail: "Senior software, scoring, and story leads build in one cadence so every output reinforces the same ambition."
  },
  {
    title: "Future in production",
    detail: "We prototype resilient systems early—infra diagrams, sonic sketches, cultural playbooks—so leaders can scale with confidence."
  },
  {
    title: "Momentum as a metric",
    detail: "Weekly proofs and data-backed decisions keep growth visible while protecting creative integrity."
  }
];

const collaborationNotes = [
  "Typical engagements span 6–12 weeks with embedded strategy and build crews",
  "Retainers include roadmap stewardship, release analytics, and score expansions",
  "Operating across NYC, LA, and remote-first teams with bilingual technical/creative facilitation"
];

export function AboutSection() {
  return (
    <SectionShell id="about" labelledBy="about-title">
      <div className="cg-about">
        <SectionHeader
          id="about-title"
          eyebrow="About / Process"
          title="Creatives Guide Us is the bespoke engine for digital evolution"
          description="Co-founded by a software architect and composer-writer duo, we fuse code, composition, and story into one future-ready practice."
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="8" cy="12" r="3" />
              <path d="M12 6h8v12h-8z" />
              <path d="M4 18h4" />
            </svg>
          }
          iconLabel="Creative studio emblem"
        />

        <div className="cg-about__grid">
          <div className="cg-about__story">
            <p>
              We partner with founders, cultural leaders, and product teams to architect tomorrow’s platforms—software that scales,
              scores that command attention, and narratives that claim new territory. Discovery labs translate vision into actionable roadmaps.
            </p>
            <p>
              Expect technical clarity, executive-level storytelling, and sonic direction moving in lockstep. Every sprint blends
              infrastructure decisions with emotional resonance so launches feel inevitable, not improvised.
            </p>
            <ProcessStrip className="cg-about__process" />
          </div>

          <aside className="cg-about__side">
            <div className="cg-about__values" aria-label="Studio values">
              {studioValues.map((value) => (
                <article key={value.title} className="cg-about__value">
                  <h3>{value.title}</h3>
                  <p>{value.detail}</p>
                </article>
              ))}
            </div>

            <div className="cg-about__collaboration" aria-label="Collaboration notes">
              <h3>How we collaborate</h3>
              <ul>
                {collaborationNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </SectionShell>
  );
}
