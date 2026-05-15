import type { CSSProperties } from "react";

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

type CastMember = {
  name: string;
  detail: string;
  callToAction?: {
    label: string;
    href: string;
    description?: string;
  };
};

const cast: CastMember[] = [
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
    name: "The Comedian",
    detail: "A strike-season prophet whose set weaponizes truth. He lives the bit like a method comic, rides whichever side is winning, and nurses a feud with the C lister that nobody will explain."
  },
  {
    name: "The A lister",
    detail: "A Hollywood legend. Shaman-paranoid, power drunk, and eager for an initiation instead of a pitch."
  },
  {
    name: "Upper Management",
    detail: "Not a person but an ecosystem. The industry itself, forever offering the sequel to keep you owned.",
    callToAction: {
      label: "Your Company Here",
      href: "/#contact",
      description: "Step into the sequel machine and craft the myth with us."
    }
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

const holiPalettes = [
  {
    splash:
      "radial-gradient(120% 120% at 16% 18%, rgba(255, 86, 122, 0.6) 0%, rgba(255, 86, 122, 0) 62%), radial-gradient(140% 140% at 82% 22%, rgba(255, 213, 79, 0.58) 0%, rgba(255, 213, 79, 0) 64%), radial-gradient(160% 160% at 52% 100%, rgba(88, 196, 255, 0.55) 0%, rgba(88, 196, 255, 0) 70%)",
    glow: "radial-gradient(120% 120% at 46% 52%, rgba(255, 86, 122, 0.22) 0%, rgba(255, 86, 122, 0) 68%)"
  },
  {
    splash:
      "radial-gradient(120% 120% at 20% 24%, rgba(13, 192, 186, 0.58) 0%, rgba(13, 192, 186, 0) 60%), radial-gradient(160% 160% at 78% 14%, rgba(255, 102, 176, 0.55) 0%, rgba(255, 102, 176, 0) 58%), radial-gradient(150% 150% at 50% 92%, rgba(255, 180, 70, 0.48) 0%, rgba(255, 180, 70, 0) 68%)",
    glow: "radial-gradient(130% 130% at 48% 62%, rgba(255, 102, 176, 0.2) 0%, rgba(255, 102, 176, 0) 70%)"
  },
  {
    splash:
      "radial-gradient(140% 140% at 18% 12%, rgba(134, 99, 255, 0.58) 0%, rgba(134, 99, 255, 0) 58%), radial-gradient(150% 150% at 80% 28%, rgba(30, 200, 190, 0.55) 0%, rgba(30, 200, 190, 0) 60%), radial-gradient(160% 160% at 46% 94%, rgba(255, 210, 82, 0.5) 0%, rgba(255, 210, 82, 0) 68%)",
    glow: "radial-gradient(140% 140% at 50% 54%, rgba(134, 99, 255, 0.2) 0%, rgba(134, 99, 255, 0) 72%)"
  },
  {
    splash:
      "radial-gradient(150% 150% at 18% 32%, rgba(255, 94, 165, 0.6) 0%, rgba(255, 94, 165, 0) 58%), radial-gradient(140% 140% at 86% 20%, rgba(82, 67, 255, 0.55) 0%, rgba(82, 67, 255, 0) 62%), radial-gradient(150% 150% at 48% 90%, rgba(142, 255, 107, 0.52) 0%, rgba(142, 255, 107, 0) 68%)",
    glow: "radial-gradient(130% 130% at 52% 58%, rgba(82, 67, 255, 0.22) 0%, rgba(82, 67, 255, 0) 70%)"
  },
  {
    splash:
      "radial-gradient(150% 150% at 16% 18%, rgba(255, 170, 59, 0.6) 0%, rgba(255, 170, 59, 0) 56%), radial-gradient(140% 140% at 84% 16%, rgba(18, 204, 190, 0.52) 0%, rgba(18, 204, 190, 0) 60%), radial-gradient(160% 160% at 40% 96%, rgba(255, 88, 126, 0.52) 0%, rgba(255, 88, 126, 0) 70%)",
    glow: "radial-gradient(130% 130% at 48% 54%, rgba(255, 88, 126, 0.22) 0%, rgba(255, 88, 126, 0) 70%)"
  },
  {
    splash:
      "radial-gradient(130% 130% at 18% 20%, rgba(255, 132, 102, 0.62) 0%, rgba(255, 132, 102, 0) 58%), radial-gradient(150% 150% at 82% 18%, rgba(108, 84, 255, 0.55) 0%, rgba(108, 84, 255, 0) 62%), radial-gradient(150% 150% at 46% 96%, rgba(94, 196, 255, 0.5) 0%, rgba(94, 196, 255, 0) 68%)",
    glow: "radial-gradient(130% 130% at 50% 56%, rgba(108, 84, 255, 0.2) 0%, rgba(108, 84, 255, 0) 70%)"
  },
  {
    splash:
      "radial-gradient(140% 140% at 14% 24%, rgba(108, 219, 168, 0.58) 0%, rgba(108, 219, 168, 0) 60%), radial-gradient(160% 160% at 82% 14%, rgba(255, 101, 101, 0.55) 0%, rgba(255, 101, 101, 0) 58%), radial-gradient(150% 150% at 52% 94%, rgba(255, 208, 112, 0.5) 0%, rgba(255, 208, 112, 0) 68%)",
    glow: "radial-gradient(130% 130% at 52% 54%, rgba(255, 101, 101, 0.22) 0%, rgba(255, 101, 101, 0) 68%)"
  }
];

type HoliCastStyle = CSSProperties & {
  "--bt-cast-holi-bg"?: string;
  "--bt-cast-holi-glow"?: string;
};

const musicPosters = [
  {
    id: "score-joint-queen",
    title: "Joint Queen",
    tagline: "Psych-funk swagger for the Comedy Store takeover.",
    description:
      "Walls/Devine lace fuzz bass with riot brass to score the writers' first smoke-fueled victory. The cue keeps the satire sharp even while the room spins.",
    highlights: [
      "Psych-funk built for slo-mo struts and jump cuts",
      "Designed for the Comedy Store initiation montage"
    ]
  },
  {
    id: "score-stash-daddy",
    title: "Stash Daddy",
    tagline: "Sunset backroom heist groove with neon menace.",
    description:
      "A swaggering low-end march that follows the C lister ushering everyone backstage. Analog pulses mirror the industry handshakes that always carry a hook.",
    highlights: [
      "Modular synth throb with tabla-inflected percussion",
      "Underscores the Sunset Boulevard midnight plotting"
    ]
  },
  {
    id: "score-space-cruiser",
    title: "Space Cruiser",
    tagline: "Diaspora dreamscape for the Ganges finale.",
    description:
      "Shimmering pads, processed tanpura, and choirs blur time as the bong completes its circuit back to the river. The cue lets the myth breathe before the sequel chase.",
    highlights: [
      "5/4 pulse drifting into weightless ambience",
      "Bridges Hollywood excess with Rishikesh clarity"
    ]
  }
];

export function BongTourFeature() {
  return (
    <div className="bt-stage">
      <section className="bt-hero" id="bong-tour">
        <div className="bt-hero__grain" aria-hidden="true" />
        <div className="bt-hero__glow" aria-hidden="true" />
        <div className="bt-hero__layout">
          <figure className="bt-hero__poster">
            <div className="bt-hero__poster-frame">
              <Image src={posterImage} alt="Concept poster artwork for Bong Tour" priority />
            </div>
            <figcaption>Concept poster · art dept. exploration</figcaption>
          </figure>
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

          </div>
        </div>
        <div className="bt-hero__meta" aria-label="Pitch quick facts">
          {keyDetails.map((item) => (
            <div key={item.label} className="bt-hero__meta-item">
              <span className="bt-hero__meta-label">{item.label}</span>
              <span className="bt-hero__meta-value">{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="bt-hero__cta">
          <Button as="a" href="/#contact" className="bt-button">
            Producer invitation
          </Button>
        </div>
      </section>

      <section className="bt-music" id="score-sketches" aria-label="Score sketches">
        <header className="bt-section-header">
          <h2>Score sketches</h2>
          <p>Walls/Devine cues built to anchor the pitch deck and hold the invitation open.</p>
        </header>
        <ul className="bt-music__grid">
          {musicPosters.map((poster, index) => (
            <li key={poster.title} id={poster.id} className="bt-music__poster">
              <div className="bt-music__visual" aria-hidden="true">
                <span className="bt-music__badge">Cue Poster {String(index + 1).padStart(2, "0")}</span>
                <div className="bt-music__marquee">
                  <h3>{poster.title}</h3>
                  <p>{poster.tagline}</p>
                </div>
              </div>
              <div className="bt-music__details">
                <p className="bt-music__lede">{poster.description}</p>
                <ul className="bt-music__highlights">
                  {poster.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="bt-music__credit">
                  <span>
                    Score by <a href="/#music">Walls/Devine</a>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
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

      <section className="bt-cast" aria-label="Core cast">
        <header className="bt-section-header">
          <h2>Core cast</h2>
          <p>The energy, posture, and myth weight that keep the satire sharp.</p>
        </header>
        <ul className="bt-cast__grid">
          {cast.map((character, index) => {
            const palette = holiPalettes[index % holiPalettes.length];
            const holiStyle: HoliCastStyle = {
              transform: `rotate(${storyboardTilts[index % storyboardTilts.length]}deg)`,
              "--bt-cast-holi-bg": palette?.splash,
              "--bt-cast-holi-glow": palette?.glow
            };

            return (
              <li key={character.name} className="bt-cast__card" style={holiStyle}>
                <span>{character.name}</span>
                <p>{character.detail}</p>
                {character.callToAction ? (
                  <Button
                    as="a"
                    href={character.callToAction.href}
                    className="bt-button bt-button--outline bt-cast__cta"
                    aria-label={character.callToAction.description ?? character.callToAction.label}
                  >
                    {character.callToAction.label}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bt-storyboard" aria-label="Storyboard breakdown">
        <div className="bt-storyboard__film" aria-hidden="true" />
        <ul className="bt-storyboard__grid">
          {storyActs.map((act, index) => (
            <li
              key={act.title}
              className="bt-storyboard__card bt-cast__card"
              style={{ transform: `rotate(${storyboardTilts[index % storyboardTilts.length]}deg)` }}
            >
              <header className="bt-storyboard__header">
                <span>{`Scene Card ${index + 1}`}</span>
                <h3>{act.title}</h3>
              </header>
              <div className="bt-storyboard__copy">
                {act.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
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
            <Button as="a" href="/#contact" className="bt-button bt-button--record">
             Connect about Bong Tour
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BongTourFeature;

