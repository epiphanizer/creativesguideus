export type ReleasePlanDate = {
  label: string;
  value: string;
};

export type ReleasePlanMetadata = {
  label: string;
  value: string;
};

export type ReleasePlanCalendarItem = {
  id?: string;
  phase?: string;
  date: string;
  action: string;
  purpose: string;
  start?: string;
  end?: string;
};

export type ReleaseTaskSyncSource = "admin-ui" | "calendar-sync" | "gcal-webhook" | "seed";

export type BookingRoutingStatus = "hold" | "confirmed";

export type ReleaseTaskDocument = {
  id: string;
  phase: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  completed: boolean;
  notes: string;
  gCalEventId: string | null;
  syncSource?: ReleaseTaskSyncSource;
  updatedAt?: string;
};

export type ReleasePlanChecklistItem = {
  id: string;
  phase: string;
  title: string;
  dueDate: string;
  completed: boolean;
  notes: string;
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
  gCalEventId?: string | null;
  syncSource?: ReleaseTaskSyncSource;
  updatedAt?: string;
};

export type ReleasePlan = {
  title: string;
  summary: string;
  updatedAt: string;
  lockedDates: ReleasePlanDate[];
  guidance: string[];
  metadataStandards: ReleasePlanMetadata[];
  recommendedSetup: string[];
  avoid: string[];
  calendar: ReleasePlanCalendarItem[];
  checklist: ReleasePlanChecklistItem[];
};

export type WallsDevineCollectorHeroNote = {
  salutation: string;
  body: string;
  updatedAt: string;
};

export type LinkHubLink = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  isFeatured: boolean;
  isActive: boolean;
};

export type LinkHubContent = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  links: LinkHubLink[];
};

export type BookingTargetCategory = "venue" | "radio" | "podcast" | "festival" | "press";

export type BookingTargetStatus = "seeded" | "researching" | "outreach-ready" | "contacted" | "in-conversation" | "hold" | "confirmed";

export type BookingTargetPriority = "critical" | "high" | "medium";

export type BookingContactMethod = "email" | "form" | "web" | "instagram" | "phone";

export type BookingContactResearchStatus = "verified" | "partial" | "pending";

export type BookingBoardGoal = {
  title: string;
  summary: string;
  lockByDate: string;
  bookThroughMonths: string[];
  priorityMarkets: string[];
  successMetric: string;
  nextMoves: string[];
};

export type BookingAvailabilityWindow = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  market: string;
  city: string;
  state: string;
  purpose: string;
  bookingTypes: string[];
  notes: string;
};

export type BookingTargetContact = {
  label: string;
  role: string;
  method: BookingContactMethod;
  value: string;
  sourceUrl: string;
  note: string;
  verifiedAt: string;
};

export type BookingTarget = {
  id: string;
  name: string;
  category: BookingTargetCategory;
  city: string;
  state: string;
  status: BookingTargetStatus;
  priority: BookingTargetPriority;
  targetWindowId: string;
  desiredOutcome: string;
  fitNote: string;
  notes: string;
  sourceUrl: string;
  contactStatus: BookingContactResearchStatus;
  contacts: BookingTargetContact[];
  tags: string[];
  routingStart?: string;
  routingEnd?: string;
  routingGCalEventId?: string | null;
  routingSyncSource?: ReleaseTaskSyncSource;
};

export type BookingRoutingTaskDocument = {
  id: string;
  targetId: string;
  targetName: string;
  market: string;
  city: string;
  state: string;
  status: BookingRoutingStatus;
  summary: string;
  description: string;
  start: string;
  end: string;
  notes: string;
  gCalEventId: string | null;
  syncSource?: ReleaseTaskSyncSource;
  updatedAt?: string;
};

export type BookingProspect = {
  id: string;
  label: string;
  market: string;
  targetWindowId: string;
  types: string[];
  rationale: string;
  searchHints: string[];
  notes: string;
  sourceUrl: string;
};

export type BookingBoard = {
  updatedAt: string;
  goal: BookingBoardGoal;
  availability: BookingAvailabilityWindow[];
  targets: BookingTarget[];
  prospects: BookingProspect[];
};

export type AdminMarkdownFile = {
  slug: string;
  title: string;
  filePath: string;
  content: string;
  preview: string;
  updatedAt?: string;
};

export type AdminMarkdownCollection = "instagram-posts" | "journals";

export type AdminAudioAnalysis = {
  fileName: string;
  relativePath: string;
  fileSizeBytes: number;
  fileSizeLabel: string;
  durationSeconds: number | null;
  durationLabel: string;
  sampleRate: number | null;
  channels: number | null;
  bitDepth: number | null;
  bitrateKbps: number | null;
  codec: string | null;
  container: string | null;
  lossless: boolean | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  albumArtist: string | null;
  trackNumber: number | null;
  year: number | null;
  error?: string;
};

export type EcosystemLeadStatus = "new";

export type EcosystemLead = {
  id: string;
  email: string;
  fullName: string;
  source: string;
  interest: string;
  company: string;
  projectTitle: string;
  brief: string;
  contextId: string;
  inquiryType: string;
  inquiryTypeLabel: string;
  goal: string;
  goalLabel: string;
  surface: string;
  surfaceLabel: string;
  engagement: string;
  engagementLabel: string;
  timeline: string;
  timelineLabel: string;
  budgetRange: string;
  budgetRangeLabel: string;
  createdAt: string;
  updatedAt: string;
  status: EcosystemLeadStatus;
  consent: boolean;
};

export type EcosystemLeadInput = {
  email: string;
  fullName?: string;
  source: string;
  interest: string;
};

export type ListeningRoomVisit = {
  id: string;
  eventType: "listening-room-link-visit";
  songSlug: string;
  songTitle: string;
  queryKey: string;
  pagePath: string;
  referrer: string;
  userAgent: string;
  createdAt: string;
};

export type ListeningRoomVisitInput = {
  songSlug: string;
  songTitle: string;
  queryKey: string;
  pagePath: string;
  referrer?: string;
  userAgent?: string;
};

export type WallsDevineAdminData = {
  plan: ReleasePlan;
  bookingBoard: BookingBoard;
  instagramDrafts: AdminMarkdownFile[];
  journalEntries: AdminMarkdownFile[];
  collectorHeroNote: WallsDevineCollectorHeroNote;
  linkHub: LinkHubContent;
  storageBacked?: boolean;
  contentBackend?: "firestore" | "bootstrap";
  markdownInitialized?: boolean;
  bookingBoardInitialized?: boolean;
};