"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState, useTransition } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import type { AdminAudioAnalysis, AdminMarkdownCollection, EcosystemLead, LinkHubContent, ListeningRoomVisit, ReleasePlanChecklistItem, WallsDevineAdminData } from "@/lib/admin/types";
import {
  deleteFirebaseAdminMarkdownFile,
  getAdminUserProfile,
  getFirebaseWallsDevineAdminData,
  isActiveAdminProfile,
  removeAdminMarkdownFile,
  renameFirebaseAdminMarkdownFile,
  replaceAdminMarkdownFile,
  seedFirebaseWallsDevineAdminData,
  updateFirebaseAdminMarkdownFile,
  updateFirebaseCollectorHeroNote,
  updateFirebaseLinkHub,
  updateFirebaseReleasePlanItem,
  type AdminUserProfile
} from "@/lib/firebase/admin-content";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { getEcosystemLeads } from "@/lib/firebase/ecosystem-leads";
import { getListeningRoomVisits } from "@/lib/firebase/listening-room-visits";
import { defaultLinkHubContent } from "@/lib/link-hub/content";
import { defaultWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

import { AdminLinkHubEditor } from "./AdminLinkHubEditor";
import { AdminFirebaseStatus } from "./AdminFirebaseStatus";

type SaveState = "saving" | "deleting" | "success" | "error";
type ContentSource = "pending" | "firebase" | "bootstrap";

const collectorHeroNoteSaveKey = "collectorHeroNote";
const linkHubSaveKey = "linkHub";

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

type AdminWorkspaceSectionId = "admin-release-desk" | "admin-journals" | "admin-instagram-posts" | "admin-analytics" | "admin-assets" | "admin-health";

type DashboardModule = {
  id: AdminWorkspaceSectionId;
  title: string;
  summary: string;
  detail: string;
  actionLabel: string;
  status: "ready" | "pending";
};

type AdminJumpLink = {
  id: AdminWorkspaceSectionId;
  label: string;
  detail: string;
};

type AdminWorkspaceSectionProps = {
  id: AdminWorkspaceSectionId;
  labelId: string;
  title: string;
  description: string;
  detail?: string;
  actions?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const defaultOpenSections: Record<AdminWorkspaceSectionId, boolean> = {
  "admin-release-desk": true,
  "admin-journals": true,
  "admin-instagram-posts": false,
  "admin-analytics": false,
  "admin-assets": false,
  "admin-health": false
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
  isOpen,
  onToggle,
  children
}: AdminWorkspaceSectionProps) {
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

      {isOpen ? <div id={`${id}-body`} className="cg-admin__workspace-section-body">{children}</div> : <p className="cg-admin__helper">Collapsed. Use the jump rail above to reopen this workspace.</p>}
    </SectionShell>
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
  instagramDrafts: [],
  journalEntries: [],
  collectorHeroNote: defaultWallsDevineCollectorHeroNote,
  linkHub: defaultLinkHubContent,
  storageBacked: false,
  contentBackend: "bootstrap",
  markdownInitialized: false
};

function countCompletedChecklist(items: ReleasePlanChecklistItem[]) {
  return items.filter((item) => item.completed).length;
}

function buildDashboardModules({
  completedChecklist,
  adminData,
  isScaffoldMode,
  hasLiveMarkdownContent,
  leadsCount,
  hasLeadsError,
  leadSources,
  visitsCount,
  topVisitSong,
  audioCount,
  hasAudioError,
  hasVisitsError
}: {
  completedChecklist: number;
  adminData: WallsDevineAdminData;
  isScaffoldMode: boolean;
  hasLiveMarkdownContent: boolean;
  leadsCount: number;
  hasLeadsError: boolean;
  leadSources: Array<[string, number]>;
  visitsCount: number;
  topVisitSong: string | null;
  audioCount: number;
  hasAudioError: boolean;
  hasVisitsError: boolean;
}) {
  const topLeadSource = leadSources[0]?.[0];

  return [
    {
      id: "admin-release-desk",
      title: "Release desk",
      summary: `${completedChecklist}/${adminData.plan.checklist.length} tasks complete`,
      detail: isScaffoldMode ? "Scaffold mode is holding the release desk visible while live content reconnects." : `Last release update ${new Date(adminData.plan.updatedAt).toLocaleString()}.`,
      actionLabel: "Open release desk",
      status: isScaffoldMode ? "pending" : "ready"
    },
    {
      id: "admin-journals",
      title: "Journal studio",
      summary: `${adminData.journalEntries.length} journal${adminData.journalEntries.length === 1 ? "" : "s"}`,
      detail: hasLiveMarkdownContent ? "Write, rename, publish, and prune song journals from one place." : "Waiting on Firestore markdown sync before journal CRUD is live.",
      actionLabel: "Open journals",
      status: hasLiveMarkdownContent ? "ready" : "pending"
    },
    {
      id: "admin-instagram-posts",
      title: "Draft studio",
      summary: `${adminData.instagramDrafts.length} draft${adminData.instagramDrafts.length === 1 ? "" : "s"}`,
      detail: hasLiveMarkdownContent ? "Keep release copy editable without touching repo files." : "Draft CRUD will unlock once the markdown collection finishes hydrating.",
      actionLabel: "Open drafts",
      status: hasLiveMarkdownContent ? "ready" : "pending"
    },
    {
      id: "admin-analytics",
      title: "Analytics",
      summary: `${leadsCount} leads · ${visitsCount} visits`,
      detail:
        hasLeadsError || hasVisitsError
          ? "One or more analytics collections need a refresh."
          : topLeadSource
            ? `Top lead source: ${formatLeadSource(topLeadSource)}.`
            : topVisitSong
              ? `Top listening-room arrival: ${topVisitSong}.`
              : "Collector and listening-room activity will land here.",
      actionLabel: "Open analytics",
      status: hasLeadsError || hasVisitsError ? "pending" : "ready"
    },
    {
      id: "admin-assets",
      title: "Assets & QA",
      summary: `${audioCount} WAV file${audioCount === 1 ? "" : "s"} inspected`,
      detail: hasAudioError ? "Audio inspection reported an issue. Use refresh to retry." : audioCount ? "Server-side file inspection is returning metadata." : "Run refresh to inspect the live release WAVs.",
      actionLabel: "Open assets",
      status: hasAudioError ? "pending" : "ready"
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
        leadsCount: ecosystemLeads.length,
        hasLeadsError: Boolean(leadsError),
        leadSources,
        visitsCount: listeningRoomVisits.length,
        topVisitSong: visitSongs[0]?.[0] ?? null,
        audioCount: audioAnalysis.length,
        hasAudioError: Boolean(audioError),
        hasVisitsError: Boolean(visitsError)
      }),
    [
      completedChecklist,
      adminViewData,
      isScaffoldMode,
      hasLiveMarkdownContent,
      ecosystemLeads.length,
      leadsError,
      leadSources,
      listeningRoomVisits.length,
      visitSongs,
      audioAnalysis.length,
      audioError,
      visitsError,
      panelError
    ]
  );
  const jumpLinks = useMemo(
    () => [
      {
        id: "admin-release-desk",
        label: "Release desk",
        detail: `${completedChecklist}/${adminViewData.plan.checklist.length} complete`
      },
      {
        id: "admin-journals",
        label: "Journals",
        detail: `${adminViewData.journalEntries.length} live`
      },
      {
        id: "admin-instagram-posts",
        label: "Drafts",
        detail: `${adminViewData.instagramDrafts.length} live`
      },
      {
        id: "admin-analytics",
        label: "Analytics",
        detail: `${ecosystemLeads.length} leads · ${listeningRoomVisits.length} visits`
      },
      {
        id: "admin-assets",
        label: "Assets",
        detail: `${audioAnalysis.length} WAV${audioAnalysis.length === 1 ? "" : "s"}`
      },
      {
        id: "admin-health",
        label: "Health",
        detail: panelError ? "Needs attention" : contentSource === "bootstrap" ? "Fallback mode" : "Backend ready"
      }
    ] satisfies AdminJumpLink[],
    [
      audioAnalysis.length,
      adminViewData.instagramDrafts.length,
      adminViewData.journalEntries.length,
      adminViewData.plan.checklist.length,
      completedChecklist,
      contentSource,
      ecosystemLeads.length,
      listeningRoomVisits.length,
      panelError
    ]
  );
  const isResolvingAuthorizedSession = Boolean(authUser) && dataLoading && !isAuthorized && !panelError;
  const isRefreshingAuthorizedAdmin = Boolean(authUser) && isAuthorized && dataLoading;

  function setWorkspaceSectionOpen(sectionId: AdminWorkspaceSectionId, nextOpen: boolean) {
    setOpenSections((current) => (current[sectionId] === nextOpen ? current : { ...current, [sectionId]: nextOpen }));
  }

  function toggleWorkspaceSection(sectionId: AdminWorkspaceSectionId) {
    setOpenSections((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  }

  function scrollToWorkspaceSection(sectionId: AdminWorkspaceSectionId, behavior: ScrollBehavior = "smooth") {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior, block: "start" });
      });
    });
  }

  function handleJumpToSection(sectionId: AdminWorkspaceSectionId) {
    setWorkspaceSectionOpen(sectionId, true);
    window.history.replaceState(null, "", `#${sectionId}`);
    scrollToWorkspaceSection(sectionId);
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
        nextData.markdownInitialized === false;

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

    const sectionId = window.location.hash.replace(/^#/, "");

    if (!isWorkspaceSectionId(sectionId)) {
      return;
    }

    setWorkspaceSectionOpen(sectionId, true);
    scrollToWorkspaceSection(sectionId, "auto");
  }, [isAuthorized]);

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

  async function handleCollectorHeroNoteSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminData) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const salutation = String(formData.get("salutation") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!salutation || !body) {
      setPanelError("The collector note needs both a salutation and body copy before it can be saved.");
      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "error" }));
      return;
    }

    setPanelError("");
    setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "saving" }));

    try {
      const nextNote = await updateFirebaseCollectorHeroNote({ salutation, body });

      startTransition(() => {
        setAdminData((current) => (current ? { ...current, collectorHeroNote: nextNote } : current));
      });

      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "success" }));
    } catch (error) {
      setSaveStates((current) => ({ ...current, [collectorHeroNoteSaveKey]: "error" }));
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
            title="Walls/Devine control room"
            description={isScaffoldMode ? "Control-room scaffold for releases, journals, analytics, and asset QA while live backend content reconnects." : "Operational workspace for release management, journal publishing, analytics, and asset QA."}
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

        <div className="cg-admin__command-deck">
          <div className="cg-admin__quick-actions">
            <Button type="button" onClick={() => handleJumpToSection("admin-journals")}>Write new journal</Button>
            <Button type="button" variant="secondary" onClick={() => handleJumpToSection("admin-release-desk")}>Open release desk</Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
              {leadsLoading || visitsLoading ? "Refreshing analytics…" : "Refresh analytics"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleAudioRefresh} disabled={audioLoading}>
              {audioLoading ? "Refreshing assets…" : "Refresh assets"}
            </Button>
            {!hasLiveMarkdownContent ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleRetryAccess} disabled={dataLoading}>
                {dataLoading ? "Syncing…" : "Retry content sync"}
              </Button>
            ) : null}
          </div>

          <div className="cg-admin__module-grid cg-admin__module-grid--ops">
            {dashboardModules.map((module) => (
              <article key={module.id} className="cg-admin__panel cg-admin__module-card">
                <div className="cg-admin__module-head">
                  <h2>{module.title}</h2>
                  <span className={["cg-admin__status-badge", module.status === "ready" ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending"].join(" ")}>
                    {module.status === "ready" ? "Ready" : "Pending"}
                  </span>
                </div>
                <strong className="cg-admin__module-stat">{module.summary}</strong>
                <p>{module.detail}</p>
                <div className="cg-admin__module-actions">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToSection(module.id)}>
                    {module.actionLabel}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <nav className="cg-admin__jump-bar" aria-label="Admin workspace sections">
            {jumpLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={["cg-admin__jump-chip", openSections[link.id] ? "cg-admin__jump-chip--active" : ""].filter(Boolean).join(" ")}
                onClick={() => handleJumpToSection(link.id)}
              >
                <strong>{link.label}</strong>
                <span>{link.detail}</span>
              </button>
            ))}
          </nav>
        </div>
      </SectionShell>

      <AdminWorkspaceSection
        id="admin-release-desk"
        labelId="admin-release-desk-title"
        title="Release desk"
        description={adminViewData.plan.summary}
        detail={`Updated ${new Date(adminViewData.plan.updatedAt).toLocaleString()}`}
        isOpen={openSections["admin-release-desk"]}
        onToggle={() => toggleWorkspaceSection("admin-release-desk")}
      >
        <div className="cg-admin__release-grid">
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
            <h3>Campaign calendar</h3>
            <div className="cg-admin__calendar">
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

        <AdminLinkHubEditor
          value={adminViewData.linkHub}
          saveState={saveStates[linkHubSaveKey]}
          firestorePath={`${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.publicContentCollection}/${firebaseAdminPaths.linkHubDocId}`}
          onSave={handleLinkHubSave}
        />

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
      </AdminWorkspaceSection>

      <AdminWorkspaceSection
        id="admin-analytics"
        labelId="admin-analytics-title"
        title="Audience & listening analytics"
        description="Collector signups and shared listening-room traffic in one working view."
        detail={`Firestore: ${firebaseAdminPaths.ecosystemLeadsCollection} + ${firebaseAdminPaths.listeningRoomVisitsCollection}`}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleAnalyticsRefresh} disabled={leadsLoading || visitsLoading}>
            {leadsLoading || visitsLoading ? "Refreshing analytics…" : "Refresh analytics"}
          </Button>
        }
        isOpen={openSections["admin-analytics"]}
        onToggle={() => toggleWorkspaceSection("admin-analytics")}
      >
        {leadsError ? <p className="cg-admin__error">{leadsError}</p> : null}
        {visitsError ? <p className="cg-admin__error">{visitsError}</p> : null}

        <div className="cg-admin__analytics-grid">
          <div className="cg-admin__stack">
            <div className="cg-admin__subsection-head">
              <div>
                <h3>Collector leads</h3>
                <p>Recent email captures from the Walls/Devine hero and collector-grid takeover rooms.</p>
              </div>
              <p className="cg-admin__path-note">Firestore: {firebaseAdminPaths.ecosystemLeadsCollection}</p>
            </div>

            {leadsLoading && !ecosystemLeads.length ? <p className="cg-admin__helper">Loading collector leads…</p> : null}

            <div className="cg-admin__lead-grid">
              <article className="cg-admin__panel">
                <h3>Source mix</h3>
                {leadSources.length ? (
                  <ul className="cg-admin__list">
                    {leadSources.map(([source, count]) => (
                      <li key={source}>
                        <strong>{formatLeadSource(source)}</strong>
                        <span>{count} capture{count === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">No collector leads have landed yet.</p>
                )}
              </article>

              <article className="cg-admin__panel">
                <h3>Recent signups</h3>
                {ecosystemLeads.length ? (
                  <ul className="cg-admin__lead-list">
                    {ecosystemLeads.map((lead) => (
                      <li key={lead.id} className="cg-admin__lead-item">
                        <div>
                          <strong>{lead.email}</strong>
                          <span>{lead.fullName || "Name not provided"}</span>
                        </div>
                        <div className="cg-admin__lead-meta">
                          <span>{formatLeadSource(lead.source)}</span>
                          <span>{lead.interest}</span>
                          <span>{new Date(lead.createdAt).toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-admin__helper">Collector signups will appear here once the public CTA is live.</p>
                )}
              </article>
            </div>
          </div>

          <div className="cg-admin__stack">
            <div className="cg-admin__subsection-head">
              <div>
                <h3>Listening room visits</h3>
                <p>Recent arrivals from shared song URLs, grouped by track and the query key that opened the room.</p>
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
        id="admin-assets"
        labelId="admin-assets-title"
        title="Assets & QA"
        description="Server-inspected technical metadata for the live release WAVs in the Volume 1 folder."
        detail="Source: public/walls-devine/releases/volume1"
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

      <AdminWorkspaceSection
        id="admin-health"
        labelId="admin-health-title"
        title="Backend health"
        description="Firebase auth, live content source, and migration readiness for the admin layer."
        detail={`Content source: ${contentSource === "pending" ? "waiting on Firebase" : contentSource}`}
        isOpen={openSections["admin-health"]}
        onToggle={() => toggleWorkspaceSection("admin-health")}
      >
        <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized notice={panelError || undefined} />
      </AdminWorkspaceSection>
    </main>
  );
}

export default AdminConsole;