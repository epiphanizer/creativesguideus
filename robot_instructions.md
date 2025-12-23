Creatives Guide Us — Planning Context Refresh (codex)
Brand + Target

Brand: Creatives Guide Us

Domain: creativesguide.us

Positioning: Boutique “web / design / everything” studio with three pillars: Web/Brand, Music, Writing.

Look/Feel: monochrome (black/white/gray), editorial typography, restrained motion, premium minimal.

Objective

Ship a single-page Next.js (App Router) portfolio that feels like a small, tasteful studio—strong hierarchy, DRY components, sticky anchor nav, and distinct section vibes while staying one unified brand.

Architecture Plan: Shared Boutique Portfolio
Core Principles

Monochrome-only system: grayscale tokens, no color unless explicitly approved for hover accent.

DRY sections: shared <SectionShell/>, <SectionHeader/>, <Card/> primitives.

Sticky header with anchor registry: predictable navigation + active-section highlighting.

Accessible motion: prefers-reduced-motion respected everywhere; no scroll-jank.

Implementation Steps (with file targets)
1) Baseline + Theme System

Initialize Next.js (App Router), global typography scale, and theme tokens.

Files:

package.json (deps + scripts)

app/layout.tsx (global layout + header mount)

styles/theme.css (CSS vars: grayscale palette, type scale, spacing)

styles/globals.css (base resets, body typography)

Deliverable: consistent type rhythm + spacing across all sections.

2) Navigation System (Sticky Header + Anchors)

Build a reusable sticky header that:

reads a single anchor registry (source of truth),

highlights active section via IntersectionObserver,

supports smooth scrolling,

respects reduced motion preferences.

Files:

components/HeaderNav.tsx

components/nav/anchors.ts (registry)

hooks/useActiveSection.ts (observer hook)

hooks/usePrefersReducedMotion.ts

Deliverable: stable nav that never “forgets” where you are.

3) Hero + Signature Motif (Monochrome Line Art)

Create hero with a minimal punchline and CTA pair.

Implement the NY-grid / Mondrian-inspired grayscale line motif:

subtle parallax layers

low-contrast noise texture

text sits on clean negative space for readability

Files:

app/page.tsx (composition)

components/HeroSection.tsx

components/motif/LineGridMotif.tsx

Deliverable: instantly recognizable “boutique” first impression.

4) Three Pillar Sections (Modular)

Build each pillar as a module built on shared primitives but with unique layouts.

Web / Branding / Storytelling (Boutique)

Card grid + process strip + case preview blocks.

Parallax motif continues subtly behind this section only.

Files:

components/WebSection.tsx

Music (Zine-ish, Minimal Pro)

Liner-notes / tracklist layout, cue list + player placeholders.

Hover reveals metadata (mood, instrumentation, duration).

Files:

components/MusicSection.tsx

components/music/CueList.tsx

components/music/PlayerStub.tsx

Writing (Screenwriting + Copywriting)

Tabs or accordion for: Screenwriting / Copywriting / Brand Voice

Pull-quote + logline list formatting, paper-ish grayscale background optional.

Files:

components/WritingSection.tsx

components/writing/WritingTabs.tsx (or Accordion)

Deliverable: three distinct vibes, one unified brand.

5) Supporting Sections + Contact

Process strip (Discover → Design → Build → Launch)

Selected Work (optional carousel or placeholder)

Contact (simple form + availability line)

Files:

components/ProcessStrip.tsx

components/WorkCarousel.tsx (or WorkGrid.tsx)

components/ContactSection.tsx

Deliverable: clear conversion path without feeling salesy.

Content + Copy Inputs Needed (to avoid blocking)

Service card copy (Web/Brand)

Cue titles + metadata (Music)

3–5 loglines + copywriting snippets (Writing)

About/process microcopy + contact CTA line

If missing, use high-quality placeholders that match the brand voice (no lorem ipsum).

Decisions to Lock for Next Iteration

Selected Work module

✅ Include now as placeholder (recommended), or

⏳ Defer entirely for launch v1

Hover accent

Strict grayscale only, or

Single accent token (still subtle) for links/active nav

Writing UI pattern

Tabs (clean, fast scanning) vs Accordion (more zine/editorial)

Definition of Done (v1)

Responsive single-page site live on creativesguide.us

Sticky nav + active section highlighting works

Motif parallax works smoothly (and disables under reduced motion)

Three pillars feel distinct + premium

Lighthouse-friendly performance (no heavy assets)

Contact path is obvious and elegant