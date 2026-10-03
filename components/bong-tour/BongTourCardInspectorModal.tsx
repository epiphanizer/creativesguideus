"use client";

import Image from "next/image";
import { type MouseEvent, useState } from "react";
import { FiCheck, FiLock, FiX, FiZap } from "react-icons/fi";
import { GiDiceTwentyFacesTwenty, GiSparkles, GiSpellBook } from "react-icons/gi";

import type { BongTourCard } from "@/lib/bong-tour/cards";
import { soundEngine } from "@/lib/bong-tour/sound-effects";

type Props = {
  card: BongTourCard | null;
  isOwned: boolean;
  canAfford: boolean;
  appreeshBalance: number;
  onBuy: (card: BongTourCard) => void;
  onClose: () => void;
};

export function BongTourCardInspectorModal({
  card,
  isOwned,
  canAfford,
  appreeshBalance,
  onBuy,
  onClose
}: Props) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [activeAbilityEffect, setActiveAbilityEffect] = useState<string | null>(null);

  const handleActivateAbility = (abilityText: string, abilityName?: string) => {
    if (!card) return;
    if (card.id === "willie-paladin") {
      soundEngine.playSmite();
    } else if (card.id === "the-one-rig") {
      soundEngine.playNat20();
    } else {
      soundEngine.playSpellInscribe();
    }
    setActiveAbilityEffect(`${abilityName || "Ability"} Activated: ${abilityText}`);
  };

  if (!card) return null;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="bt-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bt-inspector-sheet" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="bt-modal-close-btn"
          onClick={onClose}
          aria-label="Close inspector"
        >
          <FiX />
        </button>

        <div className="bt-inspector-layout">
          {/* Card Presentation (Large 3D Tilt) */}
          <div className="bt-inspector-card-col">
            <div
              className={`bt-mtg-card bt-mtg-card--large bt-mtg-card--${card.rarity}${isOwned ? " bt-mtg-card--owned" : ""}`}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {isOwned && (
                <div
                  className="bt-mtg-card__foil-shimmer"
                  style={{
                    backgroundPosition: `${glarePos.x}% ${glarePos.y}%`
                  }}
                />
              )}

              <header className="bt-mtg-card__header">
                <div className="bt-mtg-card__name-block">
                  <span className="bt-mtg-card__title">{card.name}</span>
                  <span className="bt-mtg-card__subtitle">{card.subtitle}</span>
                </div>
                <div className="bt-mtg-card__mana">
                  {card.manaPips.map((pip, idx) => (
                    <span
                      key={`modal-${card.id}-pip-${idx}`}
                      className={`bt-mana-pip bt-mana-pip--${pip.type}`}
                    >
                      {pip.value}
                    </span>
                  ))}
                </div>
              </header>

              <div className="bt-mtg-card__art-frame">
                <Image
                  src={card.artSrc}
                  alt={card.name}
                  width={500}
                  height={380}
                  priority
                  className="bt-mtg-card__image"
                />
                <div className="bt-mtg-card__art-credit">
                  <span>Illus. Creatives Guide Us</span>
                  <span className="bt-mtg-card__set-symbol">◈</span>
                </div>
              </div>

              <div className="bt-mtg-card__typeline">
                <span className="bt-mtg-card__types">{card.typeLine}</span>
                <span className={`bt-rarity-gem bt-rarity-gem--${card.rarity}`}>◈</span>
              </div>

              <div className="bt-mtg-card__textbox">
                <div className="bt-mtg-card__abilities">
                  {card.abilities.map((ability, idx) => (
                    <p key={`modal-ab-${idx}`} className="bt-mtg-card__ability">
                      {ability.cost && <strong className="bt-ability-cost">[{ability.cost}] </strong>}
                      {ability.name && <strong className="bt-ability-name">{ability.name} — </strong>}
                      <span>{ability.text}</span>
                    </p>
                  ))}
                </div>

                <hr className="bt-mtg-card__divider" />
                <p className="bt-mtg-card__flavor">{card.flavorText}</p>

                {card.powerToughness && (
                  <div className="bt-mtg-card__pt">{card.powerToughness}</div>
                )}
                <div className="bt-mtg-card__holo-stamp"><span /></div>
              </div>
            </div>

            <p className="bt-inspector-hint">Hover or drag across the card to catch the holographic foil sheen</p>
          </div>

          {/* Lore & Stats Sidebar */}
          <div className="bt-inspector-info-col">
            <div className="bt-inspector-header">
              <span className="bt-kicker">Relic Specification</span>
              <h2>{card.name}</h2>
              <p className="bt-inspector-quote">&ldquo;{card.subtitle}&rdquo;</p>
            </div>

            <div className="bt-dnd-stat-block">
              <h3>
                <GiDiceTwentyFacesTwenty aria-hidden="true" />
                D&amp;D Character Sheet
              </h3>
              <dl className="bt-dnd-stats">
                <div>
                  <dt>Class &amp; Level</dt>
                  <dd>{card.dndClass}</dd>
                </div>
                <div>
                  <dt>Moral Alignment</dt>
                  <dd>{card.alignment}</dd>
                </div>
                <div>
                  <dt>LOTR Counterpart</dt>
                  <dd className="bt-gold-text">{card.lotrEquivalent}</dd>
                </div>
                <div>
                  <dt>Rarity Tier</dt>
                  <dd className="bt-capitalize">{card.rarity} Inscription</dd>
                </div>
                <div>
                  <dt>Mana Casting Cost</dt>
                  <dd>{card.manaCost}</dd>
                </div>
              </dl>
            </div>

            <div className="bt-inspector-lore">
              <h3>From the Writers&apos; Van Margins</h3>
              <p>{card.flavorText}</p>
            </div>

            {/* Signature Spell Casting & Interactivity */}
            <div className="bt-inspector-abilities-cast">
              <h3>
                <FiZap aria-hidden="true" />
                Activate Signature Spells
              </h3>
              <div className="bt-ability-buttons">
                {card.abilities.map((ab, idx) => (
                  <button
                    key={`cast-btn-${idx}`}
                    type="button"
                    className="bt-cast-spell-btn"
                    onClick={() => handleActivateAbility(ab.text, ab.name)}
                  >
                    <GiSparkles aria-hidden="true" />
                    <span>Cast {ab.name || `Ability #${idx + 1}`}</span>
                  </button>
                ))}
              </div>

              {activeAbilityEffect && (
                <div className="bt-ability-cast-result" role="status">
                  <GiSparkles aria-hidden="true" />
                  <p>{activeAbilityEffect}</p>
                </div>
              )}
            </div>

            <div className="bt-inspector-buy-tray">
              {isOwned ? (
                <div className="bt-owned-banner">
                  <FiCheck aria-hidden="true" />
                  <div>
                    <strong>Inscribed in your Spellbook</strong>
                    <small>Holographic foil unlocked. Permanent ledger record.</small>
                  </div>
                </div>
              ) : (
                <div className="bt-buy-interface">
                  <div className="bt-buy-meta">
                    <span className="bt-price-tag">
                      <GiSparkles aria-hidden="true" />
                      Cost: {card.appreeshCost} ◈ Appreesh
                    </span>
                    <span className="bt-balance-tag">
                      Your Pouch: {appreeshBalance} ◈
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`bt-inspector-buy-btn${!canAfford ? " bt-card-btn--disabled" : ""}`}
                    disabled={!canAfford}
                    onClick={() => onBuy(card)}
                  >
                    {canAfford ? (
                      <>
                        <GiSpellBook aria-hidden="true" />
                        <span>Inscribe Card to Spellbook ({card.appreeshCost} ◈)</span>
                      </>
                    ) : (
                      <>
                        <FiLock aria-hidden="true" />
                        <span>Need {card.appreeshCost - appreeshBalance} more ◈ (Roll Skill Checks!)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
