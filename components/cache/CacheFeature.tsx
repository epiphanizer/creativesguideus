import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow } from "@/lib/launch-state";

const cacheDispatchHref = buildContactHref({
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

const cacheSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "cache-early-access",
    project: "Cache",
    inquiryType: "mailing-list",
    surface: "campaign-world",
    sourceRoute: "/cache",
    campaignWindow: albumLaunchCampaignWindow
  }
});

export function CacheFeature() {
  return (
    <section className="cache-world" aria-label="Cache series">
      <div className="cache-world__shell">
        <header className="cache-world__intro">
          <p className="cache-section-header__eyebrow">Upcoming Adventure Series</p>
          <h1>Cache</h1>
          <p className="cache-world__deck">
            An upcoming adventure series. Field expeditions, treasure hunting, and the pursuit of things left off the map.
          </p>

          <p className="cache-world__status">
            Coordinates and dispatch details to follow.
          </p>

          <div className="cache-world__actions">
            <ContactModalLink href={cacheDispatchHref} className="cache-button">
              Request Dispatch →
            </ContactModalLink>
            <ContactModalLink href={cacheSignalListHref} className="cache-button cache-button--outline">
              Join the Signal List
            </ContactModalLink>
          </div>
        </header>

        <div className="cache-field-dispatch">
          <div className="cache-field-dispatch__grid">
            <div className="cache-field-dispatch__item">
              <span className="cache-field-dispatch__kicker">EXPEDITION LOG</span>
              <strong>Series 01 in Preparation</strong>
              <p>Field notes, route scouting, and physical relics recovered from uncharted corridors.</p>
            </div>
            <div className="cache-field-dispatch__item">
              <span className="cache-field-dispatch__kicker">DISPATCH TRANSMISSION</span>
              <strong>Direct Signal Routing</strong>
              <p>Coordinates, survey logs, and transmission briefs dispatched exclusively to the signal list.</p>
            </div>
            <div className="cache-field-dispatch__item">
              <span className="cache-field-dispatch__kicker">STUDIO BASE</span>
              <strong>Salt Lake City · Global</strong>
              <p>Independent field production, cartography, and narrative dispatches by Creatives Guide Us.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
