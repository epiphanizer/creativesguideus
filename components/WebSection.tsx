import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const practicePillars = [
  {
    title: "Digital architecture",
    description: "Calm, editorial surfaces in grayscale so the story leads."
  },
  {
    title: "Identity systems",
    description: "Typographic voice and restrained motion built to feel inevitable."
  },
  {
    title: "Narrative stewardship",
    description: "Copy, treatments, and launch narrative shaped alongside the score."
  }
];

const cadenceNotes = [
  {
    label: "Step 01",
    detail: "Listening salon, intent map, and shared mood boards"
  },
  {
    label: "Step 02",
    detail: "System sketches, script fragments, and theme studies"
  },
  {
    label: "Step 03",
    detail: "Prototypes, score stems, and launch orchestration"
  }
];

export function WebSection() {
  return (
    <SectionShell id="web" labelledBy="web-title" innerClassName="cg-practice">
      <SectionHeader
        id="web-title"
        eyebrow="Our Method"
        title="Composed digital, identity, and narrative direction"
        description="We build in grayscale to keep attention on story, pacing each release so audiences experience intention—not urgency."
      />

      <div className="cg-practice__intro">
        <p>
          Every build pairs site, score, and script so launches feel composed. We keep teams inside one intentional cadence,
          never a content scramble.
        </p>
        <p className="cg-practice__note">Three-step engagements with weekly reviews and a single point of contact.</p>
      </div>

      <div className="cg-practice__pillars" role="list">
        {practicePillars.map((pillar) => (
          <div key={pillar.title} role="listitem">
            <Card title={pillar.title} description={pillar.description} className="cg-practice__card" />
          </div>
        ))}
      </div>

      <aside className="cg-practice__cadence" aria-label="Process">
        <h3 className="cg-practice__cadence-title">Process</h3>
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

export default WebSection;
