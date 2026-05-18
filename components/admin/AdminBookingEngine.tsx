"use client";

import type { FormEvent } from "react";

import {
  buildBookingLeadMatches,
  countBookingTargetsByStatus,
  formatBookingCategory,
  formatBookingContactMethod,
  formatBookingContactStatus,
  formatBookingPriority,
  formatBookingTargetStatus,
  getBookingTargetsForWindow
} from "@/lib/admin/booking-engine";
import type { BookingBoard, BookingTargetStatus, EcosystemLead } from "@/lib/admin/types";
import { Button } from "@/components/ui/Button";

type SaveState = "saving" | "deleting" | "success" | "error" | undefined;

type AdminBookingEngineProps = {
  board: BookingBoard;
  leads: EcosystemLead[];
  canSave: boolean;
  targetSaveStates: Record<string, SaveState>;
  onTargetSave: (event: FormEvent<HTMLFormElement>, targetId: string) => void | Promise<void>;
};

const targetStatusOptions: BookingTargetStatus[] = [
  "seeded",
  "researching",
  "outreach-ready",
  "contacted",
  "in-conversation",
  "hold",
  "confirmed"
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function formatBookingWindow(windowStart: string, windowEnd: string) {
  const start = new Date(windowStart);
  const end = new Date(windowEnd);

  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  })}`;
}

function formatLockCountdown(lockByDate: string) {
  const diff = new Date(lockByDate).getTime() - Date.now();
  const days = Math.ceil(diff / DAY_IN_MS);

  if (Number.isNaN(days)) {
    return "Lock date needs review";
  }

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} until lock`;
  }

  if (days === 0) {
    return "Lock date is today";
  }

  const elapsed = Math.abs(days);
  return `${elapsed} day${elapsed === 1 ? "" : "s"} past lock`;
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

export function AdminBookingEngine({ board, leads, canSave, targetSaveStates, onTargetSave }: AdminBookingEngineProps) {
  const leadMatches = buildBookingLeadMatches(board, leads);
  const statusCounts = countBookingTargetsByStatus(board);
  const criticalTargets = board.targets.filter((target) => target.priority === "critical").length;

  return (
    <div className="cg-admin__booking-grid">
      <div className="cg-admin__grid--summary cg-admin__booking-summary-grid">
        <article className="cg-admin__panel">
          <h3>{board.goal.title}</h3>
          <p>{board.goal.summary}</p>
          <ul className="cg-admin__list">
            <li>
              <strong>Lock date</strong>
              <span>
                {new Date(board.goal.lockByDate).toLocaleDateString()} · {formatLockCountdown(board.goal.lockByDate)}
              </span>
            </li>
            <li>
              <strong>Coverage</strong>
              <span>{board.goal.bookThroughMonths.join(" · ")}</span>
            </li>
            <li>
              <strong>Markets</strong>
              <span>{board.goal.priorityMarkets.join(" · ")}</span>
            </li>
          </ul>
        </article>

        <article className="cg-admin__panel">
          <h3>Success metric</h3>
          <p>{board.goal.successMetric}</p>
          <ul className="cg-admin__bullet-list">
            {board.goal.nextMoves.map((move) => (
              <li key={move}>{move}</li>
            ))}
          </ul>
        </article>

        <article className="cg-admin__panel">
          <h3>Target mix</h3>
          <ul className="cg-admin__list">
            <li>
              <strong>Seeded targets</strong>
              <span>{board.targets.length}</span>
            </li>
            <li>
              <strong>Critical targets</strong>
              <span>{criticalTargets}</span>
            </li>
            <li>
              <strong>Booking-fit leads</strong>
              <span>{leadMatches.length}</span>
            </li>
          </ul>
        </article>

        <article className="cg-admin__panel">
          <h3>Status mix</h3>
          <ul className="cg-admin__list">
            {statusCounts.map(([status, count]) => (
              <li key={status}>
                <strong>{formatBookingTargetStatus(status)}</strong>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="cg-admin__booking-window-list">
        {board.availability.map((window) => {
          const windowTargets = getBookingTargetsForWindow(board, window.id);
          const windowMatches = leadMatches.filter((match) => match.window?.id === window.id);

          return (
            <article key={window.id} className="cg-admin__panel cg-admin__booking-window-card">
              <div className="cg-admin__booking-card-head">
                <div>
                  <h3>{window.label}</h3>
                  <p>
                    {window.market} · {formatBookingWindow(window.startDate, window.endDate)}
                  </p>
                </div>
                <span className="cg-admin__status-badge cg-admin__status-badge--ready">{window.bookingTypes.join(" / ")}</span>
              </div>
              <p>{window.purpose}</p>
              <p className="cg-admin__path-note">{window.notes}</p>
              <div className="cg-admin__booking-window-meta">
                <span>{windowTargets.length} target{windowTargets.length === 1 ? "" : "s"}</span>
                <span>{windowMatches.length} lead match{windowMatches.length === 1 ? "" : "es"}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cg-admin__stack">
        <div className="cg-admin__subsection-head">
          <div>
            <h3>Seeded targets</h3>
            <p>Each target is tied to a booking window so availability and outreach stay in the same operating view.</p>
          </div>
          <p className="cg-admin__path-note">Project doc field: bookingBoard.targets</p>
        </div>

        <div className="cg-admin__file-grid cg-admin__booking-target-grid">
          {board.targets.map((target) => {
            const saveState = targetSaveStates[target.id];

            return (
              <article key={target.id} className="cg-admin__panel cg-admin__booking-target-card">
                <div className="cg-admin__booking-card-head">
                  <div>
                    <h3>{target.name}</h3>
                    <p>
                      {target.city}, {target.state} · {formatBookingCategory(target.category)} · {formatBookingPriority(target.priority)}
                    </p>
                  </div>
                  <span className={[
                    "cg-admin__status-badge",
                    target.status === "confirmed" || target.status === "hold" ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending"
                  ].join(" ")}>{formatBookingTargetStatus(target.status)}</span>
                </div>

                <p>{target.fitNote}</p>
                <p className="cg-admin__path-note">{target.desiredOutcome}</p>

                <div className="cg-admin__booking-tags" aria-label="Booking target tags">
                  {target.tags.map((tag) => (
                    <span key={tag} className="cg-admin__booking-chip">
                      {tag.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>

                <div className="cg-admin__stack">
                  <div className="cg-admin__booking-card-head">
                    <h4>Contacts</h4>
                    <span className="cg-admin__path-note">{formatBookingContactStatus(target.contactStatus)}</span>
                  </div>
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
                </div>

                <form className="cg-admin__editor-form cg-admin__booking-form" onSubmit={(event) => onTargetSave(event, target.id)}>
                  <label className="cg-admin__editor-field">
                    <span>Status</span>
                    <select name="status" defaultValue={target.status} className="cg-admin__editor-input" disabled={!canSave || saveState === "saving"}>
                      {targetStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {formatBookingTargetStatus(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="cg-admin__editor-field">
                    <span>Working note</span>
                    <textarea name="notes" rows={5} defaultValue={target.notes} className="cg-admin__editor-textarea" disabled={!canSave || saveState === "saving"} />
                  </label>
                  <div className="cg-admin__editor-actions">
                    <Button type="submit" variant="secondary" size="sm" disabled={!canSave || saveState === "saving"}>
                      Save target
                    </Button>
                    {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
                    {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
                    {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save this target.</p> : null}
                    {!canSave ? <p className="cg-admin__save-note">Sign into live Firebase content before changing target state.</p> : null}
                  </div>
                </form>
              </article>
            );
          })}
        </div>
      </div>

      <div className="cg-admin__analytics-grid">
        <div className="cg-admin__stack">
          <div className="cg-admin__subsection-head">
            <div>
              <h3>Booking-fit leads</h3>
              <p>Guided intake and lead language scored against the active target list and availability windows.</p>
            </div>
            <p className="cg-admin__path-note">Source: ecosystemLeads</p>
          </div>

          {leadMatches.length ? (
            <ul className="cg-admin__lead-list cg-admin__booking-lead-list">
              {leadMatches.map((match) => (
                <li key={match.lead.id} className="cg-admin__lead-item">
                  <div>
                    <strong>{match.lead.fullName || match.lead.email}</strong>
                    <span>{match.lead.email}</span>
                  </div>
                  <div className="cg-admin__lead-meta">
                    <span>{match.target ? `Matched to ${match.target.name}` : "No direct target yet"}</span>
                    <span>{match.window ? match.window.label : match.lead.interest || "General intake"}</span>
                    <span>{match.lead.projectTitle || match.lead.interest || "No project title supplied"}</span>
                    <span>{match.lead.brief || "No booking brief supplied yet."}</span>
                  </div>
                  <ul className="cg-admin__booking-match-reasons">
                    {match.reasons.slice(0, 3).map((reason) => (
                      <li key={`${match.lead.id}-${reason}`}>{reason}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cg-admin__helper">Booking-fit leads will appear here as guided intake or booking-context contacts land.</p>
          )}
        </div>

        <div className="cg-admin__stack">
          <div className="cg-admin__subsection-head">
            <div>
              <h3>Prospect pulls</h3>
              <p>Location-first research queues that can grow this board without changing the admin surface.</p>
            </div>
            <p className="cg-admin__path-note">Source: bookingBoard.prospects</p>
          </div>

          <div className="cg-admin__stack">
            {board.prospects.map((prospect) => (
              <article key={prospect.id} className="cg-admin__panel cg-admin__booking-prospect-card">
                <div className="cg-admin__booking-card-head">
                  <div>
                    <h3>{prospect.label}</h3>
                    <p>{prospect.market}</p>
                  </div>
                  <span className="cg-admin__status-badge cg-admin__status-badge--pending">{prospect.types.join(" / ")}</span>
                </div>
                <p>{prospect.rationale}</p>
                <p className="cg-admin__path-note">{prospect.notes}</p>
                <div className="cg-admin__booking-tags" aria-label="Prospect search hints">
                  {prospect.searchHints.map((hint) => (
                    <span key={hint} className="cg-admin__booking-chip">
                      {hint}
                    </span>
                  ))}
                </div>
                {prospect.sourceUrl ? (
                  <p>
                    <a href={prospect.sourceUrl} target="_blank" rel="noreferrer">
                      {prospect.sourceUrl}
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingEngine;