import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { WritingTabs } from "@/components/writing/WritingTabs";

const screenwritingLoglines = [
  {
    title: "Northbound",
    format: "Feature drama / sci-fi",
    logline:
      "A polar cargo pilot is forced to smuggle a sentient algorithm across collapsing trade routes, only to discover it is coded from her own childhood memories."
  },
  {
    title: "Fourth Wall",
    format: "Half-hour dramedy pilot",
    logline:
      "A disgraced showrunner takes a teaching job and rewrites a struggling film school on the fly, as students break the fourth wall to fix their own lives."
  },
  {
    title: "Salt Chorus",
    format: "Short film / experimental",
    logline:
      "An oceanographer loses her hearing during a deep-sea survey and must conduct an underwater choir of sensors using only light and rhythm."
  }
];

const copywritingServices = [
  "Launch messaging systems that scale from landing page to investor deck",
  "Product storytelling for in-app flows, onboarding, and nurture sequences",
  "Microcopy libraries with tone toggles for support and success teams"
];

const voiceMilestones = [
  "Voice audit that catalogs how teams speak today",
  "Persona and tone ladders to keep every draft on brief",
  "Review rituals that ship copy with editorial clarity"
];

export function WritingSection() {
  return (
    <SectionShell id="writing" labelledBy="writing-title">
      <SectionHeader
        id="writing-title"
        eyebrow="Writing"
        title="Narratives built for screen and story systems"
        description="Screenplays, launch messaging, and voice guides that keep producers, founders, and audiences engaged."
      />

      <div className="cg-writing">
        <div className="cg-writing__lede">
          <p>
            Every script and sentence is treated like a production: research, table reads, and iteration until
            the rhythm lands.
          </p>
          <p className="cg-writing__note">Available for rewrite passes, polish, and net-new builds.</p>
        </div>

        <WritingTabs
          items={[
            {
              id: "screenwriting",
              label: "Screenwriting",
              summary: "Feature / pilot / shorts",
              content: (
                <div className="cg-writing__panel cg-writing__panel--screenwriting">
                  <p className="cg-writing__panel-lede">
                    Loglines that have moved through festival labs, coverage passes, and table reads.
                  </p>
                  <ul className="cg-writing__loglines">
                    {screenwritingLoglines.map((project) => (
                      <li key={project.title} className="cg-writing__logline">
                        <div className="cg-writing__logline-meta">{project.format}</div>
                        <h3 className="cg-writing__logline-title">{project.title}</h3>
                        <p className="cg-writing__logline-copy">{project.logline}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            },
            {
              id: "copywriting",
              label: "Copywriting",
              summary: "Product + brand systems",
              content: (
                <div className="cg-writing__panel cg-writing__panel--copywriting">
                  <div className="cg-writing__panel-grid">
                    <div className="cg-writing__services">
                      <h3>Engagement deliverables</h3>
                      <ul>
                        {copywritingServices.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                    <aside className="cg-writing__sample">
                      <h3>Sample snippet</h3>
                      <p>
                        Launch boldly, but speak softly. A modular launch campaign for a climate fintech platform
                        that used tonal modes to shift from investor-ready to customer-close.
                      </p>
                      <p className="cg-writing__sample-footnote">Final deliverable: 42-block copy system w/ QA scripts.</p>
                    </aside>
                  </div>
                </div>
              )
            },
            {
              id: "brand-voice",
              label: "Brand Voice",
              summary: "Codify and scale",
              content: (
                <div className="cg-writing__panel cg-writing__panel--voice">
                  <p className="cg-writing__panel-lede">
                    We build voice playbooks that let growth, support, and product teams speak in harmony.
                  </p>
                  <ol className="cg-writing__voice-steps">
                    {voiceMilestones.map((milestone) => (
                      <li key={milestone}>{milestone}</li>
                    ))}
                  </ol>
                  <div className="cg-writing__deliverable-card">
                    <span className="cg-writing__deliverable-label">Deliverable</span>
                    <strong>Voice bible + rollout workshop</strong>
                    <p>Two-hour working session with annotated scripts and response kits for live teams.</p>
                  </div>
                </div>
              )
            }
          ]}
        />
      </div>
    </SectionShell>
  );
}
