# Agents Playbook

- Always run `npm run build` before declaring a task complete.
- Capture build outcomes in handoff notes when reporting status.
- Keep UI adjustments accessible, checking contrast when adding effects.
- Master state rule: `../sh_hub/docs/MASTER_STATE.md` is the canonical cross-repo architecture guide for `cgu_master`, `seanhalls_master`, `seanhalls_online`, `sh_hub`, and `appreesh_master`. Read it before changing repo boundaries, Firebase contracts, mirror behavior, intake routing, or shared admin ownership. If any of those change, update that document in the same task.
- Use [app/admin/agents.md](app/admin/agents.md) before editing the hidden admin route, Firebase auth flow, or Firestore and Storage content contract.
- Admin recommendation rule: when asked what to work on next for the CGU admin console, review the in-app backlog first. The console now hides any admin surface marked `pending` and parks it in backlog instead of the main workspace.
- The public `/links` page now reads from Firestore `adminProjects/walls-devine/publicContent/linkHub` through the hidden admin. Keep that route, the admin editor, and `firestore.rules` in sync.
- If a CGU change touches canonical billing, prepared invoices, timekeeping, or token usage semantics, review sibling repo `../sh_hub` first; those concerns now live there, not in public-route code.
- Use [app/walls-devine/agents.md](app/walls-devine/agents.md) and [app/bong-tour/agents.md](app/bong-tour/agents.md) for route-specific experience rules before editing those landing pages.
- Use [app/work/agents.md](app/work/agents.md) before editing the work module or its export contract to `seanhalls_online`.
- Use each route's paired `style-guide.md` to preserve palette, typography, and cross-link behavior for modular marketing pages.

## Friday Launch Status — Reference Only

- Launch target was Sunday. Cross-repo launch-readiness notes are now consolidated into `../sh_hub/docs/MASTER_STATE.md`; keep the summary below as historical reference only.
- High-level features landed tonight:
	- Walls/Devine listening room now uses one stable audio element across dock and modal, keeping playback continuity intact.
	- Native WAV controls were restored in the listening room, and shareable song URLs plus listening-room analytics were wired into Firestore.
	- Walls/Devine collector grid was simplified to image-led tiles with track badges and takeover modals for each chapter.
	- Collector signup moved out of the hero into a shared under-grid Signal Room modal and is now reusable inside collector chapter modals.
	- Collector chapter modals now use a branded Collector's Cabinet overlay and cover the top nav.
	- Floating player dock now stays above the collector cabinet so playback can always be stopped.
	- Admin auth/loading behavior was stabilized and the dashboard now exposes leads, listening-room visits, drafts, journals, campaign calendar, backend WAV analysis, and health checks.
- Main gaps still open going into Saturday:
	- Scroll locking can break when nested collector/listening room overlays close in the wrong order because body overflow is managed independently in multiple components.
	- Latest Walls/Devine overlay and stacking changes are build-validated but still need browser QA on desktop and mobile.
	- Admin still needs deeper Firestore CRUD coverage if Sunday launch requires full collection management from the hidden console.
	- Production readiness still needs a launch pass over Firebase config, analytics writes, and final collector-flow smoke tests.
- Latest validation: `npm run build` passed on Friday night after the most recent player/modal stacking updates.

