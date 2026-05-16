"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { songPostCards } from "@/components/walls-devine/content";
import { WallsDevineCollectorAccess } from "@/components/walls-devine/WallsDevineCollectorAccess";
import { type CollectorGridTile, WallsDevineCollectorGrid } from "@/components/walls-devine/WallsDevineCollectorGrid";
import { getWallsDevineCollectorHeroNote } from "@/lib/firebase/walls-devine-public";
import { defaultWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import homeImage from "@/app/walls-devine/assets/instagram/4.home.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import poetryImage from "@/app/walls-devine/assets/instagram/7.poetry.png";
import resolveImage from "@/app/walls-devine/assets/instagram/6.resolve.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

type GridTile = {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  playerTarget?: string;
  center?: boolean;
  teaser: string;
  challengeLabel: string;
  challengePrompt: string;
  easterEggTitle: string;
  easterEggBody: string;
  interest: string;
  gameMode: CollectorGridTile["gameMode"];
  tokenLabel: string;
  storySummary: string;
  visualThread: string;
  makingNote: string;
};

const songStoryMap = new Map(songPostCards.map((card) => [card.title, card]));

function withSongStory(tile: Omit<GridTile, "storySummary" | "visualThread" | "makingNote">): GridTile {
  const story = songStoryMap.get(tile.title);

  return {
    ...tile,
    storySummary: story?.storySummary ?? "A collector-side chapter from the larger Walls/Devine world.",
    visualThread: story?.visualThread ?? "Artifact geometry, bold type, and red-thread iconography.",
    makingNote: story?.makingNote ?? "Built to extend the physical world of the rollout beyond the listening room."
  } satisfies GridTile;
}

const instagramGrid: GridTile[] = [
  withSongStory({
    slug: "joint-queen",
    title: "Joint Queen",
    role: "Song 01",
    image: jointQueenImage,
    playerTarget: "joint-queen",
    teaser: "Smoke-crowned swagger and the first true door into the record.",
    challengeLabel: "Crown run",
    challengePrompt: "Grab five ember crowns before the smoke drops.",
    easterEggTitle: "The first crown",
    easterEggBody: "Joint Queen marks the moment the project stopped feeling split and finally sounded unified. That sense of arrival is the hidden engine behind the whole rollout.",
    interest: "Joint Queen collector list",
    gameMode: "crown-chase",
    tokenLabel: "crown"
  }),
  withSongStory({
    slug: "stash-daddy",
    title: "Stash Daddy",
    role: "Song 02",
    image: stashDaddyImage,
    playerTarget: "stash-daddy",
    teaser: "Backroom pressure, analog swagger, and low-end authority.",
    challengeLabel: "Vault pulse",
    challengePrompt: "Memorize the four-digit stash code before the shutters drop.",
    easterEggTitle: "Kitchen-table origin",
    easterEggBody: "Stash Daddy carries the sound of creation without rehearsal panic. The hidden note is that its attitude comes from spontaneity, not calculation.",
    interest: "Stash Daddy collector list",
    gameMode: "vault-code",
    tokenLabel: "vault"
  }),
  withSongStory({
    slug: "space-cruiser",
    title: "Space Cruiser",
    role: "Song 03",
    image: spaceCruiserImage,
    playerTarget: "space-cruiser",
    teaser: "Cosmic lift, ritual propulsion, and the third portal out of the room.",
    challengeLabel: "Orbital lock",
    challengePrompt: "Hit three perfect orbit locks before the cruiser drifts.",
    easterEggTitle: "Third door opened",
    easterEggBody: "Space Cruiser became the cosmic third door for both the record and Bong Tour, turning a brutal live-show comedown into mythic lift.",
    interest: "Space Cruiser collector list",
    gameMode: "orbit-lock",
    tokenLabel: "orbit"
  }),
  withSongStory({
    slug: "home",
    title: "Home",
    role: "Song 04",
    image: homeImage,
    playerTarget: "home",
    teaser: "The quiet middle chapter where the myth comes back to earth.",
    challengeLabel: "Porch pattern",
    challengePrompt: "Replay the porch lights before the house goes dark.",
    easterEggTitle: "Landing signal",
    easterEggBody: "Home holds the nervous-system reset of finally landing somewhere honest. The hidden note is that its power comes from keeping the first truthful take intact.",
    interest: "Home collector list",
    gameMode: "porch-lights",
    tokenLabel: "glow"
  }),
  {
    slug: "volume-1",
    title: "Walls/Devine Volume 1",
    role: "Collector's item",
    image: volOneImage,
    center: true,
    teaser: "The central object: one release world for music, film, score, and private access.",
    challengeLabel: "Seal sequence",
    challengePrompt: "Align the three seal rings before the object slips closed.",
    easterEggTitle: "Volume 1 is the artifact",
    easterEggBody: "The center tile is not a poster. It is the invitation layer: album object, score world, and private collector channel bundled into one deliberate experience.",
    interest: "Walls Devine Volume 1 collector list",
    gameMode: "seal-alignment",
    tokenLabel: "seal",
    storySummary: "The centerpiece holds the brand logic of the entire experience: make the album feel collectible, cinematic, and alive before anyone hears a note in sequence.",
    visualThread: "Central seal geometry, engraved borders, and the nine-tile wall as a single artifact instead of nine isolated posts.",
    makingNote: "Built as the campaign anchor so every surrounding chapter can ladder back into one premium collector experience."
  },
  withSongStory({
    slug: "decay",
    title: "Decay",
    role: "Song 05",
    image: decayImage,
    playerTarget: "decay",
    teaser: "Beautiful ruin, stubborn pulse, and collapse turned into testimony.",
    challengeLabel: "Rust line",
    challengePrompt: "Patch six breaks before the room fully decays.",
    easterEggTitle: "Collapse as design",
    easterEggBody: "Decay works because it treats collapse as style and witness at the same time. The hidden note is that its heaviness was a permission slip, not a detour.",
    interest: "Decay collector list",
    gameMode: "decay-patch",
    tokenLabel: "rust"
  }),
  withSongStory({
    slug: "resolve",
    title: "Resolve",
    role: "Song 06",
    image: resolveImage,
    playerTarget: "resolve",
    teaser: "The ignition track that sets campaign pressure and forward motion.",
    challengeLabel: "Spark run",
    challengePrompt: "Climb the fuse in order before the spark snaps.",
    easterEggTitle: "Campaign fuse",
    easterEggBody: "Resolve exists to move first. The hidden note is that its chorus lands early on purpose, because hesitation would undercut the whole campaign thesis.",
    interest: "Resolve collector list",
    gameMode: "spark-ladder",
    tokenLabel: "spark"
  }),
  withSongStory({
    slug: "poetry",
    title: "Poetry",
    role: "Song 07",
    image: poetryImage,
    playerTarget: "poetry",
    teaser: "Writerly nerve, heartbreak residue, and the record's heart chamber.",
    challengeLabel: "Notebook memory",
    challengePrompt: "Choose the right word each round to finish the line.",
    easterEggTitle: "Notebook reconstruction",
    easterEggBody: "Poetry widened from private confession into a shared statement. The hidden note is that its language was rebuilt line by line from notebook fragments.",
    interest: "Poetry collector list",
    gameMode: "line-break",
    tokenLabel: "line"
  }),
  withSongStory({
    slug: "gratitude",
    title: "Gratitude",
    role: "Song 08",
    image: gratitudeImage,
    playerTarget: "gratitude",
    teaser: "The closing lift: peace, glow, and open-ended arrival.",
    challengeLabel: "Bloom run",
    challengePrompt: "Open every bud, then trigger the final bloom.",
    easterEggTitle: "Final-scene glow",
    easterEggBody: "Gratitude was finished last so it could feel like emotional release, not simple closure. The hidden note is that its calm was engineered as the final image.",
    interest: "Gratitude collector list",
    gameMode: "bloom-garden",
    tokenLabel: "bloom"
  })
];

type CollectorLetterQuote = {
  source: string;
  author: string;
  text: string;
};

const collectorLetterQuotes: readonly CollectorLetterQuote[] = [
  {
    source: "Joint Queen",
    author: "Terry Devine",
    text: "Joint Queen needed to feel like an entrance cue with authority and swagger, not just a groove loop."
  },
  {
    source: "Poetry",
    author: "John Walls",
    text: "Poetry is the inward core of Volume 1: language first, ornament second."
  },
  {
    source: "Home",
    author: "John Walls",
    text: "Home is the grounded chapter that lets the project breathe between heavier passages."
  },
  {
    source: "Decay",
    author: "Terry Devine",
    text: "Decay is meant to sound like memory collapsing and reforming at the same time."
  }
];

const collectorQuoteIntervalSeconds = 15;
const legacyCollectorHeroBody =
  "Join the private collector email for first-listen links, studio-journal fragments, artifact drop notes, and release-night signals as each room opens across Volume 1.";
const heartfeltCollectorHeroBody =
  "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine";
const wallsDevineBookingIntakeHref = `/contact?${new URLSearchParams({
  context: "walls-devine-booking",
  project: "Walls/Devine",
  inquiryType: "live-booking"
}).toString()}`;

export function WallsDevineLanding() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isQuotePaused, setIsQuotePaused] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "shared" | "copied">("idle");
  const [collectorHeroNote, setCollectorHeroNote] = useState(defaultWallsDevineCollectorHeroNote);
  const collectorHeroBody = collectorHeroNote.body.trim() === legacyCollectorHeroBody ? heartfeltCollectorHeroBody : collectorHeroNote.body;

  const activeQuote = collectorLetterQuotes[activeQuoteIndex] ?? collectorLetterQuotes[0];

  useEffect(() => {
    let isActive = true;

    void getWallsDevineCollectorHeroNote().then((note) => {
      if (isActive) {
        setCollectorHeroNote(note);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (isQuotePaused) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveQuoteIndex((currentIndex) => (currentIndex + 1) % collectorLetterQuotes.length);
    }, collectorQuoteIntervalSeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [activeQuoteIndex, isQuotePaused]);

  useEffect(() => {
    if (shareFeedback === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setShareFeedback("idle");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [shareFeedback]);

  function handleNextQuote() {
    setActiveQuoteIndex((currentIndex) => (currentIndex + 1) % collectorLetterQuotes.length);
  }

  async function handleShareQuote() {
    if (typeof window === "undefined") {
      return;
    }

    const browserNavigator = window.navigator;
    const shareUrl = new URL("/walls-devine", window.location.origin).toString();
    const shareText = `"${activeQuote.text}"\n\n${activeQuote.author} · ${activeQuote.source}`;

    if (typeof browserNavigator.share === "function") {
      try {
        await browserNavigator.share({
          title: `${activeQuote.source} · Walls/Devine Volume 1`,
          text: shareText,
          url: shareUrl
        });
        setShareFeedback("shared");
      } catch {
        return;
      }

      return;
    }

    if (browserNavigator.clipboard?.writeText) {
      try {
        await browserNavigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShareFeedback("copied");
      } catch {
        setShareFeedback("idle");
      }
    }
  }

  return (
    <>
      <SectionShell id="hero" labelledBy="walls-devine-title" variant="hero" className="wd-hero-shell" innerClassName="wd-hero">
        <div className="wd-hero__layout">
          <div className="wd-hero__showcase">
            <SectionHeader
              id="walls-devine-title"
              eyebrow="Collector experience"
              title="Walls/Devine Volume 1"
              headingLevel="h1"
            />

            <figure className="wd-hero__cover">
              <div className="wd-hero__cover-frame">
                <Image src={volOneImage} alt="Walls/Devine Volume 1 cover artwork" priority sizes="(max-width: 900px) 82vw, 30vw" />
              </div>
              <figcaption className="wd-hero__cover-signature" aria-label="Signed by John Walls and Terry Devine">
                <p className="wd-hero__letter-signoff">With Love From the Room,</p>
                <div className="wd-hero__letter-signatures">
                  <span>John Walls</span>
                  <span>Terry Devine</span>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="wd-hero__copy">

            <div className="wd-hero__note-stack">
              <div className="wd-hero__letter" aria-label="Personal collector note for Walls/Devine Volume 1">
                <p className="wd-hero__letter-kicker">{collectorHeroNote.salutation}</p>
                <p className="wd-hero__letter-body">{collectorHeroBody}</p>

                <div className="wd-hero__letter-actions">
                  <WallsDevineCollectorAccess
                    source="walls-devine-hero"
                    interest="Walls Devine private collector email"
                    cardTitle="A private note from Terry"
                    cardDescription="If the record meets you where you are, come into the Signal Room and listen with us chapter by chapter."
                    benefits={["First-listen links", "Journal fragments", "Artifact drop notes"]}
                    modalTitle="Enter the Signal Room"
                    modalDescription={legacyCollectorHeroBody}
                    signupEyebrow="Collector access includes"
                    signupTitle="What arrives first"
                    signupDescription={legacyCollectorHeroBody}
                    submitLabel="Request Signal Room access"
                    successMessage="You are in. Watch your inbox for the next room opening, journal fragment, and collector note."
                    note="High-signal only. Reserved for first listens, journal fragments, artifact drops, and release-night updates."
                    roomOverlayScript="Collector Letter"
                    roomOverlaySubtitle="Private first-listen access"
                    renderTrigger={(openCollectorLetter) => (
                      <Button type="button" variant="primary" className="wd-hero__letter-cta" onClick={openCollectorLetter}>
                        Enter the listening room
                      </Button>
                    )}
                  />
                </div>
              </div>

              <div className="wd-hero__journal" aria-label="Rotating journal entries from Volume 1">
                <div className="wd-hero__letter-postscript">
                  <span className="wd-hero__letter-postscript-label">From the journals</span>
                  <div className="wd-hero__letter-quote-rotator" aria-live="polite">
                    {collectorLetterQuotes.map((quote, index) => (
                      <figure
                        key={quote.source}
                        className="wd-hero__letter-quote"
                        data-active={index === activeQuoteIndex}
                        aria-hidden={index !== activeQuoteIndex}
                      >
                        <blockquote>{quote.text}</blockquote>
                        <figcaption>
                          <span className="wd-hero__letter-quote-source">from &quot;{quote.source}&quot;</span>
                          <span className="wd-hero__letter-quote-author">— {quote.author}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  <div className="wd-hero__journal-controls" aria-label="Journal controls">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="wd-hero__journal-control"
                      onClick={() => setIsQuotePaused((currentState) => !currentState)}
                    >
                      {isQuotePaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="wd-hero__journal-control"
                      onClick={handleNextQuote}
                    >
                      Next entry
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="wd-hero__journal-control"
                      onClick={handleShareQuote}
                    >
                      {shareFeedback === "shared" ? "Shared" : shareFeedback === "copied" ? "Copied" : "Share entry"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-grid" labelledBy="walls-devine-grid-title" className="wd-grid-shell" innerClassName="wd-grid-section">
        <header className="wd-grid-section__header">
          <h2 id="walls-devine-grid-title">The Collector Grid</h2>
        </header>

        <WallsDevineCollectorGrid tiles={instagramGrid} />

        <div id="walls-devine-booking" className="wd-grid-section__collector-access">
          <section className="wd-booking-banner" aria-labelledby="walls-devine-booking-title">
            <div className="wd-booking-banner__copy">
              <p className="wd-booking-banner__eyebrow">Live Booking</p>
              <h2 id="walls-devine-booking-title" className="wd-booking-banner__title">
                Book Walls/Devine
              </h2>
              <p className="wd-booking-banner__description">
                Bring Volume 1 into the room for listening sessions, screenings, live bookings, and partnership conversations around the record.
              </p>
            </div>

            <div className="wd-booking-banner__action">
              <Button as="a" href={wallsDevineBookingIntakeHref} className="wd-booking-banner__button">
                Book Walls/Devine
              </Button>
              <p className="wd-booking-banner__meta">Listening events · Performance · Partnerships</p>
            </div>
          </section>
        </div>
      </SectionShell>

      <div id="walls-devine-listening-room" className="wd-player-anchor" aria-hidden="true" />
    </>
  );
}

export default WallsDevineLanding;