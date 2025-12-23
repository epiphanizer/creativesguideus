import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import posterImage from "@/app/bong-tour/bong-tour-poster.png";

const globalComps = ["The Big Lebowski (stoner philosophy)", "Tropic Thunder (industry satire)", "Fear and Loathing in Las Vegas (trip momentum)", "The Player (meta Hollywood)"];

const indiaComps = ["Go Goa Gone energy", "Delhi Belly irreverence", "Luck By Chance insider bite"];

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

export function BongTourFeature() {
  return (
    <SectionShell id="bong-tour" labelledBy="bong-tour-title" innerClassName="cg-bong-feature">
      <div className="cg-bong-feature__hero">
        <div className="cg-bong-feature__hero-bg" aria-hidden="true" />
        <div className="cg-bong-feature__hero-content">
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
                <Button as="a" href="/#music" variant="ghost">
                  License the score cues
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
            badge="Creative!!!"
          />
          <div className="cg-bong-feature__logline">
            <h3>Logline</h3>
            <p>
              A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to its smoke-script.
              They pitch &ldquo;Bhang Tour&rdquo;; Hollywood hears &ldquo;Bong Tour&rdquo; and the artifact rewrites the film through them until Mount Doom asks:
              cash it, or cast it into fire?
            </p>
          </div>
          <p className="cg-bong-feature__overview">
            Bong Tour plays like a cult comedy but lands like a fable. Fame is a drug. The industry is a trip. The only antidote is choosing what is real.
          </p>
        </div>
        <figure className="cg-bong-feature__poster">
          <Image className="cg-bong-feature__poster-image" src={posterImage} alt="Concept poster artwork for Bong Tour" priority />
          <figcaption>Concept poster · art dept. exploration</figcaption>
        </figure>
      </div>

      <section className="cg-bong-feature__tonality" aria-label="Tone and reference grid">
        <div>
          <h3>Genre and tone</h3>
          <p>Comedy, satire, and adventure with psychedelic propulsion and a grounded emotional spine.</p>
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
          This is not &ldquo;India as seasoning.&rdquo; India is the myth engine and the emotional truth. West Bengal is origin, Kolkata is arrival, and Rishikesh is reckoning.
        </p>
      </section>

      <section className="cg-bong-feature__cast" aria-label="Principal characters">
        <h3>Core cast</h3>
        <ul>
          {cast.map((character) => (
            <li key={character.name}>
              <span>{character.name}</span>
              <p>{character.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cg-bong-feature__story" aria-label="Story structure">
        <h3>Story breakdown</h3>
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

      <section className="cg-bong-feature__themes" aria-label="Themes">
        <h3>What lingers</h3>
        <ul>
          {themes.map((theme) => (
            <li key={theme}>{theme}</li>
          ))}
        </ul>
      </section>

      <section className="cg-bong-feature__market" aria-label="Market positioning">
        <h3>Market and positioning</h3>
        <dl>
          {marketSignals.map((signal) => (
            <div key={signal.label}>
              <dt>{signal.label}</dt>
              <dd>{signal.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cg-bong-feature__packaging" aria-label="Packaging notes">
        <h3>Packaging notes</h3>
        <ul>
          {packagingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="cg-bong-feature__finale" aria-label="Closing call to action">
        <p>{finalThought}</p>
        <div className="cg-bong-feature__cta">
          <Button as="a" href="/#contact" variant="secondary">
            Request the Bong Tour package
          </Button>
        </div>
      </section>
    </SectionShell>
  );
}

export default BongTourFeature;
