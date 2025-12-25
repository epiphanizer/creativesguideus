import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cx } from "@/lib/cx";

/*
Content Contract — CaseStudyTemplate

Hero
  • eyebrow: literal string "Case study"
  • title: 3–7 words, high-impact
  • description: single sentence articulating outcome + audience
  • body: exactly two paragraphs, each 1–3 sentences
  • actions: two CTAs (primary + secondary)

Quick facts
  • 5–7 rows using shared labels in this order:
    Partner, Practices, Platform, Timeline, Release mode, Impact (optional), Metrics (optional)

Highlights
  • 3–4 items

Narrative
  • 3 sections titled Discovery, Design, Build + Launch

Process
  • 4 stages

Deliverables
  • 5 items

Quote
  • Optional; must be 1–2 sentences if present

Closing
  • Short next-step note + contact CTA
*/

export type CaseStudyHero = {
  eyebrow: string;
  title: string;
  description: string;
  body: string[];
  actions?: ReactNode;
};

export type CaseStudyFact = {
  label: string;
  value: string;
};

export type CaseStudyHighlight = {
  title: string;
  detail: string;
};

export type CaseStudyNarrative = {
  title: string;
  paragraphs: string[];
};

export type CaseStudyProcessStage = {
  title: string;
  detail: string;
};

export type CaseStudyDeliverable = {
  label: string;
  detail: string;
};

export type CaseStudyQuote = {
  text: string;
  attribution: string;
};

export type CaseStudyClosing = {
  note: string;
  actionLabel: string;
  actionHref: string;
};

export type CaseStudyProof = {
  label: string;
  value: string;
};

export type CaseStudyRelated = {
  title: string;
  description: string;
  href: string;
};

export type CaseStudyTemplateProps = {
  id: string;
  hero: CaseStudyHero;
  quickFacts: CaseStudyFact[];
  highlights: CaseStudyHighlight[];
  narrative: CaseStudyNarrative[];
  process: CaseStudyProcessStage[];
  deliverables: CaseStudyDeliverable[];
  closing: CaseStudyClosing;
  quote?: CaseStudyQuote;
  proof?: CaseStudyProof[];
  related?: CaseStudyRelated[];
  className?: string;
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function CaseStudyTemplate({
  id,
  hero,
  quickFacts,
  highlights,
  narrative,
  process,
  deliverables,
  closing,
  quote,
  proof,
  related,
  className
}: CaseStudyTemplateProps) {
  const headerId = `${id}-header`;
  const factPreview = quickFacts.slice(0, 3);

  return (
    <article className={cx("cg-case-study", className)}>
      <SectionShell id={id} labelledBy={headerId} innerClassName="cg-case-study__hero" variant="hero">
        <div className="cg-case-study__hero-grid">
          <div className="cg-case-study__hero-main">
            <SectionHeader
              id={headerId}
              eyebrow={hero.eyebrow}
              title={hero.title}
              description={hero.description}
              headingLevel="h1"
              actions={hero.actions}
            />
            {proof?.length ? (
              <ul className="cg-case-study__proof" aria-label="Engagement proof points">
                {proof.slice(0, 3).map((item) => (
                  <li key={`${item.label}-${item.value}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="cg-case-study__hero-body">
              {hero.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="cg-case-study__hero-preview" aria-label="Snapshot quick facts">
            <h3>Snapshot</h3>
            <dl>
              {factPreview.map((fact) => (
                <div key={`snapshot-${fact.label}`}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </SectionShell>

      <SectionShell id={`${id}-facts`} labelledBy={`${id}-facts-title`} innerClassName="cg-case-study__facts">
        <div className="cg-case-study__facts-grid">
          <div className="cg-case-study__facts-main">
            <h2 id={`${id}-facts-title`}>Quick facts</h2>
            <dl className="cg-case-study__facts-list">
              {quickFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="cg-case-study__highlights" aria-label="Engagement highlights">
            {highlights.map((highlight) => (
              <article key={highlight.title}>
                <h3>{highlight.title}</h3>
                <p>{highlight.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell id={`${id}-narrative`} labelledBy={`${id}-narrative-title`} innerClassName="cg-case-study__narrative">
        <div className="cg-case-study__narrative-layout">
          <aside className="cg-case-study__narrative-nav" aria-label="Narrative sections">
            <h2 id={`${id}-narrative-title`}>Narrative flow</h2>
            <ol>
              {narrative.map((section) => (
                <li key={`toc-${section.title}`}>
                  <a href={`#${id}-${slugify(section.title)}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </aside>
          <div className="cg-case-study__narrative-content">
            {narrative.map((section) => (
              <article key={section.title} id={`${id}-${slugify(section.title)}`}>
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell id={`${id}-process`} labelledBy={`${id}-process-title`} innerClassName="cg-case-study__process">
        <div className="cg-case-study__process-inner">
          <h2 id={`${id}-process-title`}>Process cadence</h2>
          <ol className="cg-case-study__process-list">
            {process.map((stage, index) => (
              <li key={stage.title}>
                <span className="cg-case-study__process-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="cg-case-study__process-copy">
                  <h3>{stage.title}</h3>
                  <p>{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionShell>

      <SectionShell id={`${id}-deliverables`} labelledBy={`${id}-deliverables-title`} innerClassName="cg-case-study__deliverables">
        <div className="cg-case-study__deliverables-inner">
          <div className="cg-case-study__deliverables-header">
            <h2 id={`${id}-deliverables-title`}>Deliverables</h2>
            <p>Everything ships together so partners can command the release in one decisive moment.</p>
          </div>
          <ul className="cg-case-study__deliverables-list">
            {deliverables.map((deliverable) => (
              <li key={deliverable.label}>
                <span>{deliverable.label}</span>
                <p>{deliverable.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      {quote ? (
        <SectionShell id={`${id}-quote`} labelledBy={`${id}-quote-title`} innerClassName="cg-case-study__quote" variant="compact">
          <figure className="cg-case-study__quote-card">
            <blockquote>
              <p id={`${id}-quote-title`}>{quote.text}</p>
            </blockquote>
            <figcaption>{quote.attribution}</figcaption>
          </figure>
        </SectionShell>
      ) : null}

      <SectionShell id={`${id}-closing`} labelledBy={`${id}-closing-title`} innerClassName="cg-case-study__closing" variant="compact">
        <div className="cg-case-study__closing-banner">
          <div>
            <h2 id={`${id}-closing-title`}>Next in line</h2>
            <p>{closing.note}</p>
          </div>
          <div className="cg-case-study__closing-actions">
            <Button as="a" href={closing.actionHref}>
              {closing.actionLabel}
            </Button>
          </div>
        </div>
      </SectionShell>

      {related?.length ? (
        <SectionShell id={`${id}-related`} labelledBy={`${id}-related-title`} innerClassName="cg-case-study__related">
          <div className="cg-case-study__related-inner">
            <div className="cg-case-study__related-header">
              <h2 id={`${id}-related-title`}>Related case studies</h2>
              <p>Explore more launches where product, narrative, and score moved together.</p>
            </div>
            <div className="cg-case-study__related-grid">
              {related.slice(0, 2).map((item) => (
                <article key={item.href} className="cg-case-study__related-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href={item.href}>
                    Read case study <span aria-hidden="true">→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </SectionShell>
      ) : null}
    </article>
  );
}

export default CaseStudyTemplate;
