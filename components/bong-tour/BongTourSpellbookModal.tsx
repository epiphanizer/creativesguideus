"use client";

import Image from "next/image";
import { useState } from "react";
import { FiAward, FiCheck, FiLock, FiX } from "react-icons/fi";
import { GiCoins, GiCrownCoin, GiSparkles, GiSpellBook } from "react-icons/gi";

import { BONG_TOUR_ACHIEVEMENTS } from "@/lib/bong-tour/achievements";
import { BONG_TOUR_CARDS, type BongTourCard } from "@/lib/bong-tour/cards";

type Props = {
  isOpen: boolean;
  collectedCardIds: string[];
  appreeshBalance: number;
  encountersRolledCount?: number;
  isAirdropClaimed?: boolean;
  nat20Count?: number;
  nat1Count?: number;
  unlockedAchievementIds?: string[];
  onSelectCard: (card: BongTourCard) => void;
  onClose: () => void;
};

export function BongTourSpellbookModal({
  isOpen,
  collectedCardIds,
  appreeshBalance,
  encountersRolledCount = 0,
  isAirdropClaimed = false,
  nat20Count = 0,
  nat1Count = 0,
  unlockedAchievementIds = [],
  onSelectCard,
  onClose
}: Props) {
  const [activeTab, setActiveTab] = useState<"binder" | "trophies">("binder");
  const [filter, setFilter] = useState<"all" | "collected" | "uncollected">("all");

  if (!isOpen) return null;

  const totalCards = BONG_TOUR_CARDS.length;
  const ownedCount = collectedCardIds.length;
  const isMasterOfRig = ownedCount === totalCards;
  const progressPercent = Math.round((ownedCount / totalCards) * 100);

  const displayedCards = BONG_TOUR_CARDS.filter((card) => {
    const isOwned = collectedCardIds.includes(card.id);
    if (filter === "collected") return isOwned;
    if (filter === "uncollected") return !isOwned;
    return true;
  });

  return (
    <div className="bt-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bt-spellbook-sheet" onClick={(e) => e.stopPropagation()}>
        <header className="bt-spellbook-header">
          <div className="bt-spellbook-title-block">
            <span className="bt-kicker">
              <GiSpellBook aria-hidden="true" />
              Fellowship Grimoire
            </span>
            <h2>The Traveler&apos;s Spellbook &amp; Card Binder</h2>
            <p>
              Ancient cards discovered along Route 66 and the sacred river. Inscribe all seven relics to unlock the title of Arch-Mage of the Six-Foot Rig.
            </p>
          </div>

          <button
            type="button"
            className="bt-modal-close-btn"
            onClick={onClose}
            aria-label="Close spellbook"
          >
            <FiX />
          </button>
        </header>

        {/* Progress & Pouch Bar */}
        <div className="bt-spellbook-status-bar">
          <div className="bt-pouch-pill">
            <GiCoins aria-hidden="true" />
            <span>Pouch: <strong>{appreeshBalance} ◈ Appreesh</strong></span>
          </div>

          <div className="bt-progress-wrapper">
            <div className="bt-progress-label">
              <span>Collection Progress: <strong>{ownedCount} of {totalCards} Relics Inscribed</strong></span>
              <span>{progressPercent}%</span>
            </div>
            <div className="bt-progress-bar-bg">
              <div
                className="bt-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Arch-Mage Victory Banner */}
        {isMasterOfRig && (
          <div className="bt-archmage-banner">
            <GiCrownCoin className="bt-archmage-icon" aria-hidden="true" />
            <div>
              <h3>👑 GRAND ARCH-MAGE OF THE APPREESH LEDGER</h3>
              <p>You have assembled all seven relics of the Fellowship. The One Rig is bound in your spellbook forever.</p>
            </div>
          </div>
        )}

        {/* Top-Level Tab Switcher */}
        <div className="bt-spellbook-tabs">
          <button
            type="button"
            className={`bt-modal-tab-btn${activeTab === "binder" ? " bt-modal-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("binder")}
          >
            <GiSpellBook aria-hidden="true" />
            <span>Card Binder ({ownedCount}/7)</span>
          </button>
          <button
            type="button"
            className={`bt-modal-tab-btn${activeTab === "trophies" ? " bt-modal-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("trophies")}
          >
            <FiAward aria-hidden="true" />
            <span>Deeds &amp; Trophies ({unlockedAchievementIds.length}/{BONG_TOUR_ACHIEVEMENTS.length})</span>
          </button>
        </div>

        {activeTab === "binder" ? (
          <>
            {/* Filter Controls */}
            <div className="bt-spellbook-filters">
              <button
                type="button"
                className={`bt-filter-pill${filter === "all" ? " bt-filter-pill--active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Relics ({totalCards})
              </button>
              <button
                type="button"
                className={`bt-filter-pill${filter === "collected" ? " bt-filter-pill--active" : ""}`}
                onClick={() => setFilter("collected")}
              >
                Inscribed ({ownedCount})
              </button>
              <button
                type="button"
                className={`bt-filter-pill${filter === "uncollected" ? " bt-filter-pill--active" : ""}`}
                onClick={() => setFilter("uncollected")}
              >
                Missing ({totalCards - ownedCount})
              </button>
            </div>

            {/* Card Grid in Spellbook */}
            <div className="bt-spellbook-grid">
              {displayedCards.map((card) => {
                const isOwned = collectedCardIds.includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`bt-spellbook-slot${isOwned ? " bt-spellbook-slot--owned" : " bt-spellbook-slot--locked"}`}
                    onClick={() => {
                      onSelectCard(card);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="bt-slot-art">
                      <Image
                        src={card.artSrc}
                        alt={card.name}
                        width={220}
                        height={160}
                        className="bt-slot-image"
                      />
                      {isOwned ? (
                        <span className="bt-slot-badge bt-slot-badge--owned">
                          <FiCheck aria-hidden="true" /> Inscribed
                        </span>
                      ) : (
                        <span className="bt-slot-badge bt-slot-badge--locked">
                          <FiLock aria-hidden="true" /> {card.appreeshCost} ◈
                        </span>
                      )}
                    </div>

                    <div className="bt-slot-details">
                      <h4>{card.name}</h4>
                      <small>{card.dndClass}</small>
                      <p className="bt-slot-rarity">{card.rarity.toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bt-achievements-container">
            <div className="bt-achievements-header">
              <h3>Traveler&apos;s Deeds &amp; Feats of Valor</h3>
              <p>Conquer highway trials, assemble the fellowship, and record your name on the eternal ledger.</p>
            </div>
            <div className="bt-achievements-grid">
              {BONG_TOUR_ACHIEVEMENTS.map((ach) => {
                const isAchieved =
                  unlockedAchievementIds.includes(ach.id) ||
                  ach.condition({
                    collectedCards: collectedCardIds,
                    encountersRolledCount,
                    nat20Count,
                    nat1Count,
                    isAirdropClaimed
                  });

                return (
                  <div
                    key={ach.id}
                    className={`bt-achievement-card${isAchieved ? " bt-achievement-card--unlocked" : " bt-achievement-card--locked"}`}
                  >
                    <div className="bt-achievement-icon-wrap">
                      <span className="bt-achievement-emoji">{ach.icon}</span>
                      {isAchieved ? (
                        <span className="bt-ach-badge bt-ach-badge--unlocked">
                          <FiCheck aria-hidden="true" /> Complete
                        </span>
                      ) : (
                        <span className="bt-ach-badge bt-ach-badge--locked">
                          <FiLock aria-hidden="true" /> Locked
                        </span>
                      )}
                    </div>
                    <div className="bt-achievement-body">
                      <h4>{ach.title}</h4>
                      <p>{ach.description}</p>
                      <div className="bt-achievement-reward">
                        <GiSparkles aria-hidden="true" />
                        <span>+{ach.rewardAppreesh} ◈ Appreesh Bounty</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
