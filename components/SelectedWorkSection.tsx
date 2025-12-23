import { CasePreview } from "@/components/ui/CasePreview";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

const featuredCases = [
  {
    title: "Signal & Form",
    summary: "Editorial commerce launch for a design publication turned shop—brand, storefront, and retained voice ops.",
    meta: "Web / Brand / Retainer",
    href: "#"
  },
  {
    title: "Lattice Audio",
    summary: "Artist-forward hardware brand site with synchronized product storytelling and music previews.",
    meta: "Music / Product Story",
    href: "#"
  },
  {
    title: "Afterlight Pitch Deck",
    summary: "Investor narrative for a sci-fi anthology series—pilot script polish, bible layout, and motion teaser copy.",
    meta: "Writing / Pitch"
  }
];

const inProgressNotes = [
  {
    label: "Rebrand",
    detail: "Multi-market cosmetics studio migrating from DTC to B2B partnerships"
  },
  {
    label: "Narrative",
    detail: "Streaming docuseries adapting a long-form magazine feature into episodic arcs"
  },
  {
    label: "Score",
    detail: "Hybrid orchestral + analog synth package for a short-form fashion film"
  }
];

export function SelectedWorkSection() {
  return (
    <SectionShell id="work" labelledBy="work-title">
      <div className="cg-work">
        <div className="cg-work__lead">
          <SectionHeader
            id="work-title"
            eyebrow="Selected Work"
            title="Outcomes built quietly, shipped confidently"
            description="A rotating mix of launches, retainer programs, and narrative experiments across web, music, and writing."
            actions={
              <Button as="a" href="mailto:hello@creativesguide.us?subject=Selected%20Work" variant="ghost">
                Request full deck
              </Button>
            }
          />
          <div className="cg-work__notes" aria-label="Active initiatives">
            {inProgressNotes.map((item) => (
              <article key={item.label} className="cg-work__note">
                <span className="cg-work__note-label">{item.label}</span>
                <p className="cg-work__note-detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="cg-work__cases" role="list">
          {featuredCases.map((client) => (
            <div key={client.title} role="listitem">
              <CasePreview title={client.title} summary={client.summary} meta={client.meta} href={client.href} />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
