"use client";

import Image from "next/image";
import { type MouseEvent, useState } from "react";
import { FiCheck, FiEye, FiLock } from "react-icons/fi";
import { GiDiceTwentyFacesTwenty, GiSparkles } from "react-icons/gi";

import type { BongTourCard } from "@/lib/bong-tour/cards";

type Props = {
  card: BongTourCard;
  isOwned: boolean;
  canAfford: boolean;
  appreeshBalance: number;
  onBuy: (card: BongTourCard) => void;
  onInspect: (card: BongTourCard) => void;
};

export function BongTourCardItem({
  card,
  isOwned,
  canAfford,
  appreeshBalance,
  onBuy,
  onInspect
}: Props) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

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
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="bt-card-wrapper">
      <div
        className={`bt-mtg-card bt-mtg-card--${card.rarity}${isOwned ? " bt-mtg-card--owned" : ""}`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onInspect(card)}
        role="button"
        tabIndex={0}
        aria-label={`View ${card.name} Magic Card`}
      >
        {/* Holographic Rainbow Foil Sheen */}
        {isOwned && (
          <div
            className="bt-mtg-card__foil-shimmer"
            style={{
              backgroundPosition: `${glarePos.x}% ${glarePos.y}%`
            }}
          />
        )}

        {/* Card Header: Name & Mana Cost */}
        <header className="bt-mtg-card__header">
          <div className="bt-mtg-card__name-block">
            <span className="bt-mtg-card__title">{card.name}</span>
            <span className="bt-mtg-card__subtitle">{card.subtitle}</span>
          </div>

          <div className="bt-mtg-card__mana">
            {card.manaPips.map((pip, idx) => (
              <span
                key={`${card.id}-pip-${idx}`}
                className={`bt-mana-pip bt-mana-pip--${pip.type}`}
                title={`${pip.type} mana`}
              >
                {pip.value}
              </span>
            ))}
          </div>
        </header>

        {/* Card Artwork Frame */}
        <div className="bt-mtg-card__art-frame">
          <Image
            src={card.artSrc}
            alt={card.name}
            width={400}
            height={300}
            className="bt-mtg-card__image"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
          />
          <div className="bt-mtg-card__art-credit">
            <span>Illus. Creatives Guide Us</span>
            <span className="bt-mtg-card__set-symbol" title="Bong Tour Fellowship Expansion">
              ◈
            </span>
          </div>
        </div>

        {/* Type Line & Rarity Badge */}
        <div className="bt-mtg-card__typeline">
          <span className="bt-mtg-card__types">{card.typeLine}</span>
          <span className={`bt-rarity-gem bt-rarity-gem--${card.rarity}`} title={`Rarity: ${card.rarity}`}>
            ◈
          </span>
        </div>

        {/* Card Rules Text Box */}
        <div className="bt-mtg-card__textbox">
          <div className="bt-mtg-card__abilities">
            {card.abilities.map((ability, idx) => (
              <p key={`${card.id}-ab-${idx}`} className="bt-mtg-card__ability">
                {ability.cost && <strong className="bt-ability-cost">[{ability.cost}] </strong>}
                {ability.name && <strong className="bt-ability-name">{ability.name} — </strong>}
                <span>{ability.text}</span>
              </p>
            ))}
          </div>

          <hr className="bt-mtg-card__divider" />

          <p className="bt-mtg-card__flavor">{card.flavorText}</p>

          {/* Power / Toughness Box */}
          {card.powerToughness && (
            <div className="bt-mtg-card__pt" title="Power / Toughness">
              {card.powerToughness}
            </div>
          )}

          {/* Authentic MTG Hologram Oval Stamp */}
          <div className="bt-mtg-card__holo-stamp" title="Authentic Fellowship Inscription">
            <span />
          </div>
        </div>

        {/* Rarity & Collector Line */}
        <footer className="bt-mtg-card__footer">
          <span>BT · EN · {card.dndClass}</span>
          <span>{card.lotrEquivalent}</span>
        </footer>
      </div>

      {/* Card Action Controls */}
      <div className="bt-card-actions">
        {isOwned ? (
          <button
            type="button"
            className="bt-card-btn bt-card-btn--owned"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(card);
            }}
          >
            <FiCheck aria-hidden="true" />
            <span>Inscribed in Spellbook</span>
            <FiEye aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className={`bt-card-btn bt-card-btn--buy${!canAfford ? " bt-card-btn--disabled" : ""}`}
            disabled={!canAfford}
            onClick={(e) => {
              e.stopPropagation();
              onBuy(card);
            }}
          >
            {canAfford ? (
              <>
                <GiSparkles aria-hidden="true" />
                <span>Inscribe ({card.appreeshCost} ◈)</span>
              </>
            ) : (
              <>
                <FiLock aria-hidden="true" />
                <span>Needs {card.appreeshCost} ◈ (Roll Below)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
