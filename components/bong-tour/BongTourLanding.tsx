"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiFilm,
  FiMusic,
  FiPause,
  FiPlay,
  FiVolume2
} from "react-icons/fi";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { EcosystemSignupForm } from "@/components/walls-devine/EcosystemSignupForm";

type GiveawayTier = "script_giveaway" | "premiere_pass" | "collector_tribute";

type GiveawayClaim = {
  claimId: string;
  serialNumber: string;
  verificationHash: string;
  tierId: GiveawayTier;
  tierTitle: string;
  tierDescription: string;
  allocation: string;
  name: string;
  email: string;
  walletAddress: string | null;
  provider: string;
  appreeshProtocolUrl: string;
  status: string;
  timestamp: string;
};

type SoundtrackCue = {
  id: string;
  trackNumber: number;
  title: string;
  scenePlacement: string;
  act: string;
  durationLabel: string;
  audioSrc: string;
  logline: string;
};

const soundtrackCues: SoundtrackCue[] = [
  {
    id: "joint-queen",
    trackNumber: 1,
    title: "Joint Queen",
    scenePlacement: "The Comedy Store Entrance & Bacchanal",
    act: "Act I / Act II",
    durationLabel: "3:42",
    audioSrc: "/walls-devine/releases/volume1/1. Joint Queen.wav",
    logline: "An entrance cue with swagger and overdriven tube amp grit. The writers step into the Hollywood underworld, where champagne fills the bong and the parasites set the terms."
  },
  {
    id: "space-cruiser",
    trackNumber: 3,
    title: "Space Cruiser",
    scenePlacement: "Sunset Boulevard Van Ride",
    act: "Act I",
    durationLabel: "4:15",
    audioSrc: "/walls-devine/releases/volume1/3. Space Cruiser.wav",
    logline: "Fuzz bass and desert momentum through neon gridlock as Vishal spirals and Drew clutches the stolen relic like it's their winning lottery ticket."
  },
  {
    id: "stash-daddy",
    trackNumber: 2,
    title: "Stash Daddy",
    scenePlacement: "The C-Lister's Penthouse & Shaman DMT Council",
    act: "Act II",
    durationLabel: "3:58",
    audioSrc: "/walls-devine/releases/volume1/2. Stash Daddy.wav",
    logline: "Nocturnal groove setting the trap. The A-Lister refuses a pitch, doses DMT into the glass, and asks: 'Does the little person have to die?'"
  },
  {
    id: "poetry",
    trackNumber: 7,
    title: "Poetry",
    scenePlacement: "The Ganges, West Bengal & Montu's Sacrifice",
    act: "Act III",
    durationLabel: "4:06",
    audioSrc: "/walls-devine/releases/volume1/7. Poetry.wav",
    logline: "Raw acoustic resonance and spoken verse. Language first, studio bullshit second. Baba Gandalfi's law echoes across the water: 'The Bong can only preserve life. It cannot extend it.'"
  }
];

const characters = [
  {
    name: "Vishal",
    role: "The Idealist Writer",
    actorType: "Indian-American Lead",
    bio: "Hair down to his shoulders, permanently on edge, and desperately trying to write something that matters while choking on second-hand smoke. Caught between his dad's legendary shadow in Mumbai and a Hollywood executive asking if he can make the lead 'more relatable.'"
  },
  {
    name: "Drew",
    role: "The Volatile Co-Writer",
    actorType: "Tolkien Obsessive",
    bio: "Vishal’s writing partner. Loud, unhinged, obsessed with Tolkien lore, and dangerously vulnerable to anyone offering him a VIP pass. Drew will steer the van into oncoming traffic if he thinks there's a three-picture studio deal on the other side."
  },
  {
    name: "Willie",
    role: "The Grounded Force & Final Cut",
    actorType: "The Moral Center",
    bio: "The only adult in the room. She sees through Hollywood glad-handing five seconds before it happens, keeps a cricket bat behind the van seat, and edits their rambling stoner pages into actual cinema. When the guys lose their minds, Willie holds the steering wheel."
  },
  {
    name: "Montu",
    role: "Guardian of the Relic",
    actorType: "Mythic Hero",
    bio: "Guardian of the relic. Scars from old fires, zero tolerance for bullshit, and carrying real generational weight. Hollywood suits try to cast him as a gimmick punchline; Montu turns out to be the smartest, toughest survivor on either side of the Pacific."
  }
];

export function BongTourLanding() {
  // Audio Player State
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Giveaway State
  const [giveawayName, setGiveawayName] = useState("");
  const [giveawayEmail, setGiveawayEmail] = useState("");
  const [giveawayWallet, setGiveawayWallet] = useState("");
  const [giveawayTier, setGiveawayTier] = useState<GiveawayTier>("script_giveaway");
  const [giveawayNote, setGiveawayNote] = useState("");
  const [isSubmittingGiveaway, setIsSubmittingGiveaway] = useState(false);
  const [giveawayError, setGiveawayError] = useState("");
  const [giveawayClaim, setGiveawayClaim] = useState<GiveawayClaim | null>(null);

  // Reader Modal State
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const activeCue = soundtrackCues[activeCueIndex] ?? soundtrackCues[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const selectCue = (index: number) => {
    setActiveCueIndex(index);
    setAudioProgress(0);
    const audio = audioRef.current;
    if (audio) {
      audio.src = soundtrackCues[index].audioSrc;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleGiveawaySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGiveawayError("");
    setIsSubmittingGiveaway(true);

    try {
      const res = await fetch("/api/bong-tour/giveaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: giveawayName,
          email: giveawayEmail,
          walletAddress: giveawayWallet,
          tierId: giveawayTier,
          note: giveawayNote
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit giveaway entry.");
      }

      setGiveawayClaim(data.claim);
    } catch (err: unknown) {
      setGiveawayError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmittingGiveaway(false);
    }
  };

  return (
    <>
      {/* Hidden Audio Player */}
      <audio ref={audioRef} src={activeCue.audioSrc} preload="none" />

      {/* 1. Hero Showcase */}
      <SectionShell id="hero" labelledBy="bong-tour-title" variant="hero" className="bt-hero-shell" innerClassName="bt-hero">
        <div className="bt-hero__layout">
          <div className="bt-hero__showcase">
            <figure className="bt-hero__poster-frame">
              <Image
                src={posterImage}
                alt="Bong Tour official concept poster"
                priority
                className="bt-hero__poster-image"
                sizes="(max-width: 900px) 85vw, 32vw"
              />
              <figcaption className="bt-hero__poster-caption">
                <span className="bt-hero__caption-badge">A Masala Film</span>
                <p>Written by Sean Halls & Collaborators · Scored by Creatives Guide Us</p>
              </figcaption>
            </figure>
          </div>

          <div className="bt-hero__copy">
            <SectionHeader
              id="bong-tour-title"
              eyebrow="Original Screenplay & Original Score"
              title="Bong Tour"
              headingLevel="h1"
              description="A sun-baked masala road comedy where desperate Hollywood hustle collides with hard Indian myth. Two broke screenwriters haul a six-foot sacred glass bong from the Ganges to Sunset Boulevard—and find out the town will steal anything that smokes."
            />

            <div className="bt-hero__desk-card">
              <div className="bt-hero__desk-badge">From the Writers&apos; Van</div>
              <blockquote className="bt-hero__desk-body">
                &ldquo;A hand-blown sacred relic gets dumped into the Ganges and somehow washes up in an overheated Dodge van on Sunset Boulevard. Vishal and Drew pitch a sacred diaspora journey called &lsquo;Bhang Tour.&rsquo; Hollywood hears &lsquo;Bong Tour,&rsquo; smells franchise dollars, and tries to turn it into stoner-bro sludge. The bong has other ideas.&rdquo;
              </blockquote>
              <p className="bt-hero__desk-note">
                Hollywood will happily buy your soul, dilute it into focus-grouped slop, and sell it back to you as a sequel. Keep your hands on the wheel and don&apos;t trust anyone in linen.
              </p>

              <div className="bt-hero__actions">
                <Button
                  type="button"
                  variant="primary"
                  className="bt-hero__btn-primary"
                  onClick={() => setIsReaderOpen(true)}
                >
                  <FiBookOpen aria-hidden="true" />
                  Read Screenplay Treatment
                </Button>

                <Button
                  as="a"
                  href="#giveaway"
                  variant="secondary"
                  className="bt-hero__btn-secondary"
                >
                  <FiAward aria-hidden="true" />
                  The Underground Ledger
                </Button>

                <Button
                  as="a"
                  href="/api/bong-tour/treatment/download?type=treatment"
                  variant="ghost"
                  className="bt-hero__btn-ghost"
                  target="_blank"
                >
                  <FiDownload aria-hidden="true" />
                  Download PDF
                </Button>
              </div>

              <div className="bt-hero__cross-links">
                <Link href="#soundtrack" className="bt-hero__text-link">
                  Soundtrack Cues ↓
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/walls-devine" className="bt-hero__text-link">
                  Walls/Devine Volume 1 Record →
                </Link>
                <span aria-hidden="true">/</span>
                <a href="https://appreesh.org" target="_blank" rel="noreferrer" className="bt-hero__text-link">
                  The Appreesh Ledger <FiExternalLink aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* 2. Comps & Cinematic DNA */}
      <SectionShell id="dna" labelledBy="dna-title" className="bt-section-shell bt-section--dna">
        <div className="bt-section-head">
          <span className="bt-kicker">The Bloodline</span>
          <h2 id="dna-title">Diaspora Masala Satire with a Sacred Spine</h2>
          <p>We aren&apos;t using India as an exotic postcard or spiritual window dressing. Kolkata is raw smog, Ambassador cabs, and family ties you can&apos;t outrun. Rishikesh is where the hangover catches up with the mythology.</p>
        </div>

        <div className="bt-comps-grid">
          <div className="bt-comp-card">
            <span className="bt-comp-card__tag">Global Lineage</span>
            <h3>The Comps</h3>
            <ul className="bt-comp-card__list">
              <li><strong>The Big Lebowski</strong> — Stoned road trip philosophy &amp; accidental odysseys</li>
              <li><strong>Tropic Thunder</strong> — Unforgiving satire of Hollywood egos and industry bullshit</li>
              <li><strong>Fear and Loathing in Las Vegas</strong> — Psychedelic momentum with the pedal pinned to the floor</li>
              <li><strong>The Player</strong> — Studio executives turning human tragedy into twenty-word pitches</li>
            </ul>
          </div>

          <div className="bt-comp-card">
            <span className="bt-comp-card__tag">Subcontinental Heat</span>
            <h3>Desi Lineage</h3>
            <ul className="bt-comp-card__list">
              <li><strong>Delhi Belly</strong> — Fast, dirty, irreverent dialogue that doesn&apos;t apologize</li>
              <li><strong>Go Goa Gone</strong> — Pure chaotic momentum and genre-bending courage</li>
              <li><strong>Luck By Chance</strong> — The sharp, razor-wire truth about how film dynasties work</li>
              <li><strong>Lagaan</strong> — Masala high drama where everything comes down to one heroic over</li>
            </ul>
          </div>

          <div className="bt-comp-card bt-comp-card--highlight">
            <span className="bt-comp-card__tag">The Unbreakable Rule</span>
            <h3>Baba Gandalfi&apos;s Law</h3>
            <blockquote className="bt-comp-card__quote">
              &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
            </blockquote>
            <p>Every hit extracted by Hollywood suits demands a debt paid back at origin. You cannot outrun where you came from, no matter how much money they wave in your face.</p>
          </div>
        </div>
      </SectionShell>

      {/* 3. The Core Ensemble */}
      <SectionShell id="characters" labelledBy="characters-title" className="bt-section-shell bt-section--characters">
        <div className="bt-section-head">
          <span className="bt-kicker">Who&apos;s in the Van</span>
          <h2 id="characters-title">The Crew &amp; The Parasites</h2>
          <p>Two desperate writers, an unhinged relic, and a town full of bloodsuckers who smile while they steal your lunch.</p>
        </div>

        <div className="bt-characters-grid">
          {characters.map((char) => (
            <article key={char.name} className="bt-character-card">
              <div className="bt-character-card__header">
                <span className="bt-character-card__type">{char.actorType}</span>
                <h3>{char.name}</h3>
                <p className="bt-character-card__role">{char.role}</p>
              </div>
              <p className="bt-character-card__bio">{char.bio}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* 4. Three-Act Masala Structure */}
      <SectionShell id="structure" labelledBy="structure-title" className="bt-section-shell bt-section--structure">
        <div className="bt-section-head">
          <span className="bt-kicker">The Three Acts</span>
          <h2 id="structure-title">How the Wheels Come Off</h2>
          <p>From a muddy Ganges ghat to the back alleys of Sunset Boulevard, and straight back home.</p>
        </div>

        <div className="bt-acts-grid">
          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT I</div>
            <h3>The Relic Hits Sunset</h3>
            <p className="bt-act-card__lead">West Bengal to Sunset Boulevard</p>
            <p>West Bengal: Montu sets a hand-blown six-foot glass relic afloat in the sacred river to keep it out of the wrong hands. It sinks, rolls through the holy silt, and somehow resurfaces on Sunset Boulevard. Enter Vishal and Drew, hot-boxing a beat-up Dodge van that smells like radiator fluid and stale tortillas. They think they’re heading into a pitch meeting to sell a high-minded diaspora road comedy called <em>Bhang Tour</em>. Hollywood hears &lsquo;Bong Tour,&rsquo; smells stoner millions, and the trap snaps shut.</p>
          </article>

          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT II</div>
            <h3>The Comedy Store &amp; The DMT Shaman</h3>
            <p className="bt-act-card__lead">Free Champagne, Bad Trips &amp; The Pitch</p>
            <p>A washed-up C-Lister takes the boys under his greasy wing, swearing &lsquo;The Lollipop Guild runs this town.&rsquo; Backstage at The Comedy Store turns into a chemical free-for-all: champagne poured down the bong stem, paranoia in the green room, and an unhinged A-Lister who refuses to read pages and insists on smoking DMT through the relic instead. Tripping out of his skull, the star weeps, sees the movie in his head, and gives the greenlight with a single callous demand: &ldquo;Does the little person have to die?&rdquo; That&apos;s Hollywood in a nutshell: they&apos;ll make your masterpiece, as long as they can murder its soul.</p>
          </article>

          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT III</div>
            <h3>India, Origin, Sacrifice</h3>
            <p className="bt-act-card__lead">Kolkata Smog, Cricket Bats &amp; The Final Cut</p>
            <p>The production spirals all the way back to India. Humid Kolkata alleys, yellow taxi horns, and Vishal facing his estranged movie-star father, who delivers the cold slap of reality: chasing validation in Los Angeles is a fool’s errand when you don&apos;t even respect where you came from. Chaos peaks on a warehouse catwalk over the river—fire, madness, and a brawl where Drew finally realizes the industry won&apos;t love him back. Montu crawls through the smoke to return the relic to the water where it belongs. Just when the dust settles and Willie pulls out the real final draft, Upper Management shows up in a golf cart offering sequel money.</p>
          </article>
        </div>
      </SectionShell>

      {/* 5. Soundtrack Cue Room (Real Audio) */}
      <SectionShell id="soundtrack" labelledBy="soundtrack-title" className="bt-section-shell bt-section--soundtrack">
        <div className="bt-section-head">
          <span className="bt-kicker">Original Sound Lab</span>
          <h2 id="soundtrack-title">Soundtrack Cues from Walls/Devine Volume 1</h2>
          <p>Scored and tracked at the Creatives Guide Us sound lab. Overdriven guitars, desert grit, and atmospheric cues locked directly to the scenes.</p>
        </div>

        <div className="bt-player-card">
          <div className="bt-player-card__current">
            <div className="bt-player-card__meta">
              <span className="bt-player-badge">
                <FiMusic aria-hidden="true" /> Now Playing: Cue #{activeCue.trackNumber}
              </span>
              <h3>{activeCue.title}</h3>
              <p className="bt-player-card__scene">Scene: {activeCue.scenePlacement}</p>
              <p className="bt-player-card__logline">&ldquo;{activeCue.logline}&rdquo;</p>
            </div>

            <div className="bt-player-controls">
              <button
                type="button"
                className="bt-play-button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause cue" : "Play cue"}
              >
                {isPlaying ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
              </button>

              <div className="bt-progress-shell">
                <div className="bt-progress-bar" style={{ width: `${audioProgress}%` }} />
              </div>

              <span className="bt-player-duration">{activeCue.durationLabel}</span>
            </div>
          </div>

          <div className="bt-player-queue">
            <span className="bt-queue-label">Film Cue Tracks</span>
            {soundtrackCues.map((cue, idx) => (
              <button
                key={cue.id}
                type="button"
                className={`bt-queue-item${idx === activeCueIndex ? " bt-queue-item--active" : ""}`}
                onClick={() => selectCue(idx)}
              >
                <span className="bt-queue-item__num">0{cue.trackNumber}</span>
                <div className="bt-queue-item__info">
                  <strong>{cue.title}</strong>
                  <small>{cue.act} · {cue.scenePlacement}</small>
                </div>
                <span className="bt-queue-item__dur">{cue.durationLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bt-soundtrack-action">
          <Button as="a" href="/walls-devine" variant="secondary">
            Explore Full Walls/Devine Volume 1 Record →
          </Button>
        </div>
      </SectionShell>

      {/* 6. Appreesh In-Browser Giveaway & Tribute Desk (Real Backend) */}
      <SectionShell id="giveaway" labelledBy="giveaway-title" className="bt-section-shell bt-section--giveaway">
        <div className="bt-section-head">
          <span className="bt-kicker">The Underground Ledger · Direct Patronage</span>
          <h2 id="giveaway-title">First Editions &amp; The Direct Tab</h2>
          <p>
            No middlemen, no Hollywood gatekeepers taking an 80% cut. We track early supporters and hand-bound script editions on an underground Solana ledger called <strong>Appreesh</strong>—think of it as a digital bar tab stamped directly between the filmmakers and the patrons.
          </p>
        </div>

        <div className="bt-giveaway-card">
          {!giveawayClaim ? (
            <form onSubmit={handleGiveawaySubmit} className="bt-giveaway-form">
              <div className="bt-giveaway-tiers">
                <label className={`bt-tier-pill${giveawayTier === "script_giveaway" ? " bt-tier-pill--active" : ""}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="script_giveaway"
                    checked={giveawayTier === "script_giveaway"}
                    onChange={() => setGiveawayTier("script_giveaway")}
                  />
                  <strong>Hand-Bound Working Draft</strong>
                  <small>Numbered first-draft script copy with writer margin notes (50 pressed)</small>
                </label>

                <label className={`bt-tier-pill${giveawayTier === "premiere_pass" ? " bt-tier-pill--active" : ""}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="premiere_pass"
                    checked={giveawayTier === "premiere_pass"}
                    onChange={() => setGiveawayTier("premiere_pass")}
                  />
                  <strong>First Screening Pass</strong>
                  <small>Festival premiere seat + booth drinks with the filmmakers</small>
                </label>

                <label className={`bt-tier-pill${giveawayTier === "collector_tribute" ? " bt-tier-pill--active" : ""}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="collector_tribute"
                    checked={giveawayTier === "collector_tribute"}
                    onChange={() => setGiveawayTier("collector_tribute")}
                  />
                  <strong>Patron&apos;s Mark on the Ledger</strong>
                  <small>Direct-to-artist tribute inscribed on the Solana chain via appreesh.org</small>
                </label>
              </div>

              <div className="bt-form-grid">
                <div className="bt-form-group">
                  <label htmlFor="bt-name">Your Name or Alias</label>
                  <input
                    id="bt-name"
                    type="text"
                    value={giveawayName}
                    onChange={(e) => setGiveawayName(e.target.value)}
                    placeholder="e.g. Vishal / Patron"
                    className="bt-input"
                  />
                </div>

                <div className="bt-form-group">
                  <label htmlFor="bt-email">Email Address (Required)</label>
                  <input
                    id="bt-email"
                    type="email"
                    required
                    value={giveawayEmail}
                    onChange={(e) => setGiveawayEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="bt-input"
                  />
                </div>

                <div className="bt-form-group bt-form-group--full">
                  <label htmlFor="bt-wallet">
                    Solana Wallet Address <span className="bt-optional">(Optional — for your mark on the ledger)</span>
                  </label>
                  <input
                    id="bt-wallet"
                    type="text"
                    value={giveawayWallet}
                    onChange={(e) => setGiveawayWallet(e.target.value)}
                    placeholder="Base58 Solana public key (e.g. 7xKX...)"
                    className="bt-input bt-input--mono"
                  />
                </div>

                <div className="bt-form-group bt-form-group--full">
                  <label htmlFor="bt-note">Note or Production Feedback (Optional)</label>
                  <textarea
                    id="bt-note"
                    value={giveawayNote}
                    onChange={(e) => setGiveawayNote(e.target.value)}
                    placeholder="Leave a note for the writers..."
                    rows={2}
                    className="bt-input"
                  />
                </div>
              </div>

              {giveawayError && <p className="bt-form-error">{giveawayError}</p>}

              <div className="bt-giveaway-footer">
                <Button type="submit" variant="primary" disabled={isSubmittingGiveaway}>
                  {isSubmittingGiveaway ? "Inscribing to ledger…" : "Put Your Name on the Ledger →"}
                </Button>
                <span className="bt-giveaway-secure">
                  Direct peer-to-peer ledger. Zero studio gatekeepers. Verified on-chain at <a href="https://appreesh.org" target="_blank" rel="noreferrer">appreesh.org</a>
                </span>
              </div>
            </form>
          ) : (
            <div className="bt-claim-certificate">
              <div className="bt-certificate__header">
                <div className="bt-certificate__stamp">
                  <FiCheck aria-hidden="true" />
                  VERIFIED PATRON // APPREESH LEDGER
                </div>
                <span className="bt-certificate__serial">{giveawayClaim.serialNumber}</span>
              </div>

              <div className="bt-certificate__body">
                <h3>{giveawayClaim.tierTitle}</h3>
                <p className="bt-certificate__lead">{giveawayClaim.tierDescription}</p>

                <dl className="bt-certificate__details">
                  <div>
                    <dt>Recipient</dt>
                    <dd>{giveawayClaim.name} ({giveawayClaim.email})</dd>
                  </div>
                  <div>
                    <dt>Allocation Tier</dt>
                    <dd>{giveawayClaim.allocation}</dd>
                  </div>
                  <div>
                    <dt>Direct Ledger</dt>
                    <dd>
                      <a href={giveawayClaim.appreeshProtocolUrl} target="_blank" rel="noreferrer">
                        appreesh.org (Direct-to-Artist Ledger) <FiExternalLink aria-hidden="true" />
                      </a>
                    </dd>
                  </div>
                  {giveawayClaim.walletAddress && (
                    <div>
                      <dt>Destination Wallet</dt>
                      <dd className="bt-mono">{giveawayClaim.walletAddress}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Verification Hash</dt>
                    <dd className="bt-mono">{giveawayClaim.verificationHash}</dd>
                  </div>
                </dl>
              </div>

              <div className="bt-certificate__actions">
                <Button
                  as="a"
                  href="/api/bong-tour/treatment/download?type=treatment"
                  variant="primary"
                  target="_blank"
                >
                  <FiDownload aria-hidden="true" />
                  Download Verified Reading Copy
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setGiveawayClaim(null)}
                >
                  Enter Another Giveaway Entry
                </Button>
              </div>
            </div>
          )}
        </div>
      </SectionShell>

      {/* 7. Studio Signal List */}
      <SectionShell id="signal" labelledBy="signal-title" className="bt-section-shell bt-section--signal">
        <div className="bt-signal-banner">
          <EcosystemSignupForm
            className="bt-signal-banner__signup"
            source="bong-tour-screenplay-portal"
            interest="Bong Tour Film Packaging & Premiere Updates"
            title="Stay close to the Bong Tour production"
            description="Join for private reading copy notifications, casting calls, and festival premiere dispatches from Creatives Guide Us."
            submitLabel="Join the Production List"
            successMessage="You're on the Bong Tour list."
            note="Occasional production notes. Zero fluff."
            emailOnly
          />

          <div className="bt-signal-banner__desk">
            <h2 id="signal-title">Packaging & Private Circulation</h2>
            <p>For accredited producers, directors, and distribution partners seeking physical scripts, budget breakdown, or lookbook access.</p>
            <Button
              as="a"
              href="mailto:contact@creativesguide.us?subject=Bong%20Tour%20Packaging%20Inquiry"
              variant="secondary"
            >
              Contact Studio Production Desk →
            </Button>
          </div>
        </div>
      </SectionShell>

      {/* 8. Treatment Full-Text Modal */}
      {isReaderOpen && (
        <div className="bt-reader-modal" role="dialog" aria-modal="true" aria-label="Bong Tour Treatment Reader">
          <div className="bt-reader-modal__backdrop" onClick={() => setIsReaderOpen(false)} />
          <div className="bt-reader-modal__sheet">
            <header className="bt-reader-modal__header">
              <div>
                <span className="bt-kicker">Official Studio Reading Copy</span>
                <h2>BONG TOUR — Treatment & Screenplay Synopsis</h2>
                <small>By Sean Halls & Collaborators · Creatives Guide Us</small>
              </div>
              <div className="bt-reader-modal__header-actions">
                <Button
                  as="a"
                  href="/api/bong-tour/treatment/download?type=treatment"
                  variant="secondary"
                  size="sm"
                  target="_blank"
                >
                  <FiDownload aria-hidden="true" />
                  Download PDF
                </Button>
                <button
                  type="button"
                  className="bt-reader-modal__close"
                  onClick={() => setIsReaderOpen(false)}
                  aria-label="Close reader"
                >
                  ✕
                </button>
              </div>
            </header>

            <div className="bt-reader-modal__content">
              <section className="bt-reader-section">
                <h3>LOGLINE</h3>
                <p>
                  A sacred glass relic dumped into the Ganges somehow resurfaces in an overheated Dodge van on Sunset Boulevard. Two broke screenwriters—an anxious Indian-American idealist and a reckless Tolkien nerd—pitch a sacred diaspora road comedy called &ldquo;Bhang Tour.&rdquo; Hollywood hears &ldquo;Bong Tour,&rdquo; smells stoner millions, and turns the town upside down until Mount Doom demands an answer: cash the corporate check, or throw the whole damn thing into the fire.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>WHAT IT IS</h3>
                <p>
                  A sun-baked diaspora masala road comedy where desperate Hollywood hustle collides head-on with ancient Indian myth. The MacGuffin isn&apos;t a magic ring—it&apos;s a six-foot hand-blown glass bong cursed and blessed by the sacred river. It plays like a late-night cult comedy, but it lands like reality: the town promises you the world just to strip you of everything authentic, and the only way out is refusing to sell out your roots.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>THE BLOODLINE &amp; COMPS</h3>
                <p><strong>Global Bloodline:</strong> <em>The Big Lebowski</em> (stoned road trip philosophy), <em>Tropic Thunder</em> (unforgiving industry satire), <em>Fear and Loathing in Las Vegas</em> (desert momentum with the pedal pinned), <em>The Player</em> (studio executives turning human lives into pitch decks).</p>
                <p><strong>Desi Bloodline:</strong> <em>Delhi Belly</em> (fast, dirty, irreverent dialogue), <em>Go Goa Gone</em> (chaotic energy and genre-bending courage), <em>Luck By Chance</em> (the sharp, razor-wire truth about film dynasties), <em>Lagaan</em> (masala stakes where everything hinges on one heroic over).</p>
              </section>

              <section className="bt-reader-section">
                <h3>THE UNBREAKABLE RULE: BABA GANDALFI&apos;S LAW</h3>
                <blockquote className="bt-reader-quote">
                  &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
                </blockquote>
                <p>
                  Every hit extracted by Hollywood parasites demands a debt paid back at origin. You cannot outrun where you came from, no matter how many sequel checks they wave in your face.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>HOW THE WHEELS COME OFF (ACT BREAKDOWN)</h3>
                <h4>Act I: The Relic Hits Sunset</h4>
                <p>
                  West Bengal, by the holy river. Montu, scarred and battered, sets a basket afloat with a sacred hand-blown six-foot glass relic to protect it from scavengers. It sinks into the silt and pops up halfway across the planet on Sunset Boulevard. Vishal and Drew are hot-boxing an overheated Dodge van that smells like radiator leak and cold drive-thru. They think they&apos;re walking into an executive pitch for a thoughtful diaspora road picture called <em>Bhang Tour</em>. Hollywood execs hear <em>Bong Tour</em>, smell weed-comedy box office, and lock the doors behind them.
                </p>

                <h4>Act II: The Comedy Store &amp; The DMT Shaman</h4>
                <p>
                  A washed-up C-Lister hooks his claws into the boys, preaching that &ldquo;The Lollipop Guild runs this town.&rdquo; Backstage at The Comedy Store devolves into total chemical lunacy: champagne poured down the bong stem, paranoia in the green room, and an untouchable A-Lister who ignores the script entirely and doses DMT through the relic instead.
                </p>
                <p>
                  Tripping out of his skull, the movie star weeps, watches the entire film inside his head, and greenlights the production on one heartless condition: <strong>&ldquo;Does the little person have to die?&rdquo;</strong> That&apos;s the studio machine laid bare—they&apos;ll bankroll your dream, as long as they get to butcher its heart.
                </p>

                <h4>Act III: India, Origin, Sacrifice</h4>
                <p>
                  The circus gets dragged all the way back to India. Humid Kolkata streets, deafening yellow cabs, and Vishal coming face-to-face with his estranged movie-star father, who drops the hammer: chasing validation in California is a sucker&apos;s game when you&apos;re embarrassed of your own family.
                </p>
                <p>
                  Everything detonates on a warehouse catwalk over the Ganges—flames, greed, and a bareknuckle brawl over the relic. Mid-chaos, a cricket bat swings like a war club with a rallying cry straight out of <em>Lagaan</em>. Montu crawls through the smoke to drop the bong back into the sacred water, fulfilling the law: preserve, never extend.
                </p>
                <p>
                  Resolution: Willie pulls out the real final shooting draft she wrote while the men were losing their minds: <em>&ldquo;One script to rule them all.&rdquo;</em> Just when they think they&apos;re free, Upper Management pulls up in an air-conditioned golf cart with the ultimate poison: a three-picture franchise deal.
                </p>
              </section>

              <div className="bt-reader-modal__footer">
                <Button
                  as="a"
                  href="/api/bong-tour/treatment/download?type=treatment"
                  variant="primary"
                  target="_blank"
                >
                  <FiDownload aria-hidden="true" />
                  Download Full PDF Treatment
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsReaderOpen(false)}
                >
                  Close Reader
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BongTourLanding;
