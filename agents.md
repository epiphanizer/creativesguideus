# Agents Playbook

- Always run `npm run build` before declaring a task complete.
- Capture build outcomes in handoff notes when reporting status.
- Keep UI adjustments accessible, checking contrast when adding effects.
- Use [app/admin/agents.md](app/admin/agents.md) before editing the hidden admin route, Firebase auth flow, or Firestore and Storage content contract.
- The public `/links` page now reads from Firestore `adminProjects/walls-devine/publicContent/linkHub` through the hidden admin. Keep that route, the admin editor, and `firestore.rules` in sync.
- If a CGU change touches canonical billing, prepared invoices, timekeeping, or token usage semantics, review sibling repo `../sh_hub` first; those concerns now live there, not in public-route code.
- Use [app/walls-devine/agents.md](app/walls-devine/agents.md) and [app/bong-tour/agents.md](app/bong-tour/agents.md) for route-specific experience rules before editing those landing pages.
- Use [app/work/agents.md](app/work/agents.md) before editing the work module or its export contract to `seanhalls_online`.
- Use each route's paired `style-guide.md` to preserve palette, typography, and cross-link behavior for modular marketing pages.

