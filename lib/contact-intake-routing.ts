export type ContactRouteOverrides = {
  context?: string;
  inquiryType?: string;
  project?: string;
  goal?: string;
  surface?: string;
  engagement?: string;
  timeline?: string;
  budgetRange?: string;
};

export type ContactPrefill = {
  contextId: string;
  inquiryType: string;
  projectTitle: string;
  goal: string;
  surface: string;
  engagement: string;
  timeline: string;
  budgetRange: string;
};

export const contactQueryKeys = [
  "contact",
  "context",
  "inquiryType",
  "project",
  "projectTitle",
  "goal",
  "surface",
  "engagement",
  "timeline",
  "budgetRange"
] as const;

function toSearchParams(input?: string | URLSearchParams | { toString(): string }) {
  if (!input) {
    return new URLSearchParams();
  }

  if (typeof input === "string") {
    return new URLSearchParams(input.startsWith("?") ? input.slice(1) : input);
  }

  return new URLSearchParams(input.toString());
}

export function normalizeQueryToken(value: string | null) {
  return typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    : "";
}

export function buildContactPrefill(search: string | URLSearchParams | { toString(): string }): ContactPrefill {
  const params = toSearchParams(search);

  return {
    contextId: normalizeQueryToken(params.get("context")),
    inquiryType: normalizeQueryToken(params.get("inquiryType")),
    projectTitle: params.get("project")?.trim() ?? params.get("projectTitle")?.trim() ?? "",
    goal: normalizeQueryToken(params.get("goal")),
    surface: normalizeQueryToken(params.get("surface")),
    engagement: normalizeQueryToken(params.get("engagement")),
    timeline: normalizeQueryToken(params.get("timeline")),
    budgetRange: normalizeQueryToken(params.get("budgetRange"))
  };
}

export function hasContactModalIntent(search: string | URLSearchParams | { toString(): string }) {
  const params = toSearchParams(search);
  const contactValue = normalizeQueryToken(params.get("contact"));

  if (contactValue === "open" || contactValue === "1" || contactValue === "true") {
    return true;
  }

  return contactQueryKeys.some((key) => key !== "contact" && Boolean(params.get(key)));
}

export function stripContactModalSearch(search: string | URLSearchParams | { toString(): string }) {
  const params = toSearchParams(search);

  for (const key of contactQueryKeys) {
    params.delete(key);
  }

  return params.toString();
}

export function buildContactHref({
  pathname,
  currentSearch,
  overrides = {}
}: {
  pathname?: string;
  currentSearch?: string | URLSearchParams | { toString(): string };
  overrides?: ContactRouteOverrides;
}) {
  const params = currentSearch ? toSearchParams(currentSearch) : new URLSearchParams();

  for (const key of contactQueryKeys) {
    params.delete(key);
  }

  params.set("contact", "open");

  const entries: Array<[keyof ContactRouteOverrides, string | undefined]> = [
    ["context", overrides.context],
    ["inquiryType", overrides.inquiryType],
    ["project", overrides.project],
    ["goal", overrides.goal],
    ["surface", overrides.surface],
    ["engagement", overrides.engagement],
    ["timeline", overrides.timeline],
    ["budgetRange", overrides.budgetRange]
  ];

  for (const [key, value] of entries) {
    if (value && value.trim()) {
      params.set(key, value.trim());
    }
  }

  const nextSearch = params.toString();

  if (!pathname) {
    return `?${nextSearch}`;
  }

  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}`;
}