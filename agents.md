# Creatives Guide Us (CGU) Agents Playbook

- **Property Classification**: `cgu_master` is an internal sovereign property of the Sean & Ishika Halls enterprise, accessible via `properties/cgu`.
- **Validation Rule**: Always run `npm run build` before declaring a task complete. Capture build outcomes in handoff notes when reporting status.
- **Accessibility & Contrast**: Keep UI adjustments accessible, checking contrast when adding visual effects, dark mode overlays, or canvas shaders.
- **Audio & DSP Integration**: CGU's sound catalog and listening rooms integrate directly with `properties/johnwalls` (`johnwalls_studio` for VST3/AU DSP engines, `johnwalls_rocks` for direct sync vaults).
- **Admin Contract**: Use [app/admin/agents.md](app/admin/agents.md) before editing the hidden admin route, Firebase auth flow, or Firestore and Storage content contract.
- **Link Hub Route**: The public `/links` page reads from Firestore `adminProjects/walls-devine/publicContent/linkHub` through the hidden admin. Keep that route, the admin editor, and `firestore.rules` in sync.
- **`sh_hub` Centralization**: If a CGU change touches canonical billing, prepared invoices, timekeeping, or token usage semantics, review sibling repo `../sh_hub` (PostgreSQL 17) first; those concerns now live there, not in public-route code.
- **Route Experience Guides**:
  - Use [app/walls-devine/agents.md](app/walls-devine/agents.md) and [app/bong-tour/agents.md](app/bong-tour/agents.md) for route-specific experience rules before editing those landing pages.
  - Use [app/work/agents.md](app/work/agents.md) before editing the work module or its export contract to `properties/seanhalls_online`.
  - Use each route's paired `style-guide.md` to preserve palette, typography, and cross-link behavior for modular marketing pages.
- **Swarm Operations**: Sync licensing proposals and editorial generation can be dispatched autonomously via the `sh_hub` Adversarial Swarm at Tier 0 ($0.00).
