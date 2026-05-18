"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import type { EcosystemRewardDefinition } from "@/lib/ecosystem/reward-catalog";
import { createEcosystemRewardClaim } from "@/lib/firebase/ecosystem-reward-claims";

type EcosystemRewardClaimCardProps = {
  reward: EcosystemRewardDefinition;
  source: string;
  unlocked: boolean;
  className?: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function EcosystemRewardClaimCard({ reward, source, unlocked, className }: EcosystemRewardClaimCardProps) {
  const [email, setEmail] = useState("");
  const [collectorId, setCollectorId] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmissionState("submitting");
    setFeedbackMessage("");

    try {
      await createEcosystemRewardClaim({
        rewardId: reward.id,
        rewardLabel: reward.rewardLabel,
        rewardType: reward.rewardType,
        chapter: reward.chapter,
        source,
        email,
        collectorId
      });

      setEmail("");
      setCollectorId("");
      setSubmissionState("success");
      setFeedbackMessage(reward.successMessage);
    } catch (error) {
      setSubmissionState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Could not log the reward claim.");
    }
  }

  return (
    <section className={cx("wd-reward-claim", unlocked && "wd-reward-claim--unlocked", className)} aria-label={reward.claimTitle}>
      <p className="wd-reward-claim__eyebrow">{unlocked ? reward.headline : "Reward locked"}</p>
      <h3>{unlocked ? reward.claimTitle : "Locked until the smoke clears"}</h3>
      <p>{unlocked ? reward.claimCopy : "Beat the challenge and the shared reward flow will open here."}</p>

      <div className="wd-reward-claim__meta" aria-label="Reward metadata">
        <span>{reward.chapter}</span>
        <span>{reward.rewardLabel}</span>
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
            <p className="wd-reward-claim__success-title">Transmission queued</p>
            <p>{feedbackMessage}</p>
          </div>
        ) : (
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
                  required={!collectorId.trim()}
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
                  required={!email.trim()}
                  disabled={submissionState === "submitting"}
                />
              </label>
            </div>

            <div className="wd-signup__actions wd-reward-claim__actions">
              <Button type="submit" variant="primary" size="sm" className="wd-signup__submit" disabled={submissionState === "submitting"}>
                {submissionState === "submitting" ? "Routing..." : reward.submitLabel}
              </Button>
              <p className="wd-signup__note">{reward.formNote}</p>
            </div>

            {feedbackMessage ? (
              <p className={cx("wd-signup__feedback", submissionState === "error" && "wd-signup__feedback--error")} aria-live="polite">
                {feedbackMessage}
              </p>
            ) : null}
          </form>
        )
      ) : (
        <p className="wd-reward-claim__note">Finish the challenge and the reward claim surface opens here.</p>
      )}
    </section>
  );
}

export default EcosystemRewardClaimCard;
