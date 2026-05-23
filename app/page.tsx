import Image from "next/image";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const homeConversationHref = buildContactHref({});

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
     external: false,
     launchLabel: null,
     launchDate: null,
     launchNote: null
  },
  {
    eyebrow: "Screenplay portal",
    descriptor: "Blackout preview · June 30 · cue rooms",
    title: "Bong Tour",
    description: "The portal is previewable now, but the official opening lands June 30. Poster world, private reading path, and cue rooms stay visible without pretending the launch is already here.",
    href: "/bong-tour",
    entryLabel: "Preview Bong Tour",
    entryMeta: "Coming Soon · June 30 · Clickable preview",
    image: posterImage,
    alt: "Bong Tour poster artwork",
    tone: "bong",
    external: false,
    launchLabel: "Coming Soon",
    launchDate: "June 30",
    launchNote: "Clickable preview"
  },
  {
    eyebrow: "Cryptographic layer",
    descriptor: "Blackout preview · June 30 · future airdrops",
    title: "Appreesh",
    description: "CGU keeps the live reward path first. Appreesh stays wired as the future cryptographic layer, with the public blackout preview opening wider on June 30.",
    href: "https://appreesh.org",
    entryLabel: "Preview Appreesh",
    entryMeta: "Coming Soon · June 30 · CGU reward bridge",
    tone: "appreesh",
    external: true,
    launchLabel: "Coming Soon",
    launchDate: "June 30",
    launchNote: "Clickable preview"
  }
] as const;

export default function HomePage() {
  return (
    <main className="cg-page cg-home-page" id="hero">
      <section className="cg-home-gate" aria-label="Featured project gateways">
        {gateways.map((gateway) => {
          const portalClassName = `cg-home-gate__portal cg-home-gate__portal--${gateway.tone}${gateway.launchLabel ? " cg-home-gate__portal--prelaunch" : ""}`;
          const hasVisualImage = "image" in gateway;

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
                    {"image" in gateway ? (
                      <Image
                        src={gateway.image}
                        alt={gateway.alt}
                        priority
                        sizes="(max-width: 959px) 86vw, 40vw"
                        className="cg-home-gate__portal-image"
                      />
                    ) : (
                      <div className="cg-home-gate__portal-placeholder" />
                    )}

                    {gateway.launchLabel ? (
                      <div className="cg-home-gate__portal-launch-mask">
                        <span className="cg-home-gate__portal-launch-label">{gateway.launchLabel}</span>
                        <strong className="cg-home-gate__portal-launch-date">{gateway.launchDate}</strong>
                        <small className="cg-home-gate__portal-launch-note">{gateway.launchNote}</small>
                      </div>
                    ) : null}
                  </div>
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

      <section className="cg-home-dispatch" aria-labelledby="cg-home-dispatch-title">
        <div className="cg-home-dispatch__copy">
          <p className="cg-home-dispatch__eyebrow">Creatives Guide Us</p>
          <h1 id="cg-home-dispatch-title">Active project worlds first. The studio lane sits below.</h1>
          <p>Use this section for direct contact and the broader CGU frame behind Walls/Devine, Bong Tour, and Appreesh.</p>
        </div>

        <nav className="cg-home-dispatch__actions" aria-label="Studio routes">
          <ContactModalLink href={homeConversationHref}>Start a Conversation</ContactModalLink>
        </nav>
      </section>
    </main>
  );
}
