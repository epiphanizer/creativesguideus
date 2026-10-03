"use client";

import Link from "next/link";
import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";

export function JohnWallsStudioView() {
  return (
    <div className="jw-domain-view jw-studio-view">
      {/* Background Canvas: Archival Sumi Ink & Cyan Glow */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell jw-domain-shell--minimal">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="John Walls Network">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
          </div>
          <div className="jw-domain-nav__links">
            <Link href="/johnwalls-rocks" className="jw-domain-pill">
              johnwalls.rocks ↗
            </Link>
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
            <Link href="/" className="jw-domain-pill">
              creativesguide.us ↗
            </Link>
          </div>
        </nav>

        {/* Minimal Hero Section with Calligraphic Signature */}
        <main className="jw-domain-hero jw-domain-hero--centered">
          <CalligraphicSignatureTitle
            domain="johnwalls.studio"
            eyebrow="STUDIO PLATFORM & LAB"
            badgeText="PLACEHOLDER · FORTHCOMING"
            kicker="Direct-to-consumer sound platform, generative tools, and artisan sample lab. Details to be announced."
          />

          <div className="jw-minimal-dispatch">
            <a
              href="mailto:hello@creativesguide.us?subject=johnwalls.studio%20inquiry"
              className="cg-btn cg-btn--primary"
            >
              Contact Studio →
            </a>
          </div>
        </main>

        <footer className="jw-domain-footer jw-domain-footer--minimal">
          <p>© {new Date().getFullYear()} John Walls · Creatives Guide Us</p>
        </footer>
      </div>
    </div>
  );
}

export default JohnWallsStudioView;
