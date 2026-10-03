"use client";

import { type FormEvent, useState } from "react";
import {
  FiAward,
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiLock,
  FiShield,
  FiZap
} from "react-icons/fi";
import {
  GiCoins,
  GiCrownCoin,
  GiDiceTwentyFacesTwenty,
  GiScrollUnfurled,
  GiSparkles,
  GiSpellBook
} from "react-icons/gi";

import { Button } from "@/components/ui/Button";
import {
  calculateAirdropStats,
  type AirdropTier,
  AIRDROP_TIERS
} from "@/lib/bong-tour/airdrop";

type Props = {
  appreeshBalance: number;
  collectedCardsCount: number;
  encountersRolledCount: number;
  onOpenSpellbook: () => void;
  onClaimSuccess: (claim: any) => void;
};

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

export function BongTourAirdropAirlock({
  appreeshBalance,
  collectedCardsCount,
  encountersRolledCount,
  onOpenSpellbook,
  onClaimSuccess
}: Props) {
  const [giveawayName, setGiveawayName] = useState("");
  const [giveawayEmail, setGiveawayEmail] = useState("");
  const [giveawayWallet, setGiveawayWallet] = useState("");
  const [giveawayTier, setGiveawayTier] = useState<GiveawayTier>("collector_tribute");
  const [giveawayNote, setGiveawayNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giveawayError, setGiveawayError] = useState("");
  const [giveawayClaim, setGiveawayClaim] = useState<GiveawayClaim | null>(null);

  const stats = calculateAirdropStats(
    collectedCardsCount,
    appreeshBalance,
    encountersRolledCount
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGiveawayError("");
    setIsSubmitting(true);

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
        throw new Error(data.error || "Failed to process airdrop claim.");
      }

      setGiveawayClaim(data.claim);
      onClaimSuccess(data.claim);
    } catch (err: unknown) {
      setGiveawayError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="airlock"
      className="bt-airlock-desk bt-parchment-card"
      data-agent-gate="appreesh-airdrop-airlock"
      data-agent-status={giveawayClaim ? "claimed" : "ready"}
      data-agent-tier={stats.tier.id}
      data-agent-tickets={stats.totalTickets}
      data-agent-multiplier={stats.tier.multiplier}
    >
      {/* Live Airdrop Status Header */}
      <div className="bt-airlock-dashboard">
        <div className="bt-airlock-stats-row">
          <div className="bt-stat-tile">
            <span className="bt-stat-tile__label">Current Airdrop Rank</span>
            <div className="bt-stat-tile__value bt-stat-tile__value--rank">
              <GiCrownCoin aria-hidden="true" />
              <strong>{stats.tier.name}</strong>
            </div>
            <small>{stats.tier.loreTitle}</small>
          </div>

          <div className="bt-stat-tile">
            <span className="bt-stat-tile__label">Airdrop Multiplier</span>
            <div className="bt-stat-tile__value bt-stat-tile__value--multiplier">
              <FiZap aria-hidden="true" />
              <strong>{stats.tier.multiplier}x BOOST</strong>
            </div>
            <small>Applied to all genesis distribution pools</small>
          </div>

          <div className="bt-stat-tile bt-stat-tile--highlight">
            <span className="bt-stat-tile__label">Total $APPREESH Tickets</span>
            <div className="bt-stat-tile__value bt-stat-tile__value--tickets">
              <GiCoins aria-hidden="true" />
              <strong>{stats.totalTickets}</strong>
            </div>
            <small>{stats.activityScore} activity pts + {stats.tier.baseTickets} base</small>
          </div>
        </div>

        {/* Next Tier Upgrade Callout */}
        {stats.nextTier ? (
          <div className="bt-airlock-progress-callout">
            <div className="bt-progress-callout-text">
              <GiSparkles aria-hidden="true" />
              <span>
                Inscribe <strong>{stats.cardsNeededForNextTier} more card(s)</strong> in the Grimoire to unlock{" "}
                <strong>{stats.nextTier.name} ({stats.nextTier.multiplier}x Multiplier)!</strong>
              </span>
            </div>
            <button
              type="button"
              className="bt-view-spellbook-link"
              onClick={onOpenSpellbook}
            >
              Open Spellbook ({collectedCardsCount}/7) →
            </button>
          </div>
        ) : (
          <div className="bt-airlock-progress-callout bt-airlock-progress-callout--max">
            <GiCrownCoin aria-hidden="true" />
            <span>
              👑 <strong>MAXIMUM ARCH-MAGE TIER ACHIEVED:</strong> You hold the full 3.5x Multiplier for the Appreesh Genesis Airdrop!
            </span>
          </div>
        )}
      </div>

      {/* Form or Verified Certificate */}
      {!giveawayClaim ? (
        <form onSubmit={handleSubmit} className="bt-airlock-form">
          <div className="bt-airlock-intro">
            <h3>Enter the Appreesh Solana Airdrop Airlock</h3>
            <p>
              Inscribe your Solana wallet address and email into the immutable ledger. When the genesis snapshot fires, your accumulated <strong>{stats.totalTickets} $APPREESH Tickets</strong> ({stats.tier.multiplier}x multiplier) will be dispatched directly to your wallet with zero corporate studio intermediaries.
            </p>
          </div>

          {/* Allocation Tiers Selection */}
          <div className="bt-giveaway-tiers">
            <label className={`bt-tier-pill${giveawayTier === "collector_tribute" ? " bt-tier-pill--active" : ""}`}>
              <input
                type="radio"
                name="airdropTier"
                value="collector_tribute"
                checked={giveawayTier === "collector_tribute"}
                onChange={() => setGiveawayTier("collector_tribute")}
              />
              <strong>◈ On-Chain Appreesh Airdrop Stamp</strong>
              <small>Guaranteed $APPREESH token drop pool entry + digital provenance mark via appreesh.org</small>
            </label>

            <label className={`bt-tier-pill${giveawayTier === "script_giveaway" ? " bt-tier-pill--active" : ""}`}>
              <input
                type="radio"
                name="airdropTier"
                value="script_giveaway"
                checked={giveawayTier === "script_giveaway"}
                onChange={() => setGiveawayTier("script_giveaway")}
              />
              <strong>Hand-Bound Physical First Edition</strong>
              <small>Numbered working draft script with creator margin notes (50 pressed copies)</small>
            </label>

            <label className={`bt-tier-pill${giveawayTier === "premiere_pass" ? " bt-tier-pill--active" : ""}`}>
              <input
                type="radio"
                name="airdropTier"
                value="premiere_pass"
                checked={giveawayTier === "premiere_pass"}
                onChange={() => setGiveawayTier("premiere_pass")}
              />
              <strong>Festival Premiere &amp; VIP Suite</strong>
              <small>Premiere screening pass + booth drinks with the filmmakers and sound lab crew</small>
            </label>
          </div>

          {/* Field Inputs */}
          <div className="bt-form-grid">
            <div className="bt-form-group">
              <label htmlFor="airlock-email">Email Address (Required for Claim Verification)</label>
              <input
                id="airlock-email"
                type="email"
                required
                value={giveawayEmail}
                onChange={(e) => setGiveawayEmail(e.target.value)}
                placeholder="you@domain.com"
                className="bt-input"
                data-agent-field="email"
              />
            </div>

            <div className="bt-form-group">
              <label htmlFor="airlock-name">Patron Name or Handle</label>
              <input
                id="airlock-name"
                type="text"
                value={giveawayName}
                onChange={(e) => setGiveawayName(e.target.value)}
                placeholder="e.g. Vishal / Patron / Agent"
                className="bt-input"
                data-agent-field="name"
              />
            </div>

            <div className="bt-form-group bt-form-group--full">
              <label htmlFor="airlock-wallet">
                Solana Wallet Address <span className="bt-optional">(Required for on-chain $APPREESH airdrop delivery)</span>
              </label>
              <input
                id="airlock-wallet"
                type="text"
                value={giveawayWallet}
                onChange={(e) => setGiveawayWallet(e.target.value)}
                placeholder="Base58 Solana public key (e.g. 7xKX...)"
                className="bt-input bt-input--mono"
                data-agent-field="wallet"
              />
              <span className="bt-wallet-help-text">
                Your wallet receives direct token drop tickets. If you don&apos;t have one yet, leave blank for email reservation.
              </span>
            </div>

            <div className="bt-form-group bt-form-group--full">
              <label htmlFor="airlock-note">Message to the Writers&apos; Van (Optional)</label>
              <textarea
                id="airlock-note"
                value={giveawayNote}
                onChange={(e) => setGiveawayNote(e.target.value)}
                placeholder="Leave notes, pitch feedback, or Quenya poetry..."
                rows={2}
                className="bt-input"
              />
            </div>
          </div>

          {giveawayError && <p className="bt-form-error">{giveawayError}</p>}

          <div className="bt-airlock-footer">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bt-btn-parchment-primary bt-btn-airlock-submit"
              data-agent-action="submit-airdrop"
            >
              {isSubmitting ? "Locking in on-chain…" : `Inscribe ${stats.totalTickets} $APPREESH Tickets to Ledger →`}
            </Button>

            <span className="bt-giveaway-secure">
              <FiShield aria-hidden="true" />
              Verified Solana Anchor Protocol · Zero studio middlemen · Immutable at <a href="https://appreesh.org" target="_blank" rel="noreferrer">appreesh.org</a>
            </span>
          </div>
        </form>
      ) : (
        <div className="bt-claim-certificate" data-agent-claim-id={giveawayClaim.claimId}>
          <div className="bt-certificate__header">
            <div className="bt-certificate__stamp">
              <FiCheck aria-hidden="true" />
              CONFIRMED ON APPREESH LEDGER
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
                <dt>Airdrop Rank &amp; Boost</dt>
                <dd className="bt-gold-text">{stats.tier.name} · {stats.tier.multiplier}x Multiplier</dd>
              </div>
              <div>
                <dt>Airdrop Tickets Inscribed</dt>
                <dd><strong>{stats.totalTickets} $APPREESH Tickets</strong></dd>
              </div>
              <div>
                <dt>Direct Ledger Gateway</dt>
                <dd>
                  <a href={giveawayClaim.appreeshProtocolUrl} target="_blank" rel="noreferrer">
                    appreesh.org (Solana Protocol) <FiExternalLink aria-hidden="true" />
                  </a>
                </dd>
              </div>
              {giveawayClaim.walletAddress && (
                <div>
                  <dt>Target Solana Wallet</dt>
                  <dd className="bt-mono">{giveawayClaim.walletAddress}</dd>
                </div>
              )}
              <div>
                <dt>Verification SHA-256</dt>
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
              className="bt-btn-parchment-primary"
            >
              <FiDownload aria-hidden="true" />
              Download Verified Screenplay Treatment
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setGiveawayClaim(null)}
            >
              Register Another Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
