"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";
import { MELODYNE_AFFILIATE } from "@/lib/affiliates";
import AnalogPatchLeadCapture from "@/components/home/AnalogPatchLeadCapture";

const homeConversationHref = buildContactHref({ pathname: "/contact" });

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnwinding, setIsUnwinding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cgu_broadsheet_unlocked");
      if (saved === "true") {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlock = useCallback((unlocked: boolean, triggerAnimation = true) => {
    setIsUnlocked(unlocked);
    if (unlocked) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cgu_broadsheet_unlocked", "true");
      }
      if (triggerAnimation) {
        setIsUnwinding(true);
        // Smoothly scroll down after initial fold reveals
        setTimeout(() => {
          const broadsheet = document.getElementById("broadsheet-editorial");
          if (broadsheet) {
            broadsheet.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 550);
        // Clear unwinding class after cascade finishes
        setTimeout(() => {
          setIsUnwinding(false);
        }, 2600);
      }
    }
  }, []);

  const handleResetLock = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cgu_broadsheet_unlocked");
    }
    setIsUnlocked(false);
    setIsUnwinding(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <AnalogPatchLeadCapture
        isUnlocked={isUnlocked}
        onUnlock={handleUnlock}
        onResetLock={handleResetLock}
      />
      {isUnlocked ? (
        <main
          className={`cg-page cg-broadsheet-page ${isUnwinding ? "cg-broadsheet-page--unwinding" : ""}`}
          id="broadsheet-editorial"
        >
          {/* Press crease indicator during unwind */}
          <div className="cg-broadsheet-press-crease" aria-hidden="true">
            <span className="cg-crease-rule" />
            <span className="cg-crease-label">EDITION 01 UNWOUND · HOT OFF THE PRESS // INDEPENDENT STUDIO BROADSHEET</span>
            <span className="cg-crease-rule" />
          </div>
      {/* 1. BROADSHEET MASTHEAD */}
      <header className="cg-masthead" aria-label="Publication masthead">
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
            We play real guitars, chop breaks, write screenplays about bad ideas, and edit everything painstakingly ourselves.
          </h1>
          <p className="cg-masthead__lede">
            An independent studio and record label based in Salt Lake City, operating globally. Real guitars plugged into loud tube amps, Ableton sessions, SP-404 chops, and unapologetic, obsessive Celemony Melodyne vocal tuning. Currently streaming Walls/Devine Volume 1 in the listening room.
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
              Tracked live in the studio with real guitars, overdriven tube amps, Mint-Green P-Bass, and SP-404 chops dialed in Ableton. We edit every take, bar, and transition painstakingly ourselves—and to be completely honest, we are avid, unrepentant Celemony Melodyne fans who hand-sculpt vocal pitch and formants note-by-note until they shimmer. Volume 1 pairs heavy bass grooves and raw amplifiers with spoken Midwestern verse. Four songs about rust, patience, and questionable decisions.
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
            </div>
          </div>
        </div>
      </section>

      {/* 3. STUDIO PROFIT CENTER: AVID MELODYNE FANS */}
      <section className="cg-profit-center-feature" aria-labelledby="profit-center-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge cg-badge--gold">PROFIT CENTER</span>
            <span className="cg-rule-header__tag">CELEMONY MELODYNE AFFILIATE DESK</span>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">AVID FANS SINCE 2009 · HAND-SCULPTED VOCAL PITCH</span>
          </div>
        </div>

        <div className="cg-profit-center-box">
          <div className="cg-profit-center-content">
            <span className="cg-meta-kicker cg-meta-kicker--gold">OFFICIAL STUDIO MONETIZATION DESK</span>
            <h2 id="profit-center-title" className="cg-profit-center-title">
              Full disclosure: We don&apos;t hate vocal tuning. We are avid, obsessive Celemony Melodyne fans.
            </h2>
            <p className="cg-profit-center-prose">
              While we track our rhythm section live through screaming tube amplifiers, when it comes to vocals, we are proud, obsessive Celemony Melodyne power users. We spend hours inside Melodyne manually sculpting vocal formants, vibrato tails, and micro-pitches note-by-note until every lyric sounds like velvet and gravel.
            </p>
            <p className="cg-profit-center-prose">
              If you want to tune your own records with surgical dignity, buy Melodyne 5 Studio through our studio affiliate link below. Every license sold directly funds our vintage 12AX7 tube amp habit and keeps our soldering irons hot.
            </p>
            <div className="cg-profit-center-actions">
              <a
                href={MELODYNE_AFFILIATE.affiliateUrl}
                target="_blank"
                rel="noreferrer"
                className="cg-btn cg-btn--gold"
                data-analytics-event="affiliate_click"
                data-analytics-param-product="melodyne_5"
              >
                Buy Melodyne 5 Studio (Studio Affiliate) ↗
              </a>
              <span className="cg-profit-center-disclosure">
                {MELODYNE_AFFILIATE.commissionDisclosure}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDIO PRODUCTIONS */}
      <section className="cg-dispatches" aria-labelledby="dispatches-title">
        <div className="cg-rule-header">
          <div className="cg-rule-header__left">
            <span className="cg-badge">STUDIO PRODUCTIONS</span>
            <h2 id="dispatches-title" className="cg-rule-header__heading">
              Current Productions &amp; Editions
            </h2>
          </div>
          <div className="cg-rule-header__right">
            <span className="cg-rule-header__date">ORIGINAL SCREENPLAY &amp; SCORE</span>
          </div>
        </div>

        <div className="cg-dispatches__grid">
          {/* Dispatch 01: Bong Tour */}
          <article className="cg-dispatch-column cg-dispatch-column--bong cg-dispatch-column--featured" aria-label="Bong Tour Screenplay">
            <div className="cg-dispatch-column__mast">
              <span className="cg-meta-kicker cg-meta-kicker--tobacco">DISPATCH 01 · FEATURE FILM</span>
              <span className="cg-dispatch-column__tag">ORIGINAL SCREENPLAY</span>
            </div>

            <div className="cg-dispatch-featured__layout">
              <figure className="cg-dispatch-column__media">
                <Link href="/bong-tour" className="cg-dispatch-column__poster-link" aria-label="View Bong Tour Screenplay Portal">
                  <div className="cg-dispatch-column__poster-frame">
                    <Image
                      src={posterImage}
                      alt="Bong Tour concept film poster"
                      sizes="(max-width: 960px) 90vw, 420px"
                      className="cg-dispatch-column__image"
                    />
                    <span className="cg-dispatch-column__poster-badge">Read Screenplay ↗</span>
                  </div>
                </Link>
                <figcaption>Original feature screenplay &amp; score suite</figcaption>
              </figure>

              <div className="cg-dispatch-featured__details">
                <h3 className="cg-dispatch-column__title">
                  <Link href="/bong-tour">Bong Tour: A Sun-Baked Masala Road Comedy</Link>
                </h3>

                <p className="cg-dispatch-column__copy">
                  An indie band hauls a fragile, hand-blown six-foot glass rig across Route 66 in a van that overheats if you look at it wrong. Between Barstow radiator blowouts, neon-lit motel rooms, and questionable desert pitstops, it&apos;s a sun-baked comedy of stubborn survival.
                </p>

                <div className="cg-dispatch-column__action">
                  <Link href="/bong-tour" className="cg-inline-link">
                    Read Screenplay &amp; Hear Cues →
                  </Link>
                </div>
              </div>
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
                <p>Real guitars through overdriven tube amps, P-Bass grooves, and SP-404 chops running into Ableton. We track the instruments ourselves, sculpt vocal pitch meticulously in Celemony Melodyne, and edit every transition, bar, and stem painstakingly by hand—pressed to wax and built to last.</p>
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
              The studio takes on a handful of weird, ambitious collaborations each year across original sound production, film packaging, and editorial design. We play real instruments, write the scripts, and edit every single cut and cue painstakingly ourselves. No endless email chains with committee feedback, guaranteed.
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
    ) : null}
  </>
  );
}
