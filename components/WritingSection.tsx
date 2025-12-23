import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const writingHeroCopy = [
  "Screenplays, treatments, and copy frameworks are the labs where we build tone before a launch ever hits the web.",
  "We keep an active slate—features, brand stories, and campaign scripts—so partners can plug into a voice that already carries momentum.",
  "Slate previews are invitation-only; Bong Tour now lives on its own surface for producers and financiers."
];

const writingHighlights = [
  "Pages, decks, and music cues develop together so every release feels authored",
  "Each draft ships with tonal essays, voice notes, and scene lift-outs teams can circulate",
  "We stay on through launch windows to guide rewrites and partner comms"
];

export function WritingSection() {
  return (
    <SectionShell id="writing" labelledBy="writing-title" innerClassName="cg-writing">
      <div className="cg-writing__hero">
        <SectionHeader
          id="writing-title"
          eyebrow="Screenwriting"
          title="We author worlds your launch can live in"
          description="Script, copy, and cadence plans grow alongside design and score so the release lands composed."
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 19l6.5-6.5" />
              <path d="M12 11l5-5a2.5 2.5 0 1 1 3.5 3.5l-5 5" />
              <path d="M4 19h5" />
            </svg>
          }
          iconLabel="Creative writing emblem"
        />
        <div className="cg-writing__hero-grid">
          <div className="cg-writing__primary">
            <div className="cg-writing__hero-copy">
              {writingHeroCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="cg-writing__note">
              Request the slate to hear table reads, review decks, and stage rewrites without opening new teams.
            </p>
            <div className="cg-writing__hero-actions">
              <Button as="a" href="#contact">
                Request writing slate
              </Button>
            </div>
          </div>
          <div className="cg-writing__secondary">
            <ul className="cg-writing__points">
              {writingHighlights.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
            <div className="cg-writing__bong">
              <span className="cg-writing__bong-label">In development</span>
              <a className="cg-writing__bong-link" href="/bong-tour">
                Bong Tour treatment <span aria-hidden="true">↗</span>
              </a>
              <p className="cg-writing__bong-note">
                Invitation-only slate surface with finance deck, cue list, and tone essays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
