import Link from "next/link";

import workModule from "@/data/work/module.json";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

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
          <h2 id="work-grid-title">Featured work</h2>
          <p>Some entries open into full case studies. Others stay as portfolio signals until the long-form narrative is ready.</p>
        </div>
        <div className="cg-work-index__cards" role="list">
          {workModule.studies.map((study) => (
            <div key={study.title} role="listitem">
              <Card
                title={study.title}
                description={study.workIndexDescription ?? study.description}
                className="cg-work-index__card"
                previewImage={
                  study.previewImageUrl
                    ? { src: study.previewImageUrl, alt: `${study.title} — featured project work` }
                    : undefined
                }
                footer={
                  study.caseStudyPath ? (
                    <Link href={study.caseStudyPath} className="cg-work-index__link">
                      Read case study <span aria-hidden="true">→</span>
                    </Link>
                  ) : study.siteHref ? (
                    <a href={study.siteHref} className="cg-work-index__link" target="_blank" rel="noreferrer">
                      {study.siteLabel || "Visit live project"} <span aria-hidden="true">→</span>
                    </a>
                  ) : undefined
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
          <Button as="a" href={workModule.sourceSiteUrl} variant="ghost">
            Open source site
          </Button>
        </div>
      </SectionShell>
    </main>
  );
}
