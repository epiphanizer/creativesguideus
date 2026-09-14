import { cx } from "@/lib/cx";

export type PlayerStubProps = {
  title: string;
  duration: string;
  status?: "idle" | "playing" | "paused";
  className?: string;
};

export function PlayerStub({ title, duration, status = "idle", className }: PlayerStubProps) {
  return (
    <figure className={cx("cg-player-stub", className)} aria-label={`Audio player placeholder for ${title}`}>
      <div className="cg-player-stub__waveform" aria-hidden>
        <span className="cg-player-stub__bars" data-status={status}>
          {Array.from({ length: 24 }).map((_, index) => (
            <i key={index} />
          ))}
        </span>
      </div>
      <figcaption className="cg-player-stub__caption">
        <div>
          <p className="cg-player-stub__title">{title}</p>
          <p className="cg-player-stub__status">{status === "playing" ? "Preview" : "Cue"}</p>
        </div>
        <span className="cg-player-stub__duration">{duration}</span>
      </figcaption>
    </figure>
  );
}

export default PlayerStub;
