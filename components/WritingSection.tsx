import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const writingHeroCopy = [
  "Screenplays, treatments, and executive narratives turn complex vision into strategic clarity before the first release hits production.",
  "Our live slate spans film, brand manifestos, and campaign architectures so partners tap a voice already tuned for influence.",
  "Slate previews remain invitation-only; Bong Tour now operates as a dedicated hub for producers and financiers."
];

const writingHighlights = [
  "Scripts, decks, and sonic motifs evolve together so every release arrives authored and aligned",
  "Each draft includes stakeholder briefs, cultural references, and scene lift-outs ready for circulation",
  "We stay embedded through launch windows, guiding rewrites and executive communications"
];

export function WritingSection() {
  return (
    <SectionShell id="writing" labelledBy="writing-title" innerClassName="cg-writing">
      <div className="cg-writing__surface">
        <div className="cg-writing__layout cg-split">
          <div className="cg-writing__column cg-writing__column--primary">
            <SectionHeader
              id="writing-title"
              eyebrow="Writing / Story"
              title="Deliver narratives with cultural impact"
              description="We craft future-facing scripts, treatments, and copy systems that move markets and deepen loyalty."
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M4 19l6.5-6.5" />
                  <path d="M12 11l5-5a2.5 2.5 0 1 1 3.5 3.5l-5 5" />
                  <path d="M4 19h5" />
                </svg>
              }
              iconLabel="Creative writing emblem"
            />
            <div className="cg-writing__hero-copy">
              {writingHeroCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="cg-writing__note">
              Request the slate to access table reads, narrative prototypes, and rewrites that plug directly into your growth plan.
            </p>
            <div className="cg-writing__hero-actions">
              <Button as="a" href="#contact">
                Command the Narrative
              </Button>
            </div>
          </div>

          <aside className="cg-writing__column cg-writing__column--secondary" aria-label="Writing slate highlight">
            <div className="cg-writing__bong">
              <span className="cg-writing__bong-label">In development</span>
              <a className="cg-writing__bong-link" href="/bong-tour">
                Bong Tour treatment <span aria-hidden="true">↗</span>
              </a>
              <p className="cg-writing__bong-note">
                Invitation-only slate surface with finance deck, cue list, and tone essays.
              </p>
            </div>
            <ul className="cg-writing__points">
              {writingHighlights.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </SectionShell>
  );
}
