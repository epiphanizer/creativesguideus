import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import posterImage from "@/app/bong-tour/bong-tour-poster.png";

const globalComps = ["The Big Lebowski (stoner philosophy)", "Tropic Thunder (industry satire)", "Fear and Loathing in Las Vegas (trip momentum)", "The Player (meta Hollywood)"];

const indiaComps = ["Go Goa Gone energy", "Delhi Belly irreverence", "Luck By Chance insider bite"];

const keyDetails = [
  { label: "Format", detail: "Feature screenplay · 118 pages" },
  { label: "Budget lane", detail: "Streaming mid-tier · USD $12M" },
  { label: "Visual lane", detail: "Masala satire · neon noir" }
];

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
            />
  },
  {
    name: "Upper Management",
    detail: "Not a person but an ecosystem. The industry itself, forever offering the sequel to keep you owned."
  }
];

const storyActs = [
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
      "Enter the C lister who shapes the writers and reframes their destiny. Even the title becomes a battleground: 'Bhang Tour' versus 'Bong Tour'.",
      "The Comedy Store sequence escalates into a bacchanal: champagne in the bong, chemical chaos, backstage councils. A warning lands: 'The Lollipop Guild runs this town.'",
      "An A lister refuses a normal pitch, doses the bong with DMT, and forces everyone to watch the film inside their minds. He asks the moral spine: does the little person have to die?"
    ]
  },
  {
    title: "Act III — India, origin, sacrifice",
    summary: [
      <div className="cg-bong-feature__grid">
        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__tonality" aria-label="Tone and reference grid">
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
            This is not &ldquo;India as seasoning.&rdquo; India is the myth engine and the emotional truth. West Bengal is origin, Kolkata is arrival,
            and Rishikesh is reckoning.
          </p>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__cast" aria-label="Principal characters">
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

        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__story" aria-label="Story structure">
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

        <section className="cg-bong-feature__panel cg-bong-feature__themes" aria-label="Themes">
          <h3>What lingers</h3>
          <ul>
            {themes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__market" aria-label="Market positioning">
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

        <section className="cg-bong-feature__panel cg-bong-feature__packaging" aria-label="Packaging notes">
          <h3>Packaging notes</h3>
          <ul>
            {packagingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="cg-bong-feature__panel cg-bong-feature__panel--wide cg-bong-feature__finale" aria-label="Closing call to action">
          <p>{finalThought}</p>
          <div className="cg-bong-feature__cta">
            <Button as="a" href="/#contact" variant="secondary">
              Request the Bong Tour package
            </Button>
          </div>
        </section>
      </div>
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
