export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardAppreesh: number;
  condition: (state: {
    collectedCards: string[];
    encountersRolledCount: number;
    nat20Count: number;
    nat1Count: number;
    isAirdropClaimed: boolean;
  }) => boolean;
};

export const BONG_TOUR_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-inscription",
    title: "The First Inscription",
    description: "Inscribe your first character or relic into the Traveler's Spellbook.",
    icon: "📜",
    rewardAppreesh: 50,
    condition: (s) => s.collectedCards.length >= 1
  },
  {
    id: "fellowship-assembled",
    title: "The Fellowship Assembled",
    description: "Inscribe all five fellowship characters (Vishal, Drew, Willie, Montu, Baba Gandalfi).",
    icon: "🧙‍♂️",
    rewardAppreesh: 150,
    condition: (s) => {
      const required = ["vishal-scribe", "drew-berserker", "willie-paladin", "montu-guardian", "baba-gandalfi"];
      return required.every((id) => s.collectedCards.includes(id));
    }
  },
  {
    id: "arcane-mechanization",
    title: "Steed of the Mojave",
    description: "Inscribe Shadowfax, the 1994 Arcane Econoline.",
    icon: "🚐",
    rewardAppreesh: 75,
    condition: (s) => s.collectedCards.includes("shadowfax-van")
  },
  {
    id: "the-one-rig",
    title: "The One Rig",
    description: "Inscribe the sacred six-foot glass chalice blown in secret.",
    icon: "🔮",
    rewardAppreesh: 200,
    condition: (s) => s.collectedCards.includes("the-one-rig")
  },
  {
    id: "natural-twenty",
    title: "Nat 20: Guided by Fate",
    description: "Roll a Critical Natural 20 on any highway skill check.",
    icon: "🎲",
    rewardAppreesh: 100,
    condition: (s) => s.nat20Count > 0
  },
  {
    id: "critical-fumble",
    title: "Burnt Taquito Fumble",
    description: "Roll a Critical Natural 1 fumble and survive the engine backfire.",
    icon: "💥",
    rewardAppreesh: 50,
    condition: (s) => s.nat1Count > 0
  },
  {
    id: "highway-veteran",
    title: "Mojave Trail Veteran",
    description: "Roll at least 6 highway trials along Route 66 and the Ganges.",
    icon: "🛣️",
    rewardAppreesh: 125,
    condition: (s) => s.encountersRolledCount >= 6
  },
  {
    id: "grand-archmage",
    title: "Grand Arch-Mage",
    description: "Assemble all seven relics and unlock the maximum 3.5x Airdrop Multiplier.",
    icon: "👑",
    rewardAppreesh: 350,
    condition: (s) => s.collectedCards.length >= 7
  },
  {
    id: "on-chain-seal",
    title: "Immutable Patron",
    description: "Seal your Solana wallet in the Appreesh Airdrop Airlock.",
    icon: "⚡",
    rewardAppreesh: 100,
    condition: (s) => s.isAirdropClaimed
  }
];

export function checkUnlockedAchievements(
  state: {
    collectedCards: string[];
    encountersRolledCount: number;
    nat20Count: number;
    nat1Count: number;
    isAirdropClaimed: boolean;
  },
  alreadyUnlockedIds: string[]
): Achievement[] {
  return BONG_TOUR_ACHIEVEMENTS.filter(
    (a) => !alreadyUnlockedIds.includes(a.id) && a.condition(state)
  );
}
