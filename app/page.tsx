import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const heroCopy =
  "Boutique studio weaving web, music, and writing into one monochrome signature for brave creatives.";

const services = [
  {
    title: "Brand Strategy",
    description: "Clarify the promise so every touchpoint speaks in one spare, resonant voice."
  },
  {
    title: "Visual Identity",
    description: "Architect monochrome systems with typographic gravity and flexible motion rules."
  },
  {
    title: "Web Design (UI/UX)",
    description: "Compose gallery-grade interfaces that feel inevitable and convert without noise."
  },
  {
    title: "Web Development",
    description: "Ship performant, accessible builds on modern stacks with obsessive layout craft."
  },
  {
    title: "Storytelling / Copy",
    description: "Write crisp, poetic language that holds attention and earns trust in one breath."
  }
];

const cueHighlights = [
  { title: "North River", duration: "02:11" },
  { title: "Signal Bloom", duration: "01:34" },
  { title: "Afterlight", duration: "00:58" }
];

const writingLanes = [
  {
    title: "Screenwriting",
    description: "Feature, pilot, and short-form scripts with cinematic dialogue and modern cadence."
  },
  {
    title: "Copywriting",
    description: "Landing pages, product storytelling, and brand systems grounded in human language."
  },
  {
    title: "Brand Voice",
    description: "Codify consistent tones that scale across campaigns without diluting personality."
  }
];

export default function HomePage() {
  return (
    <main className="cg-page" id="page-top">
      <SectionShell id="hero" variant="hero" labelledBy="hero-title">
        <SectionHeader
          headingLevel="h1"
          id="hero-title"
          title="Creatives Guide Us"
          description={heroCopy}
          actions={
            <>
              <Button>Start a Project</Button>
              <Button as="a" href="#work" variant="ghost">
                View Work
              </Button>
            </>
          }
        />
      </SectionShell>

      <SectionShell id="web" labelledBy="web-title">
        <SectionHeader
          id="web-title"
          eyebrow="Web / Brand"
          title="Websites + Brands that tell the truth"
          description="Strategy, identity, and digital build executed with restrained conviction."
        />
        <div className="cg-card-grid" role="list">
          {services.map((service) => (
            <div key={service.title} role="listitem">
              <Card
                title={service.title}
                description={service.description}
                className="cg-card--service"
              />
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="music" labelledBy="music-title">
        <SectionHeader
          id="music-title"
          eyebrow="Music"
          title="Music for film & projects"
          description="Cue design, thematic composition, and supervision support shaped like a minimalist zine."
        />
        <div className="cg-card-grid" role="list">
          {cueHighlights.map((cue) => (
            <div key={cue.title} role="listitem">
              <Card
                title={cue.title}
                description={`Duration ${cue.duration} · Mood TBD`}
                className="cg-card--cue"
              />
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="writing" labelledBy="writing-title">
        <SectionHeader
          id="writing-title"
          eyebrow="Writing"
          title="Screenwriting + copy that reads like humans"
          description="Loglines, brand voice, and narrative systems crafted to stay sharp long after launch."
        />
        <div className="cg-card-grid" role="list">
          {writingLanes.map((lane) => (
            <div key={lane.title} role="listitem">
              <Card title={lane.title} description={lane.description} />
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="work" labelledBy="work-title">
        <SectionHeader
          id="work-title"
          eyebrow="Selected Work"
          title="Quietly confident portfolio"
          description="Placeholder highlights for upcoming case studies and boutique releases."
        />
      </SectionShell>

      <SectionShell id="about" labelledBy="about-title">
        <SectionHeader
          id="about-title"
          eyebrow="About / Process"
          title="Discover → Design → Build → Launch"
          description="A four-beat cadence that keeps boutique momentum grounded in clarity and delivery."
        />
      </SectionShell>

      <SectionShell id="contact" labelledBy="contact-title">
        <SectionHeader
          id="contact-title"
          eyebrow="Contact"
          title="Open for considered collaborations"
          description="Start a project, request a one-page sample, or book a consult in monochrome confidence."
          actions={
            <Button as="a" href="mailto:hello@creativesguide.us" variant="secondary">
              Email the studio
            </Button>
          }
        />
      </SectionShell>
    </main>
  );
}
