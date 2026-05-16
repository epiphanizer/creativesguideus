"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { EcosystemLeadInput } from "@/lib/admin/types";
import { cx } from "@/lib/cx";
import { createEcosystemLead } from "@/lib/firebase/ecosystem-leads";

type EcosystemSignupFormProps = {
  source: string;
  interest: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  note?: string;
  compact?: boolean;
  emailOnly?: boolean;
  className?: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function EcosystemSignupForm({
  source,
  interest,
  eyebrow,
  title,
  description,
  submitLabel = "Join the collector circle",
  successMessage = "You are in. Watch your inbox for first-access drops and hidden-room invites.",
  note = "Used for first-listen access, private drops, and launch-night signals only.",
  compact = false,
  emailOnly = false,
  className
}: EcosystemSignupFormProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmissionState("submitting");
    setFeedbackMessage("");

    try {
      const payload = {
        email,
        fullName: emailOnly ? undefined : fullName,
        source,
        interest
      } satisfies EcosystemLeadInput;

      await createEcosystemLead(payload);

      setEmail("");
      setFullName("");
      setSubmissionState("success");
      setFeedbackMessage(successMessage);
    } catch (error) {
      setSubmissionState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Could not save your collector signup.");
    }
  }

  return (
    <section className={cx("wd-signup", compact && "wd-signup--compact", emailOnly && "wd-signup--email-only", className)} aria-label={title ?? "Collector signup"}>
      {eyebrow ? <p className="wd-signup__eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="wd-signup__title">{title}</h2> : null}
      {description ? <p className="wd-signup__description">{description}</p> : null}

      <form className="wd-signup__form" onSubmit={handleSubmit}>
        {emailOnly ? (
          <>
            <div className="wd-signup__minimal-row">
              <label className="wd-signup__field wd-signup__field--email-only">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={submissionState === "submitting"}
                />
              </label>

              <Button type="submit" variant="primary" size={compact ? "sm" : "md"} disabled={submissionState === "submitting"}>
                {submissionState === "submitting" ? "Joining..." : submitLabel}
              </Button>
            </div>
            {note ? <p className="wd-signup__note">{note}</p> : null}
          </>
        ) : (
          <>
            <div className="wd-signup__split">
              <label className="wd-signup__field">
                <span>Name</span>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Optional"
                  autoComplete="name"
                  disabled={submissionState === "submitting"}
                />
              </label>

              <label className="wd-signup__field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={submissionState === "submitting"}
                />
              </label>
            </div>

            <div className="wd-signup__actions">
              <Button type="submit" variant="primary" size={compact ? "sm" : "md"} disabled={submissionState === "submitting"}>
                {submissionState === "submitting" ? "Joining..." : submitLabel}
              </Button>
              {note ? <p className="wd-signup__note">{note}</p> : null}
            </div>
          </>
        )}

        {feedbackMessage ? (
          <p className={cx("wd-signup__feedback", submissionState === "success" && "wd-signup__feedback--success", submissionState === "error" && "wd-signup__feedback--error")}>
            {feedbackMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default EcosystemSignupForm;