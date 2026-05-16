# Firebase Admin Setup

This route no longer uses the old local cookie bypass. The hidden admin now depends on Firebase Auth and Firestore. Firebase Storage remains an optional legacy migration source for older markdown.

## What lives where

- Auth: Firebase Auth email/password signs the editor into the browser session.
- Authorization: Firestore `adminUsers/{uid}` decides whether a signed-in user is an active editor.
- Structured content: Firestore `adminProjects/walls-devine` stores the release plan object.
- Lead capture: Firestore `ecosystemLeads/{leadId}` stores public collector-list signups from the site experience.
- Longform content: Firestore stores markdown docs at `adminProjects/walls-devine/markdownFiles/{collection}--{slug}`.
- Legacy migration: Firebase Storage at `admin-projects/walls-devine/{collection}/{slug}.md` is only read when older markdown needs to be migrated into Firestore.
- Bootstrap source: The local JSON and markdown files remain in the repo only so `/api/admin/bootstrap` can seed Firebase the first time the remote layer is empty.

## One-time enablement

1. In the Firebase console for `creatives-guide-us`, enable Email/Password under Authentication.
2. Create the editor account in Authentication.
3. Copy that user's UID from Firebase Auth.
4. In Firestore, create `adminUsers/{uid}` with an active editor payload.
5. Deploy the local Firestore and Storage rules from this repo.
6. Sign into `/admin` with that account. If `adminProjects/walls-devine` or the Firestore markdown docs do not exist yet, the admin will bootstrap them from the repo automatically. If older Storage markdown files exist, the admin migrates them into Firestore on first load.

## Recommended `adminUsers/{uid}` document

```json
{
  "active": true,
  "email": "editor@example.com",
  "displayName": "CGU Admin",
  "roles": ["editor"],
  "updatedAt": "2026-05-15T00:00:00.000Z"
}
```

## Expected remote data layout

### Firestore

- `adminUsers/{uid}`
- `adminProjects/walls-devine`
- `ecosystemLeads/{leadId}`

### Firestore markdown docs

- `adminProjects/walls-devine/markdownFiles/instagram-posts--{slug}`
- `adminProjects/walls-devine/markdownFiles/journals--{slug}`

### Legacy Storage migration source

- `admin-projects/walls-devine/instagram-posts/{slug}.md`
- `admin-projects/walls-devine/journals/{slug}.md`

## Deploy commands

Run these from the repo root after confirming the Firebase CLI is pointed at `creatives-guide-us`.

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

If you only changed rules and not indexes, this smaller command is enough:

```bash
firebase deploy --only firestore:rules,storage
```

## Bootstrap behavior

- The first authorized login checks Firestore for the Walls Devine admin data.
- If the Firestore markdown collection is empty, the client checks legacy Storage and migrates any older markdown into Firestore.
- If the release plan or Firestore markdown docs are still missing after that, `/api/admin/bootstrap` returns the repo copies.
- The client seeds Firestore, then reloads from Firebase.
- After that point, Firebase is the source of truth and the repo files are only backup seed material.

## Verification checklist

1. Visit `/admin` and sign in with the Firebase editor account.
2. Confirm the status panel shows the signed-in email and the `adminUsers` gate.
3. Toggle a release checklist item and verify `adminProjects/walls-devine` updates.
4. Submit one collector signup from the public site and verify a document appears in `ecosystemLeads`.
5. Save one Instagram draft and one journal entry, then verify Firestore documents appear under `adminProjects/walls-devine/markdownFiles/...`.
6. Refresh `/admin` and confirm the remote content loads without re-bootstrap.