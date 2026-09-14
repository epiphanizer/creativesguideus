# August 2026 Repository Cleanup

Archived on August 28, 2026 after comparing the repository with the active route graph and the 2026 launch roadmap.

## Contents

- `components/`: Unreachable brochure-home components replaced by the current gateway homepage, plus private helpers used only by that component set.
- `styles/`: Stylesheet modules used only by the archived brochure experience and an unimported standalone CSS bundle.
- `public/`: Unreferenced legacy portraits, logos, Appreesh art, and default Next.js starter assets.
- `generated/`: Previously tracked compiler and Playwright run state. Regenerated copies are now ignored.

## Retained Active Surfaces

The live gateway homepage, Walls/Devine release world and September 2026 roadmap, Bong Tour and Appreesh preview routes, Cache, contact intake, link hub, work redirects, Firebase functions and rules, hidden admin, and Playwright launch-readiness test remain active.

Archived TypeScript is excluded from the production project in `tsconfig.json`. Restore a file to its original path before reusing it.