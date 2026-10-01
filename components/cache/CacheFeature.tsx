import Link from "next/link";

import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, isCachePreview } from "@/lib/launch-state";

const cacheContactHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "cache-early-access",
    project: "Cache",
    inquiryType: "partnership",
    surface: "campaign-world",
    sourceRoute: "/cache",
    campaignWindow: albumLaunchCampaignWindow
  }
});

const wallsDevineSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "walls-devine-mailing-list",
    inquiryType: "mailing-list",
    project: "Walls/Devine",
    surface: "campaign-world",
    sourceRoute: "/cache",
    campaignWindow: albumLaunchCampaignWindow
  }
});

export function CacheFeature() {
  if (!isCachePreview) {
    return (
      <section className="cache-world" aria-label="Cache series">
        <div className="cache-world__shell">
          <header className="cache-world__intro">
            <p className="cache-section-header__eyebrow">Studio Monograph &amp; Archive</p>
            <h1>Cache</h1>
            <p className="cache-world__deck">A limited-run print monograph and archival audio release documenting unreleased takes and studio typography.</p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="cache-world" aria-label="Cache series">
      <div className="cache-world__shell">
        <header className="cache-world__intro">
          <p className="cache-section-header__eyebrow">Studio Monograph &amp; Archive · Series 2027</p>
          <h1>Cache</h1>
          <p className="cache-world__deck">
            A hand-numbered archival volume of studio outtakes, spilled-coffee lyric sheets, blurry Polaroids, and woodcut proofs from the tracking sessions. Includes a lathe-cut 7-inch record featuring studio banter, false starts, and warm analog gold.
          </p>

          <div className="cache-world__actions">
            <Link href={cacheContactHref} className="cache-button">
              Request Edition Notice →
            </Link>
            <Link href={wallsDevineSignalListHref} className="cache-button cache-button--outline">
              Join the Volume 1 Signal List
            </Link>
          </div>

          <p className="cache-world__meta-line">
            Assembled by hand at Creatives Guide Us in Los Angeles. Proof that records are made by real humans in dark rooms, not software plugins.
          </p>
        </header>

        <article className="cache-world__lock-card">
          <div className="cache-world__lock-grid">
            <section className="cache-world__track">
              <p className="cache-section-header__eyebrow">Archival Edition</p>
              <h2>Reserve a copy before Terry hoards them all.</h2>
              <p>
                The first printing is strictly limited. It&apos;s printed on heavy archival paper that smells like a proper library, paired with a companion lathe-cut vinyl record cut directly in-house. If you appreciate tactile oddities, you&apos;ll want your name on the box.
              </p>
              <div className="cache-world__track-actions">
                <Link href={cacheContactHref} className="cache-button">
                  Request Edition Notice →
                </Link>
              </div>
            </section>

            <section className="cache-world__track cache-world__track--secondary">
              <p className="cache-section-header__eyebrow">Debut Album</p>
              <h2>Walls/Devine Volume 1 is streaming now.</h2>
              <p>
                Four songs tracked live on 2-inch tape late at night. Stream all four tracks in the listening room with synchronized lyric journals, or order the physical 12-inch vinyl pressing.
              </p>
              <div className="cache-world__track-actions">
                <Link href="/walls-devine" className="cache-button">
                  Enter Walls/Devine →
                </Link>
                <Link href={wallsDevineSignalListHref} className="cache-button cache-button--outline">
                  Join the Signal List
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
