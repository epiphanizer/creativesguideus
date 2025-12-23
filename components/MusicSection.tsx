import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  duration: "02:32",
  instrumentation: "Piano, modular synth, field recordings",
  project: "Theme study for a short-form doc series"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

const cueHighlights = [
  "Modular cue adapts to films, campaigns, and experiential soundtracks in hours",
  "Deliverable suite ships with stems, notation, and edit-ready mixes",
  "We stay through launch to sculpt instrumentation alongside your team"
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="music-title"
          eyebrow="Music"
          title="Score licensing without friction"
          description="Gratitude is our modular cue suite—built to adapt, licensed to stay calm."
        />
        <p>
          Pulsed piano, softened synth, and field recordings pace each release with intention. We iterate live with
          directors and producers, while stems, mixes, and notation stay ready for every deliverable.
        </p>
        <ul className="cg-music__points">
          {cueHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="cg-split__actions">
          <Button as="a" href="#contact">
            Request stems or licensing
          </Button>
          <Button as="a" href="https://open.spotify.com/track/62hskoBw5Vl1LLZeR1oiBi" variant="ghost">
            Stream Gratitude
          </Button>
        </div>
      </div>

      <div className="cg-split__body">
        <div className="cg-music__card">
          <div className="cg-music__card-header">
            <span className="cg-music__badge">Featured cue</span>
            <h3 className="cg-music__title">Gratitude</h3>
            <p className="cg-music__subtitle">Live piano, modular tapestry, gentle percussion</p>
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
