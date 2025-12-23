import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const offerings = [
  "Feature screenplay · June 2025 polish draft",
  "Lookbook + tonal score palette",
  "Companion scripts for festival rollout"
];

const partnerships = [
  "Character-first producers",
  "Art-house aligned financiers",
  "Festival + co-production strategists"
];

export function WritingSection() {
  return (
    <SectionShell id="writing" labelledBy="writing-title">
      <SectionHeader
        id="writing-title"
        eyebrow="For Screen"
        title="Featured — Bong Tour"
        description="Surreal road feature now shopping with deck, score palette, and partner-ready materials."
      />

      <div className="cg-bong">
        <div className="cg-bong__story">
          <Tag className="cg-bong__tag">Feature screenplay · June 2025 draft</Tag>
          <p className="cg-bong__logline">
            A washed-up tour manager must shepherd a banned Korean psych band through the Southwest for one impossible encore.
          </p>
          <p>
            The package ships with tonal essays, music sketches, and a monochrome visual bible extending easily into episodic form.
          </p>
          <p className="cg-bong__status">Circulating now for producers and financing partners.</p>
          <Button as="a" href="#contact" variant="secondary" className="cg-bong__cta">
            Request the Bong Tour deck
          </Button>
        </div>

        <aside className="cg-bong__details" aria-label="Bong Tour offerings and partnerships">
          <div className="cg-bong__panel">
            <h3>Offerings</h3>
            <ul>
              {offerings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="cg-bong__panel">
            <h3>In conversation with</h3>
            <ul>
              {partnerships.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="cg-bong__note">Dedicated landing page launches soon with expanded materials and score demos.</p>
        </aside>
      </div>
    </SectionShell>
  );
}
