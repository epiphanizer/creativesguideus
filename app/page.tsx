import Image from "next/image";
import Link from "next/link";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

const gateways = [
  {
    eyebrow: "Collector experience",
    descriptor: "Collector room · player · journals",
    title: "Walls/Devine",
    description: "Enter Volume 1 through the listening room, release journals, and the private collector layer around the record.",
    href: "/walls-devine",
    entryLabel: "Enter Volume 1",
    entryMeta: "Player · Journals · Collector Access",
    image: volOneImage,
    alt: "Walls/Devine Volume 1 album cover artwork",
    tone: "walls"
  },
  {
    eyebrow: "Screenplay portal",
    descriptor: "Poster world · cue deck · screenplay",
    title: "Bong Tour",
    description: "Step into the poster world, screenplay portal, and cue deck orbiting the record and score.",
    href: "/bong-tour",
    entryLabel: "Enter Bong Tour",
    entryMeta: "Poster World · Screenplay · Cue Deck",
    image: posterImage,
    alt: "Bong Tour poster artwork",
    tone: "bong"
  }
] as const;

export default function HomePage() {
  return (
    <main className="cg-page cg-home-page" id="hero">
      <section className="cg-home-gate" aria-label="Featured project gateways">
        {gateways.map((gateway) => (
          <article key={gateway.title} className={`cg-home-gate__portal cg-home-gate__portal--${gateway.tone}`}>
            <div className="cg-home-gate__portal-head">
              <div className="cg-home-gate__portal-meta">
                <span className="cg-home-gate__portal-eyebrow">{gateway.eyebrow}</span>
                <span className="cg-home-gate__portal-descriptor">{gateway.descriptor}</span>
              </div>

              <div className="cg-home-gate__portal-copy">
                <h2>{gateway.title}</h2>
              </div>
            </div>

            <div className="cg-home-gate__portal-stage">
              <Link href={gateway.href} className="cg-home-gate__portal-image-link" aria-label={gateway.entryLabel}>
                <Image
                  src={gateway.image}
                  alt={gateway.alt}
                  priority
                  sizes="(max-width: 959px) 86vw, 40vw"
                  className="cg-home-gate__portal-image"
                />
              </Link>

              <p className="cg-home-gate__portal-stage-copy">{gateway.description}</p>

              <Link href={gateway.href} className="cg-home-gate__portal-entry">
                <span className="cg-home-gate__portal-entry-label">{gateway.entryLabel}</span>
                <small className="cg-home-gate__portal-entry-meta">{gateway.entryMeta}</small>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
