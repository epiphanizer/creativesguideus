import Image from "next/image";
import Link from "next/link";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

const gateways = [
  {
    eyebrow: "Album object",
    meta: "Listening room + journals",
    title: "Walls / Devine",
    description: "Volume 1, the modular player, and the score bridges into Bong Tour.",
    href: "/walls-devine",
    cta: "Open Volume 1",
    image: volOneImage,
    alt: "Walls Devine Volume 1 album cover artwork",
    tone: "walls"
  },
  {
    eyebrow: "Feature deck",
    meta: "Poster world + score sketches",
    title: "Bong Tour",
    description: "The screenplay portal, cue posters, and the adjacent chamber for the record.",
    href: "/bong-tour",
    cta: "Enter Bong Tour",
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
          <Link key={gateway.title} href={gateway.href} className={`cg-home-gate__portal cg-home-gate__portal--${gateway.tone}`}>
            <div className="cg-home-gate__portal-meta">
              <span>{gateway.eyebrow}</span>
              <span>{gateway.meta}</span>
            </div>

            <div className="cg-home-gate__portal-copy">
              <h2>{gateway.title}</h2>
              <p>{gateway.description}</p>
            </div>

            <div className="cg-home-gate__portal-art">
              <Image
                src={gateway.image}
                alt={gateway.alt}
                priority
                sizes="(max-width: 959px) 82vw, 40vw"
                className="cg-home-gate__portal-image"
              />
            </div>

            <span className="cg-home-gate__portal-cta">{gateway.cta}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
