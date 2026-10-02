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
    headline: "Stash unsealed",
    revealTitle: "Studio session audio",
    revealBody: "You've unlocked the Joint Queen session audio. Enter your email to receive the unreleased acoustic demo and studio tracking notes directly.",
    chapter: "Joint Queen",
    rewardType: "hidden_audio",
    rewardLabel: "Joint Queen unreleased demo",
    claimTitle: "Claim Studio Audio",
    claimCopy: "The session is cued. Enter your email below to receive the private audio link and session notes.",
    submitLabel: "Send studio audio",
    successMessage: "Audio queued. We will send the private audio link directly to your inbox.",
    formNote: "We send the private audio link directly to this address. No spam or commercial mail."
  },
  "wd-volume-1-bong-tour-secret-game": {
    id: "wd-volume-1-bong-tour-secret-game",
    headline: "Archive unsealed",
    revealTitle: "Bong Tour interactive vault",
    revealBody: "You've unlocked access to the Bong Tour development archive and interactive screenplay game. Enter your details to receive private access credentials.",
    chapter: "Walls/Devine Volume 1",
    rewardType: "collector_access",
    rewardLabel: "Bong Tour interactive vault",
    claimTitle: "Unlock Vault Access",
    claimCopy: "The seal is aligned. Enter your email to receive direct access to the interactive screenwriting game and cue room archive.",
    submitLabel: "Request vault access",
    successMessage: "Access queued. We will send your credentials and session link directly.",
    formNote: "Direct studio dispatch. No automated marketing loops.",
    airdrop: {
      airlockTitle: "Digital Edition Key",
      airlockBody: "Optionally provide a wallet address if you wish to receive a digital collector stamp alongside your email confirmation.",
      walletLabel: "Collector wallet (optional)",
      walletPlaceholder: "Optional wallet address",
      walletHelp: "Email is the primary delivery address. Wallet is optional for digital edition archiving.",
      ctaLabel: "Enter key details",
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
