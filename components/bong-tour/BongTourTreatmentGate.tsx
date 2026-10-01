"use client";

import { type FormEvent, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, isBongTourPreview, june30LaunchDateLabel } from "@/lib/launch-state";

type TreatmentPayload = {
  title: string;
  content: string;
  updatedAt: string;
  source: string;
  viewerEmail: string;
};

const bongTourTreatmentLogline =
  "A sacred relic disappears from a Varanasi ghat and washes up on Sunset Boulevard, dragging two displaced screenwriters into a Hollywood odyssey that careens between diaspora satire, cult comedy, and industry survival.";
const bongTourTreatmentTravelNotes = [
  "Sun-baked road satire with cult-comedy momentum.",
  "Original soundtrack cues tracked to key script sequences.",
  "Character bibles, scene lookbooks, and production breakdown."
] as const;

const treatmentAccessHref = "/api/bong-tour/treatment/access";
const treatmentContentHref = "/api/bong-tour/treatment/content";
const wallsDevineSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "walls-devine-mailing-list",
    inquiryType: "mailing-list",
    project: "Walls/Devine",
    surface: "campaign-world",
    sourceRoute: "/bong-tour/treatment",
    campaignWindow: albumLaunchCampaignWindow
  }
});
const bongTourContactHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "bong-tour-treatment-access",
    project: "Bong Tour",
    inquiryType: "partnership",
    surface: "campaign-world",
    engagement: "direction",
    sourceRoute: "/bong-tour/treatment",
    campaignWindow: albumLaunchCampaignWindow
  }
});
const bongTourContactCtaLabel = isBongTourPreview ? "Request Screenplay Treatment" : "Request Reading Copy";
const approvedReaderChecklist = [
  "Use the email address approved by the studio.",
  "Enter the private password issued for your reading copy.",
  "Reading copy is watermarked and held in private circulation."
] as const;
const newReaderChecklist = [
  "Request reader access through the studio contact form.",
  "Include production, agency, or directorial affiliation.",
  "Watermarked digital copy and lookbook provided upon approval."
] as const;
const previewAccessChecklist = [
  "Screenplay draft and lookbook available by request.",
  "Direct inquiries routed through the studio production desk.",
  "Approved partners receive private access credentials."
] as const;
const previewSignalChecklist = [
  "Original score in progress at the Creatives Guide Us sound lab.",
  "Join the studio mailing list for soundtrack and production notices.",
  "Full screenplay circulated privately for packaging."
] as const;

async function getResponseError(response: Response, fallbackMessage: string) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error?.trim() || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function formatUpdatedAt(value: string) {
  if (!value) {
    return "Private reading copy";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Private reading copy";
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date)}`;
}

function getSourceLabel(source: string) {
  if (source === "local-development") {
    return "Local development copy";
  }

  if (source === "local-seed") {
    return "Seeded private copy";
  }

  return "Private Firebase copy";
}

export function BongTourTreatmentGate() {
  const titleId = useId();
  const descriptionId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [treatment, setTreatment] = useState<TreatmentPayload | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(!isBongTourPreview);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTreatment, setIsLoadingTreatment] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    if (isBongTourPreview) {
      return;
    }

    let cancelled = false;

    async function checkExistingSession() {
      try {
        const response = await fetch(treatmentContentHref, {
          method: "GET",
          cache: "no-store"
        });

        if (cancelled) {
          return;
        }

        if (response.ok) {
          const payload = (await response.json()) as TreatmentPayload;
          setTreatment(payload);
          setIsModalOpen(false);
          setFeedbackMessage("");
          return;
        }

        if (response.status !== 401) {
          setFeedbackMessage(await getResponseError(response, "Treatment access is configured, but the private copy is not ready yet."));
        }

        setIsModalOpen(true);
      } catch {
        if (!cancelled) {
          setFeedbackMessage("Could not verify treatment access right now.");
          setIsModalOpen(true);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadTreatmentContent() {
    setIsLoadingTreatment(true);

    try {
      const response = await fetch(treatmentContentHref, {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsModalOpen(true);
        }

        setFeedbackMessage(await getResponseError(response, "Treatment access is configured, but the private copy is not ready yet."));
        return false;
      }

      const payload = (await response.json()) as TreatmentPayload;
      setTreatment(payload);
      setFeedbackMessage("");
      setIsModalOpen(false);
      return true;
    } catch {
      setFeedbackMessage("Could not load the protected treatment right now.");
      return false;
    } finally {
      setIsLoadingTreatment(false);
    }
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      const response = await fetch(treatmentAccessHref, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setFeedbackMessage(
          await getResponseError(
            response,
            "Access unavailable. Share your email through the contact page first, then use the current treatment password."
          )
        );
        return;
      }

      await loadTreatmentContent();
    } catch {
      setFeedbackMessage("Could not open the treatment gate right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLockAgain() {
    setIsLoadingTreatment(true);

    try {
      await fetch(treatmentAccessHref, {
        method: "DELETE"
      });
    } finally {
      setTreatment(null);
      setIsModalOpen(true);
      setIsLoadingTreatment(false);
    }
  }

  const statusLabel = treatment ? "Unlocked" : isCheckingSession ? "Checking access" : "Locked";

  if (isBongTourPreview) {
    return (
      <section className="bt-world bt-treatment" aria-labelledby={titleId}>
        <div className="bt-treatment__shell">
          <header className="bt-treatment__intro">
            <p className="bt-section-header__eyebrow">Feature treatment preview</p>
            <h1 id={titleId}>Bong Tour</h1>
            <p id={descriptionId} className="bt-treatment__deck">
              {bongTourTreatmentLogline}
            </p>

            <div className="bt-treatment__actions">
              <Button as="a" href="/bong-tour" className="bt-button bt-button--outline">
                Back to Bong Tour
              </Button>
              <Button as="a" href={bongTourContactHref} className="bt-button">
                {bongTourContactCtaLabel}
              </Button>
              <Button as="a" href={wallsDevineSignalListHref} className="bt-button bt-button--outline">
                Join the Volume 1 Signal List
              </Button>
            </div>

            <p className="bt-treatment__meta-line">{`Private treatment opens ${june30LaunchDateLabel}. No screenplay pages are exposed on the public route before then.`}</p>
          </header>

          <article className="bt-treatment__lock-card">
            <div className="bt-treatment__lock-grid">
              <section className="bt-treatment__track">
                <p className="bt-section-header__eyebrow">Reader Access</p>
                <h2>Request a reading copy.</h2>
                <p>Screenplay drafts, director lookbooks, and character bibles are circulated privately for production partners and talent.</p>
                <div className="bt-world__list-block">
                  <ul>
                    {previewAccessChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bt-treatment__track-actions">
                  <Button as="a" href={bongTourContactHref} className="bt-button">
                    {bongTourContactCtaLabel}
                  </Button>
                </div>
              </section>

              <section className="bt-treatment__track bt-treatment__track--secondary">
                <p className="bt-section-header__eyebrow">Original Score</p>
                <h2>Listen to the studio catalog.</h2>
                <p>Explore the studio's debut release, Walls/Devine Volume 1, tracked live on 2-inch tape in Los Angeles.</p>
                <div className="bt-world__list-block">
                  <ul>
                    {previewSignalChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bt-treatment__track-actions">
                  <Button as="a" href="/walls-devine" className="bt-button">
                    Open Walls/Devine
                  </Button>
                  <Button as="a" href={wallsDevineSignalListHref} className="bt-button bt-button--outline">
                    Join the Studio Mailing List
                  </Button>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="bt-world bt-treatment" aria-labelledby={titleId}>
      <div className="bt-treatment__shell">
        <header className="bt-treatment__intro">
          <p className="bt-section-header__eyebrow">Feature treatment</p>
          <h1 id={titleId}>Bong Tour</h1>
          <p id={descriptionId} className="bt-treatment__deck">
            {bongTourTreatmentLogline}
          </p>

          <div className="bt-treatment__actions">
            <Button as="a" href="/bong-tour" className="bt-button bt-button--outline">
              Back to Bong Tour
            </Button>
            <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
              {bongTourContactCtaLabel}
            </Button>
            {treatment ? (
              <Button as="a" href="/bong-tour#score-sketches" className="bt-button">
                Explore Cue Rooms
              </Button>
            ) : (
              <Button type="button" className="bt-button" onClick={() => setIsModalOpen(true)} disabled={isCheckingSession}>
                Open Approved-Reader Gate
              </Button>
            )}
          </div>

          <p className="bt-treatment__meta-line" aria-live="polite">
            {treatment
              ? `${getSourceLabel(treatment.source)} · Authorized for ${treatment.viewerEmail} · ${formatUpdatedAt(treatment.updatedAt)}`
              : statusLabel === "Checking access"
                ? "Checking access to the private reading copy."
                : "Private reading copy for approved readers."}
            {treatment ? (
              <>
                {" "}
                <button type="button" className="bt-treatment__lock-toggle" onClick={handleLockAgain} disabled={isLoadingTreatment}>
                  Lock again
                </button>
              </>
            ) : null}
          </p>
        </header>

        {feedbackMessage && !isModalOpen ? <p className="bt-treatment__feedback">{feedbackMessage}</p> : null}

        {treatment ? (
          <>
            <aside className="bt-treatment__buyer-note" aria-label="Story and production notes">
              <p className="bt-section-header__eyebrow">Story &amp; Tone</p>
              <ul>
                {bongTourTreatmentTravelNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </aside>

            <article className="bt-treatment__paper" aria-label="Protected treatment text">
              <div className="bt-treatment__paper-head">
                <div>
                  <p className="bt-section-header__eyebrow">Treatment</p>
                  <h2>{treatment.title}</h2>
                </div>
                <p className="bt-treatment__paper-meta">{formatUpdatedAt(treatment.updatedAt)}</p>
              </div>

              <pre className="bt-treatment__body">{treatment.content}</pre>
            </article>
          </>
        ) : (
          <article className="bt-treatment__lock-card">
            <div className="bt-treatment__lock-grid">
              <section className="bt-treatment__track">
                <p className="bt-section-header__eyebrow">Approved Partners</p>
                <h2>Access the reading copy.</h2>
                <p>Enter your approved email and credentials to read the screenplay treatment.</p>
                <div className="bt-world__list-block">
                  <ul>
                    {approvedReaderChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bt-treatment__track-actions">
                  <Button type="button" className="bt-button" onClick={() => setIsModalOpen(true)} disabled={isCheckingSession}>
                    Enter Reading Room
                  </Button>
                </div>
              </section>

              <section className="bt-treatment__track bt-treatment__track--secondary">
                <p className="bt-section-header__eyebrow">New Inquiries</p>
                <h2>Request a reading copy.</h2>
                <p>New readers should route through the studio contact form so reading copies remain watermarked and private.</p>
                <div className="bt-world__list-block">
                  <ul>
                    {newReaderChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bt-treatment__track-actions">
                  <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
                    {bongTourContactCtaLabel}
                  </Button>
                </div>
              </section>
            </div>
          </article>
        )}

        {isModalOpen ? (
          <div className="bt-treatment__modal" role="presentation">
            <div className="bt-treatment__modal-backdrop" onClick={() => setIsModalOpen(false)} />
            <div className="bt-treatment__modal-panel" role="dialog" aria-modal="true" aria-labelledby={`${titleId}-modal`} aria-describedby={`${descriptionId}-modal`}>
              <button type="button" className="bt-treatment__modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close treatment gate">
                Close
              </button>

              <div className="bt-treatment__modal-copy">
                <p className="bt-section-header__eyebrow">Private Reading Copy</p>
                <h2 id={`${titleId}-modal`}>Enter Access Credentials</h2>
                <p id={`${descriptionId}-modal`}>Enter the approved email address and private password issued for your reading copy.</p>
              </div>

              <div className="bt-treatment__modal-guides" aria-label="Treatment access paths">
                <article className="bt-treatment__modal-guide">
                  <span>Approved readers</span>
                  <p>Use your registered email and current private reading password.</p>
                </article>

                <article className="bt-treatment__modal-guide">
                  <span>New requests</span>
                  <p>Inquire directly through the studio contact desk for a watermarked copy.</p>
                </article>
              </div>

              <form className="bt-treatment__form" onSubmit={handleUnlock}>
                <label className="bt-treatment__field" htmlFor="bt-treatment-email">
                  <span>Email already on file</span>
                  <input
                    id="bt-treatment-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="reader@studio.com"
                    required
                  />
                </label>

                <label className="bt-treatment__field" htmlFor="bt-treatment-password">
                  <span>Access password</span>
                  <input
                    id="bt-treatment-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Current private password"
                    required
                  />
                </label>

                {feedbackMessage ? <p className="bt-treatment__feedback bt-treatment__feedback--modal">{feedbackMessage}</p> : null}

                <div className="bt-treatment__modal-actions">
                  <Button type="submit" className="bt-button" disabled={isSubmitting || isLoadingTreatment}>
                    {isSubmitting || isLoadingTreatment ? "Checking access" : "Open Treatment Gate"}
                  </Button>
                  <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
                    {bongTourContactCtaLabel}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}