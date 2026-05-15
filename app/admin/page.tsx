import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { adminAuthConfig, hasAdminSession } from "@/lib/admin/auth";
import { getWallsDevineAdminData, type ReleasePlanChecklistItem } from "@/lib/admin/walls-devine";

import { loginAdmin, logoutAdmin, toggleReleasePlanItem } from "./actions";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getErrorMessage(errorValue: string | string[] | undefined) {
  if (errorValue === "invalid") {
    return "Username or password did not match the current local admin credentials.";
  }

  return "";
}

function groupChecklistByPhase(items: ReleasePlanChecklistItem[]) {
  const grouped = new Map<string, ReleasePlanChecklistItem[]>();

  for (const item of items) {
    const phaseItems = grouped.get(item.phase) ?? [];
    phaseItems.push(item);
    grouped.set(item.phase, phaseItems);
  }

  return Array.from(grouped.entries());
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const errorMessage = getErrorMessage(params?.error);
  const isAuthenticated = await hasAdminSession();

  if (!isAuthenticated) {
    return (
      <main className="cg-page cg-admin-page">
        <SectionShell id="admin-login" labelledBy="admin-login-title" innerClassName="cg-admin cg-admin--login" variant="hero">
          <SectionHeader
            id="admin-login-title"
            eyebrow="Hidden route"
            title="Admin Console"
            description="Local file-backed access for Walls Devine content. This route is intentionally unlinked from the public navigation."
          />

          <form action={loginAdmin} className="cg-admin__login-form">
            <label className="cg-admin__field">
              <span>Username</span>
              <input name="username" type="text" autoComplete="username" required />
            </label>

            <label className="cg-admin__field">
              <span>Password</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>

            {errorMessage ? <p className="cg-admin__error">{errorMessage}</p> : null}

            <div className="cg-admin__login-actions">
              <Button type="submit">Enter Admin</Button>
            </div>
          </form>
        </SectionShell>
      </main>
    );
  }

  const { plan, instagramDrafts, journalEntries } = await getWallsDevineAdminData();
  const checklistByPhase = groupChecklistByPhase(plan.checklist);

  return (
    <main className="cg-page cg-admin-page">
      <SectionShell id="admin-console" labelledBy="admin-console-title" innerClassName="cg-admin">
        <div className="cg-admin__topbar">
          <SectionHeader
            id="admin-console-title"
            eyebrow="Admin"
            title="Walls Devine control room"
            description="Primitive local backend for release planning and source-content review. The auth and data layer are structured so Firebase can replace them later."
          />

          <div className="cg-admin__topbar-actions">
            <p className="cg-admin__mode">
              Auth mode: {adminAuthConfig.provider} · Firebase ready: {adminAuthConfig.firebaseReady ? "yes" : "no"}
            </p>
            <form action={logoutAdmin}>
              <Button type="submit" variant="ghost">
                Log out
              </Button>
            </form>
          </div>
        </div>

        <div className="cg-admin__grid cg-admin__grid--summary">
          <article className="cg-admin__panel">
            <h2>Locked dates</h2>
            <ul className="cg-admin__list">
              {plan.lockedDates.map((item) => (
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
              {plan.metadataStandards.map((item) => (
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
              {plan.recommendedSetup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__panel">
            <h2>Avoid</h2>
            <ul className="cg-admin__bullet-list">
              {plan.avoid.map((item) => (
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
            <p>{plan.summary}</p>
          </div>
          <p className="cg-admin__updated">Updated {new Date(plan.updatedAt).toLocaleString()}</p>
        </div>

        <div className="cg-admin__phases">
          {checklistByPhase.map(([phase, items]) => (
            <article key={phase} className="cg-admin__panel">
              <h3>{phase}</h3>
              <div className="cg-admin__checklist">
                {items.map((item) => (
                  <form key={item.id} action={toggleReleasePlanItem} className="cg-admin__check-item">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="nextCompleted" value={item.completed ? "false" : "true"} />
                    <span className={["cg-admin__checkmark", item.completed ? "cg-admin__checkmark--done" : ""].filter(Boolean).join(" ")} aria-hidden="true">
                      {item.completed ? "✓" : "○"}
                    </span>
                    <div className="cg-admin__check-copy">
                      <strong>{item.title}</strong>
                      <span>Due: {item.dueDate}</span>
                      <p>{item.notes}</p>
                    </div>
                    <Button type="submit" variant={item.completed ? "ghost" : "secondary"} size="sm">
                      {item.completed ? "Reopen" : "Complete"}
                    </Button>
                  </form>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="admin-calendar" labelledBy="admin-calendar-title" innerClassName="cg-admin__section">
        <h2 id="admin-calendar-title">Campaign calendar</h2>
        <div className="cg-admin__calendar">
          {plan.calendar.map((item) => (
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
            <p>These files were split out of the monolithic original and edited documents so each song can be revised independently.</p>
          </div>
          <p className="cg-admin__path-note">Folder: app/walls-devine/instagram-posts</p>
        </div>

        <div className="cg-admin__file-grid">
          {instagramDrafts.map((draft) => (
            <article key={draft.slug} className="cg-admin__panel cg-admin__file-card">
              <div className="cg-admin__file-head">
                <div>
                  <h3>{draft.title}</h3>
                  <p>{draft.filePath}</p>
                </div>
              </div>
              <p>{draft.preview}</p>
              <details>
                <summary>Open file contents</summary>
                <pre>{draft.content}</pre>
              </details>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="admin-journals" labelledBy="admin-journals-title" innerClassName="cg-admin__section">
        <div className="cg-admin__section-head">
          <div>
            <h2 id="admin-journals-title">Song journals</h2>
            <p>Existing public-facing making-of entries remain separate from the Instagram draft files.</p>
          </div>
          <p className="cg-admin__path-note">Folder: public/walls-devine/journals</p>
        </div>

        <div className="cg-admin__file-grid">
          {journalEntries.map((entry) => (
            <article key={entry.slug} className="cg-admin__panel cg-admin__file-card">
              <h3>{entry.title}</h3>
              <p>{entry.filePath}</p>
              <p>{entry.preview}</p>
              <details>
                <summary>Open file contents</summary>
                <pre>{entry.content}</pre>
              </details>
            </article>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}
