"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";

import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, isBongTourPreview, june30LaunchDateLabel } from "@/lib/launch-state";
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

type CueRoomVideo = {
  embedUrl?: string;
  sourceUrl?: string;
  posterImage?: StaticImageData;
  label?: string;
  note?: string;
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
  video?: CueRoomVideo;
  room: ExperienceRoom;
};

type CollectibleTile = {
  slug: string;
  badge: string;
  title: string;
  image: StaticImageData;
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

function buildWallsDevineListeningRoomHref(playerTarget: string) {
  return `/walls-devine?player=${playerTarget}#walls-devine-listening-room`;
}

const wallsDevineCollectorGridHref = "/walls-devine#walls-devine-grid-title";
const bongTourTreatmentHref = "/bong-tour/treatment";
const bongTourSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "walls-devine-mailing-list",
    project: "Walls/Devine",
    inquiryType: "mailing-list",
    surface: "campaign-world",
    sourceRoute: "/bong-tour",
    campaignWindow: albumLaunchCampaignWindow
  }
});
const bongTourContactHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "bong-tour-intake",
    project: "Bong Tour",
    inquiryType: "partnership",
    surface: "campaign-world",
    engagement: "direction",
    sourceRoute: "/bong-tour",
    campaignWindow: albumLaunchCampaignWindow
  }
});
const bongTourContactCtaLabel = "Talk About the Film";
const bongTourPrivatePathCtaLabel = "Request Reading Copy";

const bongTourPremise = "A sacred relic disappears from a Varanasi ghat and washes up on Sunset Boulevard.";
const bongTourLogline =
  "A sacred relic disappears from a Varanasi ghat and washes up on Sunset Boulevard, dragging two displaced screenwriters into a Hollywood odyssey that careens between diaspora satire, cult comedy, and industry survival.";
const bongTourHeroDescriptor =
  "An independent cult-comedy feature screenplay in active development, accompanied by an original analog score from Creatives Guide Us.";

const bongTourTreatmentBullets = [
  "Sun-baked road satire with cult-comedy momentum.",
  "Original soundtrack cues tracked to key script sequences.",
  "Character bibles, scene lookbooks, and production breakdown."
] as const;

const bongTourHeroModules = [
  "Feature Screenplay",
  "Story Treatment",
  "Soundtrack Cues",
  "Production Vault"
] as const;

const bongTourHeroFacts = [
  { label: "Format", value: "Feature screenplay" },
  { label: "Tone", value: "Diaspora cult comedy" },
  { label: "Original Score", value: "Creatives Guide Us Lab" }
] as const;

const bongTourHeroSignals = [
  {
    label: "Screenplay Draft",
    title: "Watermarked reading copies.",
    description: "The complete script and director lookbook are held in private circulation for producing partners."
  },
  {
    label: "Original Score",
    title: "Composed alongside the script.",
    description: "Analog guitar motifs, desert ambient textures, and rhythm tracks recorded at the studio sound lab."
  },
  {
    label: "Production Archive",
    title: "Visual & story ephemera.",
    description: "Location scouting Polaroids, motel neon sketches, and artifact notes from development."
  }
] as const;

const bongTourBridgeCards = [
  {
    label: "Original Score",
    title: "Hear the film's sonic world.",
    description:
      "Original guitar motifs, ambient desert drones, and tape saturations composed directly to key sequences in the script.",
    href: "#score-sketches",
    ctaLabel: "Enter cue rooms"
  },
  {
    label: "Screenplay Access",
    title: "Watermarked treatment and script.",
    description:
      "Complete logline, act breakdowns, character bibles, and production notes available for co-producers and directors.",
    href: bongTourTreatmentHref,
    ctaLabel: "Request reading copy"
  }
] as const;

const bongTourCollectorOverview = [
  {
    label: "Physical Artifacts",
    title: "Story ephemera & objects.",
    description: "Artifacts from the road: motel room keys, handwritten lyric scraps, and film stills."
  },
  {
    label: "Studio Score",
    title: "Parallel catalog connection.",
    description: "Soundtrack themes share recording heritage with the studio's debut LP, Walls/Devine Volume 1."
  }
] as const;

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

const portalRooms: Record<string, ExperienceRoom> = {
  producer: {
    slug: "producer-portal",
    eyebrow: "Green Room",
    title: "The Producer's Green Room",
    ambientLabel: "Green Room",
    ambientSubtitle: "Script drafts, cues & bad diner coffee",
    kicker: "For producers, directors, and collaborators who want to cut straight to the music, the script, and the budget reality.",
    description:
      "Written by screenwriters who have actually broken down on Route 66 in July. All materials—lookbook, scene breakdowns, score cues, and character bibles—are available here for serious packaging discussions.",
    chips: ["Screenplay Draft", "Original Score", "Director Lookbook"],
    beats: [
      "Full script and tone lookbook available by request.",
      "Scored alongside live analog tracking sessions at CGU.",
      "No bloated committee notes—just sharp, character-driven comedy."
    ],
    actions: [
      { label: bongTourContactCtaLabel, href: bongTourContactHref },
      { label: "Open Walls/Devine", href: "/walls-devine", outline: true }
    ],
    signup: {
      source: "bong-tour-producer-portal",
      interest: "Bong Tour producer portal",
      submitLabel: "Request the room key",
      successMessage: "You are in. The script lookbook and private notes will reach your inbox shortly.",
      note: "Direct correspondence with the writers and studio producing team."
    }
  },
  collector: {
    slug: "collector-room",
    eyebrow: "Production Vault",
    title: "The Production Glovebox",
    ambientLabel: "The Glovebox",
    ambientSubtitle: "Receipts, Polaroids & motel room keys",
    kicker: "Everything that survived the trip: motel keys, gas station receipts, lyric napkins, and tape scraps.",
    description:
      "Every comedy leaves weird evidence behind in the glove compartment. Inspect artifacts from the journey, listen to score sketches, and explore how the world of Bong Tour connects to the studio's debut LP, Walls/Devine Volume 1.",
    chips: ["Road Artifacts", "Score Sketches", "Session Polaroids"],
    beats: [
      "Real Polaroids and roadside artifacts from location scouting.",
      "Original score cues tracked live on 2-inch tape.",
      "Evidence that independent films are made with sweat, not software."
    ],
    actions: [
      { label: "Explore Cue Rooms", href: "#score-sketches" },
      { label: "Open Volume 1 catalog", href: wallsDevineCollectorGridHref, outline: true }
    ],
    signup: {
      source: "bong-tour-after-hours-archive",
      interest: "Bong Tour after-hours archive",
      submitLabel: "Request archive access",
      successMessage: "You are in. Watch for artifacts, clue drops, and the next archive opening.",
      note: "Archive access only. Used for artifact notes, soundtrack-linked clues, and room updates."
    },
    challenge: {
      label: "Archive seal",
      prompt: "Align the lock before the glovebox snaps shut.",
      mode: "seal-alignment",
      tokenLabel: "archive",
      noteLabel: "Glovebox opened",
      noteTitle: "Glovebox Drawer Unlocked",
      noteBody: "Inside: three crumpled motel receipts, a faded cassette tape labeled 'DO NOT ERASE', and a hand-drawn map of Route 66 diner spots."
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
      "Overdriven tube amps and horn stabs for the scene where two broke screenwriters walk into the Comedy Store like they own the joint.",
    highlights: ["Psych-funk entrance cue", "Terry Devine's overdriven fuzz bass"],
    video: {
      label: "Cue video deck",
      note: "Hook the Joint Queen cue video here when the scene cut is ready."
    },
    room: {
      slug: "cue-room-joint-queen",
      eyebrow: "Cue room",
      title: "Joint Queen: Comedy Store Entrance",
      ambientLabel: "Cue room 01",
      ambientSubtitle: "Comedy Store ignition",
      kicker: "The cue where the comedy stops being polite and starts breaking furniture.",
      description:
        "Scored live at the CGU sound lab. Loud, swaggering, and built around a fuzz bass hook that refuses to apologize for itself. Pairs with the scene where our heroes crash an industry party with zero credentials.",
      chips: ["Comedy Store scene", "Fuzz bass cue", "Live room tracking"],
      beats: ["Loud guitars, real horns, no digital correction.", "Scored to match the comedic tempo of the scene.", "Cut direct to 2-inch analog tape."],
      actions: [
        { label: "Open Volume 1 score path", href: buildWallsDevineListeningRoomHref("joint-queen") },
        { label: "Open Volume 1 catalog", href: wallsDevineCollectorGridHref, outline: true }
      ]
    }
  },
  {
    id: "score-stash-daddy",
    title: "Stash Daddy",
    badge: "Cue Room 02",
    playerTarget: "stash-daddy",
    image: stashDaddyImage,
    tagline: "A low-slung, analog crawl for sketchy diner booths and bad decisions.",
    description:
      "Sub-bass crawl with late-night percussion. Scored for the scene where our heroes try trading a screenplay credit for a replacement radiator in Barstow.",
    highlights: ["Late-night diner tension", "Analog synth and tabla rhythm"],
    video: {
      label: "Cue video deck",
      note: "Hook the Stash Daddy cue video here when the pressure-chamber cut is ready."
    },
    room: {
      slug: "cue-room-stash-daddy",
      eyebrow: "Cue room",
      title: "Stash Daddy: Barstow Diner Booth",
      ambientLabel: "Cue room 02",
      ambientSubtitle: "Backroom pressure chamber",
      kicker: "The sound of being 2,000 miles from home with $40 in cash and an overheating radiator.",
      description:
        "Built from modular synths and live percussion. The groove for late-night motel rooms, neon reflections, and questionable handshake agreements with desert mechanics.",
      chips: ["Desert motel scene", "Modular synth pulse", "Bad decisions"],
      beats: ["Sets the rhythm for late-night backroom plotting.", "Balances threat and deadpan satire.", "Recorded at the studio sound lab in Los Angeles."],
      actions: [
        { label: "Open Volume 1 score path", href: buildWallsDevineListeningRoomHref("stash-daddy") },
        { label: "Open Volume 1 catalog", href: wallsDevineCollectorGridHref, outline: true }
      ]
    }
  },
  {
    id: "score-space-cruiser",
    title: "Space Cruiser",
    badge: "Cue Room 03",
    playerTarget: "space-cruiser",
    image: spaceCruiserImage,
    tagline: "Cosmic tanpura and tape echo for when the van radiator finally explodes.",
    description:
      "When the 1994 Econoline van finally gives up the ghost in the Mojave desert, this ambient dreamscape takes over under the stars.",
    highlights: ["Indian vocal color and tanpura", "Ambient desert drift"],
    video: {
      label: "Cue video deck",
      note: "Hook the Space Cruiser cue video here when the final-act reveal cut is ready."
    },
    room: {
      slug: "cue-room-space-cruiser",
      eyebrow: "Cue room",
      title: "Space Cruiser: Mojave Breakdown",
      ambientLabel: "Cue room 03",
      ambientSubtitle: "Return-to-source atmosphere",
      kicker: "Cosmic drift for the moment when everything goes wrong and suddenly becomes beautiful.",
      description:
        "Processed tanpura, tape delay, and desert ambient textures. The moment the road trip stops being an embarrassing disaster and turns into a genuine spiritual awakening.",
      chips: ["Mojave night sequence", "Tanpura & delay", "Cosmic breakdown"],
      beats: ["Blends Indian acoustic textures with desert silence.", "Written to score the emotional turning point of the script.", "Direct companion to Walls/Devine Volume 1."],
      actions: [
        { label: "Open Volume 1 score path", href: buildWallsDevineListeningRoomHref("space-cruiser") },
        { label: "Open Volume 1 catalog", href: wallsDevineCollectorGridHref, outline: true }
      ]
    }
  }
];

const collectibleTiles: CollectibleTile[] = [
  {
    slug: "ganges-relic",
    badge: "Collectible 01",
    title: "Ganges Relic",
    image: posterImage,
    teaser: "The sacred six-foot glass rig that floated down the Ganges and ended up in a Sunset Boulevard pawn shop.",
    challenge: "Align the river sigil before the incense burns down.",
    reward: "Return note: origin lore for the whole journey.",
    room: {
      slug: "collectible-room-ganges-relic",
      eyebrow: "Collector object",
      title: "Ganges Relic chamber",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Origin artifact",
      kicker: "A centuries-old ceremonial artifact that somehow smells faintly of patchouli.",
      description:
        "Forged in Varanasi, lost at sea, and rescued from an estate sale in Tarzana. Two screenwriters swore an oath to return it to the sacred river—right after they pitch a streaming series about it.",
      chips: ["Origin story", "Sacred object", "Varanasi to Sunset"],
      beats: ["The central engine of the road trip.", "Fragile, six feet tall, and almost impossible to pack in a van.", "Creates an absurd clash between ancient ritual and Hollywood hustle."],
      actions: [
        { label: bongTourContactCtaLabel, href: bongTourContactHref },
        { label: "Explore Cue Rooms", href: "#score-sketches", outline: true }
      ],
      signup: {
        source: "bong-tour-ganges-relic",
        interest: "Bong Tour Ganges Relic collector list",
        submitLabel: "Claim relic access",
        successMessage: "You are in. Watch for the next relic note and collector-room update.",
        note: "Collector access only. Used for artifact notes and room updates."
      },
      challenge: {
        label: "River sigil",
        prompt: "Align the river sigil before the incense burns down.",
        mode: "seal-alignment",
        tokenLabel: "relic",
        noteTitle: "Varanasi Seal Aligned",
        noteBody: "Origin lore revealed: never entrust a sacred river relic to two screenwriters driving an Econoline with a blown head gasket."
      }
    }
  },
  {
    slug: "comedy-store-pass",
    badge: "Collectible 02",
    title: "Comedy Store Pass",
    image: jointQueenImage,
    teaser: "A VIP backstage laminate sticky with spilled beer, granting access to green rooms where comedians argue about podcast metrics.",
    challenge: "Memorize the room code before the bouncer looks your way.",
    reward: "Return note: backstage lore and initiation notes.",
    room: {
      slug: "collectible-room-comedy-store-pass",
      eyebrow: "Collector object",
      title: "Comedy Store Pass",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Initiation credential",
      kicker: "Laminated in 1987. Smells like spilled draft beer and broken dreams.",
      description:
        "The backstage pass that got our heroes kicked out of three green rooms, one VIP lounge, and an unauthorized open-mic set on Sunset Boulevard.",
      chips: ["Backstage pass", "Green room politics", "Free drink tickets"],
      beats: ["Grants access to rooms where deals are whispered.", "Pairs naturally with the Joint Queen score cue.", "Proof that confidence beats credentials."],
      actions: [
        { label: "Open Joint Queen", href: buildWallsDevineListeningRoomHref("joint-queen") },
        { label: "Enter the green room", roomKey: "producer", outline: true }
      ],
      signup: {
        source: "bong-tour-comedy-store-pass",
        interest: "Bong Tour Comedy Store Pass collector list",
        submitLabel: "Get the backstage pass",
        successMessage: "You are in. Watch for backstage notes and the next room code.",
        note: "Used for room codes, cue notes, and backstage updates."
      },
      challenge: {
        label: "Room code",
        prompt: "Memorize the backstage door code before the bouncer looks your way.",
        mode: "vault-code",
        tokenLabel: "pass",
        noteTitle: "Backstage Laminate Verified",
        noteBody: "You made it past the velvet rope. The bouncer isn't impressed, but at least the drink tickets are still valid."
      }
    }
  },
  {
    slug: "lollipop-guild-key",
    badge: "Collectible 03",
    title: "Lollipop Guild Key",
    image: stashDaddyImage,
    teaser: "A brass key to Room 214 of the Sunset Motor Lodge. Do not touch the remote control.",
    challenge: "Pick the right hallway before the fluorescent lights buzz out.",
    reward: "Return note: motel room rewrites and neon paranoia.",
    room: {
      slug: "collectible-room-lollipop-guild-key",
      eyebrow: "Collector object",
      title: "Lollipop Guild Key",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Motel-night shadow layer",
      kicker: "A brass key with a plastic fob stamped 'DO NOT DUPLICATE'—which someone definitely duplicated.",
      description:
        "The roadside motel where the script rewrite happened over 72 hours of bad drip coffee, gas-station jerky, and escalating paranoia about rival screenwriters stealing the ending.",
      chips: ["Sunset Motor Lodge", "Gas-station coffee", "Act II breakdown"],
      beats: ["Pairs with the Stash Daddy low-end groove.", "The turning point where the jokes get desperate and brilliant.", "Includes a plastic room key with questionable stains."],
      actions: [
        { label: "Open Stash Daddy", href: buildWallsDevineListeningRoomHref("stash-daddy") },
        { label: "Open after-hours archive", roomKey: "collector", outline: true }
      ],
      signup: {
        source: "bong-tour-lollipop-guild-key",
        interest: "Bong Tour Lollipop Guild Key collector list",
        submitLabel: "Hold the keycard",
        successMessage: "You are in. Watch for motel notes and the next room dispatch.",
        note: "Used for story clues, script notes, and private room dispatches."
      },
      challenge: {
        label: "Corridor key",
        prompt: "Pick the right hallway before the fluorescent lights buzz out.",
        mode: "corridor-choice",
        tokenLabel: "key",
        noteTitle: "Room 214 Unlocked",
        noteBody: "You have entered Room 214. The air conditioner sounds like an idling tractor, but the dialogue in Act II is finally funny."
      }
    }
  },
  {
    slug: "upper-management-token",
    badge: "Collectible 04",
    title: "Upper Management Token",
    image: spaceCruiserImage,
    teaser: "A gold-plated studio executive coin engraved with the words: 'Can we make it a franchise?'",
    challenge: "Keep the coin spinning until the sequel offer appears.",
    reward: "Return note: Hollywood development purgatory.",
    room: {
      slug: "collectible-room-upper-management-token",
      eyebrow: "Collector object",
      title: "Upper Management Token",
      ambientLabel: "Collector chamber",
      ambientSubtitle: "Sequel-machine bait",
      kicker: "A shiny piece of executive brass that promises backend points that will never exist.",
      description:
        "Awarded to the screenwriters by a development VP who promised a three-picture deal, an animated prequel spinoff, and zero upfront money. The ultimate symbol of Hollywood development purgatory.",
      chips: ["Three-picture deal", "Zero budget", "Hollywood accounting"],
      beats: ["The pitch meeting where everyone smiles and nobody pays.", "Satirizes franchise hunger in the streaming era.", "Leads directly into the final desert realization."],
      actions: [
        { label: "Open Space Cruiser", href: buildWallsDevineListeningRoomHref("space-cruiser") },
        { label: "Open Volume 1 catalog", href: wallsDevineCollectorGridHref, outline: true }
      ],
      signup: {
        source: "bong-tour-upper-management-token",
        interest: "Bong Tour Upper Management Token collector list",
        submitLabel: "Hold the token",
        successMessage: "You are in. Watch for sequel-machine notes and studio updates.",
        note: "Used for studio drops, finale updates, and partner notes."
      },
      challenge: {
        label: "Token spin",
        prompt: "Keep the coin spinning until the sequel offer appears.",
        mode: "token-spin",
        tokenLabel: "token",
        noteTitle: "Franchise Deal Offered",
        noteBody: "Congratulations: you've been offered a three-picture franchise deal with net backend profit participation after Hollywood studio accounting."
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
  const activeCuePoster = activeRoom ? musicPosters.find((poster) => poster.room.slug === activeRoom.slug) ?? null : null;
  const isCueRoom = Boolean(activeCuePoster);
  const featuredCollectibles = collectibleTiles.slice(0, 3);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useBodyScrollLock(Boolean(activeRoom));

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveRoom(null);
      }
    };

    setChallengeUnlocked(false);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeRoom]);

  if (isBongTourPreview) {
    return (
      <div className="bt-stage">
        <section className="bt-hero" id="bong-tour">
          <div className="bt-hero__grain" aria-hidden="true" />
          <div className="bt-hero__glow" aria-hidden="true" />

          <div className="bt-hero__layout">
            <figure className="bt-hero__poster">
              <a href={bongTourTreatmentHref} className="bt-hero__poster-link" aria-label="Preview the Bong Tour treatment gate">
                <div className="bt-hero__poster-frame">
                  <Image src={posterImage} alt="Concept poster artwork for Bong Tour" priority sizes="(max-width: 960px) 82vw, 32vw" />
                </div>
              </a>
              <figcaption>{`Poster first. The private treatment opens ${june30LaunchDateLabel}.`}</figcaption>
            </figure>

            <div className="bt-hero__content">
              <p className="bt-hero__eyebrow">Screenplay Portal</p>
              <h1>Bong Tour</h1>

              <p className="bt-hero__descriptor">A sun-baked road comedy feature in active packaging, with an original score by the Creatives Guide Us sound lab.</p>

              <div className="bt-hero__modules" aria-label="Bong Tour preview modules">
                <span>Feature Screenplay</span>
                <span>Story Premise</span>
                <span>Soundtrack Cues</span>
                <span>Treatment by Request</span>
              </div>

              <div className="bt-hero__logline">
                <h2>Premise</h2>
                <p>{bongTourPremise}</p>
              </div>

              <p className="bt-hero__positioning">The script and soundtrack cues are currently in packaging for production partners. Explore the premise, poster, and story below.</p>

              <div className="bt-hero__cta">
                <Button as="a" href={bongTourContactHref} className="bt-button">
                  Inquire About Screenplay
                </Button>
                <Button as="a" href="/walls-devine" className="bt-button bt-button--outline">
                  Listen to Studio Score
                </Button>
              </div>

              <p className="bt-hero__route">Feature packaging in progress. Direct inquiries routed through the studio.</p>

              <div className="bt-hero__meta" aria-label="Bong Tour quick facts">
                {bongTourHeroFacts.map((fact) => (
                  <article key={fact.label} className="bt-hero__meta-item">
                    <span className="bt-hero__meta-label">{fact.label}</span>
                    <strong className="bt-hero__meta-value">{fact.value}</strong>
                  </article>
                ))}
              </div>

              <div className="bt-hero__signal-strip" aria-label="Bong Tour preview signals">
                <article className="bt-hero__signal-card">
                  <span>Original Score</span>
                  <strong>Soundtrack cues in progress at CGU.</strong>
                  <p>Analog guitar, desert ambient cues, and live tracking from the Volume 1 studio sessions.</p>
                </article>
                <article className="bt-hero__signal-card">
                  <span>Screenplay</span>
                  <strong>Feature script &amp; treatment.</strong>
                  <p>Private lookbook, character bibles, and treatment available for producing partners and directors.</p>
                </article>
                <article className="bt-hero__signal-card">
                  <span>Studio Inquiries</span>
                  <strong>Direct rights &amp; packaging conversations.</strong>
                  <p>Contact the studio team for reader copies, licensing, or co-production inquiries.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="bt-bridge" aria-labelledby="bt-bridge-title">
          <header className="bt-section-header">
            <p className="bt-section-header__eyebrow">Creative Context</p>
            <h2 id="bt-bridge-title">Sound &amp; Screen Under One Roof</h2>
            <p>Creatives Guide Us develops screenplays in tandem with original sound design, matching the music to the film from the very first draft.</p>
          </header>

          <div className="bt-bridge__grid">
            <article className="bt-bridge__card">
              <span>Active Release</span>
              <strong>Walls/Devine Volume 1</strong>
              <p>Listen to the debut album on 2-inch tape, featuring electric guitars and spoken verse that shape the sound world of Bong Tour.</p>
              <a href="/walls-devine" className="bt-bridge__card-link">
                Open Walls/Devine
              </a>
            </article>
            <article className="bt-bridge__card">
              <span>Mailing List</span>
              <strong>Studio Notices &amp; Pressings</strong>
              <p>Join the signal list for vinyl announcements, film packaging updates, and studio releases.</p>
              <a href={bongTourSignalListHref} className="bt-bridge__card-link">
                Join the signal list
              </a>
            </article>
            <article className="bt-bridge__card">
              <span>Direct Contact</span>
              <strong>Production &amp; Rights Inquiries</strong>
              <p>Reach out directly to request the screenplay treatment or discuss co-production opportunities.</p>
              <a href={bongTourContactHref} className="bt-bridge__card-link">
                Write to the Studio
              </a>
            </article>
          </div>
        </section>

        <section className="bt-world" id="treatment" aria-labelledby="bt-treatment-title">
          <header className="bt-section-header">
            <h2 id="bt-treatment-title">Screenplay Treatment</h2>
            <p>The treatment, lookbook, and character breakdowns are available by request to approved readers, directors, and production partners.</p>
          </header>

          <article className="bt-world__panel bt-world__panel--treatment">
            <p className="bt-treatment__lead">{bongTourLogline}</p>
            <ul className="bt-treatment__bullets">
              <li>Full feature logline, character breakdowns, and story acts.</li>
              <li>Scored soundtrack cues from the studio sound lab.</li>
              <li>Director lookbook and physical location scouting notes.</li>
            </ul>

            <div className="bt-section-header__actions">
              <Button as="a" href={bongTourContactHref} className="bt-button">
                Request Screenplay Treatment
              </Button>
              <Button as="a" href="/walls-devine" className="bt-button bt-button--outline">
                Listen to the Score →
              </Button>
            </div>
          </article>
        </section>

        <section className="bt-finale" id="bong-tour-intake" aria-labelledby="bt-finale-title">
          <div className="bt-finale__body">
            <h2 id="bt-finale-title">Connect with the Studio</h2>
            <p>Whether discussing screenplay packaging, soundtrack supervision, or physical editions, we welcome direct inquiries.</p>

            <div className="bt-finale__actions">
              <Button as="a" href={bongTourContactHref} className="bt-button">
                Write to the Studio
              </Button>
              <Button as="a" href={bongTourSignalListHref} className="bt-button bt-button--outline">
                Join the Mailing List
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="bt-stage">
        <section className="bt-hero" id="bong-tour">
          <div className="bt-hero__grain" aria-hidden="true" />
          <div className="bt-hero__glow" aria-hidden="true" />

          <div className="bt-hero__layout">
            <figure className="bt-hero__poster">
              <button
                type="button"
                className="bt-hero__poster-link bt-hero__poster-link--interactive"
                onClick={() => setActiveRoom(musicPosters[0].room)}
                aria-label="Launch the Bong Tour Fullscreen Takeover"
              >
                <div className="bt-hero__poster-frame">
                  <Image src={posterImage} alt="Concept poster artwork for Bong Tour" priority sizes="(max-width: 960px) 82vw, 32vw" />
                  <span className="bt-hero__poster-badge">Launch Fullscreen Takeover ↗</span>
                </div>
              </button>
              <figcaption>Interactive concept poster. Click to enter the immersive fullscreen cue world.</figcaption>
            </figure>

            <div className="bt-hero__content">
              <p className="bt-hero__eyebrow">Screenplay &amp; Original Score</p>
              <h1>Bong Tour</h1>

              <p className="bt-hero__descriptor">{bongTourHeroDescriptor}</p>

              <div className="bt-hero__modules" aria-label="Bong Tour portal modules">
                {bongTourHeroModules.map((module) => (
                  <span key={module}>{module}</span>
                ))}
              </div>

              <div className="bt-hero__logline">
                <h2>Premise</h2>
                <p>{bongTourPremise}</p>
              </div>

              <p className="bt-hero__positioning">A road comedy about two displaced screenwriters, a stolen relic, and a chaotic crossing from the banks of Varanasi to the neon decay of Sunset Boulevard.</p>

              <div className="bt-hero__cta">
                <Button
                  type="button"
                  className="bt-button bt-button--takeover"
                  onClick={() => setActiveRoom(musicPosters[0].room)}
                >
                  Enter Fullscreen Takeover
                </Button>
                <Button as="a" href={bongTourTreatmentHref} className="bt-button bt-button--outline">
                  {bongTourPrivatePathCtaLabel}
                </Button>
                <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
                  {bongTourContactCtaLabel}
                </Button>
                <Button as="a" href="#score-sketches" className="bt-button bt-button--outline">
                  Enter Cue Rooms
                </Button>
              </div>

              <p className="bt-hero__route">Screenplay draft and original score cues in active development. Watermarked reading copies and production inquiries handled directly by the studio.</p>

              <div className="bt-hero__meta" aria-label="Bong Tour quick facts">
                {bongTourHeroFacts.map((fact) => (
                  <article key={fact.label} className="bt-hero__meta-item">
                    <span className="bt-hero__meta-label">{fact.label}</span>
                    <strong className="bt-hero__meta-value">{fact.value}</strong>
                  </article>
                ))}
              </div>

              <div className="bt-hero__signal-strip" aria-label="Bong Tour route signals">
                {bongTourHeroSignals.map((signal) => (
                  <article key={signal.label} className="bt-hero__signal-card">
                    <span>{signal.label}</span>
                    <strong>{signal.title}</strong>
                    <p>{signal.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bt-bridge" aria-labelledby="bt-bridge-title">
          <header className="bt-section-header">
            <p className="bt-section-header__eyebrow">Creative Context</p>
            <h2 id="bt-bridge-title">Script, Sound, and Atmosphere</h2>
            <p>Written and scored under one roof. The script's kinetic pacing is locked directly to original analog score cues and physical visual development.</p>
          </header>

          <div className="bt-bridge__grid">
            {bongTourBridgeCards.map((card) => (
              <article key={card.label} className="bt-bridge__card">
                <span>{card.label}</span>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
                <a href={card.href} className="bt-bridge__card-link">
                  {card.ctaLabel}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="bt-world" id="treatment" aria-labelledby="bt-treatment-title">
          <header className="bt-section-header">
            <h2 id="bt-treatment-title">Screenplay Treatment</h2>
            <p>Complete lookbook, character bibles, and watermarked reading copies are available for producing partners, directors, and talent.</p>
          </header>

          <article className="bt-world__panel bt-world__panel--treatment">
            <p className="bt-treatment__lead">{bongTourLogline}</p>
            <ul className="bt-treatment__bullets">
              {bongTourTreatmentBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="bt-section-header__actions">
              <Button as="a" href={bongTourTreatmentHref} className="bt-button">
                {bongTourPrivatePathCtaLabel}
              </Button>
              <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
                {bongTourContactCtaLabel}
              </Button>
            </div>
          </article>
        </section>

        <section className="bt-music" id="score-sketches" aria-labelledby="bt-music-title">
          <header className="bt-section-header">
            <h2 id="bt-music-title">Soundtrack Cue Rooms</h2>
            <p>Original compositions scored to specific script scenes, charting the journey from sacred river ghats to California neon.</p>
          </header>

          <ul className="bt-music__grid">
            {musicPosters.map((poster) => (
              <li key={poster.title} id={poster.id} className="bt-music__poster">
                <button type="button" className="bt-music__visual" onClick={() => setActiveRoom(poster.room)} aria-label={`Open ${poster.title} cue room`}>
                  <Image src={poster.image} alt="" className="bt-music__visual-image" sizes="(max-width: 920px) 80vw, 26vw" />
                  <div className="bt-music__marquee">
                    <span className="bt-music__badge">{poster.badge}</span>
                    <h3>{poster.title}</h3>
                    <p>{poster.tagline}</p>
                  </div>
                </button>

                <div className="bt-music__details">
                  <p className="bt-music__lede">{poster.description}</p>
                  <div className="bt-world__theme-row" aria-label={`${poster.title} scene motifs`}>
                    {poster.highlights.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                  <div className="bt-music__actions">
                    <Button type="button" className="bt-button" onClick={() => setActiveRoom(poster.room)}>
                      Enter Cue Room
                    </Button>
                    <Button as="a" href={buildWallsDevineListeningRoomHref(poster.playerTarget)} className="bt-button bt-button--outline">
                      Open Volume 1 Score
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bt-collectibles" id="collector-grid" aria-labelledby="bt-collectibles-title">
          <header className="bt-section-header bt-section-header--split">
            <div>
              <h2 id="bt-collectibles-title">Production Archive &amp; Artifacts</h2>
              <p>Location scouting Polaroids, preliminary set designs, character artifacts, and unreleased studio demo takes from development.</p>
            </div>
            <div className="bt-section-header__actions">
              <Button type="button" className="bt-button bt-button--outline" onClick={() => setActiveRoom(portalRooms.collector)}>
                Open the archive
              </Button>
            </div>
          </header>

          <div className="bt-collectibles__overview" aria-label="Archive framing">
            {bongTourCollectorOverview.map((item) => (
              <article key={item.label} className="bt-collectibles__overview-card">
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <ul className="bt-collectibles__grid bt-collectibles__grid--preview">
            {featuredCollectibles.map((tile) => (
              <li key={tile.slug} className="bt-collectibles__tile">
                <button type="button" className="bt-collectibles__trigger" aria-label={`Open ${tile.title} collector room`} onClick={() => setActiveRoom(tile.room)}>
                  <figure className="bt-collectibles__visual">
                    <Image src={tile.image} alt="" className="bt-collectibles__image" sizes="(max-width: 920px) 80vw, 26vw" />
                    <figcaption className="bt-collectibles__marquee">
                      <h3>{tile.title}</h3>
                      <p>{tile.challenge}</p>
                    </figcaption>
                  </figure>
                </button>

                <div className="bt-collectibles__details">
                  <p className="bt-collectibles__teaser">{tile.teaser}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bt-finale" id="bong-tour-intake" aria-labelledby="bt-finale-title">
          <div className="bt-finale__body">
            <h2 id="bt-finale-title">Connect with the Studio</h2>
            <p>For co-production inquiries, rights availability, score licensing, or reader copy requests, reach out directly to the studio team.</p>

            <div className="bt-finale__actions">
              <Button as="a" href={bongTourContactHref} className="bt-button">
                {bongTourContactCtaLabel}
              </Button>
              <Button as="a" href={bongTourTreatmentHref} className="bt-button bt-button--outline">
                {bongTourPrivatePathCtaLabel}
              </Button>
            </div>
          </div>
        </section>
      </div>

      {hasMounted && activeRoom
        ? createPortal(
            <div
              className={`bt-room-modal bt-room-modal--fullscreen${isCollectorRoom ? " bt-room-modal--collector" : isCueRoom ? " bt-room-modal--cue" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={() => setActiveRoom(null)}
            >
              <div className="bt-room-modal__panel" onClick={(event) => event.stopPropagation()}>
                {/* Immersive Takeover Top Bar */}
                <header className="bt-room-modal__nav-bar">
                  <div className="bt-room-modal__nav-badge">
                    <span className="bt-room-modal__nav-pulse" />
                    <strong>BONG TOUR // CINEMATIC TAKEOVER</strong>
                  </div>

                  <nav className="bt-room-modal__room-tabs" aria-label="Takeover rooms">
                    {musicPosters.map((poster) => (
                      <button
                        key={poster.id}
                        type="button"
                        className={`bt-room-modal__room-tab${poster.room.slug === activeRoom.slug ? " bt-room-modal__room-tab--active" : ""}`}
                        onClick={() => setActiveRoom(poster.room)}
                      >
                        {poster.badge}: {poster.title}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`bt-room-modal__room-tab${activeRoom.slug === portalRooms.producer.slug ? " bt-room-modal__room-tab--active" : ""}`}
                      onClick={() => setActiveRoom(portalRooms.producer)}
                    >
                      Smoke Room
                    </button>
                    <button
                      type="button"
                      className={`bt-room-modal__room-tab${activeRoom.slug === portalRooms.collector.slug ? " bt-room-modal__room-tab--active" : ""}`}
                      onClick={() => setActiveRoom(portalRooms.collector)}
                    >
                      Archive Vault
                    </button>
                  </nav>

                  <button
                    type="button"
                    className="bt-room-modal__close-btn"
                    onClick={() => setActiveRoom(null)}
                    aria-label="Exit fullscreen takeover"
                  >
                    <span>Close</span>
                    <kbd>ESC</kbd>
                  </button>
                </header>

                <div className="bt-room-modal__room-overlay" aria-hidden="true">
                  <span className="bt-room-modal__room-script">{activeRoom.ambientLabel}</span>
                  <span className="bt-room-modal__room-subtitle">{activeRoom.ambientSubtitle}</span>
                </div>

                <div className="bt-room-modal__header">
                  {isCueRoom && activeCuePoster ? (
                    <div className="bt-room-modal__cue-header-main">
                      <div className="bt-room-modal__cue-poster" aria-hidden="true">
                        <div className="bt-room-modal__cue-poster-frame">
                          <Image src={activeCuePoster.image} alt="" sizes="112px" />
                        </div>
                      </div>

                      <div className="bt-room-modal__cue-header-copy">
                        <p className="bt-room-modal__eyebrow">Bong Tour cue room</p>
                        <h2 id={titleId}>{activeCuePoster.title}</h2>
                        <p className="bt-room-modal__cue-meta">
                          {activeCuePoster.badge} · {activeRoom.ambientSubtitle}
                        </p>
                        <p className="bt-room-modal__description">{activeCuePoster.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="bt-room-modal__eyebrow">{activeRoom.eyebrow}</p>
                      <h2 id={titleId}>{activeRoom.title}</h2>
                      <p className="bt-room-modal__kicker">{activeRoom.kicker}</p>
                      <p className="bt-room-modal__description">{activeRoom.description}</p>
                    </div>
                  )}
                  <Button type="button" variant="ghost" size="sm" className="bt-room-modal__close" onClick={() => setActiveRoom(null)}>
                    Close
                  </Button>
                </div>

                <div className="bt-room-modal__body">
                  {isCollectorRoom ? (
                    <div className="bt-room-modal__collector-shell">
                      <aside className="bt-room-modal__collector-art">
                        <div className="bt-room-modal__collector-frame">
                          <Image src={posterImage} alt="Bong Tour collector room poster artifact" sizes="(max-width: 980px) 84vw, 30vw" />
                        </div>

                        <article className="bt-room-modal__collector-card">
                          <p className="bt-room-modal__challenge-label">Collector note</p>
                          <p>
                            Open this room like a cabinet, not a feed. Each move should reveal the artifact, the challenge, and the hidden note as one collector action.
                          </p>
                        </article>

                        <article className="bt-room-modal__collector-card">
                          <p className="bt-room-modal__challenge-label">Archive drawers</p>
                          <div className="bt-room-modal__collector-drawer-list">
                            {collectibleTiles.map((tile) => (
                              <button
                                key={tile.slug}
                                type="button"
                                className="bt-room-modal__collector-drawer"
                                onClick={() => setActiveRoom(tile.room)}
                              >
                                <span>{tile.badge}</span>
                                <strong>{tile.title}</strong>
                                <em>{tile.reward}</em>
                              </button>
                            ))}
                          </div>
                        </article>
                      </aside>

                      <div className="bt-room-modal__collector-experience">
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
                  ) : isCueRoom && activeCuePoster ? (
                    <div className="bt-room-modal__cue-shell">
                      <section className="bt-room-modal__cue-current" aria-label="Current cue room player">
                        <div className="bt-room-modal__cue-art">
                          <div className="bt-room-modal__cue-stage">
                            <div className="bt-room-modal__cue-video-shell">
                              <div className="bt-room-modal__cue-video-frame">
                                <span className="bt-room-modal__cue-stage-badge bt-room-modal__cue-stage-badge--top">
                                  {activeCuePoster.badge}
                                </span>
                                <span className="bt-room-modal__cue-stage-badge bt-room-modal__cue-stage-badge--bottom">
                                  {activeRoom.ambientSubtitle}
                                </span>

                                {activeCuePoster.video?.embedUrl ? (
                                  <iframe
                                    src={activeCuePoster.video.embedUrl}
                                    title={`${activeCuePoster.title} cue video`}
                                    className="bt-room-modal__cue-embed"
                                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                    allowFullScreen
                                  />
                                ) : activeCuePoster.video?.sourceUrl ? (
                                  <video
                                    className="bt-room-modal__cue-video"
                                    controls
                                    preload="metadata"
                                    poster={activeCuePoster.video.posterImage?.src ?? activeCuePoster.image.src}
                                  >
                                    <source src={activeCuePoster.video.sourceUrl} />
                                    Your browser does not support video playback.
                                  </video>
                                ) : (
                                  <div className="bt-room-modal__cue-video-placeholder">
                                    <div className="bt-room-modal__cue-video-placeholder-frame">
                                      <Image
                                        src={activeCuePoster.video?.posterImage ?? activeCuePoster.image}
                                        alt={`${activeCuePoster.title} cue poster`}
                                        sizes="(max-width: 960px) 78vw, 420px"
                                      />
                                    </div>
                                    <span>{activeCuePoster.video?.label ?? "Cue video deck"}</span>
                                    <p>{activeCuePoster.video?.note ?? "Hook a cue video link into this room to swap the poster hold for a live player."}</p>
                                  </div>
                                )}
                              </div>

                              <div className="bt-room-modal__cue-player-wrap">
                                <span className="bt-room-modal__cue-player-label">Video player</span>
                                <div className="bt-room-modal__cue-player-meta">
                                  <span>{activeCuePoster.tagline}</span>
                                  <span>{activeCuePoster.highlights[0] ?? activeRoom.kicker}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <section className="bt-room-modal__cue-notes-shell" aria-label={`${activeCuePoster.title} cue notes`}>
                          <div className="bt-room-modal__cue-notes-head">
                            <span className="bt-room-modal__cue-notes-kicker">Cue notes</span>
                          </div>

                          <div className="bt-room-modal__cue-notes">
                            <article className="bt-room-modal__cue-note">
                              <span>Cue hook</span>
                              <p>{activeCuePoster.tagline}</p>
                            </article>
                            <article className="bt-room-modal__cue-note">
                              <span>Scene fit</span>
                              <p>{activeCuePoster.description}</p>
                            </article>
                            <article className="bt-room-modal__cue-note">
                              <span>Room thesis</span>
                              <p>{activeRoom.kicker}</p>
                            </article>
                            <article className="bt-room-modal__cue-note">
                              <span>Why it matters</span>
                              <p>{activeRoom.description}</p>
                            </article>
                          </div>
                        </section>

                        <div className="bt-room-modal__links bt-room-modal__cue-links">
                          <a href={buildWallsDevineListeningRoomHref(activeCuePoster.playerTarget)}>Open Volume 1 score path</a>
                          <a href={wallsDevineCollectorGridHref}>Open Volume 1 collector path</a>
                        </div>
                      </section>

                      <section className="bt-room-modal__cue-queue" aria-label="Cue room list">
                        <ol>
                          {musicPosters.map((poster) => (
                            <li key={poster.title}>
                              <button
                                type="button"
                                className={`bt-room-modal__cue-queue-item${poster.room.slug === activeRoom.slug ? " bt-room-modal__cue-queue-item--active" : ""}`}
                                onClick={() => setActiveRoom(poster.room)}
                                aria-current={poster.room.slug === activeRoom.slug ? "true" : undefined}
                              >
                                <span>{poster.badge}</span>
                                <div>
                                  <strong>{poster.title}</strong>
                                  <p>{poster.tagline}</p>
                                </div>
                                <em>{poster.room.ambientSubtitle}</em>
                              </button>
                            </li>
                          ))}
                        </ol>
                      </section>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
