"use client";

import { useState } from "react";
import { FiCheckCircle, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { GiDiceTwentyFacesTwenty, GiRollingDices, GiSparkles } from "react-icons/gi";

type Encounter = {
  id: string;
  title: string;
  checkType: string;
  dc: number;
  scenario: string;
  critSuccess: { text: string; reward: number };
  success: { text: string; reward: number };
  fail: { text: string; reward: number };
  critFail: { text: string; reward: number };
};

import { soundEngine } from "@/lib/bong-tour/sound-effects";

const ENCOUNTERS: Encounter[] = [
  {
    id: "barstow-radiator",
    title: "Encounter I: The Barstow Radiator Crisis",
    checkType: "DC 13 Perception / Investigation Check",
    dc: 13,
    scenario:
      "Shadowfax's temperature gauge is pinned deep in the red zone outside a boarded-up Texaco near Calico Ghost Town. Drew claims the engine steam smells like elder-berries; Willie says the water pump is screaming in cursed Elvish. Roll a d20 to inspect the coolant block!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! You bypass the thermostat with a sacred elven zip-tie and bless the radiator with warm water. Shadowfax purrs like a Lothlórien cat!",
      reward: 120
    },
    success: {
      text: "SUCCESS (13+): You carefully vent the cap with a shop towel and top off the tank with lukewarm Mountain Dew. She holds 55 mph until Pasadena!",
      reward: 60
    },
    fail: {
      text: "FAILURE: Scalding coolant sprays across Drew's chainmail. You spend 45 minutes searching for a 10mm socket in the desert sand, but you find a handful of lost coins in the glovebox.",
      reward: 20
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! Drew attempts to tighten the radiator clamp with his teeth, snaps the serpentine belt, and buys six dubious gas station microwave taquitos.",
      reward: 10
    }
  },
  {
    id: "green-room-dmt",
    title: "Encounter II: The Shaman's Council at The Comedy Store",
    checkType: "DC 15 Wisdom Saving Throw",
    dc: 15,
    scenario:
      "Backstage in the VIP lounge, an untouchable A-Lister points to the six-foot sacred rig packed with high-grade DMT and asks: 'Does the little person have to die for this movie to get funded?' Roll a d20 Wisdom Save to resist selling out your creative soul!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! You stare the A-Lister down and recite Baba Gandalfi's Law: 'The Bong can only preserve life. It cannot extend it.' The actor weeps openly, fires his agent, and offers you first-dollar gross!",
      reward: 150
    },
    success: {
      text: "SAVE SUCCEEDED (15+): Willie steps in with her cricket bat, parrying the bong stem and protecting your brain cells. You leave with your dignity and your script intact!",
      reward: 75
    },
    fail: {
      text: "SAVE FAILED: You take a massive lungful of celestial vapor, perceive the 4th dimension of the studio lot, and agree that the movie should star two talking parrots. You awaken 3 hours later behind the dumpster.",
      reward: 25
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! The DMT entity shows you the terrifying infinite future of corporate streaming: 'Bong Tour 7: Rise of the Glass.' You wake up holding a check for $4.18.",
      reward: 15
    }
  },
  {
    id: "highway-patrol",
    title: "Encounter III: The Barstow Highway Patrol Checkpoint",
    checkType: "DC 14 Charisma (Deception) Check",
    dc: 14,
    scenario:
      "State Troopers pull Shadowfax over on the I-15 shoulder. A young trooper points his flashlight at the back and asks why a six-foot iridescent glass cylinder is seatbelted into the middle row. Roll a d20 to explain the sacred theatrical prop!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! You spin a legendary tale of avant-garde cinema. The trooper is deeply moved, reveals his own screenwriting ambitions, and gives you a two-car police escort directly to the Pasadena city limits!",
      reward: 160
    },
    success: {
      text: "SUCCESS (14+): You flash an expired community college film-student badge and claim it's a giant kaleidoscope for an art-house documentary. The trooper sighs and lets you off with a warning for a cracked taillight.",
      reward: 80
    },
    fail: {
      text: "FAILURE: Drew panics, attempts to quote the Oath of Fëanor in Quenya, and drops his glovebox taquito into the trooper's boots. You spend 90 minutes performing field sobriety tests on the desert gravel.",
      reward: 25
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! Shadowfax backfires like a civil war cannon, frightening the patrol cruiser's K-9 unit. The troopers impound your spare tire.",
      reward: 15
    }
  },
  {
    id: "studio-pitch",
    title: "Encounter IV: The Sunset Boardroom Ambush",
    checkType: "DC 17 Charisma (Performance) Check",
    dc: 17,
    scenario:
      "Five junior studio executives in identical fleece vests surround the conference table at Sunset & Vine. They have 4 minutes before their catered sushi arrives. They want you to recast Montu with a talking CGI dog and change the title to 'Bong Bros: Spring Break Vegas'. Roll a d20 to pitch your authentic artistic vision!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! You stand on the mahogany boardroom table and pitch the uncut Kolkata diaspora road epic with pure volcanic charisma. The studio head bursts into tears, cancels three superhero spinoffs on the spot, and writes a production financing check on a linen napkin!",
      reward: 220
    },
    success: {
      text: "SUCCESS (17+): Willie steps up with her red pen and strikes out all corporate notes with surgical precision. The suits nod solemnly, pretend they understood the allegory, and approve your principal photography budget!",
      reward: 100
    },
    fail: {
      text: "FAILURE: Vishal begins hyperventilating and apologizes for existing. The suits take advantage of his anxiety to insert product placement for energy drinks in every scene.",
      reward: 35
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! Drew knocks over a glass pitcher of iced cucumber water onto the studio head's iPad. The executive threatens to blacklist your ancestors.",
      reward: 15
    }
  },
  {
    id: "joshua-tree-astral",
    title: "Encounter V: The Joshua Tree Astral Council",
    checkType: "DC 18 Intelligence (Arcana) Check",
    dc: 18,
    scenario:
      "Under the Perseid meteor shower in Joshua Tree, Baba Gandalfi appears atop a granite boulder with a glowing pipe. He challenges you to read the ancient glowing Sanskrit runes etched inside the glass bore before the desert wind wipes them clean. Roll a d20 Arcana Check!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! Cosmic Enlightenment! You decipher the complete inscription: 'Art is the only rebellion against mortality.' A celestial supernova erupts overhead, blessing the entire Fellowship with permanent sovereign creative autonomy!",
      reward: 250
    },
    success: {
      text: "SUCCESS (18+): You decipher the core riddle of Baba Gandalfi's Law: to preserve without extending is to love without possessing. The wizard smiles, taps his pipe, and showers your pouch with ancient stellar coins.",
      reward: 120
    },
    fail: {
      text: "FAILURE: You confuse the Sanskrit glyphs with an old recipe for coriander chutney. Baba Gandalfi shakes his head gently and blows a smoke ring shaped like an hourglass.",
      reward: 40
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! You stare directly into the cosmic void and forget your own phone number. Drew spends the next four hours explaining why Tom Bombadil wasn't in the Peter Jackson trilogy.",
      reward: 20
    }
  },
  {
    id: "ganges-catwalk",
    title: "Encounter VI: The Ganges Warehouse Catwalk",
    checkType: "DC 16 Dexterity (Acrobatics) Check",
    dc: 16,
    scenario:
      "Flames lick the rusted rafters of a Kolkata warehouse over the sacred river. Studio suits in an air-conditioned golf cart demand the IP rights, while Drew swings a cricket bat like a medieval broadsword. Roll a d20 to deliver the One Rig back to the water!",
    critSuccess: {
      text: "NAT 20 CRITICAL SUCCESS! A miraculous parkour leap! You dive through the smoke, slide across the corrugated zinc roof, and drop the One Rig safely into the sacred river silt. The law is fulfilled!",
      reward: 200
    },
    success: {
      text: "SUCCESS (16+): Montu catches you as the catwalk buckles. Together you lower the six-foot rig into the water just as Upper Management's golf cart battery dies.",
      reward: 90
    },
    fail: {
      text: "FAILURE: You slip on spilled mustard from Drew's snack stash. Willie grabs you by your collar, but the script pages scatter into the warm monsoon breeze.",
      reward: 30
    },
    critFail: {
      text: "NAT 1 CRITICAL FAIL! You trip over your own elven cloak and tumble into a pile of empty chai cups. The studio exec tries to sign your cast with a gold Sharpie.",
      reward: 15
    }
  }
];

type Props = {
  onReward: (amount: number, description: string, roll?: number) => void;
};

export function BongTourSkillCheck({ onReward }: Props) {
  const [activeEncounterId, setActiveEncounterId] = useState<string>(ENCOUNTERS[0].id);
  const [rollHistory, setRollHistory] = useState<
    Record<string, { value: number; result: string; reward: number }>
  >({});
  const [isRolling, setIsRolling] = useState(false);
  const [displayedRoll, setDisplayedRoll] = useState<number | null>(null);

  const activeEncounter =
    ENCOUNTERS.find((e) => e.id === activeEncounterId) ?? ENCOUNTERS[0];
  const currentRoll = rollHistory[activeEncounter.id];

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    let counter = 0;
    const interval = setInterval(() => {
      setDisplayedRoll(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 14) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setDisplayedRoll(finalRoll);

        let outcomeText = "";
        let rewardAmount = 0;

        if (finalRoll === 20) {
          outcomeText = activeEncounter.critSuccess.text;
          rewardAmount = activeEncounter.critSuccess.reward;
          soundEngine.playNat20();
        } else if (finalRoll === 1) {
          outcomeText = activeEncounter.critFail.text;
          rewardAmount = activeEncounter.critFail.reward;
          soundEngine.playFumble();
        } else if (finalRoll >= activeEncounter.dc) {
          outcomeText = activeEncounter.success.text;
          rewardAmount = activeEncounter.success.reward;
          soundEngine.playCoin();
        } else {
          outcomeText = activeEncounter.fail.text;
          rewardAmount = activeEncounter.fail.reward;
          soundEngine.playCoin();
        }

        setRollHistory((prev) => ({
          ...prev,
          [activeEncounter.id]: {
            value: finalRoll,
            result: outcomeText,
            reward: rewardAmount
          }
        }));

        setIsRolling(false);
        onReward(rewardAmount, `${activeEncounter.title} (Rolled d20: ${finalRoll})`, finalRoll);
      }
    }, 60);
  };

  const handleResetCurrent = () => {
    setRollHistory((prev) => {
      const copy = { ...prev };
      delete copy[activeEncounter.id];
      return copy;
    });
    setDisplayedRoll(null);
  };

  return (
    <div className="bt-skillcheck-container">
      <div className="bt-skillcheck-tabs">
        {ENCOUNTERS.map((enc, idx) => {
          const hasRolled = !!rollHistory[enc.id];
          return (
            <button
              key={enc.id}
              type="button"
              className={`bt-skillcheck-tab${enc.id === activeEncounterId ? " bt-skillcheck-tab--active" : ""}`}
              onClick={() => {
                setActiveEncounterId(enc.id);
                setDisplayedRoll(rollHistory[enc.id]?.value ?? null);
              }}
            >
              <span className="bt-skillcheck-tab__num">Part {idx + 1}</span>
              <span className="bt-skillcheck-tab__title">{enc.title.split(":")[1] || enc.title}</span>
              {hasRolled && <span className="bt-skillcheck-tab__badge">✓ Rolled</span>}
            </button>
          );
        })}
      </div>

      <div className="bt-encounter-card">
        <header className="bt-encounter-card__head">
          <div className="bt-encounter-card__badge-row">
            <span className="bt-encounter-badge">
              <GiDiceTwentyFacesTwenty aria-hidden="true" />
              {activeEncounter.checkType}
            </span>
            <span className="bt-encounter-dc">Difficulty Class: {activeEncounter.dc}</span>
          </div>

          <h3>{activeEncounter.title}</h3>
          <p className="bt-encounter-scenario">{activeEncounter.scenario}</p>
        </header>

        <div className="bt-dice-arena">
          <div className="bt-dice-display">
            <div className={`bt-d20-dice${isRolling ? " bt-d20-dice--spinning" : ""}`}>
              <span className="bt-d20-dice__value">
                {displayedRoll !== null ? displayedRoll : "?"}
              </span>
              <span className="bt-d20-dice__sub">d20</span>
            </div>

            <div className="bt-dice-action-col">
              {!currentRoll ? (
                <button
                  type="button"
                  className="bt-roll-btn"
                  onClick={rollDice}
                  disabled={isRolling}
                >
                  <GiRollingDices aria-hidden="true" />
                  <span>{isRolling ? "Rolling the Fate Dice…" : "Roll for Initiative (d20)"}</span>
                </button>
              ) : (
                <div className="bt-roll-result-actions">
                  <div className="bt-reward-pill">
                    <GiSparkles aria-hidden="true" />
                    <span>+{currentRoll.reward} ◈ Added to Pouch!</span>
                  </div>
                  <button
                    type="button"
                    className="bt-reroll-btn"
                    onClick={handleResetCurrent}
                    title="Roll again to test fate"
                  >
                    <FiRefreshCw aria-hidden="true" />
                    <span>Re-Roll Check</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {currentRoll && (
            <div
              className={`bt-encounter-outcome${
                currentRoll.value === 20
                  ? " bt-encounter-outcome--crit-success"
                  : currentRoll.value === 1
                    ? " bt-encounter-outcome--crit-fail"
                    : currentRoll.value >= activeEncounter.dc
                      ? " bt-encounter-outcome--success"
                      : " bt-encounter-outcome--fail"
              }`}
            >
              <div className="bt-outcome-header">
                {currentRoll.value >= activeEncounter.dc ? (
                  <FiCheckCircle className="bt-outcome-icon" aria-hidden="true" />
                ) : (
                  <FiXCircle className="bt-outcome-icon" aria-hidden="true" />
                )}
                <strong>
                  {currentRoll.value === 20
                    ? "CRITICAL NATURAL 20!"
                    : currentRoll.value === 1
                      ? "NATURAL 1 CRITICAL FUMBLE!"
                      : currentRoll.value >= activeEncounter.dc
                        ? "SKILL CHECK PASSED!"
                        : "SKILL CHECK FAILED!"}
                </strong>
                <span className="bt-outcome-roll">Rolled {currentRoll.value} vs DC {activeEncounter.dc}</span>
              </div>
              <p className="bt-outcome-text">{currentRoll.result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
