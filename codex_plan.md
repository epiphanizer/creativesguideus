Sprint 1:

One typeface + one accent rule (like a gallery placard)

Kill any section that doesn’t support the CTA

Constrain width + enforce rhythm (most “messy” sites are spacing, not design)

Sprint 1 — Marketing-first copy + page slimming

Goal: remove low-value content; sharpen the funnel.
Tasks

Rewrite hero + offers + process + CTA copy (short, punchy)

Reduce Work tiles to “best of” (3–6)

Add proof strip (3 bullets/logos/testimonial fragment)
Done when

Home page reads in under 30 seconds

Every section leads naturally to the CTA

Refactor the site to enforce consistent spacing/typography.
- Create a reusable <Section> wrapper with standardized padding, max-width container, and optional id/anchor.
- Replace ad-hoc spacing across Home sections with the wrapper.
- Add a small typography scale (4 sizes) and apply consistently.
- Ensure prefers-reduced-motion is respected for any animations.
Return a diff summary + list of touched files.

Streamline the homepage into a marketing-first funnel:
- Rewrite copy to be minimalist (1–3 sentences per section).
- Hero: headline + subhead + 2 CTAs.
- Add a proof strip (3 bullets).
- Selected work: 3–6 tiles only.
- Offer: 3 cards.
- Process: 3 steps.
- End with a strong CTA section.
Focus on spacing polish and modern minimalist aesthetics.


Sprint 2 — Blog + database-driven content (Firestore)

Goal: posts/projects come from Firestore, not hardcoded.
Tasks

Firestore collections: posts, projects, globals

Public routes: /blog, /blog/[slug], /work, /work/[slug]

Markdown rendering with safe components
Done when

You can add a post in Firestore and it appears on the site

Codex prompt
Implement Firestore-backed content:
- Define collections: posts, projects, globals.
- Add routes /blog, /blog/[slug], /work, /work/[slug].
- Render post/project bodies from Markdown with a controlled renderer.
- Add caching/revalidation so public pages remain fast.
Provide the Firestore document schema and example docs.

Sprint 3 — Terry-friendly Admin

Goal: Terry can create/edit/publish without git.
Tasks

/admin with Firebase Auth (Google sign-in)

Role-based access (editor/admin)

CRUD UI for posts + projects + globals

Markdown editor + preview

Storage upload for images
Done when

Terry can publish a post end-to-end in < 5 minutes

Codex prompt
Build a simple /admin CMS:
- Firebase Auth with Google sign-in.
- Restrict access by role (admin/editor).
- CRUD for posts/projects/globals.
- Markdown editor with live preview.
- Image upload to Firebase Storage and insert URL into content.
Keep UI minimalist and foolproof.

Sprint 4 — Analytics wiring (GA4 + GTM) + event tracking

Goal: measure what matters; enable iteration.
Tasks

Add GA4 + GTM

Implement event helpers + events listed above

UTM capture and persistence (session-level)
Done when

CTA clicks + contact submits show up cleanly in GA4

Codex prompt
Add analytics:
- Integrate GA4 and Google Tag Manager.
- Implement event tracking: cta_click, contact_submit, work_open, post_open, scroll_depth, outbound_click.
- Include useful parameters (section, label, slug, destination).
- Add UTM capture and store in session/local storage to attach to events.
Ensure privacy-friendly defaults and no duplicate firing.

Sprint 5 — SEO + performance polish

Goal: rank + load like a whisper.
Tasks

Metadata per post/project (OpenGraph, titles, descriptions)

Sitemap + robots

Schema.org for posts/projects

Fix remaining CLS/LCP issues
Done when

Lighthouse is strong and previews look correct in social shares

Codex prompt
Improve SEO + performance:
- Add dynamic metadata (title/description/OG) for posts and projects.
- Generate sitemap.xml and robots.txt.
- Add schema.org structured data for blog posts and portfolio projects.
- Audit and fix CLS/LCP issues (images, fonts, layout).
Summarize results and key metrics improvements.