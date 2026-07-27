"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { songPostCards } from "@/components/walls-devine/content";
import { type CollectorGridTile, WallsDevineCollectorGrid } from "@/components/walls-devine/WallsDevineCollectorGrid";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, wallsDevineLaunchDateLabel } from "@/lib/launch-state";
import type { EcosystemRewardId } from "@/lib/ecosystem/reward-catalog";
import {
  getWallsDevineBookingBannerNote,
  getWallsDevineCollectorHeroNote,
  getWallsDevineUpcomingShowsNote
} from "@/lib/firebase/walls-devine-public";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";
import {
  openWallsDevineListeningRoomShortcut,
  readWallsDevinePlayerDismissed,
  wallsDevineListeningRoomAnchorId,
  wallsDevinePlayerDismissedChangeEventName
} from "@/lib/wallsDevinePlayerBridge";
import {
  defaultWallsDevineBookingBannerNote,
  defaultWallsDevineCollectorHeroNote,
  defaultWallsDevineUpcomingShowsNote
} from "@/lib/walls-devine/public-content";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import convictionPlaceholderImage from "@/app/walls-devine/assets/instagram/4.home.png";
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
  rewardId?: EcosystemRewardId;
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
    rewardId: "wd-joint-queen-hidden-transmission",
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
    slug: "conviction",
    title: "Conviction",
    role: "Song 04",
    image: convictionPlaceholderImage,
    playerTarget: "conviction",
    teaser: "A sealed fourth chapter held in public by title alone.",
    challengeLabel: "Pressure pattern",
    challengePrompt: "Replay the pressure marks before the chapter clears.",
    easterEggTitle: "Reserved pressure",
    easterEggBody: "Conviction stays named before it is heard. The hidden note is that the slot exists to signal nerve and forward motion, not absence.",
    interest: "Conviction collector list",
    gameMode: "porch-lights",
    tokenLabel: "mark"
  }),
  {
    slug: "volume-1",
    title: "Walls/Devine Volume 1",
    role: "Collector's item",
    image: volOneImage,
    center: true,
    rewardId: "wd-volume-1-bong-tour-secret-game",
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

const heartfeltCollectorHeroBody =
  "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us as Volume 1 opens on September 1 and the next rooms line up through the fall.\n\nWith gratitude,\nTerry Devine";
const wallsDevineBookingIntakeHref = buildContactHref({
  overrides: {
    context: "walls-devine-booking",
    project: "Walls/Devine",
    inquiryType: "live-booking",
    surface: "campaign-world"
  }
});
const wallsDevineListeningRoomHref = `#${wallsDevineListeningRoomAnchorId}`;

export function WallsDevineLanding() {
  const [isLetterExpanded, setIsLetterExpanded] = useState(false);
  const [isPlayerDismissed, setIsPlayerDismissed] = useState(false);
  const [collectorHeroNote, setCollectorHeroNote] = useState(defaultWallsDevineCollectorHeroNote);
  const [bookingBannerNote, setBookingBannerNote] = useState(defaultWallsDevineBookingBannerNote);
  const [upcomingShowsNote, setUpcomingShowsNote] = useState(defaultWallsDevineUpcomingShowsNote);
  const prefersReducedMotion = usePrefersReducedMotion();
  const collectorHeroBody = collectorHeroNote.body.trim() === defaultWallsDevineCollectorHeroNote.body.trim() ? heartfeltCollectorHeroBody : collectorHeroNote.body;

  const collectorHeroBodyCollapsed = useMemo(() => {
    const firstBreak = collectorHeroBody.indexOf(". ");
    return firstBreak !== -1 ? collectorHeroBody.slice(0, firstBreak + 1) : collectorHeroBody;
  }, [collectorHeroBody]);

  const previewTiles = useMemo(() => {
    const slugOrder = ["volume-1", "joint-queen", "resolve"] as const;
    return slugOrder.map((slug) => instagramGrid.find((t) => t.slug === slug)).filter((t): t is GridTile => t !== undefined);
  }, []);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getWallsDevineCollectorHeroNote(),
      getWallsDevineBookingBannerNote(),
      getWallsDevineUpcomingShowsNote()
    ]).then(([note, banner, shows]) => {
      if (isActive) {
        setCollectorHeroNote(note);
        setBookingBannerNote(banner);
        setUpcomingShowsNote(shows);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setIsPlayerDismissed(readWallsDevinePlayerDismissed());

    const handleDismissedChange = (event: Event) => {
      const nextState = (event as CustomEvent<{ isDismissed: boolean }>).detail?.isDismissed ?? false;
      setIsPlayerDismissed(nextState);
    };

    window.addEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);

    return () => {
      window.removeEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);
    };
  }, []);

  function handleListeningRoomShortcut(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    openWallsDevineListeningRoomShortcut({
      isPlayerDismissed,
      prefersReducedMotion
    });
  }

  return (
    <>
      <SectionShell id="hero" labelledBy="walls-devine-title" variant="hero" className="wd-hero-shell" innerClassName="wd-hero">
        <div className="wd-hero__layout">
          <div className="wd-hero__showcase">
            <SectionHeader
              id="walls-devine-title"
              eyebrow={collectorHeroNote.eyebrow}
              title={collectorHeroNote.title}
              headingLevel="h1"
            />

            <div className="wd-hero__gamification-strip" aria-label="Release details">
              <span>8 tracks</span>
              <span className="wd-hero__gamification-strip__dot" aria-hidden="true">·</span>
              <span>8 collector challenges</span>
              <span className="wd-hero__gamification-strip__dot" aria-hidden="true">·</span>
              <span>{wallsDevineLaunchDateLabel}</span>
            </div>

            <figure className="wd-hero__cover">
              <div className="wd-hero__cover-frame">
                <Image src={volOneImage} alt="Walls/Devine Volume 1 cover artwork" priority sizes="(max-width: 900px) 82vw, 30vw" />
              </div>
              <figcaption className="wd-hero__cover-signature" aria-label="Signed by John Walls and Terry Devine">
                <p className="wd-hero__letter-signoff">{collectorHeroNote.signatureIntro}</p>
                <div className="wd-hero__letter-signatures">
                  <span>John Walls</span>
                  <span>Terry Devine</span>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="wd-hero__copy">

            <div className="wd-hero__note-stack">
              <div className="wd-hero__letter wd-hero__collector-card" aria-label="Personal collector note for Walls/Devine Volume 1">
                <p className="wd-hero__letter-kicker">{collectorHeroNote.salutation}</p>
                <div className="wd-hero__letter-body-collapse">
                  <p className="wd-hero__letter-body">
                    {isLetterExpanded ? collectorHeroBody : collectorHeroBodyCollapsed}
                  </p>
                </div>
                {collectorHeroBody !== collectorHeroBodyCollapsed && (
                  <button
                    type="button"
                    className="wd-hero__letter-collapse-toggle"
                    onClick={() => setIsLetterExpanded((current) => !current)}
                    aria-expanded={isLetterExpanded}
                  >
                    {isLetterExpanded ? "Close ↑" : "Read the full note →"}
                  </button>
                )}

                <div className="wd-hero__letter-actions wd-hero__collector-actions" aria-label="Walls Devine quick actions">
                  <Button
                    as="a"
                    href={wallsDevineListeningRoomHref}
                    className="wd-hero__letter-cta wd-hero__collector-button wd-hero__collector-button--primary wd-hero__letter-cta--primary-pulse"
                    onClick={handleListeningRoomShortcut}
                    data-analytics-event="walls_devine_cta_click"
                    data-analytics-param-source="walls_devine"
                    data-analytics-param-cta="hero_listening_room"
                    data-analytics-param-destination="listening_room"
                    data-analytics-param-external="false"
                  >
                    {collectorHeroNote.primaryCtaLabel}
                  </Button>

                  <div className="wd-hero__collector-secondary-row">
                    <Button
                      as="a"
                      href={wallsDevineMerchShopHref}
                      variant="ghost"
                      className="wd-hero__signal-link wd-hero__collector-button wd-hero__collector-button--secondary wd-hero__collector-button--ghost"
                      target="_blank"
                      rel="noreferrer"
                      data-analytics-event="walls_devine_cta_click"
                      data-analytics-param-source="walls_devine"
                      data-analytics-param-cta="hero_merch_shop"
                      data-analytics-param-destination={wallsDevineMerchShopHref}
                      data-analytics-param-external="true"
                    >
                      {collectorHeroNote.secondaryCtaLabel}
                    </Button>
                  </div>

                  <div className="wd-hero__grid-preview" aria-label="Collector grid preview">
                    <div className="wd-hero__grid-preview__tiles">
                      {previewTiles.map((tile) => (
                        <div
                          key={tile.slug}
                          className={`wd-hero__grid-preview__tile${tile.slug === "resolve" ? " wd-hero__grid-preview__tile--live" : ""}`}
                        >
                          <Image src={tile.image} alt={tile.title} sizes="56px" />
                        </div>
                      ))}
                    </div>
                    <a
                      href="#walls-devine-grid"
                      className="wd-hero__grid-preview__cta"
                      aria-label="Jump to the full Collector Grid"
                    >
                      ↓ Enter the Collector Grid
                    </a>
                  </div>
                </div>
              </div>

              {/*
                Journals widget intentionally hidden on the front page for now.
                Restore with:
                <WallsDevineJournalsWidget journalLabel={collectorHeroNote.journalLabel} />
              */}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-grid" labelledBy="walls-devine-grid-title" className="wd-grid-shell" innerClassName="wd-grid-section">
        <header className="wd-grid-section__header">
          <p className="wd-grid-section__eyebrow">Collector path</p>
          <h2 id="walls-devine-grid-title">The Collector Grid</h2>
          <p>Open the cover first or tap any chapter tile. Each room loops you back into the record and the next chapter of Volume 1.</p>

          <div className="wd-grid-section__steps" aria-label="Collector path steps">
            <span>Tap a chapter tile</span>
            <span>Clear the room challenge</span>
            <span>Open the hidden note</span>
          </div>
        </header>

        <WallsDevineCollectorGrid tiles={instagramGrid} />

        <div id="walls-devine-booking" className="wd-grid-section__collector-access">
          <section className="wd-booking-banner" aria-labelledby="walls-devine-booking-title">
            <div className="wd-booking-banner__copy">
              <p className="wd-booking-banner__eyebrow">{bookingBannerNote.eyebrow}</p>
              <h2 id="walls-devine-booking-title" className="wd-booking-banner__title">
                {bookingBannerNote.title}
              </h2>
              <p className="wd-booking-banner__description">
                {bookingBannerNote.description}
              </p>
            </div>

            <div className="wd-booking-banner__action">
              <Button
                as="a"
                href={wallsDevineMerchShopHref}
                variant="secondary"
                className="wd-booking-banner__button wd-booking-banner__button--secondary"
                target="_blank"
                rel="noreferrer"
                data-analytics-event="walls_devine_cta_click"
                data-analytics-param-source="walls_devine"
                data-analytics-param-cta="booking_banner_merch"
                data-analytics-param-destination={wallsDevineMerchShopHref}
                data-analytics-param-external="true"
              >
                {bookingBannerNote.secondaryCtaLabel}
              </Button>
              <Button
                as="a"
                href={wallsDevineBookingIntakeHref}
                className="wd-booking-banner__button"
                data-analytics-event="walls_devine_cta_click"
                data-analytics-param-source="walls_devine"
                data-analytics-param-cta="booking_banner_book"
                data-analytics-param-destination={wallsDevineBookingIntakeHref}
                data-analytics-param-external="false"
              >
                {bookingBannerNote.primaryCtaLabel}
              </Button>
              <p className="wd-booking-banner__meta">{bookingBannerNote.meta}</p>
            </div>
          </section>

          <section className="wd-upcoming-shows" aria-labelledby="walls-devine-upcoming-shows-title">
            <div className="wd-upcoming-shows__head">
              <p className="wd-upcoming-shows__eyebrow">{upcomingShowsNote.eyebrow}</p>
              <h3 id="walls-devine-upcoming-shows-title" className="wd-upcoming-shows__title">{upcomingShowsNote.title}</h3>
              <p className="wd-upcoming-shows__description">{upcomingShowsNote.description}</p>
            </div>

            {upcomingShowsNote.shows.length ? (
              <ul className="wd-upcoming-shows__list">
                {upcomingShowsNote.shows.map((show) => (
                  <li key={show.id} className="wd-upcoming-shows__item">
                    <div className="wd-upcoming-shows__line">
                      <p className="wd-upcoming-shows__date">{show.dateLabel}</p>
                      <p className="wd-upcoming-shows__city">{show.city}</p>
                    </div>
                    <div className="wd-upcoming-shows__line">
                      <p className="wd-upcoming-shows__venue">{show.venue}</p>
                      <p className="wd-upcoming-shows__status">{show.status}</p>
                    </div>
                    {show.href ? (
                      <a href={show.href} target="_blank" rel="noreferrer" className="wd-upcoming-shows__link">
                        Details
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wd-upcoming-shows__empty">{upcomingShowsNote.emptyState}</p>
            )}
          </section>
        </div>
      </SectionShell>

      <div id="walls-devine-listening-room" className="wd-player-anchor" aria-hidden="true" />
    </>
  );
}

export default WallsDevineLanding;
