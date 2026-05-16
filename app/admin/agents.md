# Admin Agent Notes

- Scope: This route owns the hidden admin at [app/admin/page.tsx](app/admin/page.tsx), the Firebase-authenticated dashboard in [components/admin/AdminConsole.tsx](components/admin/AdminConsole.tsx), the bootstrap route in [app/api/admin/bootstrap/route.ts](app/api/admin/bootstrap/route.ts), and the Firebase content adapters in [lib/firebase/admin-content.ts](lib/firebase/admin-content.ts).
- Auth rule: The admin gate now uses Firebase Auth email/password accounts. UI access also requires an active Firestore document at `adminUsers/{uid}`.
- Data rule: Structured release-plan data lives in Firestore at `adminProjects/walls-devine`. Longform markdown lives in Storage under `admin-projects/walls-devine/{collection}/{slug}.md`.
- Bootstrap rule: Local JSON and markdown files remain only as seed data for the bootstrap route. They are not the live backend anymore.
- Rules rule: Keep [firestore.rules](firestore.rules), [storage.rules](storage.rules), and [firebase.json](firebase.json) in sync with the actual admin collection contract before deploying.
- Setup doc: Use [app/admin/firebase-setup.md](app/admin/firebase-setup.md) for the exact enablement flow, document shape, and deployment commands.
- Avoid: reintroducing local cookie auth, duplicating release-plan state outside Firestore, or creating new admin collections without documenting them here first.