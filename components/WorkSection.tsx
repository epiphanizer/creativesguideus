import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Tag } from "@/components/ui/Tag";

const impactNotes = [
  {
    label: "Role",
    detail: "Brand, web, narrative direction, and original score"
  },
  {
    label: "Timeline",
    detail: "10-week sprint with staggered reveal moments"
  },
  {
    label: "Collaborators",
    detail: "World Cup Dreams Foundation + NBC Sports storytelling unit"
  }
];

const deliverables = [
  {
    title: "Interactive season hub",
    summary: "Modular athlete profiles, live qualifier tracker, and donation pathways rolled into one editorial layout."
  },
  {
    title: "Score suite",
    summary: "Four cue families mapped to athlete archetypes, mixed for broadcast, socials, and in-venue walk-ons."
  },
  {
    title: "Launch playbook",
    summary: "Release cadence, voice guidelines, and signal kit for partners amplifying the 2025 campaign."
  }
];

export function WorkSection() {
  return (
    <SectionShell id="work" labelledBy="work-title" innerClassName="cg-work">
      <SectionHeader
        id="work-title"
        eyebrow="Our Work"
        title="World Cup Dreams — 2025 docu-series sprint"
        description="We helped the foundation turn their alpine training tour into a digital-first story, pacing every reveal like a broadcast vignette."
      />

      <div className="cg-work__lead">
        <div className="cg-work__story">
          <Tag className="cg-work__tag">Case study · 2025</Tag>
          <p>
            World Cup Dreams asked for a campaign that could flex between athlete showcases, fundraising, and a behind-the-scenes
            documentary. We opened with listening salons alongside their coaching staff, mapping the emotional beats long before pixels or score.
          </p>
          <p>
            The result was a monochrome system—site, score, and narrative voice—that could expand for partners like NBC Sports without
            losing intimacy. Every Friday we released a new vignette, each with its own cue, typography cadence, and interactive data layer.
          </p>
          <Button as="a" href="#contact" variant="ghost" className="cg-work__cta">
            Request the World Cup Dreams dossier
          </Button>
        </div>

        <div className="cg-work__notes" aria-label="Project metadata">
          {impactNotes.map((note) => (
            <article key={note.label} className="cg-work__note">
              <p className="cg-work__note-label">{note.label}</p>
              <p className="cg-work__note-detail">{note.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="cg-work__cases" role="list">
        {deliverables.map((deliverable) => (
          <div key={deliverable.title} role="listitem" className="cg-work__deliverable">
            <div className="cg-work__deliverable-icon" aria-hidden>
              <svg viewBox="0 0 64 64">
                <rect x="10" y="18" width="44" height="28" rx="6" />
                <path d="M22 30h20" />
                <path d="M22 38h12" />
                <circle cx="32" cy="50" r="4" />
              </svg>
            </div>
            <div className="cg-work__deliverable-copy">
              <h3>{deliverable.title}</h3>
              <p>{deliverable.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export default WorkSection;
