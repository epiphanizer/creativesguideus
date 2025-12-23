Creatives Guide Us — Codex Task List (Sprint-style)

Execution Checklist
1. Complete EPIC 0 — Repo + Baseline — DONE
2. Complete EPIC 1 — Navigation + UX Plumbing — DONE
3. Complete EPIC 2 — Shared UI Primitives (DRY) — DONE
4. Complete EPIC 3 — Hero + Signature Motif — DONE
5. Complete EPIC 4 — Web / Branding / Storytelling Section — DONE
6. Complete EPIC 5 — Music Section (Zine-ish)
7. Complete EPIC 6 — Writing Section (Screenwriting + Copywriting)
8. Complete EPIC 7 — Selected Work (Optional) + About
9. Complete EPIC 8 — Contact + Launch Readiness
EPIC 0 — Repo + Baseline

T0.1 Initialize Next.js App Router — DONE

AC: npm run dev boots, App Router structure present (app/layout.tsx, app/page.tsx)

Files: app/layout.tsx, app/page.tsx, package.json

T0.2 Add global styles + theme tokens — DONE

AC: grayscale palette tokens + type scale + spacing vars exist; applied to body + headings

Files: styles/theme.css, styles/globals.css, app/layout.tsx

T0.3 Add lint/format conventions — DONE

AC: eslint + prettier config present; npm run lint passes

Files: .eslintrc*, .prettierrc*, package.json

EPIC 1 — Navigation + UX Plumbing

T1.1 Create anchor registry — DONE

AC: single source of truth exports anchors { id, label }

Files: components/nav/anchors.ts

T1.2 Build sticky header nav — DONE

AC: header sticks; anchor links scroll to sections; active link style exists

Files: components/HeaderNav.tsx

T1.3 Active section observer hook — DONE

AC: active nav updates as user scrolls; no flicker; handles edge cases at top/bottom

Files: hooks/useActiveSection.ts

T1.4 Reduced motion hook + smooth scroll guard — DONE

AC: when prefers-reduced-motion, animations/parallax disabled and scroll is instant

Files: hooks/usePrefersReducedMotion.ts, components/HeaderNav.tsx

EPIC 2 — Shared UI Primitives (DRY)

T2.1 Section shell + section header components — DONE

AC: consistent spacing + layout; supports optional eyebrow, title, subtitle

Files: components/ui/SectionShell.tsx, components/ui/SectionHeader.tsx

T2.2 Card + tag + button primitives — DONE

AC: consistent card styling used by all sections; hover states subtle

Files: components/ui/Card.tsx, components/ui/Tag.tsx, components/ui/Button.tsx

EPIC 3 — Hero + Signature Motif (Monochrome Line Art)

T3.1 Hero content + CTA pair — DONE

AC: headline/subhead/CTAs in place; responsive; clear hierarchy

Files: components/HeroSection.tsx

T3.2 Line grid motif component — DONE

AC: grayscale line-art grid renders behind hero; looks “NY-grid / Mondrian-ish”

Files: components/motif/LineGridMotif.tsx

T3.3 Parallax layering (restrained) — DONE

AC: subtle parallax on scroll; disabled under reduced motion; no performance spikes

Files: components/motif/LineGridMotif.tsx, hooks/usePrefersReducedMotion.ts

EPIC 4 — Web / Branding / Storytelling Section

T4.1 Web services card grid — DONE

AC: 4–6 cards with tight copy placeholders; consistent spacing and hover

Files: components/WebSection.tsx

T4.2 Process mini-strip (Discover → Design → Build → Launch) — DONE

AC: appears in Web section and/or shared Process section; looks premium

Files: components/ProcessStrip.tsx (or embedded)

T4.3 Case preview blocks (placeholder) — DONE

AC: 1–2 case preview components exist with image placeholder + one-liner

Files: components/WebSection.tsx, components/ui/CasePreview.tsx (optional)

EPIC 5 — Music Section (Zine-ish)

T5.1 Zine layout scaffold

AC: editorial grid layout; minimal liner-notes vibe; not “tech startup”

Files: components/MusicSection.tsx

T5.2 Cue list with hover reveal metadata

AC: list shows cue title + duration; hover reveals mood/instrumentation; keyboard accessible

Files: components/music/CueList.tsx

T5.3 Audio player UI stubs

AC: 2–3 player placeholders styled (no real audio required); looks intentional

Files: components/music/PlayerStub.tsx

EPIC 6 — Writing Section (Screenwriting + Copywriting)

T6.1 Choose interaction pattern: Tabs or Accordion

AC: one chosen pattern implemented; works on mobile; accessible

Files: components/writing/WritingTabs.tsx or components/writing/WritingAccordion.tsx

T6.2 Screenwriting lane (loglines)

AC: 3–5 loglines in polished placeholders; formatted like one-sheet

Files: components/WritingSection.tsx

T6.3 Copywriting lane (offer + samples)

AC: short service bullets + 1–2 sample snippets; no fluff

Files: components/WritingSection.tsx

EPIC 7 — Selected Work (Optional) + About

T7.1 Selected Work module decision

AC: either placeholder WorkGrid/Carousel exists OR explicitly deferred with no dead nav link

Files: components/WorkGrid.tsx or components/WorkCarousel.tsx, components/nav/anchors.ts

T7.2 About + “why us” microcopy

AC: short studio story + promise; fits brand voice; minimal layout

Files: components/AboutSection.tsx (optional)

EPIC 8 — Contact + Launch Readiness

T8.1 Contact section + form

AC: Name/Email/Project Type/Notes; basic validation; clear CTA; includes availability line

Files: components/ContactSection.tsx

T8.2 Footer manifesto

AC: 12–18 word manifesto line; minimalist footer

Files: components/Footer.tsx

T8.3 Performance + a11y pass

AC: no layout shift; images optimized; reduced motion works; keyboard nav works

Files: across project

T8.4 Deploy

AC: site live on creativesguide.us; build passes; environment documented

Files: README.md, deployment config (your platform)