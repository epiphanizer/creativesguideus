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
            An upcoming limited-run print monograph and audio archive documenting unreleased tracking takes, typographic proofs, production polaroids, and physical ephemera from the studio floor.
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
            Curated by Sean Halls and the Creatives Guide Us studio team. Limited numbered edition in 2027.
          </p>
        </header>

        <article className="cache-world__lock-card">
          <div className="cache-world__lock-grid">
            <section className="cache-world__track">
              <p className="cache-section-header__eyebrow">Archival Edition</p>
              <h2>Reserve notice for the print edition.</h2>
              <p>
                The first printing will be limited to hand-numbered copies with accompanying vinyl audio artifacts. Inquire through the studio to receive publication notices and collector allocations.
              </p>
              <div className="cache-world__track-actions">
                <Link href={cacheContactHref} className="cache-button">
                  Request Edition Notice →
                </Link>
              </div>
            </section>

            <section className="cache-world__track cache-world__track--secondary">
              <p className="cache-section-header__eyebrow">Active Release</p>
              <h2>Walls/Devine Volume 1 is available now.</h2>
              <p>
                Volume 1 represents the active sound world from the studio. Stream the four tracks in the listening room with synchronized commentary, order physical merch, or stay connected through the signal list.
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
