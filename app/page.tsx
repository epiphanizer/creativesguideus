"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";
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
            <span className="cg-meta-kicker">CREATIVE EPICENTER</span>
            <span className="cg-meta-detail">Independent Studio &amp; Label</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--center">
            <span className="cg-meta-kicker">EDITION NO. 01</span>
            <span className="cg-meta-detail">Autumn / Winter</span>
          </div>
          <div className="cg-masthead__meta-col cg-masthead__meta-col--right">
            <span className="cg-meta-kicker">DISCIPLINES</span>
            <span className="cg-meta-detail">Sound · Screen · Software</span>
          </div>
        </div>

        <div className="cg-masthead__statement">
          <p className="cg-masthead__super-kicker">CREATIVES GUIDE US</p>
          <h1 className="cg-masthead__headline">
            We play real guitars, chop breaks, write screenplays about bad ideas, and produce every record in-house.
          </h1>
          <p className="cg-masthead__lede">
            The creative epicenter for independent sound, screen, and software craft—based in Salt Lake City, operating globally. Tube amplification, SP-404 sampling, Ableton sessions, and pure creative independence. It&apos;s really all of what I do in life here. Currently streaming Walls/Devine Volume 1 in the listening room.
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
              Tracked live in the studio with overdriven tube amps, Mint-Green P-Bass, and SP-404 samples layered in Ableton. Volume 1 pairs heavy bass grooves and raw amplifiers with spoken Midwestern verse. Four songs about rust, patience, and questionable decisions.
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

      {/* 3. STUDIO PRACTICE & DIRECT INQUIRY */}
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
                <p>Electric guitars through overdriven tube heads, P-Bass grooves, and SP-404 chops running into Ableton. We track the instruments directly, sculpt the arrangements in the room, and master for vinyl—pressed to wax and built to last.</p>
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
              The studio takes on a handful of ambitious collaborations each year across original sound production, film packaging, and editorial design. We play the instruments, write the scripts, and direct every cut and cue in-house—with zero corporate committee bloat.
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
