export type AirdropTierId = "neophyte" | "ranger" | "wizard" | "archmage";

export type AirdropTier = {
  id: AirdropTierId;
  name: string;
  minCards: number;
  multiplier: number;
  baseTickets: number;
  perks: string[];
  loreTitle: string;
};

export const AIRDROP_TIERS: Record<AirdropTierId, AirdropTier> = {
  neophyte: {
    id: "neophyte",
    name: "Neophyte of the Van",
    minCards: 1,
    multiplier: 1.0,
    baseTickets: 100,
    perks: [
      "Access to $APPREESH Genesis Token Pool",
      "Digital First-Draft Reading Copy PDF",
      "Name recorded in the Underground Ledger"
    ],
    loreTitle: "Curious Drifter on Sunset"
  },
  ranger: {
    id: "ranger",
    name: "Ranger of the Mojave",
    minCards: 3,
    multiplier: 1.5,
    baseTickets: 350,
    perks: [
      "1.5x Multiplier on all earned $APPREESH tickets",
      "Early Listening Room Access for Volume 1 Stems",
      "Priority Invitation to Regional Screening Passes"
    ],
    loreTitle: "Fellowship Scout of the Barstow Trail"
  },
  wizard: {
    id: "wizard",
    name: "Wizard of the White Council",
    minCards: 5,
    multiplier: 2.2,
    baseTickets: 900,
    perks: [
      "2.2x Multiplier on all earned $APPREESH tickets",
      "Physical Hand-Bound Screenplay Waitlist Tier",
      "Baba Gandalfi's Astral Audio Drop (Unreleased Cues)",
      "Direct Artist Tribute Stamp on Solana"
    ],
    loreTitle: "Council Elder of Amon Sunset"
  },
  archmage: {
    id: "archmage",
    name: "Grand Arch-Mage of the Rig",
    minCards: 7,
    multiplier: 3.5,
    baseTickets: 2500,
    perks: [
      "3.5x Multiplier on all earned $APPREESH tickets",
      "Guaranteed Numbered Physical First-Edition Script",
      "Executive Patron Producer Credit in Film Program",
      "Private VIP Booth Entry at Film Festival Premiere",
      "Permanent Genesis Inscription on Solana Devnet/Mainnet"
    ],
    loreTitle: "Master of the Sacred Six-Foot Flux"
  }
};

export function calculateAirdropStats(
  cardsCollectedCount: number,
  appreeshBalance: number,
  encountersRolledCount: number = 0
) {
  let tier: AirdropTier = AIRDROP_TIERS.neophyte;

  if (cardsCollectedCount >= 7) {
    tier = AIRDROP_TIERS.archmage;
  } else if (cardsCollectedCount >= 5) {
    tier = AIRDROP_TIERS.wizard;
  } else if (cardsCollectedCount >= 3) {
    tier = AIRDROP_TIERS.ranger;
  } else {
    tier = AIRDROP_TIERS.neophyte;
  }

  // Activity score based on in-game actions
  const activityScore =
    cardsCollectedCount * 120 + encountersRolledCount * 45 + Math.floor(appreeshBalance / 3);

  const totalTickets = Math.floor((tier.baseTickets + activityScore) * tier.multiplier);

  return {
    tier,
    activityScore,
    totalTickets,
    nextTier:
      cardsCollectedCount < 3
        ? AIRDROP_TIERS.ranger
        : cardsCollectedCount < 5
          ? AIRDROP_TIERS.wizard
          : cardsCollectedCount < 7
            ? AIRDROP_TIERS.archmage
            : null,
    cardsNeededForNextTier:
      cardsCollectedCount < 3
        ? 3 - cardsCollectedCount
        : cardsCollectedCount < 5
          ? 5 - cardsCollectedCount
          : cardsCollectedCount < 7
            ? 7 - cardsCollectedCount
            : 0
  };
}

export const AIRDROP_AGENT_MANIFEST = {
  protocol: "Appreesh Solana Airdrop Funnel",
  network: "Solana Mainnet-Beta / Devnet Anchor",
  governanceUrl: "https://appreesh.org",
  purpose:
    "Direct-to-artist patron rewards for Bong Tour: A Masala Film. No Hollywood middlemen, no focus groups.",
  steps: [
    {
      step: 1,
      title: "Initialize Traveler Pouch",
      action: "Claim initial 500 ◈ Appreesh allocation.",
      apiMethod: "window.__BONG_TOUR_AGENT__.getStatus()"
    },
    {
      step: 2,
      title: "Inscribe Fellowship Cards",
      action: "Inscribe 1 to 7 Magic Cards from the Grimoire into your Spellbook.",
      apiMethod: "window.__BONG_TOUR_AGENT__.inscribeCard(cardId)"
    },
    {
      step: 3,
      title: "Pass Highway Skill Checks",
      action: "Roll d20 fate dice along Route 66 to increase activity score.",
      apiMethod: "window.__BONG_TOUR_AGENT__.rollSkillCheck(encounterId)"
    },
    {
      step: 4,
      title: "Enter Airdrop Airlock",
      action: "Submit email and Solana wallet to lock in $APPREESH airdrop tickets.",
      apiMethod: "window.__BONG_TOUR_AGENT__.submitAirdropRegistration({ email, walletAddress, name })"
    }
  ]
};
