"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BONG_TOUR_CARDS } from "@/lib/bong-tour/cards";
import { AIRDROP_TIERS } from "@/lib/bong-tour/airdrop";
import { useAdminProject } from "./AdminProjectProvider";
import { useAdminWorkspace } from "./AdminWorkspaceProvider";

type HistoryItem = {
  cmd: string;
  res: string;
  time: string;
  isError?: boolean;
};

const INITIAL_WELCOME = (projectLabel: string) => ({
  cmd: "sysinfo --runtime",
  time: new Date().toLocaleTimeString(),
  res: `// CREATIVES GUIDE US · NATIVE CONTROL ROOM TERMINAL v3.2
// ACTIVE PROJECT: ${projectLabel.toUpperCase()} · OPERATOR: SEAN HALLS
// REAL-TIME ENGINE: NEXT.JS + FIREBASE + SH_HUB + SOLANA APPREESH
// TYPE 'help' OR CLICK ANY CHIP BELOW TO DISPATCH STUDIO TELEMETRY & CONTROLS`
});

export function AdminTerminal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProject, currentProjectId, buildScopedHref } = useAdminProject();
  const { authUser, routeStatuses } = useAdminWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => [
    INITIAL_WELCOME(currentProject.label)
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalBodyRef.current && isOpen && !isMinimized) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, isOpen, isMinimized]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const executeCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      setCmdHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      const subCmd = args[0]?.toLowerCase();

      let output = "";
      let isError = false;
      const time = new Date().toLocaleTimeString();

      switch (cmd) {
        case "help":
        case "?":
          output = `CGU ADMIN // NATIVE CLIENT & OPERATIONS TERMINAL
============================================================
AVAILABLE COMMANDS:

  [Projects & Workspace Navigation]
    projects                       List registered projects (Walls/Devine, Bong Tour)
    switch <project>               Swap active project (e.g. 'switch bong-tour')
    whoami                         Display active operator session and clearance
    routes                         Current status of all admin routes and sync state

  [Strategic Artha Assets & IP Holdings]
    artha                          ARTHA quant platform ($75k), dedicated Spark GPUs & DSP 2% equity
    bong, bongtour                 Bong Tour feature screenplay ($75k), 7 MTG cards & 6 cue tracks
    airdrop, appreesh              Solana $APPREESH airdrop pool monitoring (1,000,000 tokens)
    cards [name]                   Inspect 7 MTG-style trading cards or query a specific card
    cues, soundtrack               List all 6 cinematic cues & commercial sync tracks
    treatment                      Feature screenplay act breakdown, logline & pitch notes
    agent                          Baba Gandalfi in-world companion & JSON-LD schema status

  [Client Platforms & Deliverables]
    clients                        List production client platforms shipped by studio
    spec <client>                  View locked milestone acceptance criteria & scope

  [System Utilities]
    sysinfo, uname                 Kernel, hardware architecture & Next.js runtime version
    uptime                         System uptime, active daemons & zero-meeting status
    clear, cls                     Wipe terminal output history`;
          break;

        case "clear":
        case "cls":
          setHistory([]);
          return;

        case "whoami":
          output = `OPERATOR IDENTITY & CONSOLE PRIVILEGES:
  Operator:       Sean Halls
  Email:          ${authUser?.email || "seanhalls@gmail.com"}
  Active Project: ${currentProject.label} (${currentProjectId})
  Role:           Studio Director / Principal Engineer
  Clearance:      FULL HOST ROOT ACCESS
  Runtime Mode:   Next.js 16 Canary App Router + Firebase + Solana Airlock`;
          break;

        case "projects":
          output = `REGISTERED CGU STUDIO PROJECTS:
----------------------------------------------------------------------
[●] WALLS/DEVINE VOLUME 1
    ID:           walls-devine
    Status:       Sep 1 Launch [LIVE]
    Scope:        8-Track commercial sync catalog + mixing board lead capture
    Affiliate:    Celemony Melodyne vocal tuning integration profit center
    URL:          /admin/overview?project=walls-devine

[●] BONG TOUR
    ID:           bong-tour
    Status:       Active / Feature In Development [LIVE]
    Scope:        108-page road trip comedy / LOTR parody across Route 66
    Sound Lab:    6 cinematic cues mastered & synced
    Grimoire:     7 MTG-style holographic collectible trading cards
    Airdrop:      1,000,000 $APPREESH Solana Genesis pool & interactive airlock
    URL:          /admin/overview?project=bong-tour`;
          break;

        case "switch": {
          const target = subCmd;
          if (target === "bong-tour" || target === "bong" || target === "bongtour") {
            const nextHref = buildScopedHref("/admin/overview", "bong-tour");
            router.push(nextHref);
            output = "Switched active project to Bong Tour. Reloading scoped workspace...";
          } else if (target === "walls-devine" || target === "walls" || target === "wd") {
            const nextHref = buildScopedHref("/admin/overview", "walls-devine");
            router.push(nextHref);
            output = "Switched active project to Walls/Devine Volume 1. Reloading scoped workspace...";
          } else {
            output = "Usage: switch <walls-devine | bong-tour>";
            isError = true;
          }
          break;
        }

        case "routes":
          output = `ADMIN ROUTE HYDRATION STATUS:
  /admin/overview:      READY [LIVE]
  /admin/release-desk:  ${routeStatuses["release-desk"]?.toUpperCase() || "READY"}
  /admin/booking:       ${routeStatuses.booking?.toUpperCase() || "READY"}
  /admin/content:       ${routeStatuses.content?.toUpperCase() || "READY"}
  /admin/assets:        ${routeStatuses.assets?.toUpperCase() || "READY"}`;
          break;

        case "artha":
          output = `ARTHA QUANT ENGINE & HIGH-CONVICTION ASSETS:
----------------------------------------------------------------------
[●] ARTHA QUANT PLATFORM & ALGORITHMIC TRADING
    Valuation:    $75,000 internal IP asset
    Ownership:    100% sole IP ownership (Sean Halls)
    Compute:      Dedicated 2 GPUs / 5.0M tokens earmarked 24/7 on Spark Rig
    Engine:       High-precision statistical arbitrage, momentum & risk parity
    Telemetry:    Local Qwen 2.5 Coder + DeepSeek reasoning workers for alpha discovery

[●] DATA SERVICES PARTNERS (DSP) / DASHBOARDHC
    Equity Stake: 2.0% retained equity on >$2M SaaS ARR
    Distributions:$6,000 / quarter ($24,000 annual passive cashflow)
    Status:       Fully vested, quarterly dividend distributions active

[●] TOTAL STRATEGIC INTERNAL ASSETS
    ARTHA Quant ($75k) + Bong Tour IP ($75k) + Walls/Devine Vol 1 ($40k) + Namastay ($65k)
    Combined Internal Portfolio Valuation: $255,000+`;
          break;

        case "bong":
        case "bongtour":
          output = `BONG TOUR // ROAD TRIP COMEDY & FANTASY PARODY:
----------------------------------------------------------------------
[●] FEATURE SCREENPLAY & MEDIA IP
    Valuation:    $75,000 internal IP asset
    Status:       108-page feature screenplay locked, pitch deck complete
    Premise:      Lord of the Rings parody road trip across Route 66 in a 1994 Econoline
    Live Portal:  /bong-tour

[●] SOUNDTRACK CUES & SOUND LAB
    Status:       6 cinematic cues composed & mastered
    Highlights:   Leaving Hobbiton, 400 Blows at Flagstaff, The One Rig Awakening
    Affiliate:    Melodyne vocal tuning integration profit center

[●] MTG-STYLE TRADING CARD GRIMOIRE
    Cards (7):    Vishal (Mythic), Drew (Rare), Willie (Rare), Montu (Uncommon),
                  Baba Gandalfi (Mythic), Shadowfax Econoline (Mythic), The One Rig (Mythic)
    Mechanics:    3D holographic tilt, d20 Route 66 skill-check encounters

[●] APPREESH SOLANA AIRDROP POOL
    Pool Size:    1,000,000 $APPREESH tokens
    Multiplier:   Neophyte (1.0x) -> Ranger (1.5x) -> Wizard (2.2x) -> Arch-Mage (3.5x)`;
          break;

        case "airdrop":
        case "appreesh":
          output = `APPREESH SOLANA AIRDROP TELEMETRY & POOL MONITOR:
----------------------------------------------------------------------
[●] REWARD POOL TELEMETRY
    Token:        $APPREESH (Solana SPL Token Standard)
    Pool Balance: 1,000,000 $APPREESH earmarked for Bong Tour collectors
    Funnel Status:ACTIVE · Interactive Route 66 Scroll & Airlock Live
    Endpoint:     /api/bong-tour/giveaway (Proof-of-claim validation)

[●] REWARD MULTIPLIER TIERS
    1. ${AIRDROP_TIERS.neophyte.name} (${AIRDROP_TIERS.neophyte.multiplier}x) -> ${AIRDROP_TIERS.neophyte.baseTickets} $APPREESH (1+ Card)
    2. ${AIRDROP_TIERS.ranger.name} (${AIRDROP_TIERS.ranger.multiplier}x) -> ${AIRDROP_TIERS.ranger.baseTickets} $APPREESH (3+ Cards)
    3. ${AIRDROP_TIERS.wizard.name} (${AIRDROP_TIERS.wizard.multiplier}x) -> ${AIRDROP_TIERS.wizard.baseTickets} $APPREESH (5+ Cards)
    4. ${AIRDROP_TIERS.archmage.name} (${AIRDROP_TIERS.archmage.multiplier}x) -> ${AIRDROP_TIERS.archmage.baseTickets} $APPREESH (All 7 Cards)

[●] AUTONOMOUS AGENT MANIFEST
    Agent Guide:  Baba Gandalfi (In-world Istari smoke wizard companion)
    API Endpoint: window.__BONG_TOUR_AGENT__ (JSON-LD schema verified)`;
          break;

        case "cards": {
          if (subCmd) {
            const found = BONG_TOUR_CARDS.find(
              (c) => c.id.includes(subCmd) || c.name.toLowerCase().includes(subCmd)
            );
            if (found) {
              output = `CARD TELEMETRY: ${found.name.toUpperCase()}
----------------------------------------------------------------------
Subtitle:      ${found.subtitle}
Type:          ${found.typeLine}
Mana Cost:     ${found.manaCost}
Rarity:        ${found.rarity.toUpperCase()}
Stats:         ${found.powerToughness || "N/A"}
Appreesh Cost: ${found.appreeshCost} $APPREESH
LOTR Parody:   ${found.lotrEquivalent}
Class/Align:   ${found.dndClass} (${found.alignment})
Abilities:
${found.abilities.map((a) => `  • ${a.name ? `${a.name}: ` : ""}${a.text}`).join("\n")}
Flavor Text:   ${found.flavorText}`;
              break;
            }
          }
          output = `BONG TOUR HOLOGRAPHIC TRADING CARD GRIMOIRE (7 CARDS):
----------------------------------------------------------------------
${BONG_TOUR_CARDS.map(
  (c, i) =>
    `[${i + 1}] ${c.name.padEnd(32)} | ${c.rarity.toUpperCase().padEnd(8)} | ${c.manaCost.padEnd(8)} | ${c.appreeshCost} APPREESH`
).join("\n")}

Type 'cards <name>' to inspect a single card (e.g. 'cards vishal', 'cards rig').`;
          break;
        }

        case "cues":
        case "soundtrack":
          output = `STUDIO SOUND LAB & CUE CATALOG:
----------------------------------------------------------------------
BONG TOUR ORIGINAL SOUNDTRACK (6 CUES):
  1. Cue 01: Leaving Hobbiton in an Econoline     [02:44 · Psychedelic Folk]
  2. Cue 02: 400 Blows at Flagstaff Radiator Shop [03:18 · Desert Blues Rock]
  3. Cue 03: The One Rig Awakening (Sedona Vortex)[04:12 · Ambient Cosmic Synth]
  4. Cue 04: Willie's Paladin Stand on Route 66   [02:55 · Desert Stoner Rock]
  5. Cue 05: Baba Gandalfi's Revelation           [03:40 · Space Rock Oracle]
  6. Cue 06: Route 66 Sunset (The Road to Mordor) [03:30 · Acoustic Ballad]

WALLS/DEVINE VOLUME 1 (8-TRACK SYNC CATALOG):
  1. Joint Queen (02:07)        5. Morning Dew (03:14)
  2. Mojave Drift (03:42)       6. Glass Cathedral (04:01)
  3. Low Tide Soul (02:58)      7. Radiator Springs (03:22)
  4. Silver Needle (03:15)      8. Pacific Starlight (03:55)
* Profit Center: Celemony Melodyne vocal tuning affiliate integration active.`;
          break;

        case "treatment":
          output = `BONG TOUR // 108-PAGE FEATURE TREATMENT & SCREENPLAY:
----------------------------------------------------------------------
Logline:
  Four reluctant roadies embark on a perilous cross-country odyssey down
  Route 66 in a dying 1994 Ford Econoline to deliver an ancient, six-foot
  glass smoking relic into the volcanic fires of Flagstaff before corporate
  music executives and highway specters destroy their musical soul.

Act Breakdown:
  • Act I:   The Shire of Silver Lake — The Van & The Inheritance
  • Act II:  The Desolation of Barstow — The Radiator Breakdown in Flagstaff
  • Act III: The Vortex Over Sedona — Baba Gandalfi's Gas Station Prophecy
  • Act IV:  The Battle of Route 66 — Willie's Stand & The Route 66 Sunset
  • Climax:  Casting The One Rig into the Mountain of Fire & Sound

Locked Materials:
  Treatment PDF: gs://cgu-production-assets/bong-tour/treatment-locked-v2.pdf
  Screenplay:    gs://cgu-production-assets/bong-tour/screenplay-draft-locked.pdf`;
          break;

        case "agent":
          output = `AUTONOMOUS IN-WORLD AGENT COMPANION:
----------------------------------------------------------------------
Identity:      Baba Gandalfi (Istari Smoke Wizard of the Mojave)
Host Node:     NVIDIA Spark AI Tensor Rig (Dedicated local inference)
Role:          Guides visitors down the Route 66 scroll into the airdrop airlock
Capabilities:  4-stage airdrop progression, riddle checks, Solana claim validation
API Interface: window.__BONG_TOUR_AGENT__
Schema:        JSON-LD semantic agent manifest exposed on /bong-tour`;
          break;

        case "clients":
          output = `SHIPPED PRODUCTION CLIENT PLATFORMS:
----------------------------------------------------------------------
  - Total Body Modification (TBM) -> livetbm.com
  - Followup Care Operations       -> app.followup.care
  - Cluck Design Architecture     -> cluckdesign.com
  - World Cup Dreams Foundation   -> worldcupdreams.org
  - Namastay Conscious Atelier    -> namastay.online / namastay.yoga
  - Appreesh Gifting Protocol     -> appreesh.org
  - Western Management Commercial  -> western.management`;
          break;

        case "spec": {
          const target = subCmd || "tbm";
          output = `LOCKED MILESTONE SPEC // ${target.toUpperCase()}:
  1. Fixed Milestone Payout: Locked up front. $0 due until staging approved.
  2. Automated Acceptance: 100% test suite pass rate + cross-browser QA.
  3. Continuous Staging: Real application preview on isolated domain.
  4. IP Transfer: Complete 100% outright client ownership upon delivery.`;
          break;
        }

        case "sysinfo":
        case "uname":
          output = `Darwin cgu-director.local 24.1.0 Darwin Kernel Version 24.1.0: arm64
Platform: Next.js 16.1.0 Canary (Turbopack) · Node.js v20+
Acceleration: Apple Silicon Metal / NVIDIA Tensor Cores on Spark Rig
Deployment: Firebase App Hosting + Google Cloud Platform Edge CDN`;
          break;

        case "uptime":
          output = `20:15:00 up 412 days, 1 builder online, load average: 0.06, 0.10, 0.12
Meetings running: 0 · Time tracking fluff: 0% · Shipped outcomes: 100%`;
          break;

        default:
          output = `Command not recognized: '${cmd}'. Type 'help' to inspect available commands.`;
          isError = true;
          break;
      }

      setHistory((prev) => [...prev, { cmd: trimmed, res: output, time, isError }]);
    },
    [authUser, buildScopedHref, currentProject.label, currentProjectId, router, routeStatuses]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Escape") {
      setIsMinimized(true);
    }
  };

  const handleCopyHistory = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    }
  };

  const handleChip = (command: string) => {
    executeCommand(command);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cg-terminal-fab"
          aria-label="Open Native Client & Operations Terminal"
        >
          <span className="cg-terminal-fab__icon">⚡</span>
          <span className="cg-terminal-fab__label">Terminal CLI</span>
        </button>
      )}

      {/* Docked terminal window */}
      {isOpen && (
        <aside
          className={`cg-terminal-panel ${
            isMinimized ? "cg-terminal-panel--minimized" : ""
          } ${isMaximized ? "cg-terminal-panel--maximized" : ""}`}
          aria-label="Native Client & Operations Terminal"
        >
          {/* Title bar */}
          <div className="cg-terminal-panel__titlebar">
            <div className="cg-terminal-panel__traffic-lights">
              <button
                type="button"
                className="cg-terminal-panel__dot cg-terminal-panel__dot--red"
                onClick={() => setIsOpen(false)}
                title="Close terminal"
                aria-label="Close terminal"
              />
              <button
                type="button"
                className="cg-terminal-panel__dot cg-terminal-panel__dot--yellow"
                onClick={() => setIsMinimized(!isMinimized)}
                title="Toggle minimize"
                aria-label="Toggle minimize"
              />
              <button
                type="button"
                className="cg-terminal-panel__dot cg-terminal-panel__dot--green"
                onClick={() => setIsMaximized(!isMaximized)}
                title="Toggle maximize"
                aria-label="Toggle maximize"
              />
            </div>

            <div className="cg-terminal-panel__title">
              <span className="cg-terminal-panel__pulse-dot" />
              <span>
                cgu-terminal // {currentProjectId} · operator@studio
              </span>
            </div>

            <div className="cg-terminal-panel__controls">
              <button
                type="button"
                className="cg-terminal-panel__ctrl-btn"
                onClick={() => setHistory([])}
                title="Clear history"
              >
                Clear
              </button>
              <button
                type="button"
                className="cg-terminal-panel__ctrl-btn"
                onClick={() => setIsMaximized(!isMaximized)}
                title="Toggle expansion"
              >
                {isMaximized ? "Collapse ⤡" : "Expand ⤢"}
              </button>
            </div>
          </div>

          {!isMinimized ? (
            <>
              {/* Quick Command Chips */}
              <div className="cg-terminal-panel__chips" role="toolbar" aria-label="Quick Command Chips">
                <span className="cg-terminal-panel__chips-label">Quick:</span>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("artha")}>
                  💎 artha
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("bongtour")}>
                  🎬 bong-tour
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("airdrop")}>
                  🪂 airdrop
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("cards")}>
                  🃏 cards
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("cues")}>
                  🎵 cues
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("treatment")}>
                  📜 treatment
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("agent")}>
                  🧙 agent
                </button>
                <button type="button" className="cg-terminal-chip" onClick={() => handleChip("clients")}>
                  👥 clients
                </button>
                <button type="button" className="cg-terminal-chip cg-terminal-chip--help" onClick={() => handleChip("help")}>
                  ❓ help
                </button>
              </div>

              {/* Output log */}
              <div ref={terminalBodyRef} className="cg-terminal-panel__body">
                {history.map((item, index) => (
                  <div key={`${item.time}-${index}`} className="cg-terminal-entry">
                    <div className="cg-terminal-entry__header">
                      <span className="cg-terminal-entry__prompt">operator@cgu:~$</span>
                      <strong className="cg-terminal-entry__cmd">{item.cmd}</strong>
                      <span className="cg-terminal-entry__time">{item.time}</span>
                      <button
                        type="button"
                        className="cg-terminal-entry__copy"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyHistory(item.res, index);
                        }}
                        title="Copy command output"
                      >
                        {copiedIndex === index ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <pre
                      className={`cg-terminal-entry__output ${
                        item.isError ? "cg-terminal-entry__output--error" : ""
                      }`}
                    >
                      {item.res}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Prompt form */}
              <form onSubmit={handleSubmit} className="cg-terminal-panel__form">
                <span className="cg-terminal-panel__prompt-label">
                  operator@[{currentProjectId}]:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="cg-terminal-panel__input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type command (e.g. 'artha', 'bongtour', 'airdrop', 'cards', 'cues', 'help')..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  className="cg-terminal-panel__submit"
                  disabled={!inputVal.trim()}
                >
                  Run ↵
                </button>
              </form>
            </>
          ) : (
            <div
              className="cg-terminal-panel__minimized-bar"
              onClick={() => setIsMinimized(false)}
            >
              <span>⚡ Terminal Minimized — Click to restore console</span>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
