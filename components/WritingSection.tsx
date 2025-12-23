import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const offerings = [
  "Feature screenplay — 108 pages, current draft June 2025",
  "Lookbook + tonal score palette for films and experiential",
  "Short-form companion scripts for festival or digital rollout"
];

const partnerships = [
  "Producers with appetite for character-driven road narratives",
  "Financiers aligned with art-house theatrical release",
  "Festival strategists and international co-production allies"
];

export function WritingSection() {
  return (
    <SectionShell id="writing" labelledBy="writing-title">
      <SectionHeader
        id="writing-title"
        eyebrow="For Screen"
        title="Featured work — Bong Tour"
        description="A surreal road film about a washed-up tour manager escorting a banned band across the American Southwest."
      />

      <div className="cg-bong">
        <div className="cg-bong__story">
          <Tag className="cg-bong__tag">Feature screenplay · June 2025 draft</Tag>
          <p className="cg-bong__logline">
            When a legendary Korean psych-rock band is secretly invited back to the US for one night, their former tour
            manager must shepherd them through border towns, desert cults, and her own burnout to get them on stage.
          </p>
          <p>
            We are developing Bong Tour as a feature with the flexibility to extend into episodic anthologies. The script is
            accompanied by tonal essays, music sketches, and a visual bible that carries the same monochrome discipline as
            our design work.
          </p>
          <p className="cg-bong__status">Currently circulating for producers and financing partners aligned with art-house theatrical release.</p>
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
