"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cx } from "@/lib/cx";

import { type AdminProjectId, useAdminProject } from "./AdminProjectProvider";
import { useAdminWorkspace } from "./AdminWorkspaceProvider";

const pendingRouteStatuses = {
  overview: "pending",
  "release-desk": "pending",
  booking: "pending",
  content: "pending",
  assets: "pending"
} as const;

const projectSwitcherOptions: Array<{ id: AdminProjectId; label: string; statusLabel: string; isLive: boolean }> = [
  { id: "walls-devine", label: "Walls/Devine", statusLabel: "Live", isLive: true },
  { id: "bong-tour", label: "Bong Tour", statusLabel: "Next", isLive: false }
];

export function AdminAppShell({ children }: { children: ReactNode }) {
  const {
    email,
    password,
    setEmail,
    setPassword,
    authUser,
    authLoading,
    authError,
    panelError,
    dataLoading,
    hasFirebaseRuntime,
    isAuthorized,
    isScaffoldMode,
    hasLiveMarkdownContent,
    isResolvingAuthorizedSession,
    isRefreshingAuthorizedAdmin,
    routeStatuses,
    handleLogin,
    handleLogout,
    handleRetryAccess,
    handleForceSync
  } = useAdminWorkspace();
  const { currentProject, currentPath, projectIsLive, projectNavItems, projectNavGroups, currentNavItem, buildScopedHref } = useAdminProject();

  const displayedRouteStatuses = projectIsLive ? routeStatuses : pendingRouteStatuses;
  const syncBusy = projectIsLive && dataLoading;

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
    <main className="cg-page cg-admin-page cg-admin-page--console">
      <div className="cg-admin-shell">
        <header className="cg-admin-shell__topbar">
          <div className="cg-admin-shell__brand">
            <span className="cg-admin-shell__eyebrow">CGU Admin</span>
            <h1>{currentProject.label}</h1>
            <p>{projectIsLive ? currentNavItem.description : currentProject.description}</p>
          </div>

          <div className="cg-admin-shell__toolbar">
            <div className="cg-admin-shell__project-switcher" aria-label="Project selector">
              <span className="cg-admin-shell__eyebrow">Project</span>
              <div className="cg-admin-shell__project-pills" role="tablist" aria-label="Project switcher">
                {projectSwitcherOptions.map((project) => (
                  <Link
                    key={project.id}
                    href={buildScopedHref(currentPath, project.id)}
                    className={cx(
                      "cg-admin-shell__project-pill",
                      currentProject.id === project.id && "cg-admin-shell__project-pill--active",
                      !project.isLive && "cg-admin-shell__project-pill--pending"
                    )}
                    aria-current={currentProject.id === project.id ? "page" : undefined}
                  >
                    <strong>{project.label}</strong>
                    <span>{currentProject.id === project.id ? "Current" : project.statusLabel}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="cg-admin-shell__global-actions">
              {projectIsLive ? (
                <Button type="button" variant="primary" size="sm" onClick={handleForceSync} disabled={syncBusy}>
                  {syncBusy ? "Syncing…" : "Force sync"}
                </Button>
              ) : (
                <Button as="a" href={buildScopedHref(currentPath, "walls-devine")} variant="secondary" size="sm">
                  Open Walls/Devine
                </Button>
              )}
            </div>

            <div className="cg-admin-shell__profile">
              <div>
                <strong>{authUser.email ?? "seanhalls@gmail.com"}</strong>
                <span>Editor session</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </header>

        <nav className="cg-admin-shell__breadcrumbs" aria-label="Breadcrumb">
          <Link href={buildScopedHref("/admin/overview")}>Admin</Link>
          <span aria-hidden="true">/</span>
          <span>{currentProject.label}</span>
          <span aria-hidden="true">/</span>
          <span>{currentNavItem.label}</span>
        </nav>

        {panelError ? <p className="cg-admin__error">{panelError}</p> : null}
        {!projectIsLive ? (
          <div className="cg-admin__banner cg-admin__banner--pending">
            <div>
              <strong>Bong Tour is staged next.</strong>
              <p>The project switcher is live. Editing tools still run on the Walls/Devine workspace.</p>
            </div>
            <div className="cg-admin__banner-actions">
              <Button as="a" href={buildScopedHref(currentPath, "walls-devine")} variant="primary" size="sm">
                Open live workspace
              </Button>
            </div>
          </div>
        ) : isRefreshingAuthorizedAdmin ? (
          <p className="cg-admin__helper">Refreshing live content in place.</p>
        ) : null}
        {projectIsLive && isScaffoldMode ? (
          <div className="cg-admin__banner">
            <div>
              <strong>{isRefreshingAuthorizedAdmin ? "Live content is still hydrating" : "Scaffold mode is active"}</strong>
              <p>
                {isRefreshingAuthorizedAdmin
                  ? "The shell stays visible while content finishes loading."
                  : "Live content did not load yet. Force sync to retry."}
              </p>
            </div>
            <div className="cg-admin__banner-actions">
              <Button type="button" variant="primary" size="sm" onClick={handleForceSync} disabled={syncBusy}>
                {syncBusy ? "Syncing…" : "Force sync"}
              </Button>
            </div>
          </div>
        ) : projectIsLive && !hasLiveMarkdownContent ? (
          <p className="cg-admin__helper">
            Draft and journal editing unlocks after content sync finishes.
          </p>
        ) : null}

        <div className="cg-admin-shell__body">
          <aside className="cg-admin-shell__sidebar" aria-label="Primary navigation">
            {projectNavGroups.map((group) => (
              <div key={group} className="cg-admin-shell__nav-group">
                <span className="cg-admin-shell__nav-group-label">{group}</span>
                <nav className="cg-admin-shell__nav-list" aria-label={group}>
                  {projectNavItems
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const status = displayedRouteStatuses[item.routeKey];

                      return (
                        <Link
                          key={item.href}
                          href={buildScopedHref(item.href)}
                          className={cx("cg-admin-shell__nav-link", currentPath === item.href && "cg-admin-shell__nav-link--active")}
                        >
                          <div>
                            <strong>{item.label}</strong>
                            <p>{item.description}</p>
                          </div>
                          <span className={cx("cg-admin__status-badge", status === "live" ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending")}>
                            {status === "live" ? "Live" : "Pending"}
                          </span>
                        </Link>
                      );
                    })}
                </nav>
              </div>
            ))}
          </aside>

          <section className="cg-admin-shell__content">
            {projectIsLive ? (
              children
            ) : (
              <div className="cg-admin-route">
                <div className="cg-admin-route__header">
                  <div className="cg-admin-route__header-copy">
                    <span className="cg-admin-shell__eyebrow">Project setup</span>
                    <h2>{currentProject.label} workspace</h2>
                    <p>{currentNavItem.label} will land here once this project module is wired.</p>
                  </div>
                  <div className="cg-admin-route__header-actions">
                    <Button as="a" href={buildScopedHref(currentPath, "walls-devine")} variant="primary" size="sm">
                      Open Walls/Devine
                    </Button>
                  </div>
                </div>

                <article className="cg-admin__panel cg-admin__panel--placeholder">
                  <div className="cg-admin__subsection-head">
                    <div>
                      <h3>Ready now</h3>
                      <p>The shell, routing, and project switcher are in place.</p>
                    </div>
                  </div>
                  <ul className="cg-admin__list">
                    <li>
                      <strong>Project switcher</strong>
                      <span>Switching projects now swaps the sidebar modules at the same time.</span>
                    </li>
                    <li>
                      <strong>Scoped navigation</strong>
                      <span>{currentProject.label} only shows the modules that belong to it.</span>
                    </li>
                    <li>
                      <strong>Next step</strong>
                      <span>Wire the selected module into this project and the shell will pick it up.</span>
                    </li>
                  </ul>
                </article>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminAppShell;