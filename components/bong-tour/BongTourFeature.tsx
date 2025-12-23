import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import posterImage from "@/app/bong-tour/bong-tour-poster.png";

const globalComps = ["The Big Lebowski (stoner philosophy)", "Tropic Thunder (industry satire)", "Fear and Loathing in Las Vegas (trip momentum)", "The Player (meta Hollywood)"];

const indiaComps = ["Go Goa Gone energy", "Delhi Belly irreverence", "Luck By Chance insider bite"];

const keyDetails = [
  { label: "Format", detail: "Feature screenplay · 118 pages" },
  { label: "Budget target", detail: "Streaming mid-tier · USD $12M" },
  { label: "Visual signature", detail: "Masala satire · neon noir" }
];

const cast = [
  {
    name: "Vishal",
    detail: "Indian American writer. Long haired, anxious, and brilliant. He believes the film means something even when he is too high to stand upright."
  },
  {
    name: "Drew",
    detail: "Vishal's best friend. Loud, reckless, conspiracy obsessed, and seduced by fame."
  },
  {
    name: "Willie",
    detail: "The grounded force who sees the machine clearly, calls out the nonsense, and ultimately becomes the real author of the outcome."
  },
  {
    name: "Montu",
    detail: "A little person with scars, dignity, and mythic weight. Guardian of the bong and proof that 'small' is not weak."
  },
  {
    name: "The C lister",
    detail: "A washed up actor turned parasite mentor who ushers the writers into the underworld and wants his renaissance at any cost."
  },
  {
    name: "The A lister",
    detail: "A Hollywood legend. Shaman-paranoid, power drunk, and eager for an initiation instead of a pitch."
  },
  {
    name: "Upper Management",
    detail: "Not a person but an ecosystem. The industry itself, forever offering the sequel to keep you owned."
  }
];

const storyActs = [
  {
    title: "Act I — The bong enters America",
    summary: [
      "West Bengal, by the Ganges. Montu, scarred and bleeding, sets a basket afloat like Moses. Inside is the bong. It sinks, fills, and absorbs the sacred river.",
      "Smash cut to Sunset Boulevard. Vishal and Drew clutch the same bong, heading into a pitch while Hollywood careens through strikes and desperation.",
      "The act builds their rhythm: Vishal spirals, Drew charges, and neither is sober enough to notice a larger game already in motion."
    ]
  },
  {
    title: "Act II — The Comedy Store initiation",
    summary: [
      "Enter the C lister who shapes the writers and reframes their destiny. Even the title becomes a battleground: 'Bhang Tour' versus 'Bong Tour'.",
      "The Comedy Store sequence escalates into a bacchanal: champagne in the bong, chemical chaos, backstage councils. A warning lands: 'The Lollipop Guild runs this town.'",
      "An A lister refuses a normal pitch, doses the bong with DMT, and forces everyone to watch the film inside their minds. He asks the moral spine: does the little person have to die?"
    ]
  },
  {
    title: "Act III — India, origin, sacrifice",
    summary: [
      "The story bends back toward India as source code. Kolkata arrival is dense with texture before the journey turns ominous.",
      "Rishikesh reunites Vishal with his father, a legend who frames the theme with clarity: fame is different at home and heritage is not optional.",
      "Flashback noir reveals the Baba Gandalfi rule: 'The bong can only preserve life. It cannot extend it.' Montu completes the circle by releasing the bong back into the Ganges."
    ]
  }
];

const themes = [
  "Diaspora identity: you cannot outrun origin, you can only integrate it.",
  "Fame as intoxication: the industry keeps dosing you.",
  "Power structures: LA and Mumbai speak the same language, gatekeepers just wear different suits.",
  "Representation with a blade: Montu is the moral center and the script argues about how stories use bodies for catharsis."
];

const marketSignals = [
  {
    label: "Audience",
    detail: "Gen Z and Millennial stoner-comedy fans, industry insider hate-watchers, diaspora viewers, and festival crowds who want satire with teeth."
  },
  {
    label: "Platform reality",
    detail: "A global OTT event, English-led with India chapters, positioned for cult repeat watches."
  },
  {
    label: "Franchise seed",
    detail: "The ending explicitly tees up the sequel conversation with Upper Management."
  }
];

const packagingNotes = [
  "Attach a prestigious Indian actor as Vishal's father and treat the role like a crown.",
  "Keep Montu dignified and iconic. Cast a real little person actor and guard the marketing language.",
  "Shoot India chapters with local creative leadership so Kolkata and Rishikesh feel lived in, not touristy."
];

const finalThought = "Bong Tour moves like smoke—fast, shape shifting, impossible to hold—then lands as a myth about who gets to tell stories, who gets used up, and how the sacred keeps resurfacing in the dirtiest places.";

const guidingTagline = "Smoke rewrites the myth before it lets you onstage.";

const panelIcons = {
  tone: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <path d="M4 7c2.9 0 2.9 10 5.8 10s2.9-10 5.8-10 2.9 10 5.8 10" strokeLinecap="round" />
      <path d="M4 17h16" opacity="0.6" />
    </svg>
  ),
  cast: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <circle cx="6.5" cy="8" r="2.5" />
      <circle cx="17.5" cy="8" r="2.5" />
      <path d="M3 18c0-2.3 1.9-4.2 4.2-4.2h1.6c2.3 0 4.2 1.9 4.2 4.2" strokeLinecap="round" />
      <path d="M12 18c0-2.3 1.9-4.2 4.2-4.2h1.6C20.1 13.8 22 15.7 22 18" strokeLinecap="round" />
    </svg>
  ),
  story: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <path d="M4 5h16v14H4z" opacity="0.3" />
      <path d="M6 9.5h6.5L15 7l2.5 2.5H18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 14h4l1.5 1.5H18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  themes: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <path d="M12 4.5 14 9l4.5.3-3.4 2.8L16.5 17 12 14.7 7.5 17l1.4-4.9L5.5 9.3 10 9z" strokeLinejoin="round" />
    </svg>
  ),
  market: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="6.5" opacity="0.4" />
      <path d="m12 6 1.6 5.4H19l-4.3 3.1 1.6 5.5L12 16.8l-4.3 2.8 1.6-5.5L5 11.4h5.4z" strokeLinejoin="round" />
    </svg>
  ),
  packaging: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <path d="m4.5 7 7.5-3 7.5 3v10l-7.5 3-7.5-3z" strokeLinejoin="round" />
      <path d="m4.5 7 7.5 3 7.5-3" strokeLinejoin="round" />
      <path d="M12 10v10" opacity="0.5" />
    </svg>
  ),
  finale: (
    <svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" stroke="currentColor">
      <path d="M12 4c1.2 1.4 2 3.1 2 5 0 1.3-.4 2.4-1.1 3.4-.7 1-1 1.8-1 2.6 0 1 .4 1.8 1.1 2.5.7.7 1.7 1.1 3 1.1-1.3 1.4-3 2.2-5 2.2s-3.7-.8-5-2.2c1.3 0 2.3-.4 3-1.1a3.4 3.4 0 0 0 1.1-2.5c0-.8-.3-1.6-1-2.6A5.7 5.7 0 0 1 10 9c0-1.9.8-3.6 2-5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
} as const;

export function BongTourFeature() {
  return (
    <SectionShell id="bong-tour" labelledBy="bong-tour-title" innerClassName="cg-bong-feature">
      <div className="cg-bong-feature__hero">
        <div className="cg-bong-feature__hero-bg" aria-hidden="true" />
        <div className="cg-bong-feature__hero-grid">
          <div className="cg-bong-feature__hero-stack">
            <SectionHeader
              id="bong-tour-title"
              eyebrow="Feature Screenplay"
              title="Bong Tour"
              description="A diaspora masala satire where Hollywood mania collides with Indian myth logic."
              actions={
                <div className="cg-bong-feature__actions">
                  <Button as="a" href="/#contact">
                    Request a producer session
                  </Button>
                </div>
              }
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16v10H4z" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                </svg>
              }
              iconLabel="Creative screenplay emblem"
            />
            <dl className="cg-bong-feature__meta" aria-label="Pitch quick facts">
              {keyDetails.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="cg-bong-feature__logline">
              <h3>Logline</h3>
              <p>
                A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to its smoke-script. They pitch
                &ldquo;Bhang Tour&rdquo;; Hollywood hears &ldquo;Bong Tour&rdquo; and the artifact rewrites the film through them until Mount Doom asks:
                cash it, or cast it into fire?
              </p>
            </div>
            <p className="cg-bong-feature__overview">
              Bong Tour plays like a cult comedy but lands like a fable. Fame is a drug. The industry is a trip. The only antidote is choosing what is
              real.
            </p>
          </div>
          <figure className="cg-bong-feature__poster">
            <Image className="cg-bong-feature__poster-image" src={posterImage} alt="Concept poster artwork for Bong Tour" priority />
            <figcaption>Concept poster · art dept. exploration</figcaption>
          </figure>
        </div>
      </div>

      <div className="cg-bong-feature__grid">
        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__tonality" aria-label="Tone and reference grid">
          <div className="cg-bong-feature__panel-intro">
            <div className="cg-bong-feature__panel-title">
              <span className="cg-bong-feature__icon" aria-hidden="true">
                {panelIcons.tone}
              </span>
              <h3>Genre and tone</h3>
            </div>
            <p>Comedy, satire, and adventure with psychedelic propulsion and a grounded emotional spine.</p>
          </div>
          <div className="cg-bong-feature__tagline">
            <span>Tagline</span>
            <p>{guidingTagline}</p>
          </div>
          <div className="cg-bong-feature__comparisons">
            <div>
              <h4>Global comps</h4>
              <ul>
                {globalComps.map((comp) => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>India comps</h4>
              <ul>
                {indiaComps.map((comp) => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="cg-bong-feature__note">
            This is not &ldquo;India as seasoning.&rdquo; India is the myth engine and the emotional truth. West Bengal is origin, Kolkata is arrival, and
            Rishikesh is reckoning.
          </p>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__cast" aria-label="Principal characters">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.cast}
            </span>
            <h3>Core cast</h3>
          </div>
          <ul>
            {cast.map((character) => (
              <li key={character.name}>
                <span>{character.name}</span>
                <p>{character.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__story" aria-label="Story structure">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.story}
            </span>
            <h3>Story breakdown</h3>
          </div>
          <div className="cg-bong-feature__acts">
            {storyActs.map((act) => (
              <article key={act.title}>
                <h4>{act.title}</h4>
                {act.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__themes" aria-label="Themes">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.themes}
            </span>
            <h3>What lingers</h3>
          </div>
          <ul>
            {themes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__market" aria-label="Market positioning">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.market}
            </span>
            <h3>Market and positioning</h3>
          </div>
          <dl>
            {marketSignals.map((signal) => (
              <div key={signal.label}>
                <dt>{signal.label}</dt>
                <dd>{signal.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__packaging" aria-label="Packaging notes">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.packaging}
            </span>
            <h3>Packaging notes</h3>
          </div>
          <ul>
            {packagingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__finale" aria-label="Closing call to action">
          <div className="cg-bong-feature__panel-title">
            <span className="cg-bong-feature__icon" aria-hidden="true">
              {panelIcons.finale}
            </span>
            <h3>Producer invitation</h3>
          </div>
          <p>{finalThought}</p>
          <div className="cg-bong-feature__cta">
            <Button as="a" href="/#contact" variant="secondary">
              Request the Bong Tour package
            </Button>
          </div>
        </section>
      </div>
    </SectionShell>
  );
}

export default BongTourFeature;

