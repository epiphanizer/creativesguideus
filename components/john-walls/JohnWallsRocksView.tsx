"use client";

import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";

export function JohnWallsRocksView() {
  return (
    <div className="jw-domain-view jw-rocks-view">
      {/* Background Canvas: Archival Sumi Ink & Oxblood Wash */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell jw-domain-shell--minimal">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="johnwalls.rocks">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.rocks</span>
          </div>
        </nav>

        {/* Minimal Hero Section with Calligraphic Signature */}
        <main className="jw-domain-hero jw-domain-hero--centered">
          <CalligraphicSignatureTitle
            domain="johnwalls.rocks"
            eyebrow="THE CREATIVE EPICENTER · ALL THE MUSIC"
            badgeText="CATALOG · FORTHCOMING"
            kicker="The creative epicenter for guitar cuts, multitrack sessions, original productions, and unreleased studio vaults. It's really all of what I do in life here."
          />

          <div className="jw-minimal-dispatch">
            <a
              href="mailto:hello@creativesguide.us?subject=johnwalls.rocks%20Creative%20Epicenter%20Inquiry"
              className="cg-btn cg-btn--primary"
            >
              Contact Creative Epicenter →
            </a>
          </div>
        </main>

        <footer className="jw-domain-footer jw-domain-footer--minimal">
          <p>
            © {new Date().getFullYear()} John Walls ·{" "}
            <a
              href="https://creativesguide.us"
              target="_blank"
              rel="noreferrer"
              className="jw-footer-link"
            >
              creativesguide.us ↗
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default JohnWallsRocksView;
