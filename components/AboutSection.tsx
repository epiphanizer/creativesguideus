import { ProcessStrip } from "@/components/ProcessStrip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const studioValues = [
  {
    title: "Boutique on purpose",
    detail: "Two-person core with a vetted roster of collaborators—keeps every deliverable personal."
  },
  {
    title: "Format agnostic",
    detail: "Scripts, scores, and sites share a common editorial brain so narratives stay in sync."
  },
  {
    title: "Proof-first",
    detail: "Each engagement ships artifacts early: wire stories, demo cues, or copyboards before full production."
  }
];

const collaborationNotes = [
  "Preferred engagements run 6–12 weeks with weekly working sessions",
  "Retainer clients receive quarterly narrative tune-ups and sonic refresh drops",
  "Available for partnerships across NYC, LA, and remote-friendly time zones"
];

export function AboutSection() {
  return (
    <SectionShell id="about" labelledBy="about-title">
      <div className="cg-about">
        <SectionHeader
          id="about-title"
          eyebrow="About / Process"
          title="Creatives Guide Us is a hybrid studio for narrative systems"
          description="Founded by a writer/composer and an interactive director to bridge story, sound, and interface with one voice."
        />

        <div className="cg-about__grid">
          <div className="cg-about__story">
            <p>
              We help founders, filmmakers, and curators translate messy ideas into disciplined releases. Projects begin with
              interviews and research sprints, then move into layered delivery where copy, score, and visuals evolve in tandem.
            </p>
            <p>
              Expect transparent timelines, annotated handoffs, and an editorial partner who obsesses over cadence as much as visuals.
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
