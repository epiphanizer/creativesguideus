# Firebase Admin Setup

This route no longer uses the old local cookie bypass. The hidden admin now depends on Firebase Auth and Firestore. Firebase Storage remains an optional legacy migration source for older markdown.

## What lives where

- Auth: Firebase Auth email/password signs the editor into the browser session.
- Authorization: Firestore `adminUsers/{uid}` decides whether a signed-in user is an active editor.
- Structured content: Firestore `adminProjects/walls-devine` stores the release plan object and the booking board field.
- Public note copy: Firestore `adminProjects/walls-devine/publicContent/collectorHeroNote` stores the editable collector note shown on the public Volume 1 hero.
- Public jump-link hub: Firestore `adminProjects/walls-devine/publicContent/linkHub` stores the editable Linktree-style links page at `/links`.
- Web analytics: Google/Firebase Analytics can capture route changes plus key CTA events when the Firebase project is linked to a GA4 web stream and `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is set in the site environment.
- Lead capture: Firestore `ecosystemLeads/{leadId}` stores public collector-list signups plus richer guided-intake booking leads from the site experience.
- Reward pipeline: Firestore `collectors/{collectorKey}` stores reusable collector identities and counts, while `rewardClaims/{claimId}` queues any ecosystem reward claim for fulfillment workflows. Airdrop-enabled rewards now store wallet-aware fields on the same claim doc and use deterministic claim IDs to enforce one clearance per wallet.
- Longform content: Firestore stores markdown docs at `adminProjects/walls-devine/markdownFiles/{collection}--{slug}`.
- Legacy migration: Firebase Storage at `admin-projects/walls-devine/{collection}/{slug}.md` is only read when older markdown needs to be migrated into Firestore.
- Bootstrap source: The local JSON and markdown files remain in the repo only so `/api/admin/bootstrap` can seed Firebase the first time the remote layer is empty.

## One-time enablement

1. In the Firebase console for `creatives-guide-us`, enable Email/Password under Authentication.
2. In Project settings for the same Firebase app, link or create the GA4 property/web stream and copy its Measurement ID.
3. Set `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` in the deployment environment for this site.
4. Create the editor account in Authentication.
5. Copy that user's UID from Firebase Auth.
6. In Firestore, create `adminUsers/{uid}` with an active editor payload.
7. Deploy the local Firestore and Storage rules from this repo.
8. Sign into `/admin` with that account. If `adminProjects/walls-devine` or the Firestore markdown docs do not exist yet, the admin will bootstrap them from the repo automatically. If older Storage markdown files exist, the admin migrates them into Firestore on first load.

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
- `adminProjects/walls-devine/publicContent/collectorHeroNote`
- `adminProjects/walls-devine/publicContent/linkHub`
- `ecosystemLeads/{leadId}`
- `collectors/{collectorKey}`
- `rewardClaims/{claimId}`

### Analytics environment

- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`

If you already standardize on a Google tag variable name, the client also accepts `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a fallback.

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

If this is the first time you are wiring the universal reward workflow, initialize Functions first:

```bash
firebase init functions
npm --prefix functions install
```

If you only changed rules and not indexes, this smaller command is enough:

```bash
firebase deploy --only firestore:rules,storage
```

To ship the reward trigger with the rest of the Firebase contract:

```bash
firebase deploy --only functions,firestore:rules,firestore:indexes,storage
```

## Bootstrap behavior

- The first authorized login checks Firestore for the Walls Devine admin data, including the booking board.
- If the Firestore markdown collection is empty, the client checks legacy Storage and migrates any older markdown into Firestore.
- If the release plan or Firestore markdown docs are still missing after that, `/api/admin/bootstrap` returns the repo copies.
- The client seeds Firestore, then reloads from Firebase.
- After that point, Firebase is the source of truth and the repo files are only backup seed material.

## Verification checklist

1. Visit `/admin` and sign in with the Firebase editor account.
2. Confirm the status panel shows the signed-in email and the `adminUsers` gate.
3. Toggle a release checklist item and verify `adminProjects/walls-devine` updates.
4. Edit the collector note in `/admin`, refresh `/walls-devine`, and confirm the public hero note updates from Firestore.
5. Edit the link hub in `/admin`, refresh `/links`, and confirm the public link page updates from Firestore.
6. Submit one collector signup or guided booking intake from the public site and verify a document appears in `ecosystemLeads` with the richer booking fields when applicable.
7. Confirm the booking engine in `/admin` shows the seeded August-November windows and target list.
8. Save one Instagram draft and one journal entry, then verify Firestore documents appear under `adminProjects/walls-devine/markdownFiles/...`.
9. Refresh `/admin` and confirm the remote content loads without re-bootstrap.
10. Beat the Joint Queen reward flow, submit an email or Collector ID, and confirm the collector doc and reward claim doc appear in Firestore.
11. Beat the Volume 1 secret-game flow, open the wallet airlock, submit a Solana wallet, and confirm the wallet-aware reward claim doc appears in Firestore with `distribution_mode: "airdrop"`.
12. Retry that same Volume 1 airlock with the same wallet and confirm the claim is rejected because the wallet already cleared that unlock.
13. Deploy Functions and confirm the trigger writes a `rewardDispatchLogs/{claimId}` document and flips `rewardClaims/{claimId}.status` to `distributed`.
14. Open the site with the GA DebugView or Realtime panel running and confirm `home_gateway_click`, `link_hub_link_click`, `walls_devine_cta_click`, `reward_airlock_open`, and reward claim events appear after interaction.