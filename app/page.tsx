import Image from "next/image";
import Link from "next/link";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const gateways = [
  {
    eyebrow: "Collector experience",
    descriptor: "Collector room · player · journals · merch shop",
    title: "Walls/Devine",
    description: "Enter Volume 1 through the listening room, release journals, the private collector layer, and the merch route orbiting the record.",
    href: "/walls-devine",
    entryLabel: "Enter Volume 1",
    entryMeta: "Player · Journals · Collector Access · Merch Shop",
    image: volOneImage,
    alt: "Walls/Devine Volume 1 album cover artwork",
    tone: "walls",
    external: false
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
    tone: "bong",
    external: false
  },
  {
    eyebrow: "Gratitude economy portal",
    descriptor: "Tribute token · vault ledger · DAO charter",
    title: "Appreesh",
    description: "On-chain appreciation. Send tributes, raise the heat, and let the good vibes flow.",
    href: "https://appreesh.org",
    entryLabel: "Enter Appreesh",
    entryMeta: "Tribute · Heat · Vault · DAO",
    imageSrc: "/appreesh.png",
    alt: "Appreesh logo mark",
    tone: "appreesh",
    external: true
  }
] as const;

export default function HomePage() {
  return (
    <main className="cg-page cg-home-page" id="hero">
      <section className="cg-home-gate" aria-label="Featured project gateways">
        {gateways.map((gateway) => {
          const portalClassName = `cg-home-gate__portal cg-home-gate__portal--${gateway.tone}`;

          const portalContent = (
            <>
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
                <div className="cg-home-gate__portal-image-link" aria-hidden="true">
                  {"imageSrc" in gateway ? (
                    <Image
                      src={gateway.imageSrc}
                      alt={gateway.alt}
                      width={160}
                      height={160}
                      priority
                      className="cg-home-gate__portal-image"
                    />
                  ) : (
                    <Image
                      src={gateway.image}
                      alt={gateway.alt}
                      priority
                      sizes="(max-width: 959px) 86vw, 40vw"
                      className="cg-home-gate__portal-image"
                    />
                  )}
                </div>

                <p className="cg-home-gate__portal-stage-copy">{gateway.description}</p>

                <div className="cg-home-gate__portal-entry" aria-hidden="true">
                  <span className="cg-home-gate__portal-entry-label">{gateway.entryLabel}</span>
                  <small className="cg-home-gate__portal-entry-meta">
                    {gateway.entryMeta}
                    {gateway.title === "Walls/Devine" ? ` · Shop: ${new URL(wallsDevineMerchShopHref).host}` : ""}
                  </small>
                </div>
              </div>
            </>
          );

          if (gateway.external) {
            return (
              <a
                key={gateway.title}
                href={gateway.href}
                className={portalClassName}
                aria-label={gateway.entryLabel}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="home_gateway_click"
                data-analytics-param-source="home"
                data-analytics-param-gateway={gateway.title}
                data-analytics-param-destination={gateway.href}
                data-analytics-param-external="true"
              >
                {portalContent}
              </a>
            );
          }

          return (
            <Link
              key={gateway.title}
              href={gateway.href}
              className={portalClassName}
              aria-label={gateway.entryLabel}
              data-analytics-event="home_gateway_click"
              data-analytics-param-source="home"
              data-analytics-param-gateway={gateway.title}
              data-analytics-param-destination={gateway.href}
              data-analytics-param-external="false"
            >
              {portalContent}
            </Link>
          );
        })}
      </section>
    </main>
  );
}
