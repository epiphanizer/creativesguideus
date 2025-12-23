import { cx } from "@/lib/cx";

export type ProcessStripProps = {
  stages?: string[];
  className?: string;
};

const DEFAULT_STAGES = ["Discover", "Design", "Build", "Launch"];

export function ProcessStrip({ stages = DEFAULT_STAGES, className }: ProcessStripProps) {
  return (
    <div className={cx("cg-process-strip", className)}>
      <span className="cg-process-strip__label">Process</span>
      <ol className="cg-process-strip__list">
        {stages.map((stage, index) => (
          <li key={stage} className="cg-process-strip__item" aria-label={`Stage ${index + 1} — ${stage}`}>
            <span className="cg-process-strip__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="cg-process-strip__stage">{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ProcessStrip;
