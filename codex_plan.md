Sprint 1 — Boutique funnel refinement (Dec 2025 refresh)

Goal: keep the single-page experience reading in under 30 seconds while restoring gallery-grade restraint.

What shipped
- Locked a single monochrome type stack and iconography language across SectionShell, Card, and pulse grids.
- Trimmed hero, Web, Work, Music, and Writing copy to decisive 1–3 sentence beats with CTA-first sequencing.
- Reframed Work to three proof cases with icon badges and slimmer cards so nothing overlaps or spills.
- Pulled Bong Tour off the home narrative—Writing now links out while keeping the slate copy full width for breathing room.
- Standardized spacing via SectionShell rhythm and reduced-motion guards so the page feels composed at every breakpoint.

Success signals
- Visitors can scan the entire page in <30 seconds without encountering visual clutter.
- Every section resolves to a primary CTA or booked conversation path.
- Cards, grids, and copy stay inside the shared rhythm (1→2→3 column logic, icon caps, text never overflows).

Carry-forward guardrails
- Keep any new section within the SectionShell spacing scale.
- Prefer icon-backed summaries over dense paragraphs.
- If a story needs depth (e.g., Bong Tour), break it into its own surface and link out.

Return a diff summary + list of touched files.

Sprint 2- 
Codex Instructions for Optimization
To improve the site's consistency, you can provide the following specific instructions to your development or design tool:

1. Aligning the Tone of Voice
"Rewrite all functional copy to match the 'narrative-first' brand voice. Replace utilitarian phrases with more evocative, proprietary language. For example, change 'Contact' or 'Send project outline' to 'Begin the Narrative' or 'Start the Dialogue'. Ensure all micro-copy reflects a tone that is human, insightful, and protective of the creative process".

2. Refacing the Visual Framework
"Implement a strict monochrome minimalist grid system. Reduce the size of the contact form's input fields to match the 'Ship More Narrative' text block's width, maintaining a consistent column structure. Increase negative space (white space) around the 'Start' section to ensure it feels like a continuation of the brand’s 'no-noise' philosophy".

3. Standardizing Brand Assets
"Update the global CSS to ensure typography hierarchy is consistent across all pages. Set a primary serif font for all narrative-driven headers and a secondary, high-legibility sans-serif for functional links. Ensure the header logo 'Creatives Guide Us' is vertically aligned with the navigation menu to prevent visual 'stutter' during scrolling".

4. Interactive Branding
"Add subtle hover animations to navigation links—such as a simple fade or underline—to add a layer of 'boutique' polish without adding visual clutter. Ensure all transitions are timed to feel deliberate and calm, reinforcing the brand's 'Build Less Noise' promise".


Sprint 3 — Blog + database-driven content (Firestore)

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