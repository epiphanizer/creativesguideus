import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const writingPhilosophy = [
  "Screenplays are our long-form labs. We architect narrative, tone, and release cadence in script form before pixels or cues ship.",
  "Designers and composers stay in the room for draft reviews, so the voice, score, and pacing move together.",
  "Every revision leaves the studio with a deck, tonal essays, and audio sketches that help partners step into the world fast."
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
      <SectionHeader
        id="writing-title"
        eyebrow="Screenwriting"
        title="We write worlds the launch can live in"
        description="Script, score, and visual language evolve in one monochrome room so every release feels authored."
      />

      <div className="cg-writing__lede">
        {writingPhilosophy.map((statement) => (
          <p key={statement}>{statement}</p>
        ))}
        <p className="cg-writing__note">Currently circulating: Bong Tour, a surreal road feature looking for its producing home.</p>
      </div>

      <article className="cg-bong" aria-labelledby="bong-tour-heading">
        <div className="cg-bong__story">
          <Tag className="cg-bong__tag">Feature screenplay · June 2025 partner draft</Tag>
          <h3 id="bong-tour-heading">Bong Tour</h3>
          <p className="cg-bong__logline">
            A washed-up tour manager must shepherd a banned Korean psych band through the Southwest for one impossible encore.
          </p>
          <p>
            The screenplay travels with dev diaries, lookbook spreads, and modular score sketches so financiers, directors, and brand partners can audition the world in minutes.
          </p>
          <div className="cg-bong__actions">
            <Button as="a" href="/bong-tour" variant="ghost">
              Explore Bong Tour
            </Button>
            <Button as="a" href="#contact" variant="secondary" className="cg-bong__cta">
              Request the deck
            </Button>
          </div>
        </div>

        <aside className="cg-bong__details" aria-label="Bong Tour offerings and partnerships">
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
            The dedicated page holds extended synopsis, tone references, and licensing pathways for the Gratitude cue.
          </p>
        </aside>
      </article>
    </SectionShell>
  );
}
