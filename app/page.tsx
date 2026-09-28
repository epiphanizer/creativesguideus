import Image from "next/image";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow } from "@/lib/launch-state";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";
import workModule from "@/data/work/module.json";

const homeConversationHref = buildContactHref({ pathname: "/contact" });
const homeSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "walls-devine-mailing-list",
    inquiryType: "mailing-list",
    project: "Walls/Devine",
    surface: "campaign-world",
    sourceRoute: "/",
    campaignWindow: albumLaunchCampaignWindow
  }
});
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

const featuredWorkStudies = workModule.studies.slice(0, 6);

export default function HomePage() {
  return (
    <main className="cg-page cg-broadsheet-page" id="hero">
      {/* 1. BROADSHEET MASTHEAD & EDITION HEADER */}
      <header className="cg-masthead" aria-label="Publication masthead">
        <div className="cg-masthead__meta-bar">
          <div className="cg-masthead__meta-col">
            <span className="cg-meta-kicker">STUDIO &amp; RECORD LABEL</span>
            <span className="cg-meta-detail">Independent Practice · Est. 2026</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--center">
            <span className="cg-meta-kicker">EDITION NO. 01</span>
            <span className="cg-meta-detail">Autumn / Winter · Los Angeles &amp; Remote</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--right">
            <span className="cg-meta-kicker">DISCIPLINES</span>
            <span className="cg-meta-detail">Sound · Screen · Software</span>
          </div>
        </div>

        <div className="cg-masthead__statement">
          <p className="cg-masthead__super-kicker">CREATIVES GUIDE US</p>
          <h1 className="cg-masthead__headline">
            We produce records, develop screenplays, and engineer digital experiences for artists who refuse to blend in.
          </h1>
          <p className="cg-masthead__lede">
            An independent creative practice bridging analog recording studios, narrative packaging, and bespoke technology. Enter the listening room for Volume 1, explore the Bong Tour film portal, or review our selected client record below.
          </p>
        </div>
      </header>

      {/* 2. COVER STORY / LEAD FEATURE: WALLS/DEVINE VOLUME 1 */}
      <section className="cg-cover-feature" aria-labelledby="cover-story-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge cg-badge--oxblood">COVER STORY</span>
            <span className="cg-rule-header__tag">DEBUT ALBUM RELEASE</span>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">CATALOG #CGU-001 · AVAILABLE NOW</span>
          </div>
        </div>

        <div className="cg-cover-feature__layout">
          {/* Cover Artwork & Physical Details */}
          <div className="cg-cover-feature__visual">
            <figure className="cg-cover-feature__figure">
              <Link
                href="/walls-devine"
                className="cg-cover-feature__artwork-link"
                aria-label="Enter Walls/Devine Volume 1 experience"
              >
                <div className="cg-cover-feature__artwork-frame">
                  <Image
                    src={volOneImage}
                    alt="Walls/Devine Volume 1 album cover artwork"
                    priority
                    sizes="(max-width: 960px) 92vw, 44vw"
                    className="cg-cover-feature__image"
                  />
                  <span className="cg-cover-feature__artwork-overlay">Open Listening Room ↗</span>
                </div>
              </Link>
              <figcaption className="cg-cover-feature__caption">
                <strong>Walls/Devine — Volume 1</strong>
                <span>Art direction, woodcut engraving &amp; production by Creatives Guide Us</span>
              </figcaption>
            </figure>
          </div>

          {/* Narrative & Catalog Placard */}
          <div className="cg-cover-feature__content">
            <div className="cg-cover-feature__bylines">
              <span className="cg-byline-item">BY JOHN WALLS &amp; TERRY DEVINE</span>
              <span className="cg-byline-divider">/</span>
              <span className="cg-byline-item">RECORDED ON 2-INCH TAPE</span>
            </div>

            <h2 id="cover-story-title" className="cg-cover-feature__title">
              <Link href="/walls-devine">
                Volume 1 in the Listening Room: Raw electric guitar, tape decay, and Midwestern poetry.
              </Link>
            </h2>

            <p className="cg-cover-feature__prose">
              Recorded between midnight sessions and reel-to-reel tape decks, Volume 1 is the flagship sound release from Creatives Guide Us. An unapologetic convergence of vintage tube overdrive, intimate spoken word, and cinematic arrangements built to reward repeated listening.
            </p>

            <blockquote className="cg-pullquote">
              <p>
                &ldquo;Joint Queen needed to feel like an entrance cue with authority and swagger, not just a groove loop.&rdquo;
              </p>
              <cite>— Terry Devine, Producer &amp; Composer</cite>
            </blockquote>

            {/* Pitchfork-Style Catalog Placard */}
            <div className="cg-catalog-placard" aria-label="Album specifications and listening actions">
              <div className="cg-catalog-placard__top">
                <div className="cg-catalog-placard__identity">
                  <span className="cg-catalog-placard__code">CATALOG #CGU-001</span>
                  <span className="cg-catalog-placard__type">12&quot; VINYL / MASTER DIGITAL</span>
                </div>
                <span className="cg-catalog-placard__status">AVAILABLE NOW</span>
              </div>

              <dl className="cg-catalog-placard__details">
                <div className="cg-catalog-placard__entry">
                  <dt>Artists</dt>
                  <dd>John Walls &amp; Terry Devine</dd>
                </div>
                <div className="cg-catalog-placard__entry">
                  <dt>Tracklist</dt>
                  <dd>Joint Queen · Poetry · Conviction · Decay</dd>
                </div>
                <div className="cg-catalog-placard__entry">
                  <dt>Production</dt>
                  <dd>Analog tracking, valve saturation, woodcut print art</dd>
                </div>
                <div className="cg-catalog-placard__entry">
                  <dt>Listening Room</dt>
                  <dd>Full stream + synchronized journal commentary</dd>
                </div>
              </dl>

              <div className="cg-catalog-placard__actions">
                <Link
                  href="/walls-devine"
                  className="cg-btn cg-btn--primary"
                  data-analytics-event="home_gateway_click"
                  data-analytics-param-source="home_broadsheet"
                  data-analytics-param-gateway="Walls/Devine"
                  data-analytics-param-destination="/walls-devine"
                  data-analytics-param-external="false"
                >
                  Enter Listening Room →
                </Link>
                <a
                  href={wallsDevineMerchShopHref}
                  target="_blank"
                  rel="noreferrer"
                  className="cg-btn cg-btn--secondary"
                >
                  Order Vinyl &amp; Merch ↗
                </a>
                <ContactModalLink href={homeSignalListHref} buttonVariant="ghost">
                  Join the Signal List
                </ContactModalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL DISPATCHES (3 COLUMNS WITH 1PX COLUMN RULES) */}
      <section className="cg-dispatches" aria-labelledby="dispatches-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge">DISPATCHES</span>
            <h2 id="dispatches-title" className="cg-rule-header__heading">
              Worlds in Active Development
            </h2>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">SCREENPLAY · PROTOCOL · MONOGRAPH</span>
          </div>
        </div>

        <div className="cg-dispatches__grid">
          {/* Dispatch 01: Bong Tour */}
          <article className="cg-dispatch-column cg-dispatch-column--bong" aria-label="Bong Tour Screenplay">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker cg-meta-kicker--tobacco">DISPATCH 01 · SCREENPLAY</span>
              <span className="cg-dispatch-column__tag">IN DEVELOPMENT</span>
            </div>

            <figure className="cg-dispatch-column__media">
              <Link href="/bong-tour" className="cg-dispatch-column__poster-link" aria-label="View Bong Tour Screenplay Portal">
                <div className="cg-dispatch-column__poster-frame">
                  <Image
                    src={posterImage}
                    alt="Bong Tour concept film poster"
                    sizes="(max-width: 960px) 90vw, 30vw"
                    className="cg-dispatch-column__image"
                  />
                  <span className="cg-dispatch-column__poster-badge">Preview World ↗</span>
                </div>
              </Link>
              <figcaption>Masala-genre comedy feature · Packaging &amp; cues staged</figcaption>
            </figure>

            <h3 className="cg-dispatch-column__title">
              <Link href="/bong-tour">Bong Tour: A Sun-Baked Masala Road Comedy</Link>
            </h3>

            <p className="cg-dispatch-column__copy">
              When an eccentric indie band takes their custom glass rig across the Southwestern desert, their tour unravels into a chaotic psychedelic odyssey through highway motels, rival sound crews, and midnight revelations.
            </p>

            <div className="cg-dispatch-column__specs">
              <div className="cg-dispatch-column__spec-row">
                <span>Format:</span>
                <strong>Feature Screenplay</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Sound World:</span>
                <strong>CGU Sound Lab Score</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Director&apos;s Treatment:</span>
                <strong>Staged for Partners</strong>
              </div>
            </div>

            <div className="cg-dispatch-column__action">
              <Link href="/bong-tour" className="cg-inline-link">
                Explore Screenplay Portal →
              </Link>
            </div>
          </article>

          {/* Dispatch 02: Appreesh */}
          <article className="cg-dispatch-column cg-dispatch-column--appreesh" aria-label="Appreesh Protocol">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker">DISPATCH 02 · SOFTWARE PROTOCOL</span>
              <span className="cg-dispatch-column__tag">OPENING SEPT 11</span>
            </div>

            <div className="cg-dispatch-column__media cg-dispatch-column__media--symbolic">
              <div className="cg-symbolic-block cg-symbolic-block--appreesh">
                <div className="cg-symbolic-block__mark">⌘</div>
                <div className="cg-symbolic-block__title">APPREESH</div>
                <div className="cg-symbolic-block__sub">Peer-to-Peer Artist Tribute Protocol</div>
              </div>
              <figcaption>On-chain gratitude workspace · Solana / Anchor architecture</figcaption>
            </div>

            <h3 className="cg-dispatch-column__title">
              <Link href={homeAppreeshPreviewHref} scroll={false}>
                Direct Artist Patronage Without Platform Tolls
              </Link>
            </h3>

            <p className="cg-dispatch-column__copy">
              An experimental, ritual-first appreciation protocol engineered to route tributes and financial backing directly to creators. Built on high-speed Solana/Anchor infrastructure with zero corporate intermediaries.
            </p>

            <div className="cg-dispatch-column__specs">
              <div className="cg-dispatch-column__spec-row">
                <span>Runtime:</span>
                <strong>Solana / Anchor</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Interface:</span>
                <strong>Next.js + Web3 Ledger</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Release Status:</span>
                <strong>Pilot-Grade Prototype</strong>
              </div>
            </div>

            <div className="cg-dispatch-column__action">
              <Link href={homeAppreeshPreviewHref} scroll={false} className="cg-inline-link">
                Preview Protocol Blueprint →
              </Link>
            </div>
          </article>

          {/* Dispatch 03: Cache */}
          <article className="cg-dispatch-column cg-dispatch-column--cache" aria-label="Cache Monograph">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker">DISPATCH 03 · MONOGRAPH &amp; ARCHIVE</span>
              <span className="cg-dispatch-column__tag">SERIES 2027</span>
            </div>

            <div className="cg-dispatch-column__media cg-dispatch-column__media--symbolic">
              <div className="cg-symbolic-block cg-symbolic-block--cache">
                <div className="cg-symbolic-block__mark">№ 003</div>
                <div className="cg-symbolic-block__title">CACHE</div>
                <div className="cg-symbolic-block__sub">Physical Monograph &amp; Audio Tape</div>
              </div>
              <figcaption>Curated studio ephemera · Unreleased takes &amp; type tests</figcaption>
            </div>

            <h3 className="cg-dispatch-column__title">
              <Link href="/cache">Cache: Unreleased Sessions, Typography &amp; Ephemera</Link>
            </h3>

            <p className="cg-dispatch-column__copy">
              An upcoming limited-run print monograph and audio archive documenting unreleased tracking takes, typographic proofs, production polaroids, and physical ephemera from the studio floor.
            </p>

            <div className="cg-dispatch-column__specs">
              <div className="cg-dispatch-column__spec-row">
                <span>Edition:</span>
                <strong>Limited Print Monograph</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Curators:</span>
                <strong>Sean Halls &amp; Studio Team</strong>
              </div>
              <div className="cg-dispatch-column__spec-row">
                <span>Archive Status:</span>
                <strong>Assembly in Progress</strong>
              </div>
            </div>

            <div className="cg-dispatch-column__action">
              <Link href="/cache" className="cg-inline-link">
                Request Archival Notice →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 4. STUDIO PRACTICE & SELECTED CLIENT WORK */}
      <section className="cg-studio-practice" aria-labelledby="studio-practice-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge">STUDIO PRACTICE</span>
            <h2 id="studio-practice-title" className="cg-rule-header__heading">
              Disciplines &amp; Selected Client Record
            </h2>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">COMMISSIONS &amp; PARTNERSHIPS</span>
          </div>
        </div>

        {/* Studio Disciplines */}
        <div className="cg-disciplines-row">
          <div className="cg-discipline-block">
            <span className="cg-discipline-block__number">01</span>
            <h3 className="cg-discipline-block__title">Record Production &amp; Sound</h3>
            <p className="cg-discipline-block__prose">
              From analog tape tracking to spatial audio mixing and original score composition. We direct the acoustic and aesthetic identity that makes music resonant.
            </p>
          </div>

          <div className="cg-discipline-block">
            <span className="cg-discipline-block__number">02</span>
            <h3 className="cg-discipline-block__title">Screenwriting &amp; Narrative</h3>
            <p className="cg-discipline-block__prose">
              Feature treatments, character bibles, screenplay packaging, and creative consulting crafted for discerning production companies and cultural brands.
            </p>
          </div>

          <div className="cg-discipline-block">
            <span className="cg-discipline-block__number">03</span>
            <h3 className="cg-discipline-block__title">Creative Engineering &amp; Identity</h3>
            <p className="cg-discipline-block__prose">
              Bespoke typography, award-worthy web flagships, and high-performance digital systems engineered to outlast corporate design cycles.
            </p>
          </div>
        </div>

        {/* Selected Client Record Table */}
        <div className="cg-client-table" aria-label="Selected client project list">
          <div className="cg-client-table__head">
            <span className="cg-client-table__col-name">Selected Project</span>
            <span className="cg-client-table__col-discipline">Discipline</span>
            <span className="cg-client-table__col-proof">Verified Proof</span>
            <span className="cg-client-table__col-link">Outbound</span>
          </div>

          <div className="cg-client-table__body">
            {featuredWorkStudies.map((study, idx) => (
              <div key={study.slug} className="cg-client-table__row">
                <div className="cg-client-table__col-name">
                  <span className="cg-client-table__index">0{idx + 1}</span>
                  <strong>{study.title}</strong>
                </div>
                <div className="cg-client-table__col-discipline">{study.eyebrow}</div>
                <div className="cg-client-table__col-proof">
                  {study.proof.join(" · ")}
                </div>
                <div className="cg-client-table__col-link">
                  {study.siteHref ? (
                    <a
                      href={study.siteHref}
                      target="_blank"
                      rel="noreferrer"
                      className="cg-client-table__outbound"
                      aria-label={`Visit ${study.title}`}
                    >
                      Visit ↗
                    </a>
                  ) : (
                    <span className="cg-client-table__badge">Studio Case</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STUDIO COLOPHON & DIRECT INQUIRY */}
      <section className="cg-colophon" aria-labelledby="colophon-title">
        <div className="cg-colophon__inner">
          <div className="cg-colophon__copy">
            <span className="cg-meta-kicker">COLOPHON &amp; PARTNERSHIPS</span>
            <h2 id="colophon-title" className="cg-colophon__title">
              Independent culture thrives when sound, script, and graphic design are treated as one continuous discipline.
            </h2>
            <p className="cg-colophon__prose">
              Whether you are licensing a soundtrack cue, commissioning a web flagship, or developing a narrative property, we invite direct conversations. We take on a limited number of partner commissions each season.
            </p>
          </div>

          <div className="cg-colophon__actions">
            <ContactModalLink href={homeConversationHref} buttonVariant="primary">
              Start a Conversation →
            </ContactModalLink>
            <a href="mailto:hello@creativesguide.us" className="cg-btn cg-btn--secondary">
              hello@creativesguide.us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
