"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiInfo,
  FiMaximize2,
  FiMinimize2,
  FiSend,
  FiZap
} from "react-icons/fi";
import {
  GiCoins,
  GiCrownCoin,
  GiDiceTwentyFacesTwenty,
  GiScrollUnfurled,
  GiSmokingPipe,
  GiSparkles,
  GiSpellBook,
  GiWizardFace
} from "react-icons/gi";

import {
  calculateAirdropStats,
  type AirdropTier,
  AIRDROP_AGENT_MANIFEST
} from "@/lib/bong-tour/airdrop";
import { BONG_TOUR_CARDS, type BongTourCard } from "@/lib/bong-tour/cards";

type Props = {
  appreeshBalance: number;
  collectedCards: string[];
  encountersRolledCount: number;
  onOpenSpellbook: () => void;
  onJumpToSection: (sectionId: string) => void;
  isAirdropClaimed: boolean;
};

type Message = {
  id: string;
  sender: "gandalfi" | "traveler";
  text: string;
  action?: {
    label: string;
    targetSection?: string;
    onClick?: () => void;
  };
};

export function BongTourAgentGuide({
  appreeshBalance,
  collectedCards,
  encountersRolledCount,
  onOpenSpellbook,
  onJumpToSection,
  isAirdropClaimed
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const airdropStats = calculateAirdropStats(
    collectedCards.length,
    appreeshBalance,
    encountersRolledCount
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      sender: "gandalfi",
      text: "Hail, mortal traveler! I am Baba Gandalfi, Astral Starsailor and your guide through the Mojave ether. Hollywood suits want to steal your creative soul, but here on the sacred river, we turn your taste into sovereign $APPREESH airdrop tickets. Shall I walk thee through the funnel?"
    }
  ]);

  // Determine current funnel step
  useEffect(() => {
    if (isAirdropClaimed) {
      setActiveStep(4);
    } else if (encountersRolledCount > 0) {
      setActiveStep(3);
    } else if (collectedCards.length > 1) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  }, [collectedCards.length, encountersRolledCount, isAirdropClaimed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleUserPrompt = (promptText: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "traveler",
      text: promptText
    };

    let replyText = "";
    let actionItem: Message["action"] | undefined = undefined;

    if (promptText.includes("Walk me through") || promptText.includes("funnel")) {
      replyText = `Listen well! The Airdrop Funnel has 4 simple rites:
1. Pouch Initialization: You hold ${appreeshBalance} ◈ Appreesh.
2. Inscribe Cards: Each Magic card grants +120 airdrop points.
3. Highway Trials: Roll the d20 at Barstow for coin bounties.
4. Airlock Entry: Inscribe your Solana wallet at the bottom to secure your ${airdropStats.totalTickets} $APPREESH tickets at a ${airdropStats.tier.multiplier}x multiplier!`;
      actionItem = {
        label: "Jump to Airdrop Airlock ↓",
        targetSection: "airlock",
        onClick: () => onJumpToSection("airlock")
      };
    } else if (promptText.includes("Which card") || promptText.includes("recommend")) {
      const uncollected = BONG_TOUR_CARDS.filter((c) => !collectedCards.includes(c.id));
      if (uncollected.length === 0) {
        replyText =
          "Thou hast assembled all seven relics! Thou art already the Grand Arch-Mage of the Six-Foot Rig with a 3.5x maximum multiplier!";
      } else {
        const next = uncollected[0];
        replyText = `I recommend ${next.name} (${next.subtitle}). It costs ${next.appreeshCost} ◈ and will advance thee toward the ${airdropStats.nextTier?.name ?? "next"} tier!`;
        actionItem = {
          label: "View Cards in Grimoire",
          targetSection: "grimoire",
          onClick: () => onJumpToSection("grimoire")
        };
      }
    } else if (promptText.includes("Multiplier") || promptText.includes("Score")) {
      replyText = `Current Status:
• Tier: ${airdropStats.tier.name} (${airdropStats.tier.loreTitle})
• Multiplier: ${airdropStats.tier.multiplier}x
• Total Tickets: ${airdropStats.totalTickets} $APPREESH
${
  airdropStats.nextTier
    ? `• Need ${airdropStats.cardsNeededForNextTier} more card(s) to unlock ${airdropStats.nextTier.name} (${airdropStats.nextTier.multiplier}x)!`
    : "• You are at the Maximum Arch-Mage 3.5x Multiplier!"
}`;
      actionItem = {
        label: "View Spellbook Binder",
        onClick: onOpenSpellbook
      };
    } else if (promptText.includes("Solana") || promptText.includes("Airlock")) {
      replyText =
        "The studio gatekeepers cannot touch the Solana blockchain! Enter your public key and email in the Airlock below. Every card in your spellbook stamps your on-chain priority.";
      actionItem = {
        label: "Open Airdrop Airlock Form ↓",
        targetSection: "airlock",
        onClick: () => onJumpToSection("airlock")
      };
    } else if (promptText.includes("six feet tall") || promptText.includes("why")) {
      replyText =
        "Why is the rig six feet tall? Because five feet is an amateur novelty, and seven feet won’t clear the ceiling of an Econoline van! Montu blew it in secret on the banks of the Ganges to hold enough sacred water to outlast Hollywood’s longest executive pitch meeting.";
    } else {
      replyText = `The stars echo thy question: "${promptText}". Remember Baba Gandalfi's Law: The Bong can only preserve life; it cannot extend it. Inscribe thy cards, roll thy fate, and seal thy wallet in the ledger!`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: `gandalfi-${Date.now()}`,
        sender: "gandalfi",
        text: replyText,
        action: actionItem
      }
    ]);
  };

  return (
    <>
      {/* Floating Minimized Guide Badge */}
      {!isOpen && (
        <button
          type="button"
          className="bt-agent-floating-badge"
          onClick={() => setIsOpen(true)}
          aria-label="Open Baba Gandalfi Airdrop Guide Agent"
          title="Click to have Baba Gandalfi walk you through the Appreesh Airdrop Funnel"
        >
          <div className="bt-agent-avatar-ring">
            <GiWizardFace className="bt-agent-avatar-icon" aria-hidden="true" />
            <span className="bt-agent-smoke-pulse" aria-hidden="true" />
          </div>
          <div className="bt-agent-badge-text">
            <strong>Baba Gandalfi</strong>
            <small>Airdrop Guide ({airdropStats.tier.multiplier}x Multiplier)</small>
          </div>
          <span className="bt-agent-badge-cta">Guide Me ⚡</span>
        </button>
      )}

      {/* Expanded Interactive Agent Dialog Window */}
      {isOpen && (
        <aside
          className={`bt-agent-guide-window${isMinimized ? " bt-agent-guide-window--minimized" : ""}`}
          aria-label="Baba Gandalfi Airdrop Companion"
        >
          {/* Header Bar */}
          <header className="bt-agent-guide-header">
            <div className="bt-agent-header-meta">
              <div className="bt-agent-avatar-small">
                <GiWizardFace aria-hidden="true" />
              </div>
              <div>
                <h3>Baba Gandalfi</h3>
                <span className="bt-agent-status-tag">
                  <GiSmokingPipe aria-hidden="true" /> Astral Airdrop Shepherd · Online
                </span>
              </div>
            </div>

            <div className="bt-agent-window-controls">
              <button
                type="button"
                className="bt-agent-ctrl-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Expand agent window" : "Minimize agent window"}
              >
                {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
              </button>
              <button
                type="button"
                className="bt-agent-ctrl-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close agent guide"
              >
                ✕
              </button>
            </div>
          </header>

          {!isMinimized && (
            <>
              {/* Funnel Progress Tracker Ribbon */}
              <div className="bt-agent-funnel-tracker">
                <div className="bt-agent-funnel-steps">
                  <div
                    className={`bt-funnel-step${activeStep >= 1 ? " bt-funnel-step--completed" : ""}`}
                    title="Step 1: Pouch Funded (500 ◈)"
                  >
                    <span>1. Pouch</span>
                    <FiCheckCircle aria-hidden="true" />
                  </div>
                  <div className="bt-funnel-arrow">→</div>
                  <div
                    className={`bt-funnel-step${activeStep >= 2 ? " bt-funnel-step--completed" : ""}`}
                    title="Step 2: Inscribe Cards in Grimoire"
                  >
                    <span>2. Cards ({collectedCards.length}/7)</span>
                    {activeStep >= 2 && <FiCheckCircle aria-hidden="true" />}
                  </div>
                  <div className="bt-funnel-arrow">→</div>
                  <div
                    className={`bt-funnel-step${activeStep >= 3 ? " bt-funnel-step--completed" : ""}`}
                    title="Step 3: Route 66 Skill Checks"
                  >
                    <span>3. Rolls ({encountersRolledCount})</span>
                    {activeStep >= 3 && <FiCheckCircle aria-hidden="true" />}
                  </div>
                  <div className="bt-funnel-arrow">→</div>
                  <div
                    className={`bt-funnel-step${isAirdropClaimed ? " bt-funnel-step--completed" : " bt-funnel-step--active"}`}
                    title="Step 4: Seal in Solana Airlock"
                  >
                    <span>4. Airlock</span>
                    {isAirdropClaimed && <FiCheckCircle aria-hidden="true" />}
                  </div>
                </div>

                {/* Score & Tier Capsule */}
                <div className="bt-agent-score-capsule">
                  <span className="bt-capsule-tier">{airdropStats.tier.name}</span>
                  <span className="bt-capsule-multiplier">{airdropStats.tier.multiplier}x Multiplier</span>
                  <span className="bt-capsule-tickets">
                    🎟️ <strong>{airdropStats.totalTickets}</strong> $APPREESH Tickets
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="bt-agent-chat-stream">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`bt-chat-bubble bt-chat-bubble--${m.sender}`}
                  >
                    <p>{m.text}</p>
                    {m.action && (
                      <button
                        type="button"
                        className="bt-chat-action-btn"
                        onClick={() => {
                          if (m.action?.onClick) m.action.onClick();
                          if (m.action?.targetSection) onJumpToSection(m.action.targetSection);
                        }}
                      >
                        <span>{m.action.label}</span>
                        <FiArrowRight aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips (Agent Friendly) */}
              <div className="bt-agent-prompt-chips" aria-label="Suggested questions">
                <button
                  type="button"
                  className="bt-prompt-chip"
                  onClick={() => handleUserPrompt("Walk me through qualifying for the Airdrop")}
                >
                  ⚡ Walk me through the Airdrop
                </button>
                <button
                  type="button"
                  className="bt-prompt-chip"
                  onClick={() => handleUserPrompt("Which card should I inscribe next?")}
                >
                  🎴 Which card to buy?
                </button>
                <button
                  type="button"
                  className="bt-prompt-chip"
                  onClick={() => handleUserPrompt("How do I maximize my $APPREESH Multiplier?")}
                >
                  👑 Maximize Multiplier (3.5x)
                </button>
                <button
                  type="button"
                  className="bt-prompt-chip"
                  onClick={() => handleUserPrompt("Fast-track my Solana Wallet Airlock")}
                >
                  🔑 Register Solana Wallet
                </button>
                <button
                  type="button"
                  className="bt-prompt-chip"
                  onClick={() => handleUserPrompt("Why is the rig six feet tall?")}
                >
                  📜 Why is the Rig 6ft?
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}
