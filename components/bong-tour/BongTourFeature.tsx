import Image from "next/image";

import { Button } from "@/components/ui/Button";
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

const storyboardTilts = [-2.5, 1.5, -1.2, 2.2, -1.8, 1.8, -0.8];

export function BongTourFeature() {
  return (
    <div className="bt-stage">
      <figure className="bt-poster">
        <div className="bt-poster__frame">
          <Image src={posterImage} alt="Concept poster artwork for Bong Tour" priority />
        </div>
        <figcaption>Concept poster · art dept. exploration</figcaption>
      </figure>

      <section className="bt-hero" id="bong-tour">
        <div className="bt-hero__grain" aria-hidden="true" />
        <div className="bt-hero__glow" aria-hidden="true" />
        <div className="bt-hero__content">
          <span className="bt-hero__eyebrow">Feature Screenplay</span>
          <h1>Bong Tour</h1>
          <p className="bt-hero__descriptor">A diaspora neon noir masquerading as a stoner comedy.</p>
          <div className="bt-hero__logline">
            <h2>Logline</h2>
            <p>
              A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to its smoke-script.
              Hollywood keeps hearing &ldquo;Bong Tour&rdquo;; the artifact keeps rewriting the myth until they choose who must burn.
            </p>
          </div>
          <dl className="bt-hero__facts" aria-label="Pitch quick facts">
            {keyDetails.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="bt-hero__actions">
            <Button as="a" href="/#contact" className="bt-button">
              Producer invitation
            </Button>
          </div>
        </div>
      </section>

      <section className="bt-tonality" aria-label="Tone and references">
        <div className="bt-tonality__grid">
          <div className="bt-tonality__copy">
            <h2>Genre &amp; tone</h2>
            <p>Comedy, satire, and adventure with psychedelic propulsion and a grounded emotional spine.</p>
            <div className="bt-tonality__tagline">
              <span>Tagline</span>
              <p>{guidingTagline}</p>
            </div>
          </div>
          <div className="bt-tonality__comps">
            <div>
              <h3>Global comps</h3>
              <ul>
                {globalComps.map((comp) => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>India comps</h3>
              <ul>
                {indiaComps.map((comp) => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="bt-tonality__note">
          India isn&rsquo;t seasoning. It&rsquo;s the myth engine and the emotional truth—West Bengal as origin, Kolkata as arrival, Rishikesh as reckoning.
        </p>
      </section>

      <section className="bt-storyboard" aria-label="Storyboard breakdown">
        <div className="bt-storyboard__film" aria-hidden="true" />
        <div className="bt-storyboard__reel">
          {storyActs.map((act, index) => (
            <article key={act.title} className="bt-storyboard__panel">
              <header>
                <span>{`Scene Card ${index + 1}`}</span>
                <h3>{act.title}</h3>
              </header>
              <div className="bt-storyboard__copy">
                {act.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bt-cast" aria-label="Core cast">
        <header className="bt-section-header">
          <h2>Core cast</h2>
          <p>The energy, posture, and myth weight that keep the satire sharp.</p>
        </header>
        <ul className="bt-cast__grid">
          {cast.map((character, index) => (
            <li
              key={character.name}
              className="bt-cast__card"
              style={{ transform: `rotate(${storyboardTilts[index % storyboardTilts.length]}deg)` }}
            >
              <span>{character.name}</span>
              <p>{character.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bt-themes" aria-label="Themes and market">
        <div className="bt-themes__grid">
          <div className="bt-themes__panel">
            <h2>What lingers</h2>
            <ul>
              {themes.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
          </div>
          <div className="bt-themes__panel">
            <h2>Market pulse</h2>
            <dl>
              {marketSignals.map((signal) => (
                <div key={signal.label}>
                  <dt>{signal.label}</dt>
                  <dd>{signal.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bt-packaging" aria-label="Packaging notes">
        <header className="bt-section-header">
          <h2>Packaging directives</h2>
          <p>Guard the myth. Protect the collaborators. Keep the smoke sacred.</p>
        </header>
        <ul>
          {packagingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="bt-finale" aria-label="Producer invitation">
        <div className="bt-finale__body">
          <h2>Producer invitation</h2>
          <p>{finalThought}</p>
          <div className="bt-finale__actions">
            <Button as="a" href="/#contact" className="bt-button bt-button--outline">
              Access the Bong Tour engine
            </Button>
            <Button as="a" href="/#contact" className="bt-button bt-button--record">
              Build your future
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BongTourFeature;

