"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiPause, FiPlay, FiShare2, FiSkipForward } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { EcosystemSignupForm } from "@/components/walls-devine/EcosystemSignupForm";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getWallsDevineCollectorHeroNote } from "@/lib/firebase/walls-devine-public";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";
import {
  openWallsDevineListeningRoomShortcut,
  readWallsDevinePlayerDismissed,
  wallsDevineListeningRoomAnchorId,
  wallsDevinePlayerDismissedChangeEventName
} from "@/lib/wallsDevinePlayerBridge";
import { defaultWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

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
    source: "Conviction",
    author: "John Walls",
    text: "Conviction is the pressure point that turns discipline into forward motion."
  },
  {
    source: "Decay",
    author: "Terry Devine",
    text: "Decay is meant to sound like memory collapsing and reforming at the same time."
  }
];

const collectorQuoteIntervalSeconds = 15;
const heartfeltCollectorHeroBody =
  "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine";
const wallsDevineSignalListHref = "#walls-devine-signal";
const wallsDevineListeningRoomHref = `#${wallsDevineListeningRoomAnchorId}`;

export function WallsDevineLanding() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isQuotePaused, setIsQuotePaused] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "shared" | "copied">("idle");
  const [isLetterExpanded, setIsLetterExpanded] = useState(false);
  const [isPlayerDismissed, setIsPlayerDismissed] = useState(false);
  const [collectorHeroNote, setCollectorHeroNote] = useState(defaultWallsDevineCollectorHeroNote);
  const prefersReducedMotion = usePrefersReducedMotion();
  const collectorHeroBody = collectorHeroNote.body.trim() === defaultWallsDevineCollectorHeroNote.body.trim() ? heartfeltCollectorHeroBody : collectorHeroNote.body;

  const collectorHeroBodyCollapsed = useMemo(() => {
    const firstBreak = collectorHeroBody.indexOf(". ");
    return firstBreak !== -1 ? collectorHeroBody.slice(0, firstBreak + 1) : collectorHeroBody;
  }, [collectorHeroBody]);

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
              description="Released September 1, 2026. Enter the listening room, stay close to the story, and carry the record with you."
            />

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
                    className="wd-hero__letter-cta wd-hero__collector-button wd-hero__collector-button--primary"
                    onClick={handleListeningRoomShortcut}
                    data-analytics-event="walls_devine_cta_click"
                    data-analytics-param-source="walls_devine"
                    data-analytics-param-cta="hero_listening_room"
                    data-analytics-param-destination="listening_room"
                    data-analytics-param-external="false"
                  >
                    {collectorHeroNote.primaryCtaLabel}
                  </Button>

                  <nav className="wd-hero__collector-secondary-row" aria-label="Release links">
                    <a
                      href={wallsDevineSignalListHref}
                      className="wd-hero__text-link"
                      data-analytics-event="walls_devine_cta_click"
                      data-analytics-param-source="walls_devine"
                      data-analytics-param-cta="hero_signal_list"
                      data-analytics-param-destination={wallsDevineSignalListHref}
                      data-analytics-param-external="false"
                    >
                      Join the email list
                    </a>
                    <span aria-hidden="true">/</span>
                    <a
                      href={wallsDevineMerchShopHref}
                      className="wd-hero__text-link"
                      target="_blank"
                      rel="noreferrer"
                      data-analytics-event="walls_devine_cta_click"
                      data-analytics-param-source="walls_devine"
                      data-analytics-param-cta="hero_merch_shop"
                      data-analytics-param-destination={wallsDevineMerchShopHref}
                      data-analytics-param-external="true"
                    >
                      Shop Volume 1
                    </a>
                  </nav>

                  <p className="wd-hero__signal-helper">Release notes, stories from the record, and occasional merch drops.</p>
                </div>
              </div>

              <div className="wd-hero__journal" aria-label="Rotating journal entries from Volume 1">
                <div className="wd-hero__letter-postscript">
                  <span className="wd-hero__letter-postscript-label">{collectorHeroNote.journalLabel}</span>
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
                      className="wd-hero__journal-control wd-hero__journal-control--icon"
                      onClick={() => setIsQuotePaused((currentState) => !currentState)}
                      aria-label={isQuotePaused ? "Resume journal rotation" : "Pause journal rotation"}
                      title={isQuotePaused ? "Resume" : "Pause"}
                    >
                      {isQuotePaused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="wd-hero__journal-control wd-hero__journal-control--icon"
                      onClick={handleNextQuote}
                      aria-label="Next journal entry"
                      title="Next entry"
                    >
                      <FiSkipForward aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="wd-hero__journal-control wd-hero__journal-control--icon"
                      onClick={handleShareQuote}
                      aria-label={shareFeedback === "shared" ? "Journal entry shared" : shareFeedback === "copied" ? "Journal entry copied" : "Share journal entry"}
                      title={shareFeedback === "shared" ? "Shared" : shareFeedback === "copied" ? "Copied" : "Share entry"}
                    >
                      {shareFeedback === "shared" || shareFeedback === "copied" ? <FiCheck aria-hidden="true" /> : <FiShare2 aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-signal" labelledBy="walls-devine-signal-title" className="wd-release-shell" innerClassName="wd-release-section">
        <div className="wd-release-banner">
          <EcosystemSignupForm
            className="wd-release-banner__signup"
            source="walls-devine-release-page"
            interest="Walls Devine Volume 1 updates"
            title="Stay connected to Walls/Devine"
            description="Join for considered notes from the record, the artists, and the world around Volume 1."
            submitLabel="Join the list"
            successMessage="You're on the list."
            note="Occasional release notes. No noise."
            emailOnly
          />

          <div className="wd-release-banner__merch">
            <h2 id="walls-devine-signal-title">Volume 1 merchandise</h2>
            <span>A limited collection made to live beyond the listening room.</span>
            <Button
              as="a"
              href={wallsDevineMerchShopHref}
              variant="secondary"
              className="wd-release-banner__merch-button"
              target="_blank"
              rel="noreferrer"
              data-analytics-event="walls_devine_cta_click"
              data-analytics-param-source="walls_devine"
              data-analytics-param-cta="release_merch_shop"
              data-analytics-param-destination={wallsDevineMerchShopHref}
              data-analytics-param-external="true"
            >
              Shop Volume 1
            </Button>
          </div>
        </div>
      </SectionShell>

      <div id="walls-devine-listening-room" className="wd-player-anchor" aria-hidden="true" />
    </>
  );
}

export default WallsDevineLanding;