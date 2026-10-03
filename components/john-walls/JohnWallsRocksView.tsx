"use client";

import Link from "next/link";
import { FiDisc, FiRadio, FiExternalLink, FiMail, FiMusic, FiLayers } from "react-icons/fi";
import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";

const rocksDispatchHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "johnwalls-rocks-dispatch",
    project: "John Walls Music",
    inquiryType: "mailing-list",
    surface: "campaign-world",
    sourceRoute: "/johnwalls-rocks"
  }
});

const bookingHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "johnwalls-rocks-booking",
    project: "John Walls Music",
    inquiryType: "partnership",
    surface: "campaign-world",
    sourceRoute: "/johnwalls-rocks"
  }
});

export function JohnWallsRocksView() {
  return (
    <div className="jw-domain-view jw-rocks-view">
      {/* Background Canvas: Archival Sumi Ink & Oxblood Wash */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="John Walls Network">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot" />
            <span className="jw-domain-nav__label">JOHN WALLS · ARCHIVAL MUSIC VAULT</span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.rocks</span>
            <Link href="/johnwalls-studio" className="jw-domain-pill">
              johnwalls.studio ↗
            </Link>
            <Link href="/" className="jw-domain-pill">
              creativesguide.us ↗
            </Link>
          </div>
        </nav>

        {/* Hero Section with Calligraphic Signature */}
        <header className="jw-domain-hero">
          <CalligraphicSignatureTitle
            domain="johnwalls.rocks"
            eyebrow="OFFICIAL ARTIST DISCOGRAPHY & MASTER TAPES"
            badgeText="TAPE MACHINE ENGAGED"
            kicker="All the music. Pressed to wax, rolled on reel-to-reel, and cut direct from the sound lab. Zero automated shortcuts."
          />

          <div className="jw-hero-actions">
            <Link href="/walls-devine#listening-room" className="cg-btn cg-btn--primary">
              <FiRadio aria-hidden="true" /> Enter The Listening Room →
            </Link>
            <ContactModalLink href={rocksDispatchHref} className="cg-btn cg-btn--secondary">
              <FiMail aria-hidden="true" /> Request Vinyl & Tape Dispatch
            </ContactModalLink>
          </div>
        </header>

        {/* Discography & Release Catalog Placeholders */}
        <section className="jw-discography-section" aria-label="Discography Catalog">
          <div className="jw-section-header">
            <span className="jw-section-header__tag">ARCHIVED RELEASES & STUDIO CUTS</span>
            <h2>Catalog & Soundboard Tapes</h2>
            <p>Direct-to-analog recordings, master tapes, and forthcoming pressed editions.</p>
          </div>

          <div className="jw-catalog-grid">
            {/* 1. Walls / Devine Volume 1 */}
            <article className="jw-catalog-card jw-catalog-card--featured">
              <div className="jw-catalog-card__badge">OUT NOW · DOUBLE LP & LOSSLESS STREAM</div>
              <div className="jw-catalog-card__body">
                <div className="jw-catalog-card__meta">
                  <span className="jw-catalog-card__number">CAT # CGU-WD-001</span>
                  <span className="jw-catalog-card__year">2026</span>
                </div>
                <h3>Walls / Devine — Volume 1</h3>
                <p className="jw-catalog-card__desc">
                  9-track collaboration between Sean John Halls and Terry Devine. Loud tube heads, authentic breaks,
                  intimate vocal reflections, and heavy analog saturation.
                </p>
                <div className="jw-track-list-preview">
                  <div className="jw-track-chip">
                    <FiMusic aria-hidden="true" /> 1. Joint Queen (3:42)
                  </div>
                  <div className="jw-track-chip">
                    <FiMusic aria-hidden="true" /> 2. Stash Daddy (3:58)
                  </div>
                  <div className="jw-track-chip">
                    <FiMusic aria-hidden="true" /> 3. Space Cruiser (4:15)
                  </div>
                  <div className="jw-track-chip">
                    <FiMusic aria-hidden="true" /> 4. Lions in the Garden (4:02)
                  </div>
                </div>
              </div>
              <div className="jw-catalog-card__footer">
                <Link href="/walls-devine" className="jw-link-button">
                  <FiDisc aria-hidden="true" /> Explore Release Edition & Stems →
                </Link>
              </div>
            </article>

            {/* 2. Volume 2 - In Session */}
            <article className="jw-catalog-card">
              <div className="jw-catalog-card__badge jw-catalog-card__badge--amber">
                TRACKING IN STUDIO · 2-INCH TAPE
              </div>
              <div className="jw-catalog-card__body">
                <div className="jw-catalog-card__meta">
                  <span className="jw-catalog-card__number">CAT # CGU-WD-002</span>
                  <span className="jw-catalog-card__year">UPCOMING</span>
                </div>
                <h3>Walls / Devine — Volume 2</h3>
                <p className="jw-catalog-card__desc">
                  The follow-up album currently on the tracking console. Raw four-on-the-floor rock grooves, Hammond B3,
                  and live guitar fuzz direct from the Utah/LA sound lab.
                </p>
                <ul className="jw-card-spec-list">
                  <li>Format: 180g Vinyl, Master Cassette & Digital FLAC</li>
                  <li>Tracking: Ampex 16-Track 2-inch tape machine</li>
                  <li>Mix Stage: Console summing & hardware opto compressors</li>
                </ul>
              </div>
              <div className="jw-catalog-card__footer">
                <ContactModalLink href={rocksDispatchHref} className="jw-link-button">
                  Reserve Advance Edition →
                </ContactModalLink>
              </div>
            </article>

            {/* 3. The Unreleased Vault Tapes */}
            <article className="jw-catalog-card">
              <div className="jw-catalog-card__badge jw-catalog-card__badge--neutral">
                DIGITIZING ARCHIVE
              </div>
              <div className="jw-catalog-card__body">
                <div className="jw-catalog-card__meta">
                  <span className="jw-catalog-card__number">SERIES · VAULT</span>
                  <span className="jw-catalog-card__year">1998 — 2026</span>
                </div>
                <h3>The Vault Tapes & Soundboards</h3>
                <p className="jw-catalog-card__desc">
                  Bootlegs, acoustic hotel room takes, late-night tape loop experiments, and unreleased alternate mixes.
                  Periodically unsealed for signal list members.
                </p>
                <ul className="jw-card-spec-list">
                  <li>Reel-to-Reel Transfers: 24-bit / 96kHz lossless</li>
                  <li>Curation: Direct from John Walls studio archive</li>
                  <li>Distribution: Private member links & limited cassette runs</li>
                </ul>
              </div>
              <div className="jw-catalog-card__footer">
                <ContactModalLink href={bookingHref} className="jw-link-button">
                  Inquire on Licensing & Archive Access →
                </ContactModalLink>
              </div>
            </article>
          </div>
        </section>

        {/* Analog Studio Rig Banner */}
        <section className="jw-rig-banner">
          <div className="jw-rig-banner__inner">
            <div className="jw-rig-banner__content">
              <span className="jw-rig-kicker">SOUND LAB SPECIFICATION</span>
              <h3>No Softsynths. No Automated Pitch Correction. Real Steel & Valves.</h3>
              <p>
                Every master cut on this platform is tracked through vacuum tubes, transformers, and analog circuitry.
                We believe in the resonance of physical wood, copper coils, and moving air.
              </p>
            </div>
            <div className="jw-rig-banner__action">
              <Link href="/walls-devine#listening-room" className="cg-btn cg-btn--primary">
                Test the Sound in Studio Audio →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="jw-domain-footer">
          <div className="jw-domain-footer__inner">
            <p>© {new Date().getFullYear()} John Walls · Creatives Guide Us Record Label & Sound Lab.</p>
            <div className="jw-domain-footer__links">
              <Link href="/johnwalls-studio">johnwalls.studio</Link>
              <span>·</span>
              <Link href="/walls-devine">walls-devine</Link>
              <span>·</span>
              <Link href="/contact">contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
