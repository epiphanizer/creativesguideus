import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  duration: "02:32",
  instrumentation: "Felt piano, tape loops, room tone",
  project: "Standalone release crafted for reflective launch opens"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

const releaseHighlights = [
  "Catalog spans felt piano miniatures, analog drones, and narrative interludes ready to license",
  "Each cue ships with stems, instrumentals, alt mixes, and cue sheets for fast clearance",
  "We stay through the premiere window to tailor edits, pacing, and delivery kits"
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="music-title"
          eyebrow="Music"
          title="Release-ready scores without the scramble"
          description="Gratitude is our felt piano motif—tracked in a single take and cleared for film, campaigns, and experiential rooms."
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M15 5v10.5a2.5 2.5 0 1 1-1.5-2.3V7.5" />
              <circle cx="9" cy="16.5" r="2.5" />
            </svg>
          }
          iconLabel="Creative score emblem"
          badge="Creative!!!"
        />
        <p>
          Recorded late-night to quarter-inch tape, the cue layers quiet piano patterns, tape loops, and captured room
          tone. We release on our own cadence, maintain the masters, and license directly so your team moves from brief
          to score without a scramble.
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
            Listen to Gratitude
          </Button>
        </div>
      </div>

      <div className="cg-split__body">
          <div className="cg-music__card">
            <div className="cg-music__card-header">
              <span className="cg-music__badge">Featured release</span>
            <h3 className="cg-music__title">Gratitude</h3>
            <p className="cg-music__subtitle">Felt piano, tape loops, room tone</p>
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
