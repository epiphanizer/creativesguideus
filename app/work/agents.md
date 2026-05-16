# Work Module Agent Notes

- Scope: This module owns the client-work and case-study source of truth for Creatives Guide Us, including [app/work/page.tsx](app/work/page.tsx), [components/WorkSection.tsx](components/WorkSection.tsx), [components/work/CaseStudyTemplate.tsx](components/work/CaseStudyTemplate.tsx), and [data/work/module.json](data/work/module.json).
- Source-of-truth rule: Shared work summaries live in [data/work/module.json](data/work/module.json). If a study title, teaser, tags, proof points, or outbound URL changes, update that file first.
- Export rule: `seanhalls_online` should consume the generated artifact produced by `npm run sync:work-module`, not a hand-maintained duplicate.
- Boundary rule: Full case-study pages remain in `cgu_master`. `seanhalls_online` should receive a modular summary layer and links back to the source site, not a second authoring surface.
- Drift rule: Do not edit generated JSON in `seanhalls_online/src/data` by hand unless you are explicitly repairing a broken sync.
- When syncing: run `npm run sync:work-module` from the `cgu_master` root, then validate `seanhalls_online` separately.