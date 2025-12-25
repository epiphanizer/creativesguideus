import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const practiceHighlights = [
  {
    title: "Platform architecture",
    eyebrow: "Software",
    description: "Resilient interfaces, service maps, and data flows engineered to evolve with your roadmap.",
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
    description: "Adaptive design languages and motion standards that amplify authority across every channel.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <circle cx="11" cy="16" r="5" />
        <path d="M18 9h7v14h-7z" />
        <path d="M6 23h8" />
      </svg>
    )
  },
  {
    title: "Narrative operations",
    eyebrow: "Story",
    description: "Scripts, release decks, and sonic cues that keep product, marketing, and leadership in the same storyline.",
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
    detail: "Signal safaris turn market noise into clarity, playlists, and quick-win interface sketches.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <circle cx="16" cy="16" r="9" />
        <path d="M16 7v5m0 8v5m9-9h-5m-8 0H7" />
      </svg>
    )
  },
  {
    label: "Pulse 02",
    detail: "Designers, writers, and composers jam in one sprint so the story and product vibe lock before launch.",
    icon: (
      <svg viewBox="0 0 32 32" role="presentation">
        <rect x="7" y="9" width="18" height="14" rx="3" />
        <path d="M11 13h10M11 17h10" />
      </svg>
    )
  },
  {
    label: "Pulse 03",
    detail: "Live sandboxes, enablement hype kits, and instrumentation rehearsals make launch day feel like a victory lap.",
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
            eyebrow="Software / Web"
            title="Engineer resilient digital ecosystems"
            description="We design and deploy future-ready platforms where product utility, brand authority, and story momentum move as one."
            icon={
              <svg viewBox="0 0 24 24">
                <rect x="3.5" y="6" width="17" height="12" rx="2" />
                <path d="M3.5 11.5h17" />
                <path d="M9 18V11.5" />
              </svg>
            }
            iconLabel="Creative interface emblem"
          />
          <p>
            Software architects, brand directors, and composers share the same backlog here. We harden infrastructure while shaping
            the emotional cues that signal confidence to your market. No silos, no retrofitting.
          </p>
          <p>
            Decision-makers see traction fast through living prototypes, instrumentation, and narrative rehearsal decks. Every
            milestone pushes the release toward measurable adoption.
          </p>
          <div className="cg-split__actions">
            <Button as="a" href="#contact">
              Forge Your Platform
            </Button>
            <Button as="a" href="#work" variant="ghost">
              Review the Outcomes
            </Button>
          </div>
        </div>

        <aside className="cg-practice__cadence" aria-label="Engagement cadence">
          <h3 className="cg-practice__cadence-title">Three playful pulses</h3>
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
