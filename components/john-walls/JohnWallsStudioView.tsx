"use client";

import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";

export function JohnWallsStudioView() {
  return (
    <div className="jw-domain-view jw-studio-view">
      {/* Background Canvas: Archival Sumi Ink & Studio Gold Glow */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell jw-domain-shell--minimal">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="johnwalls.studio">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
          </div>
          <div className="jw-domain-nav__links">
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
          </div>
        </nav>

        {/* Minimal Hero Section with Calligraphic Signature */}
        <main className="jw-domain-hero jw-domain-hero--centered">
          <CalligraphicSignatureTitle
            domain="johnwalls.studio"
            eyebrow="DIRECT PLATFORM & GENERATIVE SOUND LAB"
            badgeText="PLATFORM · IN DEVELOPMENT"
            kicker="Direct-to-consumer sound platform, generative audio tools, and artisan sample lab. Details to be announced."
          />

          <div className="jw-minimal-dispatch">
            <a
              href="mailto:hello@creativesguide.us?subject=johnwalls.studio%20Platform%20Inquiry"
              className="cg-btn cg-btn--primary"
            >
              Contact Studio Platform →
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

export default JohnWallsStudioView;
