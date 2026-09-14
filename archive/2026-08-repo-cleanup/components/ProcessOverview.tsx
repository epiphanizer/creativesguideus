import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

export type ProcessOverviewStep = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type ProcessOverviewProps = {
  steps?: ProcessOverviewStep[];
  className?: string;
  ariaLabel?: string;
};

const DEFAULT_STEPS: ProcessOverviewStep[] = [
  {
    title: "Signal Sweep",
    description: "We isolate what matters inside the market noise.",
    icon: (
      <svg className="cg-process-overview__icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <circle cx="32" cy="32" r="21" />
        <path d="M32 11v42" />
        <path d="M11 32h42" />
      </svg>
    )
  },
  {
    title: "System Chorus",
    description: "Product, code, and story move in one sprint-ready system.",
    icon: (
      <svg className="cg-process-overview__icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <rect x="14" y="14" width="36" height="36" rx="6" />
        <path d="M14 32h36" />
        <path d="M32 14v36" />
      </svg>
    )
  },
  {
    title: "Launch",
    description: "We hand off enablement that keeps the clarity compounding.",
    icon: (
      <svg className="cg-process-overview__icon" viewBox="0 0 64 64" role="presentation" aria-hidden>
        <path d="M20 44c0-6 24-6 24 0" />
        <path d="M24 20v24" />
        <path d="M40 16v28" />
        <circle cx="24" cy="46" r="4" />
        <circle cx="40" cy="44" r="4" />
      </svg>
    )
  }
];

export function ProcessOverview({ steps = DEFAULT_STEPS, className, ariaLabel = "Studio process" }: ProcessOverviewProps) {
  return (
    <div className={cx("cg-process-overview", className)} aria-label={ariaLabel} role="list">
      {steps.map((step) => (
        <div key={step.title} className="cg-process-overview__step" role="listitem">
          {step.icon}
          <div className="cg-process-overview__copy">
            <p className="cg-process-overview__title">{step.title}</p>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProcessOverview;
