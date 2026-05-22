"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiLock } from "react-icons/fi";

import { EcosystemRewardClaimCard } from "@/components/rewards/EcosystemRewardClaimCard";
import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cx } from "@/lib/cx";
import { getEcosystemRewardDefinition } from "@/lib/ecosystem/reward-catalog";

import { WallsDevineCollectorAccess } from "./WallsDevineCollectorAccess";

type CollectorChallengeMode =
  | "crown-chase"
  | "vault-code"
  | "orbit-lock"
  | "porch-lights"
  | "seal-alignment"
  | "decay-patch"
  | "spark-ladder"
  | "line-break"
  | "bloom-garden";

export type CollectorGridTile = {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  center?: boolean;
  playerTarget?: string;
  rewardId?: string;
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

type CrownTokenPoint = TokenPoint & {
  driftX: number;
  rise: number;
  duration: number;
  delay: number;
  scale: number;
};

type SequenceStatus = "showing" | "active" | "won" | "lost";

type DecayPatch = TokenPoint & {
  size: number;
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildTokenPoints(count: number, topMin = 10, topMax = 78, leftMin = 10, leftMax = 78) {
  return Array.from({ length: count }, (_, index) => ({
    id: `token-${index}`,
    top: randomInRange(topMin, topMax),
    left: randomInRange(leftMin, leftMax)
  }));
}

function buildCrownTokens(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `crown-${index}`,
    top: randomInRange(22, 84),
    left: randomInRange(10, 88),
    driftX: randomInRange(-1.8, 1.8),
    rise: randomInRange(1.4, 3.8),
    duration: randomInRange(8.2, 12.8),
    delay: randomInRange(-4.4, 0),
    scale: randomInRange(0.92, 1.16)
  } satisfies CrownTokenPoint));
}

function buildSequencePattern(length: number, padCount: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * padCount));
}

function buildVaultCode(length: number) {
  return Array.from({ length }, () => Math.floor(randomInRange(1, 10)));
}

function buildSealPattern(length: number, symbolCount: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * symbolCount));
}

function buildDecayPatches(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `patch-${index}`,
    top: randomInRange(12, 82),
    left: randomInRange(12, 82),
    size: randomInRange(0.9, 1.24)
  } satisfies DecayPatch));
}

const bloomPositions = [
  { id: "bud-1", top: 20, left: 50 },
  { id: "bud-2", top: 36, left: 76 },
  { id: "bud-3", top: 68, left: 68 },
  { id: "bud-4", top: 68, left: 32 },
  { id: "bud-5", top: 36, left: 24 }
] as const;

const poetryRounds = [
  {
    lead: "Smoke rewrites the",
    options: ["myth", "meeting", "checkout"],
    correct: "myth"
  },
  {
    lead: "before it lets you",
    options: ["disconnect", "onstage", "delay"],
    correct: "onstage"
  },
  {
    lead: "and the line lands in",
    options: ["ink", "static", "traffic"],
    correct: "ink"
  }
] as const;

function CollectorCrownChaseGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const targetScore = 5;
  const startingVibe = 76;
  const vibeGainPerCrown = 22;
  const [score, setScore] = useState(0);
  const [vibeLevel, setVibeLevel] = useState(startingVibe);
  const [tokens, setTokens] = useState<CrownTokenPoint[]>(() => buildCrownTokens(5));
  const [status, setStatus] = useState<"active" | "revealing" | "won" | "lost">("active");

  useEffect(() => {
    setScore(0);
    setVibeLevel(startingVibe);
    setTokens(buildCrownTokens(5));
    setStatus("active");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const timer = window.setInterval(() => {
      setVibeLevel((current) => {
        const nextValue = Math.max(current - 0.42, 0);

        if (nextValue <= 0) {
          window.clearInterval(timer);
          setStatus("lost");
          return 0;
        }

        return nextValue;
      });
    }, 90);

    return () => window.clearInterval(timer);
  }, [status, tile.slug]);

  useEffect(() => {
    if (status !== "revealing") {
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setStatus("won");
      onUnlock();
    }, 1100);

    return () => window.clearTimeout(revealTimer);
  }, [onUnlock, status]);

  function handleTokenCollect(tokenId: string) {
    if (status !== "active") {
      return;
    }

    setTokens((current) =>
      current.map((token) =>
        token.id === tokenId
          ? {
              ...token,
              top: randomInRange(22, 84),
              left: randomInRange(10, 88),
              driftX: randomInRange(-1.8, 1.8),
              rise: randomInRange(1.4, 3.8),
              duration: randomInRange(8.2, 12.8),
              delay: randomInRange(-4.4, 0),
              scale: randomInRange(0.92, 1.16)
            }
          : token
      )
    );
    setVibeLevel((current) => Math.min(100, current + vibeGainPerCrown));
    setScore((current) => {
      const nextScore = current + 1;

      if (nextScore >= targetScore) {
        setStatus("revealing");
      }

      return nextScore;
    });
  }

  function handleReset() {
    setScore(0);
    setVibeLevel(startingVibe);
    setTokens(buildCrownTokens(5));
    setStatus("active");
  }

  const hazeBlur = Math.max(1.2, 12 - score * 2);
  const hazeOpacity = Math.max(0.08, 0.34 - score * 0.05);
  const vibePercent = Math.max(0, Math.min(100, vibeLevel));

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Crown run</span>
        <span>{score}/{targetScore} ember crowns</span>
        <span>{status === "revealing" ? "Exhale" : status === "won" ? "Stash unlocked" : "Hold the vibe"}</span>
      </div>

      <div className="wd-grid-modal__vibe-meter" aria-label="Vibe meter">
        <div className="wd-grid-modal__vibe-meter-head">
          <span>Vibe meter</span>
          <strong>{Math.round(vibePercent)}%</strong>
        </div>
        <div className="wd-grid-modal__vibe-meter-track" aria-hidden="true">
          <span className="wd-grid-modal__vibe-meter-fill" style={{ width: `${vibePercent}%` }} />
        </div>
      </div>

      <div
        className={cx(
          "wd-grid-modal__token-field",
          "wd-grid-modal__token-field--crown",
          status === "revealing" && "wd-grid-modal__token-field--exhale",
          status === "won" && "wd-grid-modal__token-field--revealed",
          status === "lost" && "wd-grid-modal__token-field--dim"
        )}
        style={{ "--wd-crown-haze-blur": `${hazeBlur}px`, "--wd-crown-haze-opacity": hazeOpacity } as CSSProperties}
        aria-label={`${tile.title} crown chase`}
      >
        <span className="wd-grid-modal__token-field-haze" aria-hidden="true" />
        {tokens.map((token) => (
          <button
            key={token.id}
            type="button"
            className="wd-grid-modal__token wd-grid-modal__token--crown"
            style={{
              "--wd-token-top": `${token.top}%`,
              "--wd-token-left": `${token.left}%`,
              "--wd-crown-drift-x": `${token.driftX}rem`,
              "--wd-crown-rise": `${token.rise}rem`,
              "--wd-crown-duration": `${token.duration}s`,
              "--wd-crown-delay": `${token.delay}s`,
              "--wd-crown-scale": token.scale
            } as CSSProperties}
            onClick={() => handleTokenCollect(token.id)}
            disabled={status !== "active"}
          >
            {tile.tokenLabel}
          </button>
        ))}

        <div className="wd-grid-modal__crown-pulse" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {status === "revealing" ? (
          <div className="wd-grid-modal__stash-transition" aria-live="polite">
            <p>The room exhales.</p>
            <strong>Smoke clears. Stash incoming.</strong>
          </div>
        ) : null}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "The smoke clears. Your stash is unlocked below."
            : status === "revealing"
              ? "Let the cloud roll out. The stash interface is opening."
            : status === "lost"
              ? "The vibe broke. Spark it again and keep the ember crowns alive."
              : "Keep the vibe alive. Every ember crown you catch reignites the room."}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Recenter the vibe
        </Button>
      </div>
    </div>
  );
}

function CollectorVaultCodeGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [code, setCode] = useState<number[]>(() => buildVaultCode(4));
  const [input, setInput] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(16);
  const [status, setStatus] = useState<SequenceStatus>("showing");

  useEffect(() => {
    setCode(buildVaultCode(4));
    setInput([]);
    setSecondsLeft(16);
    setStatus("showing");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "showing") {
      return;
    }

    const revealTimer = window.setTimeout(() => setStatus("active"), 1800);

    return () => window.clearTimeout(revealTimer);
  }, [status]);

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

  function handleDigitPress(value: number) {
    if (status !== "active") {
      return;
    }

    const nextIndex = input.length;

    if (code[nextIndex] !== value) {
      setStatus("lost");
      return;
    }

    const nextInput = [...input, value];
    setInput(nextInput);

    if (nextInput.length === code.length) {
      setStatus("won");
      onUnlock();
    }
  }

  function handleReset() {
    setCode(buildVaultCode(4));
    setInput([]);
    setSecondsLeft(16);
    setStatus("showing");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Vault code</span>
        <span>{input.length}/{code.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__vault-display" aria-label={`${tile.title} vault code`}>
        {code.map((digit, index) => (
          <span key={`${tile.slug}-digit-${index}`} className={cx(status === "showing" && "wd-grid-modal__vault-digit--visible")}>
            {status === "showing" ? digit : input[index] ?? "•"}
          </span>
        ))}
      </div>

      <div className="wd-grid-modal__keypad">
        {Array.from({ length: 9 }, (_, index) => index + 1).map((digit) => (
          <button
            key={`${tile.slug}-key-${digit}`}
            type="button"
            className="wd-grid-modal__keypad-key"
            onClick={() => handleDigitPress(digit)}
            disabled={status !== "active"}
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Vault cracked. The hidden note is live below."
            : status === "lost"
              ? "Wrong digit. Spin a new combo."
              : status === "showing"
                ? "Read the four digits before the safe shutters down."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          New combo
        </Button>
      </div>
    </div>
  );
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function angleDistance(current: number, target: number) {
  return Math.abs((((current - target + 540) % 360) - 180));
}

function CollectorOrbitLockGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(16);
  const [hits, setHits] = useState(0);
  const [orbAngle, setOrbAngle] = useState(0);
  const [gateAngle, setGateAngle] = useState(24);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");
  const gateWidth = 34;

  useEffect(() => {
    setSecondsLeft(16);
    setHits(0);
    setOrbAngle(0);
    setGateAngle(randomInRange(18, 320));
    setStatus("active");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const movement = window.setInterval(() => {
      setOrbAngle((current) => normalizeAngle(current + 5));
    }, 40);

    return () => window.clearInterval(movement);
  }, [status]);

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

  function handleLock() {
    if (status !== "active") {
      return;
    }

    if (angleDistance(orbAngle, gateAngle) > gateWidth / 2) {
      setSecondsLeft((current) => Math.max(0, current - 2));
      return;
    }

    setHits((current) => {
      const next = current + 1;

      if (next >= 3) {
        setStatus("won");
        onUnlock();
      } else {
        setGateAngle(randomInRange(18, 320));
      }

      return next;
    });
  }

  function handleReset() {
    setSecondsLeft(16);
    setHits(0);
    setOrbAngle(0);
    setGateAngle(randomInRange(18, 320));
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Orbit lock</span>
        <span>{hits}/3</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__orbit" aria-label={`${tile.title} orbit lock`}>
        <div className="wd-grid-modal__orbit-ring" />
        <div className="wd-grid-modal__orbit-gate" style={{ "--wd-orbit-angle": `${gateAngle}deg` } as CSSProperties} />
        <div className="wd-grid-modal__orbit-orb" style={{ "--wd-orbit-angle": `${orbAngle}deg` } as CSSProperties} />
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Three clean locks. The hidden note is live below."
            : status === "lost"
              ? "The cruiser drifted off course. Reset the orbit."
              : tile.challengePrompt}
        </p>
        <div className="wd-grid-modal__game-buttons">
          <Button type="button" variant="primary" size="sm" onClick={handleLock} disabled={status !== "active"}>
            Lock orbit
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
            Reset orbit
          </Button>
        </div>
      </div>
    </div>
  );
}

function CollectorPorchLightsGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const patternLength = 4;
  const padCount = 6;
  const [pattern, setPattern] = useState<number[]>(() => buildSequencePattern(patternLength, padCount));
  const [activePad, setActivePad] = useState<number | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [status, setStatus] = useState<SequenceStatus>("showing");

  useEffect(() => {
    setPattern(buildSequencePattern(patternLength, padCount));
    setActivePad(null);
    setInput([]);
    setSecondsLeft(18);
    setStatus("showing");
  }, [tile.slug]);

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
    setPattern(buildSequencePattern(patternLength, padCount));
    setActivePad(null);
    setInput([]);
    setSecondsLeft(18);
    setStatus("showing");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Porch lights</span>
        <span>{input.length}/{pattern.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__windows" aria-label={`${tile.title} porch light pattern`}>
        {Array.from({ length: padCount }, (_, index) => (
          <button
            key={`${tile.slug}-pad-${index}`}
            type="button"
            className={cx("wd-grid-modal__window", activePad === index && "wd-grid-modal__window--active")}
            onClick={() => handlePadPress(index)}
            disabled={status === "showing"}
          >
            <span>Glow</span>
            <strong>Window {index + 1}</strong>
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Pattern matched. The hidden note is live below."
            : status === "lost"
              ? "The porch went dark. Cue the pattern again."
              : status === "showing"
                ? "Watch the windows once, then replay them cleanly."
                : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Replay lights
        </Button>
      </div>
    </div>
  );
}

function CollectorSealAlignmentGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const symbols = [tile.tokenLabel, "thread", "echo", "arc"];
  const [targetPattern, setTargetPattern] = useState<number[]>(() => buildSealPattern(3, symbols.length));
  const [currentPattern, setCurrentPattern] = useState<number[]>(() => buildSealPattern(3, symbols.length));
  const [movesLeft, setMovesLeft] = useState(8);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setTargetPattern(buildSealPattern(3, symbols.length));
    setCurrentPattern(buildSealPattern(3, symbols.length));
    setMovesLeft(8);
    setStatus("active");
  }, [tile.slug]);

  function handleRingCycle(index: number) {
    if (status !== "active") {
      return;
    }

    const nextPattern = currentPattern.map((value, valueIndex) => (valueIndex === index ? (value + 1) % symbols.length : value));
    const nextMovesLeft = movesLeft - 1;

    setCurrentPattern(nextPattern);
    setMovesLeft(nextMovesLeft);

    if (nextPattern.every((value, valueIndex) => value === targetPattern[valueIndex])) {
      setStatus("won");
      onUnlock();
      return;
    }

    if (nextMovesLeft <= 0) {
      setStatus("lost");
    }
  }

  function handleReset() {
    setTargetPattern(buildSealPattern(3, symbols.length));
    setCurrentPattern(buildSealPattern(3, symbols.length));
    setMovesLeft(8);
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Seal alignment</span>
        <span>{movesLeft} moves</span>
        <span>3 rings</span>
      </div>

      <div className="wd-grid-modal__seal-target" aria-label={`${tile.title} seal target`}>
        {targetPattern.map((value, index) => (
          <span key={`${tile.slug}-target-${index}`}>{symbols[value]}</span>
        ))}
      </div>

      <div className="wd-grid-modal__seal-rings">
        {currentPattern.map((value, index) => (
          <button key={`${tile.slug}-ring-${index}`} type="button" className="wd-grid-modal__seal-ring" onClick={() => handleRingCycle(index)}>
            <span>Ring {index + 1}</span>
            <strong>{symbols[value]}</strong>
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Seal aligned. The hidden note is open below."
            : status === "lost"
              ? "The rings slipped out of lock. Start a fresh pass."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Recast seal
        </Button>
      </div>
    </div>
  );
}

function CollectorDecayPatchGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [integrity, setIntegrity] = useState(100);
  const [repairs, setRepairs] = useState(0);
  const [patches, setPatches] = useState<DecayPatch[]>(() => buildDecayPatches(4));
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setIntegrity(100);
    setRepairs(0);
    setPatches(buildDecayPatches(4));
    setStatus("active");
  }, [tile.slug]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const decayTimer = window.setInterval(() => {
      setIntegrity((current) => {
        const next = current - 7;

        if (next <= 0) {
          window.clearInterval(decayTimer);
          setStatus("lost");
          return 0;
        }

        return next;
      });

      setPatches(buildDecayPatches(4));
    }, 1000);

    return () => window.clearInterval(decayTimer);
  }, [status]);

  function handlePatch(patchId: string) {
    if (status !== "active") {
      return;
    }

    setPatches((current) => current.map((patch) => (patch.id === patchId ? { ...patch, top: randomInRange(12, 82), left: randomInRange(12, 82), size: randomInRange(0.9, 1.24) } : patch)));
    setIntegrity((current) => Math.min(100, current + 10));
    setRepairs((current) => {
      const next = current + 1;

      if (next >= 6) {
        setStatus("won");
        onUnlock();
      }

      return next;
    });
  }

  function handleReset() {
    setIntegrity(100);
    setRepairs(0);
    setPatches(buildDecayPatches(4));
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Decay patch</span>
        <span>{repairs}/6 repairs</span>
        <span>{integrity}% intact</span>
      </div>

      <div className="wd-grid-modal__token-field wd-grid-modal__token-field--decay" aria-label={`${tile.title} decay patch`}>
        <div className="wd-grid-modal__integrity-bar">
          <span style={{ width: `${integrity}%` }} />
        </div>

        {patches.map((patch) => (
          <button
            key={patch.id}
            type="button"
            className="wd-grid-modal__patch"
            style={{ "--wd-token-top": `${patch.top}%`, "--wd-token-left": `${patch.left}%`, "--wd-patch-size": patch.size } as CSSProperties}
            onClick={() => handlePatch(patch.id)}
            disabled={status !== "active"}
          >
            patch
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "The structure holds. The hidden note is live below."
            : status === "lost"
              ? "The room collapsed. Start a fresh repair pass."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Repair again
        </Button>
      </div>
    </div>
  );
}

function CollectorSparkLadderGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(13);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setCurrentStep(1);
    setSecondsLeft(13);
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
  }, [status]);

  function handleStepClick(step: number) {
    if (status !== "active") {
      return;
    }

    if (step !== currentStep) {
      setStatus("lost");
      return;
    }

    if (step === 5) {
      setStatus("won");
      onUnlock();
      return;
    }

    setCurrentStep((current) => current + 1);
  }

  function handleReset() {
    setCurrentStep(1);
    setSecondsLeft(13);
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Spark ladder</span>
        <span>Step {currentStep}/5</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__ladder" aria-label={`${tile.title} spark ladder`}>
        {Array.from({ length: 5 }, (_, index) => index + 1).map((step) => (
          <button
            key={`${tile.slug}-step-${step}`}
            type="button"
            className={cx(
              "wd-grid-modal__ladder-step",
              step < currentStep && "wd-grid-modal__ladder-step--complete",
              step === currentStep && status === "active" && "wd-grid-modal__ladder-step--current"
            )}
            onClick={() => handleStepClick(step)}
          >
            <span>Fuse</span>
            <strong>{String(step).padStart(2, "0")}</strong>
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Fuse lit end to end. The hidden note is live below."
            : status === "lost"
              ? "The spark broke. Start from step one."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Relight fuse
        </Button>
      </div>
    </div>
  );
}

function CollectorLineBreakGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");
  const round = poetryRounds[roundIndex];

  useEffect(() => {
    setRoundIndex(0);
    setSecondsLeft(18);
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
  }, [status]);

  function handleChoice(option: string) {
    if (status !== "active") {
      return;
    }

    if (option !== round.correct) {
      setStatus("lost");
      return;
    }

    if (roundIndex === poetryRounds.length - 1) {
      setStatus("won");
      onUnlock();
      return;
    }

    setRoundIndex((current) => current + 1);
  }

  function handleReset() {
    setRoundIndex(0);
    setSecondsLeft(18);
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Line break</span>
        <span>{roundIndex + 1}/{poetryRounds.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__line-card" aria-label={`${tile.title} line break`}>
        <p>{round.lead}</p>
      </div>

      <div className="wd-grid-modal__options">
        {round.options.map((option) => (
          <button key={`${tile.slug}-${option}`} type="button" className="wd-grid-modal__option" onClick={() => handleChoice(option)}>
            {option}
          </button>
        ))}
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "The line lands. The hidden note is live below."
            : status === "lost"
              ? "Wrong word. Start the stanza again."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Redraft line
        </Button>
      </div>
    </div>
  );
}

function CollectorBloomGardenGame({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  const [openBuds, setOpenBuds] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setOpenBuds([]);
    setSecondsLeft(18);
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
  }, [status]);

  function handleBudOpen(id: string) {
    if (status !== "active" || openBuds.includes(id)) {
      return;
    }

    setOpenBuds((current) => [...current, id]);
  }

  function handleCenterBloom() {
    if (status !== "active" || openBuds.length !== bloomPositions.length) {
      return;
    }

    setStatus("won");
    onUnlock();
  }

  function handleReset() {
    setOpenBuds([]);
    setSecondsLeft(18);
    setStatus("active");
  }

  return (
    <div className="wd-grid-modal__game-shell">
      <div className="wd-grid-modal__game-status">
        <span>Bloom garden</span>
        <span>{openBuds.length}/{bloomPositions.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="wd-grid-modal__garden" aria-label={`${tile.title} bloom garden`}>
        {bloomPositions.map((bud) => {
          const isOpen = openBuds.includes(bud.id);

          return (
            <button
              key={bud.id}
              type="button"
              className={cx("wd-grid-modal__bud", isOpen && "wd-grid-modal__bud--open")}
              style={{ "--wd-token-top": `${bud.top}%`, "--wd-token-left": `${bud.left}%` } as CSSProperties}
              onClick={() => handleBudOpen(bud.id)}
              disabled={status !== "active" || isOpen}
            >
              {isOpen ? "open" : "bud"}
            </button>
          );
        })}

        <button
          type="button"
          className={cx("wd-grid-modal__garden-core", openBuds.length === bloomPositions.length && "wd-grid-modal__garden-core--ready")}
          onClick={handleCenterBloom}
          disabled={openBuds.length !== bloomPositions.length || status !== "active"}
        >
          <span>Final bloom</span>
        </button>
      </div>

      <div className="wd-grid-modal__game-footer">
        <p>
          {status === "won"
            ? "Garden opened. The hidden note is live below."
            : status === "lost"
              ? "The light faded. Grow it again."
              : tile.challengePrompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Regrow bloom
        </Button>
      </div>
    </div>
  );
}

function CollectorChallenge({ tile, onUnlock }: { tile: CollectorGridTile; onUnlock: () => void }) {
  if (tile.gameMode === "crown-chase") {
    return <CollectorCrownChaseGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "vault-code") {
    return <CollectorVaultCodeGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "orbit-lock") {
    return <CollectorOrbitLockGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "porch-lights") {
    return <CollectorPorchLightsGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "seal-alignment") {
    return <CollectorSealAlignmentGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "decay-patch") {
    return <CollectorDecayPatchGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "spark-ladder") {
    return <CollectorSparkLadderGame tile={tile} onUnlock={onUnlock} />;
  }

  if (tile.gameMode === "line-break") {
    return <CollectorLineBreakGame tile={tile} onUnlock={onUnlock} />;
  }

  return <CollectorBloomGardenGame tile={tile} onUnlock={onUnlock} />;
}

export function WallsDevineCollectorGrid({ tiles }: WallsDevineCollectorGridProps) {
  const liveTileSlug = "resolve";
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);
  const [exploredSlugs, setExploredSlugs] = useState<string[]>([]);

  const activeTile = useMemo(() => tiles.find((tile) => tile.slug === activeSlug) ?? null, [activeSlug, tiles]);
  const activeReward = useMemo(() => getEcosystemRewardDefinition(activeTile?.rewardId), [activeTile?.rewardId]);

  function getTileBadgeLabel(tile: CollectorGridTile) {
    if (tile.center) {
      return null;
    }

    const digits = tile.role.replace(/\D+/g, "");
    return digits ? digits.padStart(2, "0") : null;
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem("wd_unlocked_chapters");

      if (stored) {
        setExploredSlugs(JSON.parse(stored) as string[]);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (!activeSlug || typeof window === "undefined") {
      return;
    }

    const tile = tiles.find((t) => t.slug === activeSlug);

    if (!tile || tile.center) {
      return;
    }

    setExploredSlugs((current) => {
      if (current.includes(activeSlug)) {
        return current;
      }

      const updated = [...current, activeSlug];

      try {
        localStorage.setItem("wd_unlocked_chapters", JSON.stringify(updated));
      } catch {
        // localStorage unavailable
      }

      return updated;
    });
  }, [activeSlug, tiles]);

  useBodyScrollLock(Boolean(activeTile));

  useEffect(() => {
    if (!activeTile) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSlug(null);
      }
    };

    setEasterEggUnlocked(false);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeTile]);

  return (
    <>
      <ol className="wd-grid" aria-label="Walls/Devine release grid">
        {tiles.map((tile) => {
          const isLive = tile.slug === liveTileSlug;
          const isLocked = !tile.center && !isLive;

          return (
            <li
              key={tile.title}
              className={cx(
                "wd-grid__tile",
                `wd-grid__tile--${tile.slug}`,
                tile.center && "wd-grid__tile--center",
                isLive && "wd-grid__tile--live",
                isLocked && "wd-grid__tile--locked"
              )}
            >
              <button type="button" className="wd-grid__trigger" aria-label={`Open ${tile.title}`} onClick={() => setActiveSlug(tile.slug)}>
                <figure className="wd-grid__figure">
                  <div className="wd-grid__image-wrap">
                    {isLive ? (
                      <span className="wd-grid__live-badge" aria-label="Live now">
                        <span className="wd-grid__live-badge__dot" aria-hidden="true" />
                        LIVE
                      </span>
                    ) : (
                      getTileBadgeLabel(tile) ? <span className="wd-grid__badge">{getTileBadgeLabel(tile)}</span> : null
                    )}
                    {isLocked ? (
                      <span className="wd-grid__lock-icon" aria-hidden="true">
                        <FiLock />
                      </span>
                    ) : null}
                    <Image src={tile.image} alt={`${tile.title} cover artwork`} sizes="(max-width: 680px) 88vw, (max-width: 1040px) 45vw, 30vw" />
                  </div>
                </figure>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="wd-grid__progress" aria-live="polite">
        {`You've explored ${Math.min(exploredSlugs.length, 8)} of 8 chapters.`}
      </p>

      {hasMounted && activeTile
        ? createPortal(
            <div className="wd-grid-modal" role="dialog" aria-modal="true" aria-labelledby="wd-grid-modal-title" onClick={() => setActiveSlug(null)}>
              <div className="wd-grid-modal__panel" onClick={(event) => event.stopPropagation()}>
                <div className="wd-grid-modal__room-overlay" aria-hidden="true">
                  <span className="wd-grid-modal__room-overlay-script">The Collector&apos;s Cabinet</span>
                  <span className="wd-grid-modal__room-overlay-subtitle">Entering {activeTile.title}</span>
                </div>

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

                    <article className="wd-grid-modal__fact-card">
                      <p className="wd-grid-modal__challenge-title">Collector note</p>
                      <p>{activeTile.storySummary}</p>
                    </article>

                    <article className="wd-grid-modal__fact-card">
                      <p className="wd-grid-modal__challenge-title">Studio spark</p>
                      <p>{activeTile.makingNote}</p>
                    </article>
                  </aside>

                  <div className="wd-grid-modal__experience">
                    <div className="wd-grid-modal__challenge-card">
                      <p className="wd-grid-modal__challenge-title">Challenge</p>
                      <h3>{activeTile.challengeLabel}</h3>
                      <p>{activeTile.challengePrompt}</p>
                    </div>

                    <CollectorChallenge tile={activeTile} onUnlock={() => setEasterEggUnlocked(true)} />

                    {activeReward ? (
                      <EcosystemRewardClaimCard
                        reward={activeReward}
                        source={`collector-grid:${activeTile.slug}`}
                        unlocked={easterEggUnlocked}
                        className="wd-grid-modal__reward-claim"
                      />
                    ) : (
                      <section className={cx("wd-grid-modal__easter-egg", easterEggUnlocked && "wd-grid-modal__easter-egg--unlocked")}>
                        <p className="wd-grid-modal__challenge-title">Easter egg</p>
                        <h3>{easterEggUnlocked ? activeTile.easterEggTitle : "Locked until the challenge lands"}</h3>
                        <p>{easterEggUnlocked ? activeTile.easterEggBody : "Beat the game to reveal the hidden note for this chapter."}</p>
                      </section>
                    )}

                    <WallsDevineCollectorAccess
                      className="wd-grid-modal__signup"
                      source={`collector-grid:${activeTile.slug}`}
                      interest={activeTile.interest}
                      cardEyebrow="Collector access"
                      cardTitle={`Keep ${activeTile.title} open`}
                      cardDescription="Get the next hidden note, return entry, and collector signal for this chapter without waiting for the public recap."
                      benefits={["Hidden-room returns", "Chapter-specific signals"]}
                      triggerLabel="Enter The Signal Room"
                      modalTitle="Enter The Signal Room"
                      modalDescription={`Drop your email for ${activeTile.title} updates, return signals, journal fragments, and collector-only access.`}
                      submitLabel="Join this chapter"
                      successMessage={`You are in for ${activeTile.title}. Watch your inbox for the next signal, hidden note, and room opening.`}
                      note="Used for hidden-room returns, first-listen signals, and collector drops."
                      variant="inline"
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