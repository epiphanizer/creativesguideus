"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiCompass,
  FiDownload,
  FiExternalLink,
  FiFilm,
  FiMusic,
  FiPause,
  FiPlay,
  FiVolume2,
  FiVolumeX
} from "react-icons/fi";
import {
  GiCoins,
  GiCrownCoin,
  GiDiceTwentyFacesTwenty,
  GiRollingDices,
  GiScrollUnfurled,
  GiSmokingPipe,
  GiSparkles,
  GiSpellBook,
  GiWizardFace
} from "react-icons/gi";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import { BongTourAgentGuide } from "@/components/bong-tour/BongTourAgentGuide";
import { BongTourAirdropAirlock } from "@/components/bong-tour/BongTourAirdropAirlock";
import { BongTourCardInspectorModal } from "@/components/bong-tour/BongTourCardInspectorModal";
import { BongTourCardItem } from "@/components/bong-tour/BongTourCardItem";
import { BongTourSkillCheck } from "@/components/bong-tour/BongTourSkillCheck";
import { BongTourSpellbookModal } from "@/components/bong-tour/BongTourSpellbookModal";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { EcosystemSignupForm } from "@/components/walls-devine/EcosystemSignupForm";
import {
  AIRDROP_AGENT_MANIFEST,
  AIRDROP_TIERS,
  calculateAirdropStats
} from "@/lib/bong-tour/airdrop";
import {
  BONG_TOUR_CARDS,
  type BongTourCard,
  INITIAL_APPREESH_BALANCE
} from "@/lib/bong-tour/cards";
import { checkUnlockedAchievements } from "@/lib/bong-tour/achievements";
import { soundEngine } from "@/lib/bong-tour/sound-effects";

declare global {
  interface Window {
    __BONG_TOUR_AGENT__?: {
      getStatus: () => Record<string, unknown>;
      getCards: () => BongTourCard[];
      getAirdropManifest: () => typeof AIRDROP_AGENT_MANIFEST;
      inscribeCard: (cardId: string) => boolean;
      submitAirdropRegistration: (input: {
        email: string;
        walletAddress?: string;
        name?: string;
        note?: string;
        tierId?: string;
      }) => Promise<any>;
      openAirlock: () => void;
      openSpellbook: () => void;
      openReader: () => void;
    };
  }
}

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
    id: "space-cruiser",
    trackNumber: 3,
    title: "Space Cruiser",
    scenePlacement: "Sunset Boulevard Van Ride",
    act: "Act I",
    durationLabel: "4:15",
    audioSrc: "/walls-devine/releases/volume1/3. Space Cruiser.wav",
    logline: "Fuzz bass and desert momentum through neon gridlock as Vishal spirals and Drew clutches the stolen relic like it's their winning lottery ticket."
  }
];

export function BongTourLanding() {
  // Appreesh & Card Collection State
  const [appreeshBalance, setAppreeshBalance] = useState<number>(INITIAL_APPREESH_BALANCE);
  const [collectedCards, setCollectedCards] = useState<string[]>(["vishal-scribe"]);
  const [encountersRolledCount, setEncountersRolledCount] = useState<number>(0);
  const [nat20Count, setNat20Count] = useState<number>(0);
  const [nat1Count, setNat1Count] = useState<number>(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [inspectingCard, setInspectingCard] = useState<BongTourCard | null>(null);
  const [isSpellbookOpen, setIsSpellbookOpen] = useState(false);
  const [cardFilter, setCardFilter] = useState<"all" | "creatures" | "artifacts" | "owned">("all");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "gain" | "spend" } | null>(null);
  const [airdropClaim, setAirdropClaim] = useState<any>(null);

  // Audio Player State
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reader Modal State
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Initialize and persist state to localStorage
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem("bong_tour_appreesh_balance");
      if (savedBalance !== null) {
        setAppreeshBalance(parseInt(savedBalance, 10) || INITIAL_APPREESH_BALANCE);
      }
      const savedCards = localStorage.getItem("bong_tour_spellbook_cards");
      if (savedCards !== null) {
        const parsed = JSON.parse(savedCards);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollectedCards(parsed);
        }
      }
      const savedRolls = localStorage.getItem("bong_tour_encounters_count");
      if (savedRolls !== null) {
        setEncountersRolledCount(parseInt(savedRolls, 10) || 0);
      }
      const savedNat20 = localStorage.getItem("bong_tour_nat20_count");
      if (savedNat20 !== null) {
        setNat20Count(parseInt(savedNat20, 10) || 0);
      }
      const savedNat1 = localStorage.getItem("bong_tour_nat1_count");
      if (savedNat1 !== null) {
        setNat1Count(parseInt(savedNat1, 10) || 0);
      }
      const savedAchievements = localStorage.getItem("bong_tour_unlocked_achievements");
      if (savedAchievements !== null) {
        const parsedAch = JSON.parse(savedAchievements);
        if (Array.isArray(parsedAch)) {
          setUnlockedAchievements(parsedAch);
        }
      }
      setIsAudioMuted(soundEngine.getMuted());
    } catch {}
  }, []);

  const saveBalance = (newBalance: number) => {
    setAppreeshBalance(newBalance);
    try {
      localStorage.setItem("bong_tour_appreesh_balance", newBalance.toString());
    } catch {}
  };

  const saveCards = (newCards: string[]) => {
    setCollectedCards(newCards);
    try {
      localStorage.setItem("bong_tour_spellbook_cards", JSON.stringify(newCards));
    } catch {}
  };

  const saveRolls = (count: number) => {
    setEncountersRolledCount(count);
    try {
      localStorage.setItem("bong_tour_encounters_count", count.toString());
    } catch {}
  };

  const triggerToast = (text: string, type: "gain" | "spend") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const checkAchievements = (
    state: {
      collectedCards: string[];
      encountersRolledCount: number;
      nat20Count: number;
      nat1Count: number;
      isAirdropClaimed: boolean;
    },
    currentBalance: number
  ) => {
    const newUnlocked = checkUnlockedAchievements(state, unlockedAchievements);
    if (newUnlocked.length > 0) {
      const updatedIds = [...unlockedAchievements, ...newUnlocked.map((a) => a.id)];
      setUnlockedAchievements(updatedIds);
      try {
        localStorage.setItem("bong_tour_unlocked_achievements", JSON.stringify(updatedIds));
      } catch {}

      const totalBonus = newUnlocked.reduce((sum, a) => sum + a.rewardAppreesh, 0);
      const balanceWithBonus = currentBalance + totalBonus;
      saveBalance(balanceWithBonus);
      soundEngine.playNat20();

      const titles = newUnlocked.map((a) => a.title).join(", ");
      setTimeout(() => {
        triggerToast(`🏆 Deed Accomplished: ${titles}! (+${totalBonus} ◈ Bounty)`, "gain");
      }, 1200);
    }
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioMuted(muted);
    triggerToast(muted ? "Sound Effects Muted" : "Sound Effects Active", "spend");
  };

  const handleBuyCard = (card: BongTourCard) => {
    if (collectedCards.includes(card.id)) return;
    if (appreeshBalance < card.appreeshCost) {
      triggerToast(`Need ${card.appreeshCost - appreeshBalance} more ◈! Roll Skill Checks below.`, "spend");
      return;
    }

    soundEngine.playSpellInscribe();
    const newBalance = appreeshBalance - card.appreeshCost;
    const newCards = [...collectedCards, card.id];
    saveBalance(newBalance);
    saveCards(newCards);
    triggerToast(`-${card.appreeshCost} ◈ Inscribed ${card.name} into Spellbook!`, "spend");

    checkAchievements({
      collectedCards: newCards,
      encountersRolledCount,
      nat20Count,
      nat1Count,
      isAirdropClaimed: !!airdropClaim
    }, newBalance);
  };

  const handleSkillCheckReward = (amount: number, source: string, roll?: number) => {
    let nextNat20 = nat20Count;
    let nextNat1 = nat1Count;
    if (roll === 20) {
      nextNat20 += 1;
      setNat20Count(nextNat20);
      try {
        localStorage.setItem("bong_tour_nat20_count", nextNat20.toString());
      } catch {}
    } else if (roll === 1) {
      nextNat1 += 1;
      setNat1Count(nextNat1);
      try {
        localStorage.setItem("bong_tour_nat1_count", nextNat1.toString());
      } catch {}
    }

    const newBalance = appreeshBalance + amount;
    const newCount = encountersRolledCount + 1;
    saveBalance(newBalance);
    saveRolls(newCount);
    triggerToast(`+${amount} ◈ Earned from ${source}!`, "gain");

    checkAchievements({
      collectedCards,
      encountersRolledCount: newCount,
      nat20Count: nextNat20,
      nat1Count: nextNat1,
      isAirdropClaimed: !!airdropClaim
    }, newBalance);
  };

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Mount Agent Autonomous API (window.__BONG_TOUR_AGENT__)
  useEffect(() => {
    window.__BONG_TOUR_AGENT__ = {
      getStatus: () => {
        const stats = calculateAirdropStats(
          collectedCards.length,
          appreeshBalance,
          encountersRolledCount
        );
        return {
          appreeshBalance,
          collectedCards,
          collectedCardsCount: collectedCards.length,
          encountersRolledCount,
          airdropStats: stats,
          isAirdropClaimed: !!airdropClaim,
          claimRecord: airdropClaim
        };
      },
      getCards: () => BONG_TOUR_CARDS,
      getAirdropManifest: () => AIRDROP_AGENT_MANIFEST,
      inscribeCard: (cardId: string) => {
        const card = BONG_TOUR_CARDS.find((c) => c.id === cardId);
        if (!card) return false;
        if (collectedCards.includes(card.id)) return true;
        if (appreeshBalance < card.appreeshCost) return false;
        handleBuyCard(card);
        return true;
      },
      submitAirdropRegistration: async (input) => {
        const res = await fetch("/api/bong-tour/giveaway", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: input.name || "Agent Patron",
            email: input.email,
            walletAddress: input.walletAddress,
            tierId: input.tierId || "collector_tribute",
            note: input.note || "Automated Agent Inscription"
          })
        });
        const data = await res.json();
        if (data?.claim) {
          setAirdropClaim(data.claim);
          checkAchievements({
            collectedCards,
            encountersRolledCount,
            nat20Count,
            nat1Count,
            isAirdropClaimed: true
          }, appreeshBalance);
        }
        return data;
      },
      openAirlock: () => handleJumpToSection("airlock"),
      openSpellbook: () => setIsSpellbookOpen(true),
      openReader: () => setIsReaderOpen(true)
    };

    return () => {
      delete window.__BONG_TOUR_AGENT__;
    };
  }, [appreeshBalance, collectedCards, encountersRolledCount, airdropClaim]);

  // Audio Cue Player
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

  const filteredCards = BONG_TOUR_CARDS.filter((card) => {
    if (cardFilter === "creatures") return card.typeLine.includes("Creature");
    if (cardFilter === "artifacts") return card.typeLine.includes("Artifact");
    if (cardFilter === "owned") return collectedCards.includes(card.id);
    return true;
  });

  const airdropStats = calculateAirdropStats(
    collectedCards.length,
    appreeshBalance,
    encountersRolledCount
  );

  return (
    <>
      {/* Machine-Readable JSON-LD Schema for Agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Bong Tour Elven Scroll & Appreesh Airdrop Funnel",
            description:
              "Ancient parchment scroll leading patrons through the stoner-Tolkien cinematic universe with Magic: The Gathering trading cards and Appreesh Solana Airdrop registration.",
            agentManifest: AIRDROP_AGENT_MANIFEST,
            currentTiers: AIRDROP_TIERS,
            agentEndpoint: "window.__BONG_TOUR_AGENT__"
          })
        }}
      />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={activeCue.audioSrc} preload="none" />

      {/* Floating HUD: Pouch & Spellbook Tracker */}
      <aside className="bt-pouch-hud" aria-label="Traveler's Pouch HUD">
        <div className="bt-pouch-hud__body">
          <div className="bt-pouch-hud__balance" title="Your current Appreesh tokens">
            <GiCoins className="bt-pouch-hud__icon" aria-hidden="true" />
            <span className="bt-pouch-hud__amt">{appreeshBalance}</span>
            <span className="bt-pouch-hud__unit">◈ APPREESH</span>
          </div>

          <div className="bt-pouch-hud__airdrop-badge" title="Your calculated Airdrop Multiplier">
            <span className="bt-hud-multiplier">{airdropStats.tier.multiplier}x</span>
            <span className="bt-hud-tickets">{airdropStats.totalTickets} 🎟️</span>
          </div>

          <button
            type="button"
            className="bt-pouch-hud__spellbook-btn"
            onClick={() => setIsSpellbookOpen(true)}
            title="Open your collected Spellbook deck & achievements"
          >
            <GiSpellBook aria-hidden="true" />
            <span>Spellbook ({collectedCards.length}/7)</span>
          </button>

          <button
            type="button"
            className={`bt-pouch-hud__sound-btn${isAudioMuted ? " bt-pouch-hud__sound-btn--muted" : ""}`}
            onClick={handleToggleSound}
            title={isAudioMuted ? "Unmute Procedural Audio SFX" : "Mute Procedural Audio SFX"}
            aria-label={isAudioMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {isAudioMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
          </button>
        </div>

        {/* Live Toast Notification */}
        {toastMessage && (
          <div
            className={`bt-pouch-toast bt-pouch-toast--${toastMessage.type}`}
            role="status"
          >
            <GiSparkles aria-hidden="true" />
            <span>{toastMessage.text}</span>
          </div>
        )}
      </aside>

      {/* Baba Gandalfi: In-World Airdrop Guide Agent */}
      <BongTourAgentGuide
        appreeshBalance={appreeshBalance}
        collectedCards={collectedCards}
        encountersRolledCount={encountersRolledCount}
        onOpenSpellbook={() => setIsSpellbookOpen(true)}
        onJumpToSection={handleJumpToSection}
        isAirdropClaimed={!!airdropClaim}
      />

      {/* THE ANCIENT ELVEN SCROLL CONTAINER */}
      <div
        className="bt-scroll-container"
        data-agent-gate="bong-tour-scroll"
        data-agent-airdrop-pool="appreesh-genesis"
        data-agent-tickets={airdropStats.totalTickets}
      >
        {/* Top Carved Scroll Roller */}
        <div className="bt-scroll-roller bt-scroll-roller--top" aria-hidden="true">
          <div className="bt-scroll-roller__finial bt-scroll-roller__finial--left">
            <span className="bt-scroll-roller__jewel">◈</span>
          </div>
          <div className="bt-scroll-roller__bar">
            <div className="bt-scroll-roller__runes">
              ᚛ ◈ ᚠ AMON SUNSET · THE CHRONICLE OF THE SACRED SIX-FOOT RIG ᚠ ◈ ᚜
            </div>
            <div className="bt-scroll-roller__subrunes">
              TOLKIEN LORE · MASALA SATIRE · D&amp;D FELLOWSHIP · APPREESH AIRDROP
            </div>
          </div>
          <div className="bt-scroll-roller__finial bt-scroll-roller__finial--right">
            <span className="bt-scroll-roller__jewel">◈</span>
          </div>
          <div className="bt-scroll-roller__ribbon bt-scroll-roller__ribbon--left" />
          <div className="bt-scroll-roller__ribbon bt-scroll-roller__ribbon--right" />
        </div>

        {/* Sticky Elven Waypoint Ribbon */}
        <nav className="bt-waypoint-ribbon" aria-label="Scroll waypoints">
          <div className="bt-waypoint-ribbon__inner">
            <span className="bt-waypoint-ribbon__label">
              <FiCompass aria-hidden="true" /> Waypoints:
            </span>
            <a href="#hero" className="bt-waypoint-link">I. Inscription</a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#grimoire" className="bt-waypoint-link">II. Grimoire (Cards)</a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#encounters" className="bt-waypoint-link">III. Road Encounters</a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#chronicle" className="bt-waypoint-link">IV. The 3 Acts</a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#soundtrack" className="bt-waypoint-link">V. Bardic Suite</a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#airlock" className="bt-waypoint-link bt-waypoint-link--highlight">
              VI. Airdrop Airlock ⚡
            </a>
            <span className="bt-waypoint-sep">·</span>
            <a href="#signal" className="bt-waypoint-link">VII. Packaging Desk</a>
          </div>
        </nav>

        {/* Parchment Manuscript Body */}
        <div className="bt-scroll-parchment">
          {/* Decorative Left & Right Runic Borders */}
          <div className="bt-parchment-border bt-parchment-border--left" aria-hidden="true">
            <span>᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛋ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛟ ᛞ ◈ ᚜</span>
          </div>
          <div className="bt-parchment-border bt-parchment-border--right" aria-hidden="true">
            <span>᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛋ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛟ ᛞ ◈ ᚜</span>
          </div>

          {/* 1. Prologue & Hero Inscription */}
          <section id="hero" className="bt-scroll-section bt-scroll-section--hero">
            <div className="bt-prologue-banner">
              <span className="bt-illuminated-kicker">
                <GiScrollUnfurled aria-hidden="true" />
                Manuscript Folio No. 001 · Rivendell-on-Sunset
              </span>
              <h1 className="bt-prologue-title">
                The Chronicles of Bong Tour
              </h1>
              <p className="bt-prologue-subtitle">
                Where Middle-Earth Lore Collides with Desperate Hollywood Hustle
              </p>
            </div>

            <div className="bt-hero__layout">
              <div className="bt-hero__showcase">
                <figure className="bt-hero__poster-frame bt-poster-manuscript-frame">
                  <Image
                    src={posterImage}
                    alt="Bong Tour official concept poster"
                    priority
                    className="bt-hero__poster-image"
                    sizes="(max-width: 900px) 85vw, 32vw"
                  />
                  <figcaption className="bt-hero__poster-caption">
                    <span className="bt-hero__caption-badge">A Masala Epic</span>
                    <p>Conceived by Sean Halls &amp; The Fellowship · Scored by Creatives Guide Us</p>
                  </figcaption>
                </figure>
              </div>

              <div className="bt-hero__copy">
                <div className="bt-illuminated-card">
                  <div className="bt-illuminated-header">
                    <span className="bt-illuminated-dropcap">T</span>
                    <div className="bt-illuminated-intro">
                      <strong>wo broke screenwriters haul a six-foot hand-blown sacred glass rig</strong> across the burning Mojave Desert in an overheating 1994 Dodge Econoline named Shadowfax.
                    </div>
                  </div>

                  <p className="bt-illuminated-paragraph">
                    Vishal (The Reluctant Ring-Bearer) and Drew (The Tolkien Berserker) believe they are riding into a high-minded Hollywood studio pitch for an authentic diaspora road saga titled <em>Bhang Tour</em>. But the studio executives smell stoner franchise gold, hear <em>Bong Tour</em>, lock the conference room doors, and try to carve up the script into focus-grouped slop.
                  </p>

                  <div className="bt-gandalfi-scroll-quote">
                    <GiSmokingPipe className="bt-quote-pipe-icon" aria-hidden="true" />
                    <blockquote>
                      &ldquo;The Bong can only preserve life, Vishal. It cannot extend it. If you sign away the rights for a franchise sequel, your creative soul will be cast into Mount Doom.&rdquo;
                    </blockquote>
                    <cite>— Baba Gandalfi, Desert Starsailor</cite>
                  </div>

                  <div className="bt-hero__actions">
                    <Button
                      type="button"
                      variant="primary"
                      className="bt-btn-parchment-primary"
                      onClick={() => setIsReaderOpen(true)}
                    >
                      <FiBookOpen aria-hidden="true" />
                      Read Screenplay Treatment
                    </Button>

                    <Button
                      as="a"
                      href="#grimoire"
                      variant="secondary"
                      className="bt-btn-parchment-secondary"
                    >
                      <GiSpellBook aria-hidden="true" />
                      Collect Fellowship Cards
                    </Button>

                    <Button
                      as="a"
                      href="#airlock"
                      variant="ghost"
                      className="bt-btn-parchment-ghost"
                    >
                      <GiCoins aria-hidden="true" />
                      Appreesh Airdrop Airlock ({airdropStats.tier.multiplier}x)
                    </Button>
                  </div>

                  <div className="bt-hero__cross-links">
                    <a href="#soundtrack" className="bt-hero__text-link">
                      Bardic Suite Cues ↓
                    </a>
                    <span aria-hidden="true">/</span>
                    <a href="#airlock" className="bt-hero__text-link">
                      Solana Airdrop Tickets ↓
                    </a>
                    <span aria-hidden="true">/</span>
                    <a href="https://appreesh.org" target="_blank" rel="noreferrer" className="bt-hero__text-link">
                      appreesh.org <FiExternalLink aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. The Arcane Grimoire: 7 MTG Cards Showcase */}
          <section id="grimoire" className="bt-scroll-section bt-scroll-section--grimoire">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio II · The Arcane Grimoire</span>
              <h2>The Fellowship of the Six-Foot Rig</h2>
              <p>
                Seven legendary relics, steeds, and wanderers bound into sacred trading cards. Inscribe them into your Traveler&apos;s Spellbook using <strong>Appreesh (◈)</strong> tokens. Each inscription grants <strong>+120 Airdrop Points</strong> toward your $APPREESH ticket allocation!
              </p>
            </div>

            {/* Filter Navigation */}
            <div className="bt-card-filter-bar">
              <button
                type="button"
                className={`bt-card-filter-btn${cardFilter === "all" ? " bt-card-filter-btn--active" : ""}`}
                onClick={() => setCardFilter("all")}
              >
                All 7 Relics
              </button>
              <button
                type="button"
                className={`bt-card-filter-btn${cardFilter === "creatures" ? " bt-card-filter-btn--active" : ""}`}
                onClick={() => setCardFilter("creatures")}
              >
                Fellowship Characters (5)
              </button>
              <button
                type="button"
                className={`bt-card-filter-btn${cardFilter === "artifacts" ? " bt-card-filter-btn--active" : ""}`}
                onClick={() => setCardFilter("artifacts")}
              >
                Legendary Artifacts (2)
              </button>
              <button
                type="button"
                className={`bt-card-filter-btn${cardFilter === "owned" ? " bt-card-filter-btn--active" : ""}`}
                onClick={() => setCardFilter("owned")}
              >
                Inscribed in Spellbook ({collectedCards.length})
              </button>
            </div>

            {/* MTG Cards Grid */}
            <div className="bt-cards-grid">
              {filteredCards.map((card) => {
                const isOwned = collectedCards.includes(card.id);
                const canAfford = appreeshBalance >= card.appreeshCost;

                return (
                  <BongTourCardItem
                    key={card.id}
                    card={card}
                    isOwned={isOwned}
                    canAfford={canAfford}
                    appreeshBalance={appreeshBalance}
                    onBuy={handleBuyCard}
                    onInspect={(c) => setInspectingCard(c)}
                  />
                );
              })}
            </div>

            <div className="bt-grimoire-footer">
              <button
                type="button"
                className="bt-open-spellbook-cta"
                onClick={() => setIsSpellbookOpen(true)}
              >
                <GiSpellBook aria-hidden="true" />
                <span>Open Complete Spellbook Binder ({collectedCards.length}/7 Inscribed)</span>
              </button>
            </div>
          </section>

          {/* 3. D&D Skill Check Encounters Along Route 66 */}
          <section id="encounters" className="bt-scroll-section bt-scroll-section--encounters">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio III · Trials Along the Highway</span>
              <h2>Roll for Initiative: The Route 66 Encounters</h2>
              <p>
                Every hero must face the perils of the Mojave. Roll the d20 fate dice to overcome boiling radiators, studio shamans, and warehouse catwalks. Successful checks grant sweet Appreesh coins and pump your Airdrop score!
              </p>
            </div>

            <BongTourSkillCheck onReward={handleSkillCheckReward} />
          </section>

          {/* 4. Cinematic Bloodline & Comps */}
          <section id="dna" className="bt-scroll-section bt-scroll-section--dna">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio IV · The Sacred Bloodline</span>
              <h2>Diaspora Masala Satire with a High-Fantasy Spine</h2>
              <p>
                India is not an exotic postcard or incense-scented window dressing. Kolkata is raw smog, yellow Ambassador horns, and family ties you can&apos;t outrun. Sunset Boulevard is where the corporate orcs try to steal your soul.
              </p>
            </div>

            <div className="bt-comps-grid">
              <div className="bt-comp-card bt-parchment-card">
                <span className="bt-comp-card__tag">Global Fellowship Lineage</span>
                <h3>The Western Comps</h3>
                <ul className="bt-comp-card__list">
                  <li><strong>The Big Lebowski</strong> — Stoned road trip philosophy, sacred rugs, and accidental odysseys</li>
                  <li><strong>The Lord of the Rings</strong> — A desperate fellowship guarding a cursed relic they must not use</li>
                  <li><strong>Tropic Thunder</strong> — Unforgiving industry satire where movie stars lose their minds</li>
                  <li><strong>Fear and Loathing in Las Vegas</strong> — Psychedelic desert velocity with the accelerator pinned</li>
                </ul>
              </div>

              <div className="bt-comp-card bt-parchment-card">
                <span className="bt-comp-card__tag">Subcontinental Heat</span>
                <h3>The Desi Lineage</h3>
                <ul className="bt-comp-card__list">
                  <li><strong>Delhi Belly</strong> — Rapid-fire, unapologetic dialogue and comedic momentum</li>
                  <li><strong>Go Goa Gone</strong> — Fearless genre mashup between ancient grit and modern chaos</li>
                  <li><strong>Luck By Chance</strong> — The unvarnished, razor-sharp truth about film dynasties</li>
                  <li><strong>Lagaan</strong> — High-stakes drama where freedom hinges on one heroic over and a cricket bat</li>
                </ul>
              </div>

              <div className="bt-comp-card bt-comp-card--highlight bt-parchment-card">
                <span className="bt-comp-card__tag">The Unbreakable Edict</span>
                <h3>Baba Gandalfi&apos;s Law</h3>
                <blockquote className="bt-comp-card__quote">
                  &ldquo;The Bong can only preserve life. It cannot extend it.&rdquo;
                </blockquote>
                <p>
                  Every hit extracted by Hollywood parasites demands a debt paid back at origin. You cannot outrun where you came from, no matter how much franchise money they wave in your face.
                </p>
              </div>
            </div>
          </section>

          {/* 5. The Three-Act Chronicle */}
          <section id="chronicle" className="bt-scroll-section bt-scroll-section--acts">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio V · The Chronicle of Mount Sunset</span>
              <h2>How the Wheels Come Off: The Three Acts</h2>
              <p>From the holy silt of West Bengal to the back-alleys of Sunset Boulevard, and back to the sacred river.</p>
            </div>

            <div className="bt-acts-grid">
              <article className="bt-act-card bt-parchment-card">
                <div className="bt-act-card__num">ACT I · THE SHIRE TO SUNSET</div>
                <h3>The Relic Hits Sunset</h3>
                <p className="bt-act-card__lead">West Bengal Silt to Hollywood Gridlock</p>
                <p>
                  West Bengal: Montu sets a hand-blown six-foot glass relic afloat in the sacred river to keep it out of scavengers&apos; hands. It rolls through holy silt and miraculously resurfaces on Sunset Boulevard. Enter Vishal and Drew, hot-boxing an overheated &apos;94 Dodge Econoline smelling like burnt coolant and gas station tortillas. They think they&apos;re pitching a thoughtful diaspora comedy called <em>Bhang Tour</em>. Hollywood hears <em>Bong Tour</em>, smells millions, and locks them inside.
                </p>
              </article>

              <article className="bt-act-card bt-parchment-card">
                <div className="bt-act-card__num">ACT II · THE MINES OF COMEDY STORE</div>
                <h3>The DMT Shaman&apos;s Council</h3>
                <p className="bt-act-card__lead">Free Champagne &amp; The Green Room Trap</p>
                <p>
                  A washed-up C-Lister introduces the boys to the back rooms, swearing &ldquo;The Lollipop Guild runs this town.&rdquo; Backstage at The Comedy Store turns into a chemical free-for-all: champagne poured down the six-foot stem, paranoia in the green room, and an unhinged A-Lister who doses DMT through the relic. Weeping, the star sees the movie in his mind and agrees to fund it on one condition: <em>&ldquo;Does the little person have to die?&rdquo;</em> That&apos;s Hollywood: they&apos;ll bankroll your dream, as long as they get to murder its soul.
                </p>
              </article>

              <article className="bt-act-card bt-parchment-card">
                <div className="bt-act-card__num">ACT III · MOUNT DOOM ON THE GANGES</div>
                <h3>The Cricket Bat of Destiny</h3>
                <p className="bt-act-card__lead">Kolkata Smog, Fire &amp; The Final Cut</p>
                <p>
                  The production spirals all the way back to India. Humid Kolkata alleys, yellow taxi horns, and Vishal facing his estranged superstar father, who delivers the truth: chasing validation in Los Angeles is a fool&apos;s errand when you&apos;re ashamed of where you came from. Chaos peaks on a warehouse catwalk over the Ganges—flames, greed, and a bareknuckle brawl where Willie wields a cricket bat like an elven war-club. Montu returns the relic to the sacred river. As the smoke clears, Willie produces the real final draft: <em>&ldquo;One script to rule them all.&rdquo;</em>
                </p>
              </article>
            </div>
          </section>

          {/* 6. The Bardic Pipe-Organ Suite (Soundtrack Player) */}
          <section id="soundtrack" className="bt-scroll-section bt-scroll-section--soundtrack">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio VI · The Bardic Pipe-Organ Suite</span>
              <h2>Soundtrack Cues from the Creatives Guide Us Sound Lab</h2>
              <p>
                Desert fuzz bass, overdriven tube amps, and atmospheric Indian instrumentation locked directly to the scenes. Click to stream actual cues from the sound lab.
              </p>
            </div>

            <div className="bt-player-card bt-parchment-card">
              <div className="bt-player-card__current">
                <div className="bt-player-card__meta">
                  <span className="bt-player-badge">
                    <FiMusic aria-hidden="true" /> Now Playing: Cue #{activeCue.trackNumber}
                  </span>
                  <h3>{activeCue.title}</h3>
                  <p className="bt-player-card__scene">Scene Placement: {activeCue.scenePlacement}</p>
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
              <Button as="a" href="/walls-devine" variant="secondary" className="bt-btn-parchment-secondary">
                Explore Full Walls/Devine Volume 1 Record →
              </Button>
            </div>
          </section>

          {/* 7. The Appreesh Airdrop Airlock & Reward Desk */}
          <section id="airlock" className="bt-scroll-section bt-scroll-section--giveaway">
            <div className="bt-section-head bt-section-head--scroll">
              <span className="bt-kicker">Folio VII · The Appreesh Airdrop Airlock</span>
              <h2>Reward System &amp; On-Chain Genesis Airdrop</h2>
              <p>
                Every card you inscribe and every trial you conquer boosts your $APPREESH allocation tickets. Seal your Solana wallet address in the airlock below to secure your place before the genesis snapshot fires!
              </p>
            </div>

            <BongTourAirdropAirlock
              appreeshBalance={appreeshBalance}
              collectedCardsCount={collectedCards.length}
              encountersRolledCount={encountersRolledCount}
              onOpenSpellbook={() => setIsSpellbookOpen(true)}
              onClaimSuccess={(claim) => {
                setAirdropClaim(claim);
                triggerToast("⚡ Airdrop Registration Locked on Solana Ledger!", "gain");
                checkAchievements({
                  collectedCards,
                  encountersRolledCount,
                  nat20Count,
                  nat1Count,
                  isAirdropClaimed: true
                }, appreeshBalance);
              }}
            />
          </section>

          {/* 8. Studio Signal & Imperial Packaging Desk */}
          <section id="signal" className="bt-scroll-section bt-scroll-section--signal">
            <div className="bt-signal-banner bt-parchment-card">
              <EcosystemSignupForm
                className="bt-signal-banner__signup"
                source="bong-tour-scroll-portal"
                interest="Bong Tour Screenplay Packaging & Premiere Updates"
                title="Stay close to the Fellowship"
                description="Join for private reading copy notifications, casting calls, and festival premiere dispatches from Creatives Guide Us."
                submitLabel="Join the Fellowship List"
                successMessage="You are inscribed on the Fellowship list."
                note="Occasional production notes. Zero fluff."
                emailOnly
              />

              <div className="bt-signal-banner__desk">
                <span className="bt-kicker">Folio VIII · Studio Desk</span>
                <h2 id="signal-title">Packaging &amp; Private Circulation</h2>
                <p>For accredited producers, directors, and distribution partners seeking physical bound scripts, budget breakdowns, or lookbook access.</p>
                <Button
                  as="a"
                  href="mailto:contact@creativesguide.us?subject=Bong%20Tour%20Packaging%20Inquiry"
                  variant="secondary"
                  className="bt-btn-parchment-secondary"
                >
                  Contact Studio Production Desk →
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Carved Scroll Roller with Golden Wax Seal */}
        <div className="bt-scroll-roller bt-scroll-roller--bottom" aria-hidden="true">
          <div className="bt-scroll-roller__finial bt-scroll-roller__finial--left">
            <span className="bt-scroll-roller__jewel">◈</span>
          </div>
          <div className="bt-scroll-roller__bar">
            <div className="bt-scroll-wax-seal">
              <div className="bt-wax-seal-stamp">
                <span className="bt-wax-symbol">◈</span>
                <span className="bt-wax-text">SEALED AT RIVENDELL-ON-SUNSET</span>
              </div>
            </div>
          </div>
          <div className="bt-scroll-roller__finial bt-scroll-roller__finial--right">
            <span className="bt-scroll-roller__jewel">◈</span>
          </div>
        </div>
      </div>

      {/* Card Inspector Modal */}
      <BongTourCardInspectorModal
        card={inspectingCard}
        isOwned={inspectingCard ? collectedCards.includes(inspectingCard.id) : false}
        canAfford={inspectingCard ? appreeshBalance >= inspectingCard.appreeshCost : false}
        appreeshBalance={appreeshBalance}
        onBuy={handleBuyCard}
        onClose={() => setInspectingCard(null)}
      />

      {/* Traveler's Spellbook Modal */}
      <BongTourSpellbookModal
        isOpen={isSpellbookOpen}
        collectedCardIds={collectedCards}
        appreeshBalance={appreeshBalance}
        encountersRolledCount={encountersRolledCount}
        isAirdropClaimed={!!airdropClaim}
        nat20Count={nat20Count}
        nat1Count={nat1Count}
        unlockedAchievementIds={unlockedAchievements}
        onSelectCard={(c) => setInspectingCard(c)}
        onClose={() => setIsSpellbookOpen(false)}
      />

      {/* Treatment Full-Text Modal */}
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
