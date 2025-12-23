import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  instrumentation: "Expanded piano, analog synthesis, percussive design",
  project: "Future-ready post-rock release"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

const releaseHighlights = [
  "Catalog spans cinematic piano, modular textures, and narrative interludes tuned for instant sync",
  "Every cue delivers stems, alternates, and score strategy notes for rapid placement",
  "We steward premieres with live edits, pacing guidance, and delivery kits that keep momentum high"
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="music-title"
          eyebrow="Music / Score"
          title="Command audiences with sonic authority"
          description="Gratitude showcases how we craft emotionally precise scores—engineered for film, product launches, and experiential worlds."
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M15 5v10.5a2.5 2.5 0 1 1-1.5-2.3V7.5" />
              <circle cx="9" cy="16.5" r="2.5" />
            </svg>
          }
          iconLabel="Creative score emblem"
        />
        <p>
          Recorded across analog and digital rigs, the cue threads expansive piano motifs with modular synthesis and
          percussive design. We retain masters, manage licensing, and tailor every deployment so teams move from concept
          to placement without friction.
        </p>
        <ul className="cg-music__points">
          {releaseHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="cg-split__actions">
          <Button as="a" href="#contact">
            Score Your Launch
          </Button>
        </div>
      </div>

      <div className="cg-split__body">
        <div className="cg-music__card">
          <div className="cg-music__card-header">
            <span className="cg-music__badge">Featured release</span>
            <h3 className="cg-music__title">Gratitude</h3>
          </div>
          <dl className="cg-music__meta">
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
              height="280"
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
