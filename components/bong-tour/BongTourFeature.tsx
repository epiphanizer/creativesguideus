"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";

import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Button } from "@/components/ui/Button";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import { EcosystemSignupForm } from "@/components/walls-devine/EcosystemSignupForm";

type RoomAction = {
  label: string;
  href?: string;
  roomKey?: "producer" | "collector";
  outline?: boolean;
};

type RoomSignup = {
  source: string;
  interest: string;
  submitLabel: string;
  successMessage: string;
  note: string;
};

type RoomChallengeMode = "seal-alignment" | "vault-code" | "corridor-choice" | "token-spin";

type RoomChallenge = {
  label: string;
  prompt: string;
  mode: RoomChallengeMode;
  tokenLabel: string;
  noteLabel?: string;
  noteTitle: string;
  noteBody: string;
};

type ExperienceRoom = {
  slug: string;
  eyebrow: string;
  title: string;
  ambientLabel: string;
  ambientSubtitle: string;
  kicker: string;
  description: string;
  chips: string[];
  beats?: string[];
  actions: RoomAction[];
  signup?: RoomSignup;
  challenge?: RoomChallenge;
};

type CuePoster = {
  id: string;
  title: string;
  badge: string;
  playerTarget: string;
  image: StaticImageData;
  tagline: string;
  description: string;
  highlights: string[];
  room: ExperienceRoom;
};

type CollectibleTile = {
  slug: string;
  badge: string;
  title: string;
  teaser: string;
  challenge: string;
  reward: string;
  room: ExperienceRoom;
};

type RoomChallengeProps = {
  challenge: RoomChallenge;
  roomSlug: string;
  onUnlock: () => void;
};

type CorridorRound = {
  lead: string;
  options: string[];
  correct: string;
};

function buildVaultCode(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
}

function buildSealPattern(length: number, symbolCount: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * symbolCount));
}

const corridorRounds: CorridorRound[] = [
  {
    lead: "Take the first hallway",
    options: ["Ticket booth", "Green room", "Motel neon"],
    correct: "Green room"
  },
  {
    lead: "Follow the whisper",
    options: ["Service tunnel", "VIP stairs", "Loading dock"],
    correct: "Service tunnel"
  },
  {
    lead: "Pick the last turn",
    options: ["Projection booth", "Back office", "Side stage"],
    correct: "Projection booth"
  }
];

function RoomVaultCodeGame({ challenge, roomSlug, onUnlock }: RoomChallengeProps) {
  const [code, setCode] = useState<number[]>(() => buildVaultCode(4));
  const [input, setInput] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(16);
  const [status, setStatus] = useState<"showing" | "active" | "won" | "lost">("showing");

  useEffect(() => {
    setCode(buildVaultCode(4));
    setInput([]);
    setSecondsLeft(16);
    setStatus("showing");
  }, [roomSlug]);

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
  }, [status, roomSlug]);

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
    <div className="bt-room-modal__game-shell">
      <div className="bt-room-modal__game-status">
        <span>Vault code</span>
        <span>{input.length}/{code.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="bt-room-modal__vault-display" aria-label="Vault code display">
        {code.map((digit, index) => (
          <span key={`${roomSlug}-digit-${index}`}>{status === "showing" ? digit : input[index] ?? "•"}</span>
        ))}
      </div>

      <div className="bt-room-modal__keypad">
        {Array.from({ length: 9 }, (_, index) => index + 1).map((digit) => (
          <button
            key={`${roomSlug}-key-${digit}`}
            type="button"
            className="bt-room-modal__game-button bt-room-modal__game-button--pad"
            onClick={() => handleDigitPress(digit)}
            disabled={status !== "active"}
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="bt-room-modal__game-footer">
        <p>
          {status === "won"
            ? "Vault cracked. The hidden note is live below."
            : status === "lost"
              ? "Wrong digit. Spin a new combo."
              : status === "showing"
                ? "Read the four digits before the pass shutters down."
                : challenge.prompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          New combo
        </Button>
      </div>
    </div>
  );
}

function RoomSealAlignmentGame({ challenge, roomSlug, onUnlock }: RoomChallengeProps) {
  const symbols = [challenge.tokenLabel, "smoke", "river", "ember"];
  const [targetPattern, setTargetPattern] = useState<number[]>(() => buildSealPattern(3, symbols.length));
  const [currentPattern, setCurrentPattern] = useState<number[]>(() => buildSealPattern(3, symbols.length));
  const [movesLeft, setMovesLeft] = useState(8);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setTargetPattern(buildSealPattern(3, symbols.length));
    setCurrentPattern(buildSealPattern(3, symbols.length));
    setMovesLeft(8);
    setStatus("active");
  }, [roomSlug, symbols.length]);

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
    <div className="bt-room-modal__game-shell">
      <div className="bt-room-modal__game-status">
        <span>Seal alignment</span>
        <span>{movesLeft} moves</span>
        <span>3 rings</span>
      </div>

      <div className="bt-room-modal__seal-target" aria-label="Seal target">
        {targetPattern.map((value, index) => (
          <span key={`${roomSlug}-target-${index}`}>{symbols[value]}</span>
        ))}
      </div>

      <div className="bt-room-modal__seal-rings">
        {currentPattern.map((value, index) => (
          <button key={`${roomSlug}-ring-${index}`} type="button" className="bt-room-modal__seal-ring" onClick={() => handleRingCycle(index)}>
            <span>Ring {index + 1}</span>
            <strong>{symbols[value]}</strong>
          </button>
        ))}
      </div>

      <div className="bt-room-modal__game-footer">
        <p>
          {status === "won"
            ? "Seal aligned. The hidden note is open below."
            : status === "lost"
              ? "The rings slipped out of lock. Start a fresh pass."
              : challenge.prompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Recast seal
        </Button>
      </div>
    </div>
  );
}

function RoomCorridorChoiceGame({ challenge, roomSlug, onUnlock }: RoomChallengeProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");
  const round = corridorRounds[roundIndex];

  useEffect(() => {
    setRoundIndex(0);
    setSecondsLeft(18);
    setStatus("active");
  }, [roomSlug]);

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
  }, [status, roomSlug]);

  function handleChoice(option: string) {
    if (status !== "active") {
      return;
    }

    if (option !== round.correct) {
      setStatus("lost");
      return;
    }

    if (roundIndex === corridorRounds.length - 1) {
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
    <div className="bt-room-modal__game-shell">
      <div className="bt-room-modal__game-status">
        <span>Corridor key</span>
        <span>{roundIndex + (status === "won" ? 1 : 0)}/{corridorRounds.length}</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="bt-room-modal__choice-prompt">
        <span>{round.lead}</span>
      </div>

      <div className="bt-room-modal__choice-grid">
        {round.options.map((option) => (
          <button key={`${roomSlug}-${option}`} type="button" className="bt-room-modal__choice-button" onClick={() => handleChoice(option)}>
            {option}
          </button>
        ))}
      </div>

      <div className="bt-room-modal__game-footer">
        <p>
          {status === "won"
            ? "Shadow corridor found. The hidden note is live below."
            : status === "lost"
              ? "Wrong door. Start the key run again."
              : challenge.prompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Reset corridor
        </Button>
      </div>
    </div>
  );
}

function RoomTokenSpinGame({ challenge, roomSlug, onUnlock }: RoomChallengeProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(14);
  const [status, setStatus] = useState<"active" | "won" | "lost">("active");

  useEffect(() => {
    setCurrentStep(1);
    setSecondsLeft(14);
    setStatus("active");
  }, [roomSlug]);

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
  }, [status, roomSlug]);

  function handleStep(step: number) {
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
    setSecondsLeft(14);
    setStatus("active");
  }

  return (
    <div className="bt-room-modal__game-shell">
      <div className="bt-room-modal__game-status">
        <span>Token spin</span>
        <span>Step {currentStep}/5</span>
        <span>{secondsLeft}s</span>
      </div>

      <div className="bt-room-modal__ladder" aria-label="Token spin sequence">
        {Array.from({ length: 5 }, (_, index) => index + 1).map((step) => (
          <button
            key={`${roomSlug}-step-${step}`}
            type="button"
            className={`bt-room-modal__ladder-step${step < currentStep ? " bt-room-modal__ladder-step--complete" : ""}${step === currentStep && status === "active" ? " bt-room-modal__ladder-step--current" : ""}`}
            onClick={() => handleStep(step)}
          >
            <span>Spin</span>
            <strong>{String(step).padStart(2, "0")}</strong>
          </button>
        ))}
      </div>

      <div className="bt-room-modal__game-footer">
        <p>
          {status === "won"
            ? "Sequence held. The hidden note is live below."
            : status === "lost"
              ? "The token slipped the pattern. Start again."
              : challenge.prompt}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
          Reset spin
        </Button>
      </div>
    </div>
  );
}

function RoomChallengeExperience({ challenge, roomSlug, onUnlock }: RoomChallengeProps) {
  if (challenge.mode === "seal-alignment") {
    return <RoomSealAlignmentGame challenge={challenge} roomSlug={roomSlug} onUnlock={onUnlock} />;
  }

  if (challenge.mode === "vault-code") {
    return <RoomVaultCodeGame challenge={challenge} roomSlug={roomSlug} onUnlock={onUnlock} />;
  }

  if (challenge.mode === "corridor-choice") {
    return <RoomCorridorChoiceGame challenge={challenge} roomSlug={roomSlug} onUnlock={onUnlock} />;
  }

  return <RoomTokenSpinGame challenge={challenge} roomSlug={roomSlug} onUnlock={onUnlock} />;
}

const keyDetails = [
  { label: "Portal", detail: "Collector rooms and cue bridges" },
  { label: "Myth", detail: "Sacred comedy on Sunset Boulevard" },
  { label: "Soundtrack", detail: "Walls/Devine exits built in" }
];

const portalRooms: Record<string, ExperienceRoom> = {
  producer: {
    slug: "producer-portal",
    eyebrow: "Smoke room",
    title: "Enter the smoke room",
    ambientLabel: "Smoke room",
    ambientSubtitle: "Deck, tone, and score in one move",
    kicker: "For producers, financiers, and creative partners who want the shortest route to the full experience stack.",
    description:
      "This room gathers the poster, story spine, soundtrack bridge, and object archive into one conversation without stepping outside the world.",
    chips: ["Story spine", "Soundtrack alignment", "Object archive"],
    beats: [
      "Lead with the poster and myth signal.",
      "Move into cue-world proof via Walls/Devine.",
      "Land on packaging and partner fit instead of oversharing plot."
    ],
    actions: [
      { label: "Connect about Bong Tour", href: "/#contact" },
      { label: "Open Walls/Devine", href: "/walls-devine", outline: true }
    ],
    signup: {
      source: "bong-tour-producer-portal",
      interest: "Bong Tour producer portal",
      submitLabel: "Request the room key",
      successMessage: "You are in. Watch for the private deck route and next Bong Tour signal.",
      note: "Used for deck access, soundtrack conversations, and partner follow-up only."
    }
  },
  collector: {
    slug: "collector-room",
    eyebrow: "Collector's room",
    title: "Enter the collector's room",
    ambientLabel: "Collector's room",
    ambientSubtitle: "Artifact vault and clue archive",
    kicker: "The private side of Bong Tour: object archive, clue drops, and found rewards that make the myth feel touchable.",
    description:
      "Open this takeover when you want Bong Tour to behave like a returnable story object instead of a static overview. The collector room is where clues, artifacts, and soundtrack-linked unlocks surface first.",
    chips: ["Artifact vault", "Cue-linked clues", "Game-locked rewards"],
    beats: [
      "Games should reveal objects, not marketing copy.",
      "The best rewards should stay hidden until the room opens.",
      "Walls/Devine remains the live soundtrack exit."
    ],
    actions: [
      { label: "Open cue rooms", href: "#score-sketches" },
      { label: "Visit Walls/Devine", href: "/walls-devine", outline: true }
    ],
    signup: {
      source: "bong-tour-collector-room",
      interest: "Bong Tour collector room",
      submitLabel: "Get collector-room access",
      successMessage: "You are in. Watch for artifacts, clue drops, and the next Bong Tour room opening.",
      note: "Collector access only. Used for artifact notes, soundtrack-linked clues, and hidden-room updates."
    },
    challenge: {
      label: "Archive seal",
      prompt: "Align the archive seal before the drawer locks again.",
      mode: "seal-alignment",
      tokenLabel: "archive",
      noteLabel: "Collectible unlocked",
      noteTitle: "Sealed treatment unlocked",
      noteBody: "The treatment belongs here as a found object inside the collector room. Keep it gated, collectible, and tied to the room logic instead of advertising it on the page."
    }
  }
};

const musicPosters: CuePoster[] = [
  {
    id: "score-joint-queen",
    title: "Joint Queen",
    badge: "Cue Room 01",
    playerTarget: "joint-queen",
    image: jointQueenImage,
    tagline: "Psych-funk swagger for the Comedy Store takeover.",
    description:
      "The first cue room proves the film can feel already scored: smoke, confidence, and a slightly dangerous sense of arrival.",
    highlights: ["Psych-funk built for a cult entrance", "Anchors the first true takeover beat"],
    room: {
      slug: "cue-room-joint-queen",
      eyebrow: "Cue room",
      title: "Joint Queen takeover",
      ambientLabel: "Cue room 01",
      ambientSubtitle: "Comedy Store ignition",
      kicker: "This is the sound of the screenplay stepping out of deck mode and into live motion.",
      description:
        "Joint Queen should frame the first moment Bong Tour feels inevitable. Swagger first, exposition later, with a direct handoff into the companion listening room.",
      chips: ["Comedy Store montage", "Psych-funk cue", "Cult-premium posture"],
      beats: ["Built for struts and jump cuts.", "Lets the satire feel cinematic, not explanatory.", "Works best when it visibly connects to Walls/Devine."],
      actions: [
        { label: "Play in listening room", href: "?player=joint-queen#walls-devine-listening-room" },
        { label: "Talk soundtrack fit", href: "/#contact", outline: true }
      ]
    }
  },
  {
    id: "score-stash-daddy",
    title: "Stash Daddy",
    badge: "Cue Room 02",
    playerTarget: "stash-daddy",
    image: stashDaddyImage,
    tagline: "Backroom heist pulse with neon menace.",
    description:
      "A low-end crawl for handshakes, side deals, and the specific Hollywood feeling that every invitation carries a trap door.",
    highlights: ["Backstage pressure without losing humor", "Turns packaging and power into a groove"],
    room: {
      slug: "cue-room-stash-daddy",
      eyebrow: "Cue room",
      title: "Stash Daddy vault",
      ambientLabel: "Cue room 02",
      ambientSubtitle: "Backroom pressure chamber",
      kicker: "The cue that makes the underworld feel stylish enough to seduce and sharp enough to scare.",
      description:
        "Stash Daddy belongs to the meetings behind the meetings. It gives the screenplay a tactile world of codes, handlers, and low-lit leverage.",
      chips: ["Backroom plotting", "Low-end authority", "Hollywood trapdoor energy"],
      beats: ["Supports late-night deal scenes.", "Bridges satire and threat cleanly.", "Keeps the collectible rollout grounded in attitude."],
      actions: [
        { label: "Play in listening room", href: "?player=stash-daddy#walls-devine-listening-room" },
        { label: "Enter the producer room", roomKey: "producer", outline: true }
      ]
    }
  },
  {
    id: "score-space-cruiser",
    title: "Space Cruiser",
    badge: "Cue Room 03",
    playerTarget: "space-cruiser",
    image: spaceCruiserImage,
    tagline: "Diaspora dreamscape for the return to source.",
    description:
      "The cue that lets the myth breathe: river memory, processed tanpura, and lift that feels earned rather than ornamental.",
    highlights: ["Connects Hollywood excess to India with grace", "Feels like the relic remembering where it came from"],
    room: {
      slug: "cue-room-space-cruiser",
      eyebrow: "Cue room",
      title: "Space Cruiser drift",
      ambientLabel: "Cue room 03",
      ambientSubtitle: "Return-to-source atmosphere",
      kicker: "This room turns the page from satire into myth without losing the campaign logic.",
      description:
        "Space Cruiser holds the emotional altitude shift. It is the cue that proves Bong Tour can end in revelation instead of just escalation.",
      chips: ["Ganges lift", "Diaspora dreamscape", "Final-act release"],
      beats: ["Lets the river imagery open up.", "Supports the India return with dignity.", "Creates the cleanest bridge into the companion album world."],
      actions: [
        { label: "Play in listening room", href: "?player=space-cruiser#walls-devine-listening-room" },
        { label: "Open collector room", roomKey: "collector", outline: true }
      ]
    }
  }
];

const collectibleTiles: CollectibleTile[] = [
  {
    slug: "ganges-relic",
    badge: "Collectible 01",
    title: "Ganges Relic",
    teaser: "The origin object: sacred river memory trapped inside a pitch-world artifact.",
    challenge: "Align the river sigil before the smoke clears.",
    reward: "Unlock the mythology-first framing for the whole campaign.",
    room: {
      slug: "collectible-room-ganges-relic",
      eyebrow: "Collector object",
      title: "Ganges Relic chamber",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Origin artifact",
      kicker: "The first collectible should not feel merch-adjacent. It should feel like a myth key.",
      description:
        "This room frames the relic as the worldbuilding engine. Everything from the poster world to final-act gravity gets cleaner once the object feels sacred and cinematic.",
      chips: ["Origin story", "Sacred object", "Poster-first myth"],
      beats: ["Best used as the collector anchor.", "Lets the page lead with story gravity.", "Creates an obvious return-to-source motif."],
      actions: [
        { label: "Connect about Bong Tour", href: "/#contact" },
        { label: "Open cue posters", href: "#score-sketches", outline: true }
      ],
      signup: {
        source: "bong-tour-ganges-relic",
        interest: "Bong Tour Ganges Relic collector list",
        submitLabel: "Claim relic access",
        successMessage: "You are in. Watch for the next relic note and collector-room update.",
        note: "Collector access only. Used for artifact notes and hidden-room openings."
      },
      challenge: {
        label: "River sigil",
        prompt: "Align the river sigil before the smoke clears.",
        mode: "seal-alignment",
        tokenLabel: "relic",
        noteTitle: "Origin lock opened",
        noteBody: "The relic works best when the page treats the object as sacred first and explanatory second. That is the actual campaign engine."
      }
    }
  },
  {
    slug: "comedy-store-pass",
    badge: "Collectible 02",
    title: "Comedy Store Pass",
    teaser: "A backstage credential that turns the midsection of the page into a takeover instead of a summary.",
    challenge: "Memorize the room code before the card dissolves.",
    reward: "Unlock the swagger-heavy campaign language for the initiation chapter.",
    room: {
      slug: "collectible-room-comedy-store-pass",
      eyebrow: "Collector object",
      title: "Comedy Store Pass",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Initiation credential",
      kicker: "This is the collectible that lets the page feel like it has private doors.",
      description:
        "The pass reframes the Comedy Store chapter as an access fantasy: secret rooms, escalating chaos, and a score-backed sense of being pulled somewhere dangerous.",
      chips: ["Backstage key", "Initiation chapter", "Private-door energy"],
      beats: ["Lets CTAs become hidden entries.", "Pairs naturally with Joint Queen.", "Keeps the satire stylish instead of flat."],
      actions: [
        { label: "Open Joint Queen", href: "/walls-devine?player=joint-queen#walls-devine-listening-room" },
        { label: "Enter the smoke room", roomKey: "producer", outline: true }
      ],
      signup: {
        source: "bong-tour-comedy-store-pass",
        interest: "Bong Tour Comedy Store Pass collector list",
        submitLabel: "Get the backstage pass",
        successMessage: "You are in. Watch for backstage notes and the next room code.",
        note: "Used for collector-room codes, cue notes, and backstage-style rollout updates."
      },
      challenge: {
        label: "Room code",
        prompt: "Memorize the room code before the card dissolves.",
        mode: "vault-code",
        tokenLabel: "pass",
        noteTitle: "Backroom access granted",
        noteBody: "This chapter works when the page behaves like private access instead of plot summary. The pass is permission to keep the initiation stylish."
      }
    }
  },
  {
    slug: "lollipop-guild-key",
    badge: "Collectible 03",
    title: "Lollipop Guild Key",
    teaser: "A motel-night object for the industry shadow system everybody references and nobody explains.",
    challenge: "Pick the right corridor before the keycard deactivates.",
    reward: "Unlock the noir layer without burying the comedy.",
    room: {
      slug: "collectible-room-lollipop-guild-key",
      eyebrow: "Collector object",
      title: "Lollipop Guild Key",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Motel-night shadow layer",
      kicker: "This object gives the campaign a threat signature without turning it grim for the sake of it.",
      description:
        "Use the key as a portal into the underworld logic of the screenplay: strange warnings, industry whispers, and enough menace to sharpen the satire.",
      chips: ["Motel-night shadow", "Industry underworld", "Noir pressure"],
      beats: ["Pairs cleanly with Stash Daddy.", "Adds return-value to the page.", "Turns exposition into a collectible clue."],
      actions: [
        { label: "Open Stash Daddy", href: "/walls-devine?player=stash-daddy#walls-devine-listening-room" },
        { label: "Open collector room", roomKey: "collector", outline: true }
      ],
      signup: {
        source: "bong-tour-lollipop-guild-key",
        interest: "Bong Tour Lollipop Guild Key collector list",
        submitLabel: "Hold the keycard",
        successMessage: "You are in. Watch for noir-room drops and the next key signal.",
        note: "Used for clue drops, collector access, and private room notes."
      },
      challenge: {
        label: "Corridor key",
        prompt: "Pick the right corridor before the keycard deactivates.",
        mode: "corridor-choice",
        tokenLabel: "key",
        noteTitle: "Shadow corridor found",
        noteBody: "The noir layer only works when it sharpens the comedy instead of smothering it. The hidden route is pressure, not gloom for its own sake."
      }
    }
  },
  {
    slug: "upper-management-token",
    badge: "Collectible 04",
    title: "Upper Management Token",
    teaser: "The sequel machine rendered as a polished object that feels seductive and ominous at the same time.",
    challenge: "Keep the token spinning until the sequel offer appears.",
    reward: "Unlock the ending's franchise bait without flattening the emotional close.",
    room: {
      slug: "collectible-room-upper-management-token",
      eyebrow: "Collector object",
      title: "Upper Management Token",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Sequel-machine bait",
      kicker: "This collectible should feel like the industry smiling while it tries to own the myth.",
      description:
        "The token turns the ending into a premium tease instead of a generic sequel wink. It keeps the satire sharp while preserving the possibility of a larger world.",
      chips: ["Sequel machine", "Franchise bait", "Final image pressure"],
      beats: ["Belongs near the closing invitation.", "Lets the campaign end on appetite.", "Protects the myth while opening the door."],
      actions: [
        { label: "Connect about Bong Tour", href: "/#contact" },
        { label: "Visit Walls/Devine", href: "/walls-devine", outline: true }
      ],
      signup: {
        source: "bong-tour-upper-management-token",
        interest: "Bong Tour Upper Management Token collector list",
        submitLabel: "Hold the token",
        successMessage: "You are in. Watch for sequel-machine notes and collector updates.",
        note: "Used for collector drops, finale signals, and partner-facing updates."
      },
      challenge: {
        label: "Token spin",
        prompt: "Keep the token spinning until the sequel offer appears.",
        mode: "token-spin",
        tokenLabel: "token",
        noteTitle: "Sequel machine exposed",
        noteBody: "The ending lands harder when the token feels seductive and predatory at the same time. The object should sell appetite while revealing the trap."
      }
    }
  }
];

export function BongTourFeature() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeRoom, setActiveRoom] = useState<ExperienceRoom | null>(null);
  const [challengeUnlocked, setChallengeUnlocked] = useState(false);
  const titleId = useId();
  const isCollectorRoom = activeRoom?.slug === portalRooms.collector.slug;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveRoom(null);
      }
    };

    document.body.style.overflow = "hidden";
    setChallengeUnlocked(false);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeRoom]);

  return (
    <>
      <div className="bt-stage">
        <section className="bt-hero" id="bong-tour">
          <div className="bt-hero__grain" aria-hidden="true" />
          <div className="bt-hero__glow" aria-hidden="true" />

          <div className="bt-hero__layout">
            <figure className="bt-hero__poster">
              <div className="bt-hero__poster-frame">
                <Image src={posterImage} alt="Concept poster artwork for Bong Tour" priority sizes="(max-width: 960px) 82vw, 32vw" />
              </div>
              <figcaption>Poster artifact</figcaption>
            </figure>

            <div className="bt-hero__content">
              <span className="bt-hero__eyebrow">Collector-first portal</span>
              <h1>Bong Tour</h1>
              <p className="bt-hero__descriptor">A collector-first portal for design-led film fans, soundtrack listeners, and worldbuilding obsessives.</p>

              <p className="bt-hero__positioning">Move through the poster, collector rooms, cue bridges, and artifact archive without stepping outside the myth.</p>

              <div className="bt-hero__logline bt-hero__experience-card">
                <h2>Experience preview</h2>
                <p>
                  A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to a smoke-script that keeps rewriting
                  the myth until the industry shows its true price.
                </p>

                <div className="bt-hero__modules" aria-label="Portal modules">
                  <span>Story portal</span>
                  <span>Poster world</span>
                  <span>Cue rooms</span>
                  <span>Soundtrack bridge</span>
                  <span>Object archive</span>
                  <span>Games and ritual prompts</span>
                </div>
              </div>

              <div className="bt-hero__cta">
                <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.collector)}>
                  Open collector room
                </Button>
                <Button as="a" href="#score-sketches" className="bt-button bt-button--outline">
                  Open cue rooms
                </Button>
              </div>
            </div>
          </div>

          <div className="bt-hero__meta" aria-label="Bong Tour quick facts">
            {keyDetails.map((item) => (
              <article key={item.label} className="bt-hero__meta-item">
                <span className="bt-hero__meta-label">{item.label}</span>
                <strong className="bt-hero__meta-value">{item.detail}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="bt-collectibles" id="collector-grid" aria-labelledby="bt-collectibles-title">
          <header className="bt-section-header">
            <div>
              <p className="bt-section-header__eyebrow">Collector grid</p>
              <h2 id="bt-collectibles-title">Games, relics, and hidden doors built straight into the Bong Tour world.</h2>
              <p>Each tile opens a full takeover room with a microgame, collector reward, and a clear route back into the cue-world.</p>
            </div>
          </header>

          <ul className="bt-collectibles__grid">
            {collectibleTiles.map((tile) => (
              <li key={tile.slug} className="bt-collectibles__tile">
                <div className="bt-collectibles__tile-head">
                  <span>{tile.badge}</span>
                  <h3>{tile.title}</h3>
                </div>
                <p className="bt-collectibles__teaser">{tile.teaser}</p>
                <dl className="bt-collectibles__meta">
                  <div>
                    <dt>Challenge</dt>
                    <dd>{tile.challenge}</dd>
                  </div>
                  <div>
                    <dt>Reward</dt>
                    <dd>{tile.reward}</dd>
                  </div>
                </dl>
                <Button type="button" className="bt-button bt-button--outline" onClick={() => setActiveRoom(tile.room)}>
                  Open collector room
                </Button>
              </li>
            ))}
          </ul>

          <div className="bt-collectibles__collector-access">
            <article className="bt-collectibles__collector-access-card">
              <div className="bt-collectibles__collector-access-copy">
                <p className="bt-section-header__eyebrow">Collector's room</p>
                <h3>Enter the collector's room</h3>
                <p>Artifacts, clue drops, soundtrack-linked unlocks, and game-locked rewards live inside the takeover instead of out in the feed.</p>
              </div>

              <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.collector)}>
                Open collector room
              </Button>
            </article>
          </div>
        </section>

        <section className="bt-music" id="score-sketches" aria-labelledby="bt-music-title">
          <header className="bt-section-header bt-section-header--split">
            <div>
              <p className="bt-section-header__eyebrow">Companion listening room</p>
              <h2 id="bt-music-title">Three cue rooms keep the score visibly attached to the page.</h2>
              <p>The soundtrack bridge stays compact and obvious: proof-of-tone here, then a direct handoff into the live Walls/Devine listening world.</p>
            </div>
            <div className="bt-section-header__actions">
              <Button as="a" href="?player=joint-queen#walls-devine-listening-room" className="bt-button bt-button--outline">
                Open portable listening room
              </Button>
            </div>
          </header>

          <ul className="bt-music__grid">
            {musicPosters.map((poster) => (
              <li key={poster.title} id={poster.id} className="bt-music__poster">
                <div className="bt-music__visual" aria-hidden="true">
                  <Image src={poster.image} alt="" className="bt-music__visual-image" sizes="(max-width: 920px) 80vw, 26vw" />
                  <span className="bt-music__badge">{poster.badge}</span>
                  <div className="bt-music__marquee">
                    <h3>{poster.title}</h3>
                    <p>{poster.tagline}</p>
                  </div>
                </div>

                <div className="bt-music__details">
                  <p className="bt-music__lede">{poster.description}</p>
                  <ul className="bt-music__highlights">
                    {poster.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="bt-music__actions">
                    <Button type="button" className="bt-button" onClick={() => setActiveRoom(poster.room)}>
                      Open cue room
                    </Button>
                    <Button as="a" href={`?player=${poster.playerTarget}#walls-devine-listening-room`} className="bt-button bt-button--outline">
                      Play in listening room
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {hasMounted && activeRoom
        ? createPortal(
            <div
              className={`bt-room-modal${isCollectorRoom ? " bt-room-modal--collector" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={() => setActiveRoom(null)}
            >
              <div className="bt-room-modal__panel" onClick={(event) => event.stopPropagation()}>
                <div className="bt-room-modal__room-overlay" aria-hidden="true">
                  <span className="bt-room-modal__room-script">{activeRoom.ambientLabel}</span>
                  <span className="bt-room-modal__room-subtitle">{activeRoom.ambientSubtitle}</span>
                </div>

                <div className="bt-room-modal__header">
                  <div>
                    <p className="bt-room-modal__eyebrow">{activeRoom.eyebrow}</p>
                    <h2 id={titleId}>{activeRoom.title}</h2>
                    <p className="bt-room-modal__kicker">{activeRoom.kicker}</p>
                    <p className="bt-room-modal__description">{activeRoom.description}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="bt-room-modal__close" onClick={() => setActiveRoom(null)}>
                    Close
                  </Button>
                </div>

                <div className="bt-room-modal__body">
                  <div className="bt-room-modal__chips" aria-label="Room highlights">
                    {activeRoom.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>

                  {activeRoom.beats?.length ? (
                    <ul className="bt-room-modal__beats">
                      {activeRoom.beats.map((beat) => (
                        <li key={beat}>{beat}</li>
                      ))}
                    </ul>
                  ) : null}

                  {activeRoom.challenge ? (
                    <div className="bt-room-modal__challenge-shell">
                      <section className="bt-room-modal__challenge-card">
                        <p className="bt-room-modal__challenge-label">Challenge</p>
                        <h3>{activeRoom.challenge.label}</h3>
                        <p>{activeRoom.challenge.prompt}</p>
                      </section>

                      <RoomChallengeExperience
                        challenge={activeRoom.challenge}
                        roomSlug={activeRoom.slug}
                        onUnlock={() => setChallengeUnlocked(true)}
                      />

                      <section
                        className={`bt-room-modal__hidden-note${challengeUnlocked ? " bt-room-modal__hidden-note--unlocked" : ""}`}
                        aria-live="polite"
                      >
                        <p className="bt-room-modal__challenge-label">{activeRoom.challenge.noteLabel ?? "Hidden note"}</p>
                        <h3>{challengeUnlocked ? activeRoom.challenge.noteTitle : "Locked until the challenge lands"}</h3>
                        <p>
                          {challengeUnlocked
                            ? activeRoom.challenge.noteBody
                            : "Beat the game to reveal the hidden note for this collectible chapter."}
                        </p>
                      </section>
                    </div>
                  ) : null}

                  <div className="bt-room-modal__actions">
                    {activeRoom.actions.map((action) => (
                      action.roomKey ? (
                        <Button
                          key={action.label}
                          type="button"
                          className={action.outline ? "bt-button bt-button--outline" : "bt-button"}
                          onClick={() => setActiveRoom(portalRooms[action.roomKey ?? "collector"])}
                        >
                          {action.label}
                        </Button>
                      ) : (
                        <Button
                          key={action.label}
                          as="a"
                          href={action.href ?? "/"}
                          className={action.outline ? "bt-button bt-button--outline" : "bt-button"}
                        >
                          {action.label}
                        </Button>
                      )
                    ))}
                  </div>

                  {activeRoom.signup ? (
                    <div className="bt-room-modal__signup-shell">
                      <EcosystemSignupForm
                        className="bt-room-modal__signup"
                        source={activeRoom.signup.source}
                        interest={activeRoom.signup.interest}
                        submitLabel={activeRoom.signup.submitLabel}
                        successMessage={activeRoom.signup.successMessage}
                        note={activeRoom.signup.note}
                        compact
                        emailOnly
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default BongTourFeature;
