import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  duration: "02:32",
  instrumentation: "Piano, analog synth, field recordings",
  project: "Lead single from our 2025 release slate"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

const releaseHighlights = [
  "Release slate spans piano-led scores, ambient beds, and narrative interludes ready to license",
  "Every drop ships with stems, instrumentals, alt mixes, and cue sheets for fast clearance",
  "We stay through the premiere window to tailor edits and keep delivery on tempo"
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="music-title"
          eyebrow="Music"
          title="Release-ready scores without the scramble"
          description="Gratitude is one of our small-batch releases—cleared for film, campaigns, and experiential sound."
        />
        <p>
          Pulsed piano, softened synth, and field recordings pace each release with intention. We publish on our own
          cadence, maintain the masters, and license directly so your team moves from brief to score without a scramble.
        </p>
        <ul className="cg-music__points">
          {releaseHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="cg-split__actions">
          <Button as="a" href="#contact">
            Request release catalog
          </Button>
          <Button as="a" href="https://open.spotify.com/track/62hskoBw5Vl1LLZeR1oiBi" variant="ghost">
            Stream Gratitude
          </Button>
        </div>
      </div>

      <div className="cg-split__body">
          <div className="cg-music__card">
            <div className="cg-music__card-header">
              <span className="cg-music__badge">Featured release</span>
            <h3 className="cg-music__title">Gratitude</h3>
            <p className="cg-music__subtitle">Live piano, analog synth tapestry, gentle percussion</p>
          </div>
          <dl className="cg-music__meta">
            <div>
              <dt>Duration</dt>
              <dd>{gratitudeMeta.duration}</dd>
            </div>
            <div>
              <dt>Instrumentation</dt>
              <dd>{gratitudeMeta.instrumentation}</dd>
            </div>
            <div>
              <dt>Project</dt>
              <dd>{gratitudeMeta.project}</dd>
            </div>
          </dl>
          <div className="cg-music__embed">
            <iframe
              title="Gratitude — Creatives Guide Us"
              src={gratitudeEmbedSrc}
              width="100%"
              height="320"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default MusicSection;
