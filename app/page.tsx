import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, cguLaunchState } from "@/lib/launch-state";
import { seanhallsWorkHref } from "@/lib/studio-links";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const homeConversationHref = buildContactHref({ pathname: "/contact" });
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
    descriptor: `${cguLaunchState.wallsDevine.label} · collector grid · listening room · merch shop`,
    title: "Walls/Devine",
    description: `Volume 1 opens ${cguLaunchState.wallsDevine.launchDate}: preview the collector grid, listening-room framing, and release-world objects before the full handoff.`,
    href: "/walls-devine",
    entryLabel: `Walls/Devine opens ${cguLaunchState.wallsDevine.launchDate}`,
    entryMeta: `${cguLaunchState.wallsDevine.label} · Release-world preview`,
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
    description: `The gratitude layer stays inside CGU until ${cguLaunchState.appreesh.launchDate}, then opens its own lane with no early external handoff.`,
    href: homeAppreeshPreviewHref,
    entryLabel: `Appreesh opens ${cguLaunchState.appreesh.launchDate}`,
    entryMeta: `${cguLaunchState.appreesh.label} · Preview route remains internal`,
    tone: "appreesh",
    external: false,
    isGated: true
  },
  {
    eyebrow: "Screenplay portal",
    descriptor: cguLaunchState.bongTour.label,
    title: "Bong Tour",
    description: `Poster route, premise, and treatment gate stay staged until ${cguLaunchState.bongTour.launchDate}, when the deeper film path opens.`,
    href: "/bong-tour",
    entryLabel: `Bong Tour opens ${cguLaunchState.bongTour.launchDate}`,
    entryMeta: `${cguLaunchState.bongTour.label} · Preview route stays staged`,
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
    description: `The series stays dark through the rest of 2026 while groundwork continues toward its ${cguLaunchState.cache.launchDate} opening.`,
    href: "/cache",
    entryLabel: `Cache opens ${cguLaunchState.cache.launchDate}`,
    entryMeta: `${cguLaunchState.cache.label} · Public details stay staged`,
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
                  <small className="cg-home-gate__portal-entry-meta">
                    {gateway.entryMeta}
                    {gateway.title === "Walls/Devine" ? ` · Shop: ${new URL(wallsDevineMerchShopHref).host}` : ""}
                  </small>
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

      <section className="cg-home-dispatch" aria-label="Studio routes">

        <ol className="cg-home-dispatch__route-list" aria-label="Launch sequence routes">
          <li>
            <Link href="/walls-devine" className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">01</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Walls/Devine Volume 1</strong>
                <small>Opening September 1</small>
              </span>
            </Link>
          </li>
          <li>
            <a href={wallsDevineMerchShopHref} target="_blank" rel="noreferrer" className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">02</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Shop Volume 1 Merch</strong>
                <small>Fourthwall store</small>
              </span>
            </a>
          </li>
          <li>
            <Link href={homeAppreeshPreviewHref} scroll={false} className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">03</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Appreesh</strong>
                <small>Opening September 11</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/bong-tour" className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">04</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Bong Tour</strong>
                <small>Opening November 4</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cache" className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">05</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Cache</strong>
                <small>Opening 2027</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact" className="cg-home-dispatch__route-link">
              <span className="cg-home-dispatch__route-index">06</span>
              <span className="cg-home-dispatch__route-copy">
                <strong>Contact the Studio</strong>
                <small>Calm route beneath the active worlds</small>
              </span>
            </Link>
          </li>
        </ol>

        <nav className="cg-home-dispatch__actions" aria-label="Studio routes">
          <ContactModalLink href={homeConversationHref} buttonVariant="ghost">Start a Conversation</ContactModalLink>
          <a href={seanhallsWorkHref} target="_blank" rel="noreferrer">Selected Work</a>
        </nav>
      </section>
    </main>
  );
}
