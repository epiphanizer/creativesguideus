export type CardRarity = "uncommon" | "rare" | "mythic";

export type ManaPip = {
  type: "colorless" | "blue" | "red" | "green" | "white";
  value?: string;
};

export type CardAbility = {
  name?: string;
  cost?: string;
  text: string;
};

export type BongTourCard = {
  id: string;
  name: string;
  subtitle: string;
  manaCost: string;
  manaPips: ManaPip[];
  typeLine: string;
  rarity: CardRarity;
  powerToughness?: string;
  artSrc: string;
  abilities: CardAbility[];
  flavorText: string;
  appreeshCost: number;
  lotrEquivalent: string;
  dndClass: string;
  alignment: string;
};

export const BONG_TOUR_CARDS: BongTourCard[] = [
  {
    id: "vishal-scribe",
    name: "Vishal, Reluctant Scribe",
    subtitle: "The Burden of the Blank Page",
    manaCost: "{1}{U}{R}",
    manaPips: [
      { type: "colorless", value: "1" },
      { type: "blue", value: "U" },
      { type: "red", value: "R" }
    ],
    typeLine: "Legendary Creature — Human Elf Bard Scribe",
    rarity: "mythic",
    powerToughness: "1 / 4",
    artSrc: "/bong-tour/cards/card-vishal.jpg",
    abilities: [
      {
        name: "Overthinking Spiral",
        cost: "{T}",
        text: "Discard a screenplay draft, draw two plot holes. If a Hollywood executive or studio parasite is in the room, Vishal takes 2 psychic anxiety damage."
      },
      {
        name: "The Scribe's Burden",
        text: "Whenever another creature blows smoke into the van, Vishal must roll a d20. On 15+, he writes a brilliant treatment paragraph before his MacBook battery dies."
      }
    ],
    flavorText: "“I didn’t ask for the sacred six-foot glass rig. I asked for a three-picture deal, residual royalties, and dental insurance.”",
    appreeshCost: 65,
    lotrEquivalent: "Frodo Baggins / Bilbo the Chronicler",
    dndClass: "Level 6 College of Lore Bard",
    alignment: "Neutral Good (High Anxiety)"
  },
  {
    id: "drew-berserker",
    name: "Drew, Berserker of the Red Eye",
    subtitle: "Tolkien Obsessive & Wheelman",
    manaCost: "{2}{R}{G}",
    manaPips: [
      { type: "colorless", value: "2" },
      { type: "red", value: "R" },
      { type: "green", value: "G" }
    ],
    typeLine: "Legendary Creature — Dwarf Berserker Tolkienologist",
    rarity: "rare",
    powerToughness: "4 / 3",
    artSrc: "/bong-tour/cards/card-drew.jpg",
    abilities: [
      {
        name: "Second Breakfast Rush",
        cost: "Combat",
        text: "Whenever Drew attacks, roll a d20. On 1–8, he swerves the van for lukewarm gas station taquitos. On 9–20, he bellows the Silmarillion in fluent Quenya; defending suits are stunned with sheer awe."
      },
      {
        name: "Studio Treason",
        cost: "Pay 35 ◈",
        text: "Drew falls for VIP wristbands and gives the studio notes priority over artistic integrity until end of turn."
      }
    ],
    flavorText: "“It’s not just a dented van, Vishal. It’s Shadowfax, Lord of all 1994 Econolines, and she will drink regular unleaded until the world breaks!”",
    appreeshCost: 75,
    lotrEquivalent: "Gimli son of Glóin / Boromir of Gondor",
    dndClass: "Level 7 Path of Wild Magic Barbarian",
    alignment: "Chaotic Neutral"
  },
  {
    id: "willie-paladin",
    name: "Willie, Paladin of the Final Cut",
    subtitle: "The Only Adult in the Van",
    manaCost: "{2}{W}{U}",
    manaPips: [
      { type: "colorless", value: "2" },
      { type: "white", value: "W" },
      { type: "blue", value: "U" }
    ],
    typeLine: "Legendary Creature — Human Paladin Script-Doctor",
    rarity: "mythic",
    powerToughness: "3 / 5",
    artSrc: "/bong-tour/cards/card-willie.jpg",
    abilities: [
      {
        name: "Cricket Bat Smite",
        cost: "{W}{U}",
        text: "Counter target executive's unsolicited pitch note. Willie deals 4 bludgeoning reality damage directly to target suit's inflated ego."
      },
      {
        name: "One Script to Rule Them All",
        cost: "{T}",
        text: "Exile all rambling stoner monologues. Search the glovebox for the genuine shooting draft and advance the production directly to principal photography."
      }
    ],
    flavorText: "“Put down the DMT, step away from the contract, and let the only sober person steer us through the Barstow pass.”",
    appreeshCost: 80,
    lotrEquivalent: "Aragorn / Lady Galadriel",
    dndClass: "Level 8 Oath of Devotion Paladin",
    alignment: "Lawful Good"
  },
  {
    id: "montu-guardian",
    name: "Montu, Guardian of the Sacred Flux",
    subtitle: "Keeper of the Holy Waters",
    manaCost: "{3}{G}{W}",
    manaPips: [
      { type: "colorless", value: "3" },
      { type: "green", value: "G" },
      { type: "white", value: "W" }
    ],
    typeLine: "Legendary Creature — Monk River Guardian",
    rarity: "rare",
    powerToughness: "5 / 5",
    artSrc: "/bong-tour/cards/card-montu.jpg",
    abilities: [
      {
        name: "Ganges Ward",
        text: "Montu cannot be bribed by net points, streaming backend percentages, or counterfeit studio hospitality."
      },
      {
        name: "Sacred Immersion",
        cost: "{T}",
        text: "Place a Preservation Counter on target relic or script. As long as it bears this counter, it cannot be adapted into a straight-to-streaming watered-down franchise."
      }
    ],
    flavorText: "“The river washes away all Hollywood greasepaint. Your little town in California is only a dry puddle compared to the eternal waters.”",
    appreeshCost: 85,
    lotrEquivalent: "Faramir / Beorn the Protector",
    dndClass: "Level 9 Way of the Open Hand Monk",
    alignment: "Neutral Good"
  },
  {
    id: "baba-gandalfi",
    name: "Baba Gandalfi, Desert Starsailor",
    subtitle: "Sage of the Mojave Ether",
    manaCost: "{3}{U}{R}{W}",
    manaPips: [
      { type: "colorless", value: "3" },
      { type: "blue", value: "U" },
      { type: "red", value: "R" },
      { type: "white", value: "W" }
    ],
    typeLine: "Legendary Creature — Astral Avatar Wizard Guru",
    rarity: "mythic",
    powerToughness: "7 / 7",
    artSrc: "/bong-tour/cards/card-gandalfi.jpg",
    abilities: [
      {
        name: "Baba Gandalfi's Law",
        text: "The Bong can only preserve life. It cannot extend it. (Whenever an opponent attempts to prolong a franchise into an unnecessary Part IV, sacrifice all creative credibility.)"
      },
      {
        name: "Smoke Galleon Sail",
        cost: "{T}",
        text: "Blow a glowing celestial smoke ship into the night sky. All allied vehicles gain Flying and Desert-Walk until next sunrise."
      }
    ],
    flavorText: "“A wizard is never late on his delivery draft, Vishal. Nor is he early. He arrives precisely when the first round of financing clears escrow.”",
    appreeshCost: 100,
    lotrEquivalent: "Gandalf the Grey / Radagast the Brown",
    dndClass: "Level 14 Circle of the Stars Druid / Evocation Wizard",
    alignment: "Chaotic Good"
  },
  {
    id: "shadowfax-van",
    name: "Shadowfax, Arcane Econoline",
    subtitle: "Steed of the Mojave Highway",
    manaCost: "{4}",
    manaPips: [{ type: "colorless", value: "4" }],
    typeLine: "Legendary Artifact — Vehicle ('94 Econoline)",
    rarity: "uncommon",
    powerToughness: "Crew 2 · 3 / 8",
    artSrc: "/bong-tour/cards/card-shadowfax.jpg",
    abilities: [
      {
        name: "Boiling Radiator Haze",
        text: "When Shadowfax is crewed, shroud all occupants in a sweet plume of hot 50/50 ethylene glycol and sage. Gain hexproof from highway patrol until end of turn."
      },
      {
        name: "Barstow Perception Check",
        cost: "{T}",
        text: "Roll a d20. On 1, blow a head gasket; party must push the vehicle across county lines. On 20, the air conditioner inexplicably kicks on for 4 minutes."
      }
    ],
    flavorText: "“Show us the meaning of haste! Or at least hold 58 mph in the slow lane without throwing a rod.”",
    appreeshCost: 50,
    lotrEquivalent: "Shadowfax, Lord of Horses",
    dndClass: "Enchanted War Chariot / Mobile Spell Sanctuary",
    alignment: "True Neutral (Rattling)"
  },
  {
    id: "the-one-rig",
    name: "The One Rig, Blown in Secret",
    subtitle: "Sacred Six-Foot Chalice of Fire",
    manaCost: "{6}",
    manaPips: [{ type: "colorless", value: "6" }],
    typeLine: "Legendary Artifact — Sacred Relic",
    rarity: "mythic",
    artSrc: "/bong-tour/cards/card-onerig.jpg",
    abilities: [
      {
        name: "One Rig to Rule the Pitch",
        text: "Indestructible. The One Rig cannot be smashed, cracked, or pawned in Burbank. Can only be unmade in the sacred waters of the Ganges."
      },
      {
        name: "Ash Nazg Durbatulûk",
        cost: "{T}, Pay 50 ◈",
        text: "Tap all creatures within a 50-foot radius. Target Hollywood executive achieves cosmic ego dissolution, forgets their casting ultimatums, and begins weeping at craft services."
      }
    ],
    flavorText: "“Three hits for the Elven-kings under the sky, seven for the Dwarf-lords in their halls of stone, nine for Mortal Men doomed to pitch pilot episodes... and One for the Dark Lord on his throne in Burbank.”",
    appreeshCost: 150,
    lotrEquivalent: "The One Ring of Sauron",
    dndClass: "Artifact of the Ancients (Requires Attunement)",
    alignment: "True Cosmic Saffron"
  }
];

export const INITIAL_APPREESH_BALANCE = 500;
