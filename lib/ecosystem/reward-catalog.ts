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
  airdrop?: {
    airlockTitle: string;
    airlockBody: string;
    walletLabel: string;
    walletPlaceholder: string;
    walletHelp: string;
    ctaLabel: string;
    maxClaimsPerWallet: number;
  };
};

const ecosystemRewardCatalog = {
  "wd-joint-queen-hidden-transmission": {
    id: "wd-joint-queen-hidden-transmission",
    headline: "Stash unlocked",
    revealTitle: "Hidden transmission",
    revealBody: "Joint Queen is the first private doorway into the larger collector ecosystem. This claim now routes through the Creatives Guide reward path instead of living as a one-off hidden note.",
    chapter: "Joint Queen",
    rewardType: "hidden_audio",
    rewardLabel: "Joint Queen hidden transmission",
    claimTitle: "Claim Your Stash",
    claimCopy: "The smoke clears. You've found the stash. Drop your frequency (email) to receive the hidden transmission.",
    submitLabel: "Send the transmission",
    successMessage: "Transmission queued. Your reward claim is logged and ready for distribution.",
    formNote: "Use an email for delivery, a Collector ID for routing, or both if you already move through the wider Creatives Guide ecosystem."
  },
  "wd-volume-1-bong-tour-secret-game": {
    id: "wd-volume-1-bong-tour-secret-game",
    headline: "Archive unsealed",
    revealTitle: "Bong Tour secret game access",
    revealBody: "Volume 1 owns the Bong Tour handoff. This claim routes through the universal Creatives Guide reward path so the secret game stays attached to the main release world, with Appreesh serving as the cryptographic layer rather than the whole system.",
    chapter: "Walls/Devine Volume 1",
    rewardType: "collector_access",
    rewardLabel: "Bong Tour secret game access",
    claimTitle: "Route Me Into The Secret Game",
    claimCopy: "The Volume 1 seal is aligned. Drop your email or Collector ID and we will route your Bong Tour secret-game access through the shared Creatives Guide reward path.",
    submitLabel: "Route the unlock",
    successMessage: "Secret-game access queued. Your claim is logged in the universal Creatives Guide reward path for follow-up.",
    formNote: "Use an email for delivery, a Collector ID for routing, or both if you already move through the Creatives Guide ecosystem.",
    airdrop: {
      airlockTitle: "Open the Volume 1 airlock",
      airlockBody: "This unlock uses a wallet-specific airdrop lane so the secret-game route stays limited and collectible.",
      walletLabel: "Solana wallet",
      walletPlaceholder: "Paste the wallet receiving the unlock",
      walletHelp: "One claim per wallet. Appreesh remains the cryptographic layer that can verify or route this later.",
      ctaLabel: "Open the airlock",
      maxClaimsPerWallet: 1
    }
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
