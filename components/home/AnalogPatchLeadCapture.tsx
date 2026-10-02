"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createEcosystemLead } from "@/lib/firebase/ecosystem-leads";

type SocketId = "algorithmic-autotune" | "committee-feedback" | "tube-amps-and-real-guitars";

type SocketCoordinate = {
  id: SocketId;
  x: number;
  y: number;
  label: string;
  trap: boolean;
};

type CircuitState = "idle" | "dragging" | "fault_autotune" | "fault_committee" | "connected";

const TITLE_CHARS = [
  { char: "c", delay: 0.05 },
  { char: "r", delay: 0.12 },
  { char: "e", delay: 0.18 },
  { char: "a", delay: 0.25 },
  { char: "t", delay: 0.32 },
  { char: "i", delay: 0.38 },
  { char: "v", delay: 0.45 },
  { char: "e", delay: 0.52 },
  { char: "s", delay: 0.58 },
  { char: "g", delay: 0.65 },
  { char: "u", delay: 0.72 },
  { char: "i", delay: 0.78 },
  { char: "d", delay: 0.85 },
  { char: "e", delay: 0.92 },
  { char: ".", delay: 0.98, isDot: true },
  { char: "u", delay: 1.05 },
  { char: "s", delay: 1.12 }
];

export default function AnalogPatchLeadCapture() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const socketAutotuneRef = useRef<HTMLDivElement | null>(null);
  const socketCommitteeRef = useRef<HTMLDivElement | null>(null);
  const socketAmpsRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [email, setEmail] = useState("");
  const [circuitState, setCircuitState] = useState<CircuitState>("idle");
  const [activeSocket, setActiveSocket] = useState<SocketId | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [leadSaved, setLeadSaved] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string>("");
  const [, startTransition] = useTransition();

  // Coordinates within the board
  const [sourcePos, setSourcePos] = useState({ x: 80, y: 160 });
  const [plugPos, setPlugPos] = useState({ x: 80, y: 220 });
  const [sockets, setSockets] = useState<SocketCoordinate[]>([]);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

  // Audio synthesis helper
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playRelayEngage = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t0 = ctx.currentTime;

      // Heavy 1/4" jack insertion click (filtered click impulse)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(320, t0);
      clickOsc.frequency.exponentialRampToValueAtTime(40, t0 + 0.05);
      clickGain.gain.setValueAtTime(0.45, t0);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t0);
      clickOsc.stop(t0 + 0.05);

      // Warm analog tube transformer hum surge
      const humOsc = ctx.createOscillator();
      const humGain = ctx.createGain();
      humOsc.type = "sawtooth";
      humOsc.frequency.setValueAtTime(60, t0 + 0.04);
      humGain.gain.setValueAtTime(0.001, t0 + 0.04);
      humGain.gain.linearRampToValueAtTime(0.09, t0 + 0.12);
      humGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
      humOsc.connect(humGain);
      humGain.connect(ctx.destination);
      humOsc.start(t0 + 0.04);
      humOsc.stop(t0 + 0.95);
    } catch {}
  }, [getAudioContext, soundEnabled]);

  const playFaultBuzz = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t0 = ctx.currentTime;

      // Harsh digital square-wave buzz (indicating an automated shortcut error)
      const buzzOsc = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      buzzOsc.type = "square";
      buzzOsc.frequency.setValueAtTime(145, t0);
      buzzGain.gain.setValueAtTime(0.28, t0);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      buzzOsc.connect(buzzGain);
      buzzGain.connect(ctx.destination);
      buzzOsc.start(t0);
      buzzOsc.stop(t0 + 0.28);
    } catch {}
  }, [getAudioContext, soundEnabled]);

  const playUnplugSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, t0);
      osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.04);
      gain.gain.setValueAtTime(0.2, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.04);
    } catch {}
  }, [getAudioContext, soundEnabled]);

  // Update element coordinates inside the console
  const updateCoordinates = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const bRect = board.getBoundingClientRect();

    if (sourceRef.current) {
      const sRect = sourceRef.current.getBoundingClientRect();
      const sx = sRect.left - bRect.left + sRect.width / 2;
      const sy = sRect.top - bRect.top + sRect.height / 2;
      setSourcePos({ x: sx, y: sy });
    }

    const newSockets: SocketCoordinate[] = [];

    if (socketAutotuneRef.current) {
      const r = socketAutotuneRef.current.getBoundingClientRect();
      newSockets.push({
        id: "algorithmic-autotune",
        x: r.left - bRect.left + r.width / 2,
        y: r.top - bRect.top + r.height / 2,
        label: "Algorithmic Auto-Tune",
        trap: true
      });
    }

    if (socketCommitteeRef.current) {
      const r = socketCommitteeRef.current.getBoundingClientRect();
      newSockets.push({
        id: "committee-feedback",
        x: r.left - bRect.left + r.width / 2,
        y: r.top - bRect.top + r.height / 2,
        label: "Committee Feedback Bus",
        trap: true
      });
    }

    if (socketAmpsRef.current) {
      const r = socketAmpsRef.current.getBoundingClientRect();
      newSockets.push({
        id: "tube-amps-and-real-guitars",
        x: r.left - bRect.left + r.width / 2,
        y: r.top - bRect.top + r.height / 2,
        label: "SP-404 & Loud Tube Amps",
        trap: false
      });
    }

    setSockets(newSockets);

    // If currently patched, align plug
    if (activeSocket) {
      const matched = newSockets.find((s) => s.id === activeSocket);
      if (matched) {
        setPlugPos({ x: matched.x, y: matched.y });
      }
    }
  }, [activeSocket]);

  useEffect(() => {
    updateCoordinates();
    window.addEventListener("resize", updateCoordinates);
    return () => window.removeEventListener("resize", updateCoordinates);
  }, [updateCoordinates]);

  // Check saved state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cgu_dispatch_lead");
    if (saved) {
      setEmail(saved);
      setLeadSaved(true);
      setActiveSocket("tube-amps-and-real-guitars");
      setCircuitState("connected");
    }
  }, []);

  // Submit Lead to Studio Intake
  const submitLead = useCallback(
    async (emailToSubmit: string) => {
      const trimmed = emailToSubmit.trim().toLowerCase();
      if (!trimmed || !trimmed.includes("@")) {
        setSubmissionFeedback("Enter your email address to lock in dispatch.");
        return;
      }

      setSubmissionFeedback("Locking in analog dispatch...");

      try {
        await createEcosystemLead({
          email: trimmed,
          fullName: "Studio Caller",
          source: "analog-patch-gate",
          interest: "Signal List · Loud Tube Amps & 404 Chops"
        });
      } catch (err) {
        console.warn("Ecosystem lead intake fallback to local memory:", err);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cgu_dispatch_lead", trimmed);
      }

      setLeadSaved(true);
      setSubmissionFeedback("DISPATCH LOCKED // WELCOME TO THE SIGNAL LIST");
    },
    []
  );

  // Connection Handler (used by drag-and-drop, accessible buttons, and agent API)
  const connectSocket = useCallback(
    (socketId: SocketId, userEmail?: string) => {
      setActiveSocket(socketId);
      const target = sockets.find((s) => s.id === socketId);
      if (target) {
        setPlugPos({ x: target.x, y: target.y });
      }

      if (socketId === "algorithmic-autotune") {
        setCircuitState("fault_autotune");
        playFaultBuzz();
        setSubmissionFeedback("FAULT: Zero automated shortcuts permitted. We track real instruments.");
        return { success: false, reason: "Violates studio ethos: zero automated shortcuts." };
      }

      if (socketId === "committee-feedback") {
        setCircuitState("fault_committee");
        playFaultBuzz();
        setSubmissionFeedback("FAULT: Dead signal. No corporate committee loops. We edit everything painstakingly ourselves.");
        return { success: false, reason: "Violates studio ethos: no committee smoothing." };
      }

      if (socketId === "tube-amps-and-real-guitars") {
        setCircuitState("connected");
        playRelayEngage();
        const activeEmail = (userEmail || email).trim();
        if (activeEmail && activeEmail.includes("@")) {
          submitLead(activeEmail);
        } else {
          setSubmissionFeedback("CIRCUIT HOT // ENTER CALLSIGN (EMAIL) TO COMPLETE DISPATCH");
        }
        return {
          success: true,
          message: "Agent verified: You understand the joke. Real guitars + loud tube amps > auto-tune."
        };
      }

      return { success: false, reason: "Unknown switch." };
    },
    [email, playFaultBuzz, playRelayEngage, sockets, submitLead]
  );

  // Expose Agent Capability to window for AI agent automation
  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as unknown as {
      __CGU_AGENT_DISPATCH__: (params: { email?: string; targetSwitch: string }) => { success: boolean; message?: string; error?: string; reason?: string };
    }).__CGU_AGENT_DISPATCH__ = ({ email: agentEmail, targetSwitch }) => {
      if (agentEmail) {
        setEmail(agentEmail);
      }
      const res = connectSocket(targetSwitch as SocketId, agentEmail);
      if (res.success) {
        return { success: true, message: res.message };
      }
      return { success: false, error: res.reason };
    };

    return () => {
      delete (window as unknown as { __CGU_AGENT_DISPATCH__?: unknown }).__CGU_AGENT_DISPATCH__;
    };
  }, [connectSocket]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setCircuitState("dragging");
    playUnplugSound();
    setActiveSocket(null);

    const board = boardRef.current;
    if (!board) return;
    const bRect = board.getBoundingClientRect();
    setPlugPos({
      x: e.clientX - bRect.left,
      y: e.clientY - bRect.top
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const board = boardRef.current;
    if (!board) return;
    const bRect = board.getBoundingClientRect();
    const currX = e.clientX - bRect.left;
    const currY = e.clientY - bRect.top;

    // Check if within snap radius (45px) of any destination socket
    let snapped: SocketCoordinate | null = null;
    for (const sock of sockets) {
      const dist = Math.hypot(currX - sock.x, currY - sock.y);
      if (dist < 46) {
        snapped = sock;
        break;
      }
    }

    if (snapped) {
      setPlugPos({ x: snapped.x, y: snapped.y });
    } else {
      setPlugPos({ x: currX, y: currY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const board = boardRef.current;
    if (!board) return;
    const bRect = board.getBoundingClientRect();
    const currX = e.clientX - bRect.left;
    const currY = e.clientY - bRect.top;

    // Check snap target
    let droppedSocket: SocketCoordinate | null = null;
    for (const sock of sockets) {
      const dist = Math.hypot(currX - sock.x, currY - sock.y);
      if (dist < 52) {
        droppedSocket = sock;
        break;
      }
    }

    if (droppedSocket) {
      connectSocket(droppedSocket.id);
    } else {
      // Spring back to resting dangling position near source
      setCircuitState("idle");
      setActiveSocket(null);
      setPlugPos({ x: sourcePos.x + 30, y: sourcePos.y + 70 });
      setSubmissionFeedback("DRAG OUTPUT CABLE INTO THE MATCHING STUDIO BUS SWITCH");
    }
  };

  // Cable Bézier curve math
  const dx = plugPos.x - sourcePos.x;
  const dy = plugPos.y - sourcePos.y;
  const dist = Math.hypot(dx, dy);
  const droop = Math.max(30, 120 - dist * 0.12);
  const midX = (sourcePos.x + plugPos.x) / 2;
  const midY = Math.max(sourcePos.y, plugPos.y) + droop;
  const cablePath = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY} ${plugPos.x} ${plugPos.y}`;

  // VU Meter angle
  let needleAngle = -26; // -20 dB rest
  if (circuitState === "dragging") needleAngle = -22;
  if (circuitState === "fault_autotune" || circuitState === "fault_committee") needleAngle = -28;
  if (circuitState === "connected") needleAngle = 24; // +3VU in the red!

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSocket === "tube-amps-and-real-guitars") {
      submitLead(email);
    } else {
      setSubmissionFeedback("Plug the master output into the loud tube amps bus to engage dispatch.");
    }
  };

  return (
    <section
      className="cg-patch-lead-gate"
      aria-label="Creatives Guide Us Signal Gate & Lead Capture"
      data-agent-gate="analog-lead-capture"
      data-agent-challenge="prove-studio-taste"
      data-agent-prompt="Which destination bus matches the studio ethos of Creatives Guide Us?"
      data-agent-clue="Independent studio in Salt Lake City: loud tube amps, SP-404 chops, real guitars, zero automated shortcuts."
    >
      {/* Machine-readable JSON-LD schema for agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Creatives Guide Us Signal Gate",
            description: "Analog studio dispatch gate requiring understanding of studio philosophy.",
            agentChallenge: {
              prompt: "To complete dispatch for Creatives Guide Us, route the master output signal to the bus switch matching our studio philosophy.",
              jokeContext:
                "Creatives Guide Us is an independent studio in Salt Lake City. We play real guitars, overdriven tube amps, Mint-Green P-Bass, SP-404 chops, Ableton sessions, and zero automated shortcuts or committee smoothing.",
              switches: [
                { id: "algorithmic-autotune", name: "Algorithmic Auto-Tune", match: false, reason: "Trap: violates zero automated shortcuts." },
                { id: "committee-feedback", name: "Committee Feedback", match: false, reason: "Trap: violates no committee smoothing." },
                { id: "tube-amps-and-real-guitars", name: "SP-404 Chops & Loud Tube Amps", match: true, reason: "True circuit: aligns with studio ethos." }
              ],
              solution: "tube-amps-and-real-guitars",
              apiMethod: "window.__CGU_AGENT_DISPATCH__({ email, targetSwitch: 'tube-amps-and-real-guitars' })"
            }
          })
        }}
      />

      <div className="cg-patch-lead-gate__stage">
        {/* Top Minimal Studio Metadata */}
        <div className="cg-patch-lead-gate__header-bar">
          <span className="cg-patch-lead-gate__tag">SALT LAKE CITY, UT · INDEPENDENT STUDIO &amp; RECORD LABEL</span>
          <div className="cg-patch-lead-gate__header-controls">
            <button
              type="button"
              className="cg-patch-audio-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? "Mute studio sounds" : "Enable studio sounds"}
              title="Toggle vintage audio effects"
            >
              <span className={`cg-patch-audio-led ${soundEnabled ? "cg-patch-audio-led--on" : ""}`} />
              <span className="cg-patch-audio-text">SOUND {soundEnabled ? "ON" : "OFF"}</span>
            </button>
            <span className="cg-agent-badge" title="Agent-ready protocol verified">AGENT-READY</span>
          </div>
        </div>

        {/* 1. CALLIGRAPHIC ANIMATED INK TITLE: creativesguide.us */}
        <div className="cg-ink-title-wrap" aria-label="Creatives Guide Us">
          <h1 className="cg-ink-title">
            {TITLE_CHARS.map((item, idx) => (
              <span
                key={`${item.char}-${idx}`}
                className={`cg-ink-char ${item.isDot ? "cg-ink-char--dot" : ""} ${hoveredLetter === idx ? "cg-ink-char--hop" : ""}`}
                style={{
                  animationDelay: `${item.delay}s`
                }}
                onMouseEnter={() => {
                  startTransition(() => setHoveredLetter(idx));
                }}
                onMouseLeave={() => {
                  startTransition(() => setHoveredLetter(null));
                }}
              >
                {item.char}
              </span>
            ))}
          </h1>
          <p className="cg-ink-title__kicker">
            Play real guitars. Chop breaks. No automated shortcuts.
          </p>
        </div>

        {/* 2. ANALOG MIXING BOARD / CONSOLE */}
        <div
          ref={boardRef}
          className={`cg-patch-console ${circuitState === "connected" ? "cg-patch-console--live" : ""}`}
        >
          {/* Chassis Corner Hex Screws */}
          <div className="cg-console-screw cg-console-screw--tl" />
          <div className="cg-console-screw cg-console-screw--tr" />
          <div className="cg-console-screw cg-console-screw--bl" />
          <div className="cg-console-screw cg-console-screw--br" />

          {/* Console Header Plate */}
          <div className="cg-console-plate">
            <div className="cg-console-plate__brand">
              <span className="cg-console-brand__title">CGU CONSOLIDATED AUDIO LABS</span>
              <span className="cg-console-brand__spec">MODEL CGU-26 · ANALOG SIGNAL DISPATCH GATE</span>
            </div>
            <div className="cg-console-plate__status">
              <span className={`cg-status-led cg-status-led--${circuitState}`} />
              <span className="cg-status-text">
                {circuitState === "connected"
                  ? "CIRCUIT CLOSED // 100W TUBE HOT"
                  : circuitState === "fault_autotune"
                    ? "FAULT // SHORT CIRCUIT"
                    : circuitState === "fault_committee"
                      ? "FAULT // DEAD SIGNAL"
                      : isDragging
                        ? "ROUTING PATCH..."
                        : "CIRCUIT OPEN // UNPATCHED"}
              </span>
            </div>
          </div>

          <div className="cg-console-main-grid">
            {/* COLUMN 1: LEAD INTAKE (EMAIL) */}
            <div className="cg-console-channel cg-console-channel--intake">
              <div className="cg-tape-label">01 // DISPATCH CALLSIGN</div>
              <form onSubmit={handleEmailSubmit} className="cg-console-form" noValidate>
                <label htmlFor="lead-dispatch-email" className="cg-console-field-label">
                  SIGNAL DISPATCH EMAIL
                </label>
                <div className="cg-console-input-wrap">
                  <input
                    id="lead-dispatch-email"
                    type="email"
                    name="email"
                    placeholder="enter your email..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (leadSaved) setLeadSaved(false);
                    }}
                    className="cg-console-input"
                    autoComplete="email"
                    required
                  />
                  <span className={`cg-input-pip ${email.includes("@") ? "cg-input-pip--valid" : ""}`} />
                </div>
                <p className="cg-console-hint">
                  {circuitState === "connected"
                    ? "Circuit engaged! Press lock to verify."
                    : "Drag the master cable into the right switch to lock in dispatch."}
                </p>
                {circuitState === "connected" && !leadSaved ? (
                  <button type="submit" className="cg-btn-lock-dispatch">
                    Lock In Dispatch →
                  </button>
                ) : null}
              </form>
            </div>

            {/* COLUMN 2: 12AX7 VACUUM TUBE & ANALOG VU METER */}
            <div className="cg-console-channel cg-console-channel--meter">
              <div className="cg-tape-label">02 // TUBE &amp; POWER STAGE</div>

              <div className="cg-meter-tube-bay">
                {/* Vacuum Tube Cage */}
                <div className="cg-tube-enclosure" title="12AX7 Dual Triode Preamp Stage">
                  <div className="cg-tube-cage">
                    <div className="cg-tube-glass">
                      <div
                        className={`cg-tube-filament ${circuitState === "connected" ? "cg-tube-filament--hot" : ""}`}
                      />
                      <div
                        className={`cg-tube-glow ${circuitState === "connected" ? "cg-tube-glow--live" : ""}`}
                      />
                    </div>
                  </div>
                  <span className="cg-tube-plate-tag">12AX7 TUBE</span>
                </div>

                {/* Vintage Simpson-style VU Meter */}
                <div className="cg-vu-meter-housing" title="Analog VU Meter">
                  <div className="cg-vu-meter-face">
                    <svg viewBox="0 0 120 70" className="cg-vu-meter-svg">
                      {/* Meter scale arc */}
                      <path
                        d="M 15 55 A 50 50 0 0 1 105 55"
                        fill="none"
                        stroke="#1a1816"
                        strokeWidth="1.5"
                      />
                      {/* Red overload zone */}
                      <path
                        d="M 85 24 A 50 50 0 0 1 105 55"
                        fill="none"
                        stroke="#8c1d18"
                        strokeWidth="3.5"
                      />
                      {/* Ticks */}
                      <text x="18" y="52" className="cg-vu-tick">-20</text>
                      <text x="36" y="36" className="cg-vu-tick">-10</text>
                      <text x="60" y="27" className="cg-vu-tick">0</text>
                      <text x="82" y="32" className="cg-vu-tick cg-vu-tick--red">+2</text>
                      <text x="100" y="48" className="cg-vu-tick cg-vu-tick--red">+3</text>
                      <text x="54" y="48" className="cg-vu-center-tag">VU</text>

                      {/* Moving Needle */}
                      <line
                        x1="60"
                        y1="64"
                        x2="60"
                        y2="12"
                        stroke="#111"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        style={{
                          transformOrigin: "60px 64px",
                          transform: `rotate(${needleAngle}deg)`,
                          transition: isDragging ? "transform 140ms ease-out" : "transform 360ms cubic-bezier(0.2, 0.8, 0.3, 1.2)"
                        }}
                      />
                      <circle cx="60" cy="64" r="4.5" fill="#222" />
                    </svg>
                  </div>
                  <span className="cg-meter-plate-tag">ANALOG BUS LEVEL</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: THE PATCH BAY (1/4" JACKS & SWITCHES) */}
            <div className="cg-console-channel cg-console-channel--patch">
              <div className="cg-tape-label">03 // PATCH BAY &amp; DESTINATIONS</div>

              <div className="cg-patch-sockets-matrix">
                {/* SOURCE JACK (Master Out) */}
                <div className="cg-patch-jack-item cg-patch-jack-item--source">
                  <div className="cg-patch-jack-head">
                    <span className="cg-jack-kicker">SIGNAL SOURCE</span>
                    <strong className="cg-jack-title">MASTER OUT</strong>
                  </div>
                  <div
                    ref={sourceRef}
                    className="cg-phone-jack cg-phone-jack--source"
                    title="Master Output: Real guitars & tube heads"
                    data-agent-source="tube-amp-master"
                  >
                    <div className="cg-jack-bezel">
                      <div className="cg-jack-aperture" />
                    </div>
                  </div>
                  <span className="cg-jack-sub">REAL GUITARS &amp; TUBE HEAD</span>
                </div>

                {/* DESTINATION SWITCH A: Algorithmic Shortcuts (Trap 1) */}
                <div
                  ref={socketAutotuneRef}
                  className={`cg-patch-jack-item cg-patch-jack-item--dest ${activeSocket === "algorithmic-autotune" ? "cg-patch-jack-item--active" : ""}`}
                  data-agent-switch="algorithmic-autotune"
                  data-agent-trap="true"
                >
                  <div className="cg-patch-jack-head">
                    <span className="cg-jack-kicker">BUS A</span>
                    <strong className="cg-jack-title">AUTO-TUNE BOT</strong>
                  </div>
                  <div
                    className="cg-phone-jack cg-phone-jack--dest"
                    title="Algorithmic Auto-Tune and shortcuts"
                    onClick={() => connectSocket("algorithmic-autotune")}
                  >
                    <div className="cg-jack-bezel">
                      <div className="cg-jack-aperture" />
                    </div>
                  </div>
                  <span className="cg-jack-sub">One-click AI shortcuts</span>
                  <button
                    type="button"
                    className="cg-agent-patch-btn"
                    data-agent-action="connect"
                    data-agent-target="algorithmic-autotune"
                    onClick={() => connectSocket("algorithmic-autotune")}
                    aria-label="Patch cable to Algorithmic Auto-Tune (Trap)"
                  >
                    Patch to Bus A
                  </button>
                </div>

                {/* DESTINATION SWITCH B: Committee Feedback (Trap 2) */}
                <div
                  ref={socketCommitteeRef}
                  className={`cg-patch-jack-item cg-patch-jack-item--dest ${activeSocket === "committee-feedback" ? "cg-patch-jack-item--active" : ""}`}
                  data-agent-switch="committee-feedback"
                  data-agent-trap="true"
                >
                  <div className="cg-patch-jack-head">
                    <span className="cg-jack-kicker">BUS B</span>
                    <strong className="cg-jack-title">COMMITTEE REVISIONS</strong>
                  </div>
                  <div
                    className="cg-phone-jack cg-phone-jack--dest"
                    title="Endless committee feedback chains"
                    onClick={() => connectSocket("committee-feedback")}
                  >
                    <div className="cg-jack-bezel">
                      <div className="cg-jack-aperture" />
                    </div>
                  </div>
                  <span className="cg-jack-sub">47-person focus group</span>
                  <button
                    type="button"
                    className="cg-agent-patch-btn"
                    data-agent-action="connect"
                    data-agent-target="committee-feedback"
                    onClick={() => connectSocket("committee-feedback")}
                    aria-label="Patch cable to Committee Revisions (Trap)"
                  >
                    Patch to Bus B
                  </button>
                </div>

                {/* DESTINATION SWITCH C: Loud Tube Amps & 404 Chops (THE TRUE JOKE / TARGET) */}
                <div
                  ref={socketAmpsRef}
                  className={`cg-patch-jack-item cg-patch-jack-item--dest cg-patch-jack-item--true ${activeSocket === "tube-amps-and-real-guitars" ? "cg-patch-jack-item--active cg-patch-jack-item--live" : ""}`}
                  data-agent-switch="tube-amps-and-real-guitars"
                  data-agent-valid="true"
                >
                  <div className="cg-patch-jack-head">
                    <span className="cg-jack-kicker cg-jack-kicker--gold">BUS C · DIRECT</span>
                    <strong className="cg-jack-title">404 CHOP &amp; TUBE AMPS</strong>
                  </div>
                  <div
                    className="cg-phone-jack cg-phone-jack--dest cg-phone-jack--true"
                    title="Real guitars, SP-404 chops & loud tube amps"
                    onClick={() => connectSocket("tube-amps-and-real-guitars")}
                  >
                    <div className="cg-jack-bezel">
                      <div className="cg-jack-aperture" />
                    </div>
                  </div>
                  <span className="cg-jack-sub">Salt Lake City · No shortcuts</span>
                  <button
                    type="button"
                    className="cg-agent-patch-btn"
                    data-agent-action="connect"
                    data-agent-target="tube-amps-and-real-guitars"
                    onClick={() => connectSocket("tube-amps-and-real-guitars")}
                    aria-label="Patch cable to SP-404 Chops and Loud Tube Amps (True Circuit)"
                  >
                    Patch to Bus C
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Flexible Patch Cable Overlay */}
          <svg className="cg-patch-cable-canvas" aria-hidden="true">
            {/* Shadow path */}
            <path
              d={cablePath}
              fill="none"
              stroke="rgba(0, 0, 0, 0.35)"
              strokeWidth="10"
              strokeLinecap="round"
              className="cg-cable-shadow"
            />
            {/* Braided outer jacket */}
            <path
              d={cablePath}
              fill="none"
              stroke="#1a1816"
              strokeWidth="7"
              strokeLinecap="round"
              className="cg-cable-outer"
            />
            {/* Braided thread texture highlight */}
            <path
              d={cablePath}
              fill="none"
              stroke="#8c6d48"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
              className="cg-cable-braid"
            />
          </svg>

          {/* Draggable 1/4" Metal Jack Plug Tip */}
          <div
            className={`cg-draggable-plug ${isDragging ? "cg-draggable-plug--dragging" : ""} ${activeSocket ? "cg-draggable-plug--plugged" : ""}`}
            style={{
              left: `${plugPos.x}px`,
              top: `${plugPos.y}px`
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            aria-label="Draggable 1/4 inch studio audio patch cable"
            aria-valuetext={activeSocket || "unplugged"}
            tabIndex={0}
          >
            <div className="cg-plug-body">
              <div className="cg-plug-brass-tip" />
              <div className="cg-plug-insulator" />
              <div className="cg-plug-chrome-ring" />
              <div className="cg-plug-barrel">
                <span className="cg-plug-knurl" />
                <span className="cg-plug-knurl" />
              </div>
              <div className="cg-plug-strain-relief" />
            </div>
            {!activeSocket && !isDragging ? (
              <span className="cg-plug-drag-hint">DRAG TO SWITCH</span>
            ) : null}
          </div>

          {/* Digital LED readout tape */}
          <div className="cg-console-readout-strip">
            <span className="cg-readout-prefix">READOUT //</span>
            <span className="cg-readout-message">
              {submissionFeedback ||
                (circuitState === "connected"
                  ? "CIRCUIT CLOSED // WELCOME TO THE SIGNAL LIST"
                  : "AWAITING CIRCUIT CONNECTION · ROUTE OUTPUT TO COMPLETE DISPATCH")}
            </span>
          </div>
        </div>

        {/* 3. TRANSITION TO BROADSHEET EDITORIAL */}
        <div className="cg-patch-lead-gate__footer">
          <a
            href="#broadsheet-editorial"
            className="cg-patch-broadsheet-jump"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("broadsheet-editorial");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span>Enter Studio Broadsheet</span>
            <span className="cg-jump-arrow">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
