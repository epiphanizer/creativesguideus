"use client";

import Link from "next/link";
import { FiArrowLeft, FiDownload, FiExternalLink, FiFilm, FiMail } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";

export function BongTourTreatmentReader() {
  return (
    <SectionShell id="treatment-reader" labelledBy="treatment-heading" className="bt-treatment-shell">
      <div className="bt-treatment-nav">
        <Link href="/bong-tour" className="bt-treatment-back">
          <FiArrowLeft aria-hidden="true" /> Back to Bong Tour Main Hub
        </Link>
        <div className="bt-treatment-actions">
          <Button
            as="a"
            href="/api/bong-tour/treatment/download?type=treatment"
            variant="primary"
            size="sm"
            target="_blank"
          >
            <FiDownload aria-hidden="true" /> Download Treatment PDF
          </Button>
          <Button
            as="a"
            href="/api/bong-tour/treatment/download?type=screenplay"
            variant="secondary"
            size="sm"
            target="_blank"
          >
            <FiDownload aria-hidden="true" /> Download Screenplay PDF (First Draft)
          </Button>
        </div>
      </div>

      <article className="bt-treatment-doc">
        <header className="bt-treatment-header">
          <span className="bt-kicker">Feature Film Packaging · Reading Copy</span>
          <h1 id="treatment-heading">BONG TOUR</h1>
          <p className="bt-treatment-subtitle">A Masala Film</p>
          <div className="bt-treatment-credits">
            <span>Written by Sean Halls & Collaborators</span>
            <span>·</span>
            <span>Creatives Guide Us Sound Lab & Studio</span>
            <span>·</span>
            <span>Asset Valuation: $75,000+ Baseline</span>
          </div>
        </header>

        <section className="bt-treatment-block">
          <h2>LOGLINE</h2>
          <p className="bt-treatment-lead">
            A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters—an Indian-American idealist and a Tolkien superfan—to its smoke-script. They pitch &ldquo;Bhang Tour&rdquo;; Hollywood hears &ldquo;Bong Tour,&rdquo; and the bong rewrites the movie through them, until Mount Doom asks: cash it, or cast it into fire.
          </p>
        </section>

        <section className="bt-treatment-block">
          <h2>WHAT IT IS</h2>
          <p>
            Bong Tour is a diaspora masala satire where Hollywood mania collides with Indian myth logic. The MacGuffin is not a ring. It is a bong, blessed and cursed by the Ganges. It plays like a cult comedy, but it lands like a fable. Fame is a drug. The industry is a trip. The only antidote is choosing what is real.
          </p>
        </section>

        <section className="bt-treatment-block">
          <h2>GENRE & TONE</h2>
          <p>Comedy, satire, adventure, with psychedelic propulsion and a grounded emotional spine.</p>
          <div className="bt-treatment-comps">
            <div>
              <h3>Global Comps for Positioning</h3>
              <ul>
                <li><strong>The Big Lebowski</strong> (stoner philosophy)</li>
                <li><strong>Tropic Thunder</strong> (industry satire)</li>
                <li><strong>Fear and Loathing in Las Vegas</strong> (trip momentum)</li>
                <li><strong>The Player</strong> (meta Hollywood)</li>
              </ul>
            </div>
            <div>
              <h3>India Comps for Instinct</h3>
              <ul>
                <li><strong>Go Goa Gone</strong> (energy)</li>
                <li><strong>Delhi Belly</strong> (irreverence)</li>
                <li><strong>Luck By Chance</strong> (insider bite, filtered through diaspora identity)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>THE SACRED RULE</h2>
          <blockquote className="bt-treatment-rule">
            &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
            <footer>— Baba Gandalfi</footer>
          </blockquote>
        </section>

        <section className="bt-treatment-block">
          <h2>THE CORE ENSEMBLE</h2>
          <div className="bt-treatment-cast-grid">
            <div className="bt-treatment-cast-item">
              <strong>Vishal</strong>
              <p>Indian American writer. Long-haired. Anxious and brilliant. Caught between heritage and Hollywood validation. He believes the film means something, even when he is too high to stand upright.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Drew</strong>
              <p>Vishal’s best friend. Loud, reckless, conspiracy-obsessed, and seduced by fame. Drew wants the win, even if it costs the truth.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Willie</strong>
              <p>The grounded force. She sees the machine clearly, calls out the nonsense, and ultimately becomes the real author of the outcome. She holds the bat, the line, the final cut.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Montu</strong>
              <p>A little person with scars, dignity, and mythic weight. He is not a punchline. He is the story’s spiritual gravity. Guardian of the Bong. Carrier of sacrifice. Proof that “small” is not weak.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>The C-Lister & The A-Lister</strong>
              <p>The C-Lister: a washed-up actor turned parasite mentor. The A-Lister: a Hollywood legend, shaman-paranoid and power drunk. He doesn’t want a pitch; he wants a DMT initiation: <em>&ldquo;Does the little person have to die?&rdquo;</em></p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Upper Management</strong>
              <p>Not a person. An ecosystem. The final boss is the industry itself, forever offering the sequel to keep you owned.</p>
            </div>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>ACT BREAKDOWN</h2>

          <div className="bt-treatment-act">
            <h3>Act I: The Bong Enters America</h3>
            <p>
              West Bengal, by the Ganges. A maimed Montu, acid-scarred and bleeding, sets a basket afloat like Moses. Inside is the Bong. It sinks, it fills, it absorbs the refuse of the sacred Ganges. Myth is literal here. Sacred and disgusting. Holy and hilarious.
            </p>
            <p>
              Smash cut: Sunset Boulevard. Vishal and Drew are in a van, obliterated, clutching the same bong like it is destiny. They are heading to pitch their &lsquo;stoner epic&rsquo; during a chaotic Hollywood moment full of strikes, volatility, and desperation.
            </p>
            <p>
              The first act builds their rhythm: Vishal spirals, Drew charges, and neither is sober enough to realize they are walking into a larger game.
            </p>
          </div>

          <div className="bt-treatment-act">
            <h3>Act II: The Comedy Store Initiation (and the Trap Springs)</h3>
            <p>
              Enter the C-Lister. He &ldquo;helps&rdquo; the writers, then starts shaping them. He clock-punches their naivete and reframes their destiny. Even the title becomes a battleground: &ldquo;Bhang Tour&rdquo; versus &ldquo;Bong Tour.&rdquo; A diaspora cultural detail turns into an industry packaging note.
            </p>
            <p>
              Then comes the warning, played for laughs, landing like a threat: <em>&ldquo;The Lollipop Guild runs this town.&rdquo;</em> It is absurd, until it is not.
            </p>
            <p>
              The Comedy Store sequence escalates into a full bacchanal. Champagne in the bong. Chemical fire chaos. Backstage councils. Performers, hangers-on, a sense the night itself is possessed. Finally, the A-Lister arrives and refuses a normal pitch. He loads DMT into the bong and says: <em>no words, just eyes</em>.
            </p>
            <p>
              The trio watches the film inside their minds—joy, heartbreak, terror—until the A-Lister weeps and asks the moral question that becomes the spine of the movie: <strong>&ldquo;Does the little person have to die?&rdquo;</strong>
            </p>
            <p>
              He greenlights it with the casual cruelty of power. Calls go out. Demands get made. Horses, permissions, favors. We see the real movie they are in: business.
            </p>
          </div>

          <div className="bt-treatment-act">
            <h3>Act III: India, Origin, Sacrifice (the Myth Becomes a Weapon)</h3>
            <p>
              The story bends back toward India, not as a postcard, but as source code. We arrive in Kolkata with sensory density: smog, horns, old-school Ambassadors, that humid specific chaos. Then the journey turns ominous.
            </p>
            <p>
              The trio is pushed forward through train stations, last calls, bruised friendships. Drew’s jealousy grows as Montu and Vishal connect. The movie keeps joking, but the jokes start cutting.
            </p>
            <p>
              Rishikesh: Vishal meets his father. Alive. Hidden. Complicated. A legend in his own mind and in India’s star language. He frames the theme with brutal clarity: fame is different at home; heritage is not optional.
            </p>
            <p>
              Flashback noir, Calcutta: a premiere, a chase, violence. The &ldquo;Baba Gandalfi&rdquo; rule lands like scripture: <em>&ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;</em>
            </p>
            <p>
              Climax, masala crescendo: action, betrayal, spectacle. A mythic fight over the Bong. Catwalk, fire, obsession. A brutal fall. Montu crawling toward the river with the Bong intact. A sharp India wink hits mid-chaos: <strong>&ldquo;LAGAAN…&rdquo;</strong> Cricket logic as heroic grammar.
            </p>
            <p>
              Montu releases the Bong into the Ganges again, completing the circle of the opening. His sacrifice anchors the comedy with real consequence.
            </p>
            <p>
              Resolution: a helicopter lifts off. The A-Lister is left behind in the dirt, power abandoned, finally made small. Willie stands there with a cricket bat, calm, watchful, unfooled. Then the reveal of authorship: Willie produces the bound final version: <em>&ldquo;One script to rule them all.&rdquo;</em>
            </p>
            <p>
              Coda: we see the premiere of Bong Tour as a movie inside the movie. Just when it feels like closure, Upper Management reappears with the oldest drug of all: the sequel offer.
            </p>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>THEMES & MARKET REALITY</h2>
          <div className="bt-treatment-themes">
            <p><strong>Diaspora identity:</strong> You cannot outrun origin; you can only integrate it.</p>
            <p><strong>Fame as intoxication:</strong> The industry keeps dosing you until you can&apos;t tell the pitch from the life.</p>
            <p><strong>Power structures:</strong> LA and Mumbai speak the same language; gatekeepers just wear different suits.</p>
            <p><strong>Representation with a blade:</strong> The little person is not decoration. He is the moral center. The script openly argues about how stories use bodies for catharsis.</p>
          </div>
        </section>

        <footer className="bt-treatment-footer">
          <div className="bt-treatment-footer__info">
            <p>Screenplay draft, character bibles, and production budget available to accredited partners.</p>
            <small>Contact: contact@creativesguide.us · Creatives Guide Us Studio</small>
          </div>
          <div className="bt-treatment-footer__actions">
            <Button
              as="a"
              href="/api/bong-tour/treatment/download?type=treatment"
              variant="primary"
              target="_blank"
            >
              <FiDownload aria-hidden="true" /> Download Treatment PDF
            </Button>
            <Button
              as="a"
              href="/api/bong-tour/treatment/download?type=screenplay"
              variant="secondary"
              target="_blank"
            >
              <FiFilm aria-hidden="true" /> Download Full First Draft PDF
            </Button>
          </div>
        </footer>
      </article>
    </SectionShell>
  );
}

export default BongTourTreatmentReader;
