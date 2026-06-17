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
    // Gate UI placeholder — wire up when content is ready.
    return (
      <section className="cache-world" aria-label="Cache series">
        <div className="cache-world__shell">
          <header className="cache-world__intro">
            <p className="cache-section-header__eyebrow">Series</p>
            <h1>Cache</h1>
            <p className="cache-world__deck">Access infrastructure is live. Content coming soon.</p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="cache-world" aria-label="Cache series">
      <div className="cache-world__shell">
        <header className="cache-world__intro">
          <p className="cache-section-header__eyebrow">Series · Coming soon</p>
          <h1>Cache</h1>
          <p className="cache-world__deck">
            A new series from Creatives Guide Us. Details and access open after launch.
          </p>

          <div className="cache-world__actions">
            <Link href={cacheContactHref} className="cache-button">
              Request Early Access
            </Link>
            <Link href={wallsDevineSignalListHref} className="cache-button cache-button--outline">
              Join the Volume 1 Signal List
            </Link>
          </div>

          <p className="cache-world__meta-line">No series content is exposed on the public route before the gate opens.</p>
        </header>

        <article className="cache-world__lock-card">
          <div className="cache-world__lock-grid">
            <section className="cache-world__track">
              <p className="cache-section-header__eyebrow">Early access</p>
              <h2>Get in line before the gate opens.</h2>
              <p>Use the contact route to introduce yourself and request early access. Approved readers receive credentials when the series launches.</p>
              <div className="cache-world__track-actions">
                <Link href={cacheContactHref} className="cache-button">
                  Request Early Access
                </Link>
              </div>
            </section>

            <section className="cache-world__track cache-world__track--secondary">
              <p className="cache-section-header__eyebrow">Active world</p>
              <h2>Walls/Devine carries the live bridge now.</h2>
              <p>Volume 1 is open. Join the signal list to stay connected through the June 30 window and into what comes next.</p>
              <div className="cache-world__track-actions">
                <Link href="/walls-devine" className="cache-button">
                  Open Walls/Devine
                </Link>
                <Link href={wallsDevineSignalListHref} className="cache-button cache-button--outline">
                  Join the Volume 1 Signal List
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
