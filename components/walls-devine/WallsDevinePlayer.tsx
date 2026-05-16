"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import homeImage from "@/app/walls-devine/assets/instagram/4.home.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import poetryImage from "@/app/walls-devine/assets/instagram/7.poetry.png";
import resolveImage from "@/app/walls-devine/assets/instagram/6.resolve.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import type { SongPostCard } from "@/components/walls-devine/content";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

type WallsDevinePlayerProps = {
  tracks: SongPostCard[];
};

const trackPosterImages: Record<number, StaticImageData> = {
  1: jointQueenImage,
  2: stashDaddyImage,
  3: spaceCruiserImage,
  4: homeImage,
  5: decayImage,
  6: resolveImage,
  7: poetryImage,
  8: gratitudeImage
};

function formatTrackNumber(trackNumber: number) {
  return String(trackNumber).padStart(2, "0");
}

function getTrackAudioSrc(fileName: string) {
  return `/walls-devine/releases/volume1/${encodeURIComponent(fileName)}`;
}

export function WallsDevinePlayer({ tracks }: WallsDevinePlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const titleId = useId();
  const activeTrack = tracks[activeIndex] ?? tracks[0];
  const activeSrc = getTrackAudioSrc(activeTrack.audioFileName);
  const activePosterImage = trackPosterImages[activeTrack.trackNumber] ?? volOneImage;
  const activePosterAlt = `${activeTrack.title} cover artwork`;

  useEffect(() => {
    if (!isOpen) {
      audioRef.current?.pause();
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    audioRef.current?.load();
  }, [activeSrc, isOpen]);

  function openPlayer(index: number) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function closePlayer() {
    setIsOpen(false);
  }

  function showPreviousTrack() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? tracks.length - 1 : currentIndex - 1));
  }

  function showNextTrack() {
    setActiveIndex((currentIndex) => (currentIndex === tracks.length - 1 ? 0 : currentIndex + 1));
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closePlayer();
    }
  }

  return (
    <>
      <section className="wd-player" aria-labelledby="wd-player-title">
        <div className="wd-player__card">
          <figure className="wd-player__cover">
            <div className="wd-player__cover-frame">
              <Image src={activePosterImage} alt={activePosterAlt} sizes="(max-width: 720px) 42vw, 220px" />
            </div>
          </figure>

          <div className="wd-player__summary">
            <span className="wd-player__eyebrow">Listening room</span>
            <h3 id="wd-player-title">Volume 1 modular player</h3>
            <p>
              Open the album object, move song to song, and keep each track&apos;s distilled Instagram story, making note, and Bong Tour bridge in one
              mobile-friendly popup.
            </p>

            <div className="wd-player__actions">
              <Button type="button" onClick={() => openPlayer(activeIndex)}>
                Open player
              </Button>
              <Button type="button" variant="secondary" onClick={() => openPlayer(0)}>
                Start at track 01
              </Button>
            </div>

            <p className="wd-player__current">
              Current module: Track {formatTrackNumber(activeTrack.trackNumber)} · {activeTrack.title} · {activeTrack.duration}
            </p>
          </div>
        </div>

        <div className="wd-player__track-strip" aria-label="Album track modules">
          {tracks.map((track, index) => (
            <button
              key={track.title}
              type="button"
              className={cx("wd-player__track-chip", index === activeIndex && "wd-player__track-chip--active")}
              onClick={() => openPlayer(index)}
            >
              <span>{formatTrackNumber(track.trackNumber)}</span>
              <strong>{track.title}</strong>
              <em>{track.duration}</em>
            </button>
          ))}
        </div>

        <div className="wd-post__cards" role="list" aria-label="Song post card copy kit">
          {tracks.map((track, index) => (
            <article key={track.title} role="listitem" className="wd-post__card">
              <header>
                <span>
                  Track {formatTrackNumber(track.trackNumber)} · {track.phase}
                </span>
                <h3>{track.title}</h3>
              </header>
              <p>{track.hook}</p>
              <p>{track.caption}</p>
              <p className="wd-post__story">{track.storySummary}</p>
              <p className="wd-post__visual">Visual thread: {track.visualThread}</p>

              <div className="wd-post__links" aria-label={`${track.title} references`}>
                <a href={`/walls-devine/journals/${track.journalSlug}.md`}>Read journal entry</a>
                {track.bongTourCueId ? <a href={`/bong-tour#${track.bongTourCueId}`}>View cue on Bong Tour</a> : null}
                <button type="button" onClick={() => openPlayer(index)}>
                  Open in player
                </button>
              </div>

              {track.bongTourCueId ? (
                <div className="wd-post__bong-link">
                  {track.bongTourContext ? <p>{track.bongTourContext}</p> : null}
                </div>
              ) : null}

              <details className="wd-post__detail">
                <summary>Making note</summary>
                <p>{track.makingNote}</p>
              </details>

              <details className="wd-post__detail">
                <summary>Technical note</summary>
                <p>{track.technicalNote}</p>
              </details>
            </article>
          ))}
        </div>
      </section>

      {isOpen ? (
        <div className="wd-player-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={handleBackdropClick}>
          <div className="wd-player-modal__panel">
            <header className="wd-player-modal__header">
              <div>
                <span className="wd-player-modal__eyebrow">Volume 1 listening room</span>
                <h3 id={titleId}>{activeTrack.title}</h3>
                <p>{activeTrack.caption}</p>
              </div>

              <button type="button" className="wd-player-modal__close" onClick={closePlayer} aria-label="Close player">
                Close
              </button>
            </header>

            <div className="wd-player-modal__layout">
              <section className="wd-player-modal__current" aria-label="Current track player">
                <div className="wd-player-modal__art">
                  <div className="wd-player-modal__art-frame">
                    <Image src={activePosterImage} alt={activePosterAlt} sizes="(max-width: 960px) 72vw, 360px" />
                  </div>
                  <p>
                    Track {formatTrackNumber(activeTrack.trackNumber)} · {activeTrack.duration}
                  </p>
                </div>

                <div className="wd-player-modal__transport">
                  <audio ref={audioRef} controls preload="metadata" src={activeSrc} className="wd-player-modal__audio">
                    Your browser does not support audio playback.
                  </audio>

                  <div className="wd-player-modal__transport-actions">
                    <Button type="button" variant="ghost" onClick={showPreviousTrack}>
                      Previous
                    </Button>
                    <Button type="button" variant="secondary" onClick={showNextTrack}>
                      Next
                    </Button>
                  </div>
                </div>

                <div className="wd-player-modal__notes">
                  <article>
                    <span>Instagram synthesis</span>
                    <p>{activeTrack.storySummary}</p>
                  </article>
                  <article>
                    <span>Making note</span>
                    <p>{activeTrack.makingNote}</p>
                  </article>
                  <article>
                    <span>Technical note</span>
                    <p>{activeTrack.technicalNote}</p>
                  </article>
                  {activeTrack.bongTourContext ? (
                    <article>
                      <span>Bong Tour bridge</span>
                      <p>{activeTrack.bongTourContext}</p>
                    </article>
                  ) : null}
                </div>

                <div className="wd-player-modal__links">
                  <a href={`/walls-devine/journals/${activeTrack.journalSlug}.md`}>Read journal entry</a>
                  {activeTrack.bongTourCueId ? <a href={`/bong-tour#${activeTrack.bongTourCueId}`}>View cue on Bong Tour</a> : null}
                </div>
              </section>

              <section className="wd-player-modal__queue" aria-label="Album track list">
                <ol>
                  {tracks.map((track, index) => (
                    <li key={track.title}>
                      <button
                        type="button"
                        className={cx("wd-player-modal__queue-item", index === activeIndex && "wd-player-modal__queue-item--active")}
                        onClick={() => setActiveIndex(index)}
                        aria-current={index === activeIndex ? "true" : undefined}
                      >
                        <span>{formatTrackNumber(track.trackNumber)}</span>
                        <div>
                          <strong>{track.title}</strong>
                          <p>{track.hook}</p>
                        </div>
                        <em>{track.duration}</em>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default WallsDevinePlayer;