# Bong Tour Agent Notes

- Scope: This route owns the Bong Tour feature screenplay portal, including [app/bong-tour/page.tsx](app/bong-tour/page.tsx), [app/bong-tour/treatment/page.tsx](app/bong-tour/treatment/page.tsx), [components/bong-tour/BongTourLanding.tsx](components/bong-tour/BongTourLanding.tsx), [components/bong-tour/BongTourTreatmentReader.tsx](components/bong-tour/BongTourTreatmentReader.tsx), [styles/sections/_bong-feature.scss](styles/sections/_bong-feature.scss), backend APIs under [app/api/bong-tour/](app/api/bong-tour/), and screenplay documents in [lib/bong-tour/](lib/bong-tour/).
- Page role: Bong Tour is an authentic feature film packaging portal modeled on the simplicity, restraint, and beauty of Walls/Devine. It features the official concept poster, logline, writer's desk note, 3-act masala narrative arc, core character ensemble, real soundtrack cues from Walls/Devine Volume 1, and an in-browser giveaway linked into Appreesh.
- Backend APIs:
  - `/api/bong-tour/giveaway`: In-browser giveaway and tribute engine linked to Appreesh (`appreesh-solana` / `https://appreesh.org`), issuing cryptographically verified claim serials.
  - `/api/bong-tour/treatment/download`: Streams official PDF reading copies of `BONG TOUR Treatment.pdf` and `BONG TOUR Screenplay.pdf`.
  - `/api/bong-tour/cues`: Curated film cue metadata and audio streams from the CGU sound lab.
- Visual rule: Pull from the poster and story world: warm parchment, saffron glow, smoke green, dark obsidian shadow, and refined editorial typography.
- Ecosystem cross-links: Direct bridges into Walls/Devine Volume 1 (`/walls-devine`) and Appreesh (`https://appreesh.org`).