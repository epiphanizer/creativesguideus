export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyANXVhqCnUXPlMrKPOVsFsbYYjbYqp-drA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "creatives-guide-us.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "creatives-guide-us",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "creatives-guide-us.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "915803625394",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:915803625394:web:261af2d7d2080251dbb6ab"
} as const;

export const firebaseAnalyticsMeasurementId =
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const firebaseProjectInfo = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
} as const;

export const firebaseAdminPaths = {
  adminUsersCollection: "adminUsers",
  adminProjectsCollection: "adminProjects",
  publicContentCollection: "publicContent",
  privateContentCollection: "privateContent",
  privateContentAccessLogsCollection: "privateContentAccessLogs",
  ecosystemLeadsCollection: "ecosystemLeads",
  releaseTasksCollection: "releaseTasks",
  bookingRoutingTasksCollection: "bookingRoutingTasks",
  collectorsCollection: "collectors",
  rewardClaimsCollection: "rewardClaims",
  listeningRoomVisitsCollection: "listeningRoomVisits",
  wallsDevineProjectId: "walls-devine",
  collectorHeroNoteDocId: "collectorHeroNote",
  linkHubDocId: "linkHub",
  releasePlanField: "releasePlan",
  bookingBoardField: "bookingBoard",
  markdownCollection: "markdownFiles",
  markdownInitializedField: "markdownContentInitialized",
  storageBasePath: "admin-projects/walls-devine",
  bootstrapRoute: "/api/admin/bootstrap"
} as const;

export const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => Boolean(value));
export const hasFirebaseAnalyticsConfig = hasFirebaseConfig && Boolean(firebaseAnalyticsMeasurementId);

export const firebaseRoadmapNotes = [
  "Admin auth now expects a Firebase Auth email/password account instead of the local cookie bypass.",
  "Authorize editors by creating Firestore documents in adminUsers/{uid}; the UI checks that document before loading any content.",
  "Structured release planning and markdown content now belong in Firestore under the Walls Devine project doc.",
  "Firebase Storage is optional now and only used as a legacy migration source if older markdown files already exist there."
] as const;

export const firebaseAdminRecommendations = [
  `Use Firestore ${firebaseAdminPaths.adminUsersCollection}/{uid} documents as the editor allowlist.`,
  `Link a GA4 web stream to the ${firebaseConfig.projectId} Firebase project and set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID so client analytics can report route and CTA activity.`,
  `Keep the release plan in ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}.`,
  `Keep the booking board in ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId} under the ${firebaseAdminPaths.bookingBoardField} field.`,
  `Keep public Walls/Devine note copy in ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.publicContentCollection}/${firebaseAdminPaths.collectorHeroNoteDocId}.`,
  `Keep the public link hub in ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.publicContentCollection}/${firebaseAdminPaths.linkHubDocId}.`,
  `Keep private screenplay material in ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.privateContentCollection}/{docId} and fetch it only from server routes after access checks pass.`,
  `Capture public collector leads in ${firebaseAdminPaths.ecosystemLeadsCollection} and review them from the admin console.`,
  `Use ${firebaseAdminPaths.releaseTasksCollection}/{taskId} for Google Calendar-ready release events when the sync layer is enabled.`,
  `Use ${firebaseAdminPaths.bookingRoutingTasksCollection}/{targetId} for Google Calendar-synced booking holds and confirmed routing dates.`,
  `Track reusable collector identities in ${firebaseAdminPaths.collectorsCollection} for ecosystem reward fulfillment.`,
  `Queue reward routing in ${firebaseAdminPaths.rewardClaimsCollection} so Cloud Functions can process any reward type.`,
  `Track shared listening-room visits in ${firebaseAdminPaths.listeningRoomVisitsCollection} for song-level arrival analytics.`,
  `Store markdown docs in Firestore ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/{collection}--{slug}.`,
  `Use ${firebaseAdminPaths.storageBasePath}/{collection}/{slug}.md only as a migration source when older Storage content already exists.`,
  "Treat the local JSON and markdown files as migration seed data, not the live admin backend."
] as const;