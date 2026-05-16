"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import type { AdminMarkdownCollection, ReleasePlanChecklistItem, WallsDevineAdminData } from "@/lib/admin/types";
import { adminAuthConfig } from "@/lib/admin/auth";
import {
  getAdminUserProfile,
  getFirebaseWallsDevineAdminData,
  isActiveAdminProfile,
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

type SaveState = "saving" | "success" | "error";
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
    throw new Error("The bootstrap route could not load the local Walls Devine seed data.");
  }

  return (await response.json()) as WallsDevineAdminData;
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
  const [, startTransition] = useTransition();

  const hasFirebaseRuntime = Boolean(firebaseAuth);
  const isAuthorized = isActiveAdminProfile(adminProfile);
  const checklistByPhase = useMemo(() => groupChecklistByPhase(adminData?.plan.checklist ?? []), [adminData]);

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

      setDataLoading(true);

      try {
        const profile = await getAdminUserProfile(user.uid);
        setAdminProfile(profile);

        if (!isActiveAdminProfile(profile)) {
          setPanelError(
            `Signed in as ${user.email ?? "an unknown account"}, but no active ${firebaseAdminPaths.adminUsersCollection}/${user.uid} document was found.`
          );
          return;
        }

        let nextData = await getFirebaseWallsDevineAdminData();
        let nextSource: ContentSource = "firebase";

        if (!nextData) {
          const bootstrapSeed = await fetchBootstrapData(await user.getIdToken());
          nextData = await seedFirebaseWallsDevineAdminData(bootstrapSeed);
          nextSource = "bootstrap";
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
    });

    return unsubscribe;
  }, [startTransition]);

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

    if (!adminData) {
      return;
    }

    const saveKey = getSaveNoticeKey(collection, slug);
    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") ?? "");

    setPanelError("");
    setSaveStates((current) => ({ ...current, [saveKey]: "saving" }));

    try {
      const nextFile = await updateFirebaseAdminMarkdownFile(collection, slug, content);

      startTransition(() => {
        setAdminData((current) => (current ? replaceAdminMarkdownFile(current, collection, nextFile) : current));
      });

      setSaveStates((current) => ({ ...current, [saveKey]: "success" }));
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
          <AdminFirebaseStatus contentSource={contentSource} />
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
            description="Firebase Auth now gates the Walls Devine admin. Sign in with the email/password account attached to the CGU Firebase project."
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

            <p className="cg-admin__helper">
              Best practice: create a Firebase Auth user first, then add an active document to {`${firebaseAdminPaths.adminUsersCollection}/{uid}`}.
            </p>

            <div className="cg-admin__login-actions">
              <Button type="submit" disabled={!hasFirebaseRuntime}>
                Enter Admin
              </Button>
            </div>
          </form>

          <AdminFirebaseStatus contentSource={contentSource} />
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
            description="Firebase Auth succeeded, but this account is not yet registered as an active editor in Firestore."
          />

          <div className="cg-admin__stack">
            <p className="cg-admin__error">{panelError || "This account is missing its adminUsers document."}</p>
            <p className="cg-admin__helper">
              Recommended Firestore doc: {firebaseAdminPaths.adminUsersCollection}/{authUser.uid} with active: true and your editor metadata.
            </p>
            <p className="cg-admin__helper">Signed in as: {authUser.email ?? "Unknown email"}</p>
            <div className="cg-admin__login-actions">
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>

          <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized={false} />
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
            description="Loading Firestore and Storage content. If the project is still empty, the local Walls Devine files will be seeded into Firebase now."
          />
          <p className="cg-admin__helper">Signed in as {authUser.email ?? "Unknown email"}</p>
          {panelError ? <p className="cg-admin__error">{panelError}</p> : null}
          <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized />
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
            eyebrow="Firebase admin"
            title="Walls Devine control room"
            description="This admin now runs on Firebase Auth, Firestore, and Storage. The old local JSON and markdown files are only retained as bootstrap seed data."
          />

          <div className="cg-admin__topbar-actions">
            <p className="cg-admin__mode">
              Auth mode: {adminAuthConfig.provider} · Editor: {authUser.email ?? "Unknown email"} · Content source: {contentSource}
            </p>
            <div className="cg-admin__editor-actions">
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </div>

        {panelError ? <p className="cg-admin__error">{panelError}</p> : null}

        <div className="cg-admin__grid cg-admin__grid--summary">
          <AdminFirebaseStatus signedInEmail={authUser.email ?? null} contentSource={contentSource} isAuthorized />

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

      <SectionShell id="admin-instagram-posts" labelledBy="admin-instagram-posts-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-instagram-posts-title">Instagram drafts</h2>
            <p>These entries now save to Firebase Storage so the draft layer is decoupled from the local repo files.</p>
          </div>
          <p className="cg-admin__path-note">Storage path: {firebaseAdminPaths.storageBasePath}/instagram-posts</p>
        </div>

        <div className="cg-admin__file-grid">
          {adminData.instagramDrafts.map((draft) => {
            const saveKey = getSaveNoticeKey("instagram-posts", draft.slug);
            const saveState = saveStates[saveKey];

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
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={draft.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm">
                      Save draft
                    </Button>
                    {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                    {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                    {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this draft.</p> : null}
                  </div>
                </form>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell id="admin-journals" labelledBy="admin-journals-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-journals-title">Song journals</h2>
            <p>Public-facing making-of entries now persist in Firebase Storage alongside the internal draft layer.</p>
          </div>
          <p className="cg-admin__path-note">Storage path: {firebaseAdminPaths.storageBasePath}/journals</p>
        </div>

        <div className="cg-admin__file-grid">
          {adminData.journalEntries.map((entry) => {
            const saveKey = getSaveNoticeKey("journals", entry.slug);
            const saveState = saveStates[saveKey];

            return (
              <article key={entry.slug} className="cg-admin__panel cg-admin__file-card">
                <h3>{entry.title}</h3>
                <p>{entry.filePath}</p>
                <p>{entry.preview}</p>
                <form onSubmit={(event) => handleMarkdownSave(event, "journals", entry.slug)} className="cg-admin__editor-form">
                  <label className="cg-admin__editor-field">
                    <span>Markdown source</span>
                    <textarea name="content" defaultValue={entry.content} className="cg-admin__editor-textarea" rows={18} spellCheck={false} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm">
                      Save journal
                    </Button>
                    {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                    {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                    {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this journal.</p> : null}
                  </div>
                </form>
              </article>
            );
          })}
        </div>
      </SectionShell>
    </main>
  );
}

export default AdminConsole;