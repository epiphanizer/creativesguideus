import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

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
  return String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildLightPosterSvg(cfg) {
  const titleFontSize = cfg.titleFontSize || (cfg.title.length > 22 ? 31 : (cfg.title.length > 17 ? 35 : 39));
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Background Dot Grid -->
    <pattern id="dotgrid_${cfg.slug}" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="#cbd5e1" fill-opacity="0.6"/>
    </pattern>
    <filter id="cardShadow" x="-3%" y="-3%" width="106%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.06"/>
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.04"/>
    </filter>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect width="1200" height="630" fill="url(#dotgrid_${cfg.slug})"/>

  <!-- Outer Architectural Card -->
  <rect x="24" y="24" width="1152" height="582" rx="14" fill="#ffffff" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="32" y="32" width="1136" height="566" rx="10" fill="none" stroke="rgba(15, 23, 42, 0.03)" stroke-width="1"/>

  <!-- Corner Crosshairs -->
  <path d="M 18 24 L 30 24 M 24 18 L 24 30" stroke="${cfg.accent}" stroke-opacity="0.85" stroke-width="1.5"/>
  <path d="M 1170 24 L 1182 24 M 1176 18 L 1176 30" stroke="${cfg.accent}" stroke-opacity="0.85" stroke-width="1.5"/>
  <path d="M 18 606 L 30 606 M 24 600 L 24 612" stroke="${cfg.accent}" stroke-opacity="0.85" stroke-width="1.5"/>
  <path d="M 1170 606 L 1182 606 M 1176 600 L 1176 612" stroke="${cfg.accent}" stroke-opacity="0.85" stroke-width="1.5"/>

  <!-- Top System Tag Pill -->
  <g transform="translate(56, 50)">
    <rect width="${cfg.tagWidth || 430}" height="28" rx="5" fill="${cfg.accent}" fill-opacity="0.09" stroke="${cfg.accent}" stroke-opacity="0.35" stroke-width="1"/>
    <text x="14" y="18" font-family="'JetBrains Mono', 'SF Mono', Menlo, monospace" font-size="11" font-weight="700" fill="${cfg.accentDark}">${escapeXml(cfg.tag)}</text>
  </g>

  <!-- Top Right Case Study Badge -->
  <g transform="translate(860, 50)">
    <rect width="250" height="28" rx="5" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.1)" stroke-width="1"/>
    <circle cx="16" cy="14" r="3.5" fill="#10b981"/>
    <text x="28" y="18" font-family="'JetBrains Mono', 'SF Mono', Menlo, monospace" font-size="10.5" font-weight="700" fill="#475569">CASE STUDY // VERIFIED PROOF</text>
  </g>

  <!-- Left Narrative Column -->
  <!-- Title -->
  <text x="56" y="128" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="${titleFontSize}" font-weight="850" letter-spacing="-0.03em" fill="#0f172a">${escapeXml(cfg.title)}</text>
  
  <!-- Subtitle -->
  <text x="56" y="158" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="14.5" font-weight="700" fill="${cfg.accentDark}">${escapeXml(cfg.subtitle)}</text>

  <!-- Narrative Lede -->
  <text x="56" y="194" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="12.5" fill="#334155">${escapeXml(cfg.lede1)}</text>
  <text x="56" y="214" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="12.5" fill="#334155">${escapeXml(cfg.lede2)}</text>
  ${cfg.lede3 ? `<text x="56" y="234" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="12.5" fill="#334155">${escapeXml(cfg.lede3)}</text>` : ""}

  <!-- Left Architecture Cards -->
  <g transform="translate(56, 252)">
    <!-- Card 1 -->
    <rect width="456" height="70" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
    <rect width="4" height="70" rx="2" fill="${cfg.accent}"/>
    <text x="20" y="25" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11.5" font-weight="750" fill="#0f172a">${escapeXml(cfg.chip1Title)}</text>
    <text x="20" y="47" font-family="'Inter', system-ui, sans-serif" font-size="11.5" fill="#475569">${escapeXml(cfg.chip1Text)}</text>

    <!-- Card 2 -->
    <g transform="translate(0, 82)">
      <rect width="456" height="70" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <rect width="4" height="70" rx="2" fill="${cfg.accentLight || cfg.accent}"/>
      <text x="20" y="25" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11.5" font-weight="750" fill="#0f172a">${escapeXml(cfg.chip2Title)}</text>
      <text x="20" y="47" font-family="'Inter', system-ui, sans-serif" font-size="11.5" fill="#475569">${escapeXml(cfg.chip2Text)}</text>
    </g>
  </g>

  <!-- Left Bottom Badges -->
  <g transform="translate(56, 422)">
    <g transform="translate(0, 0)">
      <rect width="${cfg.b1Width || 140}" height="32" rx="6" fill="#f1f5f9" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="${(cfg.b1Width || 140)/2}" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(cfg.badge1)}</text>
    </g>
    <g transform="translate(${(cfg.b1Width || 140) + 10}, 0)">
      <rect width="${cfg.b2Width || 160}" height="32" rx="6" fill="#f1f5f9" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="${(cfg.b2Width || 160)/2}" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(cfg.badge2)}</text>
    </g>
    <g transform="translate(${(cfg.b1Width || 140) + (cfg.b2Width || 160) + 20}, 0)">
      <rect width="${cfg.b3Width || 145}" height="32" rx="6" fill="#f1f5f9" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="${(cfg.b3Width || 145)/2}" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(cfg.badge3)}</text>
    </g>

    <!-- Outbound Domain Link Badge -->
    <g transform="translate(0, 42)">
      <rect width="${cfg.domainPillWidth || 220}" height="32" rx="6" fill="${cfg.accent}" fill-opacity="0.09" stroke="${cfg.accent}" stroke-opacity="0.35" stroke-width="1"/>
      <circle cx="16" cy="16" r="3.5" fill="${cfg.accentDark}"/>
      <text x="28" y="20" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${cfg.accentDark}">${escapeXml(cfg.domain)} ↗</text>
    </g>
  </g>

  <!-- Right Product / Architectural Surface Window -->
  <g transform="translate(540, 94)">
    <!-- Outer Window -->
    <rect width="612" height="476" rx="10" fill="#ffffff" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1.2"/>
    
    <!-- Window Header -->
    <path d="M 0 10 Q 0 0 10 0 L 602 0 Q 612 0 612 10 L 612 36 L 0 36 Z" fill="#f8fafc"/>
    <line x1="0" y1="36" x2="612" y2="36" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>

    <!-- Window Dots -->
    <circle cx="18" cy="18" r="4.5" fill="#f87171"/>
    <circle cx="34" cy="18" r="4.5" fill="#fbbf24"/>
    <circle cx="50" cy="18" r="4.5" fill="#34d399"/>

    <!-- Window Title -->
    <text x="72" y="22" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="700" fill="#475569">${escapeXml(cfg.windowTitle)}</text>

    <!-- Status Pill -->
    <g transform="translate(${cfg.statusPillX || 444}, 8)">
      <rect width="${cfg.statusPillWidth || 154}" height="20" rx="4" fill="${cfg.accent}" fill-opacity="0.1" stroke="${cfg.accent}" stroke-opacity="0.3" stroke-width="0.8"/>
      <circle cx="10" cy="10" r="3" fill="${cfg.accentDark}"/>
      <text x="18" y="14" font-family="system-ui, sans-serif" font-size="9" font-weight="750" fill="${cfg.accentDark}">${escapeXml(cfg.statusPillText)}</text>
    </g>

    <!-- Inner Case-Study Content -->
    ${cfg.innerWorkspaceSvg}
  </g>
</svg>`;
}

const posters = [
  // 01: Total Body Modification (TBM)
  {
    slug: "total-body-modification",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    accentDark: "#0369a1",
    tag: "[ 01 // DUAL-SURFACE WELLNESS PLATFORM · LIVETBM.COM ]",
    tagWidth: 470,
    title: "Total Body Modification",
    subtitle: "Dual-Surface Wellness Platform & Live Session Rooms",
    lede1: "Dual-surface wellness platform pairing WooCommerce memberships",
    lede2: "and certified practitioner scheduling with custom practitioner portals",
    lede3: "and real-time WebRTC live session rooms at livetbm.com.",
    chip1Title: "COMMERCE & PRACTITIONER TIERS",
    chip1Text: "WooCommerce memberships · Certification tiers & digital training paths",
    chip2Title: "WEBRTC & WEBSOCKET ENGINE",
    chip2Text: "Encrypted live consultation rooms · Intake health assessment questionnaires",
    windowTitle: "TBM_CONNECT // PRACTITIONER_WORKSPACE",
    statusPillText: "WEBRTC LIVE SESSION",
    statusPillX: 436,
    statusPillWidth: 162,
    badge1: "WordPress / Woo",
    b1Width: 135,
    badge2: "Node.js & WebSockets",
    b2Width: 165,
    badge3: "WebRTC Video",
    b3Width: 125,
    domain: "LIVETBM.COM",
    domainPillWidth: 180,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f0f9ff" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="144" height="22" rx="4" fill="#bae6fd"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0369a1">SESSION ACTIVE #084</text>
          <text x="156" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0c4a6e">Dr. Practitioner · 1-on-1 Health Assessment</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">P2P Encrypted WebRTC Video Consultation · Zero third-party cloud recording</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#10b981"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#047857">STATUS: CONNECTED (24ms)</text>
            <text x="210" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">AUDIO/VIDEO: 1080p 60fps</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">PRACTITIONER INTAKE &amp; ASSESSMENT PIPELINE</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Patient Health History</text>
          <text x="195" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Digital intake form verified</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#f0fdf4"/>
          <text x="444" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">VERIFIED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Vitals &amp; Bio-Assessment</text>
          <text x="195" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Real-time practitioner notes</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#eff6ff"/>
          <text x="448" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">IN PROGRESS</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#f1f5f9"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#64748b">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Care Protocol Dispatch</text>
          <text x="195" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Automated PDF care plan</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#f8fafc"/>
          <text x="456" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#64748b">QUEUED</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">SYSTEM ARCHITECTURE &amp; SERVICE SPECS</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[COMMERCE]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">WordPress + WooCommerce subscriptions, course certifications</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[WEBRTC]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">P2P encrypted live rooms via Node.js WebSockets signaling server</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[INTAKE]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Structured client health assessments synced to practitioner console</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[TELEMETRY]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0369a1">Automated session validation, duration tracking, and room logs</text>
        </g>
      </g>
    </g>`
  },

  // 02: Followup Care Operations
  {
    slug: "followup-care",
    accent: "#059669",
    accentLight: "#10b981",
    accentDark: "#047857",
    tag: "[ 02 // CLINICAL CARE OPERATIONS · APP.FOLLOWUP.CARE ]",
    tagWidth: 460,
    title: "Followup Care Ops",
    subtitle: "Clinical Follow-Up Queues & Care-Team Coordination",
    lede1: "Care-team operations platform modernizing patient follow-up queues,",
    lede2: "automated reminders, clinic compliance logging, and multi-location",
    lede3: "coordinator triage workflows at app.followup.care.",
    chip1Title: "CARE COORDINATOR QUEUES",
    chip1Text: "Patient cohort triage · Multi-clinic assignment · Automated reminders",
    chip2Title: "ANGULAR & NODE.JS SQL PIPELINE",
    chip2Text: "Ionic cross-device frontend · Versioned relational SQL migration engine",
    windowTitle: "FOLLOWUP_OPS // CLINICAL_QUEUE_CONSOLE",
    statusPillText: "CLINICAL OPS ACTIVE",
    statusPillX: 430,
    statusPillWidth: 168,
    badge1: "Angular + Ionic",
    b1Width: 135,
    badge2: "Node.js SQL API",
    b2Width: 145,
    badge3: "Compliance Telemetry",
    b3Width: 165,
    domain: "APP.FOLLOWUP.CARE",
    domainPillWidth: 195,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#ecfdf5" stroke="rgba(5, 150, 105, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="154" height="22" rx="4" fill="#a7f3d0"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#065f46">ACTIVE CLINIC COHORT</text>
          <text x="166" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#064e3b">Post-Discharge Outreach · 4 Clinic Locations</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Automated patient outreach queue · SMS &amp; voice outreach telemetry</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#10b981"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#047857">QUEUE HEALTH: 98.4% COMPLETED</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">AUDIT: HIPAA ENCRYPTED</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">PATIENT DISCHARGE OUTREACH QUEUE</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#d1fae5"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#059669">✓</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Patient #4821 (Post-Op Day 3)</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Pain medication check confirmed</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">CONTACTED</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#fef3c7"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#d97706">!</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Patient #4829 (Cardiology Followup)</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Coordinator callback queued</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fefce8"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#b45309">TRIAGE ⚠️</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">→</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Patient #4834 (Discharge Routine)</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Automated reminder SMS sent</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="456" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">SCHEDULED</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">ENTERPRISE CLINICAL ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[FRONTEND]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Angular 14 + Ionic responsive care-coordinator workspace</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[BACKEND]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Node.js API service with relational SQL migration pipelines</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[QUEUES]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Role-gated coordinator assignment and clinic location routing</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[AUDIT]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#047857">Immutable compliance action log &amp; healthcare operational telemetry</text>
        </g>
      </g>
    </g>`
  },

  // 03: Cluck Design
  {
    slug: "cluck-design",
    accent: "#ea580c",
    accentLight: "#f97316",
    accentDark: "#c2410c",
    tag: "[ 03 // ARCHITECTURAL STUDIO PLATFORM · CLUCKDESIGN.COM ]",
    tagWidth: 480,
    title: "Cluck Design",
    subtitle: "Architectural Studio Brand Presence & Project Showcase",
    lede1: "Bespoke WordPress theme pairing custom Elementor Pro template structures",
    lede2: "with fluid spatial project showcases, curated architectural photography,",
    lede3: "and secure server-side Mailchimp inquiry capture at cluckdesign.com.",
    chip1Title: "BESPOKE ARCHITECTURAL THEME",
    chip1Text: "Custom spatial grid layout · Tailored project taxonomy filters",
    chip2Title: "PERFORMANCE & CLIENT DISCOVERY",
    chip2Text: "High-res photography optimization · Server-side Mailchimp subscriber API",
    windowTitle: "CLUCK_STUDIO // SPATIAL_PROJECT_TAXONOMY",
    statusPillText: "WORDPRESS PRO",
    statusPillX: 446,
    statusPillWidth: 152,
    badge1: "Custom WP Theme",
    b1Width: 145,
    badge2: "Elementor Pro",
    b2Width: 130,
    badge3: "Spatial Layouts",
    b3Width: 135,
    domain: "CLUCKDESIGN.COM",
    domainPillWidth: 195,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#fff7ed" stroke="rgba(234, 88, 12, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="168" height="22" rx="4" fill="#ffedd5"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#9a3412">ARCHITECTURAL PORTFOLIO</text>
          <text x="180" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#7c2d12">Spatial Design Showcase &amp; Taxonomies</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Curated high-density spatial project portfolios · Fluid editorial reveals</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#ea580c"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#c2410c">THEME: CLUCK CUSTOM STACK</text>
            <text x="230" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">PERFORMANCE: 98 LIGHTHOUSE</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">PROJECT TAXONOMIES &amp; CURATED SPATIAL STUDIES</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#ffedd5"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ea580c">A</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Commercial &amp; Adaptive Reuse</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Historic brewery conversions</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fff7ed"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#c2410c">COMMERCIAL</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#ffedd5"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ea580c">B</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Public &amp; Community Architecture</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Urban gathering pavilions</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="468" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">CIVIC SPACE</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#ffedd5"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ea580c">C</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Bespoke Residential Studios</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Modern architectural dwellings</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">RESIDENTIAL</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">STUDIO PLATFORM ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[FRAMEWORK]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">WordPress core with Elementor Pro dynamic template hierarchy</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SPATIAL]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Custom responsive 12-column grid preserving architectural scale</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[MAILCHIMP]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Server-side subscriber intake without exposing client secrets</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ASSETS]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#c2410c">High-resolution retina photography pipelines with zero plugin bloat</text>
        </g>
      </g>
    </g>`
  },

  // 04: World Cup Dreams Foundation
  {
    slug: "world-cup-dreams",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    accentDark: "#0369a1",
    tag: "[ 04 // ATHLETE GRANT PORTAL · WORLDCUPDREAMS.ORG ]",
    tagWidth: 460,
    title: "World Cup Dreams",
    subtitle: "Athlete Grant Portal & Donor Campaign Platform",
    lede1: "Athlete-first 501(c)(3) foundation platform funding elite alpine snowsport",
    lede2: "talent, streamlining grant application pipelines and accelerating",
    lede3: "donor campaign momentum at worldcupdreams.org.",
    chip1Title: "ATHLETE GRANT ALLOCATION",
    chip1Text: "Over $7M+ granted to elite athletes · Multi-stage committee review",
    chip2Title: "DONOR CAMPAIGN ARCHITECTURE",
    chip2Text: "Kadence WordPress ecosystem · Stripe processing & automated 501(c)(3) receipts",
    windowTitle: "WCD_FOUNDATION // ATHLETE_GRANT_PLATFORM",
    statusPillText: "501(C)(3) NONPROFIT",
    statusPillX: 436,
    statusPillWidth: 162,
    badge1: "Athlete Grants",
    b1Width: 135,
    badge2: "WordPress Kadence",
    b2Width: 165,
    badge3: "$7M+ Distributed",
    b3Width: 145,
    domain: "WORLDCUPDREAMS.ORG",
    domainPillWidth: 215,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f0f9ff" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#bae6fd"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0369a1">WCDF ANNUAL GRANT POOL</text>
          <text x="190" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0c4a6e">Funding Elite US Alpine Athletes</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">By the Athlete &amp; For the Athlete · Founded by US Ski Team World Cup Veterans</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#0284c7"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0369a1">TOTAL IMPACT: $7M+ GRANTED</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">STATUS: ACTIVE APPLICATION CYCLE</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">ATHLETE GRANT DISPATCH &amp; COMMITTEE REVIEW</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#1e40af">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">International Competition Grant</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">World Cup circuit travel tier</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">ALLOCATED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#1e40af">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">High-Performance Equipment</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Racing skis, boots, and tuning</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">FUNDED ✓</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#1e40af">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Injury Recovery Rehabilitation</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Return-to-snow medical support</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fefce8"/>
          <text x="454" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#b45309">IN REVIEW</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">NONPROFIT PLATFORM ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[CMS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">WordPress platform with Kadence design blocks framework</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[GRANTS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Athlete grant submission portals with committee review rubrics</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[DONATIONS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Direct online payment processing with automated 501(c)(3) receipts</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ATHLETES]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0369a1">Athlete profile storytelling and donor community campaign hubs</text>
        </g>
      </g>
    </g>`
  },

  // 05: Appreesh Protocol
  {
    slug: "appreesh",
    accent: "#9333ea",
    accentLight: "#a855f7",
    accentDark: "#7e22ce",
    tag: "[ 05 // GRATITUDE PROTOCOL · APPREESH.ORG ]",
    tagWidth: 410,
    title: "Appreesh Protocol",
    subtitle: "Gratitude Gifting Protocol & Tribute Workspace",
    lede1: "Ritual-first gratitude prototype pairing a live Next.js web application",
    lede2: "with Solana SPL Token-2022 smart contracts, Arweave media records,",
    lede3: "and Squads 2-of-3 multisig custody at appreesh.org.",
    chip1Title: "SOLANA TOKEN-2022 & MULTISIG",
    chip1Text: "3,000,000 fixed supply · Squads 2-of-3 multisig · Mint authority revoked",
    chip2Title: "RITUAL-FIRST PRODUCT WORKSPACE",
    chip2Text: "Next.js reactive UI · Phantom and Solflare wallet adapter integration",
    windowTitle: "APPREESH // SOLANA_ANCHOR_WORKSPACE",
    statusPillText: "SQUADS MULTISIG",
    statusPillX: 444,
    statusPillWidth: 154,
    badge1: "Solana / Anchor",
    b1Width: 140,
    badge2: "Squads 2-of-3",
    b2Width: 130,
    badge3: "Next.js 14",
    b3Width: 120,
    domain: "APPREESH.ORG",
    domainPillWidth: 175,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#faf5ff" stroke="rgba(147, 51, 234, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#e9d5ff"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#6b21a8">SQUADS 2-OF-3 MULTISIG</text>
          <text x="190" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#581c87">Vault PDA: BENYpvm3...GK47</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">3,000,000 APPREESH Fixed Supply · Mint &amp; Freeze Authorities Revoked</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#9333ea"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#7e22ce">26 TRANSACTIONS VERIFIED</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">TESTS: 28 PROGRAM TESTS (100%)</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">ON-CHAIN TRIBUTE TOKEN &amp; PERMANENT ARWEAVE ARCHIVE</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#f3e8ff"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#9333ea">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Genesis Tribute Token #042</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Solana SPL Token-2022 mint</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#faf5ff"/>
          <text x="460" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#7e22ce">ON-CHAIN ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#f3e8ff"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#9333ea">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Permanent Media Archive</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Arweave hash verification</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="464" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">IMMUTABLE</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#f3e8ff"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#9333ea">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Wallet Signature Verification</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Phantom &amp; Solflare adapters</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">VERIFIED ✓</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">SMART CONTRACT &amp; PROTOCOL ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[PROGRAM]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Solana Anchor program with deterministic PDA state derivation</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[CUSTODY]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Squads multisig protocol requiring 2 of 3 independent signer keys</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[UI STACK]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Next.js 14 reactive interface with client-side RPC state hydration</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SECURITY]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#7e22ce">Comprehensive custody runbook and permanent authority revocation</text>
        </g>
      </g>
    </g>`
  },

  // 06: Lead Me Guide Me — FACT-GROUNDED
  {
    slug: "lead-me-guide-me",
    accent: "#d97706",
    accentLight: "#f59e0b",
    accentDark: "#b45309",
    tag: "[ 06 // SHARED SCRIPTURE STUDY · LEADMEGUIDEME.ORG ]",
    tagWidth: 460,
    title: "Lead Me Guide Me",
    subtitle: "Shared Scripture Study & Group Annotation iOS App",
    lede1: "Native Swift iOS application anchoring families and study groups",
    lede2: "through shared Book of Mormon reading, collaborative verse highlighting,",
    lede3: "color-coded study circles, and discussion boards at leadmeguideme.org.",
    chip1Title: "COLLABORATIVE STUDY GROUPS",
    chip1Text: "Color-coded study circles · Shared Book of Mormon reading & annotations",
    chip2Title: "SWIFT IOS & FIREBASE BACKEND",
    chip2Text: "Real-time Firestore sync · OneSignal push notifications · Sentry error tracking",
    windowTitle: "LMGM_IOS // SCRIPTURE_STUDY_SYNC",
    statusPillText: "SWIFT 5.9 · FIREBASE",
    statusPillX: 436,
    statusPillWidth: 162,
    badge1: "Native Swift iOS",
    b1Width: 145,
    badge2: "Shared Annotations",
    b2Width: 155,
    badge3: "Firebase Firestore",
    b3Width: 145,
    domain: "LEADMEGUIDEME.ORG",
    domainPillWidth: 205,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#fefce8" stroke="rgba(217, 119, 6, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="138" height="22" rx="4" fill="#fef08a"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#854d0e">2 NEPHI 2:25</text>
          <text x="150" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#713f12">Family Study Circle (4 Active)</text>
          <text x="0" y="44" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#1e293b">"Adam fell that men might be; and men are, that they might have joy."</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#f59e0b"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#b45309">Mom (Annotation):</text>
            <text x="145" y="9" font-family="system-ui, sans-serif" font-size="11" fill="#475569">"Great reminder for our family devotional this morning."</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">STUDY GROUP COLLABORATION &amp; CIRCLES</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#1e40af">D</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Dad</text>
          <text x="75" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Highlighted 2 Nephi 2:27 in Blue</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#eff6ff"/>
          <text x="436" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">SHARED TO CIRCLE</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#fef3c7"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#92400e">E</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Emma</text>
          <text x="75" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Added comment on agency &amp; choice</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#fefce8"/>
          <text x="446" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#b45309">NEW NOTE 💬</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#dcfce7"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#166534">S</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Sam</text>
          <text x="75" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Completed daily reading goal · 12-day streak</text>
          <rect x="424" y="2" width="124" height="20" rx="4" fill="#f0fdf4"/>
          <text x="442" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#15803d">GOAL REACHED ✓</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">VERIFIED PRODUCT ARCHITECTURE &amp; SERVICE SPECS</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[IOS APP]</text>
          <text x="80" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Native Swift 5.9 with UIKit &amp; SwiftUI · Xcode project</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[FIREBASE]</text>
          <text x="80" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Auth (Apple/Email) + Cloud Firestore real-time snapshot sync</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ONESIGNAL]</text>
          <text x="80" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Push notification dispatch on shared group notes &amp; activity</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SENTRY]</text>
          <text x="80" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#b45309">SentrySDK native crash reporting &amp; real-time performance telemetry</text>
        </g>
      </g>
    </g>`
  },

  // 07: Outplacement Career Consulting (OCC)
  {
    slug: "occupational-career-consulting",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    accentDark: "#0369a1",
    tag: "[ 07 // WORKFORCE OUTPLACEMENT · OCC.CONSULTING ]",
    tagWidth: 450,
    title: "Outplacement Career",
    subtitle: "Workforce Outplacement & Executive Career Transition",
    lede1: "Structured workforce-transition platform supporting employers and impacted",
    lede2: "professionals with clarity, dignity, and high-touch 1-on-1 executive coaching",
    lede3: "along with transition frameworks at occ.consulting.",
    chip1Title: "STRUCTURED TRANSITION FRAMEWORK",
    chip1Text: "Responsible employer offboarding · Clear career milestone roadmaps",
    chip2Title: "EXECUTIVE COACHING PLATFORM",
    chip2Text: "Resume & LinkedIn optimization · Offer review & negotiation advisory",
    windowTitle: "OCC_CONSULTING // TRANSITION_FRAMEWORK",
    statusPillText: "EXECUTIVE COACHING",
    statusPillX: 430,
    statusPillWidth: 168,
    badge1: "Outplacement Framework",
    b1Width: 180,
    badge2: "Executive Coaching",
    b2Width: 150,
    badge3: "WordPress Kadence",
    b3Width: 150,
    domain: "OCC.CONSULTING",
    domainPillWidth: 175,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f0f9ff" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#bae6fd"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0369a1">TRANSITION ROADMAP // 4 STAGES</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0c4a6e">Corporate Outplacement Support</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Empowering displaced employees · Protecting employer brand and culture</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#0284c7"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0369a1">METHOD: HUMAN-LED COACHING</text>
            <text x="235" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">OUTCOMES: HIGH PLACEMENT RATE</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">CAREER TRANSITION MILESTONE PIPELINE</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Intake &amp; Career Assessment</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Skills audit and target matrix</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">COMPLETED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Resume &amp; LinkedIn Optimization</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Executive branding rewrite</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">VERIFIED ✓</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Mock Interviews &amp; Negotiations</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Live coaching sessions</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fefce8"/>
          <text x="460" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#b45309">ACTIVE 🎯</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">OUTPLACEMENT PLATFORM ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[PLATFORM]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">WordPress deployment with Kadence design blocks at occ.consulting</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[OFFBOARD]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Turnkey offboarding packages protecting corporate employer brand</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[COACHING]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">High-touch 1-on-1 career strategy, resume development, interview prep</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[OUTCOMES]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0369a1">Offer evaluation, total compensation guidance &amp; placement tracking</text>
        </g>
      </g>
    </g>`
  },

  // 08: Western Management Associates
  {
    slug: "western-management",
    accent: "#ca8a04",
    accentLight: "#eab308",
    accentDark: "#a16207",
    tag: "[ 08 // ASSET MANAGEMENT · WESTERN.MANAGEMENT ]",
    tagWidth: 450,
    title: "Western Management",
    subtitle: "Wasatch Front Commercial & HOA Property Operations",
    lede1: "Utah asset management experts for over 40+ years, providing comprehensive",
    lede2: "property management for commercial portfolios and residential HOA",
    lede3: "communities along the Wasatch Front at western.management.",
    chip1Title: "40+ YEARS UTAH EXPERTISE",
    chip1Text: "Family owned since 1982 in Holladay, UT · Commercial & residential HOAs",
    chip2Title: "RESIDENT PORTAL & OPERATIONS",
    chip2Text: "24/7 online resident payment portal · Emergency maintenance dispatch coordination",
    windowTitle: "WESTERN_OPS // ASSET_MANAGEMENT_PORTAL",
    statusPillText: "ESTABLISHED 1982",
    statusPillX: 444,
    statusPillWidth: 154,
    badge1: "Wasatch Front Ops",
    b1Width: 150,
    badge2: "HOA & Commercial",
    b2Width: 150,
    badge3: "WordPress Divi",
    b3Width: 135,
    domain: "WESTERN.MANAGEMENT",
    domainPillWidth: 215,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#fefce8" stroke="rgba(202, 138, 4, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="170" height="22" rx="4" fill="#fef08a"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#854d0e">ESTABLISHED 1982 // UTAH</text>
          <text x="184" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#713f12">Holladay, UT · Wasatch Front Operations</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Commercial Asset Portfolios &amp; Residential Home Owners Associations</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#ca8a04"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#a16207">EXPERIENCE: 40+ YEARS</text>
            <text x="210" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">PORTAL: 24/7 ONLINE ACCESS</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">PROPERTY PORTFOLIO OPERATIONS &amp; RESIDENT SERVICES</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#fef9c3"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ca8a04">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">HOA Community Management</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Board liaison, budgeting &amp; rules</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fefce8"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#a16207">HOA OPS ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#fef9c3"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ca8a04">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Commercial Asset Portfolios</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Leasing inquiries &amp; tenant coordination</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">COMMERCIAL</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#fef9c3"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ca8a04">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Online Owner Payment Portal</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">24/7 Dues, statements &amp; records</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">ACTIVE 24/7</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">MANAGEMENT SYSTEMS ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[PLATFORM]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">WordPress site built with Divi layout engine at western.management</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[PORTAL]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Secure resident portal login for association dues &amp; account records</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[MAINTENANCE]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">24/7 emergency dispatch service and contractor management</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[LEASING]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#a16207">Direct commercial broker and vacancy inquiries for business spaces</text>
        </g>
      </g>
    </g>`
  },

  // 09: Creatives Guide Us (CGU)
  {
    slug: "creatives-guide-us",
    accent: "#0f172a",
    accentLight: "#334155",
    accentDark: "#0284c7",
    tag: "[ 09 // CREATIVE AGENCY STUDIO · CREATIVESGUIDE.US ]",
    tagWidth: 450,
    title: "Creatives Guide Us",
    subtitle: "Creative Agency & Brand Systems Studio",
    lede1: "Creative agency platform pairing multidisciplinary brand design systems,",
    lede2: "editorial portfolios, analog vinyl calligraphy, and client delivery",
    lede3: "workspaces at creativesguide.us.",
    chip1Title: "BRAND IDENTITY SYSTEMS",
    chip1Text: "Visual identity design · Art direction · Typography & print production",
    chip2Title: "STUDIO OS & CLIENT WORKSPACES",
    chip2Text: "Next.js web platform · Case study archives · Client delivery workspaces",
    windowTitle: "CGU_STUDIO // BRAND_SYSTEMS_PLATFORM",
    statusPillText: "NEXT.JS STUDIO",
    statusPillX: 454,
    statusPillWidth: 144,
    badge1: "Brand Systems",
    b1Width: 135,
    badge2: "Art Direction",
    b2Width: 130,
    badge3: "Next.js Platform",
    b3Width: 140,
    domain: "CREATIVESGUIDE.US",
    domainPillWidth: 205,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#e2e8f0"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0f172a">CREATIVES GUIDE US STUDIO</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#334155">Brand Identity &amp; Digital Production</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Multidisciplinary Design Direction · Analog Vinyl Calligraphy · Bespoke Web</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#0284c7"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0284c7">AGENCY OS: NEXT.JS 14</text>
            <text x="210" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">PORTFOLIO: 13 CASE STUDIES</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">BRAND IDENTITY &amp; DIGITAL PRODUCTION DELIVERABLES</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#e2e8f0"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0f172a">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Brand Identity Systems</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Logotypes, custom typography, palettes</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f1f5f9"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#0f172a">SYSTEMS ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#e2e8f0"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0f172a">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Analog Calligraphy Craft</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Hand-cut vinyl, sumi ink, physical craft</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">HAND-CRAFT</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#e2e8f0"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0f172a">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Digital Surfaces &amp; Code</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Modern React, Next.js, tactile motion</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="468" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">DEPLOYED</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">STUDIO PLATFORM ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[NEXT.JS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">High-presence agency platform at creativesguide.us</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SYSTEMS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">End-to-end identity design guidelines and component libraries</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[HANDOFF]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Direct Git repositories, Figma design systems &amp; production assets</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SYNDICATE]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0284c7">Canonical work module synchronization across studio ecosystem</text>
        </g>
      </g>
    </g>`
  },

  // 10: Namastay Online
  {
    slug: "namastay-online",
    accent: "#b45309",
    accentLight: "#d97706",
    accentDark: "#92400e",
    tag: "[ 10 // CONSCIOUS FASHION ATELIER · NAMASTAY.ONLINE ]",
    tagWidth: 470,
    title: "Namastay Online",
    subtitle: "Conscious Fashion & Artisan Textile Atelier",
    lede1: "Conscious movement wear and textile atelier connecting master mills",
    lede2: "in Bangladesh for direct ethical importing with an interactive",
    lede3: "dot-calligraphy digital canvas at namastay.online.",
    chip1Title: "DIRECT BANGLADESH TEXTILES",
    chip1Text: "Artisan linen & cotton imports · Ethical transparency storytelling",
    chip2Title: "DOT-CALLIGRAPHY CANVAS ENGINE",
    chip2Text: "Interactive browser-based animation · Cormorant Garamond editorial styling",
    windowTitle: "NAMASTAY // ARTISAN_TEXTILE_ATELIER",
    statusPillText: "ETHICAL ATELIER",
    statusPillX: 444,
    statusPillWidth: 154,
    badge1: "Direct Imports",
    b1Width: 130,
    badge2: "Canvas Animation",
    b2Width: 150,
    badge3: "Linen Atelier",
    b3Width: 130,
    domain: "NAMASTAY.ONLINE",
    domainPillWidth: 195,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#fefce8" stroke="rgba(180, 83, 9, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#fef3c7"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#92400e">ETHICAL TEXTILE PIPELINE</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#78350f">Master Mills in Bangladesh · Direct Imports</text>
          <text x="0" y="44" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#334155">"Connecting artisan craftsmanship with conscious, mindful movement wear."</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#b45309"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#92400e">SOURCE: BANGLADESH ARTISAN MILLS</text>
            <text x="250" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">PORTAL: NAMASTAY.ONLINE</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">LIVING DOT-CALLIGRAPHY CANVAS &amp; FABRIC ATELIER</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#fef3c7"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#b45309">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Organic Linen &amp; Cotton Weaves</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Master artisan loomed fabrics</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#fefce8"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#92400e">SOURCED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#fef3c7"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#b45309">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Living Dot-Calligraphy Canvas</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Interactive HTML5 canvas particle flow</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="458" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">CANVAS LIVE</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#fef3c7"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#b45309">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Direct Ethical Sourcing</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">100% transparent artisan trade</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">ETHICAL ✓</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">DIGITAL ATELIER ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[TYPOGRAPHY]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Cormorant Garamond serif &amp; Montserrat sans pairing</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[CANVAS]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">High-performance 60fps particle physics simulating fluid calligraphy</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SUPPLY]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Direct import tracking connecting weavers to finished garments</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[COMMERCE]</text>
          <text x="100" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#92400e">Low-friction checkout and conscious brand storytelling</text>
        </g>
      </g>
    </g>`
  },

  // 11: Namastay Yoga & Hilo Sanctuary
  {
    slug: "namastay-yoga",
    accent: "#059669",
    accentLight: "#10b981",
    accentDark: "#047857",
    tag: "[ 11 // MOVEMENT STUDIO & SANCTUARY · NAMASTAY.YOGA ]",
    tagWidth: 470,
    title: "Namastay Sanctuary",
    subtitle: "Movement Studio & Hilo Sanctuary Initiative",
    lede1: "Holistic wellness sanctuary pairing certified yoga instruction curriculum",
    lede2: "with a mixed commercial/residential acquisition pipeline near Downtown",
    lede3: "Hilo, Hawaiʻi at namastay.yoga.",
    chip1Title: "CERTIFIED YOGA INSTRUCTION",
    chip1Text: "Somatic movement curriculum · Community wellness workshops",
    chip2Title: "DOWNTOWN HILO PROPERTY PIPELINE",
    chip2Text: "Physical studio sanctuary & on-site artisan boutique retail in development",
    windowTitle: "NAMASTAY // HILO_SANCTUARY_WORKSPACE",
    statusPillText: "HILO, HAWAIʻI",
    statusPillX: 464,
    statusPillWidth: 134,
    badge1: "Downtown Hilo",
    b1Width: 135,
    badge2: "Certified Yoga",
    b2Width: 130,
    badge3: "Sanctuary Venture",
    b3Width: 150,
    domain: "NAMASTAY.YOGA",
    domainPillWidth: 180,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#ecfdf5" stroke="rgba(5, 150, 105, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="170" height="22" rx="4" fill="#a7f3d0"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#065f46">DOWNTOWN HILO SANCTUARY</text>
          <text x="184" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#064e3b">Big Island, Hawaiʻi · Property Development</text>
          <text x="0" y="44" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#334155">"Intentional movement studio, on-site artisan retail, and community gathering space."</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#059669"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#047857">STATUS: ACQUISITION PIPELINE</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">TRACK: CERTIFIED YOGA TEACHER</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">SANCTUARY DEVELOPMENT &amp; SOMATIC CURRICULUM</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#d1fae5"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#059669">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Physical Sanctuary Acquisition</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Mixed-use commercial/residential site</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#ecfdf5"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#047857">PROSPECT</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#d1fae5"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#059669">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Certified Yoga Curriculum</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Somatic flows &amp; restorative classes</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="460" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">CERTIFIED ✓</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#d1fae5"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#059669">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Boutique Retail &amp; Community</text>
          <text x="245" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Artisan movement wear &amp; wellness goods</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">RETAIL HUB</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">SANCTUARY VENTURE ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[LOCATION]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Historic Downtown Hilo mixed-use property acquisition</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[STUDIO]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Physical movement space hosting daily intentional classes</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[COMMERCE]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">On-site boutique paired with namastay.online direct imports</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[COMMUNITY]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#047857">Holistic sound baths, meditation workshops &amp; community gatherings</text>
        </g>
      </g>
    </g>`
  },

  // 12: johnwalls.studio
  {
    slug: "johnwalls-studio",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    accentDark: "#0369a1",
    tag: "[ 12 // AUDIO DSP LAB & VST PLUGIN · JOHNWALLS.STUDIO ]",
    tagWidth: 470,
    title: "johnwalls.studio",
    subtitle: "Generative Audio DSP & Ableton Live VST3/AU Plugin",
    lede1: "Generative audio DSP lab bridging Ableton Live 12, JUCE C++ plugins,",
    lede2: "SuperCollider OSC synthesis, and an interactive browser-based visualizer",
    lede3: "canvas at johnwalls.studio.",
    chip1Title: "JUCE C++ VST3 & AU BINARIES",
    chip1Text: "Native macOS compilation · Custom filter matrices & DSP algorithms",
    chip2Title: "REAL-TIME OSC & WEBSOCKET BRIDGE",
    chip2Text: "SuperCollider scsynth integration · Live parameter streaming to web canvas",
    windowTitle: "JOHNWALLS // DSP_TELEMETRY_CONSOLE",
    statusPillText: "ABLETON LIVE 12",
    statusPillX: 444,
    statusPillWidth: 154,
    badge1: "JUCE C++",
    b1Width: 115,
    badge2: "VST3 / AU Plugin",
    b2Width: 150,
    badge3: "SuperCollider OSC",
    b3Width: 155,
    domain: "JOHNWALLS.STUDIO",
    domainPillWidth: 205,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f0f9ff" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#bae6fd"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0369a1">JUCE C++ ENGINE // ACTIVE</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0c4a6e">Ableton Live 12 · Sample Rate: 48.0 kHz</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Native macOS VST3 &amp; AU binaries installed · Real-time WebSocket telemetry</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#10b981"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#047857">BUFFER: 128 SAMPLES (2.6ms)</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">DSP LOAD: 3.8% · ZERO DROP</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">AUDIO DSP TELEMETRY &amp; REAL-TIME OSC STREAM</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">JUCE C++ Audio Processor</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Biquad filters &amp; non-linear delay</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">COMPILED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">SuperCollider OSC Scsynth</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">UDP port 57120 parameter bridge</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="464" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">OSC SYNCED</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#e0f2fe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Interactive Web Visualizer</text>
          <text x="235" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Live audio take publishing canvas</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">PUBLISHED ✓</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">AUDIO DSP SYSTEM ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[PLUGINS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Native macOS VST3 and AU plugins built with CMake &amp; JUCE 7</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[WEBSOCKET]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">High-speed telemetry server streaming real-time DSP events</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ABLETON]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Live 12 track hosting with automated build &amp; reload pipelines</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[WEB CANVAS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0369a1">Interactive React canvas for take capture at johnwalls.studio</text>
        </g>
      </g>
    </g>`
  },

  // 13: Walls/Devine — Volume 1
  {
    slug: "walls-devine",
    accent: "#e11d48",
    accentLight: "#f43f5e",
    accentDark: "#be123c",
    tag: "[ 13 // STUDIO MASTER & SYNC CATALOG · JOHNWALLS.ROCKS ]",
    tagWidth: 470,
    title: "Walls/Devine — Vol. 1",
    subtitle: "Debut 8-Track Studio Master & Direct Sync Catalog",
    lede1: "Debut 8-track studio master album tracked live on 2-inch tape in Los Angeles,",
    lede2: "cleared for 100% direct sync licensing and companion score packaging",
    lede3: "at johnwalls.rocks.",
    chip1Title: "2-INCH ANALOG TAPE TRACKING",
    chip1Text: "Tracked live in Los Angeles · Studer A800 24-track · Zero digital plugins",
    chip2Title: "100% DIRECT SYNC OWNERSHIP",
    chip2Text: "100% master and publishing rights retained · Film/TV supervisor cue ready",
    windowTitle: "STUDIO_MASTER // 2_INCH_TAPE_VAULT",
    statusPillText: "100% DIRECT SYNC",
    statusPillX: 440,
    statusPillWidth: 158,
    badge1: "2-Inch Analog Tape",
    b1Width: 160,
    badge2: "8 Master Cuts",
    b2Width: 130,
    badge3: "100% Direct Sync",
    b3Width: 150,
    domain: "JOHNWALLS.ROCKS",
    domainPillWidth: 195,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#fff1f2" stroke="rgba(225, 29, 72, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#fecdd3"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#9f1239">STUDER A800 2-INCH TAPE</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#881337">24-Track Live Recording in Los Angeles</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">Sean Halls &amp; Terry Devine · ATR Magnetics Master Tape at 30 IPS</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#e11d48"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#be123c">RIGHTS: 100% MASTER &amp; SYNC</text>
            <text x="240" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">TRACKS: 8 COMPLETED CUTS</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">8-TRACK MASTER TAPE SYNC CATALOG</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#ffe4e6"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#e11d48">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Space Cruiser (3:42)</text>
          <text x="210" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">124 BPM · D Minor · Driving groove</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">SYNC READY</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#ffe4e6"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#e11d48">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Mint Green Funk (4:18)</text>
          <text x="210" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">108 BPM · G Major · Analog slap</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">SYNC READY</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#ffe4e6"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#e11d48">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Pacific Sunset (5:02)</text>
          <text x="210" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">96 BPM · E Minor · Atmospheric</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">SYNC READY</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">DIRECT SYNC &amp; PUBLISHING ARCHITECTURE</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ANALOG]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Live tracked to 2-inch tape with vintage Neve/API console preamps</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[OWNERSHIP]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">100% master and sync ownership with zero publisher middleman lock-in</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[SUPERVISOR]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">High-resolution WAV masters, instrumental stems &amp; score charts</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[CATALOG]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#be123c">Direct sync streaming and supervisor licensing at johnwalls.rocks</text>
        </g>
      </g>
    </g>`
  },

  // 14: Sean Halls Online Brand Card
  {
    slug: "seanhalls-online",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    accentDark: "#0369a1",
    tag: "[ SEAN HALLS // BOUTIQUE DEV SHOP · SEANHALLS.ONLINE ]",
    tagWidth: 460,
    title: "Pay Per Outcome.",
    subtitle: "Boutique Dev Shop · Fixed Scope Sprints · Staging Acceptance",
    lede1: "Outcome-driven engineering for ambitious brands and teams. Zero timesheets,",
    lede2: "no hourly billing games. You work directly with the builder and pay only",
    lede3: "when milestones are verified on staging.",
    chip1Title: "PAY PER OUTCOME GUARANTEE",
    chip1Text: "Fixed-price milestone sprints · $0 released until verified on staging",
    chip2Title: "DIRECT BUILDER RELATIONSHIP",
    chip2Text: "Direct commits from senior engineer · Clean Git repo ownership & zero lock-in",
    windowTitle: "SEANHALLS // OUTCOME_DELIVERY_CONSOLE",
    statusPillText: "VERIFIED OUTCOMES",
    statusPillX: 436,
    statusPillWidth: 162,
    badge1: "Pay Per Outcome",
    b1Width: 145,
    badge2: "Direct Commits",
    b2Width: 135,
    badge3: "Staging Acceptance",
    b3Width: 165,
    domain: "SEANHALLS.ONLINE",
    domainPillWidth: 205,
    innerWorkspaceSvg: `
    <g transform="translate(16, 50)">
      <g>
        <rect width="580" height="96" rx="8" fill="#f0f9ff" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="180" height="22" rx="4" fill="#bae6fd"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#0369a1">LOCKED SPRINT MILESTONE</text>
          <text x="194" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0c4a6e">Verifiable Acceptance Criteria</text>
          <text x="0" y="44" font-family="system-ui, sans-serif" font-size="12" fill="#334155">You only pay when software works in production on live staging</text>
          <g transform="translate(0, 56)">
            <circle cx="6" cy="6" r="4" fill="#10b981"/>
            <text x="16" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#047857">STATUS: 100% DELIVERED &amp; ACCEPTED</text>
            <text x="270" y="9" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#64748b">HOURLY FLUFF: $0</text>
          </g>
        </g>
      </g>
      <g transform="translate(0, 108)">
        <rect width="580" height="142" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="24" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">OUTCOME-DRIVEN SPRINT LIFECYCLE</text>
        <g transform="translate(16, 38)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="9" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">1</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Concrete Scoping Spec</text>
          <text x="215" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Locked scope &amp; fixed milestone price</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="466" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">AGREED ✓</text>
        </g>
        <g transform="translate(16, 72)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">2</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Direct Engineering Sprint</text>
          <text x="215" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Senior commits, tests &amp; CI automation</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#eff6ff"/>
          <text x="464" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#2563eb">SHIPPED ✓</text>
        </g>
        <g transform="translate(16, 106)">
          <circle cx="12" cy="12" r="10" fill="#dbeafe"/>
          <text x="8" y="16" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#0284c7">3</text>
          <text x="32" y="16" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#0f172a">Staging Acceptance</text>
          <text x="215" y="16" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">You test live build with your own hands</text>
          <rect x="444" y="2" width="104" height="20" rx="4" fill="#f0fdf4"/>
          <text x="462" y="16" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="bold" fill="#16a34a">VERIFIED ✓</text>
        </g>
      </g>
      <g transform="translate(0, 262)">
        <rect width="580" height="148" rx="8" fill="#f8fafc" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
        <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#64748b">ENGINEERING RIGOR &amp; ACCOUNTABILITY</text>
        <g transform="translate(16, 38)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[CONTRACT]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Fixed milestone pricing with zero timesheets and zero hourly risk</text>
        </g>
        <g transform="translate(16, 62)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[ACCESS]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Direct access to the senior builder writing the Git commits</text>
        </g>
        <g transform="translate(16, 86)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[OWNERSHIP]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#334155">Clean Git repositories and full code ownership with zero lock-in</text>
        </g>
        <g transform="translate(16, 110)">
          <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="bold" fill="#0f172a">[STACK]</text>
          <text x="96" y="14" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#0369a1">Modern React, Node.js, C++ JUCE, Angular, Next.js &amp; Cloud</text>
        </g>
      </g>
    </g>`
  }
];

console.log(`Generating ${posters.length} custom light-mode case-study posters via Chromium...`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });

for (const poster of posters) {
  const svg = buildLightPosterSvg(poster);
  const tmpSvg = `/tmp/${poster.slug}.svg`;
  const tmpPng = `/tmp/${poster.slug}.png`;
  
  writeFileSync(tmpSvg, svg, "utf8");
  await page.setContent(`<style>html,body{margin:0;padding:0;overflow:hidden;background:#f8fafc;}</style>` + svg);
  await page.screenshot({ path: tmpPng });
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
  }
}

await browser.close();

console.log("\nAll 14 light-mode case-study posters rendered and distributed successfully!");
