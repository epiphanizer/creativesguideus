import { cx } from "@/lib/cx";

export type Cue = {
  title: string;
  duration: string;
  mood: string;
  instrumentation: string;
  project?: string;
};

export type CueListProps = {
  cues: Cue[];
  className?: string;
};

export function CueList({ cues, className }: CueListProps) {
  return (
    <section className={cx("cg-cue-list", className)} aria-label="Selected cues">
      <header className="cg-cue-list__header">
        <span className="cg-cue-list__label">Selected Cues</span>
        <span className="cg-cue-list__runtime">Total runtime {calculateTotalRuntime(cues)}</span>
      </header>
      <ol className="cg-cue-list__items">
        {cues.map((cue) => (
          <li key={cue.title} className="cg-cue-list__item" tabIndex={0}>
            <div className="cg-cue-list__row">
              <span className="cg-cue-list__title">{cue.title}</span>
              <span className="cg-cue-list__duration">{cue.duration}</span>
            </div>
            <dl className="cg-cue-list__meta">
              <div>
                <dt>Project</dt>
                <dd>{cue.project ?? "Independent"}</dd>
              </div>
              <div>
                <dt>Mood</dt>
                <dd>{cue.mood}</dd>
              </div>
              <div>
                <dt>Instrumentation</dt>
                <dd>{cue.instrumentation}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}

function calculateTotalRuntime(cues: Cue[]): string {
  const totalSeconds = cues.reduce((sum, cue) => sum + parseDuration(cue.duration), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function parseDuration(duration: string): number {
  const [min, sec] = duration.split(":");
  const minutes = Number.parseInt(min ?? "0", 10);
  const seconds = Number.parseInt(sec ?? "0", 10);

  return minutes * 60 + seconds;
}

export default CueList;
