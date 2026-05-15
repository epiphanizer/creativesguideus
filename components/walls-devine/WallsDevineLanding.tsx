import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import {
  cadenceGuidance,
  releaseIdentity,
  roadmapSteps,
  sharedCaptionStarter,
  songPostCards
} from "@/components/walls-devine/content";
import decayImage from "@/app/5.decay.png";
import gratitudeImage from "@/app/8.gratitude.png";
import homeImage from "@/app/4.home.png";
import jointQueenImage from "@/app/1.joint-queen.png";
import poetryImage from "@/app/7.poetry.png";
import resolveImage from "@/app/6.resolve.png";
import spaceCruiserImage from "@/app/3.space-cruiser.png";
import stashDaddyImage from "@/app/2.stash-daddy.png";
import volOneImage from "@/app/WallsDevineVol1.png";

type GridTile = {
  title: string;
  role: string;
  image: StaticImageData;
  center?: boolean;
};

const instagramGrid: GridTile[] = [
  { title: "Joint Queen", role: "Song 01", image: jointQueenImage },
  { title: "Space Cruiser", role: "Song 03", image: spaceCruiserImage },
  { title: "Stash Daddy", role: "Song 02", image: stashDaddyImage },
  { title: "Poetry", role: "Song 07", image: poetryImage },
  { title: "Walls / Devine Vol. 1", role: "Center cover", image: volOneImage, center: true },
  { title: "Resolve", role: "Song 06", image: resolveImage },
  { title: "Home", role: "Song 04", image: homeImage },
  { title: "Gratitude", role: "Song 08", image: gratitudeImage },
  { title: "Decay", role: "Song 05", image: decayImage }
];

const releaseSpecs = [
  {
    label: "Store Master",
    value: "3000 x 3000 JPG",
    note: "Use this for distributor upload so every cover clears minimum requirements with linework intact."
  },
  {
    label: "Instagram Grid",
    value: "1080 x 1080 JPG",
    note: "Export from the master to keep all nine posts cohesive and tuned for feed compression."
  },
  {
    label: "Archive Social",
    value: "2160 x 2160 PNG/JPG",
    note: "Keep a sharper social backup for future recrops, reels, and paid placements."
  }
];

const directionNotes = [
  "Keep the palette locked to red, off-white, and dark charcoal text.",
  "Treat the center cover as the style bible for border weight and lightning language.",
  "Generate artwork first, then set all final type manually for clean release typography.",
  "Design each tile to stand alone while letting smoke, bolts, and symbols visually bridge neighbors."
];

export function WallsDevineLanding() {
  return (
    <>
      <SectionShell id="hero" labelledBy="walls-devine-title" variant="hero" className="wd-hero-shell" innerClassName="wd-hero">
        <div className="wd-hero__layout">
          <div className="wd-hero__copy">
            <SectionHeader
              id="walls-devine-title"
              eyebrow="Album release world"
              title="Walls Devine Vol. 1"
              subtitle="A split-world cover system built for streaming and social rollout"
              description="Walls carries the inward writing ritual. Devine carries the amplified stage force. The lightning seam keeps both worlds in one myth."
              headingLevel="h1"
            />

            <div className="wd-hero__actions">
              <Button as="a" href="#walls-devine-grid">
                View 9-tile grid
              </Button>
              <Button as="a" href="/bong-tour" variant="secondary">
                Open Bong Tour deck
              </Button>
            </div>

            <ul className="wd-hero__quickfacts" aria-label="Release direction">
              <li>
                <span>Core language</span>
                <strong>Engraved red-and-white poster art</strong>
              </li>
              <li>
                <span>Center mark</span>
                <strong>Lightning split + Vol. 1 seal zone</strong>
              </li>
              <li>
                <span>Campaign mode</span>
                <strong>8 songs orbiting one portal cover</strong>
              </li>
            </ul>
          </div>

          <figure className="wd-hero__cover">
            <div className="wd-hero__cover-frame">
              <Image src={volOneImage} alt="Walls Devine Vol. 1 album cover concept" priority sizes="(max-width: 900px) 86vw, 38vw" />
            </div>
            <figcaption>Center cover concept for the release universe</figcaption>
          </figure>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-grid" labelledBy="walls-devine-grid-title" className="wd-grid-shell" innerClassName="wd-grid-section">
        <header className="wd-grid-section__header">
          <h2 id="walls-devine-grid-title">Instagram 3 x 3 campaign map</h2>
          <p>
            The center tile anchors the narrative while the surrounding songs read like connected chapters when viewed as a full profile grid.
          </p>
        </header>

        <ol className="wd-grid" aria-label="Walls Devine release grid">
          {instagramGrid.map((tile) => (
            <li key={tile.title} className={["wd-grid__tile", tile.center ? "wd-grid__tile--center" : ""].filter(Boolean).join(" ")}>
              <figure className="wd-grid__figure">
                <div className="wd-grid__image-wrap">
                  <Image src={tile.image} alt={`${tile.title} cover artwork`} sizes="(max-width: 680px) 88vw, (max-width: 1040px) 45vw, 30vw" />
                </div>
                <figcaption>
                  <span>{tile.role}</span>
                  <strong>{tile.title}</strong>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell id="walls-devine-production" labelledBy="walls-devine-production-title" className="wd-production-shell" innerClassName="wd-production">
        <div className="wd-production__columns">
          <section className="wd-production__card" aria-labelledby="walls-devine-production-title">
            <h2 id="walls-devine-production-title">Final production specs</h2>
            <ul className="wd-production__specs">
              {releaseSpecs.map((spec) => (
                <li key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                  <p>{spec.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="wd-production__card" aria-label="Direction checkpoints">
            <h3>Direction checkpoints</h3>
            <ul className="wd-production__notes">
              {directionNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <div className="wd-production__actions">
              <Button as="a" href="/#music" variant="ghost">
                Go to Music section
              </Button>
              <Button as="a" href="/#contact" variant="secondary">
                Start rollout build
              </Button>
            </div>
          </section>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-post-kit" labelledBy="walls-devine-post-kit-title" className="wd-post-shell" innerClassName="wd-post">
        <div className="wd-post__header">
          <h2 id="walls-devine-post-kit-title">Shared post cards and release roadmap</h2>
          <p>
            Use one naming standard for DSP metadata and one campaign phrase for social so the rollout stays clear and repeatable.
          </p>
          <p>
            Joint Queen, Stash Daddy, and Space Cruiser now deep-link to their Bong Tour cue entries while each song card keeps lightweight making and
            technical notes tucked into expandable details.
          </p>
        </div>

        <div className="wd-post__identity" aria-label="Release naming">
          <article>
            <span>Spotify listing</span>
            <strong>{releaseIdentity.spotifyTitle}</strong>
            <p>{releaseIdentity.spotifyArtistLine}</p>
          </article>
          <article>
            <span>Marketing caption line</span>
            <strong>{releaseIdentity.marketingLine}</strong>
            <p>{releaseIdentity.marketingDate}</p>
          </article>
          <article>
            <span>Shared caption starter</span>
            <strong>{sharedCaptionStarter}</strong>
            <p>Use this line at the top of post copy, then add song-specific language below.</p>
          </article>
        </div>

        <p className="wd-post__guidance">{cadenceGuidance}</p>

        <ol className="wd-post__roadmap" aria-label="Release roadmap">
          {roadmapSteps.map((step) => (
            <li key={`${step.date}-${step.milestone}`}>
              <span>{step.date}</span>
              <h3>{step.milestone}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="wd-post__cards" role="list" aria-label="Song post card copy kit">
          {songPostCards.map((card) => (
            <article key={card.title} role="listitem" className="wd-post__card">
              <header>
                <span>{card.phase}</span>
                <h3>{card.title}</h3>
              </header>
              <p>{card.hook}</p>
              <p>{card.caption}</p>
              <p className="wd-post__visual">Visual thread: {card.visualThread}</p>

              <div className="wd-post__links" aria-label={`${card.title} references`}>
                <a href={`/walls-devine/journals/${card.journalSlug}.md`}>Read journal entry</a>

                {card.bongTourCueId ? <a href={`/bong-tour#${card.bongTourCueId}`}>View cue on Bong Tour</a> : null}
              </div>

              {card.bongTourCueId ? (
                <div className="wd-post__bong-link">
                  {card.bongTourContext ? <p>{card.bongTourContext}</p> : null}
                </div>
              ) : null}

              <details className="wd-post__detail">
                <summary>Making note</summary>
                <p>{card.makingNote}</p>
              </details>

              <details className="wd-post__detail">
                <summary>Technical note</summary>
                <p>{card.technicalNote}</p>
              </details>
            </article>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

export default WallsDevineLanding;