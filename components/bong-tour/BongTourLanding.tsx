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
    logline: "An entrance cue with authority and swagger. The screenwriters step into the Hollywood underworld, where champagne fills the bong and 'The Lollipop Guild' sets the terms."
  },
  {
    id: "space-cruiser",
    trackNumber: 3,
    title: "Space Cruiser",
    scenePlacement: "Sunset Boulevard Van Ride",
    act: "Act I",
    durationLabel: "4:15",
    audioSrc: "/walls-devine/releases/volume1/3. Space Cruiser.wav",
    logline: "Cosmic stoner propulsion through neon gridlock traffic as Vishal spirals and Drew clutches the Ganges relic like it's their golden ticket."
  },
  {
    id: "stash-daddy",
    trackNumber: 2,
    title: "Stash Daddy",
    scenePlacement: "The C-Lister's Penthouse & Shaman DMT Council",
    act: "Act II",
    durationLabel: "3:58",
    audioSrc: "/walls-devine/releases/volume1/2. Stash Daddy.wav",
    logline: "Nocturnal groove setting the trap. The A-Lister refuses a pitch, doses DMT into the bong, and asks the moral test: 'Does the little person have to die?'"
  },
  {
    id: "poetry",
    trackNumber: 7,
    title: "Poetry",
    scenePlacement: "The Ganges, West Bengal & Montu's Sacrifice",
    act: "Act III",
    durationLabel: "4:06",
    audioSrc: "/walls-devine/releases/volume1/7. Poetry.wav",
    logline: "The inward spiritual core. Language first, ornament second. Baba Gandalfi's law echoes across the river: 'The Bong can only preserve life. It cannot extend it.'"
  }
];

const characters = [
  {
    name: "Vishal",
    role: "The Idealist Screenwriter",
    actorType: "Indian-American Lead",
    bio: "Long-haired, anxious, and brilliant. Caught between his father's heritage and Hollywood validation. He believes the film means something, even when he is too high to stand upright."
  },
  {
    name: "Drew",
    role: "The Volatile Co-Writer",
    actorType: "Tolkien Superfan",
    bio: "Loud, reckless, conspiracy-obsessed, and dangerously seduced by industry fame. Drew wants the win at all costs, even if it burns the truth to ash."
  },
  {
    name: "Willie",
    role: "The Grounded Force & Final Cut",
    actorType: "The Moral Center",
    bio: "She sees through the machine from minute one. She calls out Hollywood nonsense, holds the cricket bat, the line, and ultimately produces the bound final draft: 'One script to rule them all.'"
  },
  {
    name: "Montu",
    role: "Guardian of the Sacred Bong",
    actorType: "Mythic Hero",
    bio: "A little person with scars, dignity, and mythic weight. Montu is not a punchline. He is the story's spiritual gravity, carrier of sacrifice, and proof that 'small' is not weak."
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
              eyebrow="Feature Screenplay & Film Packaging"
              title="Bong Tour"
              headingLevel="h1"
              description="A diaspora masala satire where Hollywood mania collides with Indian myth logic. The MacGuffin is a sacred relic blessed and cursed by the Ganges."
            />

            <div className="bt-hero__desk-card">
              <div className="bt-hero__desk-badge">From the Writer&apos;s Desk</div>
              <blockquote className="bt-hero__desk-body">
                &ldquo;A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to its smoke-script. They pitch &lsquo;Bhang Tour&rsquo;; Hollywood hears &lsquo;Bong Tour,&rsquo; and the bong rewrites the movie through them, until Mount Doom asks: cash it, or cast it into fire.&rdquo;
              </blockquote>
              <p className="bt-hero__desk-note">
                Fame is a drug. The industry is a trip. The only antidote is choosing what is real.
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
                  Enter Appreesh Giveaway
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
                  Appreesh Protocol <FiExternalLink aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* 2. Comps & Cinematic DNA */}
      <SectionShell id="dna" labelledBy="dna-title" className="bt-section-shell bt-section--dna">
        <div className="bt-section-head">
          <span className="bt-kicker">Cinematic Positioning & Tone</span>
          <h2 id="dna-title">Diaspora Masala Satire with a Sacred Spine</h2>
          <p>Bong Tour is not &ldquo;India as seasoning.&rdquo; India is the myth engine and the emotional truth. West Bengal is origin. Kolkata is arrival. Rishikesh is reckoning.</p>
        </div>

        <div className="bt-comps-grid">
          <div className="bt-comp-card">
            <span className="bt-comp-card__tag">Global Lineage</span>
            <h3>The Comps</h3>
            <ul className="bt-comp-card__list">
              <li><strong>The Big Lebowski</strong> — Stoner philosophy & accidental odyssey</li>
              <li><strong>Tropic Thunder</strong> — Ruthless Hollywood industry satire</li>
              <li><strong>Fear and Loathing in Las Vegas</strong> — Unstoppable psychedelic momentum</li>
              <li><strong>The Player</strong> — Meta studio cynicism and packaging obsession</li>
            </ul>
          </div>

          <div className="bt-comp-card">
            <span className="bt-comp-card__tag">Indian Instinct</span>
            <h3>Subcontinental Energy</h3>
            <ul className="bt-comp-card__list">
              <li><strong>Delhi Belly</strong> — Raw, irreverent, grounded dialogue</li>
              <li><strong>Go Goa Gone</strong> — Kinetic chaos and genre-bending courage</li>
              <li><strong>Luck By Chance</strong> — Deep insider bite of the star system</li>
              <li><strong>Lagaan</strong> — Masala crescendo with cricket logic as heroic grammar</li>
            </ul>
          </div>

          <div className="bt-comp-card bt-comp-card--highlight">
            <span className="bt-comp-card__tag">The Sacred Law</span>
            <h3>Baba Gandalfi&apos;s Rule</h3>
            <blockquote className="bt-comp-card__quote">
              &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
            </blockquote>
            <p>Every puff extracted by Hollywood demands a debt paid in origin. You cannot outrun where you came from.</p>
          </div>
        </div>
      </SectionShell>

      {/* 3. The Core Ensemble */}
      <SectionShell id="characters" labelledBy="characters-title" className="bt-section-shell bt-section--characters">
        <div className="bt-section-head">
          <span className="bt-kicker">The Ensemble</span>
          <h2 id="characters-title">The Four Leads & The Predators</h2>
          <p>A film driven by authentic characters navigating the absurdity of validation, heritage, and survival.</p>
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
          <span className="bt-kicker">Narrative Architecture</span>
          <h2 id="structure-title">The 3-Act Masala Arc</h2>
          <p>From the sacred ghats of the Ganges to the backalleys of Sunset Boulevard, and back again.</p>
        </div>

        <div className="bt-acts-grid">
          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT I</div>
            <h3>The Bong Enters America</h3>
            <p className="bt-act-card__lead">West Bengal to Sunset Boulevard</p>
            <p>A maimed Montu releases the sacred relic afloat into the sacred river. It sinks, absorbs the refuse and holiness of the Ganges, and washes up in Los Angeles. Vishal and Drew clutch the bong in a smoke-filled van heading to pitch their &lsquo;stoner epic&rsquo; amidst industry volatility.</p>
          </article>

          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT II</div>
            <h3>The Comedy Store Initiation</h3>
            <p className="bt-act-card__lead">The Trap Springs & The DMT Council</p>
            <p>Enter the washed-up C-Lister who rebrands their diaspora story into an industry package. Champagne in the bong. Chemical fire chaos. The A-Lister doses DMT, weeps at the movie in his mind, and greenlights it with casual cruelty: &ldquo;Does the little person have to die?&rdquo;</p>
          </article>

          <article className="bt-act-card">
            <div className="bt-act-card__num">ACT III</div>
            <h3>India, Origin, Sacrifice</h3>
            <p className="bt-act-card__lead">Kolkata, Rishikesh & Willie&apos;s Cut</p>
            <p>The story bends home into humid Kolkata smog and Rishikesh. Vishal confronts his legendary father. Montu makes the ultimate sacrifice at the Ganges edge. Willie produces the bound screenplay: &ldquo;One script to rule them all.&rdquo; Then Upper Management offers the sequel.</p>
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
          <span className="bt-kicker">Ecosystem Integration · Appreesh Protocol</span>
          <h2 id="giveaway-title">Bong Tour Collector Giveaway & Tribute Pass</h2>
          <p>
            Linked directly to <strong>Appreesh</strong> (our on-chain tribute and gratitude protocol on Solana). Enter in-browser to claim your limited script giveaway entry, VIP screening allocation, or verified producer tribute.
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
                  <strong>Physical Bound Script Giveaway</strong>
                  <small>Numbered first-draft bound copy (Limited to 50)</small>
                </label>

                <label className={`bt-tier-pill${giveawayTier === "premiere_pass" ? " bt-tier-pill--active" : ""}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="premiere_pass"
                    checked={giveawayTier === "premiere_pass"}
                    onChange={() => setGiveawayTier("premiere_pass")}
                  />
                  <strong>VIP Premiere Screening Pass</strong>
                  <small>Festival premiere invitation + afterparty RSVP</small>
                </label>

                <label className={`bt-tier-pill${giveawayTier === "collector_tribute" ? " bt-tier-pill--active" : ""}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="collector_tribute"
                    checked={giveawayTier === "collector_tribute"}
                    onChange={() => setGiveawayTier("collector_tribute")}
                  />
                  <strong>Appreesh On-Chain Tribute</strong>
                  <small>Solana/Anchor tribute ledger claim via appreesh.org</small>
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
                    Solana Wallet Address <span className="bt-optional">(Optional — for Appreesh On-Chain Tribute)</span>
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
                  {isSubmittingGiveaway ? "Generating Tribute Claim…" : "Claim In-Browser Giveaway Pass →"}
                </Button>
                <span className="bt-giveaway-secure">
                  🔒 Cryptographically signed & linked to <a href="https://appreesh.org" target="_blank" rel="noreferrer">appreesh.org</a>
                </span>
              </div>
            </form>
          ) : (
            <div className="bt-claim-certificate">
              <div className="bt-certificate__header">
                <div className="bt-certificate__stamp">
                  <FiCheck aria-hidden="true" />
                  VERIFIED CLAIM
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
                    <dt>Appreesh Protocol</dt>
                    <dd>
                      <a href={giveawayClaim.appreeshProtocolUrl} target="_blank" rel="noreferrer">
                        appreesh.org (Solana Program Verified) <FiExternalLink aria-hidden="true" />
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
                  A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters—an Indian-American idealist and a Tolkien superfan—to its smoke-script. They pitch &ldquo;Bhang Tour&rdquo;; Hollywood hears &ldquo;Bong Tour,&rdquo; and the bong rewrites the movie through them, until Mount Doom asks: cash it, or cast it into fire.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>WHAT IT IS</h3>
                <p>
                  Bong Tour is a diaspora masala satire where Hollywood mania collides with Indian myth logic. The MacGuffin is not a ring. It is a bong, blessed and cursed by the Ganges. It plays like a cult comedy, but it lands like a fable. Fame is a drug. The industry is a trip. The only antidote is choosing what is real.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>GENRE & COMPS</h3>
                <p><strong>Genre:</strong> Comedy, satire, adventure, with psychedelic propulsion and a grounded emotional spine.</p>
                <p><strong>Global Comps:</strong> <em>The Big Lebowski</em> (stoner philosophy), <em>Tropic Thunder</em> (industry satire), <em>Fear and Loathing in Las Vegas</em> (trip momentum), <em>The Player</em> (meta Hollywood).</p>
                <p><strong>India Comps:</strong> <em>Go Goa Gone</em> (energy), <em>Delhi Belly</em> (irreverence), <em>Luck By Chance</em> (insider bite filtered through diaspora identity).</p>
              </section>

              <section className="bt-reader-section">
                <h3>IMPORTANT THEMATIC NOTE</h3>
                <p>
                  This is not &ldquo;India as seasoning.&rdquo; India is the myth engine and the emotional truth. West Bengal is origin. Kolkata is arrival. Rishikesh is reckoning. And a father embodies the Indian star system ethos: better to be a legend at home than chase mediocrity abroad.
                </p>
              </section>

              <section className="bt-reader-section">
                <h3>THE SACRED RULE: BABA GANDALFI&apos;S LAW</h3>
                <blockquote className="bt-reader-quote">
                  &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
                </blockquote>
              </section>

              <section className="bt-reader-section">
                <h3>ACT BREAKDOWN</h3>
                <h4>Act I: The Bong Enters America</h4>
                <p>
                  West Bengal, by the Ganges. A maimed Montu, acid-scarred and bleeding, sets a basket afloat like Moses. Inside is the Bong. It sinks, it fills, it absorbs the refuse of the sacred Ganges. Myth is literal here: sacred and disgusting, holy and hilarious.
                </p>
                <p>
                  Smash cut: Sunset Boulevard. Vishal and Drew are in a van, obliterated, clutching the same bong like it is destiny. They are heading to pitch their &lsquo;stoner epic&rsquo; during a chaotic Hollywood moment full of strikes, volatility, and desperation. Vishal spirals, Drew charges, and neither is sober enough to realize they are walking into a cosmic trap.
                </p>

                <h4>Act II: The Comedy Store Initiation & The Shaman Council</h4>
                <p>
                  Enter the washed-up C-Lister who rebrands &lsquo;Bhang Tour&rsquo; into an industry packaging note. &ldquo;The Lollipop Guild runs this town.&rdquo; It is absurd, until it is not.
                </p>
                <p>
                  The Comedy Store sequence escalates into a bacchanal: champagne in the bong, chemical fire, backstage councils. The A-Lister refuses a normal pitch, doses DMT into the bong, and says: <em>no words, just eyes</em>. The trio watches the film inside their minds until the A-Lister weeps and asks the moral question: <strong>&ldquo;Does the little person have to die?&rdquo;</strong> He greenlights it with casual cruelty.
                </p>

                <h4>Act III: India, Origin, Sacrifice</h4>
                <p>
                  The story bends back toward India as source code. Kolkata with sensory density: smog, horns, Ambassador cabs, humid chaos. Drew&apos;s jealousy grows as Montu and Vishal connect. Rishikesh: Vishal meets his father, alive and hidden, who delivers the truth: fame is different at home; heritage is not optional.
                </p>
                <p>
                  Masala crescendo: catwalk, fire, obsession, and a mythic fight over the bong. Mid-chaos, a cultural flare hits: &ldquo;LAGAAN!&rdquo; Montu crawls toward the Ganges, intact, and releases the Bong into the water, completing the circle: preserve, do not extend.
                </p>
                <p>
                  Resolution: Willie reveals authorship with the bound final version: <em>&ldquo;One script to rule them all.&rdquo;</em> Just when it feels like closure, Upper Management arrives with the oldest drug of all: the sequel offer.
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
