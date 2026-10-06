import { execSync } from "node:child_process";
import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const cguPublicImages = "/Users/seanhalls/Desktop/sh/cgu_master/public/images";
const shoPublicAssets = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/assets";
const shoProjectAssets = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/assets/projects";
const namastayPublic = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/namastay";
const namastayClient = "/Users/seanhalls/Desktop/sh/clients/namastay";
const tbmThemeImages = "/Users/seanhalls/Desktop/sh/clients/tbm_master/tbm/wordpress/wp-content/themes/tbm/assets/images";

mkdirSync(cguPublicImages, { recursive: true });
mkdirSync(shoPublicAssets, { recursive: true });
mkdirSync(shoProjectAssets, { recursive: true });
mkdirSync(namastayPublic, { recursive: true });
mkdirSync(namastayClient, { recursive: true });
mkdirSync(tbmThemeImages, { recursive: true });

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildPosterSvg(cfg) {
  const titleFontSize = cfg.titleFontSize || (cfg.title.length > 20 ? 35 : (cfg.title.length > 16 ? 38 : 42));
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg_${cfg.slug}" cx="60%" cy="30%" r="85%">
      <stop offset="0%" stop-color="${cfg.glow0}"/>
      <stop offset="45%" stop-color="${cfg.glow45}"/>
      <stop offset="100%" stop-color="${cfg.glow100}"/>
    </radialGradient>
    <pattern id="grid_${cfg.slug}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.022)" stroke-width="1"/>
    </pattern>
    <linearGradient id="accentGrad_${cfg.slug}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${cfg.accent}"/>
      <stop offset="60%" stop-color="${cfg.accentLight}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg_${cfg.slug})"/>
  <rect width="1200" height="630" fill="url(#grid_${cfg.slug})"/>

  <!-- Outer Double Borders -->
  <rect x="36" y="36" width="1128" height="558" rx="16" fill="none" stroke="${cfg.accent}" stroke-opacity="0.28" stroke-width="1.5"/>
  <rect x="44" y="44" width="1112" height="542" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>

  <!-- Corner Crosshairs -->
  <path d="M 30 36 L 42 36 M 36 30 L 36 42" stroke="${cfg.accent}" stroke-opacity="0.6" stroke-width="1.5"/>
  <path d="M 1158 36 L 1170 36 M 1164 30 L 1164 42" stroke="${cfg.accent}" stroke-opacity="0.6" stroke-width="1.5"/>
  <path d="M 30 594 L 42 594 M 36 588 L 36 600" stroke="${cfg.accent}" stroke-opacity="0.6" stroke-width="1.5"/>
  <path d="M 1158 594 L 1170 594 M 1164 588 L 1164 600" stroke="${cfg.accent}" stroke-opacity="0.6" stroke-width="1.5"/>

  <!-- Top System Tag -->
  <g transform="translate(68, 64)">
    <rect width="${cfg.tagWidth || 430}" height="30" rx="5" fill="${cfg.accent}" fill-opacity="0.08" stroke="${cfg.accent}" stroke-opacity="0.35" stroke-width="1"/>
    <text x="14" y="19" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="${cfg.accent}">${escapeXml(cfg.tag)}</text>
  </g>

  <!-- Left Narrative Display -->
  <text x="68" y="142" font-family="Helvetica, Arial, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="#ffffff">${escapeXml(cfg.title)}</text>
  <text x="68" y="174" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="${cfg.accentLight}">${escapeXml(cfg.subtitle)}</text>

  <text x="68" y="216" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#94a3b8">${escapeXml(cfg.lede1)}</text>
  <text x="68" y="238" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#94a3b8">${escapeXml(cfg.lede2)}</text>

  <!-- Left Architecture Cards -->
  <g transform="translate(68, 276)">
    <!-- Card 1 -->
    <rect width="456" height="74" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
    <circle cx="22" cy="26" r="5" fill="${cfg.accent}"/>
    <text x="36" y="29" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#e2e8f0">${escapeXml(cfg.chip1Title)}</text>
    <text x="36" y="51" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#94a3b8">${escapeXml(cfg.chip1Text)}</text>
    
    <!-- Card 2 -->
    <g transform="translate(0, 88)">
      <rect width="456" height="74" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      <circle cx="22" cy="26" r="5" fill="${cfg.accentLight}"/>
      <text x="36" y="29" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#e2e8f0">${escapeXml(cfg.chip2Title)}</text>
      <text x="36" y="51" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#94a3b8">${escapeXml(cfg.chip2Text)}</text>
    </g>
  </g>

  <!-- Right Branded Dark-Mode Workspace (Live UI/Product Surface Preview) -->
  <g transform="translate(554, 64)">
    <!-- Workspace Outer Window -->
    <rect width="578" height="428" rx="10" fill="#060a0f" stroke="${cfg.accent}" stroke-opacity="0.35" stroke-width="1.2"/>
    
    <!-- Window Header -->
    <path d="M 0 10 Q 0 0 10 0 L 568 0 Q 578 0 578 10 L 578 36 L 0 36 Z" fill="rgba(255, 255, 255, 0.04)"/>
    <line x1="0" y1="36" x2="578" y2="36" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
    
    <!-- Window Controls -->
    <circle cx="20" cy="18" r="4.5" fill="#ef4444" opacity="0.8"/>
    <circle cx="34" cy="18" r="4.5" fill="#f59e0b" opacity="0.8"/>
    <circle cx="48" cy="18" r="4.5" fill="#10b981" opacity="0.8"/>
    
    <!-- Window Title -->
    <text x="68" y="22" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="${cfg.accentLight}">${escapeXml(cfg.windowTitle)}</text>
    
    <!-- Live Status Pill on Right -->
    <rect x="${cfg.statusPillX || 460}" y="9" width="${cfg.statusPillWidth || 102}" height="18" rx="4" fill="${cfg.accent}" fill-opacity="0.15" stroke="${cfg.accent}" stroke-opacity="0.4" stroke-width="0.8"/>
    <circle cx="${(cfg.statusPillX || 460) + 12}" cy="18" r="3" fill="${cfg.accent}"/>
    <text x="${(cfg.statusPillX || 460) + 20}" y="21" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="${cfg.accentLight}">${escapeXml(cfg.statusPillText || "ONLINE")}</text>

    <!-- Inner UI Surface Content -->
    ${cfg.innerWorkspaceSvg}
  </g>

  <!-- Bottom Badges (Left) -->
  <g transform="translate(68, 528)">
    <rect x="0" y="0" width="${cfg.b1Width || 155}" height="38" rx="6" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)"/>
    <text x="${(cfg.b1Width || 155) / 2}" y="24" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0" text-anchor="middle">${escapeXml(cfg.badge1)}</text>

    <rect x="${(cfg.b1Width || 155) + 15}" y="0" width="${cfg.b2Width || 175}" height="38" rx="6" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)"/>
    <text x="${(cfg.b1Width || 155) + 15 + ((cfg.b2Width || 175) / 2)}" y="24" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0" text-anchor="middle">${escapeXml(cfg.badge2)}</text>

    <rect x="${(cfg.b1Width || 155) + 15 + (cfg.b2Width || 175) + 15}" y="0" width="${cfg.b3Width || 165}" height="38" rx="6" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)"/>
    <text x="${(cfg.b1Width || 155) + 15 + (cfg.b2Width || 175) + 15 + ((cfg.b3Width || 165) / 2)}" y="24" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0" text-anchor="middle">${escapeXml(cfg.badge3)}</text>
  </g>

  <!-- Bottom Domain Pill (Right) -->
  <g transform="translate(${cfg.domainPillX || 920}, 528)">
    <rect width="${cfg.domainPillWidth || 212}" height="38" rx="6" fill="${cfg.accent}" fill-opacity="0.12" stroke="${cfg.accent}" stroke-opacity="0.45"/>
    <text x="${(cfg.domainPillWidth || 212) / 2}" y="24" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="${cfg.accentLight}" text-anchor="middle">${escapeXml(cfg.domain)} ↗</text>
  </g>
</svg>`;
}

const posters = [
  // 01: Total Body Modification
  {
    slug: "total-body-modification",
    accent: "#10b981",
    accentLight: "#34d399",
    glow0: "#0d261e",
    glow45: "#071510",
    glow100: "#030806",
    tag: "[ 01 // DUAL-SURFACE WELLNESS · LIVETBM.COM ]",
    tagWidth: 410,
    title: "Total Body Modification",
    subtitle: "Dual-Surface Wellness Platform & Live Session Rooms",
    lede1: "Commerce-to-session platform linking WooCommerce scheduling,",
    lede2: "practitioner workflows, assessments, and real-time rooms.",
    chip1Title: "CONNECT SERVICE RUNTIME",
    chip1Text: "Node.js + Socket.IO · WebRTC Mesh · 12ms Telemetry Loop",
    chip2Title: "SOURCE OF TRUTH ARCHITECTURE",
    chip2Text: "WordPress + WooCommerce · Attunement Lifecycle & Assessments",
    windowTitle: "TBM_CONNECT // LIVE_SESSION_ROOM",
    statusPillText: "ROOM ACTIVE",
    badge1: "WordPress + Woo",
    b1Width: 155,
    badge2: "Node.js + Socket.IO",
    b2Width: 175,
    badge3: "Live Session Room",
    b3Width: 165,
    domain: "LIVETBM.COM",
    domainPillX: 940,
    domainPillWidth: 192,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="262" height="160" rx="8" fill="#0b1a14" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1"/>
        <circle cx="131" cy="70" r="30" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
        <path d="M 113 95 C 113 85, 149 85, 149 95 Z" fill="rgba(16, 185, 129, 0.25)"/>
        <rect x="10" y="10" width="145" height="20" rx="4" fill="rgba(0,0,0,0.65)"/>
        <text x="18" y="24" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#ffffff">DR. PRACTITIONER · HOST</text>
        <rect x="10" y="132" width="90" height="16" rx="3" fill="rgba(0,0,0,0.65)"/>
        <rect x="16" y="137" width="60" height="6" rx="2" fill="#10b981"/>
      </g>
      <g transform="translate(280, 0)">
        <rect width="262" height="160" rx="8" fill="#0b1a14" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
        <circle cx="131" cy="70" r="30" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1"/>
        <path d="M 113 95 C 113 85, 149 85, 149 95 Z" fill="rgba(255, 255, 255, 0.15)"/>
        <rect x="10" y="10" width="130" height="20" rx="4" fill="rgba(0,0,0,0.65)"/>
        <text x="18" y="24" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#94a3b8">CLIENT SESSION ROOM</text>
        <rect x="172" y="132" width="80" height="16" rx="3" fill="rgba(16, 185, 129, 0.2)"/>
        <text x="180" y="143" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#6ee7b7">1080p WebRTC</text>
      </g>
    </g>
    <g transform="translate(18, 226)">
      <rect width="542" height="186" rx="8" fill="#030806" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1"/>
      <rect width="542" height="28" rx="8 8 0 0" fill="rgba(255,255,255,0.02)"/>
      <text x="14" y="18" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">SESSION TELEMETRY &amp; ASSESSMENT PIPELINE</text>
      <text x="450" y="18" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#10b981">LATENCY: 12ms</text>
      <g transform="translate(14, 44)">
        <circle cx="4" cy="6" r="3" fill="#10b981"/>
        <text x="16" y="10" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[AUTH] Token verified via WordPress REST API · Attunement #A-7419</text>
        <circle cx="4" cy="28" r="3" fill="#10b981"/>
        <text x="16" y="32" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[WEBRTC] Peer connection established · ICE state: CONNECTED</text>
        <circle cx="4" cy="50" r="3" fill="#34d399"/>
        <text x="16" y="54" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[ASSESS] Intake questionnaire gated &amp; synced · Practitioner notes ready</text>
        <circle cx="4" cy="72" r="3" fill="#6ee7b7"/>
        <text x="16" y="76" font-family="Courier, monospace" font-size="11" fill="#94a3b8">[SOCKET] Room heartbeat active · 60s attune_log buffer flushed</text>
        <g transform="translate(0, 94)">
          <rect width="514" height="6" rx="3" fill="rgba(255, 255, 255, 0.08)"/>
          <rect width="390" height="6" rx="3" fill="#10b981"/>
          <text x="0" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">SESSION ELAPSED: 38:15 / 50:00</text>
          <text x="410" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#34d399">76% COMPLETED</text>
        </g>
      </g>
    </g>`
  },

  // 02: Followup Care Operations
  {
    slug: "followup-care",
    accent: "#2dd4bf",
    accentLight: "#5eead4",
    glow0: "#0d262d",
    glow45: "#07161b",
    glow100: "#030a0d",
    tag: "[ 02 // HEALTHCARE OPERATIONS · APP.FOLLOWUP.CARE ]",
    tagWidth: 430,
    title: "Followup Care Operations",
    titleFontSize: 34,
    subtitle: "Clinical Queue Orchestration & Care-Team Coordination",
    lede1: "Healthcare ops platform modernizing patient queues, notifications,",
    lede2: "compliance telemetry, and admin control across clinical programs.",
    chip1Title: "CLINICAL DISCHARGE QUEUE",
    chip1Text: "High-volume patient tracking · Automated SLA escalation triggers",
    chip2Title: "CARE-TEAM DISPATCH ENGINE",
    chip2Text: "Role-gated task assignment · Encrypted HIPAA-compliant audit logs",
    windowTitle: "FOLLOWUP_OPS // PATIENT_QUEUE_MONITOR",
    statusPillText: "QUEUE LIVE",
    badge1: "Angular + Ionic",
    b1Width: 150,
    badge2: "Node.js + SQL",
    b2Width: 150,
    badge3: "Clinical Telemetry",
    b3Width: 175,
    domain: "APP.FOLLOWUP.CARE",
    domainPillX: 910,
    domainPillWidth: 222,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="42" rx="8" fill="#07181f" stroke="rgba(45, 212, 191, 0.25)" stroke-width="1"/>
        <text x="20" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#5eead4">ACTIVE QUEUE: 48</text>
        <text x="210" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">DISCHARGE SYNC: 100%</text>
        <text x="410" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#2dd4bf">SLA ON-TRACK: 99.8%</text>
      </g>
      <g transform="translate(0, 52)">
        <rect width="542" height="26" rx="4" fill="rgba(255,255,255,0.03)"/>
        <text x="14" y="17" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#64748b">PATIENT ENCOUNTER</text>
        <text x="180" y="17" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#64748b">CLINICAL DEPARTMENT</text>
        <text x="360" y="17" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#64748b">SLA STATUS</text>
        <text x="460" y="17" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#64748b">ACTION</text>
      </g>
      <g transform="translate(0, 84)">
        <rect width="542" height="48" rx="6" fill="#040c10" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="16" cy="24" r="4" fill="#ef4444"/>
        <text x="28" y="28" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">ID #10842</text>
        <text x="180" y="28" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Post-Op Cardiology</text>
        <rect x="360" y="14" width="76" height="20" rx="3" fill="rgba(239, 68, 68, 0.2)"/>
        <text x="372" y="28" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#f87171">HIGH PRIORITY</text>
        <text x="460" y="28" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#5eead4">DISPATCHED ✓</text>
      </g>
      <g transform="translate(0, 138)">
        <rect width="542" height="48" rx="6" fill="#040c10" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="16" cy="24" r="4" fill="#2dd4bf"/>
        <text x="28" y="28" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">ID #10843</text>
        <text x="180" y="28" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Pulmonary Recovery</text>
        <rect x="360" y="14" width="68" height="20" rx="3" fill="rgba(45, 212, 191, 0.15)"/>
        <text x="372" y="28" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2dd4bf">ROUTINE</text>
        <text x="460" y="28" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#94a3b8">CALL SENT</text>
      </g>
      <g transform="translate(0, 192)">
        <rect width="542" height="48" rx="6" fill="#040c10" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="16" cy="24" r="4" fill="#10b981"/>
        <text x="28" y="28" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">ID #10844</text>
        <text x="180" y="28" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Orthopedic Day Stay</text>
        <rect x="360" y="14" width="68" height="20" rx="3" fill="rgba(16, 185, 129, 0.15)"/>
        <text x="372" y="28" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#34d399">RESOLVED</text>
        <text x="460" y="28" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#34d399">CLOSED ✓</text>
      </g>
      <g transform="translate(0, 252)">
        <rect width="542" height="110" rx="8" fill="#02070a" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">CARE COORDINATION TELEMETRY</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[ORCHESTRATION] Daily census batch synced: 320 encounters</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[HIPAA] TLS 1.3 encrypted end-to-end · Audit trail verified</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#5eead4">[METRIC] Mean time to patient follow-up: 4.2 hours (Target &lt; 24h)</text>
      </g>
    </g>`
  },

  // 03: Cluck Design
  {
    slug: "cluck-design",
    accent: "#f97316",
    accentLight: "#fb923c",
    glow0: "#2a1408",
    glow45: "#160b04",
    glow100: "#080402",
    tag: "[ 03 // ARCHITECTURAL BRAND SYSTEM · CLUCKDESIGN.COM ]",
    tagWidth: 440,
    title: "Cluck Design",
    subtitle: "Architectural Studio Brand Presence & Project Showcase",
    lede1: "Custom WordPress brand system pairing a bespoke theme with",
    lede2: "reveal-driven storytelling and editorial contact surfaces.",
    chip1Title: "EDITORIAL UX & NARRATIVE REVEALS",
    chip1Text: "Signature wipe-down/wipe-up overlays · IntersectionObserver transitions",
    chip2Title: "BESPOKE THEME ARCHITECTURE",
    chip2Text: "Hello Elementor Child theme · Architectural project portfolio",
    windowTitle: "CLUCK_STUDIO // ARCHITECTURAL_INDEX",
    statusPillText: "CAD ACTIVE",
    badge1: "Custom Theme",
    b1Width: 145,
    badge2: "WordPress Core",
    b2Width: 155,
    badge3: "Editorial UX",
    b3Width: 145,
    domain: "CLUCKDESIGN.COM",
    domainPillX: 910,
    domainPillWidth: 222,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="200" rx="8" fill="#0d0703" stroke="rgba(249, 115, 22, 0.25)" stroke-width="1"/>
        <line x1="20" y1="40" x2="522" y2="40" stroke="rgba(249, 115, 22, 0.15)" stroke-dasharray="4 4"/>
        <line x1="20" y1="100" x2="522" y2="100" stroke="rgba(249, 115, 22, 0.15)" stroke-dasharray="4 4"/>
        <line x1="20" y1="160" x2="522" y2="160" stroke="rgba(249, 115, 22, 0.15)" stroke-dasharray="4 4"/>
        <line x1="180" y1="20" x2="180" y2="180" stroke="rgba(249, 115, 22, 0.15)" stroke-dasharray="4 4"/>
        <line x1="360" y1="20" x2="360" y2="180" stroke="rgba(249, 115, 22, 0.15)" stroke-dasharray="4 4"/>
        <g transform="translate(24, 24)">
          <rect width="240" height="152" rx="6" fill="#180c05" stroke="rgba(249, 115, 22, 0.4)" stroke-width="1"/>
          <rect x="12" y="12" width="216" height="84" rx="4" fill="rgba(249, 115, 22, 0.1)"/>
          <text x="20" y="32" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fb923c">INKWELL APARTMENTS</text>
          <text x="20" y="52" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#94a3b8">NoDa Arts District · 4 Stories</text>
          <text x="20" y="80" font-family="Courier, monospace" font-size="8.5" fill="#f97316">65 UNITS + GROUND RETAIL</text>
          <rect x="12" y="108" width="90" height="16" rx="3" fill="rgba(249, 115, 22, 0.2)"/>
          <text x="20" y="120" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#fed7aa">CHARLOTTE, NC ↗</text>
        </g>
        <g transform="translate(278, 24)">
          <rect width="240" height="152" rx="6" fill="#180c05" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
          <rect x="12" y="12" width="216" height="84" rx="4" fill="rgba(255, 255, 255, 0.05)"/>
          <text x="20" y="32" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">PHAT BURRITO</text>
          <text x="20" y="52" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#94a3b8">Beloved South End Landmark</text>
          <text x="20" y="80" font-family="Courier, monospace" font-size="8.5" fill="#94a3b8">LOSO VILLAGE RESTORATION</text>
          <rect x="12" y="108" width="70" height="16" rx="3" fill="rgba(236, 0, 140, 0.25)"/>
          <text x="20" y="120" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#f472b6">#EC008C</text>
        </g>
      </g>
      <g transform="translate(0, 214)">
        <rect width="542" height="148" rx="8" fill="#050201" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">INTERACTION ENGINE &amp; SPATIAL GRID</text>
        <text x="16" y="52" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[THEME] Hello Elementor Child · Custom reveal.php architecture</text>
        <text x="16" y="74" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[ANIMATION] Signature wipe-down / wipe-up overlay triggers</text>
        <text x="16" y="96" font-family="Courier, monospace" font-size="11" fill="#fb923c">[PROJECTS] Inkwell (NoDa), Phat Burrito (LoSo), E.L.K (Monroe)</text>
        <text x="16" y="118" font-family="Courier, monospace" font-size="11" fill="#fed7aa">[CTA SURFACES] &apos;Find out what Cluck can do for you&apos; · Get-in-touch reveal</text>
      </g>
    </g>`
  },

  // 04: World Cup Dreams Foundation
  {
    slug: "world-cup-dreams",
    accent: "#38bdf8",
    accentLight: "#7dd3fc",
    glow0: "#0c2438",
    glow45: "#061320",
    glow100: "#030a12",
    tag: "[ 04 // ATHLETE GRANT PORTAL · WORLDCUPDREAMS.ORG ]",
    tagWidth: 440,
    title: "World Cup Dreams",
    subtitle: "Athlete Grant Portal & Donor Campaign Platform",
    lede1: "Athlete-first WordPress ecosystem clarifying grant pathways",
    lede2: "and accelerating donor momentum for world-class athletes.",
    chip1Title: "HISTORICAL IMPACT ALLOCATION",
    chip1Text: "Over $7,000,000 granted to elite snowsport athletes since inception",
    chip2Title: "FOUNDED BY ATHLETES FOR ATHLETES",
    chip2Text: "Founded by US Ski Team athletes Bryon Friedman, Scott Macartney & Erik Schlopy",
    windowTitle: "WCD_FOUNDATION // GRANT_ALLOCATION_MONITOR",
    statusPillText: "501(c)(3) ACTIVE",
    badge1: "$7M+ Granted",
    b1Width: 145,
    badge2: "By & For Athletes",
    b2Width: 165,
    badge3: "WordPress Core",
    b3Width: 150,
    domain: "WORLDCUPDREAMS.ORG",
    domainPillX: 890,
    domainPillWidth: 242,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="74" rx="8" fill="#071b29" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="18" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#7dd3fc">HISTORIC ATHLETE GRANT DISBURSEMENTS</text>
        <text x="18" y="46" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">$7,000,000+</text>
        <text x="160" y="46" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#94a3b8">GRANTED TO ELITE ATHLETES</text>
        <rect x="340" y="22" width="180" height="24" rx="4" fill="rgba(56, 189, 248, 0.2)"/>
        <text x="355" y="38" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">BY THE ATHLETE · FOR THE ATHLETE</text>
        <rect x="18" y="58" width="506" height="5" rx="2.5" fill="#38bdf8"/>
      </g>
      <g transform="translate(0, 86)">
        <rect width="542" height="152" rx="8" fill="#040e16" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">ACTIVE WCDF GRANT PROGRAM SUITE</text>
        <g transform="translate(16, 34)">
          <circle cx="6" cy="10" r="4" fill="#38bdf8"/>
          <text x="20" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">T2 ON THE RISE GRANT</text>
          <text x="220" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Top 300 World-Ranked Competitors</text>
          <rect x="420" y="2" width="86" height="18" rx="3" fill="rgba(16, 185, 129, 0.2)"/>
          <text x="430" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#34d399">ACTIVE GRANT ✓</text>
        </g>
        <g transform="translate(16, 68)">
          <circle cx="6" cy="10" r="4" fill="#38bdf8"/>
          <text x="20" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">T2 WORLD CUP GRANT</text>
          <text x="220" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">World Cup &amp; Olympic Chasers</text>
          <rect x="420" y="2" width="86" height="18" rx="3" fill="rgba(56, 189, 248, 0.2)"/>
          <text x="435" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#7dd3fc">ACTIVE GRANT ✓</text>
        </g>
        <g transform="translate(16, 102)">
          <circle cx="6" cy="10" r="4" fill="#38bdf8"/>
          <text x="20" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">ARCO &amp; FREESTYLE GRANTS</text>
          <text x="220" y="14" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Need-Based Financial Support</text>
          <rect x="420" y="2" width="86" height="18" rx="3" fill="rgba(56, 189, 248, 0.2)"/>
          <text x="435" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#7dd3fc">ACTIVE GRANT ✓</text>
        </g>
      </g>
      <g transform="translate(0, 250)">
        <rect width="542" height="112" rx="8" fill="#02080d" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">FOUNDATION LEADERSHIP &amp; DONOR INFRASTRUCTURE</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[FOUNDERS] Former US Ski Team Athletes B. Friedman, S. Macartney, E. Schlopy</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[MISSION] 501(c)(3) empowering winter athletes to overcome financial barriers</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#7dd3fc">[STRIPE] Automated recurrence engine · Direct donor-to-athlete funding</text>
      </g>
    </g>`
  },

  // 05: Appreesh
  {
    slug: "appreesh",
    accent: "#c084fc",
    accentLight: "#e9d5ff",
    glow0: "#220e36",
    glow45: "#12071d",
    glow100: "#07020c",
    tag: "[ 05 // GRATITUDE PROTOCOL · APPREESH.ORG ]",
    tagWidth: 390,
    title: "Appreesh Protocol",
    subtitle: "Gratitude Gifting Protocol & Tribute Workspace",
    lede1: "Ritual-first gratitude prototype pairing a live public web surface",
    lede2: "with a Solana/Anchor tribute workspace and protocol mechanics.",
    chip1Title: "SOLANA MAINNET TOKEN-2022",
    chip1Text: "Official Mint: ErPxU4cjMDHg5ZKuxVFnnw7hZW5SvkCCThJJNxsWjWRr",
    chip2Title: "SQUADS 2-OF-3 MULTISIG CUSTODY",
    chip2Text: "3,000,000 Fixed Supply · 0% Inflation · Sovereign tribute routing",
    windowTitle: "APPREESH // SOLANA_MAINNET_VERIFICATION",
    statusPillText: "TOKEN LIVE",
    badge1: "Solana Token-2022",
    b1Width: 165,
    badge2: "Squads Multisig",
    b2Width: 155,
    badge3: "3M Fixed Supply",
    b3Width: 155,
    domain: "APPREESH.ORG",
    domainPillX: 930,
    domainPillWidth: 202,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="42" rx="8" fill="#140924" stroke="rgba(192, 132, 252, 0.3)" stroke-width="1"/>
        <text x="20" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#e9d5ff">CLUSTER: SOLANA MAINNET-BETA</text>
        <text x="230" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">TOKEN-2022 STANDARD</text>
        <text x="400" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#c084fc">3M FIXED SUPPLY</text>
      </g>
      <g transform="translate(0, 52)">
        <rect width="542" height="154" rx="8" fill="#0d0417" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <g transform="translate(20, 20)">
          <circle cx="36" cy="36" r="32" fill="rgba(192, 132, 252, 0.15)" stroke="rgba(192, 132, 252, 0.4)" stroke-width="1"/>
          <path d="M 36 18 C 30 28, 26 34, 30 42 C 33 48, 42 48, 44 42 C 46 36, 40 32, 36 18 Z" fill="#c084fc"/>
          <text x="88" y="24" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">$APPREESH — THE TOKEN OF GRATITUDE</text>
          <text x="88" y="44" font-family="Courier, monospace" font-size="10" fill="#c084fc">MINT: ErPxU4cjMDHg5ZKuxVFnnw7hZW5SvkCCThJJNxsWjWRr</text>
          <text x="88" y="64" font-family="Georgia, serif" font-size="11.5" font-style="italic" fill="#e2e8f0">&quot;Gratitude is the only sovereign currency.&quot;</text>
          <text x="88" y="84" font-family="Courier, monospace" font-size="10" fill="#a855f7">CUSTODY: SQUADS 2-OF-3 MULTISIG (v4.squads.so)</text>
          <rect x="88" y="94" width="165" height="20" rx="4" fill="rgba(192, 132, 252, 0.2)"/>
          <text x="96" y="108" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#e9d5ff">VERIFIED MAINNET MINT ✓</text>
        </g>
      </g>
      <g transform="translate(0, 218)">
        <rect width="542" height="144" rx="8" fill="#06010a" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">PROTOCOL SURFACES &amp; VERIFICATION LOG</text>
        <g transform="translate(16, 46)">
          <circle cx="4" cy="6" r="3" fill="#c084fc"/>
          <text x="16" y="10" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[SECTIONS] Send Appreciation (/tribute) · Appreeshonomics (/tokenomics)</text>
          <circle cx="4" cy="28" r="3" fill="#c084fc"/>
          <text x="16" y="32" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[GOVERNANCE] Council &amp; DAO (/dao) · Lore Bible (/lore) · Manifest JSON</text>
          <circle cx="4" cy="50" r="3" fill="#e9d5ff"/>
          <text x="16" y="54" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[TOKENOMICS] 3,000,000 Fixed Supply · 0% Inflation · Sovereign Protocol</text>
          <circle cx="4" cy="72" r="3" fill="#a855f7"/>
          <text x="16" y="76" font-family="Courier, monospace" font-size="11" fill="#94a3b8">[SECURITY] Squads 2-of-3 Multisig custody · Zero mint authority exploit</text>
        </g>
      </g>
    </g>`
  },

  // 06: Lead Me Guide Me
  {
    slug: "lead-me-guide-me",
    accent: "#fbbf24",
    accentLight: "#fde68a",
    glow0: "#2a1c07",
    glow45: "#160e03",
    glow100: "#080501",
    tag: "[ 06 // GOSPEL REHEARSAL COMPANION · LEADMEGUIDEME.ORG ]",
    tagWidth: 460,
    title: "Lead Me Guide Me",
    subtitle: "Gospel Choir Rehearsal Companion & Scripture App",
    lede1: "SwiftUI iOS companion pairing daily scripture meditations with",
    lede2: "original gospel choir rehearsal cues and score stems.",
    chip1Title: "MULTI-VOICE STEM MIXER",
    chip1Text: "Independent Soprano / Alto / Tenor playback · Dynamic vocal isolation",
    chip2Title: "DAILY SCRIPTURE & MEDITATION",
    chip2Text: "Daily devotionals mapped directly to choral arrangements",
    windowTitle: "LMGM_SCORE // REHEARSAL_FLOW_WORKSPACE",
    statusPillText: "STEMS LIVE",
    badge1: "SwiftUI iOS",
    b1Width: 140,
    badge2: "Rehearsal Companion",
    b2Width: 180,
    badge3: "Score Architecture",
    b3Width: 165,
    domain: "LEADMEGUIDEME.ORG",
    domainPillX: 880,
    domainPillWidth: 252,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="66" rx="8" fill="#181105" stroke="rgba(251, 191, 36, 0.3)" stroke-width="1"/>
        <text x="20" y="24" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#fde68a">"Guide my steps according to your word; let no iniquity rule over me."</text>
        <text x="20" y="46" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fbbf24">DAILY MEDITATION · PSALM 119:133 · CHOIR CUE #14</text>
        <rect x="420" y="16" width="102" height="24" rx="4" fill="rgba(251, 191, 36, 0.15)"/>
        <text x="430" y="32" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fde68a">DAY 42 OF 60</text>
      </g>
      <g transform="translate(0, 78)">
        <rect width="542" height="160" rx="8" fill="#0f0a03" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">CHORAL STEM SEPARATION MIXER</text>
        <g transform="translate(16, 36)">
          <text x="0" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SOPRANO</text>
          <rect x="90" y="6" width="320" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
          <rect x="90" y="6" width="280" height="12" rx="6" fill="#fbbf24"/>
          <text x="430" y="16" font-family="Courier, monospace" font-size="11" fill="#fde68a">92% VOL</text>
        </g>
        <g transform="translate(16, 72)">
          <text x="0" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">ALTO</text>
          <rect x="90" y="6" width="320" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
          <rect x="90" y="6" width="260" height="12" rx="6" fill="#fbbf24"/>
          <text x="430" y="16" font-family="Courier, monospace" font-size="11" fill="#fde68a">88% VOL</text>
        </g>
        <g transform="translate(16, 108)">
          <text x="0" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">TENOR</text>
          <rect x="90" y="6" width="320" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
          <rect x="90" y="6" width="300" height="12" rx="6" fill="#f59e0b"/>
          <rect x="424" y="2" width="70" height="20" rx="3" fill="rgba(251, 191, 36, 0.25)"/>
          <text x="435" y="16" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fbbf24">SOLO ON</text>
        </g>
      </g>
      <g transform="translate(0, 250)">
        <rect width="542" height="112" rx="8" fill="#070401" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">REHEARSAL PLAYHEAD SYNCHRONIZATION</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[BAR] Measure 24.3 · Key of E-flat Major · 78 BPM Gospel Groove</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[AUDIO] AVAudioEngine multi-channel graph · Zero latency scrubbing</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#fbbf24">[SYNC] Choir director rehearsal notes broadcasted in real-time</text>
      </g>
    </g>`
  },

  // 07: Outplacement Career Consulting
  {
    slug: "occupational-career-consulting",
    accent: "#0ea5e9",
    accentLight: "#38bdf8",
    glow0: "#0c2033",
    glow45: "#06111c",
    glow100: "#03090e",
    tag: "[ 07 // WORKFORCE OUTPLACEMENT · OCC.CONSULTING ]",
    tagWidth: 430,
    title: "Outplacement Career",
    subtitle: "Human-Led Workforce Outplacement & Executive Transition",
    lede1: "Structured outplacement platform helping employers manage workforce",
    lede2: "transitions with clarity, care, dignity, and high-touch coaching.",
    chip1Title: "STRUCTURED OUTPLACEMENT FRAMEWORK",
    chip1Text: "Human-led process from notification to placement with outcomes measurement",
    chip2Title: "CHANGE MANAGEMENT INTEGRATION",
    chip2Text: "Documented employer experience reducing strain while protecting brand",
    windowTitle: "OCC_OUTPLACEMENT // TRANSITION_FRAMEWORK",
    statusPillText: "FRAMEWORK ACTIVE",
    badge1: "Outplacement Platform",
    b1Width: 180,
    badge2: "Executive Coaching",
    b2Width: 170,
    badge3: "Change Management",
    b3Width: 175,
    domain: "OCC.CONSULTING",
    domainPillX: 910,
    domainPillWidth: 222,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="52" rx="8" fill="#081826" stroke="rgba(14, 165, 233, 0.3)" stroke-width="1"/>
        <circle cx="28" cy="26" r="10" fill="#0ea5e9"/>
        <text x="24" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="44" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">INTAKE</text>
        <line x1="90" y1="26" x2="130" y2="26" stroke="#0ea5e9" stroke-width="2"/>
        <circle cx="145" cy="26" r="10" fill="#0ea5e9"/>
        <text x="141" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="162" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">ASSESSMENT</text>
        <line x1="240" y1="26" x2="280" y2="26" stroke="#0ea5e9" stroke-width="2"/>
        <circle cx="295" cy="26" r="11" fill="rgba(14, 165, 233, 0.3)" stroke="#38bdf8" stroke-width="2"/>
        <text x="292" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">3</text>
        <text x="312" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">COACHING</text>
        <line x1="380" y1="26" x2="420" y2="26" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
        <circle cx="436" cy="26" r="10" fill="rgba(255,255,255,0.08)"/>
        <text x="432" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#94a3b8">4</text>
        <text x="452" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">PLACEMENT</text>
      </g>
      <g transform="translate(0, 64)">
        <rect width="542" height="166" rx="8" fill="#040f17" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="18" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">HUMAN-LED OUTPLACEMENT PHILOSOPHY // OCC</text>
        <g transform="translate(18, 42)">
          <text x="0" y="14" font-family="Georgia, serif" font-size="12" font-style="italic" fill="#ffffff">&quot;Effective outplacement addresses both sides: people and organization.&quot;</text>
          <text x="0" y="36" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Documented Outplacement Experience · Reduced Operational Strain</text>
          <text x="0" y="58" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Equitable, Role-Appropriate Employee Support · In-Depth Measurement</text>
          <g transform="translate(0, 74)">
            <rect width="506" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
            <rect width="440" height="6" rx="3" fill="#0ea5e9"/>
            <text x="0" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">FRAMEWORK DELIVERY: CONSISTENT &amp; REPEATABLE</text>
            <text x="375" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">HR-INFORMED ✓</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 242)">
        <rect width="542" height="120" rx="8" fill="#02080d" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">EMPLOYER CHANGE MANAGEMENT INTEGRATION</text>
        <text x="16" y="52" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[INTEGRATION] Directly integrates with employer Change Management</text>
        <text x="16" y="74" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[BRAND PROTECTION] Protects employer reputation while honoring employees</text>
        <text x="16" y="96" font-family="Courier, monospace" font-size="11" fill="#38bdf8">[PLATFORM] Technology-enabled efficiency + high-touch human partnership</text>
      </g>
    </g>`
  },

  // 08: Western Management Associates
  {
    slug: "western-management",
    accent: "#eab308",
    accentLight: "#fde047",
    glow0: "#261d06",
    glow45: "#140e02",
    glow100: "#070501",
    tag: "[ 08 // WASATCH FRONT ASSET MANAGEMENT · WESTERN.MANAGEMENT ]",
    tagWidth: 480,
    title: "Western Management",
    subtitle: "Wasatch Front Asset Management & Commercial Property Operations",
    lede1: "Utah asset management experts for over 40+ years, providing commercial leasing",
    lede2: "and property operations along the Wasatch Front at western.management.",
    chip1Title: "UTAH ASSET MANAGEMENT LEADERSHIP",
    chip1Text: "Over 40+ years of trusted commercial real estate operations in Utah",
    chip2Title: "TENANT DISPATCH & LEASING PORTAL",
    chip2Text: "Streamlined maintenance dispatch, tenant workflows & vacancy directory",
    windowTitle: "WESTERN_MANAGEMENT // ASSET_DISPATCH_CONSOLE",
    statusPillText: "40+ YEARS UTAH",
    badge1: "Wasatch Front",
    b1Width: 150,
    badge2: "Tenant Dispatch",
    b2Width: 160,
    badge3: "WordPress & Divi",
    b3Width: 165,
    domain: "WESTERN.MANAGEMENT",
    domainPillX: 890,
    domainPillWidth: 242,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="42" rx="8" fill="#141004" stroke="rgba(234, 179, 8, 0.3)" stroke-width="1"/>
        <text x="20" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#fde047">WASATCH FRONT COMMERCIAL PORTFOLIO</text>
        <text x="290" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">40+ YEARS IN UTAH</text>
        <text x="430" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#eab308">DISPATCH: ACTIVE</text>
      </g>
      <g transform="translate(0, 52)">
        <rect width="542" height="180" rx="8" fill="#0b0802" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">TENANT DISPATCH &amp; MAINTENANCE WORK ORDERS</text>
        <g transform="translate(16, 36)">
          <rect width="510" height="40" rx="4" fill="#140f04" stroke="rgba(234, 179, 8, 0.2)" stroke-width="1"/>
          <circle cx="16" cy="20" r="4" fill="#ef4444"/>
          <text x="28" y="24" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">WO #492</text>
          <text x="110" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Wasatch Front Office · HVAC System Calibration</text>
          <rect x="370" y="10" width="86" height="20" rx="3" fill="rgba(239, 68, 68, 0.2)"/>
          <text x="380" y="24" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#f87171">DISPATCHED</text>
        </g>
        <g transform="translate(16, 84)">
          <rect width="510" height="40" rx="4" fill="#080602" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <circle cx="16" cy="20" r="4" fill="#eab308"/>
          <text x="28" y="24" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">WO #493</text>
          <text x="110" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Commercial Property · Suite Keycard Calibration</text>
          <rect x="370" y="10" width="86" height="20" rx="3" fill="rgba(234, 179, 8, 0.15)"/>
          <text x="385" y="24" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#eab308">ASSIGNED</text>
        </g>
        <g transform="translate(16, 132)">
          <rect width="510" height="40" rx="4" fill="#080602" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <circle cx="16" cy="20" r="4" fill="#10b981"/>
          <text x="28" y="24" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">WO #494</text>
          <text x="110" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Industrial Park · Exterior Facility Inspection</text>
          <rect x="370" y="10" width="86" height="20" rx="3" fill="rgba(16, 185, 129, 0.15)"/>
          <text x="380" y="24" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#34d399">SCHEDULED</text>
        </g>
      </g>
      <g transform="translate(0, 244)">
        <rect width="542" height="118" rx="8" fill="#050401" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">UTAH ASSET MANAGEMENT EXPERT FOR 40+ YEARS</text>
        <text x="16" y="52" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">WASATCH FRONT COMMERCIAL REAL ESTATE &amp; LEASING</text>
        <text x="16" y="74" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Asset Management · Property Maintenance · Direct Broker Inquiries</text>
        <text x="16" y="96" font-family="Courier, monospace" font-size="11" fill="#fde047">[PLATFORM] WordPress + Divi · Active commercial inquiry pipeline</text>
      </g>
    </g>`
  },

  // 09: Creatives Guide Us
  {
    slug: "creatives-guide-us",
    accent: "#d4af37",
    accentLight: "#fef08a",
    glow0: "#221c08",
    glow45: "#120f04",
    glow100: "#070501",
    tag: "[ 09 // INDEPENDENT CREATIVE STUDIO & OS · CREATIVESGUIDE.US ]",
    tagWidth: 470,
    title: "Creatives Guide Us",
    subtitle: "Independent Studio Platform & Agency Operating System",
    lede1: "Independent studio operating system connecting Next.js brand surfaces,",
    lede2: "analog master audio releases, and boutique client productions.",
    chip1Title: "STUDIO OPERATING SYSTEM",
    chip1Text: "Multi-tenant workspace architecture · Direct asset delivery pipeline",
    chip2Title: "SOUND, SCREEN & TACTILE EDITIONS",
    chip2Text: "Unified creative direction across digital, analog tape, and print",
    windowTitle: "CGU_STUDIO_OS // MULTI_SURFACE_PIPELINE",
    statusPillText: "PROD HEALTH 200",
    badge1: "Studio OS",
    b1Width: 125,
    badge2: "Brand Systems",
    b2Width: 155,
    badge3: "Tactile Editions",
    b3Width: 165,
    domain: "CREATIVESGUIDE.US",
    domainPillX: 880,
    domainPillWidth: 252,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="42" rx="8" fill="#141004" stroke="rgba(212, 175, 55, 0.3)" stroke-width="1"/>
        <text x="20" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#fef08a">AGENCY OS: CLUSTER ACTIVE</text>
        <text x="240" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">NEXT.JS 16 WEBPACK</text>
        <text x="440" y="26" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#d4af37">PM2: ONLINE</text>
      </g>
      <g transform="translate(0, 52)">
        <rect width="542" height="186" rx="8" fill="#0b0802" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">STUDIO MULTI-SURFACE DELIVERY STAGES</text>
        <g transform="translate(16, 36)">
          <rect width="510" height="42" rx="6" fill="#140e03" stroke="rgba(212, 175, 55, 0.25)" stroke-width="1"/>
          <circle cx="16" cy="21" r="5" fill="#d4af37"/>
          <text x="30" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SURFACE 01: BRAND SYSTEM</text>
          <text x="210" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Next.js Webpack · Creatives Guide Us</text>
          <rect x="420" y="11" width="76" height="20" rx="3" fill="rgba(212, 175, 55, 0.2)"/>
          <text x="432" y="25" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fef08a">DEPLOYED ✓</text>
        </g>
        <g transform="translate(16, 86)">
          <rect width="510" height="42" rx="6" fill="#140e03" stroke="rgba(212, 175, 55, 0.25)" stroke-width="1"/>
          <circle cx="16" cy="21" r="5" fill="#eab308"/>
          <text x="30" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SURFACE 02: ANALOG MASTER</text>
          <text x="210" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">2-Inch Tape Master Vault · 8 Tracks</text>
          <rect x="420" y="11" width="76" height="20" rx="3" fill="rgba(234, 179, 8, 0.2)"/>
          <text x="432" y="25" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fde047">CLEARED ✓</text>
        </g>
        <g transform="translate(16, 136)">
          <rect width="510" height="42" rx="6" fill="#140e03" stroke="rgba(212, 175, 55, 0.25)" stroke-width="1"/>
          <circle cx="16" cy="21" r="5" fill="#fef08a"/>
          <text x="30" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SURFACE 03: TACTILE EDITIONS</text>
          <text x="210" y="25" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Print Editions &amp; Direct Vinyl Editions</text>
          <rect x="420" y="11" width="76" height="20" rx="3" fill="rgba(254, 240, 138, 0.2)"/>
          <text x="430" y="25" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fef08a">IN PRESS</text>
        </g>
      </g>
      <g transform="translate(0, 250)">
        <rect width="542" height="112" rx="8" fill="#050301" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">STUDIO INFRASTRUCTURE &amp; SYNDICATION</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[CENTRAL] cgu_master module.json single source of truth</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[SYNDICATE] Automated distribution to seanhalls_online &amp; clients</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#fef08a">[SERVER] Cloud deployment at 136.118.46.53 · All services healthy</text>
      </g>
    </g>`
  },

  // 10: Namastay Online
  {
    slug: "namastay-online",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    glow0: "#241506",
    glow45: "#130b03",
    glow100: "#070401",
    tag: "[ 10 // CONSCIOUS FASHION ATELIER · NAMASTAY.ONLINE ]",
    tagWidth: 460,
    title: "Namastay Online",
    subtitle: "Conscious Fashion & Direct Textile Atelier",
    lede1: "Conscious movement wear atelier connecting master",
    lede2: "Bangladesh handloom mills with direct ethical importing.",
    chip1Title: "ETHICAL BANGLADESH MILL PIPELINE",
    chip1Text: "Direct relationships with master artisan weavers · Zero middleman markups",
    chip2Title: "LIVING CALLIGRAPHY ENGINE",
    chip2Text: "Animated dot calligraphy canvas · Light linen aesthetic translated to web",
    windowTitle: "NAMASTAY // TEXTILE_ATELIER_ENGINE",
    statusPillText: "ATELIER ACTIVE",
    badge1: "Artisan Handloom",
    b1Width: 165,
    badge2: "Direct Mill Pipeline",
    b2Width: 175,
    badge3: "Linen Atelier",
    b3Width: 145,
    domain: "NAMASTAY.ONLINE",
    domainPillX: 900,
    domainPillWidth: 232,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="60" rx="8" fill="#140c03" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
        <text x="20" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fbbf24">DIRECT BANGLADESH IMPORT MANIFEST</text>
        <text x="20" y="44" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">LOT #BD-2026-08 // DHAKA HANDLOOM MILLS</text>
        <rect x="420" y="16" width="102" height="24" rx="4" fill="rgba(245, 158, 11, 0.2)"/>
        <text x="432" y="32" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fde68a">ETHICAL PASS</text>
      </g>
      <g transform="translate(0, 72)">
        <rect width="542" height="166" rx="8" fill="#0b0601" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">ORGANIC LINEN &amp; HANDLOOM WEAVE METRICS</text>
        <g transform="translate(16, 36)">
          <rect width="510" height="38" rx="4" fill="#120a02" stroke="rgba(245, 158, 11, 0.2)" stroke-width="1"/>
          <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">MATERIAL: 100% ORGANIC BENGAL LINEN</text>
          <text x="290" y="24" font-family="Courier, monospace" font-size="11" fill="#fbbf24">WEIGHT: 180 GSM · BREATHABLE</text>
        </g>
        <g transform="translate(16, 82)">
          <rect width="510" height="38" rx="4" fill="#120a02" stroke="rgba(245, 158, 11, 0.2)" stroke-width="1"/>
          <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">DYE: PLANT-BASED NATURAL INDIGO</text>
          <text x="290" y="24" font-family="Courier, monospace" font-size="11" fill="#fbbf24">BATCH: SUN-CURED COTTON MESH</text>
        </g>
        <g transform="translate(16, 128)">
          <rect width="510" height="32" rx="4" fill="#070401"/>
          <circle cx="10" cy="16" r="4" fill="#10b981"/>
          <text x="24" y="20" font-family="Courier, monospace" font-size="10.5" fill="#34d399">DIRECT IMPORTER LICENSED // 100% ARTISAN CO-OP OWNED</text>
        </g>
      </g>
      <g transform="translate(0, 250)">
        <rect width="542" height="112" rx="8" fill="#050301" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">INTERACTIVE DOT CALLIGRAPHY ENGINE</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[CANVAS] HTML5 fluid particle engine · 60 FPS cursor attraction</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[DESIGN] Editorial linen palette · Pure light-mode digital gallery</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#fbbf24">[ETHEREAL] Harmonious blend of physical craftsmanship &amp; reactive code</text>
      </g>
    </g>`
  },

  // 11: Namastay Yoga & Hilo Sanctuary
  {
    slug: "namastay-yoga",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    glow0: "#1a1e28",
    glow45: "#10131b",
    glow100: "#080a0e",
    tag: "[ 11 // YOGA SANCTUARY & STUDIO · NAMASTAY.YOGA ]",
    tagWidth: 440,
    title: "Namastay Yoga",
    subtitle: "Movement Studio & Mixed-Use Sanctuary Prospect",
    lede1: "Holistic wellness brand pairing certified yoga instruction with",
    lede2: "an active sanctuary acquisition pipeline in Downtown Hilo.",
    chip1Title: "DOWNTOWN HILO PROPERTY PIPELINE",
    chip1Text: "Commercial/residential sanctuary prospect · Historic Hilo district",
    chip2Title: "CERTIFIED MOVEMENT & BOUTIQUE RETAIL",
    chip2Text: "Sean Halls certified instruction · On-site artisan apparel showcase",
    windowTitle: "HILO_SANCTUARY // STUDIO_PROSPECTUS",
    statusPillText: "PIPELINE ACTIVE",
    badge1: "Downtown Hilo",
    b1Width: 150,
    badge2: "Certified Instructor",
    b2Width: 175,
    badge3: "Boutique Retail",
    b3Width: 155,
    domain: "NAMASTAY.YOGA",
    domainPillX: 910,
    domainPillWidth: 222,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="60" rx="8" fill="#131720" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
        <text x="20" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fbbf24">SANCTUARY ACQUISITION PROSPECTUS</text>
        <text x="20" y="44" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">DOWNTOWN HILO · COMMERCIAL/RESIDENTIAL</text>
        <rect x="420" y="16" width="102" height="24" rx="4" fill="rgba(245, 158, 11, 0.2)"/>
        <text x="430" y="32" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fbbf24">STAGE 02</text>
      </g>
      <g transform="translate(0, 72)">
        <rect width="542" height="166" rx="8" fill="#0a0c12" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">SANCTUARY MOVEMENT &amp; MEDITATION SCHEDULE</text>
        <g transform="translate(16, 36)">
          <rect width="510" height="38" rx="4" fill="#121620" stroke="rgba(245, 158, 11, 0.2)" stroke-width="1"/>
          <text x="16" y="24" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#fbbf24">07:00 AM</text>
          <text x="100" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">Sunrise Vinyasa Flow · Sean Halls Certified RYT</text>
          <text x="420" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#34d399">STUDIO A</text>
        </g>
        <g transform="translate(16, 82)">
          <rect width="510" height="38" rx="4" fill="#121620" stroke="rgba(245, 158, 11, 0.2)" stroke-width="1"/>
          <text x="16" y="24" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#fbbf24">10:30 AM</text>
          <text x="100" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">Restorative Breathwork &amp; Sound Immersion</text>
          <text x="420" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">GARDEN</text>
        </g>
        <g transform="translate(16, 128)">
          <rect width="510" height="32" rx="4" fill="#080a0e"/>
          <circle cx="10" cy="16" r="4" fill="#fbbf24"/>
          <text x="24" y="20" font-family="Courier, monospace" font-size="10.5" fill="#fde68a">ON-SITE RETAIL: Artisan Bangladesh Handloom Movement Wear</text>
        </g>
      </g>
      <g transform="translate(0, 250)">
        <rect width="542" height="112" rx="8" fill="#050608" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">COMMUNITY SANCTUARY FOUNDATION</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[COMMUNITY] Welcoming local Big Island practitioners &amp; retreat guests</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[INTEGRATION] Direct synergy with Namastay Online retail apparel</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#fbbf24">[VISION] Long-term intentional living &amp; movement arts anchor</text>
      </g>
    </g>`
  },

  // 12: johnwalls.studio
  {
    slug: "johnwalls-studio",
    accent: "#38bdf8",
    accentLight: "#7dd3fc",
    glow0: "#0c2033",
    glow45: "#06121e",
    glow100: "#03090f",
    tag: "[ 12 // GENERATIVE AUDIO DSP LAB · JOHNWALLS.STUDIO ]",
    tagWidth: 470,
    title: "johnwalls.studio",
    subtitle: "Generative Audio DSP Lab & Ableton Live VST3/AU Plugin",
    lede1: "Generative audio DSP workstation and Ableton Live plugin suite",
    lede2: "with real-time OSC telemetry and SuperCollider synthesis.",
    chip1Title: "NATIVE C++ JUCE AUDIO ENGINE",
    chip1Text: "VST3 and AU plugin binaries · Low-latency 64-sample internal buffer",
    chip2Title: "SUPERCOLLIDER & WEBSOCKET BRIDGE",
    chip2Text: "Bi-directional OSC server · Real-time DAW transport streaming",
    windowTitle: "JUCE_DSP // ABLETON_LIVE_12_BRIDGE",
    statusPillText: "DAW SYNCED",
    badge1: "JUCE C++",
    b1Width: 125,
    badge2: "VST3 / AU",
    b2Width: 135,
    badge3: "SuperCollider OSC",
    b3Width: 175,
    domain: "JOHNWALLS.STUDIO",
    domainPillX: 890,
    domainPillWidth: 242,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="110" rx="8" fill="#06121c" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
        <line x1="20" y1="55" x2="522" y2="55" stroke="rgba(56, 189, 248, 0.15)" stroke-dasharray="4 4"/>
        <line x1="135" y1="10" x2="135" y2="100" stroke="rgba(56, 189, 248, 0.1)"/>
        <line x1="270" y1="10" x2="270" y2="100" stroke="rgba(56, 189, 248, 0.1)"/>
        <line x1="405" y1="10" x2="405" y2="100" stroke="rgba(56, 189, 248, 0.1)"/>
        <path d="M 20 55 Q 60 15, 100 55 T 180 55 T 260 55 T 340 55 T 420 55 T 500 55" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
        <path d="M 20 55 Q 60 30, 100 55 T 180 55 T 260 55 T 340 55 T 420 55 T 500 55" fill="none" stroke="#22d3ee" stroke-width="1.2" opacity="0.6"/>
        <text x="20" y="24" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#7dd3fc">OSCILLOSCOPE CH 1/2 · 44.1kHz · 64 SAMPLES</text>
        <rect x="420" y="14" width="102" height="20" rx="3" fill="rgba(56, 189, 248, 0.2)"/>
        <text x="430" y="28" font-family="Courier, monospace" font-size="9" font-weight="bold" fill="#7dd3fc">PEAK: -0.3 dB</text>
      </g>
      <g transform="translate(0, 122)">
        <rect width="542" height="110" rx="8" fill="#040c14" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">ABLETON LIVE 12 TRANSPORT &amp; DSP BUFFER</text>
        <g transform="translate(16, 36)">
          <rect width="160" height="54" rx="6" fill="#091824" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
          <text x="14" y="20" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#7dd3fc">TRANSPORT BPM</text>
          <text x="14" y="44" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">124.0</text>
          <text x="75" y="44" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#34d399">PLAY ▶</text>
        </g>
        <g transform="translate(186, 36)">
          <rect width="160" height="54" rx="6" fill="#091824" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
          <text x="14" y="20" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#7dd3fc">PLAYHEAD POSITION</text>
          <text x="14" y="44" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">BAR 32.1</text>
        </g>
        <g transform="translate(356, 36)">
          <rect width="170" height="54" rx="6" fill="#091824" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
          <text x="14" y="20" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#7dd3fc">INTERNAL LATENCY</text>
          <text x="14" y="44" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#38bdf8">0.8 ms</text>
        </g>
      </g>
      <g transform="translate(0, 244)">
        <rect width="542" height="118" rx="8" fill="#02070c" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">SUPERCOLLIDER OSC &amp; WEBSOCKET ROUTING</text>
        <text x="16" y="50" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[OSC] scsynth UDP connected at port 57120 · SynthDef active</text>
        <text x="16" y="72" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[WEBSOCKET] Telemetry server listening on port 8080 · Visualizer synced</text>
        <text x="16" y="94" font-family="Courier, monospace" font-size="11" fill="#38bdf8">[VST3/AU] Native binaries installed in Ableton Live Studio path</text>
      </g>
    </g>`
  },

  // 13: Walls/Devine — Volume 1
  {
    slug: "walls-devine",
    accent: "#f43f5e",
    accentLight: "#fda4af",
    glow0: "#28101a",
    glow45: "#16080e",
    glow100: "#090306",
    tag: "[ 13 // STUDIO MASTER & SYNC CATALOG · JOHNWALLS.ROCKS ]",
    tagWidth: 470,
    title: "Walls/Devine — Vol. 1",
    subtitle: "Debut 8-Track Studio Master & Direct Sync Catalog",
    lede1: "Debut 8-track studio master tracked live on 2-inch tape in Los Angeles,",
    lede2: "cleared for 100% direct sync licensing and companion score packaging.",
    chip1Title: "2-INCH ANALOG TAPE TRACKING",
    chip1Text: "Tracked live in Los Angeles · Zero digital plugins in the recording path",
    chip2Title: "100% DIRECT SYNC OWNERSHIP",
    chip2Text: "100% master and sync publishing rights retained · Film/TV placement ready",
    windowTitle: "STUDIO_MASTER // 2_INCH_TAPE_VAULT",
    statusPillText: "100% SYNC READY",
    badge1: "2-Inch Analog Tape",
    b1Width: 175,
    badge2: "8 Master Cuts",
    b2Width: 140,
    badge3: "100% Direct Sync",
    b3Width: 160,
    domain: "JOHNWALLS.ROCKS",
    domainPillX: 900,
    domainPillWidth: 232,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="110" rx="8" fill="#180a11" stroke="rgba(244, 63, 94, 0.35)" stroke-width="1"/>
        <g transform="translate(20, 16)">
          <rect width="240" height="78" rx="6" fill="#0d0409" stroke="rgba(244, 63, 94, 0.25)" stroke-width="1"/>
          <path d="M 20 65 Q 120 20, 220 65" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <path d="M 180 43 Q 200 52, 220 65" fill="none" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="120" y1="75" x2="195" y2="40" stroke="#f43f5e" stroke-width="2"/>
          <circle cx="120" cy="75" r="5" fill="#f43f5e"/>
          <text x="14" y="20" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fda4af">VU METER · CH A (LEFT)</text>
          <text x="195" y="20" font-family="Courier, monospace" font-size="9" font-weight="bold" fill="#ef4444">+2 dB</text>
        </g>
        <g transform="translate(282, 16)">
          <rect width="240" height="78" rx="6" fill="#0d0409" stroke="rgba(244, 63, 94, 0.25)" stroke-width="1"/>
          <path d="M 20 65 Q 120 20, 220 65" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <path d="M 180 43 Q 200 52, 220 65" fill="none" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="120" y1="75" x2="190" y2="42" stroke="#f43f5e" stroke-width="2"/>
          <circle cx="120" cy="75" r="5" fill="#f43f5e"/>
          <text x="14" y="20" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fda4af">VU METER · CH B (RIGHT)</text>
          <text x="195" y="20" font-family="Courier, monospace" font-size="9" font-weight="bold" fill="#ef4444">+1.5 dB</text>
        </g>
      </g>
      <g transform="translate(0, 122)">
        <rect width="542" height="126" rx="8" fill="#0b0307" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="20" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">8-TRACK MASTER TAPE SYNC CATALOG</text>
        <g transform="translate(16, 32)">
          <text x="0" y="16" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">01. Space Cruiser</text>
          <text x="160" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">3:42 · 124 BPM · D Minor</text>
          <rect x="360" y="2" width="136" height="18" rx="3" fill="rgba(244, 63, 94, 0.2)"/>
          <text x="370" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fda4af">100% DIRECT SYNC ✓</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="16" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">02. Mint Green Funk</text>
          <text x="160" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">4:18 · 108 BPM · G Major</text>
          <rect x="360" y="2" width="136" height="18" rx="3" fill="rgba(244, 63, 94, 0.2)"/>
          <text x="370" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#fda4af">MASTER &amp; PUB OWNED</text>
        </g>
        <g transform="translate(16, 92)">
          <text x="0" y="16" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">03. Pacific Sunset</text>
          <text x="160" y="16" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">5:02 · 96 BPM · E Minor</text>
          <rect x="360" y="2" width="136" height="18" rx="3" fill="rgba(16, 185, 129, 0.2)"/>
          <text x="375" y="15" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#34d399">FILM/TV CUE READY</text>
        </g>
      </g>
      <g transform="translate(0, 260)">
        <rect width="542" height="102" rx="8" fill="#050204" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">ANALOG TAPE MACHINE CALIBRATION</text>
        <text x="16" y="46" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[TAPE MACHINE] Studer A800 2-Inch 24-Track · 30 IPS speed</text>
        <text x="16" y="68" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[FORMULATION] ATR Magnetics Master Tape · +9 dB operating level</text>
        <text x="16" y="90" font-family="Courier, monospace" font-size="11" fill="#fda4af">[OWNERSHIP] Zero major-label middleman lock-in · 100% direct deal terms</text>
      </g>
    </g>`
  },

  // 14: Sean Halls Online Brand Card
  {
    slug: "seanhalls-online",
    accent: "#38bdf8",
    accentLight: "#7dd3fc",
    glow0: "#0c1e30",
    glow45: "#06101c",
    glow100: "#03080e",
    tag: "[ SEAN HALLS // BOUTIQUE DEV SHOP · SEANHALLS.ONLINE ]",
    tagWidth: 460,
    title: "Pay Per Outcome.",
    subtitle: "High-Impact Web Surfaces · Client Portals · Delivery Systems",
    lede1: "Boutique online dev shop where you pay per verified milestone outcome,",
    lede2: "not per billable hour. Engineered to ship with Apple Silicon compute.",
    chip1Title: "MILESTONE-BASED VERIFICATION",
    chip1Text: "Zero hourly lock-in · Every release backed by live proof & tests",
    chip2Title: "APPLE SILICON UNIFIED COMPUTE",
    chip2Text: "Local high-efficiency builds · Deterministic CI/CD deployments",
    windowTitle: "SEANHALLS // OUTCOME_DELIVERY_CONSOLE",
    statusPillText: "DELIVERY 100%",
    badge1: "Pay Per Outcome",
    b1Width: 165,
    badge2: "Zero Hourly Lock-in",
    b2Width: 175,
    badge3: "High-Impact Craft",
    b3Width: 165,
    domain: "SEANHALLS.ONLINE",
    domainPillX: 890,
    domainPillWidth: 242,
    innerWorkspaceSvg: `
    <g transform="translate(18, 50)">
      <g>
        <rect width="542" height="52" rx="8" fill="#081826" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <circle cx="28" cy="26" r="10" fill="#38bdf8"/>
        <text x="24" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="44" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#7dd3fc">SPEC</text>
        <line x1="82" y1="26" x2="126" y2="26" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="140" cy="26" r="10" fill="#38bdf8"/>
        <text x="136" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="156" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#7dd3fc">BUILD</text>
        <line x1="202" y1="26" x2="246" y2="26" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="260" cy="26" r="10" fill="#38bdf8"/>
        <text x="256" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="276" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#7dd3fc">VERIFY</text>
        <line x1="332" y1="26" x2="376" y2="26" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="390" cy="26" r="11" fill="rgba(56, 189, 248, 0.3)" stroke="#7dd3fc" stroke-width="2"/>
        <text x="386" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">✓</text>
        <text x="408" y="30" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">DEPLOY 200</text>
      </g>
      <g transform="translate(0, 64)">
        <rect width="542" height="166" rx="8" fill="#040e16" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="18" y="24" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#7dd3fc">ACTIVE ECOSYSTEM DEPLOYMENT DOSSIER</text>
        <g transform="translate(18, 42)">
          <text x="0" y="14" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">13 PRODUCTION PROPERTIES DEPLOYED &amp; VERIFIED</text>
          <text x="0" y="36" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Healthcare Ops · E-Commerce · Architectural Editorial · Audio DSP</text>
          <text x="0" y="58" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">Continuous Integration &amp; Automated Apache / PM2 Server Reloads</text>
          <g transform="translate(0, 74)">
            <rect width="506" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
            <rect width="506" height="6" rx="3" fill="#38bdf8"/>
            <text x="0" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">PORTFOLIO HEALTH: 100%</text>
            <text x="360" y="22" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#7dd3fc">ALL OUTCOMES VERIFIED ✓</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 242)">
        <rect width="542" height="120" rx="8" fill="#02080d" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <text x="16" y="24" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748b">ENGINEERING RIGOR &amp; ACCOUNTABILITY</text>
        <text x="16" y="52" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[GUARANTEE] You only pay when milestones are demonstrably delivered</text>
        <text x="16" y="74" font-family="Courier, monospace" font-size="11" fill="#e2e8f0">[SPEED] High-velocity autonomous workflows with surgical precision</text>
        <text x="16" y="96" font-family="Courier, monospace" font-size="11" fill="#7dd3fc">[STACK] Modern React, TypeScript, Node.js, C++ JUCE, Next.js</text>
      </g>
    </g>`
  }
];

console.log(`Generating ${posters.length} custom dark-mode UI posters with calibrated layout...`);

for (const poster of posters) {
  const svg = buildPosterSvg(poster);
  const tmpSvg = `/tmp/${poster.slug}.svg`;
  const tmpPng = `/tmp/${poster.slug}.png`;
  
  writeFileSync(tmpSvg, svg, "utf8");
  execSync(`magick "${tmpSvg}" "${tmpPng}"`);
  console.log(`✓ Rendered ${poster.slug} (${tmpPng})`);

  const dests = [];

  // Project asset for seanhalls_online
  dests.push(path.join(shoProjectAssets, `${poster.slug}.png`));

  // OG images in cgu_master
  dests.push(path.join(cguPublicImages, `${poster.slug}-og.png`));
  if (poster.slug === "creatives-guide-us") {
    dests.push(path.join(cguPublicImages, "cgu-og.png"));
  }
  if (poster.slug === "johnwalls-studio") {
    dests.push(path.join(cguPublicImages, "johnwalls-studio-og.png"));
  }
  if (poster.slug === "namastay-online") {
    dests.push(path.join(cguPublicImages, "namastay-online-og.png"));
    dests.push(path.join(namastayPublic, "namastay-online-og.png"));
    dests.push(path.join(namastayClient, "namastay-online-og.png"));
  }
  if (poster.slug === "namastay-yoga") {
    dests.push(path.join(cguPublicImages, "namastay-yoga-og.png"));
    dests.push(path.join(namastayPublic, "namastay-yoga-og.png"));
    dests.push(path.join(namastayClient, "namastay-yoga-og.png"));
  }
  if (poster.slug === "walls-devine") {
    dests.push(path.join(cguPublicImages, "walls-devine-vol1-og.png"));
  }
  if (poster.slug === "seanhalls-online") {
    dests.push(path.join(shoPublicAssets, "seanhalls-og.png"));
  }
  if (poster.slug === "total-body-modification") {
    dests.push(path.join(tbmThemeImages, "total-body-modification-og.png"));
    dests.push(path.join(tbmThemeImages, "og-poster.png"));
  }

  for (const dest of dests) {
    copyFileSync(tmpPng, dest);
    console.log(`   -> Copied to ${dest}`);
  }
}

console.log("\nAll 14 calibrated posters rendered and distributed successfully!");
