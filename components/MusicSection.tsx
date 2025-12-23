import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import CueList, { Cue } from "@/components/music/CueList";
import { PlayerStub } from "@/components/music/PlayerStub";

const cueData: Cue[] = [
  {
    title: "North River",
    duration: "02:11",
    mood: "Glassine nocturne",
    instrumentation: "Piano, modular synth, bowed vibraphone",
    project: "Documentary short"
  },
  {
    title: "Signal Bloom",
    duration: "01:34",
    mood: "Slow resolve",
    instrumentation: "Analog pads, processed guitar",
    project: "Brand anthem"
  },
  {
    title: "Afterlight",
    duration: "00:58",
    mood: "Minimal tension",
    instrumentation: "Pulsed percussion, felt piano",
    project: "Narrative podcast"
  }
];

export function MusicSection() {
  return (
    <SectionShell id="music" labelledBy="music-title" innerClassName="cg-music">
      <SectionHeader
        id="music-title"
        eyebrow="Music"
        title="Music for film & other projects"
        description="Cue design, thematic composition, and supervision support shaped like a minimalist liner note."
      />

      <div className="cg-music__layout">
        <div className="cg-music__statement">
          <p>
            Scores should land like architecture: balanced, intentional, aware of the space. We sketch,
            iterate, and refine in grayscale so the client hears clarity before color.
          </p>
          <p>
            Services include film scoring, theme composition, sound design, and music supervision support
            for teams who need a trusted creative partner.
          </p>
        </div>

        <CueList cues={cueData} />

        <div className="cg-music__players">
          <PlayerStub title="Glasshouse Demo" duration="02:48" status="playing" />
          <PlayerStub title="Analog Study" duration="01:12" status="paused" />
        </div>
      </div>
    </SectionShell>
  );
}

export default MusicSection;
