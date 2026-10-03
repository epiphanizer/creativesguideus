"use client";

import Link from "next/link";
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
        <nav className="jw-domain-nav" aria-label="John Walls Network">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot" />
            <span className="jw-domain-nav__label">JOHN WALLS</span>
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

        {/* Minimal Hero Section with Calligraphic Signature */}
        <main className="jw-domain-hero jw-domain-hero--centered">
          <CalligraphicSignatureTitle
            domain="johnwalls.rocks"
            eyebrow="MUSIC & MASTER TAPES"
            badgeText="PLACEHOLDER · FORTHCOMING"
            kicker="Audio archive, master tapes, and forthcoming releases. Details to be announced."
          />

          <div className="jw-minimal-dispatch">
            <a
              href="mailto:hello@creativesguide.us?subject=johnwalls.rocks%20inquiry"
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

export default JohnWallsRocksView;
