import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const gratitudeMeta = {
  instrumentation: "Expanded piano, analog synthesis, guitar collage, percussive design",
  project: "Walls & Devine: Volume 1"
};

const gratitudeEmbedSrc = "https://open.spotify.com/embed/track/62hskoBw5Vl1LLZeR1oiBi?utm_source=generator";

const releaseHighlights = [
  "Walls & Devine now has a dedicated release hub with rollout logic, cover strategy, and song-by-song journals",
  "The first three songs cross into Bong Tour, making the music section a live bridge between record and screenplay",
  "Each song entry can keep growing through technical notes and journal logs without cluttering the front page"
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music cg-split">
      <div className="cg-split__lede">
        <SectionHeader
          id="music-title"
          eyebrow="Music / Release"
          title="Walls & Devine is the music front door"
          description="Volume 1 now carries the music story: release system, song journals, technical notes, and direct crossover into Bong Tour."
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M15 5v10.5a2.5 2.5 0 1 1-1.5-2.3V7.5" />
              <circle cx="9" cy="16.5" r="2.5" />
            </svg>
          }
          iconLabel="Creative score emblem"
        />
        <p>
          The homepage no longer tries to explain music as a generic capability. It points straight to the record that is
          already alive, with the context needed for listeners, collaborators, and future agents to understand how the world is built.
        </p>
        <ul className="cg-music__points">
          {releaseHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="cg-split__actions">
          <Button as="a" href="/walls-devine">
            Enter Volume 1
          </Button>
          <Button as="a" href="/walls-devine#walls-devine-post-kit" variant="ghost">
            Song Posts + Journals
          </Button>
        </div>
      </div>

      <div className="cg-split__body">
        <div className="cg-music__card">
          <div className="cg-music__card-header">
            <span className="cg-music__badge">Featured release</span>
            <h3 className="cg-music__title">Walls &amp; Devine: Volume 1</h3>
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
          <p className="cg-music__subtitle">
            Start with Gratitude below, then move into the full release page for the rollout system, song journals, and cue cross-links.
          </p>
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
