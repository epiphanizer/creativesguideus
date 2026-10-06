import { execSync } from "node:child_process";
import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const cguPublicImages = "/Users/seanhalls/Desktop/sh/cgu_master/public/images";
const shoPublicAssets = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/assets";
const shoProjectAssets = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/assets/projects";
const namastayPublic = "/Users/seanhalls/Desktop/sh/seanhalls_online/public/namastay";

mkdirSync(cguPublicImages, { recursive: true });
mkdirSync(shoPublicAssets, { recursive: true });
mkdirSync(shoProjectAssets, { recursive: true });
mkdirSync(namastayPublic, { recursive: true });

const cards = [
  {
    name: "cgu-og.png",
    destinations: [
      path.join(cguPublicImages, "cgu-og.png"),
      path.join(shoProjectAssets, "creatives-guide-us.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="cguBg" cx="50%" cy="40%" r="85%">
          <stop offset="0%" stop-color="#141824"/>
          <stop offset="50%" stop-color="#0c0e15"/>
          <stop offset="100%" stop-color="#06070a"/>
        </radialGradient>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#cguBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(212, 175, 55, 0.25)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      
      <!-- Top Brand Tag -->
      <g transform="translate(80, 100)">
        <rect width="460" height="34" rx="6" fill="rgba(212, 175, 55, 0.08)" stroke="rgba(212, 175, 55, 0.3)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#d4af37" letter-spacing="3">[ 01 // INDEPENDENT CREATIVE STUDIO &amp; LABEL ]</text>
      </g>
      
      <!-- Main Display -->
      <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="70" font-weight="800" fill="#ffffff" letter-spacing="-2">Creatives Guide Us</text>
      <text x="80" y="295" font-family="Georgia, serif" font-size="28" font-style="italic" fill="url(#goldText)">Sound, Screen, and Tactile Editions.</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8" letter-spacing="0">Independent studio operating system connecting Next.js brand surfaces,</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8" letter-spacing="0">analog master audio releases, and boutique client productions.</text>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="130" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="65" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Studio OS</text>
        
        <rect x="145" y="0" width="155" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="222" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Analog Audio</text>
        
        <rect x="315" y="0" width="180" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="405" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Tactile Editions</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="rgba(212, 175, 55, 0.12)" stroke="rgba(212, 175, 55, 0.4)"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#fde047" text-anchor="middle" letter-spacing="2">CREATIVESGUIDE.US ↗</text>
      </g>
    </svg>`
  },
  {
    name: "johnwalls-studio-og.png",
    destinations: [
      path.join(cguPublicImages, "johnwalls-studio-og.png"),
      path.join(shoProjectAssets, "johnwalls-studio.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="jwBg" cx="60%" cy="30%" r="85%">
          <stop offset="0%" stop-color="#0f1f33"/>
          <stop offset="50%" stop-color="#08101e"/>
          <stop offset="100%" stop-color="#04070e"/>
        </radialGradient>
        <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#jwBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(56, 189, 248, 0.22)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      
      <!-- Top Tag -->
      <g transform="translate(80, 100)">
        <rect width="490" height="34" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#38bdf8" letter-spacing="3">[ 02 // GENERATIVE AUDIO DSP LAB · ABLETON LIVE 12 ]</text>
      </g>
      
      <!-- Title -->
      <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="850" fill="#ffffff" letter-spacing="-2">johnwalls.studio</text>
      <text x="80" y="295" font-family="ui-monospace, monospace" font-size="24" font-weight="600" fill="#38bdf8" letter-spacing="1">Native C++ VST3 / AU Engine · SuperCollider Bridge</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">Real-time WebSocket telemetry, live Ableton Live 12 transport streaming,</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">and direct-from-DAW take publishing with audiovisual canvas layers.</text>
      
      <!-- Waveform graphic line -->
      <path d="M 80 445 Q 160 410, 240 445 T 400 445 T 560 445 T 720 445 T 880 445 T 1040 445" fill="none" stroke="url(#cyanLine)" stroke-width="3" opacity="0.6"/>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="125" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="62" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">JUCE C++</text>
        
        <rect x="140" y="0" width="135" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="207" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">VST3 / AU</text>
        
        <rect x="290" y="0" width="170" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="375" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">SuperCollider OSC</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="rgba(56, 189, 248, 0.14)" stroke="rgba(56, 189, 248, 0.45)"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="2">JOHNWALLS.STUDIO ↗</text>
      </g>
    </svg>`
  },
  {
    name: "namastay-online-og.png",
    destinations: [
      path.join(cguPublicImages, "namastay-online-og.png"),
      path.join(namastayPublic, "namastay-online-og.png"),
      path.join(shoProjectAssets, "namastay-online.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="linenBg" cx="50%" cy="40%" r="85%">
          <stop offset="0%" stop-color="#fdfbf7"/>
          <stop offset="50%" stop-color="#f8f6f0"/>
          <stop offset="100%" stop-color="#ede8dc"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#linenBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(168, 121, 50, 0.35)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(0, 0, 0, 0.03)" stroke-width="1"/>
      
      <!-- Top Tag -->
      <g transform="translate(80, 100)">
        <rect width="470" height="34" rx="6" fill="rgba(168, 121, 50, 0.08)" stroke="rgba(168, 121, 50, 0.35)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#8c5e1c" letter-spacing="3">[ CONSCIOUS FASHION ATELIER · MOVEMENT WEAR ]</text>
      </g>
      
      <!-- Title -->
      <text x="80" y="240" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="400" fill="#1c1917" letter-spacing="3">NAMASTAY ONLINE</text>
      <text x="80" y="295" font-family="Georgia, serif" font-size="26" font-style="italic" fill="#a87932">Direct Bangladesh Handloom Textiles &amp; Conscious Apparel</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#57534e">Connecting master artisan weavers in Bangladesh with a light linen aesthetic,</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#57534e">ethical importing pipelines, and an animated dot-calligraphy digital atelier.</text>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="165" height="38" rx="6" fill="rgba(0,0,0,0.03)" stroke="rgba(168, 121, 50, 0.25)"/>
        <text x="82" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#44403c" text-anchor="middle">Artisan Handloom</text>
        
        <rect x="180" y="0" width="175" height="38" rx="6" fill="rgba(0,0,0,0.03)" stroke="rgba(168, 121, 50, 0.25)"/>
        <text x="267" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#44403c" text-anchor="middle">Conscious Linen</text>
        
        <rect x="370" y="0" width="175" height="38" rx="6" fill="rgba(0,0,0,0.03)" stroke="rgba(168, 121, 50, 0.25)"/>
        <text x="457" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#44403c" text-anchor="middle">Ethical Direct Import</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="#23201d"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#f8f6f0" text-anchor="middle" letter-spacing="2">NAMASTAY.ONLINE ↗</text>
      </g>
    </svg>`
  },
  {
    name: "namastay-yoga-og.png",
    destinations: [
      path.join(cguPublicImages, "namastay-yoga-og.png"),
      path.join(namastayPublic, "namastay-yoga-og.png"),
      path.join(shoProjectAssets, "namastay-yoga.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="slateBg" cx="50%" cy="35%" r="85%">
          <stop offset="0%" stop-color="#1e2430"/>
          <stop offset="50%" stop-color="#12161f"/>
          <stop offset="100%" stop-color="#0a0d14"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#slateBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      
      <!-- Top Tag -->
      <g transform="translate(80, 100)">
        <rect width="530" height="34" rx="6" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#f59e0b" letter-spacing="3">[ INTENTIONAL SANCTUARY PROSPECT · DOWNTOWN HILO ]</text>
      </g>
      
      <!-- Title -->
      <text x="80" y="240" font-family="Georgia, serif" font-size="68" font-weight="400" fill="#ffffff" letter-spacing="3">NAMASTAY YOGA</text>
      <text x="80" y="295" font-family="Georgia, serif" font-size="26" font-style="italic" fill="#fbbf24">Holistic Movement Studio, Boutique Retail &amp; Sanctuary</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">Pairing certified yoga instruction with an active acquisition pipeline</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">for a mixed commercial/residential sanctuary in Downtown Hilo, Big Island.</text>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="180" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="90" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Downtown Hilo</text>
        
        <rect x="195" y="0" width="185" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="287" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Certified Instructor</text>
        
        <rect x="395" y="0" width="180" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="485" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Boutique Retail</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.45)"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#fbbf24" text-anchor="middle" letter-spacing="2">NAMASTAY.YOGA ↗</text>
      </g>
    </svg>`
  },
  {
    name: "seanhalls-og.png",
    destinations: [
      path.join(shoPublicAssets, "seanhalls-og.png"),
      path.join(shoProjectAssets, "seanhalls-online.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="shBg" cx="50%" cy="30%" r="85%">
          <stop offset="0%" stop-color="#141c2e"/>
          <stop offset="50%" stop-color="#090d16"/>
          <stop offset="100%" stop-color="#04060a"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      
      <!-- Top Tag -->
      <g transform="translate(80, 100)">
        <rect width="430" height="34" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#38bdf8" letter-spacing="3">[ SEAN HALLS // BOUTIQUE DEV SHOP ]</text>
      </g>
      
      <!-- Title -->
      <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="850" fill="#ffffff" letter-spacing="-2">Pay Per Outcome.</text>
      <text x="80" y="295" font-family="ui-monospace, monospace" font-size="24" font-weight="600" fill="#38bdf8" letter-spacing="1">High-Impact Web Surfaces · Client Portals · Delivery Systems</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">Boutique online dev shop where you pay per verified milestone outcome,</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">not per billable hour. Engineered to ship with Apple Silicon unified compute.</text>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="175" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="87" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Pay Per Outcome</text>
        
        <rect x="190" y="0" width="175" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="277" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Zero Hourly Lock-in</text>
        
        <rect x="380" y="0" width="175" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="467" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">High-Impact Craft</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="rgba(56, 189, 248, 0.14)" stroke="rgba(56, 189, 248, 0.45)"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="2">SEANHALLS.ONLINE ↗</text>
      </g>
    </svg>`
  },
  {
    name: "followup-care.png",
    destinations: [
      path.join(shoProjectAssets, "followup-care.png")
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="folBg" cx="50%" cy="30%" r="85%">
          <stop offset="0%" stop-color="#132338"/>
          <stop offset="50%" stop-color="#0a1320"/>
          <stop offset="100%" stop-color="#050a12"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#folBg)"/>
      <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(45, 212, 191, 0.25)" stroke-width="1.5"/>
      <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      
      <!-- Top Tag -->
      <g transform="translate(80, 100)">
        <rect width="520" height="34" rx="6" fill="rgba(45, 212, 191, 0.08)" stroke="rgba(45, 212, 191, 0.35)" stroke-width="1"/>
        <text x="18" y="22" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#2dd4bf" letter-spacing="3">[ HEALTHCARE OPERATIONS PLATFORM · APP.FOLLOWUP.CARE ]</text>
      </g>
      
      <!-- Title -->
      <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="70" font-weight="850" fill="#ffffff" letter-spacing="-2">Followup Care Operations</text>
      <text x="80" y="295" font-family="ui-monospace, monospace" font-size="24" font-weight="600" fill="#2dd4bf" letter-spacing="1">Clinical Queue Orchestration &amp; Care-Team Coordination</text>
      
      <!-- Body / Lede -->
      <text x="80" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">Patient discharge follow-up platform modernizing clinical queues,</text>
      <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">care-team notifications, compliance telemetry, and administrative control.</text>
      
      <!-- Badges -->
      <g transform="translate(80, 480)">
        <rect x="0" y="0" width="155" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="77" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Angular + Ionic</text>
        
        <rect x="170" y="0" width="155" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="247" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Node.js + SQL</text>
        
        <rect x="340" y="0" width="180" height="38" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.15)"/>
        <text x="430" y="24" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">Clinical Telemetry</text>
      </g>
      
      <!-- Domain Pill -->
      <g transform="translate(860, 480)">
        <rect width="260" height="38" rx="6" fill="rgba(45, 212, 191, 0.14)" stroke="rgba(45, 212, 191, 0.45)"/>
        <text x="130" y="24" font-family="ui-monospace, monospace" font-size="14" font-weight="700" fill="#2dd4bf" text-anchor="middle" letter-spacing="2">APP.FOLLOWUP.CARE ↗</text>
      </g>
    </svg>`
  }
];

for (const card of cards) {
  const tmpSvg = `/tmp/${card.name}.svg`;
  const tmpPng = `/tmp/${card.name}`;
  writeFileSync(tmpSvg, card.svg, "utf8");
  execSync(`magick "${tmpSvg}" "${tmpPng}"`);
  console.log(`Rendered ${card.name} (${tmpPng})`);
  for (const dest of card.destinations) {
    copyFileSync(tmpPng, dest);
    console.log(` -> Copied to ${dest}`);
  }
}

console.log("All Open Graph cards generated and distributed successfully!");
