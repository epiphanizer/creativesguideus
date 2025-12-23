import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const storyBeats = [
  "Act I — Mojave prologue: banned band sneaks back onto American soil, chasing a final broadcast gig.",
  "Act II — Desert motels and outlaw radio: the road manager barters favors while the crew broadcasts pirate gratitude sermons.",
  "Act III — Summit stage crash: a midnight ski-resort gala becomes the stage for a cathartic, consequences-heavy encore."
];

const thematicMotifs = [
  "Grief as spectacle vs. grief as communal ritual",
  "The economics of devotion in fan-led subcultures",
  "How sound engineering becomes a form of activism"
];

const materialSuite = [
  "Feature screenplay · June 2025 partner draft (112 pages)",
  "Lookbook + monochrome treatment deck",
  "Tonal score sketchbook anchored by the Gratitude release",
  "Limited series companion outline + festival strategy notes"
];

const collaboratorTargets = [
  "Producer partners with road-movie or music doc lineage",
  "Financiers comfortable with premium indie scale",
  "Festival strategists and impact campaign co-creators"
];

export default function BongTourPage() {
  return (
    <main className="cg-page">
      <SectionShell id="bong-tour" labelledBy="bong-tour-title" innerClassName="cg-bong-page">
        <SectionHeader
          id="bong-tour-title"
          eyebrow="Feature Screenplay"
          title="Bong Tour"
          description="A surreal road feature about devotion, outlaw broadcasting, and the economies that form around gratitude."
          actions={
            <div className="cg-bong-page__actions">
              <Button as="a" href="/#contact">
                Start a conversation
              </Button>
              <Button as="a" href="https://open.spotify.com/track/62hskoBw5Vl1LLZeR1oiBi" variant="ghost">
                Hear the anchor track
              </Button>
            </div>
          }
        />

        <div className="cg-bong-page__lede">
          <p>
            Bong Tour is our flagship screenwriting project—an 110-page feature that treats the road movie as a gratitude ritual.
            The script grew out of client launch patterns: how communities rally when a drop matters, and what happens when people try to
            recreate that feeling without the brand brief. The result is a desert-set odyssey where music, fandom, and mutual aid collide.
          </p>
          <p>
            We develop the screenplay alongside design and score so partners can feel the world instantly. Every draft ships with a
            monochrome deck, sonic sketches, and motion references. Gratitude—our latest release from the music practice—threads through
            the film and is ready for licensing out of the box.
          </p>
        </div>

        <div className="cg-bong-page__grid" aria-label="Story structure and development details">
          <section className="cg-bong-page__panel">
            <h2>Story spine</h2>
            <ul>
              {storyBeats.map((beat) => (
                <li key={beat}>{beat}</li>
              ))}
            </ul>
          </section>
          <section className="cg-bong-page__panel">
            <h2>Themes we explore</h2>
            <ul>
              {thematicMotifs.map((motif) => (
                <li key={motif}>{motif}</li>
              ))}
            </ul>
          </section>
          <section className="cg-bong-page__panel">
            <h2>Materials on hand</h2>
            <ul>
              {materialSuite.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="cg-bong-page__panel">
            <h2>Partners we’re meeting</h2>
            <ul>
              {collaboratorTargets.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="cg-bong-page__footer">
          <p>
            If you’d like the full deck, budget look, or a table read session, reach out and we’ll stage a working session—monochrome
            visuals, Gratitude stems, and the treatment are ready to go.
          </p>
          <Button as="a" href="/#contact" variant="secondary">
            Request the Bong Tour package
          </Button>
        </div>
      </SectionShell>
    </main>
  );
}
