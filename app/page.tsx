import Image from "next/image";
import Link from "next/link";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

const gateways = [
  {
    eyebrow: "Album release",
    meta: "Listening room, journals, collector access",
    title: "Walls/Devine",
    description: "Enter Volume 1 through the player, the journals, and the private collector layer around the release.",
    href: "/walls-devine",
    cta: "Enter Walls/Devine",
    image: volOneImage,
    alt: "Walls/Devine Volume 1 album cover artwork",
    tone: "walls"
  },
  {
    eyebrow: "Feature rollout",
    meta: "Poster world, screenplay, cue deck",
    title: "Bong Tour",
    description: "Step into the screenplay portal, cue posters, and the film world orbiting the record and score.",
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
              <span className="cg-home-gate__portal-eyebrow">{gateway.eyebrow}</span>
              <span className="cg-home-gate__portal-kicker">{gateway.meta}</span>
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
