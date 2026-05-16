# Launch Weekend Handoff

Date: Friday night, 2026-05-15
Launch target: Sunday
Repo: `cgu_master`
Latest build status: `npm run build` passed after the latest Walls/Devine player/modal stack changes.

## What Shipped Tonight

### Walls/Devine public experience

- The listening room now uses one stable native audio element shared between the floating dock and the full listening-room modal.
- Native WAV controls are restored in the full listening room.
- Song-specific deep links and listening-room visit analytics are wired so shared track URLs can be tied back to Firestore.
- The collector grid is now image-forward with track badges and less text clutter on the tiles themselves.
- Each collector tile opens its own takeover room with a challenge, hidden note, and collector capture path.
- Collector signup was removed from the hero and moved below the grid into a cleaner reusable Signal Room modal.
- Collector chapter modals now reuse the same collector capture component instead of maintaining an inline duplicate form.
- Collector chapter modals now open with the branded Collector's Cabinet overlay.
- Collector chapter modals now cover the top navigation.
- The floating player dock now stays above the collector cabinet so users can still stop playback while browsing collector rooms.

### Admin and data layer

- Authorized admin sessions no longer get trapped behind the signed-in loading gate.
- The hidden admin route now exposes more of the actual backend surface, including:
  - collector leads
  - listening-room visits
  - campaign calendar
  - release checklist
  - backend WAV analysis
  - Instagram draft CRUD
  - journal CRUD
  - health checks
  - data collection summary
- Logout is available even during the signed-in loading state.
- Firestore reads for listening-room visits were added so share-link traffic is visible in admin.

### Validation done tonight

- Repeated `npm run build` runs passed after the major Walls/Devine and admin slices.
- The latest successful build was after the player/modal stacking adjustments.
- `get_errors` checks were clean on the most recently touched Walls/Devine files before the last build.

## Main Gaps And Risks

### Must address Saturday if possible

- Nested body scroll locking is still fragile.
  - Current issue: leaving the Collector's Cabinet / Signal Room / Listening Room in certain orders can leave page scroll in the wrong state.
  - Root cause: `document.body.style.overflow` is being managed independently in multiple components instead of through one shared lock manager or hook.
- Latest overlay timing and stack behavior have not been browser-verified in this chat.
  - This especially applies to:
    - collector cabinet overlay
    - signal room modal
    - floating player dock over collector cabinet
    - mobile viewport behavior
- Final collector funnel still needs a real-device sanity pass.
  - Verify email capture is easy.
  - Verify close/open sequences do not break scrolling.
  - Verify focus order and close behavior feel intentional.

### Important but maybe not launch-blocking

- Admin still does not expose full deep CRUD for every Firestore collection the way a true content control room eventually should.
- `adminUsers` management and richer `adminProjects/walls-devine` editing still need product/design decisions if they are expected in v1.
- Latest UI polish changes are build-validated, not visually QA'd with browser inspection from this session.

## Saturday Plan

### Priority 1: Remove launch-blocking UX bugs

1. Replace the ad hoc body overflow logic with one shared scroll-lock helper or hook used by:
   - `WallsDevineCollectorGrid`
   - `WallsDevineCollectorAccess`
   - `WallsDevinePlayer`
2. Verify that nested modal close order no longer breaks page scrolling.
3. Verify the floating player dock remains visible and clickable above the collector cabinet without covering critical modal copy.

### Priority 2: Browser QA across the real launch flow

1. Run full Walls/Devine smoke tests on desktop.
2. Run the same flow on mobile width.
3. Check these exact flows:
   - open collector grid tile
   - complete or partially interact with a chapter challenge
   - open Signal Room from inside the chapter modal
   - close Signal Room and confirm Collector's Cabinet still behaves correctly
   - close Collector's Cabinet and confirm the page can scroll again
   - open Listening Room from dock and confirm audio continuity
   - collapse Listening Room and confirm dock still works
4. Validate keyboard close behavior and focus handling for the main modals.

### Priority 3: Confirm data + admin readiness

1. Confirm collector leads are writing correctly in the environment that will be used for launch.
2. Confirm listening-room visit analytics are writing and readable in admin.
3. Confirm the intended admin account can log in on the target environment.
4. Confirm the dashboard surfaces everything needed for launch-night monitoring.

### Priority 4: Content + launch readiness pass

1. Freeze any remaining Walls/Devine launch copy.
2. Check hero, collector CTA, and chapter CTA language for final consistency.
3. Confirm the public experience does not still reference removed concepts or old CTA patterns.
4. Decide which remaining admin improvements are true launch blockers versus post-launch follow-up.

## Sunday Launch Checklist

### Before deploy

1. Run `npm run build` one more time in `cgu_master`.
2. Smoke test the main public routes:
   - `/`
   - `/walls-devine`
   - `/bong-tour`
   - `/work`
   - `/admin`
3. Confirm Firebase environment variables and project wiring are correct.
4. Confirm Firestore and Storage rules are in the expected state for launch.

### Launch-hour checks

1. Confirm collector signup submissions are arriving.
2. Confirm listening-room visit analytics are arriving.
3. Confirm shareable song URLs open the correct track/state.
4. Confirm the player can always be stopped from the floating dock.
5. Keep admin open to monitor leads, traffic, and any editor-side issues.

### If time remains after Saturday bug fixing

1. Tighten admin CRUD depth.
2. Improve focus management across nested modals.
3. Add a cleaner shared modal/scroll-lock utility so the next round of Walls/Devine changes does not reintroduce overlay bugs.

## Suggested Definition Of Done For Saturday Night

- No known broken scroll state after opening/closing collector and listening room overlays.
- Floating player dock remains usable above the collector cabinet.
- Collector signup works from both the under-grid CTA and chapter modals.
- Listening-room analytics and collector leads both write successfully.
- Admin can monitor the launch-critical data surfaces.
- Build passes cleanly before stopping.