import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const practiceHighlights = [
  {
    title: "Interface architecture",
    eyebrow: "Product",
    description: "Calm, editorial surfaces in grayscale so the release narrative leads every screen."
  },
  {
    title: "Identity systems",
    eyebrow: "Brand",
    description: "Monochrome voice, restraint in motion, and type that feels inevitable across touchpoints."
  },
  {
    title: "Narrative stewardship",
    eyebrow: "Story",
    description: "Scripts, decks, and score cues shaped together so the launch arc lands composed, not chaotic."
  }
];

const cadenceNotes = [
  {
    label: "Pulse 01",
    detail: "Immersion salon, launch intent map, and monochrome inspiration grid"
  },
  {
    label: "Pulse 02",
    detail: "System sketches, screenplay fragments, and iterative theme studies"
  },
  {
    label: "Pulse 03",
    detail: "Interactive proofs, score stems, and composed launch orchestration"
  }
];

export function WebSection() {
  return (
    <SectionShell id="web" labelledBy="web-title" innerClassName="cg-practice cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="web-title"
          eyebrow="Web & Brand"
          title="Architect calm product releases"
          description="Sites, systems, and scripts that land like a premiere—not a fire drill."
        />
        <p>
          We choreograph UX, tone, and score in one monochrome room so every touchpoint arrives with the same composed energy.
          Creative, engineering, and comms stay inside one cadence, never a frantic handoff.
        </p>
        <p>
          Weekly immersion pulses keep decisions aligned, while every Friday ships an interactive proof so stakeholders feel the
          next move before it goes live.
        </p>
        <div className="cg-split__actions">
          <Button as="a" href="#contact">
            Schedule a scope call
          </Button>
          <Button as="a" href="#work" variant="ghost">
            Review recent systems
          </Button>
        </div>
      </div>

      <div className="cg-split__body cg-practice__body">
        <div className="cg-card-grid cg-practice__highlights" role="list">
          {practiceHighlights.map((highlight) => (
            <div key={highlight.title} role="listitem">
              <Card
                title={highlight.title}
                eyebrow={highlight.eyebrow}
                description={highlight.description}
                className="cg-practice__card"
              />
            </div>
          ))}
        </div>

        <aside className="cg-practice__cadence" aria-label="Engagement cadence">
          <h3 className="cg-practice__cadence-title">Three pulses</h3>
          <ul className="cg-practice__cadence-list">
            {cadenceNotes.map((note) => (
              <li key={note.label} className="cg-practice__cadence-item">
                <span className="cg-practice__cadence-label">{note.label}</span>
                <p>{note.detail}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </SectionShell>
  );
}

export default WebSection;
