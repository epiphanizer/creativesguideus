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
    revealBody: "Joint Queen is the first private doorway into the larger collector ecosystem. The hidden note reveals now, and the claim routes through the Creatives Guide reward path as email-first collector data instead of living as a one-off unlock.",
    chapter: "Joint Queen",
    rewardType: "hidden_audio",
    rewardLabel: "Joint Queen hidden transmission",
    claimTitle: "Claim Your Stash",
    claimCopy: "The smoke clears. You've found the stash. Drop your email first to receive the hidden transmission and keep the wider collector route open.",
    submitLabel: "Send the transmission",
    successMessage: "Transmission queued. Your email-first reward claim is logged and ready for distribution.",
    formNote: "Email anchors this claim. Add a Collector ID too if you already move through the wider Creatives Guide ecosystem."
  },
  "wd-volume-1-bong-tour-secret-game": {
    id: "wd-volume-1-bong-tour-secret-game",
    headline: "Archive unsealed",
    revealTitle: "Bong Tour secret game access",
    revealBody: "Volume 1 owns the Bong Tour handoff. This claim routes through the universal Creatives Guide reward path so the secret game stays attached to the main release world. Appreesh is not officially inside the public Walls/Devine runtime at launch, but the later cryptographic handoff stays wired.",
    chapter: "Walls/Devine Volume 1",
    rewardType: "collector_access",
    rewardLabel: "Bong Tour secret game access",
    claimTitle: "Route Me Into The Secret Game",
    claimCopy: "The Volume 1 seal is aligned. Drop your email first, then add a Collector ID or wallet if you want the future airdrop lane ready.",
    submitLabel: "Route the unlock",
    successMessage: "Secret-game access queued. Your email-first claim is logged in the universal Creatives Guide reward path for follow-up.",
    formNote: "Email is the main delivery anchor right now. Add a Collector ID for routing, and a wallet if you want the later airdrop lane ready.",
    airdrop: {
      airlockTitle: "Open the Volume 1 airlock",
      airlockBody: "This unlock keeps a wallet-specific airdrop lane ready while CGU handles the live reward flow today.",
      walletLabel: "Solana wallet",
      walletPlaceholder: "Paste the wallet receiving the unlock",
      walletHelp: "Email anchors delivery now. One claim per wallet keeps the later Appreesh airlock ready when the cryptographic layer comes online.",
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
