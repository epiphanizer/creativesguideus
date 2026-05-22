"use client";

import { createPortal } from "react-dom";
import { type FormEvent, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import type { EcosystemRewardDefinition } from "@/lib/ecosystem/reward-catalog";
import { trackAnalyticsEvent } from "@/lib/firebase/analytics";
import { createEcosystemRewardClaim } from "@/lib/firebase/ecosystem-reward-claims";

type EcosystemRewardClaimCardProps = {
  reward: EcosystemRewardDefinition;
  source: string;
  unlocked: boolean;
  className?: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function EcosystemRewardClaimCard({ reward, source, unlocked, className }: EcosystemRewardClaimCardProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [airlockOpen, setAirlockOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [collectorId, setCollectorId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const airlockTitleId = useId();
  const rewardAnalyticsParams = {
    reward_id: reward.id,
    reward_type: reward.rewardType,
    chapter: reward.chapter,
    source,
    distribution_mode: reward.airdrop ? "airdrop" : "direct"
  } as const;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!airlockOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAirlockOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [airlockOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmissionState("submitting");
    setFeedbackMessage("");
    void trackAnalyticsEvent("reward_claim_attempt", rewardAnalyticsParams);

    try {
      await createEcosystemRewardClaim({
        rewardId: reward.id,
        rewardLabel: reward.rewardLabel,
        rewardType: reward.rewardType,
        chapter: reward.chapter,
        source,
        email,
        collectorId,
        walletAddress,
        airdropKey: reward.airdrop ? reward.id : undefined,
        maxClaimsPerWallet: reward.airdrop?.maxClaimsPerWallet
      });

      setEmail("");
      setCollectorId("");
      setWalletAddress("");
      setSubmissionState("success");
      setFeedbackMessage(reward.successMessage);
      setAirlockOpen(false);
      void trackAnalyticsEvent("reward_claim_success", rewardAnalyticsParams);
    } catch (error) {
      setSubmissionState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Could not log the reward claim.");
      void trackAnalyticsEvent("reward_claim_error", {
        ...rewardAnalyticsParams,
        error_message: error instanceof Error ? error.message : "unknown_error"
      });
    }
  }

  function handleOpenAirlock() {
    setAirlockOpen(true);
    void trackAnalyticsEvent("reward_airlock_open", rewardAnalyticsParams);
  }

  function renderClaimForm(modal = false) {
    return (
      <form className="wd-signup__form wd-reward-claim__form" onSubmit={handleSubmit} aria-busy={submissionState === "submitting"}>
        <div className="wd-signup__split wd-reward-claim__split">
          <label className="wd-signup__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required={!collectorId.trim() && !walletAddress.trim()}
              disabled={submissionState === "submitting"}
            />
          </label>

          <label className="wd-signup__field">
            <span>Collector ID</span>
            <input
              type="text"
              name="collectorId"
              value={collectorId}
              onChange={(event) => setCollectorId(event.target.value)}
              placeholder="Optional if you already have one"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required={!email.trim() && !walletAddress.trim()}
              disabled={submissionState === "submitting"}
            />
          </label>
        </div>

        {reward.airdrop ? (
          <label className="wd-signup__field wd-reward-claim__wallet-field">
            <span>{reward.airdrop.walletLabel}</span>
            <input
              type="text"
              name="walletAddress"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              placeholder={reward.airdrop.walletPlaceholder}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={submissionState === "submitting"}
            />
          </label>
        ) : null}

        <div className="wd-signup__actions wd-reward-claim__actions">
          <Button type="submit" variant="primary" size="sm" className="wd-signup__submit" disabled={submissionState === "submitting"}>
            {submissionState === "submitting" ? (reward.airdrop ? "Opening..." : "Routing...") : reward.submitLabel}
          </Button>
          <p className="wd-signup__note">{reward.airdrop?.walletHelp ?? reward.formNote}</p>
        </div>

        {feedbackMessage ? (
          <p className={cx("wd-signup__feedback", submissionState === "error" && "wd-signup__feedback--error")} aria-live="polite">
            {feedbackMessage}
          </p>
        ) : null}

        {modal ? <p className="wd-reward-claim__airlock-footnote">{reward.formNote}</p> : null}
      </form>
    );
  }

  return (
    <>
      <section className={cx("wd-reward-claim", unlocked && "wd-reward-claim--unlocked", className)} aria-label={reward.claimTitle}>
        <p className="wd-reward-claim__eyebrow">{unlocked ? reward.headline : "Reward locked"}</p>
        <h3>{unlocked ? reward.claimTitle : "Locked until the challenge lands"}</h3>
        <p>{unlocked ? reward.claimCopy : "Beat the challenge and the Creatives Guide reward path will open here."}</p>

        <div className="wd-reward-claim__meta" aria-label="Reward metadata">
          <span>{reward.chapter}</span>
          <span>{reward.rewardLabel}</span>
          {reward.airdrop ? <span>Wallet airlock</span> : null}
        </div>

        {unlocked ? (
          <div className="wd-reward-claim__reveal">
            <p className="wd-reward-claim__reveal-title">{reward.revealTitle}</p>
            <p>{reward.revealBody}</p>
          </div>
        ) : null}

        {unlocked ? (
          submissionState === "success" ? (
            <div className="wd-reward-claim__success" aria-live="polite">
              <p className="wd-reward-claim__success-title">Reward queued</p>
              <p>{feedbackMessage}</p>
            </div>
          ) : reward.airdrop ? (
            <div className="wd-reward-claim__airdrop-shell">
              <div className="wd-reward-claim__airdrop-copy">
                <p className="wd-reward-claim__reveal-title">{reward.airdrop.airlockTitle}</p>
                <p>{reward.airdrop.airlockBody}</p>
              </div>
              <Button type="button" variant="primary" size="sm" className="wd-signup__submit" onClick={handleOpenAirlock}>
                {reward.airdrop.ctaLabel}
              </Button>
            </div>
          ) : (
            renderClaimForm()
          )
        ) : (
          <p className="wd-reward-claim__note">Finish the challenge and the shared reward claim surface opens here.</p>
        )}
      </section>

      {hasMounted && reward.airdrop && airlockOpen
        ? createPortal(
            <div className="wd-reward-claim__airlock-modal" role="dialog" aria-modal="true" aria-labelledby={airlockTitleId} onClick={() => setAirlockOpen(false)}>
              <div className="wd-reward-claim__airlock-panel" onClick={(event) => event.stopPropagation()}>
                <div className="wd-reward-claim__airlock-header">
                  <div>
                    <p className="wd-reward-claim__eyebrow">Wallet airlock</p>
                    <h3 id={airlockTitleId}>{reward.airdrop.airlockTitle}</h3>
                    <p>{reward.airdrop.airlockBody}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAirlockOpen(false)}>
                    Close
                  </Button>
                </div>

                <div className="wd-reward-claim__airlock-body">
                  <div className="wd-reward-claim__airlock-note">
                    <p className="wd-reward-claim__reveal-title">Per-wallet limit</p>
                    <p>One wallet can only clear this airlock {reward.airdrop.maxClaimsPerWallet} time{reward.airdrop.maxClaimsPerWallet === 1 ? "" : "s"} for this unlock path.</p>
                  </div>

                  {renderClaimForm(true)}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default EcosystemRewardClaimCard;
