import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const practicePillars = [
  {
    title: "Digital architecture",
    description: "Calm, editorial websites and product surfaces with pacing that lets the story breathe."
  },
  {
    title: "Identity systems",
    description: "Monochrome brand worlds, typographic voice, and restrained motion built to feel inevitable."
  },
  {
    title: "Narrative stewardship",
    description: "Copy, treatments, and launch narratives shaped alongside the pixels and the music."
  }
];

const cadenceNotes = [
  {
    label: "Week 01",
    detail: "Listening salons, voice audit, shared mood boards"
  },
  {
    label: "Week 02",
    detail: "System sketches, script drafts, sonic motifs"
  },
  {
    label: "Week 03",
    detail: "Prototypes + score stems for live review"
  },
  {
    label: "Week 04",
    detail: "Polish, documentation, and launch orchestration"
  }
];

export function WebSection() {
  return (
    <SectionShell id="web" labelledBy="web-title" innerClassName="cg-practice">
      <SectionHeader
        id="web-title"
        eyebrow="Practice"
        title="One studio for digital, identity, and narrative direction"
        description="We build in grayscale to keep attention on story, pacing each release so audiences experience intention—not urgency."
      />

      <div className="cg-practice__intro">
        <p>
          Each engagement is a tightly curated collaboration. We research, storyboard, and prototype in parallel so
          site, sound, and script evolve together.
        </p>
        <p className="cg-practice__note">Typical engagements run four to six weeks with shared reviews every Friday.</p>
      </div>

      <div className="cg-practice__pillars" role="list">
        {practicePillars.map((pillar) => (
          <div key={pillar.title} role="listitem">
            <Card title={pillar.title} description={pillar.description} className="cg-practice__card" />
          </div>
        ))}
      </div>

      <aside className="cg-practice__cadence" aria-label="Typical cadence">
        <h3 className="cg-practice__cadence-title">Cadence</h3>
        <ul className="cg-practice__cadence-list">
          {cadenceNotes.map((note) => (
            <li key={note.label} className="cg-practice__cadence-item">
              <span className="cg-practice__cadence-label">{note.label}</span>
              <p>{note.detail}</p>
            </li>
          ))}
        </ul>
      </aside>
    </SectionShell>
  );
}
          <ProcessStrip />
          <div className="cg-web__outcomes" aria-label="Selected outcomes">
            <h3 className="cg-web__outcomes-title">Selected outcomes</h3>
            <ul className="cg-web__outcomes-list">
              {outcomes.map((outcome) => (
                <li key={outcome} className="cg-web__outcome">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="cg-web__cases" role="list">
        {casePreviews.map((preview) => (
          <div key={preview.title} role="listitem">
            <CasePreview title={preview.title} summary={preview.summary} meta={preview.meta} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export default WebSection;
