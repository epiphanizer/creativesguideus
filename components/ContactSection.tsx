"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

import { createContactIntake } from "@/lib/firebase/contact-intake";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

type ContactOption = {
  value: string;
  label: string;
};

type ContactPrefill = {
  contextId: string;
  inquiryType: string;
  projectTitle: string;
};

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  projectTitle: string;
  inquiryType: string;
  goal: string;
  surface: string;
  engagement: string;
  timeline: string;
  budgetRange: string;
  brief: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

type ContactSectionProps = {
  headingLevel?: "h1" | "h2" | "h3" | "h4";
};

type ContactBannerTone = "default" | "walls" | "bong";

type ContactBanner = {
  tone: ContactBannerTone;
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
};

const inquiryTypeOptions: ContactOption[] = [
  { value: "live-booking", label: "Live booking" },
  { value: "listening-session", label: "Listening session" },
  { value: "mailing-list", label: "Mailing list" },
  { value: "screening", label: "Screening" },
  { value: "performance", label: "Performance" },
  { value: "partnership", label: "Partnership" }
];

const goalOptions: ContactOption[] = [
  { value: "launch", label: "Launch something new" },
  { value: "reset", label: "Reset an existing experience" },
  { value: "product", label: "Build a product layer" },
  { value: "systems", label: "Untangle internal systems" }
];

const surfaceOptions: ContactOption[] = [
  { value: "brand-site", label: "Brand or editorial site" },
  { value: "campaign-world", label: "Campaign or release world" },
  { value: "product-app", label: "Product or app layer" },
  { value: "internal-platform", label: "Internal platform" }
];

const engagementOptions: ContactOption[] = [
  { value: "direction", label: "Direction and framing" },
  { value: "experience-build", label: "Experience design and build" },
  { value: "systems-layer", label: "Systems layer and tooling" },
  { value: "end-to-end", label: "End-to-end partner" }
];

const timelineOptions: ContactOption[] = [
  { value: "now", label: "Now" },
  { value: "this-quarter", label: "This quarter" },
  { value: "next-quarter", label: "Next quarter" },
  { value: "exploring", label: "Exploring" }
];

const budgetRangeOptions: ContactOption[] = [
  { value: "under-15k", label: "Under 15k" },
  { value: "15k-40k", label: "15k to 40k" },
  { value: "40k-90k", label: "40k to 90k" },
  { value: "90k-plus", label: "90k+" },
  { value: "not-sure", label: "Not sure yet" }
];

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  company: "",
  projectTitle: "",
  inquiryType: "",
  goal: "",
  surface: "",
  engagement: "",
  timeline: "",
  budgetRange: "",
  brief: ""
};

function normalizeQueryToken(value: string | null) {
  return typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    : "";
}

function getOptionLabel(options: ContactOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

function hasOption(options: ContactOption[], value: string) {
  return options.some((option) => option.value === value);
}

function buildContactPrefill(search: string): ContactPrefill {
  const params = new URLSearchParams(search);

  return {
    contextId: normalizeQueryToken(params.get("context")),
    inquiryType: normalizeQueryToken(params.get("inquiryType")),
    projectTitle: params.get("project")?.trim() ?? ""
  };
}

function buildInitialForm(prefill: ContactPrefill): ContactFormState {
  return {
    ...emptyForm,
    projectTitle: prefill.projectTitle,
    inquiryType: hasOption(inquiryTypeOptions, prefill.inquiryType) ? prefill.inquiryType : ""
  };
}

function buildContactBanner(prefill: ContactPrefill): ContactBanner {
  if (prefill.contextId === "walls-devine-booking") {
    return {
      tone: "walls",
      eyebrow: "Walls/Devine booking",
      title: "Booking route loaded",
      description: "Keep the room type, timing, and booking context here so the ask stays attached to the live release world.",
      chips: ["Live booking", "Timing", "Collector-world context"]
    };
  }

  if (prefill.contextId === "walls-devine-mailing-list") {
    return {
      tone: "walls",
      eyebrow: "Walls/Devine signal",
      title: "Mailing-list route loaded",
      description: "This intake currently routes drop alerts, listening-room updates, and collector unlock notices through CGU until the dedicated list is live.",
      chips: ["Drop alerts", "Listening-room updates", "Collector unlock notices"]
    };
  }

  if (prefill.contextId === "bong-tour-treatment-access") {
    return {
      tone: "bong",
      eyebrow: "Bong Tour treatment",
      title: "Protected reader route loaded",
      description: "Use this lane to introduce a new reader before the private treatment gate is opened. Approved readers later use that same email inside the gate.",
      chips: ["Private treatment", "Reader approval", "Score-world context"]
    };
  }

  if (prefill.contextId === "bong-tour-intake") {
    return {
      tone: "bong",
      eyebrow: "Bong Tour route",
      title: "Screenplay world intake loaded",
      description: "Route soundtrack, production, partnership, and treatment-adjacent conversations through one clear entry point.",
      chips: ["Screenplay world", "Cue-room proof", "Partnership routing"]
    };
  }

  return {
    tone: "default",
    eyebrow: "CGU intake",
    title: "One route for the active worlds",
    description: "Use the guided intake to route booking asks, release-world collaborations, and system builds without losing context.",
    chips: ["Booking and release", "Partnerships", "Systems builds"]
  };
}

export function ContactSection({ headingLevel = "h2" }: ContactSectionProps) {
  const [prefill, setPrefill] = useState<ContactPrefill>({ contextId: "", inquiryType: "", projectTitle: "" });
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const contextBanner = buildContactBanner(prefill);

  useEffect(() => {
    const nextPrefill = buildContactPrefill(window.location.search);
    setPrefill(nextPrefill);
    setForm(buildInitialForm(nextPrefill));
  }, []);

  function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setSubmissionState("idle");
    setFeedbackMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.brief.trim()) {
      setSubmissionState("error");
      setFeedbackMessage("Name, email, and a clear project note are required before sending the intake.");
      return;
    }

    setSubmissionState("submitting");
    setFeedbackMessage("");

    try {
      const inquiryTypeLabel = getOptionLabel(inquiryTypeOptions, form.inquiryType);
      const goalLabel = getOptionLabel(goalOptions, form.goal);
      const surfaceLabel = getOptionLabel(surfaceOptions, form.surface);
      const engagementLabel = getOptionLabel(engagementOptions, form.engagement);
      const timelineLabel = getOptionLabel(timelineOptions, form.timeline);
      const budgetRangeLabel = getOptionLabel(budgetRangeOptions, form.budgetRange);

      await createContactIntake({
        name: form.name,
        email: form.email,
        company: form.company,
        projectTitle: form.projectTitle,
        brief: form.brief,
        source: prefill.contextId ? `contact:${prefill.contextId}` : "contact-page",
        interest: [form.projectTitle.trim(), inquiryTypeLabel || "Guided intake"].filter(Boolean).join(" · "),
        contextId: prefill.contextId,
        inquiryType: form.inquiryType,
        inquiryTypeLabel,
        goal: form.goal,
        goalLabel,
        surface: form.surface,
        surfaceLabel,
        engagement: form.engagement,
        engagementLabel,
        timeline: form.timeline,
        timelineLabel,
        budgetRange: form.budgetRange,
        budgetRangeLabel
      });

      setForm(buildInitialForm(prefill));
      setSubmissionState("success");
      setFeedbackMessage("Intake received. It is now sitting inside the CGU signal flow for review and routing.");
    } catch (error) {
      setSubmissionState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Could not send the intake right now.");
    }
  }

  const contextNote =
    prefill.contextId === "walls-devine-booking"
      ? "Walls/Devine booking context is loaded. Leave the room type, timing, and booking note here and it will stay inside the CGU domain."
      : prefill.contextId === "walls-devine-mailing-list"
        ? "Walls/Devine mailing-list request context is loaded. Leave the best contact details here and this request will be routed through the CGU intake flow for drop alerts, listening-room updates, and collector unlock notices."
        : prefill.contextId === "bong-tour-treatment-access"
          ? "Bong Tour treatment access context is loaded. Use this route to introduce a new reader before the private gate opens, or confirm the email that should be approved."
          : prefill.contextId === "bong-tour-intake"
            ? "Bong Tour intake context is loaded. Leave the clearest soundtrack, production, or partnership note here so the screenplay world can route cleanly."
      : "Use this intake to route booking asks, release-world collaborations, soundtrack conversations, and system builds through one clear entry point.";

  return (
    <SectionShell id="contact" labelledBy="contact-title" innerClassName="cg-contact__shell">
      <div className="cg-contact">
        <div className="cg-contact__intro">
          <div className={`cg-contact__context-banner cg-contact__context-banner--${contextBanner.tone}`} aria-label="Active contact route">
            <div className="cg-contact__context-copy">
              <p className="cg-contact__context-eyebrow">{contextBanner.eyebrow}</p>
              <strong className="cg-contact__context-title">{contextBanner.title}</strong>
              <p className="cg-contact__context-description">{contextBanner.description}</p>
            </div>

            <div className="cg-contact__context-chips" aria-label="Route highlights">
              {contextBanner.chips.map((chip) => (
                <span key={chip} className="cg-contact__context-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <SectionHeader
            id="contact-title"
            headingLevel={headingLevel}
            eyebrow="Guided intake"
            title="Choose the right room"
            description="Stay on the CGU domain, route the work cleanly, and leave enough signal for the next move to be obvious."
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16v10H4z" />
                <path d="M4 9l8 5 8-5" />
              </svg>
            }
            iconLabel="Creative contact emblem"
          />

          <div className="cg-contact__meta">
            <div className="cg-contact__slots" aria-label="Intake routing note">
              <span>Routing note</span>
              <p>{contextNote}</p>
            </div>

            {(prefill.projectTitle || prefill.inquiryType) ? (
              <div className="cg-contact__prefill" aria-label="Loaded contact context">
                {prefill.projectTitle ? <span className="cg-contact__prefill-chip">{prefill.projectTitle}</span> : null}
                {prefill.inquiryType ? (
                  <span className="cg-contact__prefill-chip">{getOptionLabel(inquiryTypeOptions, prefill.inquiryType)}</span>
                ) : null}
              </div>
            ) : null}

            <ul className="cg-contact__summary" aria-label="What this intake captures">
              <li>Inquiry type, timing, and range so the request lands in the right lane.</li>
              <li>Project context and brief so the conversation can start from the real work instead of a blank inbox.</li>
              <li>Direct contact details kept inside the CGU signal flow rather than a third-party form handoff.</li>
            </ul>

            <p>
              Prefer a direct uplink? Email <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a> with the clearest next step you need.
            </p>
          </div>
        </div>

        <form className="cg-contact__form" onSubmit={handleSubmit} noValidate aria-busy={submissionState === "submitting"}>
          <div className="cg-contact__field-row">
            <div className="cg-contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleFieldChange}
                required
              />
            </div>

            <div className="cg-contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleFieldChange}
                required
              />
            </div>
          </div>

          <div className="cg-contact__field-row">
            <div className="cg-contact__field">
              <label htmlFor="contact-company">Company or context</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Studio, company, or context"
                value={form.company}
                onChange={handleFieldChange}
              />
            </div>

            <div className="cg-contact__field">
              <label htmlFor="contact-project-title">Project or release</label>
              <input
                id="contact-project-title"
                name="projectTitle"
                type="text"
                placeholder="Walls/Devine, Bong Tour, or project name"
                value={form.projectTitle}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          <div className="cg-contact__field-row">
            <div className="cg-contact__field">
              <label htmlFor="contact-inquiry-type">Inquiry type</label>
              <select id="contact-inquiry-type" name="inquiryType" value={form.inquiryType} onChange={handleFieldChange}>
                <option value="">Choose the room</option>
                {inquiryTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cg-contact__field">
              <label htmlFor="contact-timeline">Timeline</label>
              <select id="contact-timeline" name="timeline" value={form.timeline} onChange={handleFieldChange}>
                <option value="">Choose timing</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cg-contact__field-row">
            <div className="cg-contact__field">
              <label htmlFor="contact-goal">Goal</label>
              <select id="contact-goal" name="goal" value={form.goal} onChange={handleFieldChange}>
                <option value="">Choose the lead move</option>
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cg-contact__field">
              <label htmlFor="contact-surface">Surface</label>
              <select id="contact-surface" name="surface" value={form.surface} onChange={handleFieldChange}>
                <option value="">Choose the primary surface</option>
                {surfaceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cg-contact__field-row">
            <div className="cg-contact__field">
              <label htmlFor="contact-engagement">Engagement</label>
              <select id="contact-engagement" name="engagement" value={form.engagement} onChange={handleFieldChange}>
                <option value="">Choose the lead mode</option>
                {engagementOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cg-contact__field">
              <label htmlFor="contact-budget-range">Budget range</label>
              <select id="contact-budget-range" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                <option value="">Choose a range</option>
                {budgetRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cg-contact__field cg-contact__field--full">
            <label htmlFor="contact-brief">Project note</label>
            <textarea
              id="contact-brief"
              name="brief"
              rows={6}
              placeholder="Scope, room size, desired date, collaborators, links, or the exact conversation you want to have."
              value={form.brief}
              onChange={handleFieldChange}
              required
            />
          </div>

          {feedbackMessage ? (
            <p className={`cg-contact__form-status cg-contact__form-status--${submissionState === "success" ? "success" : "error"}`} role="status">
              {feedbackMessage}
            </p>
          ) : null}

          <div className="cg-contact__footer">
            <Button type="submit" className="cg-contact__submit" disabled={submissionState === "submitting"}>
              {submissionState === "submitting" ? "Sending intake..." : "Send intake"}
            </Button>
            <span className="cg-contact__privacy">Your intelligence stays inside the core studio signal flow.</span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
