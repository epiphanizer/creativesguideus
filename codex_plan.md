Codex Instructions: Case Studies Makeover (Unify + Upgrade + Convert)
Goal

Make every case study feel like the same “premium editorial product page”:

consistent visual rhythm

strong hierarchy + scannability

trust signals (proof, metrics, constraints)

a clear “hire us” conversion path

zero sloppy spacing or ad-hoc layout drift

You will:

Lock a single shell layout (already exists) and enforce strict content rules.

Upgrade the template UI/UX to be more modern, corporate, and polished.

Normalize the 3 case studies so they read as cohesive work.

Add a case-studies index grid page (if not already) that drives clicks + contact.

Sprint 1 — Audit + Content Contract (No Design Yet)
1.1 Create a “content contract” for every case study

In /components/work/CaseStudyTemplate.tsx, treat the sections as a required schema. Document rules in a comment block at the top:

Rules

Hero:

eyebrow always "Case study"

title: 3–7 words, punchy

description: 1 sentence, outcome + audience

body: 2 paragraphs max (each 1–3 sentences)

actions: always 2 CTAs (Primary + Secondary)

Quick facts:

always 5–7 rows (avoid 3 on one page and 9 on another)

consistent labels across all studies: Partner, Practices, Platform, Timeline, Release mode, optional Impact

Highlights:

always 3–4 items

Narrative:

always 3 sections (Discovery / Design / Build+Launch style)

Process:

always 4 stages

Deliverables:

always 5 items

Quote:

optional, but if present must be 1–2 sentences max

Closing:

must include a confident next step + contact CTA

Codex task: add this contract comment without changing runtime behavior yet. 

CaseStudyTemplate

1.2 Normalize copy across the 3 existing case study pages

Edit each page so it follows the same shape:

Appreesh: already close; ensure quickFacts count matches target; keep hero body to exactly 2 paragraphs. 

page

Lead Me Guide Me: already close; same normalization. 

page

World Cup Dreams: hero body has more drift/length; trim to 2 paragraphs; fix inconsistent indentation; ensure highlights and facts match counts. 

page

Important: No new content invention needed—just tighten and standardize.

Deliverable for Sprint 1: The 3 pages read like siblings.

Sprint 2 — Template Becomes “State of the Art”

Your template is structurally good, but visually it likely needs:

stronger grid control

better spacing rhythm

more premium “editorial” sections

improved CTA treatment

consistent card styles

better mobile stacking rules

2.1 Upgrade layout hierarchy in CaseStudyTemplate

Edit /components/work/CaseStudyTemplate.tsx:

Hero

Add a hero “meta row” under the header:

left: description + body

right: a compact “facts preview” (top 3 facts only) to create immediate credibility above the fold

Keep the full “Quick facts” section below as-is for depth.

Quick facts + highlights

Render quick facts in a 2-column definition list on desktop.

Render highlights as cards with consistent height and tighter typography.

Narrative

Switch narrative layout to:

left sticky mini-TOC (the 3 narrative titles)

right content column

If you don’t want sticky: at least enforce a clean 2-column grid with equal padding and max line length.

Process

Make process an “indexed timeline” (01/02/03/04), with a thin divider line.

Ensure mobile becomes stacked cards.

Deliverables

Turn deliverables into a two-column list on desktop with a small “pill” label + detail.

Quote

Make quote visually distinct (border, padding, subtle background).

Keep it compact.

Closing

Make closing a “conversion banner” with:

short note

1 primary CTA button

optional small secondary link (like “See more work”)

All of this stays within the existing template API—you’re changing presentation, not data shape. 

CaseStudyTemplate

2.2 Add “Proof row” support (optional but recommended)

Add an optional prop like:

proof?: { label: string; value: string }[] (3 items max)

Use it as a small row near the hero:

“Timeline: 14 weeks”

“Platform: WordPress”

“Impact: $7M+ granted”

Then for each case study, populate with 2–3 high-confidence numbers/claims that already exist in the copy/facts.

This creates immediate corporate trust without forcing people to read paragraphs. 

page

Deliverable for Sprint 2: template looks like a premium product page, not a blog post.

Sprint 3 — Make All Case Studies Feel Like One System
3.1 Standardize CTA language and intent

Across all pages, enforce the same CTA pattern:

Primary: “Start a project” / “Book a consult” / “Plan a pilot”

Secondary: “View live site” (if external) OR “See our process” (internal anchor)

Right now, CTA patterns vary a lot (some have 1 button, some have 4). That feels messy and non-corporate. Normalize to 2 max in the hero actions.

3.2 Normalize facts labels + ordering

Pick one order and apply it everywhere:

Partner

Practices

Platform

Timeline

Release mode

Impact (optional)

Metrics (optional)

World Cup Dreams has many facts—keep the extra ones, but move them into an “Impact” sub-block below the primary facts so it doesn’t overwhelm the grid. 

page

3.3 Tighten narrative voice consistency

Make sure each narrative’s 3 sections follow consistent naming:

“Discovery”

“Design”

“Build + Launch”

If you want flavor, keep it in the paragraph text—not in the structure headings.

Deliverable for Sprint 3: no one can tell these were written at different times.

Sprint 4 — Case Study Index Page That Converts
4.1 Build /work (or /case-studies) index page

Create an index page that:

has a short hero: “Work that ships. Stories that convert.”

shows a grid of 3 case studies as cards:

title

one-line description

2–3 proof pills (platform/timeline/impact)

“Read case study →”

ends with a strong contact band CTA

This page should be the “send this to a prospect” link.

4.2 Add “Related case studies” at bottom of each case study

In CaseStudyTemplate, add an optional related section:

renders 2 small cards linking to other case studies

keeps people moving through proof, then to contact

Deliverable for Sprint 4: the work section becomes a funnel, not a dead-end.

Acceptance Criteria (Definition of Done)

All 3 case studies use the same content contract and visual rhythm.

Above-the-fold includes proof + clear next step.

No page has more than 2 hero CTAs.

Facts, highlights, narrative, process, deliverables have consistent counts and styling.

Mobile feels intentional (no awkward stacking, no giant whitespace).

Index page exists and drives contact.

