"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/Button";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import { EcosystemSignupForm } from "@/components/walls-devine/EcosystemSignupForm";

type RoomAction = {
  label: string;
  href: string;
  outline?: boolean;
};

type RoomSignup = {
  source: string;
  interest: string;
  submitLabel: string;
  successMessage: string;
  note: string;
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
};

type CuePoster = {
  id: string;
  title: string;
  badge: string;
  playerTarget: string;
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

const keyDetails = [
  { label: "Format", detail: "Feature screenplay" },
  { label: "Mood", detail: "Sacred comedy meets Sunset noir" },
  { label: "Rollout", detail: "Collector portal with soundtrack exits" }
];

const pitchSignals = [
  {
    label: "Poster first",
    value: "Lead with the artifact",
    note: "The page opens like a premium invitation object before it behaves like a pitch."
  },
  {
    label: "Cue world",
    value: "Music sells the tone",
    note: "Walls/Devine score posters keep the project feeling alive instead of theoretical."
  },
  {
    label: "Collector layer",
    value: "Games and objects",
    note: "Microgame prompts and collectible drops turn the screenplay world into a release experience."
  }
];

const bridgeModules = [
  {
    label: "Portal logic",
    title: "Shorten the path from atmosphere to belief",
    copy: "Poster, quick myth, and cue cards do most of the work before story architecture arrives."
  },
  {
    label: "Collectible spine",
    title: "Treat the world like an object people can enter",
    copy: "Games, relics, and takeover rooms make Bong Tour feel like a launch world rather than a PDF."
  },
  {
    label: "Companion exit",
    title: "Keep Walls/Devine visibly attached",
    copy: "Every cue room should offer a clear handoff into the listening experience without breaking the spell."
  }
];

const storyMoments = [
  {
    label: "Act I",
    title: "The artifact enters the machine",
    copy: "A sacred bong leaves the Ganges and turns up on Sunset Boulevard, binding two writers to a myth they do not control."
  },
  {
    label: "Act II",
    title: "Comedy Store initiation",
    copy: "Backroom mentors, backstage chemicals, and A-list power plays turn a pitch into a ritual test."
  },
  {
    label: "Act III",
    title: "Return to source code",
    copy: "India reframes the whole story, forcing heritage, sacrifice, and the rules of the relic back into focus."
  }
];

const themes = [
  "Diaspora identity without flattening the source",
  "Industry power as a controlled intoxication",
  "Myth, comedy, and satire in the same room",
  "Montu as the moral center, not the prop"
];

const globalComps = ["The Big Lebowski", "Tropic Thunder", "Fear and Loathing in Las Vegas", "The Player"];

const indiaComps = ["Go Goa Gone", "Delhi Belly", "Luck By Chance"];

const portalRooms: Record<string, ExperienceRoom> = {
  producer: {
    slug: "producer-portal",
    eyebrow: "Producer portal",
    title: "Enter the smoke room",
    ambientLabel: "Smoke room",
    ambientSubtitle: "Deck, tone, and score in one move",
    kicker: "For producers, financiers, and creative partners who want the shortest route to the full experience stack.",
    description:
      "This room is where Bong Tour becomes legible as a premium film object: poster, narrative spine, soundtrack bridge, and packaging intent bundled into one conversation.",
    chips: ["Pitch deck request", "Soundtrack alignment", "Packaging conversation"],
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
    slug: "collector-signal-room",
    eyebrow: "Collector access",
    title: "Open the signal room",
    ambientLabel: "Signal room",
    ambientSubtitle: "Private access for objects and drops",
    kicker: "A higher-touch path for people who want the worldbuilding, cue drops, and collectible announcements before the public feed catches up.",
    description:
      "Instead of pushing every update into the open, Bong Tour can move like a collector rollout: hidden passwords, room openings, teaser drops, and soundtrack-led invitations.",
    chips: ["Collector drop notes", "Hidden-room passwords", "Cue poster alerts"],
    beats: [
      "Games and relics give the page a reason to return to.",
      "Takeover modals keep the CTA immersive instead of transactional.",
      "Walls/Devine remains the live soundtrack exit."
    ],
    actions: [
      { label: "See the cue rooms", href: "#score-sketches" },
      { label: "Visit Walls/Devine", href: "/walls-devine", outline: true }
    ],
    signup: {
      source: "bong-tour-signal-room",
      interest: "Bong Tour signal room",
      submitLabel: "Join the signal room",
      successMessage: "You are in. Watch for cue drops, collector notes, and Bong Tour room openings.",
      note: "High-signal only. Used for collector access, hidden-room notes, and drop alerts."
    }
  }
};

const musicPosters: CuePoster[] = [
  {
    id: "score-joint-queen",
    title: "Joint Queen",
    badge: "Cue Room 01",
    playerTarget: "joint-queen",
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
        { label: "Open in Walls/Devine", href: "/walls-devine?player=joint-queen#walls-devine-listening-room" },
        { label: "Talk soundtrack fit", href: "/#contact", outline: true }
      ]
    }
  },
  {
    id: "score-stash-daddy",
    title: "Stash Daddy",
    badge: "Cue Room 02",
    playerTarget: "stash-daddy",
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
        { label: "Open in Walls/Devine", href: "/walls-devine?player=stash-daddy#walls-devine-listening-room" },
        { label: "Enter the producer room", href: "/#contact", outline: true }
      ]
    }
  },
  {
    id: "score-space-cruiser",
    title: "Space Cruiser",
    badge: "Cue Room 03",
    playerTarget: "space-cruiser",
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
        { label: "Open in Walls/Devine", href: "/walls-devine?player=space-cruiser#walls-devine-listening-room" },
        { label: "Open the signal room", href: "/walls-devine", outline: true }
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
        "This room frames the relic as the worldbuilding engine. Everything from poster treatment to final-act gravity gets cleaner once the object feels sacred and cinematic.",
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
        { label: "Enter the smoke room", href: "/#contact", outline: true }
      ],
      signup: {
        source: "bong-tour-comedy-store-pass",
        interest: "Bong Tour Comedy Store Pass collector list",
        submitLabel: "Get the backstage pass",
        successMessage: "You are in. Watch for backstage notes and the next room code.",
        note: "Used for collector-room codes, cue notes, and backstage-style rollout updates."
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
        { label: "Open the signal room", href: "#collector-grid", outline: true }
      ],
      signup: {
        source: "bong-tour-lollipop-guild-key",
        interest: "Bong Tour Lollipop Guild Key collector list",
        submitLabel: "Hold the keycard",
        successMessage: "You are in. Watch for noir-room drops and the next key signal.",
        note: "Used for clue drops, collector access, and private room notes."
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
      }
    }
  }
];

export function BongTourFeature() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeRoom, setActiveRoom] = useState<ExperienceRoom | null>(null);
  const titleId = useId();

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
              <figcaption>Poster artifact · premium pitch portal</figcaption>
            </figure>

            <div className="bt-hero__content">
              <span className="bt-hero__eyebrow">Feature screenplay</span>
              <h1>Bong Tour</h1>
              <p className="bt-hero__descriptor">A collector-first film portal where sacred comedy, soundtrack mythology, and industry noir all hit at once.</p>

              <div className="bt-hero__logline">
                <h2>Logline</h2>
                <p>
                  A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to a smoke-script that keeps rewriting
                  the myth until the industry shows its true price.
                </p>
              </div>

              <div className="bt-hero__cta">
                <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.producer)}>
                  Enter producer portal
                </Button>
                <Button type="button" className="bt-button bt-button--outline" onClick={() => setActiveRoom(portalRooms.collector)}>
                  Open signal room
                </Button>
              </div>
            </div>
          </div>

          <div className="bt-hero__meta" aria-label="Pitch quick facts">
            {keyDetails.map((item) => (
              <article key={item.label} className="bt-hero__meta-item">
                <span className="bt-hero__meta-label">{item.label}</span>
                <strong className="bt-hero__meta-value">{item.detail}</strong>
              </article>
            ))}
          </div>

          <div className="bt-hero__signal-strip" aria-label="Pitch signals">
            {pitchSignals.map((signal) => (
              <article key={signal.label} className="bt-hero__signal-card">
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <p>{signal.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bt-bridge" aria-labelledby="bt-bridge-title">
          <div className="bt-section-header bt-section-header--split">
            <div>
              <p className="bt-section-header__eyebrow">Experience system</p>
              <h2 id="bt-bridge-title">Streamlined like a campaign landing page, not a screenplay wiki.</h2>
            </div>
            <div className="bt-section-header__actions">
              <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.collector)}>
                Collector access
              </Button>
              <Button type="button" className="bt-button bt-button--outline" onClick={() => setActiveRoom(portalRooms.producer)}>
                Producer route
              </Button>
            </div>
          </div>

          <div className="bt-bridge__grid">
            {bridgeModules.map((module) => (
              <article key={module.title} className="bt-bridge__card">
                <span>{module.label}</span>
                <h3>{module.title}</h3>
                <p>{module.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bt-music" id="score-sketches" aria-labelledby="bt-music-title">
          <header className="bt-section-header bt-section-header--split">
            <div>
              <p className="bt-section-header__eyebrow">Cue world</p>
              <h2 id="bt-music-title">Score rooms that keep the soundtrack visibly attached.</h2>
              <p>Each poster works like proof-of-tone first, then hands off directly into the Walls/Devine listening world.</p>
            </div>
            <div className="bt-section-header__actions">
              <Button as="a" href="/walls-devine#walls-devine-listening-room" className="bt-button bt-button--outline">
                Open companion listening room
              </Button>
            </div>
          </header>

          <ul className="bt-music__grid">
            {musicPosters.map((poster) => (
              <li key={poster.title} id={poster.id} className="bt-music__poster">
                <div className="bt-music__visual" aria-hidden="true">
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
                    <Button as="a" href={`/walls-devine?player=${poster.playerTarget}#walls-devine-listening-room`} className="bt-button bt-button--outline">
                      Play on Walls/Devine
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
              <p className="bt-section-header__eyebrow">Games / collectibles</p>
              <h2 id="bt-collectibles-title">Four objects that make the page feel entered, not merely read.</h2>
              <p>Each tile opens a takeover room with a microgame prompt, collector framing, and a cleaner reason to come back.</p>
            </div>
            <div className="bt-section-header__actions">
              <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.collector)}>
                Join the collector layer
              </Button>
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
        </section>

        <section className="bt-world" aria-labelledby="bt-world-title">
          <div className="bt-world__grid">
            <article className="bt-world__panel">
              <p className="bt-section-header__eyebrow">Story architecture</p>
              <h2 id="bt-world-title">The narrative still lands in three clean turns.</h2>
              <ul className="bt-world__story-grid">
                {storyMoments.map((moment) => (
                  <li key={moment.title} className="bt-world__story-card">
                    <span>{moment.label}</span>
                    <h3>{moment.title}</h3>
                    <p>{moment.copy}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="bt-world__panel">
              <p className="bt-section-header__eyebrow">Tone / market</p>
              <h2>Myth, satire, and diaspora texture without the bloat.</h2>
              <div className="bt-world__split">
                <div className="bt-world__list-block">
                  <h3>Global comps</h3>
                  <ul>
                    {globalComps.map((comp) => (
                      <li key={comp}>{comp}</li>
                    ))}
                  </ul>
                </div>
                <div className="bt-world__list-block">
                  <h3>India comps</h3>
                  <ul>
                    {indiaComps.map((comp) => (
                      <li key={comp}>{comp}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bt-world__theme-row" aria-label="Core themes">
                {themes.map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="bt-finale" aria-labelledby="bt-finale-title">
          <div className="bt-finale__body">
            <p className="bt-section-header__eyebrow">Final invitation</p>
            <h2 id="bt-finale-title">A streamlined portal with a premium handoff.</h2>
            <p>
              Bong Tour now reads like a film-world launch page: poster first, cue rooms second, collectibles third, and the actual partner conversations tucked
              behind immersive entry points instead of sitting flat on the surface.
            </p>
            <div className="bt-finale__actions">
              <Button type="button" className="bt-button" onClick={() => setActiveRoom(portalRooms.producer)}>
                Enter producer portal
              </Button>
              <Button type="button" className="bt-button bt-button--outline" onClick={() => setActiveRoom(portalRooms.collector)}>
                Open signal room
              </Button>
            </div>
          </div>
        </section>
      </div>

      {hasMounted && activeRoom
        ? createPortal(
            <div className="bt-room-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={() => setActiveRoom(null)}>
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

                  <div className="bt-room-modal__actions">
                    {activeRoom.actions.map((action) => (
                      <Button
                        key={action.label}
                        as="a"
                        href={action.href}
                        className={action.outline ? "bt-button bt-button--outline" : "bt-button"}
                      >
                        {action.label}
                      </Button>
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
