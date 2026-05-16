export type ReleasePlanDate = {
  label: string;
  value: string;
};

export type ReleasePlanMetadata = {
  label: string;
  value: string;
};

export type ReleasePlanCalendarItem = {
  date: string;
  action: string;
  purpose: string;
};

export type ReleasePlanChecklistItem = {
  id: string;
  phase: string;
  title: string;
  dueDate: string;
  completed: boolean;
  notes: string;
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
  instagramDrafts: AdminMarkdownFile[];
  journalEntries: AdminMarkdownFile[];
  storageBacked?: boolean;
  contentBackend?: "firestore" | "bootstrap";
};