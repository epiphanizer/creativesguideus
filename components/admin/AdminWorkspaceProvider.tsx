"use client";

import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import { buildBookingLeadMatches, defaultBookingBoard } from "@/lib/admin/booking-engine";
import type {
  AdminAudioAnalysis,
  AdminMarkdownCollection,
  BookingRoutingStatus,
  BookingTargetStatus,
  EcosystemLead,
  LinkHubContent,
  ReleasePlanChecklistItem,
  WallsDevineAdminData
} from "@/lib/admin/types";
import {
  deleteFirebaseAdminMarkdownFile,
  deleteFirebaseBookingRoutingTask,
  getAdminUserProfile,
  getFirebaseWallsDevineAdminData,
  isActiveAdminProfile,
  removeAdminMarkdownFile,
  renameFirebaseAdminMarkdownFile,
  replaceAdminMarkdownFile,
  seedFirebaseWallsDevineAdminData,
  upsertFirebaseBookingRoutingTask,
  updateFirebaseAdminMarkdownFile,
  updateFirebaseBookingBoard,
  updateFirebaseCollectorHeroNote,
  updateFirebaseLinkHub,
  updateFirebaseReleasePlanItem,
  type AdminUserProfile
} from "@/lib/firebase/admin-content";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { getEcosystemLeads } from "@/lib/firebase/ecosystem-leads";
import { defaultLinkHubContent } from "@/lib/link-hub/content";
import {
  defaultWallsDevineBookingBannerNote,
  defaultWallsDevineCollectorHeroNote,
  defaultWallsDevineUpcomingShowsNote
} from "@/lib/walls-devine/public-content";

export type SaveState = "saving" | "deleting" | "success" | "error" | undefined;
export type ContentSource = "pending" | "firebase" | "bootstrap";
export type AdminRouteStatus = "live" | "pending";

const collectorHeroNoteSaveKey = "collectorHeroNote";
const linkHubSaveKey = "linkHub";
const bookingTargetSaveKeyPrefix = "bookingTarget";
const AUTH_SESSION_TIMEOUT_MS = 5000;

const bookingTargetStatuses = new Set<BookingTargetStatus>([
  "seeded",
  "researching",
  "outreach-ready",
  "contacted",
  "in-conversation",
  "hold",
  "confirmed"
]);

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
      "Keep release operations above the fold and move into a module only when you need to act.",
      "Treat scaffold mode as a visibility fallback, not the final source of truth."
    ],
    metadataStandards: [
      { label: "Audience layer", value: "Collector leads via Firestore" },
      { label: "Content layer", value: "Instagram drafts + song journals" },
      { label: "Analysis layer", value: "Backend WAV inspection" }
    ],
    recommendedSetup: [
      "Review release operations",
      "Check booking-fit leads",
      "Inspect content and asset modules"
    ],
    avoid: [
      "Do not block the full console on one missing data source.",
      "Do not hide already-wired modules just because Firebase seed content is late.",
      "Do not assume the Firestore markdown layer is live until the health check confirms it."
    ],
    calendar: [
      {
        id: "scaffold-reconnect-firebase-content",
        phase: "Dashboard scaffold",
        date: "Now",
        action: "Reconnect Firebase content",
        purpose: "Hydrate the release plan and markdown layers",
        start: "2026-05-15T09:00:00.000Z",
        end: "2026-05-15T10:00:00.000Z"
      },
      {
        id: "scaffold-review-admin-modules",
        phase: "Dashboard scaffold",
        date: "Now",
        action: "Review admin modules",
        purpose: "Confirm release, booking, content, and asset surfaces are visible",
        start: "2026-05-15T11:00:00.000Z",
        end: "2026-05-15T12:00:00.000Z"
      },
      {
        id: "scaffold-retry-data-load",
        phase: "Dashboard scaffold",
        date: "Next",
        action: "Retry data load",
        purpose: "Replace scaffold mode with live backend data",
        start: "2026-05-16T09:00:00.000Z",
        end: "2026-05-16T10:00:00.000Z"
      }
    ],
    checklist: [
      {
        id: "scaffold-release-ops",
        phase: "Dashboard scaffold",
        title: "Release operations module visible",
        dueDate: "Now",
        completed: true,
        notes: "Checklist, calendar, and launch operations remain visible even when live Firebase content is unavailable.",
        summary: "Release operations module visible",
        description: "Keep the release module visible while Firebase reconnects.",
        start: "2026-05-15T09:00:00.000Z",
        end: "2026-05-15T09:30:00.000Z",
        gCalEventId: null,
        syncSource: "seed"
      },
      {
        id: "scaffold-booking-ops",
        phase: "Dashboard scaffold",
        title: "Booking module visible",
        dueDate: "Now",
        completed: true,
        notes: "Booking-fit lead triage and target editing remain reachable from the new route shell.",
        summary: "Booking module visible",
        description: "Keep the booking workspace reachable while content sync is pending.",
        start: "2026-05-15T10:00:00.000Z",
        end: "2026-05-15T10:30:00.000Z",
        gCalEventId: null,
        syncSource: "seed"
      },
      {
        id: "scaffold-content-ops",
        phase: "Dashboard scaffold",
        title: "Content studio scaffold visible",
        dueDate: "Now",
        completed: true,
        notes: "Draft and journal tools stay visible while the Firebase markdown layer reconnects.",
        summary: "Content studio scaffold visible",
        description: "Keep the content editor reachable while markdown sync is pending.",
        start: "2026-05-15T11:00:00.000Z",
        end: "2026-05-15T11:30:00.000Z",
        gCalEventId: null,
        syncSource: "seed"
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

type AdminRouteStatuses = {
  overview: AdminRouteStatus;
  "release-desk": AdminRouteStatus;
  booking: AdminRouteStatus;
  content: AdminRouteStatus;
  assets: AdminRouteStatus;
};

type AdminWorkspaceContextValue = {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  authUser: User | null;
  adminProfile: AdminUserProfile | null;
  authLoading: boolean;
  authError: string;
  panelError: string;
  dataLoading: boolean;
  audioLoading: boolean;
  audioError: string;
  leadsLoading: boolean;
  leadsError: string;
  hasFirebaseRuntime: boolean;
  isAuthorized: boolean;
  isScaffoldMode: boolean;
  hasLiveMarkdownContent: boolean;
  isResolvingAuthorizedSession: boolean;
  isRefreshingAuthorizedAdmin: boolean;
  adminData: WallsDevineAdminData | null;
  adminViewData: WallsDevineAdminData;
  contentSource: ContentSource;
  saveStates: Record<string, SaveState>;
  collectorHeroNoteSaveState: SaveState;
  linkHubSaveState: SaveState;
  audioAnalysis: AdminAudioAnalysis[];
  ecosystemLeads: EcosystemLead[];
  completedChecklist: number;
  checklistByPhase: Array<[string, ReleasePlanChecklistItem[]]>;
  bookingLeadMatches: ReturnType<typeof buildBookingLeadMatches>;
  bookingTargetSaveStates: Record<string, SaveState>;
  bookingGoalCountdown: string;
  routeStatuses: AdminRouteStatuses;
  liveRouteCount: number;
  handleLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRetryAccess: () => Promise<void>;
  handleForceSync: () => Promise<void>;
  handleAudioRefresh: () => Promise<void>;
  handleChecklistToggle: (itemId: string, completed: boolean) => Promise<void>;
  handleBookingTargetSave: (event: FormEvent<HTMLFormElement>, targetId: string) => Promise<void>;
  handleCollectorHeroNoteSave: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleLinkHubSave: (nextLinkHub: LinkHubContent) => Promise<void>;
  handleMarkdownSave: (event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection, slug: string) => Promise<void>;
  handleMarkdownCreate: (event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection) => Promise<void>;
  handleMarkdownDelete: (collection: AdminMarkdownCollection, slug: string) => Promise<void>;
};

const AdminWorkspaceContext = createContext<AdminWorkspaceContextValue | null>(null);

function groupChecklistByPhase(items: ReleasePlanChecklistItem[]) {
  const grouped = new Map<string, ReleasePlanChecklistItem[]>();

  for (const item of items) {
    const phaseItems = grouped.get(item.phase) ?? [];
    phaseItems.push(item);
    grouped.set(item.phase, phaseItems);
  }

  return Array.from(grouped.entries());
}

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

function getCollectionLabel(collection: AdminMarkdownCollection) {
  return collection === "instagram-posts" ? "draft" : "journal";
}

function getMarkdownFiles(data: WallsDevineAdminData, collection: AdminMarkdownCollection) {
  return collection === "instagram-posts" ? data.instagramDrafts : data.journalEntries;
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

function applyMarkdownTitle(title: string, content: string) {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return trimmedContent ? `${trimmedContent}\n` : "";
  }

  if (!trimmedContent) {
    return `# ${trimmedTitle}\n\n`;
  }

  if (/^#\s+.+/.test(trimmedContent)) {
    return `${trimmedContent.replace(/^#\s+.+/, `# ${trimmedTitle}`)}\n`;
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

function isBookingTargetStatus(value: string): value is BookingTargetStatus {
  return bookingTargetStatuses.has(value as BookingTargetStatus);
}

function isBookingRoutingStatusValue(value: string): value is BookingRoutingStatus {
  return value === "hold" || value === "confirmed";
}

function getBookingTargetSaveKey(targetId: string) {
  return `${bookingTargetSaveKeyPrefix}:${targetId}`;
}

export function getAdminMarkdownSaveKey(collection: AdminMarkdownCollection, slug: string) {
  return `${collection}:${slug}`;
}

export function getAdminMarkdownCreateKey(collection: AdminMarkdownCollection) {
  return `create:${collection}`;
}

export function AdminWorkspaceProvider({ children }: { children: ReactNode }) {
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
  const [, startTransition] = useTransition();

  const hasFirebaseRuntime = Boolean(firebaseAuth);
  const isAuthorized = isActiveAdminProfile(adminProfile);
  const adminViewData = adminData ?? fallbackAdminData;
  const isScaffoldMode = !adminData;
  const hasLiveMarkdownContent = adminData ? adminData.contentBackend === "firestore" && adminData.markdownInitialized !== false : false;
  const isResolvingAuthorizedSession = Boolean(authUser) && dataLoading && !isAuthorized && !panelError;
  const isRefreshingAuthorizedAdmin = Boolean(authUser) && isAuthorized && dataLoading;
  const completedChecklist = useMemo(() => countCompletedChecklist(adminViewData.plan.checklist), [adminViewData.plan.checklist]);
  const checklistByPhase = useMemo(() => groupChecklistByPhase(adminViewData.plan.checklist), [adminViewData.plan.checklist]);
  const bookingLeadMatches = useMemo(() => buildBookingLeadMatches(adminViewData.bookingBoard, ecosystemLeads), [adminViewData.bookingBoard, ecosystemLeads]);
  const bookingTargetSaveStates = useMemo(
    () =>
      adminViewData.bookingBoard.targets.reduce<Record<string, SaveState>>((states, target) => {
        states[target.id] = saveStates[getBookingTargetSaveKey(target.id)];
        return states;
      }, {}),
    [adminViewData.bookingBoard.targets, saveStates]
  );
  const bookingGoalCountdown = useMemo(() => formatCountdownToDate(adminViewData.bookingBoard.goal.lockByDate), [adminViewData.bookingBoard.goal.lockByDate]);
  const routeStatuses = useMemo<AdminRouteStatuses>(
    () => ({
      overview: "live",
      "release-desk": isScaffoldMode ? "pending" : "live",
      booking: !isScaffoldMode && adminViewData.bookingBoard.targets.length ? "live" : "pending",
      content: hasLiveMarkdownContent ? "live" : "pending",
      assets: !audioError && audioAnalysis.length ? "live" : "pending"
    }),
    [audioAnalysis.length, audioError, adminViewData.bookingBoard.targets.length, hasLiveMarkdownContent, isScaffoldMode]
  );
  const liveRouteCount = useMemo(() => Object.values(routeStatuses).filter((status) => status === "live").length, [routeStatuses]);

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

    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (user) => {
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
      },
      (error) => {
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
      }
    );

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

    void loadAudioAnalysis(authUser);
  }, [authUser, isAuthorized]);

  useEffect(() => {
    if (!authUser || !isAuthorized) {
      setEcosystemLeads([]);
      setLeadsError("");
      setLeadsLoading(false);
      return;
    }

    void loadEcosystemLeadBacklog();
  }, [authUser, isAuthorized]);

  function collectionHasDuplicateSlug(collection: AdminMarkdownCollection, slug: string, currentSlug?: string) {
    if (!adminData) {
      return false;
    }

    return getMarkdownFiles(adminData, collection).some((file) => file.slug === slug && file.slug !== currentSlug);
  }

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

  async function handleForceSync() {
    if (!authUser) {
      return;
    }

    if (!isAuthorized) {
      await handleRetryAccess();
      return;
    }

    await Promise.all([loadAuthorizedAdmin(authUser), loadAudioAnalysis(authUser), loadEcosystemLeadBacklog()]);
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
    const nextRoutingStart = String(formData.get("routingStart") ?? "").trim();
    const nextRoutingEnd = String(formData.get("routingEnd") ?? "").trim();

    if (!isBookingTargetStatus(nextStatus)) {
      setPanelError("Booking targets need a valid workflow status before they can be saved.");
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      return;
    }

    if ((nextRoutingStart && !nextRoutingEnd) || (!nextRoutingStart && nextRoutingEnd)) {
      setPanelError("Add both routing dates or leave both blank before saving this target.");
      setSaveStates((current) => ({ ...current, [saveKey]: "error" }));
      return;
    }

    if (nextRoutingStart && nextRoutingEnd && new Date(nextRoutingEnd).getTime() < new Date(nextRoutingStart).getTime()) {
      setPanelError("The routing end date has to land on or after the routing start date.");
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
                notes: nextNotes,
                routingStart: nextRoutingStart,
                routingEnd: nextRoutingEnd,
                routingSyncSource:
                  isBookingRoutingStatusValue(nextStatus) && nextRoutingStart && nextRoutingEnd ? "admin-ui" : target.routingSyncSource,
                routingGCalEventId:
                  isBookingRoutingStatusValue(nextStatus) && nextRoutingStart && nextRoutingEnd ? target.routingGCalEventId ?? null : null
              }
            : target
        )
      };
      const savedBookingBoard = await updateFirebaseBookingBoard(nextBookingBoard);
      const savedTarget = savedBookingBoard.targets.find((target) => target.id === targetId) ?? null;
      const targetWindow = savedTarget ? savedBookingBoard.availability.find((window) => window.id === savedTarget.targetWindowId) ?? null : null;

      if (savedTarget && isBookingRoutingStatusValue(nextStatus) && nextRoutingStart && nextRoutingEnd) {
        await upsertFirebaseBookingRoutingTask({
          id: targetId,
          targetId,
          targetName: savedTarget.name,
          market: targetWindow?.market ?? `${savedTarget.city}, ${savedTarget.state}`,
          city: savedTarget.city,
          state: savedTarget.state,
          status: nextStatus,
          summary: "",
          description: savedTarget.desiredOutcome,
          start: nextRoutingStart,
          end: nextRoutingEnd,
          notes: nextNotes,
          gCalEventId: savedTarget.routingGCalEventId ?? null,
          syncSource: "admin-ui",
          updatedAt: new Date().toISOString()
        });
      } else {
        await deleteFirebaseBookingRoutingTask(targetId);
      }

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

    const saveKey = getAdminMarkdownSaveKey(collection, slug);
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const nextSlug = normalizeMarkdownSlug(String(formData.get("slug") ?? ""));
    const content = String(formData.get("content") ?? "");
    const nextContent = title ? applyMarkdownTitle(title, content) : content;

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
          ? await updateFirebaseAdminMarkdownFile(collection, slug, nextContent)
          : await renameFirebaseAdminMarkdownFile(collection, slug, nextSlug, nextContent);

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
          [getAdminMarkdownSaveKey(collection, nextSlug)]: "success"
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

    const createKey = getAdminMarkdownCreateKey(collection);
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

    const saveKey = getAdminMarkdownSaveKey(collection, slug);
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

  const value = useMemo<AdminWorkspaceContextValue>(
    () => ({
      email,
      password,
      setEmail,
      setPassword,
      authUser,
      adminProfile,
      authLoading,
      authError,
      panelError,
      dataLoading,
      audioLoading,
      audioError,
      leadsLoading,
      leadsError,
      hasFirebaseRuntime,
      isAuthorized,
      isScaffoldMode,
      hasLiveMarkdownContent,
      isResolvingAuthorizedSession,
      isRefreshingAuthorizedAdmin,
      adminData,
      adminViewData,
      contentSource,
      saveStates,
      collectorHeroNoteSaveState: saveStates[collectorHeroNoteSaveKey],
      linkHubSaveState: saveStates[linkHubSaveKey],
      audioAnalysis,
      ecosystemLeads,
      completedChecklist,
      checklistByPhase,
      bookingLeadMatches,
      bookingTargetSaveStates,
      bookingGoalCountdown,
      routeStatuses,
      liveRouteCount,
      handleLogin,
      handleLogout,
      handleRetryAccess,
      handleForceSync,
      handleAudioRefresh,
      handleChecklistToggle,
      handleBookingTargetSave,
      handleCollectorHeroNoteSave,
      handleLinkHubSave,
      handleMarkdownSave,
      handleMarkdownCreate,
      handleMarkdownDelete
    }),
    [
      adminData,
      adminProfile,
      adminViewData,
      audioAnalysis,
      audioError,
      audioLoading,
      authError,
      authLoading,
      authUser,
      bookingGoalCountdown,
      bookingLeadMatches,
      bookingTargetSaveStates,
      checklistByPhase,
      completedChecklist,
      contentSource,
      dataLoading,
      email,
      ecosystemLeads,
      hasFirebaseRuntime,
      hasLiveMarkdownContent,
      isAuthorized,
      isRefreshingAuthorizedAdmin,
      isResolvingAuthorizedSession,
      isScaffoldMode,
      leadsError,
      leadsLoading,
      liveRouteCount,
      panelError,
      password,
      routeStatuses,
      saveStates
    ]
  );

  return <AdminWorkspaceContext.Provider value={value}>{children}</AdminWorkspaceContext.Provider>;
}

export function useAdminWorkspace() {
  const context = useContext(AdminWorkspaceContext);

  if (!context) {
    throw new Error("useAdminWorkspace must be used within AdminWorkspaceProvider.");
  }

  return context;
}