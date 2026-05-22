"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type AdminRouteKey = "overview" | "release-desk" | "booking" | "content" | "assets";
export type AdminNavGroup = "Operations" | "Content" | "System";
export type AdminProjectId = "walls-devine" | "bong-tour";

export type AdminNavItem = {
  href: "/admin/overview" | "/admin/release-desk" | "/admin/booking" | "/admin/content" | "/admin/assets";
  label: string;
  description: string;
  group: AdminNavGroup;
  routeKey: AdminRouteKey;
};

export type AdminProject = {
  id: AdminProjectId;
  label: string;
  statusLabel: string;
  isLive: boolean;
  description: string;
};

type AdminProjectContextValue = {
  currentProjectId: AdminProjectId;
  currentProject: AdminProject;
  currentPath: string;
  projectIsLive: boolean;
  projectNavItems: AdminNavItem[];
  projectNavGroups: AdminNavGroup[];
  currentNavItem: AdminNavItem;
  buildScopedHref: (href: string, projectId?: AdminProjectId) => string;
};

const adminProjects: Record<AdminProjectId, AdminProject> = {
  "walls-devine": {
    id: "walls-devine",
    label: "Walls/Devine",
    statusLabel: "Live",
    isLive: true,
    description: "Live release tools and content editing."
  },
  "bong-tour": {
    id: "bong-tour",
    label: "Bong Tour",
    statusLabel: "Next",
    isLive: false,
    description: "Treatment, pitch materials, and project assets live here next."
  }
};

const adminProjectNavItems: Record<AdminProjectId, AdminNavItem[]> = {
  "walls-devine": [
    {
      href: "/admin/overview",
      label: "Overview",
      description: "Status, focus, and next move.",
      group: "Operations",
      routeKey: "overview"
    },
    {
      href: "/admin/release-desk",
      label: "Release Desk",
      description: "Dates, checklist, and launch flow.",
      group: "Operations",
      routeKey: "release-desk"
    },
    {
      href: "/admin/booking",
      label: "Booking Engine",
      description: "Targets, filters, and lead matches.",
      group: "Operations",
      routeKey: "booking"
    },
    {
      href: "/admin/content",
      label: "Content Studio",
      description: "Notes, links, drafts, and journals.",
      group: "Content",
      routeKey: "content"
    },
    {
      href: "/admin/assets",
      label: "Assets & QA",
      description: "Audio checks and backend status.",
      group: "System",
      routeKey: "assets"
    }
  ],
  "bong-tour": [
    {
      href: "/admin/overview",
      label: "Overview",
      description: "Project status and access.",
      group: "Operations",
      routeKey: "overview"
    },
    {
      href: "/admin/content",
      label: "Treatment Studio",
      description: "Treatment copy, pitch notes, and locked materials.",
      group: "Content",
      routeKey: "content"
    },
    {
      href: "/admin/assets",
      label: "Pitch Assets",
      description: "Media, decks, and delivery-ready files.",
      group: "System",
      routeKey: "assets"
    }
  ]
};

const AdminProjectContext = createContext<AdminProjectContextValue | null>(null);

export function AdminProjectProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentProjectId: AdminProjectId = searchParams.get("project") === "bong-tour" ? "bong-tour" : "walls-devine";
  const currentProject = adminProjects[currentProjectId];
  const currentPath = pathname ?? "/admin/overview";
  const projectNavItems = adminProjectNavItems[currentProjectId];
  const currentNavItem = projectNavItems.find((item) => item.href === currentPath) ?? projectNavItems[0];
  const projectNavGroups = Array.from(new Set(projectNavItems.map((item) => item.group)));

  function getDefaultHref(projectId: AdminProjectId) {
    return adminProjectNavItems[projectId][0]?.href ?? "/admin/overview";
  }

  function projectSupportsHref(projectId: AdminProjectId, href: string) {
    return adminProjectNavItems[projectId].some((item) => item.href === href);
  }

  function buildScopedHref(href: string, projectId: AdminProjectId = currentProjectId) {
    const params = new URLSearchParams(searchParams.toString());
    const resolvedHref = projectSupportsHref(projectId, href) ? href : getDefaultHref(projectId);

    if (projectId === "walls-devine") {
      params.delete("project");
    } else {
      params.set("project", projectId);
    }

    const query = params.toString();
    return query ? `${resolvedHref}?${query}` : resolvedHref;
  }

  const value = useMemo<AdminProjectContextValue>(
    () => ({
      currentProjectId,
      currentProject,
      currentPath,
      projectIsLive: currentProject.isLive,
      projectNavItems,
      projectNavGroups,
      currentNavItem,
      buildScopedHref
    }),
    [currentNavItem, currentPath, currentProject, currentProjectId, projectNavGroups, projectNavItems, searchParams]
  );

  return <AdminProjectContext.Provider value={value}>{children}</AdminProjectContext.Provider>;
}

export function useAdminProject() {
  const context = useContext(AdminProjectContext);

  if (!context) {
    throw new Error("useAdminProject must be used within AdminProjectProvider.");
  }

  return context;
}