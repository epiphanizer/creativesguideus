import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { songPostCards } from "@/components/walls-devine/content";
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
  { title: "Walls/Devine Volume 1", role: "Collector's item", image: volOneImage, center: true },
  { title: "Decay", role: "Song 05", image: decayImage },
  { title: "Resolve", role: "Song 06", image: resolveImage },
  { title: "Poetry", role: "Song 07", image: poetryImage },
  { title: "Gratitude", role: "Song 08", image: gratitudeImage }
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
              title="Walls/Devine Volume 1"
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
              <Image src={volOneImage} alt="Walls/Devine Volume 1 cover artwork" priority sizes="(max-width: 900px) 86vw, 38vw" />
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

        <ol className="wd-grid" aria-label="Walls/Devine release grid">
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

      <SectionShell id="walls-devine-listening-room" labelledBy="wd-player-title" className="wd-post-shell" innerClassName="wd-post">
        <WallsDevinePlayer tracks={songPostCards} />
      </SectionShell>
    </>
  );
}

export default WallsDevineLanding;