import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { PlayerStub } from "@/components/music/PlayerStub";

const gratitudeMeta = {
  duration: "02:32",
  instrumentation: "Piano, modular synth, field recordings",
  project: "Theme study for a short-form doc series"
};

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music">
      <SectionHeader
        id="music-title"
        eyebrow="Music"
        title="Gratitude — a theme for quiet revolutions"
        description="We release one evolving cue at a time so collaborators can feel the craft, not just the catalog."
      />

      <div className="cg-music__feature">
        <div className="cg-music__story">
          <p>
            Gratitude began as a meditation on breathing room—pulsed piano, softened synth, and found sound layered to
            pace narratives that unfold gently. We iterate with directors in shared sessions, adjusting tone before
            adding color.
          </p>
          <p>
            Bring us into films, brand anthems, or experiential work that needs a score anchored in restraint. We stay on
            to supervise delivery, provide stems, and adapt the theme as your story grows.
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
          <PlayerStub title="Gratitude" duration={gratitudeMeta.duration} status="paused" />
          <Button as="a" href="#contact" variant="secondary" className="cg-music__cta">
            Request stems or licensing
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

export default MusicSection;
