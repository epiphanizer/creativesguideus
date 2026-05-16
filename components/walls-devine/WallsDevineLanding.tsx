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
import { WallsDevinePlayer } from "@/components/walls-devine/WallsDevinePlayer";
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
  title: string;
  role: string;
  image: StaticImageData;
  center?: boolean;
};

const instagramGrid: GridTile[] = [
  { title: "Joint Queen", role: "Song 01", image: jointQueenImage },
  { title: "Stash Daddy", role: "Song 02", image: stashDaddyImage },
  { title: "Space Cruiser", role: "Song 03", image: spaceCruiserImage },
  { title: "Home", role: "Song 04", image: homeImage },
  { title: "Walls / Devine Vol. 1", role: "Collector's item", image: volOneImage, center: true },
  { title: "Decay", role: "Song 05", image: decayImage },
  { title: "Resolve", role: "Song 06", image: resolveImage },
  { title: "Poetry", role: "Song 07", image: poetryImage },
  { title: "Gratitude", role: "Song 08", image: gratitudeImage }
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
        <div className="wd-hero__marquee" aria-label="Experience mode">
          <span>Boutique unveiling</span>
          <span>Album object</span>
          <span>Companion score world</span>
        </div>

        <div className="wd-hero__layout">
          <div className="wd-hero__copy">
            <SectionHeader
              id="walls-devine-title"
              eyebrow="Album release world"
              title="Walls Devine Vol. 1"
              subtitle="A boutique landing experience for a split-world album object"
              description="Walls is the inward ritual. Devine is the public voltage. The page should feel like unveiling the artifact, the rollout system, and the companion score world in one motion."
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
          </div>

          <figure className="wd-hero__cover">
            <div className="wd-hero__cover-frame">
              <Image src={volOneImage} alt="Walls Devine Vol. 1 cover artwork" priority sizes="(max-width: 900px) 86vw, 38vw" />
            </div>
          </figure>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-grid" labelledBy="walls-devine-grid-title" className="wd-grid-shell" innerClassName="wd-grid-section">
        <header className="wd-grid-section__header">
          <h2 id="walls-devine-grid-title">The collector grid</h2>
          <p>
            The center tile anchors the narrative while the surrounding songs read like connected chapters when viewed as a full-profile wall installation.
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
            <h2 id="walls-devine-production-title">Edition specifications</h2>
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
          <h2 id="walls-devine-post-kit-title">Campaign copy system</h2>
          <p>
            Use one naming standard for DSP metadata and one campaign phrase for social so the rollout stays deliberate, elegant, and repeatable.
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

        <div className="wd-post__bridge">
          <div>
            <span>Companion pathway</span>
            <strong>The first three songs already open directly into Bong Tour cue posters.</strong>
            <p>
              Let Walls Devine feel like the premium object and Bong Tour feel like the adjacent chamber. The handoff should be elegant, visible, and
              never obtrusive.
            </p>
          </div>
          <Button as="a" href="/bong-tour#score-sketches" variant="secondary">
            Trace the soundtrack thread
          </Button>
        </div>

        <ol className="wd-post__roadmap" aria-label="Release roadmap">
          {roadmapSteps.map((step) => (
            <li key={`${step.date}-${step.milestone}`}>
              <span>{step.date}</span>
              <h3>{step.milestone}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>

        <WallsDevinePlayer tracks={songPostCards} />
      </SectionShell>
    </>
  );
}

export default WallsDevineLanding;