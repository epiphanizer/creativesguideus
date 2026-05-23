# Work Module Agent Notes

- Scope: This module owns the syndicated work-summary source of truth for Creatives Guide Us, including [app/work/page.tsx](app/work/page.tsx), [components/WorkSection.tsx](components/WorkSection.tsx), and [data/work/module.json](data/work/module.json).
- Source-of-truth rule: Shared work summaries live in [data/work/module.json](data/work/module.json). If a study title, teaser, tags, proof points, or outbound URL changes, update that file first.
- Portfolio rule: A blank `caseStudyPath` and `caseStudyUrl` means the entry is portfolio-only for now. Do not route those cards to an internal case-study page until a real long-form study exists.
- Export rule: `seanhalls_online` should consume the generated artifact produced by `npm run sync:work-module`, not a hand-maintained duplicate.
- Boundary rule: Public work browsing lives on `seanhalls_online`. `cgu_master` keeps the source data and any legacy `/work` routes should hand off outward instead of reviving local case-study pages.
- Drift rule: Do not edit generated JSON in `seanhalls_online/src/data` by hand unless you are explicitly repairing a broken sync.
- When syncing: run `npm run sync:work-module` from the `cgu_master` root, then validate `seanhalls_online` separately.