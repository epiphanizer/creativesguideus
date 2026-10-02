import Image from "next/image";
import Link from "next/link";

import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow } from "@/lib/launch-state";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

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

export default function HomePage() {
  return (
    <main className="cg-page cg-broadsheet-page" id="broadsheet-editorial">
      {/* 1. BROADSHEET MASTHEAD WITH SUBTLE INK ATMOSPHERE */}
      <header className="cg-masthead" aria-label="Publication masthead">
        <SubtleCalligraphyAtmosphere />

        <div className="cg-masthead__meta-bar">
          <div className="cg-masthead__meta-col">
            <span className="cg-meta-kicker">STUDIO &amp; RECORD LABEL</span>
            <span className="cg-meta-detail">Independent Practice · Est. 2026</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--center">
            <span className="cg-meta-kicker">EDITION NO. 01</span>
            <span className="cg-meta-detail">Autumn / Winter</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--right">
            <span className="cg-meta-kicker">DISCIPLINES</span>
            <span className="cg-meta-detail">Sound · Screen · Print</span>
          </div>
        </div>

        <div className="cg-masthead__statement">
          <p className="cg-masthead__super-kicker">CREATIVES GUIDE US</p>
          <h1 className="cg-masthead__headline">
            We cut raw records, write screenplays about bad ideas, and print physical things because digital files don&apos;t hold weight like real craft and ink.
          </h1>
          <p className="cg-masthead__lede">
            An independent studio and record label based in Salt Lake City, operating globally. No algorithmic playlists, no venture capital, and no pitch decks. Currently streaming Walls/Devine Volume 1 in the listening room.
          </p>
        </div>
      </header>

      {/* 2. COVER FEATURE: WALLS/DEVINE VOLUME 1 */}
      <section className="cg-cover-feature" aria-labelledby="cover-story-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge cg-badge--oxblood">COVER STORY</span>
            <span className="cg-rule-header__tag">WALLS/DEVINE — VOLUME 1</span>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">CATALOG #CGU-001 · AVAILABLE NOW</span>
          </div>
        </div>

        <div className="cg-cover-feature__layout">
          {/* Cover Artwork */}
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
                <span>Original sound production &amp; cover artwork by Creatives Guide Us</span>
              </figcaption>
            </figure>
          </div>

          {/* Narrative & Actions */}
          <div className="cg-cover-feature__content">
            <div className="cg-cover-feature__bylines">
              <span className="cg-byline-item">BY JOHN WALLS &amp; TERRY DEVINE</span>
              <span className="cg-byline-divider">/</span>
              <span className="cg-byline-item">RECORDED LIVE IN THE STUDIO</span>
            </div>

            <h2 id="cover-story-title" className="cg-cover-feature__title">
              <Link href="/walls-devine">
                Volume 1 in the Listening Room: Raw electric guitar, live grit, and Midwestern poetry.
              </Link>
            </h2>

            <p className="cg-cover-feature__prose">
              Tracked live with real instruments before anyone sober could talk us out of it. Volume 1 pairs fuzz bass and overdriven tube amplifiers with spoken Midwestern verse. Four songs about rust, patience, and questionable decisions—raw, unvarnished, and delivered with zero digital polite correction.
            </p>

            <blockquote className="cg-pullquote">
              <p>
                &ldquo;Joint Queen needed to feel like an entrance cue with authority and swagger, not just a groove loop.&rdquo;
              </p>
              <cite>— Terry Devine, Producer, Composer &amp; Tube Amp Apologist</cite>
            </blockquote>

            <div className="cg-cover-feature__actions">
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
      </section>

      {/* 3. EDITORIAL DISPATCHES (2 BALANCED COLUMNS) */}
      <section className="cg-dispatches" aria-labelledby="dispatches-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge">DISPATCHES</span>
            <h2 id="dispatches-title" className="cg-rule-header__heading">
              Works in Active Development
            </h2>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">SCREENPLAY · MONOGRAPH &amp; ARCHIVE</span>
          </div>
        </div>

        <div className="cg-dispatches__grid">
          {/* Dispatch 01: Bong Tour */}
          <article className="cg-dispatch-column cg-dispatch-column--bong" aria-label="Bong Tour Screenplay">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker cg-meta-kicker--tobacco">DISPATCH 01 · FEATURE SCREENPLAY</span>
              <span className="cg-dispatch-column__tag">IN DEVELOPMENT</span>
            </div>

            <figure className="cg-dispatch-column__media">
              <Link href="/bong-tour" className="cg-dispatch-column__poster-link" aria-label="View Bong Tour Screenplay Portal">
                <div className="cg-dispatch-column__poster-frame">
                  <Image
                    src={posterImage}
                    alt="Bong Tour concept film poster"
                    sizes="(max-width: 960px) 90vw, 45vw"
                    className="cg-dispatch-column__image"
                  />
                  <span className="cg-dispatch-column__poster-badge">Read Premise ↗</span>
                </div>
              </Link>
              <figcaption>Feature screenplay &amp; original score in active packaging</figcaption>
            </figure>

            <h3 className="cg-dispatch-column__title">
              <Link href="/bong-tour">Bong Tour: A Sun-Baked Masala Road Comedy</Link>
            </h3>

            <p className="cg-dispatch-column__copy">
              An indie band hauls a fragile, hand-blown six-foot glass rig across Route 66 in a van that overheats if you look at it wrong. Between Barstow radiator blowouts, neon-lit motel rooms, and questionable desert pitstops, it&apos;s a sun-baked comedy of stubborn survival.
            </p>

            <div className="cg-dispatch-column__action">
              <Link href="/bong-tour" className="cg-inline-link">
                Explore Screenplay Treatment →
              </Link>
            </div>
          </article>

          {/* Dispatch 02: Cache */}
          <article className="cg-dispatch-column cg-dispatch-column--cache" aria-label="Cache Monograph">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker">DISPATCH 02 · MONOGRAPH &amp; ARCHIVE</span>
              <span className="cg-dispatch-column__tag">SERIES 2027</span>
            </div>

            <figure className="cg-dispatch-column__media cg-dispatch-column__media--symbolic">
              <Link href="/cache" className="cg-dispatch-column__poster-link" aria-label="View Cache Monograph &amp; Archive">
                <div className="cg-symbolic-block cg-symbolic-block--cache">
                  <div className="cg-symbolic-block__mark">№ 003</div>
                  <div className="cg-symbolic-block__title">CACHE</div>
                  <div className="cg-symbolic-block__sub">Physical Monograph &amp; Companion Audio</div>
                </div>
              </Link>
              <figcaption>Limited hardbound volume with companion 7-inch lathe cut</figcaption>
            </figure>

            <h3 className="cg-dispatch-column__title">
              <Link href="/cache">Cache: Studio Notebooks, Raw Outtakes &amp; Typography</Link>
            </h3>

            <p className="cg-dispatch-column__copy">
              A hand-numbered archival volume of studio outtakes, spilled-coffee lyric sheets, blurry Polaroids, and woodcut test prints from the Volume 1 tracking sessions. Bound with a lathe-cut 7-inch record of Terry arguing with an amplifier between takes.
            </p>

            <div className="cg-dispatch-column__action">
              <Link href="/cache" className="cg-inline-link">
                Request Edition Notice →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 4. STUDIO PRACTICE & DIRECT INQUIRY */}
      <section className="cg-studio-practice" aria-labelledby="studio-practice-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge">STUDIO PRACTICE</span>
            <h2 id="studio-practice-title" className="cg-rule-header__heading">
              Creative Disciplines &amp; Commissions
            </h2>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">INDEPENDENT PRACTICE · EST. 2026</span>
          </div>
        </div>

        <div className="cg-colophon-unified">
          <div className="cg-disciplines-list">
            <div className="cg-discipline-item">
              <span className="cg-discipline-item__num">01</span>
              <div className="cg-discipline-item__body">
                <h3>Sound &amp; Records</h3>
                <p>Live tracking with real instruments, tube amps pushed into the red, and vinyl records pressed into heavy wax. We still believe physical sound beats streaming into an algorithmic void.</p>
              </div>
            </div>

            <div className="cg-discipline-item">
              <span className="cg-discipline-item__num">02</span>
              <div className="cg-discipline-item__body">
                <h3>Screenwriting &amp; Story</h3>
                <p>Feature scripts, road comedies, and dialogue written alongside the musical cues—preferably while drinking terrible diner coffee.</p>
              </div>
            </div>

            <div className="cg-discipline-item">
              <span className="cg-discipline-item__num">03</span>
              <div className="cg-discipline-item__body">
                <h3>Print &amp; Graphic Editions</h3>
                <p>Woodcut prints, custom letterforms, jacket design, and hand-bound monographs. If it doesn&apos;t give you paper cuts or smell like damp ink, we probably didn&apos;t print it.</p>
              </div>
            </div>
          </div>

          <div className="cg-colophon-unified__statement">
            <h3 className="cg-colophon-unified__headline">
              We treat the record, the movie, and the printed jacket as one single piece of work.
            </h3>
            <p className="cg-colophon-unified__prose">
              The studio takes on a handful of weird, ambitious collaborations each year across original sound production, film packaging, and editorial design. We work directly with directors, musicians, and independent publishers who care about physical craft. No endless email chains with committee feedback, guaranteed.
            </p>
            <div className="cg-colophon-unified__actions">
              <ContactModalLink href={homeConversationHref} buttonVariant="primary">
                Write to the Studio →
              </ContactModalLink>
              <a href="mailto:hello@creativesguide.us" className="cg-btn cg-btn--secondary">
                hello@creativesguide.us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
