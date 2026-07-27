import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, cguLaunchState } from "@/lib/launch-state";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

const homeAppreeshPreviewHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "appreesh-preview",
    inquiryType: "mailing-list",
    project: "Appreesh",
    surface: "product-app",
    sourceRoute: "/",
    campaignWindow: albumLaunchCampaignWindow
  }
});

type HomeGateway = {
  eyebrow: string;
  descriptor: string;
  title: string;
  description: string;
  href: string;
  entryLabel: string;
  entryMeta: string;
  tone: "walls" | "bong" | "appreesh" | "cache";
  external: boolean;
  isGated: boolean;
  image?: StaticImageData;
  alt?: string;
};

const gateways: readonly HomeGateway[] = [
  {
    eyebrow: "Release world preview",
    descriptor: `${cguLaunchState.wallsDevine.label} · listening room · journals · merch`,
    title: "Walls/Devine",
    description: `Volume 1 opens ${cguLaunchState.wallsDevine.launchDate}. Step into the music, the imagery, and the first objects from the record.`,
    href: "/walls-devine",
    entryLabel: `Walls/Devine opens ${cguLaunchState.wallsDevine.launchDate}`,
    entryMeta: `${cguLaunchState.wallsDevine.label} · Music, journals, merch`,
    image: volOneImage,
    alt: "Walls/Devine Volume 1 album cover artwork",
    tone: "walls",
    external: false,
    isGated: false
  },
  {
    eyebrow: "Cryptographic layer",
    descriptor: cguLaunchState.appreesh.label,
    title: "Appreesh",
    description: `Appreesh opens ${cguLaunchState.appreesh.launchDate}. Join the list for first access to its gratitude-driven experience.`,
    href: homeAppreeshPreviewHref,
    entryLabel: `Appreesh opens ${cguLaunchState.appreesh.launchDate}`,
    entryMeta: `${cguLaunchState.appreesh.label} · Early notice available`,
    tone: "appreesh",
    external: false,
    isGated: true
  },
  {
    eyebrow: "Screenplay portal",
    descriptor: cguLaunchState.bongTour.label,
    title: "Bong Tour",
    description: `A cult-comedy feature and score world opening ${cguLaunchState.bongTour.launchDate}. Start with the poster, the premise, and the first signal.`,
    href: "/bong-tour",
    entryLabel: `Bong Tour opens ${cguLaunchState.bongTour.launchDate}`,
    entryMeta: `${cguLaunchState.bongTour.label} · Film preview`,
    image: posterImage,
    alt: "Bong Tour poster artwork",
    tone: "bong",
    external: false,
    isGated: true
  },
  {
    eyebrow: "New series",
    descriptor: cguLaunchState.cache.label,
    title: "Cache",
    description: `A new CGU series arriving in ${cguLaunchState.cache.launchDate}. Ask for early access before the full reveal.`,
    href: "/cache",
    entryLabel: `Cache opens ${cguLaunchState.cache.launchDate}`,
    entryMeta: `${cguLaunchState.cache.label} · Early access`,
    tone: "cache",
    external: false,
    isGated: true
  }
];

export default function HomePage() {
  return (
    <main className="cg-page cg-home-page" id="hero">
      <section className="cg-home-gate" aria-label="Featured project gateways">
        {gateways.map((gateway) => {
          const portalClassName = `cg-home-gate__portal cg-home-gate__portal--${gateway.tone}`;
          const hasVisualImage = Boolean(gateway.image);
          const isGated = gateway.isGated;

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
                  <div className={`cg-home-gate__portal-visual${hasVisualImage ? "" : " cg-home-gate__portal-visual--placeholder"}`}>
                    {gateway.image ? (
                      <Image
                        src={gateway.image}
                        alt={gateway.alt ?? gateway.title}
                        priority
                        sizes="(max-width: 959px) 86vw, 40vw"
                        className="cg-home-gate__portal-image"
                      />
                    ) : (
                      <div className="cg-home-gate__portal-placeholder" />
                    )}
                  </div>
                </div>
              </div>

              <p className="cg-home-gate__portal-stage-copy">{gateway.description}</p>

              <div className="cg-home-gate__portal-entry" aria-hidden="true">
                <span className="cg-home-gate__portal-entry-label">{gateway.entryLabel}</span>
                {gateway.entryMeta ? (
                  <small className="cg-home-gate__portal-entry-meta">{gateway.entryMeta}</small>
                ) : null}
              </div>

            </>
          );

          if (isGated) {
            return (
              <article
                key={gateway.title}
                className={portalClassName}
                aria-label={gateway.entryLabel}
              >
                {portalContent}
              </article>
            );
          }

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
