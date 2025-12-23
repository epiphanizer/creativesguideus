import { HeroSection } from "@/components/HeroSection";
import { WebSection } from "@/components/WebSection";
import { MusicSection } from "@/components/MusicSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

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
      <HeroSection />

      <WebSection />

      <MusicSection />

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
