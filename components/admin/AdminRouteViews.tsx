"use client";

import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { httpsCallable } from "firebase/functions";

import {
  countBookingTargetsByStatus,
  formatBookingCategory,
  formatBookingContactMethod,
  formatBookingContactStatus,
  formatBookingPriority,
  formatBookingTargetStatus,
  isBookingRoutingStatus,
  getBookingTargetsForWindow
} from "@/lib/admin/booking-engine";
import type {
  AdminAudioAnalysis,
  AdminMarkdownCollection,
  AdminMarkdownFile,
  BookingAvailabilityWindow,
  BookingTarget,
  BookingTargetStatus
} from "@/lib/admin/types";
import { firebaseFunctions } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { cx } from "@/lib/cx";

import { AdminFirebaseStatus } from "./AdminFirebaseStatus";
import { AdminLinkHubEditor } from "./AdminLinkHubEditor";
import { ReleaseDeskTimeline } from "./ReleaseDeskTimeline";
import { getAdminMarkdownCreateKey, getAdminMarkdownSaveKey, useAdminWorkspace } from "./AdminWorkspaceProvider";
import { Button } from "@/components/ui/Button";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});

const bookingStatusOptions: Array<BookingTargetStatus | "all"> = [
  "all",
  "seeded",
  "researching",
  "outreach-ready",
  "contacted",
  "in-conversation",
  "hold",
  "confirmed"
];

const bookingPriorityOrder = {
  critical: 0,
  high: 1,
  medium: 2
} as const;

const bookingStatusOrder = {
  confirmed: 0,
  hold: 1,
  "in-conversation": 2,
  contacted: 3,
  "outreach-ready": 4,
  researching: 5,
  seeded: 6
} as const;

const bookingCategoryOptions = [
  { value: "all", label: "All categories" },
  { value: "venue", label: "Venue" },
  { value: "radio", label: "Radio" },
  { value: "podcast", label: "Podcast" },
  { value: "festival", label: "Festival" },
  { value: "press", label: "Press" }
] as const;

const bookingPriorityOptions = [
  { value: "all", label: "All priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" }
] as const;

const bookingSortOptions = [
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "name", label: "Name" },
  { value: "market", label: "Market" }
] as const;

const dayInMs = 24 * 60 * 60 * 1000;

type BookingContactEnrichmentResponse = {
  searchQuery?: string;
  searchUrl?: string;
  targetName?: string;
  market?: string;
  notes?: string[];
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return dateFormatter.format(date);
}

function formatDateTime(value: string | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
}

function formatDateWindow(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }

  return `${monthDayFormatter.format(start)} - ${monthDayFormatter.format(end)}`;
}

function toDateInputValue(value: string | undefined) {
  if (!value) {
    return "";
  }

  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}

function formatRoutingRange(startDate: string | undefined, endDate: string | undefined) {
  if (!startDate || !endDate) {
    return "Not scheduled";
  }

  if (toDateInputValue(startDate) === toDateInputValue(endDate)) {
    return formatDate(startDate);
  }

  return formatDateWindow(startDate, endDate);
}

function buildBookingContactSearchQuery(targetName: string, market: string) {
  return `"${targetName}" "${market}" ("talent buyer" OR booking OR promoter OR "booking contact") (email OR contact)`;
}

function buildBookingContactSearchUrl(targetName: string, market: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(buildBookingContactSearchQuery(targetName, market))}`;
}

function parseTimelineDate(value: string | undefined, endOfDay = false) {
  if (!value) {
    return null;
  }

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${endOfDay ? "23:59:59" : "00:00:00"}`
    : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getTimelineMetrics(rangeStartMs: number, rangeEndMs: number, startValue: string, endValue: string) {
  const start = parseTimelineDate(startValue);
  const end = parseTimelineDate(endValue, true) ?? start;

  if (!start || !end) {
    return null;
  }

  const total = Math.max(rangeEndMs - rangeStartMs, dayInMs);
  const left = ((start.getTime() - rangeStartMs) / total) * 100;
  const width = Math.max(((end.getTime() - start.getTime()) / total) * 100, 2.5);

  return {
    left: `${Math.max(0, Math.min(left, 100))}%`,
    width: `${Math.max(width, 2.5)}%`
  };
}

function BookingRoutingTimeline({
  availability,
  targets,
  onOpenTarget
}: {
  availability: BookingAvailabilityWindow[];
  targets: BookingTarget[];
  onOpenTarget: (targetId: string) => void;
}) {
  const windowsWithDates = useMemo(
    () =>
      availability
        .map((window) => {
          const start = parseTimelineDate(window.startDate);
          const end = parseTimelineDate(window.endDate, true);

          if (!start || !end) {
            return null;
          }

          return { window, start, end };
        })
        .filter(Boolean) as Array<{ window: BookingAvailabilityWindow; start: Date; end: Date }>,
    [availability]
  );
  const routedTargets = useMemo(
    () =>
      targets
        .filter((target) => isBookingRoutingStatus(target.status) && target.routingStart && target.routingEnd)
        .sort((left, right) => (left.routingStart ?? "").localeCompare(right.routingStart ?? "")),
    [targets]
  );

  const timelineBounds = useMemo(() => {
    const windowTimestamps = windowsWithDates.flatMap(({ start, end }) => [start.getTime(), end.getTime()]);
    const routingTimestamps = routedTargets.flatMap((target) => {
      const start = parseTimelineDate(target.routingStart);
      const end = parseTimelineDate(target.routingEnd, true);

      return start && end ? [start.getTime(), end.getTime()] : [];
    });
    const values = [...windowTimestamps, ...routingTimestamps];

    if (!values.length) {
      return null;
    }

    return {
      start: Math.min(...values),
      end: Math.max(...values)
    };
  }, [routedTargets, windowsWithDates]);

  const scaleTicks = useMemo(() => {
    if (!timelineBounds) {
      return [];
    }

    return Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const value = new Date(timelineBounds.start + (timelineBounds.end - timelineBounds.start) * ratio);

      return {
        label: monthDayFormatter.format(value),
        left: `${ratio * 100}%`
      };
    });
  }, [timelineBounds]);

  if (!windowsWithDates.length || !timelineBounds) {
    return null;
  }

  return (
    <article className="cg-admin__panel cg-admin-booking__timeline-panel">
      <div className="cg-admin__subsection-head">
        <div>
          <h3>Routing timeline</h3>
          <p>Availability windows stay visible while active holds and confirmed dates overlay on top.</p>
        </div>
        <p className="cg-admin__path-note">{routedTargets.length} routed target{routedTargets.length === 1 ? "" : "s"}</p>
      </div>

      <div className="cg-admin-booking__timeline-scale" aria-hidden="true">
        {scaleTicks.map((tick) => (
          <span key={tick.left} style={{ left: tick.left }}>
            {tick.label}
          </span>
        ))}
      </div>

      <div className="cg-admin-booking__timeline-rows">
        {windowsWithDates.map(({ window, start, end }) => {
          const rowTargets = routedTargets.filter((target) => target.targetWindowId === window.id);
          const windowMetrics = getTimelineMetrics(timelineBounds.start, timelineBounds.end, window.startDate, window.endDate);

          return (
            <div key={window.id} className="cg-admin-booking__timeline-row">
              <div className="cg-admin-booking__timeline-row-copy">
                <strong>{window.label}</strong>
                <span>{window.market}</span>
                <small>{formatDateWindow(window.startDate, window.endDate)}</small>
              </div>

              <div className="cg-admin-booking__timeline-track" style={{ minHeight: `${4.5 + rowTargets.length * 2.2}rem` }}>
                <div className="cg-admin-booking__timeline-track-line" />
                {windowMetrics ? (
                  <div className="cg-admin-booking__timeline-window" style={{ left: windowMetrics.left, width: windowMetrics.width }}>
                    <span>{window.bookingTypes.join(" / ")}</span>
                  </div>
                ) : null}

                {rowTargets.map((target, index) => {
                  const metrics = getTimelineMetrics(
                    timelineBounds.start,
                    timelineBounds.end,
                    target.routingStart ?? "",
                    target.routingEnd ?? target.routingStart ?? ""
                  );

                  if (!metrics) {
                    return null;
                  }

                  return (
                    <button
                      key={target.id}
                      type="button"
                      className={cx(
                        "cg-admin-booking__timeline-target",
                        target.status === "confirmed" && "cg-admin-booking__timeline-target--confirmed"
                      )}
                      style={{ left: metrics.left, width: metrics.width, top: `${2.35 + index * 2.15}rem` }}
                      onClick={() => onOpenTarget(target.id)}
                    >
                      <span>{target.name}</span>
                      <small>{formatBookingTargetStatus(target.status)}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function BookingTargetDrawer({
  target,
  targetWindow,
  canEdit,
  saveState,
  enrichmentState,
  enrichmentMessage,
  onClose,
  onSave,
  onFindContactInfo
}: {
  target: BookingTarget;
  targetWindow: BookingAvailabilityWindow | null;
  canEdit: boolean;
  saveState: string | undefined;
  enrichmentState: string | undefined;
  enrichmentMessage: { tone: "success" | "error" | "note"; text: string } | undefined;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>, targetId: string) => Promise<void>;
  onFindContactInfo: (target: BookingTarget, market: string) => Promise<void>;
}) {
  const headingId = useId();
  const [draftStatus, setDraftStatus] = useState<BookingTargetStatus>(target.status);
  const routingEnabled = draftStatus === "hold" || draftStatus === "confirmed";
  const marketLabel = targetWindow?.market ?? `${target.city}, ${target.state}`;

  useEffect(() => {
    setDraftStatus(target.status);
  }, [target.id, target.status]);

  return (
    <div className="cg-admin-drawer" aria-hidden={false}>
      <button type="button" className="cg-admin-drawer__scrim" aria-label="Close target drawer" onClick={onClose} />
      <aside className="cg-admin-drawer__panel" role="dialog" aria-modal="true" aria-labelledby={headingId}>
        <div className="cg-admin-drawer__header">
          <div>
            <span className="cg-admin-shell__eyebrow">Booking target</span>
            <h3 id={headingId}>{target.name}</h3>
            <p>
              {target.city}, {target.state} · {formatBookingCategory(target.category)} · {formatBookingPriority(target.priority)}
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <form key={target.id} onSubmit={(event) => onSave(event, target.id)} className="cg-admin-drawer__form">
          <div className="cg-admin-drawer__body">
            <article className="cg-admin-booking__drawer-summary">
              <div className="cg-admin-booking__drawer-summary-row">
                <div>
                  <strong>Target window</strong>
                  <span>{targetWindow ? `${targetWindow.label} · ${formatDateWindow(targetWindow.startDate, targetWindow.endDate)}` : "Window pending"}</span>
                </div>
                <div>
                  <strong>Desired outcome</strong>
                  <span>{target.desiredOutcome}</span>
                </div>
              </div>
              <p>{target.fitNote}</p>
              <div className="cg-admin__booking-tags" aria-label="Booking target tags">
                {target.tags.map((tag) => (
                  <span key={tag} className="cg-admin__booking-chip">
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </article>

            <div className="cg-admin__editor-split">
              <label className="cg-admin__editor-field">
                <span>Status</span>
                <select
                  name="status"
                  value={draftStatus}
                  className="cg-admin__editor-input"
                  disabled={!canEdit || saveState === "saving"}
                  onChange={(event) => setDraftStatus(event.target.value as BookingTargetStatus)}
                >
                  {bookingStatusOptions.filter((status): status is BookingTargetStatus => status !== "all").map((status) => (
                    <option key={status} value={status}>
                      {formatBookingTargetStatus(status)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="cg-admin-booking__drawer-stat">
                <span>Routing</span>
                <strong>{formatRoutingRange(target.routingStart, target.routingEnd)}</strong>
                <small>{target.routingGCalEventId ? "Google Calendar linked" : "Calendar sync starts when dates are set"}</small>
              </div>
            </div>

            <section className="cg-admin__stack">
              <div className="cg-admin__subsection-head">
                <div>
                  <h4>Contacts</h4>
                  <p>{marketLabel}</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void onFindContactInfo(target, marketLabel)}
                  disabled={enrichmentState === "saving"}
                >
                  {enrichmentState === "saving" ? "Finding…" : "Find contact info"}
                </Button>
              </div>

              {enrichmentMessage ? (
                <p
                  className={cx(
                    "cg-admin__save-note",
                    enrichmentMessage.tone === "success" && "cg-admin__save-note--success",
                    enrichmentMessage.tone === "error" && "cg-admin__save-note--error"
                  )}
                >
                  {enrichmentMessage.text}
                </p>
              ) : null}

              <ul className="cg-admin__lead-list cg-admin__booking-contact-list">
                {target.contacts.map((contact) => {
                  const href = getContactHref(contact.method, contact.value || contact.sourceUrl);
                  const displayValue = contact.value || contact.sourceUrl || "Contact route pending";

                  return (
                    <li key={`${target.id}-${contact.label}`} className="cg-admin__lead-item">
                      <div>
                        <strong>{contact.label}</strong>
                        <span>
                          {contact.role} · {formatBookingContactMethod(contact.method)}
                        </span>
                      </div>
                      <div className="cg-admin__lead-meta">
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer">
                            {displayValue}
                          </a>
                        ) : (
                          <span>{displayValue}</span>
                        )}
                        <span>{contact.note}</span>
                        <span>{contact.verifiedAt ? `Verified ${contact.verifiedAt}` : "Verification pending"}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="cg-admin__stack">
              <div className="cg-admin__subsection-head">
                <div>
                  <h4>Routing dates</h4>
                  <p>Hold and confirmed targets create tagged Google Calendar events as [TOUR HOLD] or [TOUR CONFIRMED].</p>
                </div>
              </div>

              {routingEnabled ? (
                <div className="cg-admin__editor-split">
                  <label className="cg-admin__editor-field">
                    <span>Start date</span>
                    <input
                      name="routingStart"
                      type="date"
                      className="cg-admin__editor-input"
                      defaultValue={toDateInputValue(target.routingStart)}
                      disabled={!canEdit || saveState === "saving"}
                    />
                  </label>
                  <label className="cg-admin__editor-field">
                    <span>End date</span>
                    <input
                      name="routingEnd"
                      type="date"
                      className="cg-admin__editor-input"
                      defaultValue={toDateInputValue(target.routingEnd)}
                      disabled={!canEdit || saveState === "saving"}
                    />
                  </label>
                </div>
              ) : (
                <p className="cg-admin__helper">Set the status to Hold or Confirmed to attach routing dates and calendar sync.</p>
              )}
            </section>

            <label className="cg-admin__editor-field">
              <span>Working notes</span>
              <textarea
                name="notes"
                rows={7}
                defaultValue={target.notes}
                className="cg-admin__editor-textarea"
                disabled={!canEdit || saveState === "saving"}
              />
            </label>

            <AdminAdvancedDetails summary="Advanced">
              <p>Booking board path</p>
              <p>{firebaseAdminPaths.adminProjectsCollection}/{firebaseAdminPaths.wallsDevineProjectId}.{firebaseAdminPaths.bookingBoardField}.targets[{target.id}]</p>
              <p>Routing sync path</p>
              <p>{firebaseAdminPaths.bookingRoutingTasksCollection}/{target.id}</p>
              <p>Google Calendar event</p>
              <p>{target.routingGCalEventId ?? "Not linked yet"}</p>
            </AdminAdvancedDetails>
          </div>

          <div className="cg-admin-drawer__footer">
            <div className="cg-admin-drawer__status">
              {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
              {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
              {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this target.</p> : null}
              {!canEdit ? <p className="cg-admin__save-note">Booking updates unlock once Firebase admin data is ready.</p> : null}
            </div>

            <div className="cg-admin-drawer__footer-actions">
              <Button type="submit" variant="primary" size="sm" disabled={!canEdit || saveState === "saving"}>
                Save target
              </Button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}

function getContactHref(method: string, value: string) {
  if (!value) {
    return "";
  }

  if (method === "email" && !value.startsWith("mailto:")) {
    return `mailto:${value}`;
  }

  if (method === "phone" && !value.startsWith("tel:")) {
    return `tel:${value.replace(/\s+/g, "")}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return "";
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

function truncateText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function AdminAdvancedDetails({ summary = "Advanced", children }: { summary?: string; children: ReactNode }) {
  return (
    <details className="cg-admin__advanced">
      <summary>{summary}</summary>
      <div className="cg-admin__advanced-body">{children}</div>
    </details>
  );
}

function AdminRouteHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="cg-admin-route__header">
      <div className="cg-admin-route__header-copy">
        <span className="cg-admin-shell__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="cg-admin-route__header-actions">{actions}</div> : null}
    </div>
  );
}

function AdminMetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="cg-admin__whiteboard-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

type ContentTabId = "collector-note" | "link-hub" | "drafts" | "journals";

type MarkdownDrawerState =
  | {
      mode: "create";
      collection: AdminMarkdownCollection;
    }
  | {
      mode: "edit";
      collection: AdminMarkdownCollection;
      slug: string;
    };

type MarkdownLibraryConfig = {
  title: string;
  description: string;
  createButtonLabel: string;
  saveButtonLabel: string;
  emptyTitle: string;
  emptyBody: string;
  firestorePath: string;
};

const markdownLibraryConfigs: Record<AdminMarkdownCollection, MarkdownLibraryConfig> = {
  "instagram-posts": {
    title: "Drafts",
    description: "Release copy lives in a tighter table, then opens in the side editor when you need it.",
    createButtonLabel: "New draft",
    saveButtonLabel: "Save draft",
    emptyTitle: "No drafts loaded yet",
    emptyBody: "This list fills in once live content reconnects.",
    firestorePath: `${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/instagram-posts--{slug}`
  },
  journals: {
    title: "Journals",
    description: "Long-form story pages use the same table-plus-drawer flow.",
    createButtonLabel: "New journal",
    saveButtonLabel: "Save journal",
    emptyTitle: "No journals loaded yet",
    emptyBody: "This list fills in once live content reconnects.",
    firestorePath: `${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/journals--{slug}`
  }
};

function normalizeEditorSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripMarkdownHeading(content: string) {
  return content.replace(/^#\s+.+(?:\r?\n){1,2}/, "").trimStart();
}

function MarkdownLibraryTable({
  config,
  files,
  isScaffoldMode,
  disabled,
  onCreate,
  onOpen
}: {
  config: MarkdownLibraryConfig;
  files: AdminMarkdownFile[];
  isScaffoldMode: boolean;
  disabled: boolean;
  onCreate: () => void;
  onOpen: (slug: string) => void;
}) {
  return (
    <section className="cg-admin-content__section">
      <article className="cg-admin__panel cg-admin-content__panel">
        <div className="cg-admin-content__panel-head">
          <div>
            <h3>{config.title}</h3>
            <p>{config.description}</p>
          </div>
          <div className="cg-admin-content__panel-actions">
            <span className="cg-admin-content__count-pill">{files.length} item{files.length === 1 ? "" : "s"}</span>
            <Button type="button" variant="primary" size="sm" onClick={onCreate} disabled={disabled}>
              {config.createButtonLabel}
            </Button>
          </div>
        </div>

        {files.length ? (
          <div className="cg-admin-table-wrap">
            <table className="cg-admin-table cg-admin-table--content cg-admin-content__table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Preview</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.slug}>
                    <td>
                      <button type="button" className="cg-admin-content__row-trigger" onClick={() => onOpen(file.slug)}>
                        <span>{file.title}</span>
                        <small>Open editor</small>
                      </button>
                    </td>
                    <td>{file.slug}</td>
                    <td>{formatDateTime(file.updatedAt)}</td>
                    <td className="cg-admin-table__cell--preview">
                      <span className="cg-admin-table__preview" title={file.preview}>
                        {truncateText(file.preview, 96)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <article className="cg-admin__backlog-empty cg-admin-content__empty">
            <h3>{config.emptyTitle}</h3>
            <p>{isScaffoldMode ? config.emptyBody : `${config.emptyBody} This collection will appear once Firestore markdown sync is ready.`}</p>
          </article>
        )}
      </article>
    </section>
  );
}

function MarkdownEditorDrawer({
  state,
  file,
  config,
  hasLiveMarkdownContent,
  createState,
  saveState,
  onClose,
  onCreate,
  onSave,
  onDelete
}: {
  state: MarkdownDrawerState;
  file: AdminMarkdownFile | null;
  config: MarkdownLibraryConfig;
  hasLiveMarkdownContent: boolean;
  createState?: string;
  saveState?: string;
  onClose: () => void;
  onCreate: (event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection) => Promise<void>;
  onSave: (event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection, slug: string) => Promise<void>;
  onDelete: (collection: AdminMarkdownCollection, slug: string) => void;
}) {
  const headingId = useId();
  const isCreate = state.mode === "create";
  const isBusy = isCreate ? createState === "saving" : saveState === "saving" || saveState === "deleting";
  const bodyValue = file ? stripMarkdownHeading(file.content) : "";
  const singularLabel = config.title.endsWith("s") ? config.title.slice(0, -1).toLowerCase() : config.title.toLowerCase();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isCreate) {
      await onCreate(event, state.collection);
      return;
    }

    await onSave(event, state.collection, state.slug);
  }

  return (
    <div className="cg-admin-drawer" aria-hidden={false}>
      <button type="button" className="cg-admin-drawer__scrim" aria-label="Close editor" onClick={onClose} />
      <aside className="cg-admin-drawer__panel" role="dialog" aria-modal="true" aria-labelledby={headingId}>
        <div className="cg-admin-drawer__header">
          <div>
            <span className="cg-admin-shell__eyebrow">{config.title}</span>
            <h3 id={headingId}>{isCreate ? `Create ${singularLabel}` : file?.title ?? config.title}</h3>
            <p>{isCreate ? "Set the title, slug, and body here. The title becomes the top heading automatically." : `Updated ${formatDateTime(file?.updatedAt)}`}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {!isCreate && !file ? (
          <div className="cg-admin-drawer__empty-state">
            <p className="cg-admin__helper">Refreshing this editor after the latest content change.</p>
          </div>
        ) : (
          <form key={isCreate ? `${state.collection}-create` : `${state.collection}-${state.slug}`} onSubmit={handleSubmit} className="cg-admin-drawer__form">
            <div className="cg-admin-drawer__body">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Title</span>
                  <input
                    name="title"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={file?.title ?? ""}
                    required
                    disabled={!hasLiveMarkdownContent || isBusy}
                  />
                </label>
                <label className="cg-admin__editor-field">
                  <span>Slug</span>
                  <input
                    name="slug"
                    type="text"
                    className="cg-admin__editor-input"
                    defaultValue={file?.slug ?? ""}
                    spellCheck={false}
                    disabled={!hasLiveMarkdownContent || isBusy}
                  />
                </label>
              </div>

              <label className="cg-admin__editor-field">
                <span>Body</span>
                <textarea
                  name="content"
                  className="cg-admin__editor-textarea cg-admin-drawer__textarea"
                  rows={20}
                  defaultValue={bodyValue}
                  spellCheck={false}
                  disabled={!hasLiveMarkdownContent || isBusy}
                />
              </label>

              <AdminAdvancedDetails summary="Advanced">
                <p>Live source</p>
                <p>{config.firestorePath}</p>
                {file ? (
                  <>
                    <p>Current file</p>
                    <p>{file.filePath}</p>
                  </>
                ) : null}
              </AdminAdvancedDetails>
            </div>

            <div className="cg-admin-drawer__footer">
              <div className="cg-admin-drawer__status">
                {!hasLiveMarkdownContent ? <p className="cg-admin__save-note">Editing unlocks after content sync finishes.</p> : null}
                {createState === "saving" ? <p className="cg-admin__save-note">Creating…</p> : null}
                {createState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Created.</p> : null}
                {createState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not create this item.</p> : null}
                {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                {saveState === "deleting" ? <p className="cg-admin__save-note">Deleting…</p> : null}
                {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this item.</p> : null}
              </div>

              <div className="cg-admin-drawer__footer-actions">
                {!isCreate && state.mode === "edit" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(state.collection, state.slug)} disabled={!hasLiveMarkdownContent || isBusy}>
                    Delete
                  </Button>
                ) : null}
                <Button type="submit" variant="primary" size="sm" disabled={!hasLiveMarkdownContent || isBusy}>
                  {isCreate ? config.createButtonLabel : config.saveButtonLabel}
                </Button>
              </div>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

export function AdminOverviewRoute() {
  const { adminViewData, bookingLeadMatches, completedChecklist, bookingGoalCountdown, routeStatuses, liveRouteCount, handleForceSync, dataLoading } = useAdminWorkspace();
  const releaseFocusItems = Array.from(
    new Set([...adminViewData.bookingBoard.goal.nextMoves, ...adminViewData.plan.recommendedSetup, ...adminViewData.plan.guidance])
  ).slice(0, 4);
  const laneCards = [
    {
      href: "/admin/release-desk",
      title: "Release Desk",
      summary: `${completedChecklist}/${adminViewData.plan.checklist.length} tasks complete`,
      status: routeStatuses["release-desk"]
    },
    {
      href: "/admin/booking",
      title: "Booking Engine",
      summary: `${adminViewData.bookingBoard.targets.length} targets · ${bookingLeadMatches.length} booking-fit leads`,
      status: routeStatuses.booking
    },
    {
      href: "/admin/content",
      title: "Content Studio",
      summary: `${adminViewData.instagramDrafts.length + adminViewData.journalEntries.length} live markdown docs`,
      status: routeStatuses.content
    },
    {
      href: "/admin/assets",
      title: "Assets & QA",
      summary: `${routeStatuses.assets === "live" ? "Audio metadata loaded" : "Waiting on analysis"}`,
      status: routeStatuses.assets
    }
  ] as const;

  return (
    <div className="cg-admin-route">
      <AdminRouteHeader
        eyebrow="Operations"
        title="Overview"
        description="Primary goal, release posture, and the few routes that matter right now."
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleForceSync} disabled={dataLoading}>
            {dataLoading ? "Syncing…" : "Force sync"}
          </Button>
        }
      />

      <section className="cg-admin__whiteboard" aria-label="Overview whiteboard">
        <div className="cg-admin__whiteboard-grid">
          <article className="cg-admin__whiteboard-card cg-admin__whiteboard-card--goal">
            <span className="cg-admin__whiteboard-card-label">Primary goal</span>
            <h3>{adminViewData.bookingBoard.goal.title}</h3>
            <p>{adminViewData.bookingBoard.goal.summary}</p>
            <p className="cg-admin__whiteboard-card-note">Success metric: {adminViewData.bookingBoard.goal.successMetric}</p>
          </article>

          <article className="cg-admin__whiteboard-card">
            <span className="cg-admin__whiteboard-card-label">Locked schedule</span>
            <h3>{adminViewData.plan.lockedDates[0]?.value ?? "Schedule pending"}</h3>
            <ul className="cg-admin__list">
              {adminViewData.plan.lockedDates.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__whiteboard-card">
            <span className="cg-admin__whiteboard-card-label">Whiteboard</span>
            <h3>Keep the few launch-moving tasks visible.</h3>
            <ul className="cg-admin__bullet-list">
              {releaseFocusItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="cg-admin__whiteboard-card">
            <span className="cg-admin__whiteboard-card-label">Open a lane</span>
            <h3>Jump into the module you actually need.</h3>
            <div className="cg-admin-route__action-list">
              <Link href="/admin/release-desk">Release desk</Link>
              <Link href="/admin/booking">Booking engine</Link>
              <Link href="/admin/content">Content studio</Link>
              <Link href="/admin/assets">Assets &amp; QA</Link>
            </div>
          </article>
        </div>

        <div className="cg-admin__whiteboard-strip">
          <AdminMetricCard label="Booking-fit Leads" value={String(bookingLeadMatches.length)} detail="matched against the current seeded board" />
          <AdminMetricCard label="Release Tasks" value={`${completedChecklist}/${adminViewData.plan.checklist.length}`} detail="checklist items complete" />
          <AdminMetricCard label="Live Lanes" value={`${liveRouteCount}/5`} detail="routes fully hydrated and ready" />
          <AdminMetricCard label="Lock Date" value={formatDate(adminViewData.bookingBoard.goal.lockByDate)} detail={bookingGoalCountdown} />
        </div>
      </section>

      <section className="cg-admin-route__lane-grid" aria-label="Route status">
        {laneCards.map((lane) => (
          <Link key={lane.href} href={lane.href} className="cg-admin-route__lane-card">
            <div>
              <span className="cg-admin-shell__eyebrow">{lane.status === "live" ? "Live" : "Pending"}</span>
              <h3>{lane.title}</h3>
              <p>{lane.summary}</p>
            </div>
            <span className={cx("cg-admin__status-badge", lane.status === "live" ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending")}>
              {lane.status === "live" ? "Ready" : "Syncing"}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

export function AdminReleaseDeskRoute() {
  const { adminData, adminViewData, completedChecklist, bookingGoalCountdown, handleChecklistToggle } = useAdminWorkspace();
  const syncReadyTaskCount = adminViewData.plan.checklist.filter((item) => Boolean((item.summary ?? item.title) && (item.description ?? item.notes) && item.start && item.end)).length;
  const linkedTaskCount = adminViewData.plan.checklist.filter((item) => Boolean(item.gCalEventId)).length;

  return (
    <div className="cg-admin-route">
      <AdminRouteHeader
        eyebrow="Operations"
        title="Release Desk"
        description="A calendar-first view of the rollout, with task details tucked into a focused side panel."
      />

      <div className="cg-admin-route__metric-grid">
        <AdminMetricCard label="Tasks Complete" value={`${completedChecklist}/${adminViewData.plan.checklist.length}`} detail="release checklist progress" />
        <AdminMetricCard label="Lock Date" value={formatDate(adminViewData.bookingBoard.goal.lockByDate)} detail={bookingGoalCountdown} />
        <AdminMetricCard label="Calendar Steps" value={String(adminViewData.plan.calendar.length)} detail="milestones on the release timeline" />
        <AdminMetricCard label="Sync Ready" value={`${syncReadyTaskCount}/${adminViewData.plan.checklist.length}`} detail={`${linkedTaskCount} linked to Google Calendar`} />
      </div>

      <div className="cg-admin-route__grid cg-admin-route__grid--two">
        <article className="cg-admin__panel">
          <div className="cg-admin__status-row">
            <h3>Primary goal</h3>
            <span className="cg-admin__status-badge cg-admin__status-badge--ready">{bookingGoalCountdown}</span>
          </div>
          <p>{adminViewData.bookingBoard.goal.title}</p>
          <p className="cg-admin__path-note">{adminViewData.bookingBoard.goal.summary}</p>
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
          <details className="cg-admin__advanced">
            <summary>Google Calendar prep</summary>
            <div className="cg-admin__advanced-body">
              <p>Enable the Google Calendar API in the linked GCP project.</p>
              <p>Share the target calendar with the Functions service account before turning sync on.</p>
            </div>
          </details>
        </article>
      </div>

      <ReleaseDeskTimeline plan={adminViewData.plan} canEdit={Boolean(adminData)} onToggleTask={handleChecklistToggle} />
    </div>
  );
}

export function AdminBookingRoute() {
  const { adminData, adminViewData, bookingLeadMatches, bookingTargetSaveStates, ecosystemLeads, handleBookingTargetSave } = useAdminWorkspace();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingTargetStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<"priority" | "status" | "name" | "market">("priority");
  const [drawerTargetId, setDrawerTargetId] = useState<string | null>(null);
  const [enrichmentStates, setEnrichmentStates] = useState<Record<string, string | undefined>>({});
  const [enrichmentMessages, setEnrichmentMessages] = useState<Record<string, { tone: "success" | "error" | "note"; text: string }>>({});
  const board = adminViewData.bookingBoard;
  const windowById = useMemo(() => new Map(board.availability.map((window) => [window.id, window])), [board.availability]);
  const statusCounts = useMemo(() => countBookingTargetsByStatus(board), [board]);
  const filteredTargets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...board.targets]
      .filter((target) => {
        if (statusFilter !== "all" && target.status !== statusFilter) {
          return false;
        }

        if (categoryFilter !== "all" && target.category !== categoryFilter) {
          return false;
        }

        if (priorityFilter !== "all" && target.priority !== priorityFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const haystack = [target.name, target.city, target.state, target.fitNote, target.desiredOutcome, target.tags.join(" ")].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((left, right) => {
        if (sortKey === "priority") {
          return bookingPriorityOrder[left.priority] - bookingPriorityOrder[right.priority] || left.name.localeCompare(right.name);
        }

        if (sortKey === "status") {
          return bookingStatusOrder[left.status] - bookingStatusOrder[right.status] || left.name.localeCompare(right.name);
        }

        if (sortKey === "market") {
          return `${left.state}-${left.city}`.localeCompare(`${right.state}-${right.city}`) || left.name.localeCompare(right.name);
        }

        return left.name.localeCompare(right.name);
      });
  }, [board.targets, categoryFilter, priorityFilter, query, sortKey, statusFilter]);
  const selectedTarget = drawerTargetId ? board.targets.find((target) => target.id === drawerTargetId) ?? null : null;
  const criticalTargets = board.targets.filter((target) => target.priority === "critical").length;
  const availabilityRows = board.availability.map((window) => ({
    ...window,
    targetCount: getBookingTargetsForWindow(board, window.id).length,
    leadCount: bookingLeadMatches.filter((match) => match.window?.id === window.id).length
  }));

  useEffect(() => {
    if (!selectedTarget) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerTargetId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTarget]);

  async function handleFindContactInfo(target: BookingTarget, market: string) {
    const fallbackSearchUrl = buildBookingContactSearchUrl(target.name, market);
    const popup = typeof window !== "undefined" ? window.open("", "_blank", "noopener,noreferrer") : null;

    setEnrichmentStates((current) => ({ ...current, [target.id]: "saving" }));
    setEnrichmentMessages((current) => ({
      ...current,
      [target.id]: { tone: "note", text: "Building a market-specific contact search…" }
    }));

    try {
      let searchUrl = fallbackSearchUrl;

      if (firebaseFunctions) {
        const enrichBookingContact = httpsCallable<{ targetName: string; market: string; category: string }, BookingContactEnrichmentResponse>(
          firebaseFunctions,
          "enrichBookingContact"
        );
        const response = await enrichBookingContact({
          targetName: target.name,
          market,
          category: target.category
        });

        searchUrl = response.data.searchUrl || fallbackSearchUrl;
      }

      if (popup) {
        popup.location.href = searchUrl;
      } else {
        window.open(searchUrl, "_blank", "noopener,noreferrer");
      }

      setEnrichmentStates((current) => ({ ...current, [target.id]: "success" }));
      setEnrichmentMessages((current) => ({
        ...current,
        [target.id]: { tone: "success", text: "Opened a tailored promoter search in a new tab." }
      }));
    } catch {
      if (popup) {
        popup.location.href = fallbackSearchUrl;
      } else {
        window.open(fallbackSearchUrl, "_blank", "noopener,noreferrer");
      }

      setEnrichmentStates((current) => ({ ...current, [target.id]: "error" }));
      setEnrichmentMessages((current) => ({
        ...current,
        [target.id]: { tone: "error", text: "The callable stub is not ready yet, so a fallback Google search was opened instead." }
      }));
    }
  }

  return (
    <div className="cg-admin-route">
      <AdminRouteHeader
        eyebrow="Operations"
        title="Booking Engine"
        description="Use a compact routing board, then open a focused side drawer for scheduling, notes, and contact research."
      />

      <div className="cg-admin-route__metric-grid">
        <AdminMetricCard label="Seeded Targets" value={String(board.targets.length)} detail="active rows in the target table" />
        <AdminMetricCard label="Critical Targets" value={String(criticalTargets)} detail="highest-priority targets still in play" />
        <AdminMetricCard label="Booking-fit Leads" value={String(bookingLeadMatches.length)} detail="guided-intake leads matched to this board" />
        <AdminMetricCard label="Active Windows" value={String(board.availability.length)} detail="availability windows on the board" />
      </div>

      <BookingRoutingTimeline availability={board.availability} targets={board.targets} onOpenTarget={setDrawerTargetId} />

      <article className="cg-admin__panel">
        <div className="cg-admin__subsection-head">
          <div>
            <h3>Seeded targets</h3>
            <p>Use the compact board to triage the route, then open a target to schedule dates or research contacts.</p>
          </div>
          <p className="cg-admin__path-note">Project doc: bookingBoard.targets</p>
        </div>

        <div className="cg-admin-booking__filter-bar" role="search">
          <label className="cg-admin-booking__filter cg-admin-booking__filter--search">
            <span>Search</span>
            <input type="search" className="cg-admin__editor-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search target, city, tags, or fit note" />
          </label>
          <label className="cg-admin-booking__filter">
            <span>Status</span>
            <select className="cg-admin__editor-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BookingTargetStatus | "all")}>
              {bookingStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : formatBookingTargetStatus(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="cg-admin-booking__filter">
            <span>Category</span>
            <select className="cg-admin__editor-input" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {bookingCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="cg-admin-booking__filter">
            <span>Priority</span>
            <select className="cg-admin__editor-input" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              {bookingPriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="cg-admin-booking__filter">
            <span>Sort</span>
            <select className="cg-admin__editor-input" value={sortKey} onChange={(event) => setSortKey(event.target.value as "priority" | "status" | "name" | "market")}>
              {bookingSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="cg-admin-table-wrap">
          <table className="cg-admin-table">
            <thead>
              <tr>
                <th scope="col">Target</th>
                <th scope="col">Window</th>
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
                <th scope="col">Routing</th>
                <th scope="col">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredTargets.map((target) => {
                const targetWindow = windowById.get(target.targetWindowId);

                return (
                  <tr key={target.id} className={cx(drawerTargetId === target.id && "cg-admin-table__row--active")}>
                    <td>
                      <button type="button" className="cg-admin-table__row-button" onClick={() => setDrawerTargetId(target.id)}>
                        {target.name}
                      </button>
                      <div className="cg-admin-table__subcopy">
                        {target.city}, {target.state} · {formatBookingCategory(target.category)}
                      </div>
                    </td>
                    <td>{targetWindow?.label ?? "Unassigned"}</td>
                    <td>{formatBookingPriority(target.priority)}</td>
                    <td>{formatBookingTargetStatus(target.status)}</td>
                    <td>{formatRoutingRange(target.routingStart, target.routingEnd)}</td>
                    <td>{formatBookingContactStatus(target.contactStatus)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cg-admin-route__status-pills" aria-label="Status mix">
          {statusCounts.map(([status, count]) => (
            <span key={status} className="cg-admin__status-badge">
              {formatBookingTargetStatus(status)} · {count}
            </span>
          ))}
        </div>
      </article>

      <div className="cg-admin-route__grid cg-admin-route__grid--two">
        <article className="cg-admin__panel">
          <div className="cg-admin__subsection-head">
            <div>
              <h3>Booking-fit leads</h3>
              <p>Leads routed against the current seeded target board.</p>
            </div>
            <p className="cg-admin__path-note">Source: ecosystemLeads</p>
          </div>

          {bookingLeadMatches.length ? (
            <div className="cg-admin-table-wrap">
              <table className="cg-admin-table">
                <thead>
                  <tr>
                    <th scope="col">Lead</th>
                    <th scope="col">Matched target</th>
                    <th scope="col">Window</th>
                    <th scope="col">Project</th>
                    <th scope="col">Reasons</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingLeadMatches.map((match) => (
                    <tr key={match.lead.id}>
                      <td>
                        <strong>{match.lead.fullName || match.lead.email}</strong>
                        <div className="cg-admin-table__subcopy">{match.lead.email}</div>
                      </td>
                      <td>{match.target?.name ?? "No direct target yet"}</td>
                      <td>{match.window?.label ?? match.lead.interest ?? "General"}</td>
                      <td>{match.lead.projectTitle || match.lead.interest || "Untitled"}</td>
                      <td>{match.reasons.slice(0, 2).join(" · ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : ecosystemLeads.length ? (
            <p className="cg-admin__helper">No current leads are matching the seeded target board yet.</p>
          ) : (
            <p className="cg-admin__helper">Booking-fit leads will appear here as guided intake traffic lands.</p>
          )}
        </article>
      </div>

      <article className="cg-admin__panel">
        <div className="cg-admin__subsection-head">
          <div>
            <h3>Availability windows</h3>
            <p>Window coverage stays visible beside the target board instead of living in its own stack of cards.</p>
          </div>
        </div>
        <div className="cg-admin-table-wrap">
          <table className="cg-admin-table">
            <thead>
              <tr>
                <th scope="col">Window</th>
                <th scope="col">Date range</th>
                <th scope="col">Market</th>
                <th scope="col">Types</th>
                <th scope="col">Targets</th>
                <th scope="col">Lead matches</th>
              </tr>
            </thead>
            <tbody>
              {availabilityRows.map((window) => (
                <tr key={window.id}>
                  <td>{window.label}</td>
                  <td>{formatDateWindow(window.startDate, window.endDate)}</td>
                  <td>{window.market}</td>
                  <td>{window.bookingTypes.join(" / ")}</td>
                  <td>{window.targetCount}</td>
                  <td>{window.leadCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {selectedTarget ? (
        <BookingTargetDrawer
          target={selectedTarget}
          targetWindow={windowById.get(selectedTarget.targetWindowId) ?? null}
          canEdit={Boolean(adminData)}
          saveState={bookingTargetSaveStates[selectedTarget.id]}
          enrichmentState={enrichmentStates[selectedTarget.id]}
          enrichmentMessage={enrichmentMessages[selectedTarget.id]}
          onClose={() => setDrawerTargetId(null)}
          onSave={handleBookingTargetSave}
          onFindContactInfo={handleFindContactInfo}
        />
      ) : null}
    </div>
  );
}

export function AdminContentRoute() {
  const {
    adminViewData,
    collectorHeroNoteSaveState,
    linkHubSaveState,
    hasLiveMarkdownContent,
    isScaffoldMode,
    saveStates,
    handleCollectorHeroNoteSave,
    handleLinkHubSave,
    handleMarkdownCreate,
    handleMarkdownSave,
    handleMarkdownDelete
  } = useAdminWorkspace();
  const tabBaseId = useId();
  const [activeTab, setActiveTab] = useState<ContentTabId>("collector-note");
  const [drawerState, setDrawerState] = useState<MarkdownDrawerState | null>(null);
  const [pendingCreatedSlug, setPendingCreatedSlug] = useState<string | null>(null);
  const [pendingSavedSlug, setPendingSavedSlug] = useState<string | null>(null);

  const contentTabs: Array<{ id: ContentTabId; label: string; detail: string }> = [
    { id: "collector-note", label: "Collector Note", detail: "Hero note" },
    { id: "link-hub", label: "Link Hub", detail: `${adminViewData.linkHub.links.length} links` },
    { id: "drafts", label: "Drafts", detail: `${adminViewData.instagramDrafts.length} items` },
    { id: "journals", label: "Journals", detail: `${adminViewData.journalEntries.length} items` }
  ];

  const activeCollection = activeTab === "drafts" ? "instagram-posts" : activeTab === "journals" ? "journals" : null;
  const drawerFiles: AdminMarkdownFile[] = drawerState?.collection === "instagram-posts"
    ? adminViewData.instagramDrafts
    : drawerState?.collection === "journals"
      ? adminViewData.journalEntries
      : [];
  const drawerFile = drawerState?.mode === "edit" ? drawerFiles.find((file) => file.slug === drawerState.slug) ?? null : null;
  const drawerCreateState = drawerState ? saveStates[getAdminMarkdownCreateKey(drawerState.collection)] : undefined;
  const drawerSaveState = drawerState?.mode === "edit" ? saveStates[getAdminMarkdownSaveKey(drawerState.collection, drawerState.slug)] : undefined;

  useEffect(() => {
    if (!drawerState) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerState(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerState]);

  useEffect(() => {
    if (!drawerState || drawerState.mode !== "create" || !pendingCreatedSlug || drawerCreateState !== "success") {
      return;
    }

    setDrawerState({ mode: "edit", collection: drawerState.collection, slug: pendingCreatedSlug });
    setPendingCreatedSlug(null);
  }, [drawerCreateState, drawerState, pendingCreatedSlug]);

  useEffect(() => {
    if (!drawerState || drawerState.mode !== "edit" || !pendingSavedSlug) {
      return;
    }

    if (!drawerFiles.some((file) => file.slug === pendingSavedSlug)) {
      return;
    }

    setDrawerState({ ...drawerState, slug: pendingSavedSlug });
    setPendingSavedSlug(null);
  }, [drawerFiles, drawerState, pendingSavedSlug]);

  useEffect(() => {
    if (drawerCreateState === "error") {
      setPendingCreatedSlug(null);
    }
  }, [drawerCreateState]);

  useEffect(() => {
    if (drawerSaveState === "error") {
      setPendingSavedSlug(null);
    }
  }, [drawerSaveState]);

  async function handleCreateFromDrawer(event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection) {
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const requestedSlug = String(formData.get("slug") ?? "");
    const nextSlug = normalizeEditorSlug(requestedSlug || title);

    if (nextSlug) {
      setPendingCreatedSlug(nextSlug);
    }

    await handleMarkdownCreate(event, collection);
  }

  async function handleSaveFromDrawer(event: FormEvent<HTMLFormElement>, collection: AdminMarkdownCollection, slug: string) {
    const formData = new FormData(event.currentTarget);
    const nextSlug = normalizeEditorSlug(String(formData.get("slug") ?? ""));

    if (nextSlug && nextSlug !== slug) {
      setPendingSavedSlug(nextSlug);
    }

    await handleMarkdownSave(event, collection, slug);
  }

  function openLibraryDrawer(collection: AdminMarkdownCollection, mode: "create" | "edit", slug?: string) {
    setDrawerState(mode === "create" ? { mode, collection } : { mode, collection, slug: slug ?? "" });
  }

  return (
    <div className="cg-admin-route">
      <AdminRouteHeader
        eyebrow="Content"
        title="Content Studio"
        description="Switch between live content surfaces. Drafts and journals now open in a side editor instead of stacking beneath the table."
      />

      <div className="cg-admin-route__metric-grid">
        <AdminMetricCard label="Collector Note" value="Live" detail="hero note on the public page" />
        <AdminMetricCard label="Link Hub" value={`${adminViewData.linkHub.links.length}`} detail="links live on /links" />
        <AdminMetricCard label="Drafts" value={`${adminViewData.instagramDrafts.length}`} detail="release copy in progress" />
        <AdminMetricCard label="Journals" value={`${adminViewData.journalEntries.length}`} detail="story pages ready to edit" />
      </div>

      <div className="cg-admin-content__tabs" role="tablist" aria-label="Content surfaces">
        {contentTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const tabId = `${tabBaseId}-${tab.id}-tab`;
          const panelId = `${tabBaseId}-${tab.id}-panel`;

          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              className="cg-admin-content__tab"
              data-state={isActive ? "active" : "inactive"}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <small>{tab.detail}</small>
            </button>
          );
        })}
      </div>

      {!hasLiveMarkdownContent && activeCollection ? <p className="cg-admin__helper">Draft and journal editing unlocks after content sync finishes.</p> : null}

      <section
        id={`${tabBaseId}-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabBaseId}-${activeTab}-tab`}
        className="cg-admin-content__panel-frame"
      >
        {activeTab === "collector-note" ? (
          <article className="cg-admin__panel cg-admin-content__panel">
            <div className="cg-admin__file-head">
              <div>
                <h3>Collector note</h3>
                <p>Short note shown at the top of the public Walls/Devine page.</p>
              </div>
              <p className="cg-admin__path-note">Updated {formatDateTime(adminViewData.collectorHeroNote.updatedAt)}</p>
            </div>

            <form onSubmit={handleCollectorHeroNoteSave} className="cg-admin__editor-form">
              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Salutation</span>
                  <input name="salutation" type="text" className="cg-admin__editor-input" defaultValue={adminViewData.collectorHeroNote.salutation} required />
                </label>
              </div>

              <label className="cg-admin__editor-field">
                <span>Body copy</span>
                <textarea name="body" className="cg-admin__editor-textarea" rows={8} defaultValue={adminViewData.collectorHeroNote.body} required />
              </label>

              <div className="cg-admin__editor-actions">
                <Button type="submit" variant="primary" size="sm" disabled={collectorHeroNoteSaveState === "saving"}>
                  Save note
                </Button>
                {collectorHeroNoteSaveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                {collectorHeroNoteSaveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                {collectorHeroNoteSaveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this note.</p> : null}
              </div>
            </form>
          </article>
        ) : null}

        {activeTab === "link-hub" ? (
          <AdminLinkHubEditor
            value={adminViewData.linkHub}
            saveState={linkHubSaveState}
            firestorePath={`${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.publicContentCollection}/${firebaseAdminPaths.linkHubDocId}`}
            onSave={handleLinkHubSave}
          />
        ) : null}

        {activeTab === "drafts" ? (
          <MarkdownLibraryTable
            config={markdownLibraryConfigs["instagram-posts"]}
            files={adminViewData.instagramDrafts}
            isScaffoldMode={isScaffoldMode}
            disabled={!hasLiveMarkdownContent}
            onCreate={() => openLibraryDrawer("instagram-posts", "create")}
            onOpen={(slug) => openLibraryDrawer("instagram-posts", "edit", slug)}
          />
        ) : null}

        {activeTab === "journals" ? (
          <MarkdownLibraryTable
            config={markdownLibraryConfigs.journals}
            files={adminViewData.journalEntries}
            isScaffoldMode={isScaffoldMode}
            disabled={!hasLiveMarkdownContent}
            onCreate={() => openLibraryDrawer("journals", "create")}
            onOpen={(slug) => openLibraryDrawer("journals", "edit", slug)}
          />
        ) : null}
      </section>

      {drawerState ? (
        <MarkdownEditorDrawer
          state={drawerState}
          file={drawerFile}
          config={markdownLibraryConfigs[drawerState.collection]}
          hasLiveMarkdownContent={hasLiveMarkdownContent}
          createState={drawerCreateState}
          saveState={drawerSaveState}
          onClose={() => setDrawerState(null)}
          onCreate={handleCreateFromDrawer}
          onSave={handleSaveFromDrawer}
          onDelete={handleMarkdownDelete}
        />
      ) : null}
    </div>
  );
}

export function AdminAssetsRoute() {
  const { authUser, contentSource, isAuthorized, panelError, audioAnalysis, audioLoading, audioError, handleAudioRefresh } = useAdminWorkspace();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(audioAnalysis[0]?.fileName ?? null);

  useEffect(() => {
    if (selectedFileName && audioAnalysis.some((analysis) => analysis.fileName === selectedFileName)) {
      return;
    }

    setSelectedFileName(audioAnalysis[0]?.fileName ?? null);
  }, [audioAnalysis, selectedFileName]);

  const selectedAnalysis = audioAnalysis.find((analysis) => analysis.fileName === selectedFileName) ?? audioAnalysis[0] ?? null;
  const issueCount = audioAnalysis.filter((analysis) => analysis.error).length;
  const losslessCount = audioAnalysis.filter((analysis) => analysis.lossless).length;

  return (
    <div className="cg-admin-route">
      <AdminRouteHeader
        eyebrow="System"
        title="Assets & QA"
        description="Server-inspected technical metadata for live WAVs, plus backend health in the same routed surface."
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={handleAudioRefresh} disabled={audioLoading}>
            {audioLoading ? "Refreshing…" : "Refresh analysis"}
          </Button>
        }
      />

      <div className="cg-admin-route__metric-grid">
        <AdminMetricCard label="Analyzed Files" value={String(audioAnalysis.length)} detail="WAV files parsed from the release folder" />
        <AdminMetricCard label="Parse Issues" value={String(issueCount)} detail="files still reporting metadata problems" />
        <AdminMetricCard label="Lossless" value={String(losslessCount)} detail="files marked as lossless" />
      </div>

      {audioError ? <p className="cg-admin__error">{audioError}</p> : null}
      {audioLoading && !audioAnalysis.length ? <p className="cg-admin__helper">Inspecting release WAVs…</p> : null}

      <article className="cg-admin__panel">
        <div className="cg-admin__subsection-head">
          <div>
            <h3>Audio inventory</h3>
            <p>Technical metadata stays in a sortable table instead of a wall of stacked audio cards.</p>
          </div>
          <p className="cg-admin__path-note">Source: public/walls-devine/releases/volume1</p>
        </div>

        {audioAnalysis.length ? (
          <div className="cg-admin-table-wrap">
            <table className="cg-admin-table">
              <thead>
                <tr>
                  <th scope="col">Track</th>
                  <th scope="col">Title</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Sample rate</th>
                  <th scope="col">Bit depth</th>
                  <th scope="col">Channels</th>
                  <th scope="col">Lossless</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {audioAnalysis.map((analysis) => (
                  <tr key={analysis.fileName} className={cx(selectedAnalysis?.fileName === analysis.fileName && "cg-admin-table__row--active")}>
                    <td>
                      <button type="button" className="cg-admin-table__row-button" onClick={() => setSelectedFileName(analysis.fileName)}>
                        {formatAudioTrackNumber(analysis.trackNumber)}
                      </button>
                    </td>
                    <td>{analysis.title ?? analysis.fileName.replace(/\.wav$/i, "")}</td>
                    <td>{analysis.durationLabel}</td>
                    <td>{formatAudioSampleRate(analysis.sampleRate)}</td>
                    <td>{formatAudioBitDepth(analysis.bitDepth)}</td>
                    <td>{formatAudioChannels(analysis.channels)}</td>
                    <td>{formatAudioLossless(analysis.lossless)}</td>
                    <td>
                      <span className={cx("cg-admin__status-badge", analysis.error ? "cg-admin__status-badge--pending" : "cg-admin__status-badge--ready")}>
                        {analysis.error ? "Issue" : "Analyzed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !audioLoading ? <p className="cg-admin__helper">No WAV analysis has been loaded yet. Refresh analysis when the release folder is ready.</p> : null
        )}
      </article>

      <div className="cg-admin-route__grid cg-admin-route__grid--two">
        <article className="cg-admin__panel">
          <div className="cg-admin__subsection-head">
            <div>
              <h3>{selectedAnalysis?.title ?? "Selected file"}</h3>
              <p>{selectedAnalysis?.relativePath ?? "Select a file from the table to inspect embedded metadata and technical tags."}</p>
            </div>
          </div>

          {selectedAnalysis ? (
            <>
              {selectedAnalysis.error ? <p className="cg-admin__error">{selectedAnalysis.error}</p> : null}

              <dl className="cg-admin__audio-metrics">
                <div>
                  <dt>Format</dt>
                  <dd>{formatAudioFormat(selectedAnalysis)}</dd>
                </div>
                <div>
                  <dt>Bitrate</dt>
                  <dd>{formatAudioBitrate(selectedAnalysis.bitrateKbps)}</dd>
                </div>
                <div>
                  <dt>File size</dt>
                  <dd>{selectedAnalysis.fileSizeLabel}</dd>
                </div>
                <div>
                  <dt>Album</dt>
                  <dd>{selectedAnalysis.album ?? "—"}</dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedAnalysis.artist ?? "—"}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{selectedAnalysis.year ?? "—"}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="cg-admin__helper">Choose an analyzed file to inspect its metadata.</p>
          )}
        </article>

        <AdminFirebaseStatus signedInEmail={authUser?.email ?? null} contentSource={contentSource} isAuthorized={isAuthorized} notice={panelError || undefined} />
      </div>
    </div>
  );
}