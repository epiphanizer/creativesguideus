"use client";

import { type FormEvent, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/Button";

type TreatmentPayload = {
  title: string;
  content: string;
  updatedAt: string;
  source: string;
  viewerEmail: string;
};

const bongTourTreatmentLogline =
  "A sacred bong vanishes into the Ganges and reappears on Sunset Boulevard, binding two screenwriters to a Hollywood trip that keeps mutating between cult comedy, diaspora myth, and industry reckoning.";
const bongTourTreatmentTravelNotes = [
  "Diaspora masala satire with cult-comedy propulsion.",
  "A screenplay world built to carry soundtrack and collectible expansion.",
  "Sequel gravity without flattening the emotional core."
] as const;

const treatmentAccessHref = "/api/bong-tour/treatment/access";
const treatmentContentHref = "/api/bong-tour/treatment/content";
const bongTourContactHref = `/contact?${new URLSearchParams({
  context: "bong-tour-intake",
  project: "Bong Tour",
  inquiryType: "partnership"
}).toString()}`;
const bongTourContactCtaLabel = "Let's talk";

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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTreatment, setIsLoadingTreatment] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  useEffect(() => {
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
                Request Treatment Access
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
            <aside className="bt-treatment__buyer-note" aria-label="Why it travels">
              <p className="bt-section-header__eyebrow">Why it travels</p>
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
            <p className="bt-section-header__eyebrow">Private reading copy</p>
            <h2>Request treatment access.</h2>
            <p>Use the email already shared through CGU and the current password to read the screenplay world.</p>
            <div className="bt-world__list-block">
              <ul>
                <li>The treatment stays out of the initial page response until the gate passes.</li>
                <li>Share your email through the contact page if you are new here.</li>
              </ul>
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
                <p className="bt-section-header__eyebrow">Private reading copy</p>
                <h2 id={`${titleId}-modal`}>Request treatment access.</h2>
                <p id={`${descriptionId}-modal`}>Use the email already shared through CGU and the current password.</p>
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
                    {isSubmitting || isLoadingTreatment ? "Checking access" : "Request Treatment Access"}
                  </Button>
                  <Button as="a" href={bongTourContactHref} className="bt-button bt-button--outline">
                    Say hello first
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