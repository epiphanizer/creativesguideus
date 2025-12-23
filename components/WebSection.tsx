import { useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CasePreview } from "@/components/ui/CasePreview";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import ProcessStrip from "@/components/ProcessStrip";

const serviceCards = [
  {
    title: "Brand Strategy",
    description: "Define positioning, audience, and voice so every deliverable hits the same note."
  },
  {
    title: "Visual Identity",
    description: "Editorial typography, restrained motion, and monochrome palettes that feel inevitable."
  },
  {
    title: "Web Design (UI/UX)",
    description: "Research-led digital architecture proving clarity and conversion can share a layout."
  },
  {
    title: "Web Development",
    description: "Next.js builds with considered performance budgets and accessibility from frame zero."
  },
  {
    title: "Storytelling / Copy",
    description: "Narratives and microcopy that move fast without sounding like venture jargon."
  }
];

const outcomes = [
  "More qualified leads",
  "Sharper brand recall",
  "Faster load times",
  "Confidence on launch day"
];

const casePreviews = [
  {
    title: "Nocturne Type Studio",
    summary: "Identity and commerce site for a type foundry balancing rigor with romance.",
    meta: "Brand / Web"
  },
  {
    title: "Signal Atlas Journal",
    summary: "Subscription storytelling platform with long-form narratives and audio companions.",
    meta: "Editorial / Build"
  }
];

export function WebSection() {
  const services = useMemo(() => serviceCards, []);

  return (
    <SectionShell id="web" labelledBy="web-title" innerClassName="cg-web">
      <SectionHeader
        id="web-title"
        eyebrow="Web / Brand"
        title="Websites + Brands that tell the truth beautifully"
        description="Strategy, identity, and digital builds woven from one monochrome system so nothing feels outsourced."
        actions={<Button variant="ghost">View full capabilities</Button>}
      />

      <div className="cg-web__content">
        <div className="cg-card-grid" role="list">
          {services.map((service) => (
            <div key={service.title} role="listitem">
              <Card title={service.title} description={service.description} className="cg-card--service" />
            </div>
          ))}
        </div>

        <aside className="cg-web__sidebar">
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
