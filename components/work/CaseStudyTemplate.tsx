import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cx } from "@/lib/cx";

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
  className?: string;
};

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
  className
}: CaseStudyTemplateProps) {
  const headerId = `${id}-title`;

  return (
    <article className={cx("cg-case-study", className)}>
      <SectionShell id={id} labelledBy={headerId} innerClassName="cg-case-study__hero" variant="hero">
        <SectionHeader
          id={headerId}
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          headingLevel="h1"
          actions={hero.actions}
        />
        <div className="cg-case-study__hero-body">
          {hero.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </SectionShell>

      <SectionShell id={`${id}-facts`} labelledBy={`${id}-facts-title`} innerClassName="cg-case-study__facts">
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
        <div className="cg-case-study__highlights">
          {highlights.map((highlight) => (
            <article key={highlight.title}>
              <h3>{highlight.title}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id={`${id}-narrative`} labelledBy={`${id}-narrative-title`} innerClassName="cg-case-study__narrative">
        <h2 id={`${id}-narrative-title`}>Narrative flow</h2>
        <div className="cg-case-study__narrative-grid">
          {narrative.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id={`${id}-process`} labelledBy={`${id}-process-title`} innerClassName="cg-case-study__process">
        <h2 id={`${id}-process-title`}>Process cadence</h2>
        <ol>
          {process.map((stage) => (
            <li key={stage.title}>
              <h3>{stage.title}</h3>
              <p>{stage.detail}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell id={`${id}-deliverables`} labelledBy={`${id}-deliverables-title`} innerClassName="cg-case-study__deliverables">
        <div className="cg-case-study__deliverables-header">
          <h2 id={`${id}-deliverables-title`}>Deliverables</h2>
          <p>Everything ships together so partners can command the release in one decisive moment.</p>
        </div>
        <ul>
          {deliverables.map((deliverable) => (
            <li key={deliverable.label}>
              <span>{deliverable.label}</span>
              <p>{deliverable.detail}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {quote ? (
        <SectionShell id={`${id}-quote`} labelledBy={`${id}-quote-title`} innerClassName="cg-case-study__quote" variant="compact">
          <figure>
            <blockquote>
              <p id={`${id}-quote-title`}>{quote.text}</p>
            </blockquote>
            <figcaption>{quote.attribution}</figcaption>
          </figure>
        </SectionShell>
      ) : null}

      <SectionShell id={`${id}-closing`} labelledBy={`${id}-closing-title`} innerClassName="cg-case-study__closing" variant="compact">
        <div>
          <h2 id={`${id}-closing-title`}>Next in line</h2>
          <p>{closing.note}</p>
        </div>
        <Button as="a" href={closing.actionHref}>
          {closing.actionLabel}
        </Button>
      </SectionShell>
    </article>
  );
}

export default CaseStudyTemplate;
