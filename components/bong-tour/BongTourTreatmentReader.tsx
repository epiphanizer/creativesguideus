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
          <span className="bt-kicker">Hand-Bound Draft · Reading Copy</span>
          <h1 id="treatment-heading">BONG TOUR</h1>
          <p className="bt-treatment-subtitle">A Masala Film</p>
          <div className="bt-treatment-credits">
            <span>Written by Sean Halls & Collaborators</span>
            <span>·</span>
            <span>Creatives Guide Us Sound Lab & Studio</span>
            <span>·</span>
            <span>Original Screenplay & Score Draft</span>
          </div>
        </header>

        <section className="bt-treatment-block">
          <h2>LOGLINE</h2>
          <p className="bt-treatment-lead">
            A sacred glass relic dumped into the Ganges somehow resurfaces in an overheated Dodge van on Sunset Boulevard. Two broke screenwriters—an anxious Indian-American idealist and a reckless Tolkien nerd—pitch a sacred diaspora road comedy called &ldquo;Bhang Tour.&rdquo; Hollywood hears &ldquo;Bong Tour,&rdquo; smells stoner millions, and turns the town upside down until Mount Doom demands an answer: cash the corporate check, or throw the whole damn thing into the fire.
          </p>
        </section>

        <section className="bt-treatment-block">
          <h2>WHAT IT IS</h2>
          <p>
            A sun-baked diaspora masala road comedy where desperate Hollywood hustle collides head-on with ancient Indian myth. The MacGuffin isn&apos;t a magic ring—it&apos;s a six-foot hand-blown glass bong cursed and blessed by the sacred river. It plays like a late-night cult comedy, but it lands like reality: the town promises you the world just to strip you of everything authentic, and the only way out is refusing to sell out your roots.
          </p>
        </section>

        <section className="bt-treatment-block">
          <h2>THE BLOODLINE &amp; COMPS</h2>
          <p>A fast, irreverent road comedy built on overdriven guitar grit, psychedelic momentum, and an unshakeable moral spine.</p>
          <div className="bt-treatment-comps">
            <div>
              <h3>Global Bloodline</h3>
              <ul>
                <li><strong>The Big Lebowski</strong> (stoned road trip philosophy &amp; accidental odysseys)</li>
                <li><strong>Tropic Thunder</strong> (unforgiving satire of Hollywood egos and industry bullshit)</li>
                <li><strong>Fear and Loathing in Las Vegas</strong> (desert momentum with the pedal pinned to the floor)</li>
                <li><strong>The Player</strong> (studio executives boiling human lives into twenty-word pitches)</li>
              </ul>
            </div>
            <div>
              <h3>Desi Bloodline</h3>
              <ul>
                <li><strong>Delhi Belly</strong> (fast, dirty, irreverent dialogue that doesn&apos;t apologize)</li>
                <li><strong>Go Goa Gone</strong> (pure chaotic momentum and genre-bending courage)</li>
                <li><strong>Luck By Chance</strong> (the sharp, razor-wire truth about how film dynasties work)</li>
                <li><strong>Lagaan</strong> (masala stakes where everything comes down to one heroic over)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>THE UNBREAKABLE RULE</h2>
          <blockquote className="bt-treatment-rule">
            &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
            <footer>— Baba Gandalfi</footer>
          </blockquote>
          <p>
            Every hit extracted by Hollywood parasites demands a debt paid back at origin. You cannot outrun where you came from, no matter how many sequel checks they wave in your face.
          </p>
        </section>

        <section className="bt-treatment-block">
          <h2>THE CORE ENSEMBLE</h2>
          <div className="bt-treatment-cast-grid">
            <div className="bt-treatment-cast-item">
              <strong>Vishal</strong>
              <p>Hair down to his shoulders, permanently on edge, and desperately trying to write something that matters while choking on second-hand smoke. Caught between his dad&apos;s legendary shadow in Mumbai and a Hollywood executive asking if he can make the lead &ldquo;more relatable.&rdquo;</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Drew</strong>
              <p>Vishal’s writing partner. Loud, unhinged, obsessed with Tolkien lore, and dangerously vulnerable to anyone offering him a VIP lanyard. Drew will steer the van into oncoming traffic if he thinks there&apos;s a three-picture studio deal on the other side.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Willie</strong>
              <p>The only adult in the room. She sees through Hollywood glad-handing five seconds before it happens, keeps a cricket bat behind the van seat, and edits their rambling stoner pages into actual cinema. When the guys lose their minds, Willie holds the steering wheel and the final cut.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Montu</strong>
              <p>Guardian of the relic. Acid scars from old battles, zero tolerance for bullshit, and carrying real generational weight. Hollywood suits try to cast him as a gimmick punchline; Montu turns out to be the smartest, toughest survivor on either side of the Pacific.</p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>The C-Lister &amp; The A-Lister</strong>
              <p>The C-Lister: washed-up 90s television star turned parasitic mentor who claims &ldquo;The Lollipop Guild runs this town.&rdquo; The A-Lister: a delusional Hollywood titan, paranoid and power-drunk, who refuses to read pages and insists on a DMT initiation through the glass: <em>&ldquo;Does the little person have to die?&rdquo;</em></p>
            </div>
            <div className="bt-treatment-cast-item">
              <strong>Upper Management</strong>
              <p>Not a person—an ecosystem. Polished executives in linen shirts riding golf carts across studio backlots, ready to buy your soul, sanitize it into focus-grouped slop, and lock you into a three-picture sequel contract.</p>
            </div>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>HOW THE WHEELS COME OFF (ACT BREAKDOWN)</h2>

          <div className="bt-treatment-act">
            <h3>Act I: The Relic Hits Sunset</h3>
            <p>
              West Bengal, by the holy river. Montu, scarred and battered, sets a basket afloat with a sacred hand-blown six-foot glass relic to protect it from scavengers. It sinks into the silt and pops up halfway across the planet on Sunset Boulevard.
            </p>
            <p>
              Smash cut: Sunset Boulevard. Vishal and Drew are hot-boxing an overheated Dodge van that smells like radiator leak and cold drive-thru. They think they&apos;re walking into an executive pitch for a thoughtful diaspora road picture called <em>Bhang Tour</em>.
            </p>
            <p>
              Hollywood execs hear <em>Bong Tour</em>, smell weed-comedy box office, and lock the doors behind them. Vishal spirals into existential dread, Drew starts mentally spending their first backend points, and neither is sober enough to realize the cosmic trap has already closed.
            </p>
          </div>

          <div className="bt-treatment-act">
            <h3>Act II: The Comedy Store &amp; The DMT Shaman</h3>
            <p>
              Enter the washed-up C-Lister. He hooks his claws into the writers, promising connections while bleeding them dry. He clocks their naivete instantly, and the title debate gets ugly: &ldquo;Bhang Tour&rdquo; versus &ldquo;Bong Tour.&rdquo; A sacred diaspora cultural detail gets steamrolled into a cheap industry packaging note.
            </p>
            <p>
              Then comes the warning, played for laughs, landing like an ice pick: <em>&ldquo;The Lollipop Guild runs this town.&rdquo;</em> It is absurd, until it isn&apos;t.
            </p>
            <p>
              The Comedy Store sequence escalates into total chemical lunacy: champagne poured down the bong stem, paranoia in the green room, and an untouchable A-Lister who ignores the script entirely and doses DMT through the relic instead. <em>&ldquo;No words, just eyes.&rdquo;</em>
            </p>
            <p>
              The trio watches the movie inside their minds until the star weeps and asks the moral question that becomes the spine of the story: <strong>&ldquo;Does the little person have to die?&rdquo;</strong>
            </p>
            <p>
              He greenlights it with the casual cruelty of power. Demands fly, assistants scramble, and the writers realize what movie they&apos;re really trapped in: business.
            </p>
          </div>

          <div className="bt-treatment-act">
            <h3>Act III: India, Origin, Sacrifice</h3>
            <p>
              The circus gets dragged all the way back to India. Humid Kolkata streets, deafening yellow cabs, and the chaotic momentum of the old country. Drew’s jealousy flares as Montu and Vishal bond over the relic. The jokes keep landing, but the knives are out.
            </p>
            <p>
              Rishikesh: Vishal comes face-to-face with his estranged movie-star father, who drops the hammer: chasing validation in California is a sucker&apos;s game when you&apos;re embarrassed of your own family.
            </p>
            <p>
              Flashback noir, Calcutta: a premiere, a chase, violence. The Baba Gandalfi law lands like scripture: <em>&ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;</em>
            </p>
            <p>
              Climax, masala crescendo: flames, greed, and a bareknuckle brawl over the relic on a warehouse catwalk above the Ganges. Mid-chaos, a cricket bat swings like a war club with a rallying cry straight out of <em>Lagaan</em>.
            </p>
            <p>
              Montu crawls through the smoke to drop the bong back into the sacred water, fulfilling the circle: preserve, never extend. His sacrifice anchors the comedy with real consequence.
            </p>
            <p>
              Resolution: a helicopter lifts off. The A-Lister is left stranded in the dirt, power stripped, looking ridiculous. Willie stands there with a cricket bat, calm, watchful, unfooled. Then she produces the bound final shooting draft she wrote while the men were losing their minds: <em>&ldquo;One script to rule them all.&rdquo;</em>
            </p>
            <p>
              Coda: the movie premieres inside the movie. Just when they think they&apos;ve escaped clean, Upper Management pulls up in an air-conditioned golf cart with the oldest drug in Hollywood: the sequel offer.
            </p>
          </div>
        </section>

        <section className="bt-treatment-block">
          <h2>THE HARD TRUTHS</h2>
          <div className="bt-treatment-themes">
            <p><strong>Roots vs. Validation:</strong> You can&apos;t outrun your heritage by buying a house in Silver Lake. Chasing validation from executives who can&apos;t pronounce your name will only leave you hollowed out.</p>
            <p><strong>The Hollywood Dosing Machine:</strong> The industry keeps pumping you with attention and free drinks until you can&apos;t tell your real life from a twenty-word pitch deck.</p>
            <p><strong>Gatekeepers Everywhere:</strong> Sunset Boulevard and Mumbai speak the exact same language. The gatekeepers just trade linen shirts for Nehru jackets, smiling while they steal your intellectual property.</p>
            <p><strong>No Token Mascots:</strong> Montu isn&apos;t comic relief or an exotic set piece. He&apos;s the spine of the entire story. The script openly mocks an industry that exploits human bodies for sentimental Oscar clips while treating the artists like disposable labor.</p>
          </div>
        </section>

        <footer className="bt-treatment-footer">
          <div className="bt-treatment-footer__info">
            <p>Screenplay draft, character bibles, and production budget available upon request to genuine collaborators and co-conspirators.</p>
            <small>Contact: hello@creativesguide.us · Creatives Guide Us Studio &amp; Record Label</small>
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
