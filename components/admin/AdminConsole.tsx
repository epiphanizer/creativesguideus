"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState, useTransition } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import { buildBookingLeadMatches, defaultBookingBoard } from "@/lib/admin/booking-engine";
import type {
  AdminAudioAnalysis,
  AdminMarkdownCollection,
  BookingTargetStatus,
  EcosystemLead,
  LinkHubContent,
  ListeningRoomVisit,
  ReleasePlanChecklistItem,
  WallsDevineAdminData,
  WallsDevineUpcomingShow
} from "@/lib/admin/types";
import {
  deleteFirebaseAdminMarkdownFile,
  getAdminUserProfile,
  getFirebaseWallsDevineAdminData,
  isActiveAdminProfile,
  removeAdminMarkdownFile,
  renameFirebaseAdminMarkdownFile,
  replaceAdminMarkdownFile,
  seedFirebaseWallsDevineAdminData,
  updateFirebaseBookingBannerNote,
  updateFirebaseBookingBoard,
  updateFirebaseAdminMarkdownFile,
  updateFirebaseCollectorHeroNote,
  updateFirebaseLinkHub,
  updateFirebaseUpcomingShowsNote,
  updateFirebaseReleasePlanItem,
  type AdminUserProfile
} from "@/lib/firebase/admin-content";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { getEcosystemLeads } from "@/lib/firebase/ecosystem-leads";
import { getListeningRoomVisits } from "@/lib/firebase/listening-room-visits";
import { defaultLinkHubContent } from "@/lib/link-hub/content";
import {
  defaultWallsDevineBookingBannerNote,
  defaultWallsDevineCollectorHeroNote,
  defaultWallsDevineUpcomingShowsNote
} from "@/lib/walls-devine/public-content";
import { cx } from "@/lib/cx";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

import { AdminBookingEngine } from "./AdminBookingEngine";
import { AdminLinkHubEditor } from "./AdminLinkHubEditor";
import { AdminFirebaseStatus } from "./AdminFirebaseStatus";

type SaveState = "saving" | "deleting" | "success" | "error";
type ContentSource = "pending" | "firebase" | "bootstrap";

const collectorHeroNoteSaveKey = "collectorHeroNote";
const bookingBannerNoteSaveKey = "bookingBannerNote";
const upcomingShowsSaveKey = "upcomingShows";
const linkHubSaveKey = "linkHub";
const bookingTargetSaveKeyPrefix = "bookingTarget";

const bookingTargetStatuses = new Set<BookingTargetStatus>([
  "seeded",
  "researching",
  "outreach-ready",
  "contacted",
  "in-conversation",
  "hold",
  "confirmed"
]);

function groupChecklistByPhase(items: ReleasePlanChecklistItem[]) {
  const grouped = new Map<string, ReleasePlanChecklistItem[]>();

  for (const item of items) {
    const phaseItems = grouped.get(item.phase) ?? [];
    phaseItems.push(item);
    grouped.set(item.phase, phaseItems);
  }

  return Array.from(grouped.entries());
}

function getSaveNoticeKey(collection: AdminMarkdownCollection, slug: string) {
  return `${collection}:${slug}`;
}

function getCreateNoticeKey(collection: AdminMarkdownCollection) {
  return `create:${collection}`;
}

function getBookingTargetSaveKey(targetId: string) {
  return `${bookingTargetSaveKeyPrefix}:${targetId}`;
}

function isBookingTargetStatus(value: string): value is BookingTargetStatus {
  return bookingTargetStatuses.has(value as BookingTargetStatus);
}

function getMarkdownFiles(data: WallsDevineAdminData, collection: AdminMarkdownCollection) {
  return collection === "instagram-posts" ? data.instagramDrafts : data.journalEntries;
}

function getCollectionLabel(collection: AdminMarkdownCollection) {
  return collection === "instagram-posts" ? "draft" : "journal";
}

function normalizeMarkdownSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildInitialMarkdownContent(title: string, content: string) {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return `# ${trimmedTitle}\n\n`;
  }

  if (/^#\s+.+/m.test(trimmedContent)) {
    return `${trimmedContent}\n`;
  }

  return `# ${trimmedTitle}\n\n${trimmedContent}\n`;
}

function formatUpcomingShowsForEditor(shows: WallsDevineUpcomingShow[]) {
  return shows
    .map((show) => [show.dateLabel, show.city, show.venue, show.status, show.href].map((segment) => segment.trim()).join(" | "))
    .join("\n");
}

function parseUpcomingShowsFromEditor(rawShows: string) {
  const lines = rawShows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const shows: WallsDevineUpcomingShow[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const segments = line.split("|").map((segment) => segment.trim());

    if (segments.length < 3) {
      return {
        shows: [],
        error: `Line ${index + 1} must include at least Date | City | Venue.`
      };
    }

    const [dateLabel = "", city = "", venue = "", status = "", href = ""] = segments;

    if (!dateLabel || !city || !venue) {
      return {
        shows: [],
        error: `Line ${index + 1} is missing required Date, City, or Venue values.`
      };
    }

    shows.push({
      id: `show-${index + 1}`,
      dateLabel,
      city,
      venue,
      status: status || "TBA",
      href
    });
  }

  return {
    shows,
    error: ""
  };
}

function getFirebaseErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code?: string }).code ?? "");

    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Firebase Auth rejected that email and password combination.";
      case "auth/invalid-email":
        return "That email address is not formatted correctly for Firebase Auth.";
      case "storage/unauthorized":
      case "permission-denied":
        return "Firebase denied access. Check the adminUsers collection, Firestore rules, and legacy Storage rules if you are migrating older markdown.";
      default:
        break;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while talking to Firebase.";
}

async function fetchBootstrapData(idToken: string) {
  const response = await fetch(firebaseAdminPaths.bootstrapRoute, {
    headers: {
      Authorization: `Bearer ${idToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("The bootstrap route could not load the local Walls/Devine seed data.");
  }

  return (await response.json()) as WallsDevineAdminData;
}

async function fetchAudioAnalysis(idToken: string) {
  const response = await fetch("/api/admin/audio-analysis", {
    headers: {
      Authorization: `Bearer ${idToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("The audio analysis route could not inspect the current WAV files.");
  }

  return (await response.json()) as AdminAudioAnalysis[];
}

function formatAudioSampleRate(sampleRate: number | null) {
  if (!sampleRate) {
    return "—";
  }

  return `${(sampleRate / 1000).toFixed(sampleRate % 1000 === 0 ? 0 : 1)} kHz`;
}

function formatAudioChannels(channels: number | null) {
  if (!channels) {
    return "—";
  }

  if (channels === 1) {
    return "Mono";
  }

  if (channels === 2) {
    return "Stereo";
  }

  return `${channels} ch`;
}

function formatAudioBitDepth(bitDepth: number | null) {
  return bitDepth ? `${bitDepth}-bit` : "—";
}

function formatAudioBitrate(bitrateKbps: number | null) {
  return bitrateKbps ? `${bitrateKbps} kbps` : "—";
}

function formatAudioTrackNumber(trackNumber: number | null) {
  return trackNumber ? String(trackNumber).padStart(2, "0") : "—";
}

function formatAudioFormat(analysis: AdminAudioAnalysis) {
  if (analysis.container && analysis.codec) {
    return `${analysis.container} / ${analysis.codec}`;
  }

  return analysis.container ?? analysis.codec ?? "—";
}

function formatAudioLossless(lossless: boolean | null) {
  if (lossless === null) {
    return "—";
  }

  return lossless ? "Yes" : "No";
}

function formatLeadSource(source: string) {
  if (source === "walls-devine-hero") {
    return "Walls/Devine hero";
  }

  if (source.startsWith("collector-grid:")) {
    return `Collector grid / ${source.replace("collector-grid:", "").replace(/-/g, " ")}`;
  }

  return source.replace(/[-_]/g, " ");
}

function formatListeningRoomQueryKey(queryKey: string) {
  switch (queryKey) {
    case "player":
      return "player query";
    case "song":
      return "song query";
    case "track":
      return "track query";
    case "slug":
      return "slug query";
    default:
      return queryKey || "unknown query";
  }
}

function getLeadProgramLabel(lead: EcosystemLead) {
  const haystack = [lead.source, lead.contextId, lead.projectTitle, lead.interest, lead.brief].join(" ").toLowerCase();

  if (haystack.includes("bong-tour") || haystack.includes("bong tour")) {
    return "Bong Tour";
  }

  if (
    haystack.includes("walls-devine") ||
    haystack.includes("walls devine") ||
    lead.source === "walls-devine-hero" ||
    lead.source.startsWith("collector-grid:")
  ) {
    return "Walls/Devine";
  }

  return "CGU / general";
}

function getLeadPrimaryContext(lead: EcosystemLead) {
  return lead.projectTitle || lead.inquiryTypeLabel || lead.inquiryType || lead.interest || "General intake";
}

function formatLeadProgramSummary(label: string, count: number) {
  return `${label} · ${count} lead${count === 1 ? "" : "s"}`;
}

function getBacklogElementId(tabId: AdminWorkspaceTabId) {
  return `admin-backlog-${tabId}`;
}

type AdminWorkspaceSectionId = "admin-release-desk" | "admin-booking-engine" | "admin-journals" | "admin-instagram-posts" | "admin-analytics" | "admin-assets" | "admin-health" | "admin-ideas";

type IdeaEntry = {
  id: string;
  name: string;
  type: "app" | "script" | "feature" | "ecosystem";
  status: "concept" | "exploring" | "prototyping" | "parked";
  description: string;
  notes?: string;
};

const ideaCatalogue: IdeaEntry[] = [
  {
    id: "living-will",
    name: "The Living Will",
    type: "ecosystem",
    status: "concept",
    description: "Users post their goals and ambitions publicly, then reward people in real time for helping them achieve those goals. Social accountability layer — think Nextdoor with depth, built around contribution and tangible mutual benefit rather than just proximity.",
    notes: "Key design tension: reward mechanism (token-based, cash-equivalent, or reputation points?), privacy model for personal goals, and how to prevent reward gaming. Strong hook for community retention."
  }
];
type AdminWorkspaceTabId = "walls-devine" | "agency";

type AdminWorkspaceTab = {
  id: AdminWorkspaceTabId;
  label: string;
  title: string;
  description: string;
};

type DashboardModule = {
  id: AdminWorkspaceSectionId;
  tab: AdminWorkspaceTabId;
  title: string;
  summary: string;
  detail: string;
  actionLabel: string;
  status: "ready" | "pending";
};

type AdminJumpLink = {
  id: AdminWorkspaceSectionId;
  tab: AdminWorkspaceTabId;
  label: string;
  detail: string;
};

const adminWorkspaceTabs: AdminWorkspaceTab[] = [
  {
    id: "walls-devine",
    label: "Walls/Devine",
    title: "Release-world operations",
    description: "Booking, release sequencing, editorial updates, and asset QA for the Walls/Devine world."
  },
  {
    id: "agency",
    label: "Agency-wide",
    title: "CGU signal desk",
    description: "Lead generation, Bong Tour and intake segmentation, listening traffic, and backend health across the broader studio."
  }
];

const workspaceSectionTabs: Record<AdminWorkspaceSectionId, AdminWorkspaceTabId> = {
  "admin-release-desk": "walls-devine",
  "admin-booking-engine": "walls-devine",
  "admin-journals": "walls-devine",
  "admin-instagram-posts": "walls-devine",
  "admin-analytics": "agency",
  "admin-assets": "walls-devine",
  "admin-health": "agency",
  "admin-ideas": "agency"
};

type AdminWorkspaceSectionProps = {
  id: AdminWorkspaceSectionId;
  labelId: string;
  title: string;
  description: string;
  detail?: string;
  actions?: ReactNode;
  isVisible?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const defaultOpenSections: Record<AdminWorkspaceSectionId, boolean> = {
  "admin-release-desk": true,
  "admin-booking-engine": true,
  "admin-journals": false,
  "admin-instagram-posts": false,
  "admin-analytics": true,
  "admin-assets": false,
  "admin-health": false,
  "admin-ideas": false
};

function isWorkspaceSectionId(value: string): value is AdminWorkspaceSectionId {
  return value in defaultOpenSections;
}

function AdminWorkspaceSection({
  id,
  labelId,
  title,
  description,
  detail,
  actions,
  isVisible = true,
  isOpen,
  onToggle,
  children
}: AdminWorkspaceSectionProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <SectionShell id={id} labelledBy={labelId} className="cg-admin__workspace-shell" innerClassName="cg-admin__section cg-admin__workspace-section">
      <div className="cg-admin__workspace-section-head">
        <div>
          <h2 id={labelId}>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="cg-admin__workspace-section-controls">
          {detail ? <p className="cg-admin__path-note">{detail}</p> : null}
          {actions ? <div className="cg-admin__section-actions">{actions}</div> : null}
          <Button type="button" variant="ghost" size="sm" onClick={onToggle} aria-expanded={isOpen} aria-controls={`${id}-body`}>
            {isOpen ? "Collapse section" : "Expand section"}
          </Button>
        </div>
      </div>

      {isOpen ? <div id={`${id}-body`} className="cg-admin__workspace-section-body">{children}</div> : <p className="cg-admin__helper">Collapsed. Reopen it from the whiteboard or the lane navigation.</p>}
    </SectionShell>
  );
}

type AdminWhiteboardCardProps = {
  label: string;
  title: string;
  copy?: string;
  className?: string;
  children?: ReactNode;
};

function AdminWhiteboardCard({ label, title, copy, className, children }: AdminWhiteboardCardProps) {
  return (
    <article className={cx("cg-admin__whiteboard-card", className)}>
      <span className="cg-admin__whiteboard-card-label">{label}</span>
      <h3>{title}</h3>
      {copy ? <p>{copy}</p> : null}
      {children}
    </article>
  );
}

const AUTH_SESSION_TIMEOUT_MS = 5000;

const fallbackAdminData: WallsDevineAdminData = {
  plan: {
    title: "Walls/Devine Control Room",
    summary: "Scaffold mode keeps the dashboard visible while Firebase content or bootstrap data reconnects.",
    updatedAt: "2026-05-15T00:00:00.000Z",
    lockedDates: [
      { label: "Dashboard mode", value: "Scaffold fallback" },
      { label: "Audience layer", value: "Collector leads module visible" },
      { label: "Content studio", value: "Draft + journal tools scaffolded" }
    ],
    guidance: [
      "Retry the data connection before assuming the backend is empty.",
      "Use the health panel and module cards below to confirm which systems are already wired.",
      "Treat scaffold mode as a visibility fallback, not the final source of truth."
    ],
    metadataStandards: [
      { label: "Audience layer", value: "Collector leads via Firestore" },
      { label: "Content layer", value: "Instagram drafts + song journals" },
      { label: "Analysis layer", value: "Backend WAV inspection" }
    ],
    recommendedSetup: [
      "Review release operations",
      "Check audience capture and collector leads",
      "Inspect content and audio modules"
    ],
    avoid: [
      "Do not block the full console on one missing data source.",
      "Do not hide already-wired modules just because Firebase seed content is late.",
      "Do not assume the Firestore markdown layer is live until the health check confirms it."
    ],
    calendar: [
      { date: "Now", action: "Reconnect Firebase content", purpose: "Hydrate the release plan and markdown layers" },
      { date: "Now", action: "Review admin modules", purpose: "Confirm release, audience, content, and audio surfaces are visible" },
      { date: "Next", action: "Retry data load", purpose: "Replace scaffold mode with live backend data" }
    ],
    checklist: [
      {
        id: "scaffold-release-ops",
        phase: "Dashboard scaffold",
        title: "Release operations module visible",
        dueDate: "Now",
        completed: true,
        notes: "Checklist, calendar, and launch operations remain visible even when live Firebase content is unavailable."
      },
      {
        id: "scaffold-audience-ops",
        phase: "Dashboard scaffold",
        title: "Collector lead review module visible",
        dueDate: "Now",
        completed: true,
        notes: "Audience capture and source-mix panels remain exposed after login."
      },
      {
        id: "scaffold-content-ops",
        phase: "Dashboard scaffold",
        title: "Content studio scaffold visible",
        dueDate: "Now",
        completed: true,
        notes: "Instagram draft and journal editors stay in view even while the Firebase markdown layer is still reconnecting."
      }
    ]
  },
  bookingBoard: defaultBookingBoard,
  instagramDrafts: [],
  journalEntries: [],
  collectorHeroNote: defaultWallsDevineCollectorHeroNote,
  bookingBannerNote: defaultWallsDevineBookingBannerNote,
  upcomingShowsNote: defaultWallsDevineUpcomingShowsNote,
  linkHub: defaultLinkHubContent,
  storageBacked: false,
  contentBackend: "bootstrap",
  markdownInitialized: false,
  bookingBoardInitialized: false
};

function countCompletedChecklist(items: ReleasePlanChecklistItem[]) {
  return items.filter((item) => item.completed).length;
}

function formatCountdownToDate(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil(diff / dayInMs);

  if (Number.isNaN(days)) {
    return "Needs review";
  }

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} out`;
  }

  if (days === 0) {
    return "Due today";
  }

  const elapsed = Math.abs(days);
  return `${elapsed} day${elapsed === 1 ? "" : "s"} late`;
}

function buildDashboardModules({
  completedChecklist,
  adminData,
  isScaffoldMode,
  hasLiveMarkdownContent,
  bookingTargetsCount,
  bookingLeadCount,
  bookingDeadline,
  bookingCriticalCount,
  leadsCount,
  hasLeadsError,
  leadSources,
  visitsCount,
  topVisitSong,
  audioCount,
  hasAudioError,
  hasVisitsError,
  contentSource,
  hasPanelError
}: {
  completedChecklist: number;
  adminData: WallsDevineAdminData;
  isScaffoldMode: boolean;
  hasLiveMarkdownContent: boolean;
  bookingTargetsCount: number;
  bookingLeadCount: number;
  bookingDeadline: string;
  bookingCriticalCount: number;
  leadsCount: number;
  hasLeadsError: boolean;
  leadSources: Array<[string, number]>;
  visitsCount: number;
  topVisitSong: string | null;
  audioCount: number;
  hasAudioError: boolean;
  hasVisitsError: boolean;
  contentSource: ContentSource;
  hasPanelError: boolean;
}) {
  const topLeadSource = leadSources[0]?.[0];

  return [
    {
      id: "admin-release-desk",
      tab: "walls-devine",
      title: "Release desk",
      summary: `${completedChecklist}/${adminData.plan.checklist.length} tasks complete`,
      detail: isScaffoldMode ? "Scaffold mode is holding the release desk visible while live content reconnects." : `Last release update ${new Date(adminData.plan.updatedAt).toLocaleString()}.`,
      actionLabel: "Open release desk",
      status: isScaffoldMode ? "pending" : "ready"
    },
    {
      id: "admin-journals",
      tab: "walls-devine",
      title: "Journal studio",
      summary: `${adminData.journalEntries.length} journal${adminData.journalEntries.length === 1 ? "" : "s"}`,
      detail: hasLiveMarkdownContent ? "Write, rename, publish, and prune song journals from one place." : "Waiting on Firestore markdown sync before journal CRUD is live.",
      actionLabel: "Open journals",
      status: hasLiveMarkdownContent ? "ready" : "pending"
    },
    {
      id: "admin-booking-engine",
      tab: "walls-devine",
      title: "Booking engine",
      summary: `${bookingTargetsCount} target${bookingTargetsCount === 1 ? "" : "s"} · ${bookingLeadCount} booking-fit lead${bookingLeadCount === 1 ? "" : "s"}`,
      detail: isScaffoldMode
        ? "Waiting on the live project document before the booking board returns to the primary workspace."
        : bookingTargetsCount
          ? `Lock by ${new Date(bookingDeadline).toLocaleDateString()}. ${bookingCriticalCount} critical target${bookingCriticalCount === 1 ? "" : "s"} seeded.`
          : "Seed the booking board before the lock date gets too close.",
      actionLabel: "Open booking engine",
      status: !isScaffoldMode && bookingTargetsCount ? "ready" : "pending"
    },
    {
      id: "admin-instagram-posts",
      tab: "walls-devine",
      title: "Draft studio",
      summary: `${adminData.instagramDrafts.length} draft${adminData.instagramDrafts.length === 1 ? "" : "s"}`,
      detail: hasLiveMarkdownContent ? "Keep release copy editable without touching repo files." : "Draft CRUD will unlock once the markdown collection finishes hydrating.",
      actionLabel: "Open drafts",
      status: hasLiveMarkdownContent ? "ready" : "pending"
    },
    {
      id: "admin-analytics",
      tab: "agency",
      title: "Agency signal desk",
      summary: `${leadsCount} leads · ${visitsCount} visits`,
      detail:
        hasLeadsError || hasVisitsError
          ? "One or more analytics collections need a refresh."
          : topLeadSource
            ? `Top lead source: ${formatLeadSource(topLeadSource)}.`
            : topVisitSong
              ? `Top listening-room arrival: ${topVisitSong}.`
              : "Lead generation and listening-room activity will land here.",
      actionLabel: "Open signal desk",
      status: hasLeadsError || hasVisitsError ? "pending" : "ready"
    },
    {
      id: "admin-assets",
      tab: "walls-devine",
      title: "Assets & QA",
      summary: `${audioCount} WAV file${audioCount === 1 ? "" : "s"} inspected`,
      detail: hasAudioError
        ? "Audio inspection reported an issue. Use refresh to retry."
        : audioCount
          ? "Server-side file inspection is returning metadata."
          : "Live WAV inspection has not landed yet, so this stays parked in backlog.",
      actionLabel: "Open assets",
      status: hasAudioError || !audioCount ? "pending" : "ready"
    },
    {
      id: "admin-health",
      tab: "agency",
      title: "Backend health",
      summary: contentSource === "bootstrap" ? "Fallback mode" : contentSource === "firebase" ? "Firebase live" : "Awaiting backend",
      detail:
        hasPanelError
          ? "One or more auth or content checks need attention."
          : contentSource === "firebase"
            ? "Auth gate, content source, and migration readiness are available here."
            : "Keep this parked in backlog until the console is running against live Firebase content.",
      actionLabel: "Open backend health",
      status: hasPanelError || contentSource !== "firebase" ? "pending" : "ready"
    },
    {
      id: "admin-ideas",
      tab: "agency",
      title: "Ideas",
      summary: `${ideaCatalogue.length} idea${ideaCatalogue.length === 1 ? "" : "s"} logged`,
      detail: "App concepts, ecosystem ideas, and scripts to weigh. A running catalogue of what could be built next.",
      actionLabel: "Open ideas",
      status: "ready"
    }
  ] satisfies DashboardModule[];
}

export function AdminConsole() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(null);
  const [adminData, setAdminData] = useState<WallsDevineAdminData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [panelError, setPanelError] = useState("");
  const [contentSource, setContentSource] = useState<ContentSource>("pending");
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [audioAnalysis, setAudioAnalysis] = useState<AdminAudioAnalysis[]>([]);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [ecosystemLeads, setEcosystemLeads] = useState<EcosystemLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");
  const [listeningRoomVisits, setListeningRoomVisits] = useState<ListeningRoomVisit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsError, setVisitsError] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<AdminWorkspaceTabId>("walls-devine");
  const [openSections, setOpenSections] = useState<Record<AdminWorkspaceSectionId, boolean>>(() => ({ ...defaultOpenSections }));
  const [, startTransition] = useTransition();

  const hasFirebaseRuntime = Boolean(firebaseAuth);
  const isAuthorized = isActiveAdminProfile(adminProfile);
  const adminViewData = adminData ?? fallbackAdminData;
  const isScaffoldMode = !adminData;
  const completedChecklist = useMemo(() => countCompletedChecklist(adminViewData.plan.checklist), [adminViewData.plan.checklist]);
  const checklistByPhase = useMemo(() => groupChecklistByPhase(adminViewData.plan.checklist), [adminViewData.plan.checklist]);
  const hasLiveMarkdownContent = adminData ? adminData.contentBackend === "firestore" && adminData.markdownInitialized !== false : false;
  const leadSources = useMemo(() => {
    const counts = new Map<string, number>();

    for (const lead of ecosystemLeads) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1]);
  }, [ecosystemLeads]);
  const leadProgramMix = useMemo(() => {
    const counts = new Map<string, number>();

    for (const lead of ecosystemLeads) {
      const label = getLeadProgramLabel(lead);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1]);
  }, [ecosystemLeads]);
  const leadContextMix = useMemo(() => {
    const counts = new Map<string, number>();

    for (const lead of ecosystemLeads) {
      const label = getLeadPrimaryContext(lead);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1]).slice(0, 6);
  }, [ecosystemLeads]);
  const bookingLeadMatches = useMemo(
    () => buildBookingLeadMatches(adminViewData.bookingBoard, ecosystemLeads),
    [adminViewData.bookingBoard, ecosystemLeads]
  );
  const bookingTargetSaveStates = useMemo(
    () =>
      adminViewData.bookingBoard.targets.reduce<Record<string, SaveState | undefined>>((states, target) => {
        states[target.id] = saveStates[getBookingTargetSaveKey(target.id)];
        return states;
      }, {}),
    [adminViewData.bookingBoard.targets, saveStates]
  );
  const visitSongs = useMemo(() => {
    const counts = new Map<string, number>();

    for (const visit of listeningRoomVisits) {
      const label = visit.songTitle || visit.songSlug || "Unknown song";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1]);
  }, [listeningRoomVisits]);
  const dashboardModules = useMemo(
    () =>
      buildDashboardModules({
        completedChecklist,
        adminData: adminViewData,
        isScaffoldMode,
        hasLiveMarkdownContent,
        bookingTargetsCount: adminViewData.bookingBoard.targets.length,
        bookingLeadCount: bookingLeadMatches.length,
        bookingDeadline: adminViewData.bookingBoard.goal.lockByDate,
        bookingCriticalCount: adminViewData.bookingBoard.targets.filter((target) => target.priority === "critical").length,
        leadsCount: ecosystemLeads.length,
        hasLeadsError: Boolean(leadsError),
        leadSources,
        visitsCount: listeningRoomVisits.length,
        topVisitSong: visitSongs[0]?.[0] ?? null,
        audioCount: audioAnalysis.length,
        hasAudioError: Boolean(audioError),
        hasVisitsError: Boolean(visitsError),
        contentSource,
        hasPanelError: Boolean(panelError)
      }),
    [
      completedChecklist,
      adminViewData,
      isScaffoldMode,
      hasLiveMarkdownContent,
      bookingLeadMatches.length,
      ecosystemLeads.length,
      leadsError,
      leadSources,
      listeningRoomVisits.length,
      visitSongs,
      audioAnalysis.length,
      audioError,
      visitsError,
      contentSource,
      panelError
    ]
  );
  const jumpLinks = useMemo(
    () => [
      {
        id: "admin-release-desk",
        tab: "walls-devine",
        label: "Release desk",
        detail: `${completedChecklist}/${adminViewData.plan.checklist.length} complete`
      },
      {
        id: "admin-journals",
        tab: "walls-devine",
        label: "Journals",
        detail: `${adminViewData.journalEntries.length} live`
      },
      {
        id: "admin-booking-engine",
        tab: "walls-devine",
        label: "Booking",
        detail: `${adminViewData.bookingBoard.targets.length} targets · ${bookingLeadMatches.length} matches`
      },
      {
        id: "admin-instagram-posts",
        tab: "walls-devine",
        label: "Drafts",
        detail: `${adminViewData.instagramDrafts.length} live`
      },
      {
        id: "admin-analytics",
        tab: "agency",
        label: "Signal desk",
        detail: `${ecosystemLeads.length} leads · ${listeningRoomVisits.length} visits`
      },
      {
        id: "admin-assets",
        tab: "walls-devine",
        label: "Assets",
        detail: `${audioAnalysis.length} WAV${audioAnalysis.length === 1 ? "" : "s"}`
      },
      {
        id: "admin-health",
        tab: "agency",
        label: "Health",
        detail: panelError ? "Needs attention" : contentSource === "bootstrap" ? "Fallback mode" : "Backend ready"
      },
      {
        id: "admin-ideas",
        tab: "agency",
        label: "Ideas",
        detail: `${ideaCatalogue.length} logged`
      }
    ] satisfies AdminJumpLink[],
    [
      audioAnalysis.length,
      adminViewData.bookingBoard.targets.length,
      adminViewData.instagramDrafts.length,
      adminViewData.journalEntries.length,
      adminViewData.plan.checklist.length,
      bookingLeadMatches.length,
      completedChecklist,
      contentSource,
      ecosystemLeads.length,
      listeningRoomVisits.length,
      panelError
    ]
  );
  const activeWorkspaceTabConfig = useMemo(
    () => adminWorkspaceTabs.find((tab) => tab.id === activeWorkspaceTab) ?? adminWorkspaceTabs[0],
    [activeWorkspaceTab]
  );
  const moduleStatusById = useMemo(
    () =>
      dashboardModules.reduce<Record<AdminWorkspaceSectionId, DashboardModule["status"]>>((statuses, module) => {
        statuses[module.id] = module.status;
        return statuses;
      }, {} as Record<AdminWorkspaceSectionId, DashboardModule["status"]>),
    [dashboardModules]
  );
  const visibleDashboardModules = useMemo(
    () => dashboardModules.filter((module) => module.tab === activeWorkspaceTab && module.status === "ready"),
    [dashboardModules, activeWorkspaceTab]
  );
  const backlogDashboardModules = useMemo(
    () => dashboardModules.filter((module) => module.tab === activeWorkspaceTab && module.status === "pending"),
    [dashboardModules, activeWorkspaceTab]
  );
  const visibleJumpLinks = useMemo(
    () => jumpLinks.filter((link) => link.tab === activeWorkspaceTab && moduleStatusById[link.id] === "ready"),
    [jumpLinks, activeWorkspaceTab, moduleStatusById]
  );
  const activeBacklogId = getBacklogElementId(activeWorkspaceTab);
  const isResolvingAuthorizedSession = Boolean(authUser) && dataLoading && !isAuthorized && !panelError;
  const isRefreshingAuthorizedAdmin = Boolean(authUser) && isAuthorized && dataLoading;
  const whiteboardActionLinks = visibleJumpLinks.slice(0, 4);
  const bookingGoalCountdown = formatCountdownToDate(adminViewData.bookingBoard.goal.lockByDate);
  const releaseFocusItems = Array.from(
    new Set([...adminViewData.bookingBoard.goal.nextMoves, ...adminViewData.plan.recommendedSetup, ...adminViewData.plan.guidance])
  ).slice(0, 4);

  function isSectionReady(sectionId: AdminWorkspaceSectionId) {
    return moduleStatusById[sectionId] === "ready";
  }

  function setWorkspaceSectionOpen(sectionId: AdminWorkspaceSectionId, nextOpen: boolean) {
    setOpenSections((current) => (current[sectionId] === nextOpen ? current : { ...current, [sectionId]: nextOpen }));
  }

  function toggleWorkspaceSection(sectionId: AdminWorkspaceSectionId) {
    setOpenSections((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  }

  function scrollToElement(elementId: string, behavior: ScrollBehavior = "smooth") {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior, block: "start" });
      });
    });
  }

  function scrollToWorkspaceSection(sectionId: AdminWorkspaceSectionId, behavior: ScrollBehavior = "smooth") {
    scrollToElement(sectionId, behavior);
  }

  function handleJumpToSection(sectionId: AdminWorkspaceSectionId) {
    const tabId = workspaceSectionTabs[sectionId];

    setActiveWorkspaceTab(tabId);

    if (!isSectionReady(sectionId)) {
      const backlogId = getBacklogElementId(tabId);
      window.history.replaceState(null, "", `#${backlogId}`);
      scrollToElement(backlogId);
      return;
    }

    setWorkspaceSectionOpen(sectionId, true);
    window.history.replaceState(null, "", `#${sectionId}`);
    scrollToWorkspaceSection(sectionId);
  }

  function handleWorkspaceTabChange(tabId: AdminWorkspaceTabId) {
    setActiveWorkspaceTab(tabId);
  }

  function handleJumpToBacklog(tabId: AdminWorkspaceTabId = activeWorkspaceTab) {
    const backlogId = getBacklogElementId(tabId);

    setActiveWorkspaceTab(tabId);
    window.history.replaceState(null, "", `#${backlogId}`);
    scrollToElement(backlogId);
  }

  function collectionHasDuplicateSlug(collection: AdminMarkdownCollection, slug: string, currentSlug?: string) {
    if (!adminData) {
      return false;
    }

    return getMarkdownFiles(adminData, collection).some((file) => file.slug === slug && file.slug !== currentSlug);
  }

  async function loadAuthorizedAdmin(user: User) {
    setDataLoading(true);
    setPanelError("");

    try {
      const profile = await getAdminUserProfile(user.uid);
      setAdminProfile(profile);

      if (!isActiveAdminProfile(profile)) {
        setPanelError(`Signed in as ${user.email ?? "an unknown account"}, but no active ${firebaseAdminPaths.adminUsersCollection}/${user.uid} document was found.`);
        return;
      }

      let nextData = await getFirebaseWallsDevineAdminData();
      let nextSource: ContentSource = nextData?.contentBackend === "bootstrap" ? "bootstrap" : "firebase";
      const needsBootstrap =
        !nextData ||
        nextData.contentBackend === "bootstrap" ||
        nextData.markdownInitialized === false ||
        nextData.bookingBoardInitialized === false;

      if (needsBootstrap) {
        const bootstrapSeed = await fetchBootstrapData(await user.getIdToken());
        nextData = await seedFirebaseWallsDevineAdminData(bootstrapSeed);
        nextSource = nextData.contentBackend === "bootstrap" ? "bootstrap" : "firebase";
      }

      if (!nextData) {
        throw new Error("Firebase content is still empty after the bootstrap attempt.");
      }

      setContentSource(nextSource);
      startTransition(() => {
        setAdminData(nextData);
      });
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);

      try {
        const bootstrapSeed = await fetchBootstrapData(await user.getIdToken());
        setContentSource("bootstrap");
        setPanelError(`${errorMessage} Showing local dashboard data while Firebase reconnects.`);
        startTransition(() => {
          setAdminData({
            ...bootstrapSeed,
            storageBacked: false,
            contentBackend: "bootstrap",
            markdownInitialized: false
          });
        });
      } catch {
        setPanelError(`${errorMessage} Showing scaffold mode until the backend is available.`);
      }
    } finally {
      setDataLoading(false);
    }
  }

  async function loadAudioAnalysis(user: User) {
    setAudioLoading(true);
    setAudioError("");

    try {
      const nextAnalysis = await fetchAudioAnalysis(await user.getIdToken());
      startTransition(() => {
        setAudioAnalysis(nextAnalysis);
      });
    } catch (error) {
      setAudioError(getFirebaseErrorMessage(error));
    } finally {
      setAudioLoading(false);
    }
  }

  async function loadEcosystemLeadBacklog() {
    setLeadsLoading(true);
    setLeadsError("");

    try {
      const nextLeads = await getEcosystemLeads();
      startTransition(() => {
        setEcosystemLeads(nextLeads);
      });
    } catch (error) {
      setLeadsError(getFirebaseErrorMessage(error));
    } finally {
      setLeadsLoading(false);
    }
  }

  async function loadListeningRoomVisitBacklog() {
    setVisitsLoading(true);
    setVisitsError("");

    try {
      const nextVisits = await getListeningRoomVisits();
      startTransition(() => {
        setListeningRoomVisits(nextVisits);
      });
    } catch (error) {
      setVisitsError(getFirebaseErrorMessage(error));
    } finally {
      setVisitsLoading(false);
    }
  }

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthLoading(false);
      setPanelError("Firebase Auth is not initialized. Confirm the web app configuration before using /admin.");
      return;
    }

    let isActive = true;
    let hasResolvedInitialSession = false;
    const authTimeoutId = window.setTimeout(() => {
      if (!isActive || hasResolvedInitialSession) {
        return;
      }

      setAuthLoading(false);
      setPanelError("Firebase Auth took too long to confirm the current session. Sign in manually below and reload if the session check still stalls.");
    }, AUTH_SESSION_TIMEOUT_MS);

    const resolveInitialSession = () => {
      hasResolvedInitialSession = true;
      window.clearTimeout(authTimeoutId);
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!isActive) {
        return;
      }

      resolveInitialSession();
      setAuthLoading(false);
      setAuthError("");
      setPanelError("");
      setAuthUser(user);
      setAdminData(null);
      setAdminProfile(null);
      setContentSource("pending");

      if (!user) {
        return;
      }

      await loadAuthorizedAdmin(user);
    }, (error) => {
      if (!isActive) {
        return;
      }

      resolveInitialSession();
      setAuthLoading(false);
      setAuthUser(null);
      setAdminData(null);
      setAdminProfile(null);
      setContentSource("pending");
      setAuthError(getFirebaseErrorMessage(error));
      setPanelError("Firebase Auth could not confirm the current session. Sign in manually below or reload after checking the Firebase project settings.");
    });

    return () => {
      isActive = false;
      window.clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, [startTransition]);

  useEffect(() => {
    if (!authUser || !isAuthorized) {
      setAudioAnalysis([]);
      setAudioError("");
      setAudioLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setAudioLoading(true);
      setAudioError("");

      try {
        const nextAnalysis = await fetchAudioAnalysis(await authUser.getIdToken());

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setAudioAnalysis(nextAnalysis);
        });
      } catch (error) {
        if (!cancelled) {
          setAudioError(getFirebaseErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setAudioLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [authUser, isAuthorized, startTransition]);

  useEffect(() => {
    if (!authUser || !isAuthorized) {
      setEcosystemLeads([]);
      setLeadsError("");
      setLeadsLoading(false);
      return;
    }

    void loadEcosystemLeadBacklog();
  }, [authUser, isAuthorized, startTransition]);

  useEffect(() => {
    if (!authUser || !isAuthorized) {
      setListeningRoomVisits([]);
      setVisitsError("");
      setVisitsLoading(false);
      return;
    }

    void loadListeningRoomVisitBacklog();
  }, [authUser, isAuthorized, startTransition]);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const hashId = window.location.hash.replace(/^#/, "");

    if (hashId === getBacklogElementId("walls-devine") || hashId === getBacklogElementId("agency")) {
      setActiveWorkspaceTab(hashId.endsWith("agency") ? "agency" : "walls-devine");
      scrollToElement(hashId, "auto");
      return;
    }

    const sectionId = hashId;

    if (!isWorkspaceSectionId(sectionId)) {
      return;
    }

    setActiveWorkspaceTab(workspaceSectionTabs[sectionId]);

    if (!isSectionReady(sectionId)) {
      scrollToElement(getBacklogElementId(workspaceSectionTabs[sectionId]), "auto");
      return;
    }

    setWorkspaceSectionOpen(sectionId, true);
    scrollToWorkspaceSection(sectionId, "auto");
  }, [isAuthorized, moduleStatusById]);

  useEffect(() => {
    if (panelError || isScaffoldMode || !hasLiveMarkdownContent) {
      setWorkspaceSectionOpen("admin-health", true);
    }
  }, [panelError, isScaffoldMode, hasLiveMarkdownContent]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseAuth) {
      setAuthError("Firebase Auth is not initialized.");
      return;
    }

    setAuthError("");

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      setPassword("");
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    }
  }

  async function handleLogout() {
    if (!firebaseAuth) {
      return;
    }

    await signOut(firebaseAuth);
    setAdminData(null);
    setAdminProfile(null);
    setEcosystemLeads([]);
    setLeadsError("");
    setSaveStates({});
    setOpenSections({ ...defaultOpenSections });
  }

  async function handleRetryAccess() {
    if (!authUser) {
      return;
    }

    await loadAuthorizedAdmin(authUser);
  }

  async function handleAudioRefresh() {
    if (!authUser || !isAuthorized) {
      return;
    }

    await loadAudioAnalysis(authUser);
  }

  async function handleAnalyticsRefresh() {
    if (!authUser || !isAuthorized) {
      return;
    }

    await Promise.all([loadEcosystemLeadBacklog(), loadListeningRoomVisitBacklog()]);
  }

  async function handleChecklistToggle(itemId: string, completed: boolean) {
    if (!adminData) {
      return;
    }

    setPanelError("");

    try {
      const nextPlan = await updateFirebaseReleasePlanItem(itemId, completed);
      startTransition(() => {
        setAdminData((current) => (current ? { ...current, plan: nextPlan } : current));
      });
    } catch (error) {
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleBookingTargetSave(event: FormEvent<HTMLFormElement>, targetId: string) {
    event.preventDefault();

    if (!adminData) {
      return;
    }

    const saveKey = getBookingTargetSaveKey(targetId);
    const formData = new FormData(event.currentTarget);
    const nextStatus = String(formData.get("status") ?? "").trim();
    const nextNotes = String(formData.get("notes") ?? "").trim();

    if (!isBookingTargetStatus(nextStatus)) {
      setPanelError("Booking targets need a valid workflow status before they can be saved.");
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [saveKey]: "saving" }));

    try {
      const nextBookingBoard = {
        ...adminData.bookingBoard,
        updatedAt: new Date().toISOString(),
        targets: adminData.bookingBoard.targets.map((target) =>
          target.id === targetId
            ? {
                ...target,
                status: nextStatus,
                notes: nextNotes
              }
            : target
        )
      };
      const savedBookingBoard = await updateFirebaseBookingBoard(nextBookingBoard);

      startTransition(() => {
        setAdminData((current) =>
          current
            ? {
                ...current,
                bookingBoard: savedBookingBoard,
                bookingBoardInitialized: true
              }
            : current
        );
      });

      setSaveStates((current) => ({ ...current, [saveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleCollectorHeroNoteSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminData) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const salutation = String(formData.get("salutation") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const primaryCtaLabel = String(formData.get("primaryCtaLabel") ?? "").trim();
    const secondaryCtaLabel = String(formData.get("secondaryCtaLabel") ?? "").trim();
    const mailingListHelper = String(formData.get("mailingListHelper") ?? "").trim();
    const signatureIntro = String(formData.get("signatureIntro") ?? "").trim();
    const journalLabel = String(formData.get("journalLabel") ?? "").trim();

    if (!eyebrow || !title || !salutation || !body || !primaryCtaLabel || !secondaryCtaLabel || !mailingListHelper || !signatureIntro || !journalLabel) {
      setPanelError("The collector note needs an eyebrow, title, salutation, body copy, both CTA labels, the mailing-list helper copy, the signoff line, and the journal label before it can be saved.");
      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "saving" }));

    try {
      const nextNote = await updateFirebaseCollectorHeroNote({
        eyebrow,
        title,
        salutation,
        body,
        primaryCtaLabel,
        secondaryCtaLabel,
        mailingListHelper,
        signatureIntro,
        journalLabel
      });

      startTransition(() => {
        setAdminData((current) => (current ? { ...current, collectorHeroNote: nextNote } : current));
      });

      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleBookingBannerNoteSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminData) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const primaryCtaLabel = String(formData.get("primaryCtaLabel") ?? "").trim();
    const secondaryCtaLabel = String(formData.get("secondaryCtaLabel") ?? "").trim();
    const meta = String(formData.get("meta") ?? "").trim();

    if (!eyebrow || !title || !description || !primaryCtaLabel || !secondaryCtaLabel || !meta) {
      setPanelError("The booking banner needs an eyebrow, title, description, both CTA labels, and a meta line before it can be saved.");
      setSaveStates((current) => ({ ...current, [bookingBannerNoteSaveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [bookingBannerNoteSaveKey]: "saving" }));

    try {
      const nextNote = await updateFirebaseBookingBannerNote({ eyebrow, title, description, primaryCtaLabel, secondaryCtaLabel, meta });

      startTransition(() => {
        setAdminData((current) => (current ? { ...current, bookingBannerNote: nextNote } : current));
      });

      setSaveStates((current) => ({ ...current, [bookingBannerNoteSaveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [bookingBannerNoteSaveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleUpcomingShowsSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminData) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const emptyState = String(formData.get("emptyState") ?? "").trim();
    const showsManifest = String(formData.get("showsManifest") ?? "").trim();
    const { shows, error } = parseUpcomingShowsFromEditor(showsManifest);

    if (!eyebrow || !title || !description || !emptyState) {
      setPanelError("The upcoming shows panel needs an eyebrow, title, description, and empty-state note before it can be saved.");
      setSaveStates((current) => ({ ...current, [upcomingShowsSaveKey]: "error" }));
      return;
    }

    if (error) {
      setPanelError(error);
      setSaveStates((current) => ({ ...current, [upcomingShowsSaveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [upcomingShowsSaveKey]: "saving" }));

    try {
      const nextNote = await updateFirebaseUpcomingShowsNote({
        eyebrow,
        title,
        description,
        emptyState,
        shows
      });

      startTransition(() => {
        setAdminData((current) => (current ? { ...current, upcomingShowsNote: nextNote } : current));
      });

      setSaveStates((current) => ({ ...current, [upcomingShowsSaveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [upcomingShowsSaveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleLinkHubSave(nextLinkHub: LinkHubContent) {
    if (!adminData) {
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [linkHubSaveKey]: "saving" }));

    try {
      const savedLinkHub = await updateFirebaseLinkHub(nextLinkHub);

      startTransition(() => {
        setAdminData((current) => (current ? { ...current, linkHub: savedLinkHub } : current));
      });

      setSaveStates((current) => ({ ...current, [linkHubSaveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [linkHubSaveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleMarkdownSave(event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection, slug: string) {
    event.preventDefault();

    if (!adminData || !hasLiveMarkdownContent) {
      return;
    }

    const saveKey = getSaveNoticeKey(collection, slug);
    const formData = new FormData(event.currentTarget);
    const nextSlug = normalizeMarkdownSlug(String(formData.get("slug") ?? ""));
    const content = String(formData.get("content") ?? "");

    if (!nextSlug) {
      setPanelError("Every draft and journal needs a valid slug before it can be saved.");
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      return;
    }

    if (collectionHasDuplicateSlug(collection, nextSlug, slug)) {
      setPanelError(`A ${getCollectionLabel(collection)} with the slug "${nextSlug}" already exists.`);
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [saveKey]: "saving" }));

    try {
      const nextFile =
        nextSlug === slug
          ? await updateFirebaseAdminMarkdownFile(collection, slug, content)
          : await renameFirebaseAdminMarkdownFile(collection, slug, nextSlug, content);

      startTransition(() => {
        setAdminData((current) => {
          if (!current) {
            return current;
          }

          const baseData = nextSlug === slug ? current : removeAdminMarkdownFile(current, collection, slug);
          return replaceAdminMarkdownFile(baseData, collection, nextFile);
        });
      });

      setSaveStates((current) => {
        if (nextSlug === slug) {
          return { ...current, [saveKey]: "success" };
        }

        const nextStates: Record<string, SaveState> = {
          ...current,
          [getSaveNoticeKey(collection, nextSlug)]: "success"
        };
        delete nextStates[saveKey];
        return nextStates;
      });
    } catch (error) {
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleMarkdownCreate(event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection) {
    event.preventDefault();

    if (!adminData || !hasLiveMarkdownContent) {
      return;
    }

    const createKey = getCreateNoticeKey(collection);
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const requestedSlug = String(formData.get("slug") ?? "");
    const content = String(formData.get("content") ?? "");
    const slug = normalizeMarkdownSlug(requestedSlug || title);

    if (!title) {
      setPanelError(`Add a title before creating a new ${getCollectionLabel(collection)}.`);
      setSaveStates((current) => ({ ...current, [createKey]: "error" }));
      return;
    }

    if (!slug) {
      setPanelError(`Add a valid slug before creating a new ${getCollectionLabel(collection)}.`);
      setSaveStates((current) => ({ ...current, [createKey]: "error" }));
      return;
    }

    if (collectionHasDuplicateSlug(collection, slug)) {
      setPanelError(`A ${getCollectionLabel(collection)} with the slug "${slug}" already exists.`);
      setSaveStates((current) => ({ ...current, [createKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [createKey]: "saving" }));

    try {
      const nextFile = await updateFirebaseAdminMarkdownFile(collection, slug, buildInitialMarkdownContent(title, content));

      startTransition(() => {
        setAdminData((current) => (current ? replaceAdminMarkdownFile(current, collection, nextFile) : current));
      });

      event.currentTarget.reset();
      setSaveStates((current) => ({ ...current, [createKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [createKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  async function handleMarkdownDelete(collection: AdminMarkdownCollection, slug: string) {
    if (!adminData || !hasLiveMarkdownContent) {
      return;
    }

    const fileLabel = getCollectionLabel(collection);
    const confirmed = window.confirm(`Delete this ${fileLabel}? This removes the live markdown document from Firestore.`);

    if (!confirmed) {
      return;
    }

    const saveKey = getSaveNoticeKey(collection, slug);
    setPanelError("");
    setSaveStates((current) => ({ ...current, [saveKey]: "deleting" }));

    try {
      await deleteFirebaseAdminMarkdownFile(collection, slug);

      startTransition(() => {
        setAdminData((current) => (current ? removeAdminMarkdownFile(current, collection, slug) : current));
      });

      setSaveStates((current) => {
        const nextStates: Record<string, SaveState> = { ...current };
        delete nextStates[saveKey];
        return nextStates;
      });
    } catch (error) {
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      setPanelError(getFirebaseErrorMessage(error));
    }
  }

  if (authLoading) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-loading" labelledBy="admin-loading-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-loading-title"
            eyebrow="Hidden route"
            title="Admin Console"
            description="Checking the current Firebase session before loading the control room."
          />
          <p className="cg-admin__helper">Waiting on Firebase Auth…</p>
        </SectionShell>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-login" labelledBy="admin-login-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-login-title"
            eyebrow="Hidden route"
            title="Admin Console"
            description="Sign in with the editor account for the Walls/Devine backend."
          />

          <form onSubmit={handleLogin} className="cg-admin__login-form">
            <label className="cg-admin__field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            <label className="cg-admin__field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {authError ? <p className="cg-admin__error">{authError}</p> : null}
            {panelError ? <p className="cg-admin__error">{panelError}</p> : null}

            <div className="cg-admin__login-actions">
              <Button type="submit" disabled={!hasFirebaseRuntime}>
                Enter Admin
              </Button>
            </div>
          </form>
        </SectionShell>
      </main>
    );
  }

  if (isResolvingAuthorizedSession) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-bootstrap" labelledBy="admin-bootstrap-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-bootstrap-title"
            eyebrow="Firebase admin"
            title="Preparing the control room"
            description="Verifying the editor profile and loading any available remote content."
          />
          <p className="cg-admin__helper">Signed in as {authUser.email ?? "Unknown email"}</p>
          {panelError ? <p className="cg-admin__error">{panelError}</p> : null}
          <div className="cg-admin__login-actions">
            <Button type="button" variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </SectionShell>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-authorization" labelledBy="admin-authorization-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-authorization-title"
            eyebrow="Firebase admin"
            title="Authorized editor profile required"
            description="This session signed in correctly, but the editor profile was not visible yet."
          />

          <div className="cg-admin__stack">
            <p className="cg-admin__error">{panelError || "This account is missing its adminUsers document."}</p>
            <p className="cg-admin__helper">Signed in as: {authUser.email ?? "Unknown email"}</p>
            <div className="cg-admin__login-actions">
              <Button type="button" variant="secondary" onClick={handleRetryAccess}>
                Retry access
              </Button>
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </SectionShell>
      </main>
    );
  }

  return (
    <main className="cg-page cg-admin-page">
      <SectionShell id="admin-console" labelledBy="admin-console-title" innerClassName="cg-admin">
        <div className="cg-admin__topbar">
          <SectionHeader
            id="admin-console-title"
            eyebrow="Admin"
            title="CGU control room"
            description={isScaffoldMode ? `Control-room scaffold for ${activeWorkspaceTabConfig.description.toLowerCase()} while live backend content reconnects.` : activeWorkspaceTabConfig.description}
          />

          <div className="cg-admin__topbar-actions">
            <p className="cg-admin__mode">{authUser.email ?? "Unknown email"}</p>
            <div className="cg-admin__editor-actions">
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </div>

        {panelError ? <p className="cg-admin__error">{panelError}</p> : null}
        {isRefreshingAuthorizedAdmin ? <p className="cg-admin__helper">Refreshing the live Firebase release plan and content while the dashboard stays visible.</p> : null}
        {isScaffoldMode ? (
          <div className="cg-admin__banner">
            <div>
              <strong>{isRefreshingAuthorizedAdmin ? "Live content is still hydrating" : "Scaffold mode is active"}</strong>
              <p>
                {isRefreshingAuthorizedAdmin
                  ? "The dashboard is visible below while Firebase finishes loading the release plan, markdown content, and any available remote modules."
                  : "The full dashboard is visible below, but the live Firebase content layer did not hydrate yet. Use retry to pull the real release-plan and content data back in."}
              </p>
            </div>
            <div className="cg-admin__banner-actions">
              <Button type="button" variant="secondary" size="sm" onClick={handleRetryAccess}>
                Retry data load
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        ) : !hasLiveMarkdownContent ? (
          <p className="cg-admin__helper">
            Draft and journal syncing is still waiting on the Firestore markdown layer. The release plan is live now, and the backend health section below will tell you what is still missing.
          </p>
        ) : null}

        <section className="cg-admin__whiteboard" aria-label={`${activeWorkspaceTabConfig.label} whiteboard`}>
          <div className="cg-admin__whiteboard-head">
            <div className="cg-admin__whiteboard-copy">
              <p className="cg-admin__whiteboard-eyebrow">Whiteboard</p>
              <h2>
                {activeWorkspaceTab === "walls-devine"
                  ? "Schedule, goals, and the few moves that actually change the June 4 release."
                  : "Signals, routing, and backend readiness kept above the fold."}
              </h2>
              <p>
                {activeWorkspaceTab === "walls-devine"
                  ? "This lane keeps the release plan visible first, then lets you jump directly into booking, editorial, and QA without hunting through the whole dashboard."
                  : "This lane keeps lead flow, listening traffic, and backend state in one place so the broader studio picture stays legible."}
              </p>
            </div>

            <div className="cg-admin__whiteboard-controls">
              <div className="cg-admin__tab-bar" role="tablist" aria-label="Admin workspace categories">
                {adminWorkspaceTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeWorkspaceTab === tab.id}
                    className={["cg-admin__tab-chip", activeWorkspaceTab === tab.id ? "cg-admin__tab-chip--active" : ""].filter(Boolean).join(" ")}
                    onClick={() => handleWorkspaceTabChange(tab.id)}
                  >
                    <strong>{tab.label}</strong>
                    <span>{tab.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cg-admin__whiteboard-grid">
            {activeWorkspaceTab === "walls-devine" ? (
              <>
                <AdminWhiteboardCard
                  label="Primary goal"
                  title={adminViewData.bookingBoard.goal.title}
                  copy={adminViewData.bookingBoard.goal.summary}
                  className="cg-admin__whiteboard-card--goal"
                >
                  <p className="cg-admin__whiteboard-card-note">Success metric: {adminViewData.bookingBoard.goal.successMetric}</p>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Locked schedule"
                  title={adminViewData.plan.lockedDates[0]?.value ?? "Schedule pending"}
                  copy={adminViewData.plan.lockedDates[0]?.label ?? "Set the release anchors first."}
                >
                  <ul className="cg-admin__list">
                    {adminViewData.plan.lockedDates.slice(1).map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}</strong>
                        <span>{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Pareto focus"
                  title="Run the smallest set of launch-moving tasks"
                  copy="Keep the current goal and the next few actions visible. Everything else can wait below the fold or stay collapsed."
                >
                  <ul className="cg-admin__bullet-list">
                    {releaseFocusItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Operate now"
                  title="Open the right lane"
                  copy="Jump into the live sections or force a content sync if a lane is still hydrating."
                >
                  <div className="cg-admin__whiteboard-actions-list">
                    {whiteboardActionLinks.map((link) => (
                      <Button key={link.id} type="button" variant="ghost" size="sm" onClick={() => handleJumpToSection(link.id)}>
                        {link.label}
                      </Button>
                    ))}
                    {!hasLiveMarkdownContent ? (
                      <Button type="button" variant="secondary" size="sm" onClick={handleRetryAccess} disabled={dataLoading}>
                        {dataLoading ? "Syncing…" : "Retry content sync"}
                      </Button>
                    ) : null}
                  </div>
                </AdminWhiteboardCard>
              </>
            ) : (
              <>
                <AdminWhiteboardCard
                  label="Signal goal"
                  title="Keep routing, listening traffic, and backend state readable"
                  copy="This lane is for triage. Use it to sort what needs attention and leave the lower-priority modules collapsed until you need them."
                  className="cg-admin__whiteboard-card--goal"
                >
                  <p className="cg-admin__whiteboard-card-note">Backend mode: {contentSource === "firebase" ? "Firebase live" : contentSource === "bootstrap" ? "Bootstrap fallback" : "Awaiting backend"}</p>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Lead stack"
                  title={leadSources[0] ? formatLeadSource(leadSources[0][0]) : "Lead intake is quiet"}
                  copy={leadSources[0] ? `${leadSources[0][1]} lead${leadSources[0][1] === 1 ? "" : "s"} from the strongest active source.` : "Once collector and guided-intake traffic lands, the biggest source will surface here first."}
                >
                  <ul className="cg-admin__list">
                    {leadProgramMix.slice(0, 3).map(([label, count]) => (
                      <li key={label}>
                        <strong>{label}</strong>
                        <span>{count} lead{count === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Listening traffic"
                  title={visitSongs[0]?.[0] ?? "No song traffic yet"}
                  copy={visitSongs[0] ? `${visitSongs[0][1]} visit${visitSongs[0][1] === 1 ? "" : "s"} on the most active song-link route.` : "Listening-room arrivals will show up here once shared links start circulating."}
                >
                  <ul className="cg-admin__list">
                    {leadContextMix.slice(0, 3).map(([label, count]) => (
                      <li key={label}>
                        <strong>{label}</strong>
                        <span>{count} signal{count === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                </AdminWhiteboardCard>

                <AdminWhiteboardCard
                  label="Operate now"
                  title="Open the active lane"
                  copy="Stay on the few sections that are already wired, and keep health tucked away unless something breaks."
                >
                  <div className="cg-admin__whiteboard-actions-list">
                    {whiteboardActionLinks.map((link) => (
                      <Button key={link.id} type="button" variant="ghost" size="sm" onClick={() => handleJumpToSection(link.id)}>
                        {link.label}
                      </Button>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
                      {leadsLoading || visitsLoading ? "Refreshing…" : "Refresh signals"}
                    </Button>
                  </div>
                </AdminWhiteboardCard>
              </>
            )}
          </div>

          <div className="cg-admin__whiteboard-strip" aria-label="At a glance metrics">
            {activeWorkspaceTab === "walls-devine" ? (
              <>
                <article className="cg-admin__whiteboard-metric">
                  <span>Checklist</span>
                  <strong>{completedChecklist}/{adminViewData.plan.checklist.length}</strong>
                  <p>release tasks complete</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Lock date</span>
                  <strong>{new Date(adminViewData.bookingBoard.goal.lockByDate).toLocaleDateString()}</strong>
                  <p>{bookingGoalCountdown}</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Booking-fit leads</span>
                  <strong>{bookingLeadMatches.length}</strong>
                  <p>ready for follow-through</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Live lanes</span>
                  <strong>{visibleDashboardModules.length}</strong>
                  <p>{backlogDashboardModules.length} still parked</p>
                </article>
              </>
            ) : (
              <>
                <article className="cg-admin__whiteboard-metric">
                  <span>Leads</span>
                  <strong>{ecosystemLeads.length}</strong>
                  <p>in the intake queue</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Visits</span>
                  <strong>{listeningRoomVisits.length}</strong>
                  <p>listening-room arrivals</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Booking-fit</span>
                  <strong>{bookingLeadMatches.length}</strong>
                  <p>lead and release overlap</p>
                </article>
                <article className="cg-admin__whiteboard-metric">
                  <span>Backend</span>
                  <strong>{contentSource === "firebase" ? "Live" : contentSource === "bootstrap" ? "Fallback" : "Pending"}</strong>
                  <p>{panelError ? "needs attention" : "status clear"}</p>
                </article>
              </>
            )}
          </div>
        </section>
      </SectionShell>

      <div className="cg-admin__workspace-layout">
        <aside className="cg-admin__workspace-drawer cg-admin__panel" aria-label={`${activeWorkspaceTabConfig.label} workspace drawer`}>
          <div className="cg-admin__workspace-drawer-head">
            <div>
              <strong>Navigation</strong>
              <h2>{activeWorkspaceTabConfig.label}</h2>
            </div>
            <p>
              {activeWorkspaceTab === "walls-devine"
                ? "Start with the release desk, then open booking, editorial, or QA only when you need to act."
                : "Use this lane to jump between signals and health checks without drowning in every lower-priority surface."}
            </p>
          </div>

          <div className="cg-admin__workspace-drawer-actions">
            {activeWorkspaceTab === "walls-devine" ? (
              <>
                {isSectionReady("admin-release-desk") ? <Button type="button" onClick={() => handleJumpToSection("admin-release-desk")}>Open release desk</Button> : null}
                {isSectionReady("admin-booking-engine") ? <Button type="button" variant="secondary" onClick={() => handleJumpToSection("admin-booking-engine")}>Open booking engine</Button> : null}
                {isSectionReady("admin-journals") ? <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToSection("admin-journals")}>Open journals</Button> : null}
              </>
            ) : (
              <>
                {isSectionReady("admin-analytics") ? <Button type="button" onClick={() => handleJumpToSection("admin-analytics")}>Open signal desk</Button> : null}
                <Button type="button" variant="secondary" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
                  {leadsLoading || visitsLoading ? "Refreshing signals…" : "Refresh signals"}
                </Button>
                {isSectionReady("admin-health") ? <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToSection("admin-health")}>Open backend health</Button> : null}
              </>
            )}
            {!hasLiveMarkdownContent ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleRetryAccess} disabled={dataLoading}>
                {dataLoading ? "Syncing…" : "Retry content sync"}
              </Button>
            ) : null}
            {backlogDashboardModules.length ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToBacklog(activeWorkspaceTab)}>
                Open backlog
              </Button>
            ) : null}
          </div>

          {visibleDashboardModules.length ? (
            <nav className="cg-admin__workspace-nav" aria-label={`${activeWorkspaceTabConfig.label} modules`}>
              {visibleDashboardModules.map((module) => {
                const moduleLink = visibleJumpLinks.find((link) => link.id === module.id);

                return (
                  <button key={module.id} type="button" className="cg-admin__workspace-nav-item" onClick={() => handleJumpToSection(module.id)}>
                    <span>{module.title}</span>
                    <strong>{module.summary}</strong>
                    <p>{moduleLink?.detail ?? module.detail}</p>
                  </button>
                );
              })}
            </nav>
          ) : (
            <article className="cg-admin__backlog-empty">
              <h2>Focus lane cleared</h2>
              <p>Nothing in this tab is fully live yet. The unfinished surfaces stay parked in backlog below.</p>
            </article>
          )}

          {backlogDashboardModules.length ? (
            <div className="cg-admin__workspace-backlog-drawer">
              <div className="cg-admin__workspace-backlog-drawer-head">
                <div>
                  <strong>Backlog</strong>
                  <p>{backlogDashboardModules.length} parked for later</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToBacklog(activeWorkspaceTab)}>
                  Open backlog
                </Button>
              </div>

              <ul className="cg-admin__workspace-backlog-list">
                {backlogDashboardModules.map((module) => (
                  <li key={module.id} className="cg-admin__workspace-backlog-item">
                    <strong>{module.title}</strong>
                    <span>{module.summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="cg-admin__workspace-main">

      {activeWorkspaceTab === "walls-devine" ? (
        <>
      <AdminWorkspaceSection
        id="admin-release-desk"
        labelId="admin-release-desk-title"
        title="Release desk"
        description={adminViewData.plan.summary}
        detail={`Updated ${new Date(adminViewData.plan.updatedAt).toLocaleString()}`}
        isVisible={isSectionReady("admin-release-desk")}
        isOpen={openSections["admin-release-desk"]}
        onToggle={() => toggleWorkspaceSection("admin-release-desk")}
      >
        <div className="cg-admin__release-board">
          <article className="cg-admin__panel cg-admin__release-priority-card">
            <div className="cg-admin__status-row">
              <h3>Release goal</h3>
              <span className="cg-admin__status-badge cg-admin__status-badge--ready">{bookingGoalCountdown}</span>
            </div>
            <p className="cg-admin__whiteboard-card-note">{adminViewData.bookingBoard.goal.title}</p>
            <p>{adminViewData.bookingBoard.goal.summary}</p>
            <p className="cg-admin__path-note">Success metric: {adminViewData.bookingBoard.goal.successMetric}</p>
            <ul className="cg-admin__bullet-list">
              {adminViewData.bookingBoard.goal.nextMoves.slice(0, 4).map((move) => (
                <li key={move}>{move}</li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h3>Locked dates</h3>
            <ul className="cg-admin__list">
              {adminViewData.plan.lockedDates.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h3>Near-term schedule</h3>
            <div className="cg-admin__calendar cg-admin__calendar--stacked">
              {adminViewData.plan.calendar.map((item) => (
                <article key={`${item.date}-${item.action}`} className="cg-admin__panel">
                  <span className="cg-admin__calendar-date">{item.date}</span>
                  <h4>{item.action}</h4>
                  <p>{item.purpose}</p>
                </article>
              ))}
            </div>
          </article>
        </div>

        <div className="cg-admin__phases">
          {checklistByPhase.map(([phase, items]) => (
            <article key={phase} className="cg-admin__panel">
              <h3>{phase}</h3>
              <div className="cg-admin__checklist">
                {items.map((item) => (
                  <div key={item.id} className="cg-admin__check-item">
                    <span className={["cg-admin__checkmark", item.completed ? "cg-admin__checkmark--done" : ""].filter(Boolean).join(" ")} aria-hidden="true">
                      {item.completed ? "✓" : "○"}
                    </span>
                    <div className="cg-admin__check-copy">
                      <strong>{item.title}</strong>
                      <span>Due: {item.dueDate}</span>
                      <p>{item.notes}</p>
                    </div>
                    <Button type="button" variant={item.completed ? "ghost" : "secondary"} size="sm" onClick={() => handleChecklistToggle(item.id, !item.completed)} disabled={!adminData}>
                      {item.completed ? "Reopen" : "Complete"}
                    </Button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="cg-admin__release-editors">
          <article className="cg-admin__panel cg-admin__release-note-card">
            <div className="cg-admin__file-head">
              <div>
                <h3>Public collector note</h3>
                <p>This note feeds the personalized collector letter on the public Walls/Devine Volume 1 hero.</p>
              </div>
              <p className="cg-admin__path-note">
                Firestore: {firebaseAdminPaths.adminProjectsCollection}/{firebaseAdminPaths.wallsDevineProjectId}/{firebaseAdminPaths.publicContentCollection}/{firebaseAdminPaths.collectorHeroNoteDocId}
              </p>
            </div>

            <form onSubmit={handleCollectorHeroNoteSave} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Hero eyebrow</span>
                  <input
                    name="eyebrow"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.eyebrow}
                    placeholder="Collector experience"
                    required
                  />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Hero title</span>
                  <input
                    name="title"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.title}
                    placeholder="Walls/Devine Volume 1"
                    required
                  />
                </label>
              </div>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Salutation</span>
                  <input
                    name="salutation"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.salutation}
                    placeholder="Dear Collector,"
                    required
                  />
                </label>
                <div className="cg-admin__stack">
                  <span className="cg-admin__editor-field-label">Last updated</span>
                  <p className="cg-admin__path-note">{new Date(adminViewData.collectorHeroNote.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <label className="cg-admin__editor-field">
                <span>Body copy</span>
                <textarea
                  name="body"
                  className="cg-admin__editor-textarea"
                  rows={6}
                  defaultValue={adminViewData.collectorHeroNote.body}
                  placeholder="Write the note that appears beside the collector signup."
                  required
                />
              </label>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Primary CTA label</span>
                  <input
                    name="primaryCtaLabel"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.primaryCtaLabel}
                    placeholder="Open Listening Room"
                    required
                  />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Secondary CTA label</span>
                  <input
                    name="secondaryCtaLabel"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.secondaryCtaLabel}
                    placeholder="Shop Volume 1 Merch"
                    required
                  />
                </label>
              </div>

              <label className="cg-admin__editor-field">
                <span>Mailing-list helper copy</span>
                <textarea
                  name="mailingListHelper"
                  className="cg-admin__editor-textarea"
                  rows={3}
                  defaultValue={adminViewData.collectorHeroNote.mailingListHelper}
                  placeholder="Request to be added for drop alerts and collector unlock notices."
                  required
                />
              </label>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Signature intro</span>
                  <input
                    name="signatureIntro"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.signatureIntro}
                    placeholder="With Love From the Room,"
                    required
                  />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Journal label</span>
                  <input
                    name="journalLabel"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.collectorHeroNote.journalLabel}
                    placeholder="From the journals"
                    required
                  />
                </label>
              </div>

              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="secondary" size="sm" disabled={saveStates[collectorHeroNoteSaveKey] === "saving"}>
                  Save note
                </Button>
                {saveStates[collectorHeroNoteSaveKey] === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                {saveStates[collectorHeroNoteSaveKey] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                {saveStates[collectorHeroNoteSaveKey] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this note.</p> : null}
              </div>
            </form>
          </article>

          <article className="cg-admin__panel cg-admin__release-note-card">
            <div className="cg-admin__file-head">
              <div>
                <h3>Public booking banner</h3>
                <p>This copy feeds the booking and merch banner beneath the collector grid on the public Walls/Devine page.</p>
              </div>
              <p className="cg-admin__path-note">
                Firestore: {firebaseAdminPaths.adminProjectsCollection}/{firebaseAdminPaths.wallsDevineProjectId}/{firebaseAdminPaths.publicContentCollection}/{firebaseAdminPaths.bookingBannerNoteDocId}
              </p>
            </div>

            <form onSubmit={handleBookingBannerNoteSave} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Eyebrow</span>
                  <input
                    name="eyebrow"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.bookingBannerNote.eyebrow}
                    placeholder="Live Booking + Merch"
                    required
                  />
                </label>
                <div className="cg-admin__stack">
                  <span className="cg-admin__editor-field-label">Last updated</span>
                  <p className="cg-admin__path-note">{new Date(adminViewData.bookingBannerNote.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <label className="cg-admin__editor-field">
                <span>Title</span>
                <input
                  name="title"
                  type="text"
                  className="cg-admin__editor-input"
                  defaultValue={adminViewData.bookingBannerNote.title}
                  placeholder="Book or shop Walls/Devine"
                  required
                />
              </label>

              <label className="cg-admin__editor-field">
                <span>Description</span>
                <textarea
                  name="description"
                  className="cg-admin__editor-textarea"
                  rows={4}
                  defaultValue={adminViewData.bookingBannerNote.description}
                  placeholder="Describe the booking, partnership, or merch invitation shown on the public page."
                  required
                />
              </label>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Primary CTA label</span>
                  <input
                    name="primaryCtaLabel"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.bookingBannerNote.primaryCtaLabel}
                    placeholder="Book Walls/Devine"
                    required
                  />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Secondary CTA label</span>
                  <input
                    name="secondaryCtaLabel"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.bookingBannerNote.secondaryCtaLabel}
                    placeholder="Visit Merch Shop"
                    required
                  />
                </label>
              </div>

              <label className="cg-admin__editor-field">
                <span>Meta line</span>
                <input
                  name="meta"
                  type="text"
                  className="cg-admin__editor-input"
                  defaultValue={adminViewData.bookingBannerNote.meta}
                  placeholder="Listening events · Performance · Partnerships · Fourthwall merch shop"
                  required
                />
              </label>

              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="secondary" size="sm" disabled={saveStates[bookingBannerNoteSaveKey] === "saving"}>
                  Save banner
                </Button>
                {saveStates[bookingBannerNoteSaveKey] === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                {saveStates[bookingBannerNoteSaveKey] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                {saveStates[bookingBannerNoteSaveKey] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this banner.</p> : null}
              </div>
            </form>
          </article>

          <article className="cg-admin__panel cg-admin__release-note-card">
            <div className="cg-admin__file-head">
              <div>
                <h3>Public upcoming shows</h3>
                <p>This feeds the upcoming-shows block beneath booking on the public Walls/Devine page.</p>
              </div>
              <p className="cg-admin__path-note">
                Firestore: {firebaseAdminPaths.adminProjectsCollection}/{firebaseAdminPaths.wallsDevineProjectId}/{firebaseAdminPaths.publicContentCollection}/{firebaseAdminPaths.upcomingShowsDocId}
              </p>
            </div>

            <form onSubmit={handleUpcomingShowsSave} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Eyebrow</span>
                  <input
                    name="eyebrow"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={adminViewData.upcomingShowsNote.eyebrow}
                    placeholder="Upcoming shows"
                    required
                  />
                </label>
                <div className="cg-admin__stack">
                  <span className="cg-admin__editor-field-label">Last updated</span>
                  <p className="cg-admin__path-note">{new Date(adminViewData.upcomingShowsNote.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <label className="cg-admin__editor-field">
                <span>Title</span>
                <input
                  name="title"
                  type="text"
                  className="cg-admin__editor-input"
                  defaultValue={adminViewData.upcomingShowsNote.title}
                  placeholder="Where Walls/Devine lands next"
                  required
                />
              </label>

              <label className="cg-admin__editor-field">
                <span>Description</span>
                <textarea
                  name="description"
                  className="cg-admin__editor-textarea"
                  rows={3}
                  defaultValue={adminViewData.upcomingShowsNote.description}
                  placeholder="Optional intro line above the show list."
                  required
                />
              </label>

              <label className="cg-admin__editor-field">
                <span>Empty-state message</span>
                <input
                  name="emptyState"
                  type="text"
                  className="cg-admin__editor-input"
                  defaultValue={adminViewData.upcomingShowsNote.emptyState}
                  placeholder="No public dates are posted right now."
                  required
                />
              </label>

              <label className="cg-admin__editor-field">
                <span>Shows manifest (one per line)</span>
                <textarea
                  name="showsManifest"
                  className="cg-admin__editor-textarea"
                  rows={6}
                  defaultValue={formatUpcomingShowsForEditor(adminViewData.upcomingShowsNote.shows)}
                  placeholder="Aug 15, 2026 | Atlanta, GA | Terminal West | On sale | https://tickets.example.com"
                />
              </label>

              <p className="cg-admin__helper">Format: Date | City, ST | Venue | Status | URL. Status and URL are optional.</p>

              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="secondary" size="sm" disabled={saveStates[upcomingShowsSaveKey] === "saving"}>
                  Save upcoming shows
                </Button>
                {saveStates[upcomingShowsSaveKey] === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                {saveStates[upcomingShowsSaveKey] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                {saveStates[upcomingShowsSaveKey] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save upcoming shows.</p> : null}
              </div>
            </form>
          </article>

          <AdminLinkHubEditor
            value={adminViewData.linkHub}
            saveState={saveStates[linkHubSaveKey]}
            firestorePath={`${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.publicContentCollection}/${firebaseAdminPaths.linkHubDocId}`}
            onSave={handleLinkHubSave}
          />
        </div>
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-booking-engine"
        labelId="admin-booking-engine-title"
        title="Booking engine"
        description="Availability windows, seeded targets, and booking-fit leads in one operating view."
        detail={`Project doc: ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}.${firebaseAdminPaths.bookingBoardField} + ${firebaseAdminPaths.ecosystemLeadsCollection}`}
        isVisible={isSectionReady("admin-booking-engine")}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
            {leadsLoading || visitsLoading ? "Refreshing booking signals…" : "Refresh booking signals"}
          </Button>
        }
        isOpen={openSections["admin-booking-engine"]}
        onToggle={() => toggleWorkspaceSection("admin-booking-engine")}
      >
        {leadsError ? <p className="cg-admin__error">{leadsError}</p> : null}
        <AdminBookingEngine
          board={adminViewData.bookingBoard}
          leads={ecosystemLeads}
          canSave={Boolean(adminData)}
          targetSaveStates={bookingTargetSaveStates}
          onTargetSave={handleBookingTargetSave}
        />
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-assets"
        labelId="admin-assets-title"
        title="Assets & QA"
        description="Server-inspected technical metadata for the live release WAVs in the Volume 1 folder."
        detail="Source: public/walls-devine/releases/volume1"
        isVisible={isSectionReady("admin-assets")}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleAudioRefresh} disabled={audioLoading}>
            {audioLoading ? "Refreshing assets…" : "Refresh analysis"}
          </Button>
        }
        isOpen={openSections["admin-assets"]}
        onToggle={() => toggleWorkspaceSection("admin-assets")}
      >
        {audioError ? <p className="cg-admin__error">{audioError}</p> : null}
        {audioLoading && !audioAnalysis.length ? <p className="cg-admin__helper">Inspecting release WAVs…</p> : null}

        {audioAnalysis.length ? (
          <div className="cg-admin__audio-grid">
            {audioAnalysis.map((analysis) => (
              <article key={analysis.fileName} className="cg-admin__panel cg-admin__audio-card">
                <div className="cg-admin__audio-head">
                  <div>
                    <h3>{analysis.title ?? analysis.fileName.replace(/\.wav$/i, "")}</h3>
                    <p>{analysis.relativePath}</p>
                  </div>
                  <span className={[
                    "cg-admin__status-badge",
                    analysis.error ? "cg-admin__status-badge--pending" : "cg-admin__status-badge--ready"
                  ].join(" ")}>{analysis.error ? "Parse issue" : "Analyzed"}</span>
                </div>

                {analysis.error ? <p className="cg-admin__error">{analysis.error}</p> : null}

                <dl className="cg-admin__audio-metrics">
                  <div>
                    <dt>Duration</dt>
                    <dd>{analysis.durationLabel}</dd>
                  </div>
                  <div>
                    <dt>Sample rate</dt>
                    <dd>{formatAudioSampleRate(analysis.sampleRate)}</dd>
                  </div>
                  <div>
                    <dt>Channels</dt>
                    <dd>{formatAudioChannels(analysis.channels)}</dd>
                  </div>
                  <div>
                    <dt>Bit depth</dt>
                    <dd>{formatAudioBitDepth(analysis.bitDepth)}</dd>
                  </div>
                  <div>
                    <dt>Bitrate</dt>
                    <dd>{formatAudioBitrate(analysis.bitrateKbps)}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{formatAudioFormat(analysis)}</dd>
                  </div>
                  <div>
                    <dt>Lossless</dt>
                    <dd>{formatAudioLossless(analysis.lossless)}</dd>
                  </div>
                  <div>
                    <dt>File size</dt>
                    <dd>{analysis.fileSizeLabel}</dd>
                  </div>
                </dl>

                <dl className="cg-admin__audio-tags">
                  <div>
                    <dt>Embedded title</dt>
                    <dd>{analysis.title ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Artist</dt>
                    <dd>{analysis.artist ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Album artist</dt>
                    <dd>{analysis.albumArtist ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Album</dt>
                    <dd>{analysis.album ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Track</dt>
                    <dd>{formatAudioTrackNumber(analysis.trackNumber)}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{analysis.year ?? "—"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          !audioLoading ? <p className="cg-admin__helper">No WAV analysis has been loaded yet. Refresh assets when the release folder is ready.</p> : null
        )}
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-instagram-posts"
        labelId="admin-instagram-posts-title"
        title="Draft studio"
        description="Create, rename, update, and delete release-copy drafts without touching repo files."
        detail={`Firestore path: ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/instagram-posts--{slug}`}
        isVisible={isSectionReady("admin-instagram-posts")}
        isOpen={openSections["admin-instagram-posts"]}
        onToggle={() => toggleWorkspaceSection("admin-instagram-posts")}
      >
        <div className="cg-admin__file-grid">
          <article className="cg-admin__panel cg-admin__file-card cg-admin__file-card--create">
            <div className="cg-admin__file-head">
              <div>
                <h3>New Instagram draft</h3>
                <p>Create a new live markdown file. Leave the slug blank to derive it from the title.</p>
              </div>
            </div>
            <form onSubmit={(event) => handleMarkdownCreate(event, "instagram-posts")} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Title</span>
                  <input name="title" type="text" className="cg-admin__editor-input" placeholder="Space Cruiser instrumental" required />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Slug</span>
                  <input name="slug" type="text" className="cg-admin__editor-input" placeholder="space-cruiser-instrumental" spellCheck={false} />
                </label>
              </div>
              <label className="cg-admin__editor-field">
                <span>Initial markdown</span>
                <textarea
                  name="content"
                  className="cg-admin__editor-textarea"
                  rows={10}
                  spellCheck={false}
                  placeholder="# Space Cruiser instrumental&#10;&#10;Start writing the post here."
                />
              </label>
              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="secondary" size="sm" disabled={!hasLiveMarkdownContent || saveStates[getCreateNoticeKey("instagram-posts")] === "saving"}>
                  Create draft
                </Button>
                {saveStates[getCreateNoticeKey("instagram-posts")] === "saving" ? <p className="cg-admin__save-note">Creating…</p> : null}
                {saveStates[getCreateNoticeKey("instagram-posts")] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Created.</p> : null}
                {saveStates[getCreateNoticeKey("instagram-posts")] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not create this draft.</p> : null}
                {!hasLiveMarkdownContent ? <p className="cg-admin__save-note">Live Firebase markdown content must be ready before drafts can be changed.</p> : null}
              </div>
            </form>
          </article>

          {adminViewData.instagramDrafts.map((draft) => {
            const saveKey = getSaveNoticeKey("instagram-posts", draft.slug);
            const saveState = saveStates[saveKey];
            const isBusy = saveState === "saving" || saveState === "deleting";

            return (
              <article key={draft.slug} className="cg-admin__panel cg-admin__file-card">
                <div className="cg-admin__file-head">
                  <div>
                    <h3>{draft.title}</h3>
                    <p>{draft.filePath}</p>
                  </div>
                </div>
                <p>{draft.preview}</p>
                <form onSubmit={(event) => handleMarkdownSave(event, "instagram-posts", draft.slug)} className="cg-admin__editor-form">
                  <div className="cg-admin__editor-split">
                    <label className="cg-admin__editor-field">
                      <span>Slug</span>
                      <input name="slug" type="text" defaultValue={draft.slug} className="cg-admin__editor-input" spellCheck={false} disabled={!hasLiveMarkdownContent || isBusy} />
                    </label>
                  </div>
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={draft.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} disabled={!hasLiveMarkdownContent || isBusy} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm" disabled={!hasLiveMarkdownContent || isBusy}>
                      Save draft
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleMarkdownDelete("instagram-posts", draft.slug)} disabled={!hasLiveMarkdownContent || isBusy}>
                      Delete
                    </Button>
                    {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                    {saveState === "deleting" ? <p className="cg-admin__save-note">Deleting…</p> : null}
                    {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                    {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this draft.</p> : null}
                  </div>
                </form>
              </article>
            );
          })}

          {!adminViewData.instagramDrafts.length ? (
            <article className="cg-admin__panel cg-admin__file-card cg-admin__file-card--empty">
              <h3>No Instagram drafts loaded yet</h3>
              <p>{isScaffoldMode ? "You are seeing the content-studio scaffold while live Firebase data reconnects." : "Drafts will appear here once the live Firestore markdown collection is available."}</p>
            </article>
          ) : null}
        </div>
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-journals"
        labelId="admin-journals-title"
        title="Journal studio"
        description="Write, publish, and prune the public-facing song journals from the live Firebase layer."
        detail={`Firestore path: ${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/journals--{slug}`}
        isVisible={isSectionReady("admin-journals")}
        isOpen={openSections["admin-journals"]}
        onToggle={() => toggleWorkspaceSection("admin-journals")}
      >
        <div className="cg-admin__file-grid">
          <article className="cg-admin__panel cg-admin__file-card cg-admin__file-card--create">
            <div className="cg-admin__file-head">
              <div>
                <h3>New journal entry</h3>
                <p>Create a new public-facing journal file. Leave the slug blank to derive it from the title.</p>
              </div>
            </div>
            <form onSubmit={(event) => handleMarkdownCreate(event, "journals")} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Title</span>
                  <input name="title" type="text" className="cg-admin__editor-input" placeholder="Gratitude - Studio Journal" required />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Slug</span>
                  <input name="slug" type="text" className="cg-admin__editor-input" placeholder="gratitude" spellCheck={false} />
                </label>
              </div>
              <label className="cg-admin__editor-field">
                <span>Initial markdown</span>
                <textarea
                  name="content"
                  className="cg-admin__editor-textarea"
                  rows={10}
                  spellCheck={false}
                  placeholder="# Gratitude - Studio Journal&#10;&#10;Start writing the journal here."
                />
              </label>
              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="secondary" size="sm" disabled={!hasLiveMarkdownContent || saveStates[getCreateNoticeKey("journals")] === "saving"}>
                  Create journal
                </Button>
                {saveStates[getCreateNoticeKey("journals")] === "saving" ? <p className="cg-admin__save-note">Creating…</p> : null}
                {saveStates[getCreateNoticeKey("journals")] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Created.</p> : null}
                {saveStates[getCreateNoticeKey("journals")] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not create this journal.</p> : null}
                {!hasLiveMarkdownContent ? <p className="cg-admin__save-note">Live Firebase markdown content must be ready before journals can be changed.</p> : null}
              </div>
            </form>
          </article>

          {adminViewData.journalEntries.map((entry) => {
            const saveKey = getSaveNoticeKey("journals", entry.slug);
            const saveState = saveStates[saveKey];
            const isBusy = saveState === "saving" || saveState === "deleting";

            return (
              <article key={entry.slug} className="cg-admin__panel cg-admin__file-card">
                <h3>{entry.title}</h3>
                <p>{entry.filePath}</p>
                <p>{entry.preview}</p>
                <form onSubmit={(event) => handleMarkdownSave(event, "journals", entry.slug)} className="cg-admin__editor-form">
                  <div className="cg-admin__editor-split">
                    <label className="cg-admin__editor-field">
                      <span>Slug</span>
                      <input name="slug" type="text" defaultValue={entry.slug} className="cg-admin__editor-input" spellCheck={false} disabled={!hasLiveMarkdownContent || isBusy} />
                    </label>
                  </div>
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={entry.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} disabled={!hasLiveMarkdownContent || isBusy} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm" disabled={!hasLiveMarkdownContent || isBusy}>
                      Save journal
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleMarkdownDelete("journals", entry.slug)} disabled={!hasLiveMarkdownContent || isBusy}>
                      Delete
                    </Button>
                    {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                    {saveState === "deleting" ? <p className="cg-admin__save-note">Deleting…</p> : null}
                    {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                    {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this journal.</p> : null}
                  </div>
                </form>
              </article>
            );
          })}

          {!adminViewData.journalEntries.length ? (
            <article className="cg-admin__panel cg-admin__file-card cg-admin__file-card--empty">
              <h3>No journals loaded yet</h3>
              <p>{isScaffoldMode ? "The journal editor is scaffolded and ready once the live content layer reconnects." : "Journal entries will appear here once the Firestore markdown collection is available."}</p>
            </article>
          ) : null}
        </div>
      </AdminWorkspaceSection>

        </>
      ) : null}

      {activeWorkspaceTab === "agency" ? (
        <>
      <AdminWorkspaceSection
        id="admin-analytics"
        labelId="admin-analytics-title"
        title="Agency signal desk"
        description="Lead generation, guided intake, Bong Tour context, and Walls/Devine listening traffic in one operational view."
        detail={`Firestore: ${firebaseAdminPaths.ecosystemLeadsCollection} + ${firebaseAdminPaths.listeningRoomVisitsCollection}`}
        isVisible={isSectionReady("admin-analytics")}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
            {leadsLoading || visitsLoading ? "Refreshing signals…" : "Refresh signals"}
          </Button>
        }
        isOpen={openSections["admin-analytics"]}
        onToggle={() => toggleWorkspaceSection("admin-analytics")}
      >
        {leadsError ? <p className="cg-admin__error">{leadsError}</p> : null}
        {visitsError ? <p className="cg-admin__error">{visitsError}</p> : null}

        <div className="cg-admin__grid--summary cg-admin__agency-summary-grid">
          <article className="cg-admin__panel">
            <h3>Program mix</h3>
            {leadProgramMix.length ? (
              <ul className="cg-admin__list">
                {leadProgramMix.map(([label, count]) => (
                  <li key={label}>
                    <strong>{label}</strong>
                    <span>{count} lead{count === 1 ? "" : "s"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cg-admin__helper">Program segmentation will appear once lead traffic lands.</p>
            )}
          </article>

          <article className="cg-admin__panel">
            <h3>Top contexts</h3>
            {leadContextMix.length ? (
              <ul className="cg-admin__list">
                {leadContextMix.map(([label, count]) => (
                  <li key={label}>
                    <strong>{label}</strong>
                    <span>{count} signal{count === 1 ? "" : "s"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cg-admin__helper">Lead context mix will appear here once guided intake starts stacking.</p>
            )}
          </article>

          <article className="cg-admin__panel">
            <h3>Priority signals</h3>
            <ul className="cg-admin__list">
              <li>
                <strong>Booking-fit leads</strong>
                <span>{bookingLeadMatches.length}</span>
              </li>
              <li>
                <strong>Bong Tour signals</strong>
                <span>{leadProgramMix.find(([label]) => label === "Bong Tour")?.[1] ?? 0}</span>
              </li>
              <li>
                <strong>Listening-room visits</strong>
                <span>{listeningRoomVisits.length}</span>
              </li>
            </ul>
          </article>
        </div>

        <div className="cg-admin__analytics-grid">
          <div className="cg-admin__stack">
            <div className="cg-admin__subsection-head">
              <div>
                <h3>Generated leads</h3>
                <p>Collector captures and guided-intake leads across Walls/Devine, Bong Tour, and broader CGU requests.</p>
              </div>
              <p className="cg-admin__path-note">Firestore: {firebaseAdminPaths.ecosystemLeadsCollection}</p>
            </div>

            {leadsLoading && !ecosystemLeads.length ? <p className="cg-admin__helper">Loading lead backlog…</p> : null}

            <div className="cg-admin__lead-grid">
              <article className="cg-admin__panel">
                <h3>Source mix</h3>
                {leadSources.length ? (
                  <ul className="cg-admin__list">
                    {leadSources.map(([source, count]) => (
                      <li key={source}>
                        <strong>{formatLeadSource(source)}</strong>
                        <span>{count} lead{count === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">Lead sources will appear once the public intake surfaces start writing.</p>
                )}
              </article>

              <article className="cg-admin__panel">
                <h3>Recent leads</h3>
                {ecosystemLeads.length ? (
                  <ul className="cg-admin__lead-list">
                    {ecosystemLeads.map((lead) => (
                      <li key={lead.id} className="cg-admin__lead-item">
                        <div>
                          <strong>{lead.fullName || lead.email}</strong>
                          <span>{lead.email}</span>
                        </div>
                        <div className="cg-admin__lead-meta">
                          <span>{formatLeadProgramSummary(getLeadProgramLabel(lead), 1)}</span>
                          <span>{getLeadPrimaryContext(lead)}</span>
                          <span>{formatLeadSource(lead.source)}</span>
                          <span>{new Date(lead.createdAt).toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">Generated leads will appear here once site and intake traffic lands.</p>
                )}
              </article>
            </div>
          </div>

          <div className="cg-admin__stack">
            <div className="cg-admin__subsection-head">
              <div>
                <h3>Walls/Devine listening room traffic</h3>
                <p>Shared song-link arrivals stay visible here so program-wide lead triage can still see release-world activity.</p>
              </div>
              <p className="cg-admin__path-note">Firestore: {firebaseAdminPaths.listeningRoomVisitsCollection}</p>
            </div>

            {visitsLoading && !listeningRoomVisits.length ? <p className="cg-admin__helper">Loading listening-room visits…</p> : null}

            <div className="cg-admin__lead-grid">
              <article className="cg-admin__panel">
                <h3>Song mix</h3>
                {visitSongs.length ? (
                  <ul className="cg-admin__list">
                    {visitSongs.map(([songTitle, count]) => (
                      <li key={songTitle}>
                        <strong>{songTitle}</strong>
                        <span>{count} visit{count === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">Shared song-link traffic will appear here once those URLs start circulating.</p>
                )}
              </article>

              <article className="cg-admin__panel">
                <h3>Recent arrivals</h3>
                {listeningRoomVisits.length ? (
                  <ul className="cg-admin__lead-list">
                    {listeningRoomVisits.map((visit) => (
                      <li key={visit.id} className="cg-admin__lead-item">
                        <div>
                          <strong>{visit.songTitle}</strong>
                          <span>{visit.songSlug}</span>
                        </div>
                        <div className="cg-admin__lead-meta">
                          <span>{formatListeningRoomQueryKey(visit.queryKey)}</span>
                          <span>{visit.pagePath}</span>
                          <span>{visit.referrer || "Direct / unknown referrer"}</span>
                          <span>{new Date(visit.createdAt).toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">No shared listening-room arrivals have been tracked yet.</p>
                )}
              </article>
            </div>
          </div>
        </div>
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-health"
        labelId="admin-health-title"
        title="Backend health"
        description="Firebase auth, live content source, and migration readiness for the admin layer."
        detail={`Content source: ${contentSource === "pending" ? "waiting on Firebase" : contentSource}`}
        isVisible={isSectionReady("admin-health")}
        isOpen={openSections["admin-health"]}
        onToggle={() => toggleWorkspaceSection("admin-health")}
      >
        <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized notice={panelError || undefined} />
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-ideas"
        labelId="admin-ideas-title"
        title="Ideas"
        description="App concepts, ecosystem ideas, and scripts to weigh. A running catalogue of what could be built next."
        detail={`${ideaCatalogue.length} idea${ideaCatalogue.length === 1 ? "" : "s"} logged`}
        isOpen={openSections["admin-ideas"]}
        onToggle={() => toggleWorkspaceSection("admin-ideas")}
      >
        <div className="cg-admin__ideas-grid">
          {ideaCatalogue.map((idea) => (
            <article key={idea.id} className="cg-admin__panel cg-admin__idea-card">
              <div className="cg-admin__idea-head">
                <div>
                  <h3>{idea.name}</h3>
                  <div className="cg-admin__idea-badges">
                    <span className="cg-admin__idea-badge cg-admin__idea-badge--type">{idea.type}</span>
                    <span className={`cg-admin__idea-badge cg-admin__idea-badge--status cg-admin__idea-badge--${idea.status}`}>{idea.status}</span>
                  </div>
                </div>
              </div>
              <p className="cg-admin__idea-description">{idea.description}</p>
              {idea.notes ? (
                <div className="cg-admin__idea-notes">
                  <span className="cg-admin__editor-field-label">Design notes</span>
                  <p>{idea.notes}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </AdminWorkspaceSection>

        </>
      ) : null}

          {backlogDashboardModules.length ? (
            <article id={activeBacklogId} className="cg-admin__panel cg-admin__backlog-panel">
              <div className="cg-admin__backlog-head">
                <div>
                  <h2>Backlog</h2>
                  <p>Hidden from the active workspace until each surface is fully live. Nothing here has been removed from code.</p>
                </div>
                <p className="cg-admin__path-note">{backlogDashboardModules.length} parked for later</p>
              </div>

              <div className="cg-admin__backlog-list">
                {backlogDashboardModules.map((module) => (
                  <article key={module.id} className="cg-admin__backlog-item">
                    <div className="cg-admin__module-head">
                      <h3>{module.title}</h3>
                      <span className="cg-admin__status-badge cg-admin__status-badge--pending">Backlog</span>
                    </div>
                    <strong className="cg-admin__module-stat">{module.summary}</strong>
                    <p>{module.detail}</p>
                  </article>
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default AdminConsole;