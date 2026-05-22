"use client";

import { useEffect, useMemo, useState } from "react";

import type { ReleasePlan, ReleasePlanCalendarItem, ReleasePlanChecklistItem } from "@/lib/admin/types";
import { cx } from "@/lib/cx";

import { Button } from "@/components/ui/Button";

type TimelineItemKind = "schedule" | "task";

type TimelineItem = {
  id: string;
  kind: TimelineItemKind;
  phase: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  completed: boolean | null;
  notes: string;
  dateLabel: string;
  gCalEventId: string | null;
  syncReady: boolean;
};

type TimelineWeek = {
  key: string;
  label: string;
  start: string;
  end: string;
  items: TimelineItem[];
};

type ReleaseDeskTimelineProps = {
  plan: ReleasePlan;
  canEdit: boolean;
  onToggleTask: (itemId: string, completed: boolean) => Promise<void>;
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});

const weekdayLongFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric"
});

function createUtcDate(year: number, monthIndex: number, day: number, hour = 9, minute = 0, second = 0) {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, second));
}

function monthNameToIndex(monthName: string) {
  const monthIndex = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ].indexOf(monthName.trim().toLowerCase());

  return monthIndex >= 0 ? monthIndex : null;
}

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return nextDate;
}

function startOfWeek(date: Date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const nextDate = addDays(date, diff);
  nextDate.setUTCHours(0, 0, 0, 0);
  return nextDate;
}

function endOfWeek(date: Date) {
  const nextDate = startOfWeek(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + 6);
  nextDate.setUTCHours(23, 59, 59, 999);
  return nextDate;
}

function normalizeDateInput(value: string | undefined) {
  if (!value) {
    return null;
  }

  const nextDate = new Date(value);
  return Number.isNaN(nextDate.getTime()) ? null : nextDate;
}

function inferReleaseYear(plan: ReleasePlan) {
  for (const item of plan.lockedDates) {
    const match = item.value.match(/(20\d{2})/);

    if (match) {
      return Number(match[1]);
    }
  }

  const updatedAt = normalizeDateInput(plan.updatedAt);
  return updatedAt?.getUTCFullYear() ?? new Date().getUTCFullYear();
}

function getPhaseAnchorDate(phase: string, itemId: string, year: number) {
  if (itemId.startsWith("resolve") || phase.includes("Lead single")) {
    return createUtcDate(year, 4, 16, 9, 0, 0);
  }

  if (phase.includes("Album")) {
    return createUtcDate(year, 5, 4, 9, 0, 0);
  }

  if (phase.includes("Instrumentals") || itemId.startsWith("instrumental")) {
    return createUtcDate(year, 6, 10, 9, 0, 0);
  }

  return createUtcDate(year, 4, 16, 9, 0, 0);
}

function parseDateLabelToWindow(label: string, year: number, phase: string, itemId: string) {
  const trimmedLabel = label.trim();

  if (!trimmedLabel) {
    return null;
  }

  if (/^now$/i.test(trimmedLabel)) {
    const now = createUtcDate(year, 4, 16, 9, 0, 0);
    return {
      start: now,
      end: addDays(now, 0)
    };
  }

  if (/^next$/i.test(trimmedLabel)) {
    const next = createUtcDate(year, 4, 17, 9, 0, 0);
    return {
      start: next,
      end: addDays(next, 0)
    };
  }

  const onwardMatch = trimmedLabel.match(/^([A-Za-z]+)\s+(\d{1,2})\s+onward$/i);

  if (onwardMatch) {
    const monthIndex = monthNameToIndex(onwardMatch[1]);
    const day = Number(onwardMatch[2]);

    if (monthIndex !== null) {
      const start = createUtcDate(year, monthIndex, day, 9, 0, 0);
      return {
        start,
        end: addDays(start, 7)
      };
    }
  }

  const beforeDateMatch = trimmedLabel.match(/^Before\s+([A-Za-z]+)\s+(\d{1,2})$/i);

  if (beforeDateMatch) {
    const monthIndex = monthNameToIndex(beforeDateMatch[1]);
    const day = Number(beforeDateMatch[2]);

    if (monthIndex !== null) {
      const anchor = createUtcDate(year, monthIndex, day, 9, 0, 0);
      return {
        start: addDays(anchor, -4),
        end: addDays(anchor, -1)
      };
    }
  }

  const targetDateMatch = trimmedLabel.match(/^Target\s+([A-Za-z]+)\s+(\d{1,2})$/i);

  if (targetDateMatch) {
    const monthIndex = monthNameToIndex(targetDateMatch[1]);
    const day = Number(targetDateMatch[2]);

    if (monthIndex !== null) {
      const anchor = createUtcDate(year, monthIndex, day, 9, 0, 0);
      return {
        start: addDays(anchor, -2),
        end: anchor
      };
    }
  }

  const rangeMatch = trimmedLabel.match(/^([A-Za-z]+)\s+(\d{1,2})\s*[–-]\s*([A-Za-z]+)?\s*(\d{1,2})$/i);

  if (rangeMatch) {
    const startMonthIndex = monthNameToIndex(rangeMatch[1]);
    const startDay = Number(rangeMatch[2]);
    const endMonthIndex = monthNameToIndex(rangeMatch[3] ?? rangeMatch[1]);
    const endDay = Number(rangeMatch[4]);

    if (startMonthIndex !== null && endMonthIndex !== null) {
      return {
        start: createUtcDate(year, startMonthIndex, startDay, 9, 0, 0),
        end: createUtcDate(year, endMonthIndex, endDay, 18, 0, 0)
      };
    }
  }

  const singleDateMatch = trimmedLabel.match(/^([A-Za-z]+)\s+(\d{1,2})$/i);

  if (singleDateMatch) {
    const monthIndex = monthNameToIndex(singleDateMatch[1]);
    const day = Number(singleDateMatch[2]);

    if (monthIndex !== null) {
      const start = createUtcDate(year, monthIndex, day, 9, 0, 0);
      return {
        start,
        end: createUtcDate(year, monthIndex, day, 18, 0, 0)
      };
    }
  }

  const phaseAnchor = getPhaseAnchorDate(phase, itemId, year);

  switch (trimmedLabel.toLowerCase()) {
    case "before upload":
      return {
        start: addDays(phaseAnchor, -2),
        end: addDays(phaseAnchor, -1)
      };
    case "at upload":
      return {
        start: phaseAnchor,
        end: createUtcDate(phaseAnchor.getUTCFullYear(), phaseAnchor.getUTCMonth(), phaseAnchor.getUTCDate(), 12, 0, 0)
      };
    case "before album pitch": {
      const albumPitchAnchor = createUtcDate(year, 5, 3, 9, 0, 0);
      return {
        start: addDays(albumPitchAnchor, -2),
        end: albumPitchAnchor
      };
    }
    case "before july rollout": {
      const rolloutAnchor = createUtcDate(year, 6, 3, 9, 0, 0);
      return {
        start: addDays(rolloutAnchor, -3),
        end: rolloutAnchor
      };
    }
    default:
      return {
        start: phaseAnchor,
        end: addDays(phaseAnchor, 0)
      };
  }
}

function formatRangeLabel(start: string, end: string) {
  const startDate = normalizeDateInput(start);
  const endDate = normalizeDateInput(end);

  if (!startDate || !endDate) {
    return "Date pending";
  }

  const sameDay =
    startDate.getUTCFullYear() === endDate.getUTCFullYear() &&
    startDate.getUTCMonth() === endDate.getUTCMonth() &&
    startDate.getUTCDate() === endDate.getUTCDate();

  if (sameDay) {
    return weekdayLongFormatter.format(startDate);
  }

  return `${weekdayFormatter.format(startDate)} - ${weekdayFormatter.format(endDate)}`;
}

function getScheduleWindow(item: ReleasePlanCalendarItem, year: number) {
  if (item.start && item.end) {
    return {
      start: item.start,
      end: item.end
    };
  }

  const parsedWindow = parseDateLabelToWindow(item.date, year, item.phase ?? "Schedule", item.id ?? item.action);

  return {
    start: parsedWindow?.start.toISOString() ?? createUtcDate(year, 4, 16, 9, 0, 0).toISOString(),
    end: parsedWindow?.end.toISOString() ?? createUtcDate(year, 4, 16, 18, 0, 0).toISOString()
  };
}

function getTaskWindow(item: ReleasePlanChecklistItem, year: number) {
  if (item.start && item.end) {
    return {
      start: item.start,
      end: item.end
    };
  }

  const parsedWindow = parseDateLabelToWindow(item.dueDate, year, item.phase, item.id);

  return {
    start: parsedWindow?.start.toISOString() ?? createUtcDate(year, 4, 16, 9, 0, 0).toISOString(),
    end: parsedWindow?.end.toISOString() ?? createUtcDate(year, 4, 16, 18, 0, 0).toISOString()
  };
}

function toTimelineItems(plan: ReleasePlan) {
  const year = inferReleaseYear(plan);

  const scheduleItems: TimelineItem[] = plan.calendar.map((item) => {
    const window = getScheduleWindow(item, year);

    return {
      id: item.id ?? `schedule:${item.action.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind: "schedule",
      phase: item.phase ?? "Release schedule",
      summary: item.action,
      description: item.purpose,
      start: window.start,
      end: window.end,
      completed: null,
      notes: item.purpose,
      dateLabel: item.date,
      gCalEventId: null,
      syncReady: Boolean(window.start && window.end)
    };
  });

  const taskItems: TimelineItem[] = plan.checklist.map((item) => {
    const window = getTaskWindow(item, year);
    const summary = item.summary ?? item.title;
    const description = item.description ?? item.notes;

    return {
      id: item.id,
      kind: "task",
      phase: item.phase,
      summary,
      description,
      start: window.start,
      end: window.end,
      completed: item.completed,
      notes: item.notes,
      dateLabel: item.dueDate,
      gCalEventId: item.gCalEventId ?? null,
      syncReady: Boolean(summary && description && window.start && window.end)
    };
  });

  return [...scheduleItems, ...taskItems].sort((left, right) => {
    const leftStart = normalizeDateInput(left.start)?.getTime() ?? 0;
    const rightStart = normalizeDateInput(right.start)?.getTime() ?? 0;
    return leftStart - rightStart;
  });
}

function toTimelineWeeks(items: TimelineItem[]) {
  if (!items.length) {
    return [] satisfies TimelineWeek[];
  }

  const firstDate = normalizeDateInput(items[0]?.start);
  const lastDate = normalizeDateInput(items[items.length - 1]?.end);

  if (!firstDate || !lastDate) {
    return [] satisfies TimelineWeek[];
  }

  const timelineWeeks: TimelineWeek[] = [];
  let cursor = startOfWeek(firstDate);
  const finalBoundary = endOfWeek(lastDate);

  while (cursor <= finalBoundary) {
    const weekStart = new Date(cursor);
    const weekEnd = endOfWeek(weekStart);
    const weekItems = items.filter((item) => {
      const itemStart = normalizeDateInput(item.start);
      const itemEnd = normalizeDateInput(item.end);

      if (!itemStart || !itemEnd) {
        return false;
      }

      return itemEnd >= weekStart && itemStart <= weekEnd;
    });

    timelineWeeks.push({
      key: weekStart.toISOString(),
      label: `${weekdayFormatter.format(weekStart)} - ${weekdayFormatter.format(weekEnd)}`,
      start: weekStart.toISOString(),
      end: weekEnd.toISOString(),
      items: weekItems
    });

    cursor = addDays(weekStart, 7);
  }

  return timelineWeeks;
}

function getPhaseTone(phase: string) {
  if (phase.includes("Lead single")) {
    return "phase-1";
  }

  if (phase.includes("Album")) {
    return "phase-2";
  }

  if (phase.includes("Instrumentals")) {
    return "phase-3";
  }

  return "phase-neutral";
}

export function ReleaseDeskTimeline({ plan, canEdit, onToggleTask }: ReleaseDeskTimelineProps) {
  const timelineItems = useMemo(() => toTimelineItems(plan), [plan]);
  const timelineWeeks = useMemo(() => toTimelineWeeks(timelineItems), [timelineItems]);
  const defaultSelectedItem = useMemo(
    () => timelineItems.find((item) => item.kind === "task" && item.completed === false) ?? timelineItems[0] ?? null,
    [timelineItems]
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(defaultSelectedItem?.id ?? null);

  useEffect(() => {
    if (selectedItemId && timelineItems.some((item) => item.id === selectedItemId)) {
      return;
    }

    setSelectedItemId(defaultSelectedItem?.id ?? null);
  }, [defaultSelectedItem, selectedItemId, timelineItems]);

  const selectedItem = timelineItems.find((item) => item.id === selectedItemId) ?? defaultSelectedItem;

  return (
    <section className="cg-release-timeline">
      <div className="cg-release-timeline__toolbar">
        <div className="cg-release-timeline__legend" aria-label="Release phases">
          <span className="cg-release-timeline__legend-chip cg-release-timeline__legend-chip--phase-1">Phase 1</span>
          <span className="cg-release-timeline__legend-chip cg-release-timeline__legend-chip--phase-2">Phase 2</span>
          <span className="cg-release-timeline__legend-chip cg-release-timeline__legend-chip--phase-3">Phase 3</span>
          <span className="cg-release-timeline__legend-chip cg-release-timeline__legend-chip--schedule">Locked schedule</span>
        </div>
        <p className="cg-admin__helper">Click any task or milestone for notes, status, and the live action button.</p>
      </div>

      <div className="cg-release-timeline__layout">
        <div className="cg-release-timeline__grid" role="list" aria-label="Release timeline by week">
          {timelineWeeks.map((week) => (
            <section key={week.key} className="cg-release-timeline__week" aria-labelledby={`week-${week.key}`}>
              <div className="cg-release-timeline__week-head">
                <h3 id={`week-${week.key}`}>{week.label}</h3>
                <span>{week.items.length} item{week.items.length === 1 ? "" : "s"}</span>
              </div>

              <div className="cg-release-timeline__week-items">
                {week.items.length ? (
                  week.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItemId(item.id)}
                      className={cx(
                        "cg-release-timeline__item",
                        `cg-release-timeline__item--${getPhaseTone(item.phase)}`,
                        item.kind === "schedule" && "cg-release-timeline__item--schedule",
                        item.completed && "cg-release-timeline__item--complete",
                        selectedItem?.id === item.id && "cg-release-timeline__item--active"
                      )}
                    >
                      <div className="cg-release-timeline__item-head">
                        <span className="cg-release-timeline__item-kind">{item.kind === "task" ? "Task" : "Milestone"}</span>
                        {item.kind === "task" ? (
                          <span className={cx("cg-admin__status-badge", item.completed ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending")}>
                            {item.completed ? "Complete" : "Open"}
                          </span>
                        ) : null}
                      </div>
                      <strong>{item.summary}</strong>
                      <span className="cg-release-timeline__item-range">{formatRangeLabel(item.start, item.end)}</span>
                      <p>{item.description}</p>
                    </button>
                  ))
                ) : (
                  <div className="cg-release-timeline__empty">No scheduled items this week.</div>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside className="cg-release-timeline__drawer" aria-live="polite">
          {selectedItem ? (
            <>
              <div className="cg-release-timeline__drawer-head">
                <div>
                  <span className="cg-admin-shell__eyebrow">{selectedItem.phase}</span>
                  <h3>{selectedItem.summary}</h3>
                  <p>{selectedItem.description}</p>
                </div>
                {selectedItem.kind === "task" ? (
                  <span className={cx("cg-admin__status-badge", selectedItem.completed ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending")}>
                    {selectedItem.completed ? "Complete" : "Open"}
                  </span>
                ) : null}
              </div>

              <dl className="cg-release-timeline__drawer-meta">
                <div>
                  <dt>Window</dt>
                  <dd>{formatRangeLabel(selectedItem.start, selectedItem.end)}</dd>
                </div>
                <div>
                  <dt>Roadmap label</dt>
                  <dd>{selectedItem.dateLabel}</dd>
                </div>
                <div>
                  <dt>Calendar ready</dt>
                  <dd>{selectedItem.syncReady ? "Yes" : "Needs detail"}</dd>
                </div>
              </dl>

              <div className="cg-release-timeline__drawer-note">
                <h4>Notes</h4>
                <p>{selectedItem.notes}</p>
              </div>

              {selectedItem.kind === "task" ? (
                <div className="cg-release-timeline__drawer-actions">
                  <Button type="button" variant={selectedItem.completed ? "ghost" : "primary"} size="sm" onClick={() => void onToggleTask(selectedItem.id, !selectedItem.completed)} disabled={!canEdit}>
                    {selectedItem.completed ? "Reopen task" : "Complete task"}
                  </Button>
                </div>
              ) : null}

              <details className="cg-admin__advanced">
                <summary>Advanced</summary>
                <div className="cg-admin__advanced-body">
                  <p>Start: {selectedItem.start}</p>
                  <p>End: {selectedItem.end}</p>
                  <p>Google Calendar ID: {selectedItem.gCalEventId ?? "Not synced yet"}</p>
                </div>
              </details>
            </>
          ) : (
            <div className="cg-release-timeline__empty">Select a task to inspect details.</div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default ReleaseDeskTimeline;