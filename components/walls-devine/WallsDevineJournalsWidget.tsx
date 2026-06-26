"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiPause, FiPlay, FiShare2, FiSkipForward } from "react-icons/fi";

import { Button } from "@/components/ui/Button";

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

type WallsDevineJournalsWidgetProps = {
  journalLabel: string;
};

export function WallsDevineJournalsWidget({ journalLabel }: WallsDevineJournalsWidgetProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isQuotePaused, setIsQuotePaused] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "shared" | "copied">("idle");

  const activeQuote = collectorLetterQuotes[activeQuoteIndex] ?? collectorLetterQuotes[0];

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
    <div className="wd-hero__journal" aria-label="Rotating journal entries from Volume 1">
      <div className="wd-hero__letter-postscript">
        <span className="wd-hero__letter-postscript-label">{journalLabel}</span>
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
  );
}

export default WallsDevineJournalsWidget;