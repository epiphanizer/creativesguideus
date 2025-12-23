import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const practiceHighlights = [
  {
    title: "Interface architecture",
    eyebrow: "Product",
    description: "Calm, editorial surfaces in grayscale so the release narrative leads every screen.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <rect x="6" y="8" width="20" height="16" rx="3" />
        <path d="M6 14h20" />
        <path d="M12 24V14" />
      </svg>
    )
  },
  {
    title: "Identity systems",
    eyebrow: "Brand",
    description: "Monochrome voice, restraint in motion, and type that feels inevitable across touchpoints.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <circle cx="11" cy="16" r="5" />
        <path d="M18 9h7v14h-7z" />
        <path d="M6 23h8" />
      </svg>
    )
  },
  {
    title: "Narrative stewardship",
    eyebrow: "Story",
    description: "Scripts, decks, and score cues shaped together so the launch arc lands composed, not chaotic.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <path d="M7 9h18v14H7z" />
        <path d="M11 13h10" />
        <path d="M11 17h6" />
        <path d="M17 21h4" />
      </svg>
    )
  }
];

const cadenceNotes = [
  {
    label: "Pulse 01",
    detail: "Immersion salon, launch intent map, and monochrome inspiration grid",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <circle cx="16" cy="16" r="9" />
        <path d="M16 7v5m0 8v5m9-9h-5m-8 0H7" />
      </svg>
    )
  },
  {
    label: "Pulse 02",
    detail: "System sketches, screenplay fragments, and iterative theme studies",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <rect x="7" y="9" width="18" height="14" rx="3" />
        <path d="M11 13h10M11 17h10" />
      </svg>
    )
  },
  {
    label: "Pulse 03",
    detail: "Interactive proofs, score stems, and composed launch orchestration",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <path d="M8 22h16" />
        <path d="M11 18 16 9l5 9" />
        <circle cx="16" cy="23" r="2" />
      </svg>
    )
  }
];

export function WebSection() {
  return (
    <SectionShell id="web" labelledBy="web-title" innerClassName="cg-practice">
      <div className="cg-split cg-practice__layout">
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

        <aside className="cg-practice__cadence" aria-label="Engagement cadence">
          <h3 className="cg-practice__cadence-title">Three pulses</h3>
          <ul className="cg-practice__cadence-list">
            {cadenceNotes.map((note) => (
              <li key={note.label} className="cg-practice__cadence-item">
                <span className="cg-practice__cadence-icon" aria-hidden="true">
                  {note.icon}
                </span>
                <div className="cg-practice__cadence-copy">
                  <span className="cg-practice__cadence-label">{note.label}</span>
                  <p>{note.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="cg-card-grid cg-practice__highlights" role="list">
        {practiceHighlights.map((highlight) => (
          <div key={highlight.title} role="listitem">
            <Card
              title={highlight.title}
              eyebrow={highlight.eyebrow}
              description={highlight.description}
              icon={highlight.icon}
              className="cg-practice__card"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export default WebSection;
