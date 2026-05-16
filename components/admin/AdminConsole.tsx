"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import type { AdminAudioAnalysis, AdminMarkdownCollection, ReleasePlanChecklistItem, WallsDevineAdminData } from "@/lib/admin/types";
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
  updateFirebaseReleasePlanItem,
  type AdminUserProfile
} from "@/lib/firebase/admin-content";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

import { AdminFirebaseStatus } from "./AdminFirebaseStatus";

type SaveState = "saving" | "deleting" | "success" | "error";
type ContentSource = "pending" | "firebase" | "bootstrap";

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
        return "Firebase denied access. Check the adminUsers collection and Firestore or Storage rules.";
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
  const [, startTransition] = useTransition();

  const hasFirebaseRuntime = Boolean(firebaseAuth);
  const isAuthorized = isActiveAdminProfile(adminProfile);
  const checklistByPhase = useMemo(() => groupChecklistByPhase(adminData?.plan.checklist ?? []), [adminData]);
  const hasStorageBackedContent = adminData?.storageBacked !== false;

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
      let nextSource: ContentSource = nextData?.storageBacked === false ? "bootstrap" : "firebase";
      const needsBootstrap =
        !nextData ||
        nextData.storageBacked === false ||
        nextData.instagramDrafts.length === 0 ||
        nextData.journalEntries.length === 0;

      if (needsBootstrap) {
        const bootstrapSeed = await fetchBootstrapData(await user.getIdToken());
        nextData = await seedFirebaseWallsDevineAdminData(bootstrapSeed);
        nextSource = nextData.storageBacked === false ? "bootstrap" : "firebase";
      }

      if (!nextData) {
        throw new Error("Firebase content is still empty after the bootstrap attempt.");
      }

      setContentSource(nextSource);
      startTransition(() => {
        setAdminData(nextData);
      });
    } catch (error) {
      setPanelError(getFirebaseErrorMessage(error));
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

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthLoading(false);
      setPanelError("Firebase Auth is not initialized. Confirm the web app configuration before using /admin.");
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
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
    });

    return unsubscribe;
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

  async function handleMarkdownSave(event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection, slug: string) {
    event.preventDefault();

    if (!adminData || !hasStorageBackedContent) {
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

    if (!adminData || !hasStorageBackedContent) {
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
    if (!adminData || !hasStorageBackedContent) {
      return;
    }

    const fileLabel = getCollectionLabel(collection);
    const confirmed = window.confirm(`Delete this ${fileLabel}? This removes the live markdown file from Firebase Storage.`);

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

  if (dataLoading || !adminData) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-bootstrap" labelledBy="admin-bootstrap-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-bootstrap-title"
            eyebrow="Firebase admin"
            title="Preparing the control room"
            description="Loading the release plan and any available remote content."
          />
          <p className="cg-admin__helper">Signed in as {authUser.email ?? "Unknown email"}</p>
          {panelError ? <p className="cg-admin__error">{panelError}</p> : null}
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
            description="Release plan, calendar, and source content for Volume 1."
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
        {!hasStorageBackedContent ? (
          <p className="cg-admin__helper">
            Draft and journal syncing is still waiting on Firebase Storage initialization. The release plan is live now, and a hidden health check is available below.
          </p>
        ) : null}

        <div className="cg-admin__grid cg-admin__grid--summary">
          <article className="cg-admin__panel">
            <h2>Locked dates</h2>
            <ul className="cg-admin__list">
              {adminData.plan.lockedDates.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h2>Metadata standards</h2>
            <ul className="cg-admin__list">
              {adminData.plan.metadataStandards.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h2>Recommended setup</h2>
            <ul className="cg-admin__bullet-list">
              {adminData.plan.recommendedSetup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h2>Avoid</h2>
            <ul className="cg-admin__bullet-list">
              {adminData.plan.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <details className="cg-admin__health-check">
          <summary>Health check</summary>
          <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized notice={panelError || undefined} />
        </details>
      </SectionShell>

      <SectionShell id="admin-release-plan" labelledBy="admin-release-plan-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-release-plan-title">Release checklist</h2>
            <p>{adminData.plan.summary}</p>
          </div>
          <p className="cg-admin__updated">Updated {new Date(adminData.plan.updatedAt).toLocaleString()}</p>
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
                    <Button type="button" variant={item.completed ? "ghost" : "secondary"} size="sm" onClick={() => handleChecklistToggle(item.id, !item.completed)}>
                      {item.completed ? "Reopen" : "Complete"}
                    </Button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="admin-calendar" labelledBy="admin-calendar-title" innerClassName="cg-admin__section">
        <h2 id="admin-calendar-title">Campaign calendar</h2>
        <div className="cg-admin__calendar">
          {adminData.plan.calendar.map((item) => (
            <article key={`${item.date}-${item.action}`} className="cg-admin__panel">
              <span className="cg-admin__calendar-date">{item.date}</span>
              <h3>{item.action}</h3>
              <p>{item.purpose}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="admin-audio-analysis" labelledBy="admin-audio-analysis-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-audio-analysis-title">Backend WAV analysis</h2>
            <p>Server-inspected technical metadata for the live release WAVs in the Volume 1 folder.</p>
          </div>
          <div className="cg-admin__section-actions">
            <p className="cg-admin__path-note">Source: public/walls-devine/releases/volume1</p>
            <Button type="button" variant="secondary" size="sm" onClick={handleAudioRefresh} disabled={audioLoading}>
              {audioLoading ? "Refreshing…" : "Refresh analysis"}
            </Button>
          </div>
        </div>

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
        ) : null}
      </SectionShell>

      {adminData.instagramDrafts.length || hasStorageBackedContent ? (
        <SectionShell id="admin-instagram-posts" labelledBy="admin-instagram-posts-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-instagram-posts-title">Instagram drafts</h2>
            <p>These entries now save to Firebase Storage so Terry can create, rename, update, and delete the live draft layer without touching repo files.</p>
          </div>
          <p className="cg-admin__path-note">Storage path: {firebaseAdminPaths.storageBasePath}/instagram-posts</p>
        </div>

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
                <Button type="submit" variant="secondary" size="sm" disabled={!hasStorageBackedContent || saveStates[getCreateNoticeKey("instagram-posts")] === "saving"}>
                  Create draft
                </Button>
                {saveStates[getCreateNoticeKey("instagram-posts")] === "saving" ? <p className="cg-admin__save-note">Creating…</p> : null}
                {saveStates[getCreateNoticeKey("instagram-posts")] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Created.</p> : null}
                {saveStates[getCreateNoticeKey("instagram-posts")] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not create this draft.</p> : null}
                {!hasStorageBackedContent ? <p className="cg-admin__save-note">Storage must be live before drafts can be changed.</p> : null}
              </div>
            </form>
          </article>

          {adminData.instagramDrafts.map((draft) => {
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
                      <input name="slug" type="text" defaultValue={draft.slug} className="cg-admin__editor-input" spellCheck={false} disabled={!hasStorageBackedContent || isBusy} />
                    </label>
                  </div>
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={draft.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} disabled={!hasStorageBackedContent || isBusy} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm" disabled={!hasStorageBackedContent || isBusy}>
                      Save draft
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleMarkdownDelete("instagram-posts", draft.slug)} disabled={!hasStorageBackedContent || isBusy}>
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
        </div>
        </SectionShell>
      ) : null}

      {adminData.journalEntries.length || hasStorageBackedContent ? (
        <SectionShell id="admin-journals" labelledBy="admin-journals-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-journals-title">Song journals</h2>
            <p>Public-facing journal entries now support full CRUD in Firebase Storage, so Terry can manage what appears in the live song journal layer.</p>
          </div>
          <p className="cg-admin__path-note">Storage path: {firebaseAdminPaths.storageBasePath}/journals</p>
        </div>

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
                <Button type="submit" variant="secondary" size="sm" disabled={!hasStorageBackedContent || saveStates[getCreateNoticeKey("journals")] === "saving"}>
                  Create journal
                </Button>
                {saveStates[getCreateNoticeKey("journals")] === "saving" ? <p className="cg-admin__save-note">Creating…</p> : null}
                {saveStates[getCreateNoticeKey("journals")] === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Created.</p> : null}
                {saveStates[getCreateNoticeKey("journals")] === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not create this journal.</p> : null}
                {!hasStorageBackedContent ? <p className="cg-admin__save-note">Storage must be live before journals can be changed.</p> : null}
              </div>
            </form>
          </article>

          {adminData.journalEntries.map((entry) => {
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
                      <input name="slug" type="text" defaultValue={entry.slug} className="cg-admin__editor-input" spellCheck={false} disabled={!hasStorageBackedContent || isBusy} />
                    </label>
                  </div>
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={entry.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} disabled={!hasStorageBackedContent || isBusy} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm" disabled={!hasStorageBackedContent || isBusy}>
                      Save journal
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleMarkdownDelete("journals", entry.slug)} disabled={!hasStorageBackedContent || isBusy}>
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
        </div>
        </SectionShell>
      ) : null}
    </main>
  );
}

export default AdminConsole;