import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const writingHeroCopy = [
  "Screenplays, treatments, and copy frameworks are the labs where we build tone before a launch ever hits the web.",
  "We keep an active slate—features, brand stories, and campaign scripts—so partners can plug into a voice that already carries momentum."
];

const writingHighlights = [
  "Pages, decks, and music cues develop together so every release feels authored",
  "Each draft ships with tonal essays, voice notes, and scene lift-outs teams can circulate",
  "We stay on through launch windows to guide rewrites and partner comms"
];

const offerings = [
  "Feature screenplay · June 2025 partner draft",
  "Lookbook, tonal score palette, and mood essays",
  "Festival rollout materials + companion limited-series treatment"
];

const partnerships = [
  "Character-first producers",
  "Art-house aligned financiers",
  "Festival and co-production strategists"
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
        />
        <div className="cg-writing__hero-copy">
          {writingHeroCopy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="cg-writing__points">
          {writingHighlights.map((statement) => (
            <li key={statement}>{statement}</li>
          ))}
        </ul>
        <p className="cg-writing__note">Currently circulating: Bong Tour, a surreal road feature seeking its producing partner.</p>
        <div className="cg-writing__hero-actions">
          <Button as="a" href="#contact">
            Request writing slate
          </Button>
          <Button as="a" href="/bong-tour" variant="ghost">
            Explore Bong Tour
          </Button>
        </div>
      </div>

      <article className="cg-writing__feature cg-bong" aria-labelledby="bong-tour-heading">
        <div className="cg-bong__story">
          <Tag className="cg-bong__tag">Feature screenplay · June 2025 partner draft</Tag>
          <h3 id="bong-tour-heading">Bong Tour</h3>
          <p className="cg-bong__logline">
            A washed-up tour manager must shepherd a banned Korean psych band through the Southwest for one impossible encore.
          </p>
          <p>
            The screenplay travels with dev diaries, lookbook spreads, and score sketches so financiers, directors, and partners can audition the world in minutes.
          </p>
        </div>

        <aside className="cg-bong__details" aria-label="Bong Tour deliverables and collaborators">
          <div className="cg-bong__panel">
            <h3>What ships with the draft</h3>
            <ul>
              {offerings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="cg-bong__panel">
            <h3>Ideal collaborators</h3>
            <ul>
              {partnerships.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="cg-bong__note">
            The dedicated page keeps extended synopsis, tone references, and licensing pathways for the Gratitude release.
          </p>
        </aside>
      </article>
    </SectionShell>
  );
}
