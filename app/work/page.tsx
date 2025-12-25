import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

const CASE_STUDIES = [
  {
    title: "Appreesh",
    description: "Gratitude cooperative launch with smart contracts, analytics, and a ritual-first brand kit.",
    href: "/work/appreesh",
    proof: ["18-week build", "Next.js + Solidity", "Invite-only launch"]
  },
  {
    title: "Lead Me Guide Me",
    description: "SwiftUI scripture companion aligning daily meditations with choir rehearsal flows.",
    href: "/work/lead-me-guide-me",
    proof: ["12-week beta", "SwiftUI iOS", "Product · UX · Score"]
  },
  {
    title: "World Cup Dreams",
    description: "Athlete-led WordPress system clarifying grant pathways and fueling donor momentum.",
    href: "/work/world-cup-dreams",
    proof: ["14-week sprint", "WordPress", "$7M+ grants"]
  }
];

export default function WorkIndexPage() {
  return (
    <main className="cg-page">
      <SectionShell id="work-index" labelledBy="work-index-title" innerClassName="cg-work-index__hero" variant="hero">
        <SectionHeader
          id="work-index-title"
          eyebrow="Case studies"
          title="Work that ships. Stories that convert."
          description="Every build fuses product, narrative, and score so momentum is measurable—and ready for leadership."
          actions={
            <Button as="a" href="/#contact">
              Start a project
            </Button>
          }
        />
      </SectionShell>

      <SectionShell id="work-grid" labelledBy="work-grid-title" innerClassName="cg-work-index__grid">
        <div className="cg-work-index__header">
          <h2 id="work-grid-title">Featured case studies</h2>
          <p>Three proofs where strategy, build, and sound moved as one release.</p>
        </div>
        <div className="cg-work-index__cards" role="list">
          {CASE_STUDIES.map((study) => (
            <div key={study.title} role="listitem">
              <Card
                title={study.title}
                description={study.description}
                className="cg-work-index__card"
                footer={
                  <Link href={study.href} className="cg-work-index__link">
                    Read case study <span aria-hidden="true">→</span>
                  </Link>
                }
              >
                <ul className="cg-work-index__proof">
                  {study.proof.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="work-contact" labelledBy="work-contact-title" innerClassName="cg-work-index__cta" variant="compact">
        <div>
          <h2 id="work-contact-title">Ready to build your case study?</h2>
          <p>Let’s align your product, narrative, and score so the next release lands with proof.</p>
        </div>
        <div className="cg-work-index__cta-actions">
          <Button as="a" href="/#contact">
            Start a project
          </Button>
          <Button as="a" href="/#process" variant="ghost">
            See our process
          </Button>
        </div>
      </SectionShell>
    </main>
  );
}
