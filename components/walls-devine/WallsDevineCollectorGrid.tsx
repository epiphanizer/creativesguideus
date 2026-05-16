"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

import { EcosystemSignupForm } from "./EcosystemSignupForm";

type CollectorChallengeMode = "collect" | "timing" | "sequence";

export type CollectorGridTile = {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  center?: boolean;
  playerTarget?: string;
  teaser: string;
  challengeLabel: string;
  challengePrompt: string;
  easterEggTitle: string;
  easterEggBody: string;
  interest: string;
  gameMode: CollectorChallengeMode;
  tokenLabel: string;
  storySummary: string;
  visualThread: string;
  makingNote: string;
};

type WallsDevineCollectorGridProps = {
  tiles: CollectorGridTile[];
};

type TokenPoint = {
  id: string;
  top: number;
  left: number;
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildTokenPoints(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `token-${index}`,
    top: randomInRange(10, 78),
    left: randomInRange(10, 78)
  }));
}

function buildSequencePattern(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 4));
}

function CollectorCollectGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const targetScore = tile.center ? 8 : 6;
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(14);
  const [tokens, setTokens] = useState<TokenPoint[]>(() => buildTokenPoints(7));
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setScore(0);
    setSecondsLeft(14);
    setTokens(buildTokenPoints(7));
    setStatus("active");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("lost");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, tile.slug]);

  function handleTokenCollect(tokenId: string) {
    if (status !== "active") {
      return;
    }

    setTokens((current) => current.map((token) => (token.id === tokenId ? { ...token, top: randomInRange(10, 78), left: randomInRange(10, 78) } : token)));
    setScore((current) => {
      const nextScore = current + 1;

      if (nextScore >= targetScore) {
        setStatus("won");
        onUnlock();
      }

      return nextScore;
    });
  }

  function handleReset() {
    setScore(0);
    setSecondsLeft(14);
    setTokens(buildTokenPoints(7));
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Collect {targetScore}</span>
        <span>{score}/{targetScore}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__token-field" aria-label={`${tile.title} collector game`}>
        {tokens.map((token) => (
          <button
            key={token.id}
            type="button"
            className="wd-grid-modal__token"
            style={{ "--wd-token-top": `${token.top}%`, "--wd-token-left": `${token.left}%` } as CSSProperties}
            onClick={() => handleTokenCollect(token.id)}
            disabled={status !== "active"}
          >
            {tile.tokenLabel}
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Unlocked. The hidden note is live below."
            : status === "lost"
              ? "The room closed before the grid locked. Run it again."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Reset run
        </Button>
      </div>
    </div>
  );
}

function CollectorTimingGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [hits, setHits] = useState(0);
  const [beamPosition, setBeamPosition] = useState(0);
  const [beamDirection, setBeamDirection] = useState(1);
  const [targetStart, setTargetStart] = useState(28);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");
  const targetWidth = 18;

  useEffect(() => {
    setSecondsLeft(18);
    setHits(0);
    setBeamPosition(0);
    setBeamDirection(1);
    setTargetStart(randomInRange(18, 70));
    setStatus("active");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const movement = window.setInterval(() => {
      setBeamPosition((current) => {
        const next = current + beamDirection * 4;

        if (next >= 100) {
          setBeamDirection(-1);
          return 100;
        }

        if (next <= 0) {
          setBeamDirection(1);
          return 0;
        }

        return next;
      });
    }, 70);

    return () => window.clearInterval(movement);
  }, [beamDirection, status, tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("lost");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, tile.slug]);

  function handleLock() {
    if (status !== "active") {
      return;
    }

    const inZone = beamPosition >= targetStart && beamPosition <= targetStart + targetWidth;

    if (!inZone) {
      return;
    }

    setHits((current) => {
      const next = current + 1;

      if (next >= 3) {
        setStatus("won");
        onUnlock();
      } else {
        setTargetStart(randomInRange(12, 74));
      }

      return next;
    });
  }

  function handleReset() {
    setSecondsLeft(18);
    setHits(0);
    setBeamPosition(0);
    setBeamDirection(1);
    setTargetStart(randomInRange(18, 70));
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Lock 3 pulses</span>
        <span>{hits}/3</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__meter" aria-label={`${tile.title} pulse game`}>
        <div className="wd-grid-modal__meter-zone" style={{ left: `${targetStart}%`, width: `${targetWidth}%` }} />
        <div className="wd-grid-modal__meter-beam" style={{ left: `${beamPosition}%` }} />
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Pulse locked. The hidden note is live below."
            : status === "lost"
              ? "The signal slipped. Start a new pass."
              : tile.challengePrompt}
        </p>
        <div className="wd-grid-modal__game-buttons">
          <Button type="button" variant="primary" size="sm" onClick={handleLock} disabled={status !== "active"}>
            Lock pulse
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
            Reset run
          </Button>
        </div>
      </div>
    </div>
  );
}

function CollectorSequenceGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const patternLength = tile.center ? 5 : 4;
  const [pattern, setPattern] = useState<number[]>(() => buildSequencePattern(patternLength));
  const [activePad, setActivePad] = useState<number | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(22);
  const [status, setStatus] = useState<"showing" | "active" | "won" | "lost">("showing");

  useEffect(() => {
    setPattern(buildSequencePattern(patternLength));
    setActivePad(null);
    setInput([]);
    setSecondsLeft(22);
    setStatus("showing");
  }, [patternLength, tile.slug]);

  useEffect(() => {
    if (status !== "showing") {
      return;
    }

    const timeouts: number[] = [];
    let elapsed = 260;

    pattern.forEach((pad) => {
      timeouts.push(window.setTimeout(() => setActivePad(pad), elapsed));
      elapsed += 460;
      timeouts.push(window.setTimeout(() => setActivePad(null), elapsed));
      elapsed += 180;
    });

    timeouts.push(window.setTimeout(() => setStatus("active"), elapsed));

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      setActivePad(null);
    };
  }, [pattern, status]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("lost");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  function handlePadPress(padIndex: number) {
    if (status !== "active") {
      return;
    }

    const nextIndex = input.length;

    if (pattern[nextIndex] !== padIndex) {
      setStatus("lost");
      return;
    }

    const nextInput = [...input, padIndex];
    setInput(nextInput);

    if (nextInput.length === pattern.length) {
      setStatus("won");
      onUnlock();
    }
  }

  function handleReset() {
    setPattern(buildSequencePattern(patternLength));
    setActivePad(null);
    setInput([]);
    setSecondsLeft(22);
    setStatus("showing");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Repeat the pattern</span>
        <span>{input.length}/{pattern.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__pads" aria-label={`${tile.title} memory game`}>
        {Array.from({ length: 4 }, (_, index) => (
          <button
            key={`${tile.slug}-pad-${index}`}
            type="button"
            className={cx("wd-grid-modal__pad", activePad === index && "wd-grid-modal__pad--active")}
            onClick={() => handlePadPress(index)}
            disabled={status === "showing"}
          >
            <span>{tile.tokenLabel}</span>
            <strong>Pad {index + 1}</strong>
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Pattern matched. The hidden note is live below."
            : status === "lost"
              ? "Pattern broken. Cue a new reveal."
              : status === "showing"
                ? "Watch the pattern once, then repeat it cleanly."
                : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Restart sequence
        </Button>
      </div>
    </div>
  );
}

function CollectorChallenge({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  if (tile.gameMode === "collect") {
    return <CollectorCollectGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "timing") {
    return <CollectorTimingGame tile={tile} onUnlock={onUnlock} />;
  }

  return <CollectorSequenceGame tile={tile} onUnlock={onUnlock} />;
}

export function WallsDevineCollectorGrid({ tiles }: WallsDevineCollectorGridProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);

  const activeTile = useMemo(() => tiles.find((tile) => tile.slug === activeSlug) ?? null, [activeSlug, tiles]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!activeTile) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSlug(null);
      }
    };

    document.body.style.overflow = "hidden";
    setEasterEggUnlocked(false);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeTile]);

  return (
    <>
      <ol className="wd-grid" aria-label="Walls/Devine release grid">
        {tiles.map((tile) => (
          <li key={tile.title} className={cx("wd-grid__tile", tile.center && "wd-grid__tile--center")}>
            <button type="button" className="wd-grid__trigger" onClick={() => setActiveSlug(tile.slug)}>
              <figure className="wd-grid__figure">
                <div className="wd-grid__image-wrap">
                  <Image src={tile.image} alt={`${tile.title} cover artwork`} sizes="(max-width: 680px) 88vw, (max-width: 1040px) 45vw, 30vw" />
                </div>
                <figcaption>
                  <span>{tile.role}</span>
                  <strong>{tile.title}</strong>
                  <p>{tile.teaser}</p>
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ol>

      {hasMounted && activeTile
        ? createPortal(
            <div className="wd-grid-modal" role="dialog" aria-modal="true" aria-labelledby="wd-grid-modal-title" onClick={() => setActiveSlug(null)}>
              <div className="wd-grid-modal__panel" onClick={(event) => event.stopPropagation()}>
                <div className="wd-grid-modal__header">
                  <div>
                    <p className="wd-grid-modal__eyebrow">{activeTile.role} · {activeTile.challengeLabel}</p>
                    <h2 id="wd-grid-modal-title">{activeTile.title}</h2>
                    <p className="wd-grid-modal__teaser">{activeTile.teaser}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setActiveSlug(null)}>
                    Close
                  </Button>
                </div>

                <div className="wd-grid-modal__body">
                  <aside className="wd-grid-modal__art">
                    <div className="wd-grid-modal__art-frame">
                      <Image src={activeTile.image} alt={`${activeTile.title} artwork`} sizes="(max-width: 900px) 88vw, 34vw" />
                    </div>

                    <dl className="wd-grid-modal__notes">
                      <div>
                        <dt>Story</dt>
                        <dd>{activeTile.storySummary}</dd>
                      </div>
                      <div>
                        <dt>Visual thread</dt>
                        <dd>{activeTile.visualThread}</dd>
                      </div>
                      <div>
                        <dt>Studio note</dt>
                        <dd>{activeTile.makingNote}</dd>
                      </div>
                    </dl>
                  </aside>

                  <div className="wd-grid-modal__experience">
                    <div className="wd-grid-modal__intro-card">
                      <p className="wd-grid-modal__challenge-title">Arcade brief</p>
                      <p>{activeTile.challengePrompt}</p>
                    </div>

                    <CollectorChallenge tile={activeTile} onUnlock={() => setEasterEggUnlocked(true)} />

                    <section className={cx("wd-grid-modal__easter-egg", easterEggUnlocked && "wd-grid-modal__easter-egg--unlocked")}>
                      <p className="wd-grid-modal__challenge-title">Easter egg</p>
                      <h3>{easterEggUnlocked ? activeTile.easterEggTitle : "Locked until the challenge lands"}</h3>
                      <p>{easterEggUnlocked ? activeTile.easterEggBody : "Beat the modal challenge to reveal the hidden note tied to this chapter of the record."}</p>
                    </section>

                    <EcosystemSignupForm
                      className="wd-grid-modal__signup"
                      source={`collector-grid:${activeTile.slug}`}
                      interest={activeTile.interest}
                      eyebrow="Collector circle"
                      title="Stay inside the rollout"
                      description="Get passwords, secret rooms, and first notice when the next artifact or drop opens."
                      submitLabel="Join this chapter"
                      successMessage={`You are in for ${activeTile.title}. Expect first-access notes and hidden-room signals in your inbox.`}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default WallsDevineCollectorGrid;