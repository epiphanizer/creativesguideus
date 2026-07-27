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

export function CacheFeature() {
  if (!isCachePreview) {
    // Gate UI placeholder — wire up when content is ready.
    return (
      <section className="cache-world" aria-label="Cache series">
        <div className="cache-world__shell">
          <header className="cache-world__intro">
            <p className="cache-section-header__eyebrow">Series</p>
            <h1>Cache</h1>
            <p className="cache-world__deck">Full access opens in 2027.</p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="cache-world" aria-label="Cache series">
      <div className="cache-world__shell">
        <header className="cache-world__intro">
          <p className="cache-section-header__eyebrow">Series · Opening 2027</p>
          <h1>Cache</h1>
          <p className="cache-world__deck">A new series from Creatives Guide Us. Early access opens ahead of the 2027 debut.</p>

          <div className="cache-world__actions">
            <Link href={cacheContactHref} className="cache-button">
              Request Early Access
            </Link>
            <Link href="/walls-devine" className="cache-button cache-button--outline">
              Open Walls/Devine
            </Link>
          </div>

          <p className="cache-world__meta-line">Request early access now. The full series arrives in 2027.</p>
        </header>

        <article className="cache-world__lock-card">
          <div className="cache-world__lock-grid">
            <section className="cache-world__track">
              <p className="cache-section-header__eyebrow">Early access</p>
              <h2>Get in line before 2027 opens.</h2>
              <p>Use the contact route to introduce yourself and ask for early access. Selected readers hear first when the series is ready.</p>
              <div className="cache-world__track-actions">
                <Link href={cacheContactHref} className="cache-button">
                  Request Early Access
                </Link>
              </div>
            </section>

            <section className="cache-world__track cache-world__track--secondary">
              <p className="cache-section-header__eyebrow">Next release world</p>
              <h2>Walls/Devine opens the first door on September 1.</h2>
              <p>Volume 1 opens before Cache does. Step into Walls/Devine for the music, journals, and first public chapter of the season.</p>
              <div className="cache-world__track-actions">
                <Link href="/walls-devine" className="cache-button">
                  Open Walls/Devine
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
