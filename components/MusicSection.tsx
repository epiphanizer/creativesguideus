import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  duration: "02:32",
  instrumentation: "Piano, modular synth, field recordings",
  project: "Theme study for a short-form doc series"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music">
      <SectionHeader
        id="music-title"
        eyebrow="Music"
        title="Gratitude — one cue, many releases"
        description="A single evolving cue that lets films, campaigns, and experiences breathe."
      />

      <div className="cg-music__feature">
        <div className="cg-music__story">
          <p>
            Pulsed piano, softened synth, and found sound pace each release with intention. We iterate live with
            directors, keep stems ready, and stay through delivery so your launch stays composed.
          </p>
        </div>

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
          <Button as="a" href="#contact" variant="secondary" className="cg-music__cta">
            Request stems or licensing
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

export default MusicSection;
