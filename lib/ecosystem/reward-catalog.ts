export type EcosystemRewardDefinition = {
  id: string;
  headline: string;
  revealTitle: string;
  revealBody: string;
  chapter: string;
  rewardType: string;
  rewardLabel: string;
  claimTitle: string;
  claimCopy: string;
  submitLabel: string;
  successMessage: string;
  formNote: string;
};

const ecosystemRewardCatalog = {
  "wd-joint-queen-hidden-transmission": {
    id: "wd-joint-queen-hidden-transmission",
    headline: "Stash unlocked",
    revealTitle: "Hidden transmission",
    revealBody: "Joint Queen is the first private doorway into the larger collector ecosystem. This claim now routes through the shared reward pipeline instead of living as a one-off hidden note.",
    chapter: "Joint Queen",
    rewardType: "hidden_audio",
    rewardLabel: "Joint Queen hidden transmission",
    claimTitle: "Claim Your Stash",
    claimCopy: "The smoke clears. You've found the stash. Drop your frequency (email) to receive the hidden transmission.",
    submitLabel: "Send the transmission",
    successMessage: "Transmission queued. Your reward claim is logged and ready for distribution.",
    formNote: "Use an email for delivery, a Collector ID for routing, or both if you already move through the ecosystem."
  }
} satisfies Record<string, EcosystemRewardDefinition>;

export type EcosystemRewardId = keyof typeof ecosystemRewardCatalog;

export function getEcosystemRewardDefinition(rewardId?: string | null): EcosystemRewardDefinition | null {
  if (!rewardId) {
    return null;
  }

  return ecosystemRewardCatalog[rewardId as EcosystemRewardId] ?? null;
}

export function getEcosystemRewardCatalog() {
  return ecosystemRewardCatalog;
}
