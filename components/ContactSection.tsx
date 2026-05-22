"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

import { createContactIntake } from "@/lib/firebase/contact-intake";
import { trackAnalyticsEvent } from "@/lib/firebase/analytics";
import {
  GuidedIntakeChoiceGrid,
  GuidedIntakeField,
  GuidedIntakeFieldRow,
  GuidedIntakeFooter,
  GuidedIntakeProgress,
  GuidedIntakeStatusMessage,
  GuidedIntakeStepHeader
} from "@/components/contact-guided/GuidedIntakePrimitives";
import { buildContactPrefill, type ContactPrefill } from "@/lib/contact-intake-routing";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

type ContactOption = {
  value: string;
  label: string;
};

type ContactChoiceOption = ContactOption & {
  description: string;
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

type RouteDetailsState = {
  updatePreferences: string[];
  bookingLocation: string;
  relationshipToProject: string;
  readerReason: string;
  partnershipFocus: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

type ContactSectionProps = {
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  initialSearch?: string;
  surface?: "page" | "modal";
};

type ContactFlowId = "general" | "walls-mailing" | "walls-booking" | "bong-treatment" | "bong-partnership";

type GuidedStepId = "intent" | "project" | "contact" | "details" | "review";

type GuidedStep = {
  id: GuidedStepId;
  label: string;
  title: string;
  description: string;
  helper: string;
};

type ContactFlow = {
  id: ContactFlowId;
  routingNote: string;
  summary: string[];
  trustNote: string;
  noteLabel: string;
  notePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  steps: GuidedStep[];
};

type ReviewItem = {
  label: string;
  value: string;
  description: string;
};

const inquiryTypeOptions: ContactOption[] = [
  { value: "live-booking", label: "Live booking" },
  { value: "listening-session", label: "Listening session" },
  { value: "mailing-list", label: "Mailing list" },
  { value: "screening", label: "Screening" },
  { value: "performance", label: "Performance" },
  { value: "partnership", label: "Partnership" }
];

const inquiryTypeCardOptions: ContactChoiceOption[] = [
  {
    value: "live-booking",
    label: "Live booking",
    description: "Bring a room, screening, or live performance context into the conversation."
  },
  {
    value: "listening-session",
    label: "Listening session",
    description: "Set up a smaller listening-room or curated playback conversation around the work."
  },
  {
    value: "mailing-list",
    label: "Mailing list",
    description: "Route signal updates, drop alerts, and collector unlock notices through the studio intake."
  },
  {
    value: "screening",
    label: "Screening",
    description: "Frame a screening, visual companion, or event-world activation around the release."
  },
  {
    value: "performance",
    label: "Performance",
    description: "Open a staged performance or live activation conversation without losing the project context."
  },
  {
    value: "partnership",
    label: "Partnership",
    description: "Talk production, soundtrack, collector-world, or long-form collaborator fit."
  }
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

const mailingPreferenceOptions: ContactChoiceOption[] = [
  {
    value: "drop-alerts",
    label: "Drop alerts",
    description: "The main release drops, merch releases, and major listening-room moments."
  },
  {
    value: "listening-room-updates",
    label: "Listening-room updates",
    description: "New playback notes, room updates, and audio-world additions around Volume 1."
  },
  {
    value: "collector-unlocks",
    label: "Collector unlock notices",
    description: "Signals tied to chapter reveals, collector paths, and deeper worldbuilding updates."
  }
];

const partnershipFocusOptions: ContactChoiceOption[] = [
  {
    value: "production",
    label: "Production",
    description: "Film production, packaging, financing, or strategic collaborator fit."
  },
  {
    value: "soundtrack",
    label: "Soundtrack",
    description: "Music direction, soundtrack expansion, or release-world collaboration around the score."
  },
  {
    value: "collector-world",
    label: "Collector world",
    description: "Physical objects, editions, or companion experiences that extend the film."
  },
  {
    value: "partnership",
    label: "Partnership",
    description: "A broader collaboration lane when the fit spans more than one surface."
  }
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

const emptyRouteDetails: RouteDetailsState = {
  updatePreferences: [],
  bookingLocation: "",
  relationshipToProject: "",
  readerReason: "",
  partnershipFocus: ""
};

function getOptionLabel(options: ContactOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

function hasOption(options: ContactOption[], value: string) {
  return options.some((option) => option.value === value);
}

function formatOptionLabels(values: string[], options: ContactOption[]) {
  return values.map((value) => getOptionLabel(options, value)).filter(Boolean);
}

function buildInitialForm(prefill: ContactPrefill): ContactFormState {
  return {
    ...emptyForm,
    projectTitle: prefill.projectTitle,
    inquiryType: hasOption(inquiryTypeOptions, prefill.inquiryType) ? prefill.inquiryType : "",
    goal: hasOption(goalOptions, prefill.goal) ? prefill.goal : "",
    surface: hasOption(surfaceOptions, prefill.surface) ? prefill.surface : "",
    engagement: hasOption(engagementOptions, prefill.engagement) ? prefill.engagement : "",
    timeline: hasOption(timelineOptions, prefill.timeline) ? prefill.timeline : "",
    budgetRange: hasOption(budgetRangeOptions, prefill.budgetRange) ? prefill.budgetRange : ""
  };
}

function getContactFlowId(prefill: ContactPrefill): ContactFlowId {
  if (prefill.contextId === "walls-devine-mailing-list") {
    return "walls-mailing";
  }

  if (prefill.contextId === "walls-devine-booking") {
    return "walls-booking";
  }

  if (prefill.contextId === "bong-tour-treatment-access") {
    return "bong-treatment";
  }

  if (prefill.contextId === "bong-tour-intake") {
    return "bong-partnership";
  }

  return "general";
}

function buildContactFlow(prefill: ContactPrefill): ContactFlow {
  const flowId = getContactFlowId(prefill);

  if (flowId === "walls-mailing") {
    return {
      id: flowId,
      routingNote:
        "Walls/Devine mailing-list request context is loaded. This stays inside the CGU intake flow until the dedicated list is wired.",
      summary: [
        "Signal preferences stay attached to the Walls/Devine route instead of a generic signup widget.",
        "Your email remains the anchor for future drop alerts, listening-room updates, and collector unlock notices.",
        "Requests are reviewed manually until the dedicated mailing provider is live."
      ],
      trustNote: "This is a request lane, not an instant subscription. CGU reviews it first, then routes the right signal back to this inbox.",
      noteLabel: "Optional note",
      notePlaceholder: "Anything we should know about how you found the record or what kind of update matters most?",
      companyLabel: "Company or context",
      companyPlaceholder: "Label, publication, collaborator, or listener context",
      steps: [
        {
          id: "intent",
          label: "Confirm request",
          title: "Request the signal lane",
          description: "This is the Walls/Devine request path for drop alerts, listening-room updates, and collector unlock notices.",
          helper: "You are not entering a calendar or third-party newsletter flow here. CGU keeps the request attached to Volume 1."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the inbox",
          description: "Use the best email for future updates so the request stays attached to the right person.",
          helper: "A company or listener context is optional, but useful if this request comes from a publication, label, or collaborator."
        },
        {
          id: "details",
          label: "Update preferences",
          title: "Choose the updates that matter",
          description: "Pick the signal types you actually want, then add any note that helps the studio route this cleanly.",
          helper: "If you skip this step, CGU treats it as a general request for Walls/Devine updates."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the routed request",
          description: "Confirm the contact lane, then send it into the studio signal flow.",
          helper: "This request is reviewed manually before any future mailing or unlock updates are sent."
        }
      ]
    };
  }

  if (flowId === "walls-booking") {
    return {
      id: flowId,
      routingNote:
        "Walls/Devine booking context is loaded. Leave the room type, timing, and booking note here so it stays attached to Volume 1.",
      summary: [
        "The booking lane stays attached to the release world instead of dropping into a generic calendar flow.",
        "Inquiry type, timing, and room note remain visible to booking-fit review in admin.",
        "Direct contact details stay inside CGU rather than being handed off to a third-party scheduler."
      ],
      trustNote:
        "This route is for listening sessions, screenings, live bookings, and partnership-adjacent room asks around Walls/Devine.",
      noteLabel: "Room note",
      notePlaceholder: "Room size, event type, desired date, collaborators, press angle, or the exact booking context.",
      companyLabel: "Company or context",
      companyPlaceholder: "Venue, organizer, promoter, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm intent",
          title: "Choose the booking lane",
          description: "Pick the closest room so CGU routes the ask to the right side of the release world.",
          helper: "You can keep this inside the Walls/Devine lane even if the ask spans live performance, listening, screening, or partnership."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the conversation",
          description: "Use the best email and organization context so the reply can start from the real room.",
          helper: "Independent rooms are fine. If there is no formal venue yet, use the clearest working context you have."
        },
        {
          id: "details",
          label: "Booking details",
          title: "Describe the room",
          description: "Leave the location, timing, and a clear note so the booking path lands with enough signal to move.",
          helper: "A concise room note is more important here than perfect scheduling detail."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the booking route",
          description: "Confirm the room, contact lane, and timing before sending the request into CGU.",
          helper: "The request stays attached to Walls/Devine rather than being stripped into a generic intake row."
        }
      ]
    };
  }

  if (flowId === "bong-treatment") {
    return {
      id: flowId,
      routingNote:
        "Bong Tour treatment access context is loaded. Use this route to introduce a new reader before the private gate opens.",
      summary: [
        "The private treatment stays off the public route until access is reviewed and approved.",
        "The submitted email becomes the identity that later enters the protected reader gate.",
        "Reader context and access reason remain tied to the film instead of a generic inbox ask."
      ],
      trustNote:
        "This does not grant instant access. CGU reviews the reader request first, then approved readers use the same email inside the protected gate.",
      noteLabel: "Additional context",
      notePlaceholder: "Any extra context around the reader, the relationship, or the conversation this should unlock.",
      companyLabel: "Role or company",
      companyPlaceholder: "Producer, reader, company, publication, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm request",
          title: "Request private reading review",
          description: "This route is for new-reader treatment access, not an instant unlock.",
          helper: "The screenplay copy stays behind the existing protected gate until the request is reviewed."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the reader identity",
          description: "Use the exact email the reader should later use inside the private gate.",
          helper: "Role or company context helps the review, but the submitted email is the key identity."
        },
        {
          id: "details",
          label: "Reader details",
          title: "Describe the reader fit",
          description: "Leave the relationship to the project and why this reader needs the private copy.",
          helper: "A concise reason is enough. The goal is to protect the treatment while keeping approvals legible."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the reader request",
          description: "Confirm the reader identity and access note before sending it into the review lane.",
          helper: "Approved readers later return to the protected gate with this same email."
        }
      ]
    };
  }

  if (flowId === "bong-partnership") {
    return {
      id: flowId,
      routingNote:
        "Bong Tour intake context is loaded. Leave the clearest production, soundtrack, or partnership note here so the screenplay world can route cleanly.",
      summary: [
        "Production, soundtrack, collector-world, and partnership signals stay attached to the film.",
        "The intake leads with fit and context instead of a scheduling-first experience.",
        "CGU can route the ask cleanly without losing the cue-room or treatment-adjacent context."
      ],
      trustNote:
        "This is the film-fit lane. CGU captures the right signal first, then decides what the next operational move should be.",
      noteLabel: "Partnership note",
      notePlaceholder: "What you see, the fit you want to explore, and the clearest next move around Bong Tour.",
      companyLabel: "Role or company",
      companyPlaceholder: "Studio, producer, music partner, financier, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm intent",
          title: "Open the film-fit lane",
          description: "This route is for production, soundtrack, collector-world, or broader partnership conversations around Bong Tour.",
          helper: "The intake starts with fit and context, not a calendar handoff."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the partner lane",
          description: "Use the best email and role context so the next response can start from the real fit.",
          helper: "If the conversation spans multiple people, use the clearest primary contact here and cover the rest in the note."
        },
        {
          id: "details",
          label: "Partnership details",
          title: "Describe the fit",
          description: "Choose the lane that fits best, add timing if you have it, and leave the clearest note you can.",
          helper: "Production, soundtrack, and collector-world context can all live together here without losing the film signal."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the film-fit route",
          description: "Confirm the focus, contact lane, and timing before sending the note through CGU.",
          helper: "The goal is to preserve the right intent before any later operational routing happens."
        }
      ]
    };
  }

  return {
    id: "general",
    routingNote:
      "Use this intake to route booking asks, release-world collaborations, soundtrack conversations, and system builds through one clear entry point.",
    summary: [
      "Inquiry type, timing, and range stay visible so the request lands in the right lane.",
      "Project context and a real note keep the conversation anchored to the work instead of a blank inbox.",
      "Direct contact details stay inside the CGU signal flow rather than a third-party form handoff."
    ],
    trustNote:
      "This is the main CGU intake route. The guided flow keeps enough signal intact that the next move can be obvious without turning into a scheduling widget.",
    noteLabel: "Project note",
    notePlaceholder: "Scope, desired move, collaborators, links, or the exact conversation you want to have.",
    companyLabel: "Company or context",
    companyPlaceholder: "Studio, company, or context",
    steps: [
      {
        id: "intent",
        label: "Confirm intent",
        title: "Choose the right room",
        description: "Pick the closest lane so the request enters the studio with the right shape.",
        helper: "You do not need perfect information yet. The goal is to keep the first move legible."
      },
      {
        id: "project",
        label: "Project shape",
        title: "Describe the project shape",
        description: "Add the core project details so the request can be routed without guesswork.",
        helper: "Goal, surface, engagement, timing, and range are all helpful, but the project note carries the most weight."
      },
      {
        id: "contact",
        label: "Contact details",
        title: "Anchor the reply path",
        description: "Use the best inbox and context so the conversation can continue cleanly.",
        helper: "If there is no company yet, leave the working context that best explains the lane."
      },
      {
        id: "review",
        label: "Review",
        title: "Review the routed intake",
        description: "Confirm the lane, contact path, and project note before sending it into CGU.",
        helper: "This stays inside the studio signal flow until the next move is clear."
      }
    ]
  };
}

function buildDisplayInquiryLabel(flowId: ContactFlowId, inquiryType: string) {
  if (flowId === "bong-treatment") {
    return "Private reading request";
  }

  return getOptionLabel(inquiryTypeOptions, inquiryType) || "Guided intake";
}

function buildInterestLabel(flowId: ContactFlowId, inquiryTypeLabel: string) {
  if (flowId === "bong-treatment") {
    return "Treatment access";
  }

  return inquiryTypeLabel || "Guided intake";
}

function buildSubmissionBrief(flowId: ContactFlowId, form: ContactFormState, routeDetails: RouteDetailsState) {
  const trimmedBrief = form.brief.trim();
  const timelineLabel = getOptionLabel(timelineOptions, form.timeline);
  const budgetRangeLabel = getOptionLabel(budgetRangeOptions, form.budgetRange);

  if (flowId === "general") {
    return trimmedBrief;
  }

  if (flowId === "walls-mailing") {
    const selectedPreferences = formatOptionLabels(routeDetails.updatePreferences, mailingPreferenceOptions);

    return [
      "Request: Walls/Devine mailing-list updates routed through CGU intake.",
      `Requested updates: ${selectedPreferences.length ? selectedPreferences.join(", ") : "General signal updates"}.`,
      trimmedBrief ? `Note: ${trimmedBrief}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (flowId === "walls-booking") {
    return [
      `Request: ${buildDisplayInquiryLabel(flowId, form.inquiryType)}.`,
      routeDetails.bookingLocation.trim() ? `Location: ${routeDetails.bookingLocation.trim()}.` : "",
      timelineLabel ? `Timing: ${timelineLabel}.` : "",
      budgetRangeLabel ? `Budget range: ${budgetRangeLabel}.` : "",
      trimmedBrief ? `Room note: ${trimmedBrief}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (flowId === "bong-treatment") {
    return [
      "Request: Bong Tour private reading review.",
      routeDetails.relationshipToProject.trim() ? `Relationship to project: ${routeDetails.relationshipToProject.trim()}.` : "",
      routeDetails.readerReason.trim() ? `Reader note: ${routeDetails.readerReason.trim()}` : "",
      trimmedBrief ? `Additional context: ${trimmedBrief}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    "Request: Bong Tour partnership conversation.",
    routeDetails.partnershipFocus ? `Focus: ${getOptionLabel(partnershipFocusOptions, routeDetails.partnershipFocus)}.` : "",
    timelineLabel ? `Timing: ${timelineLabel}.` : "",
    budgetRangeLabel ? `Budget range: ${budgetRangeLabel}.` : "",
    trimmedBrief ? `Partnership note: ${trimmedBrief}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildReviewItems(flow: ContactFlow, form: ContactFormState, routeDetails: RouteDetailsState): ReviewItem[] {
  const contactValue = [form.name.trim(), form.email.trim()].filter(Boolean).join(" · ") || "Contact details pending";
  const timelineLabel = getOptionLabel(timelineOptions, form.timeline) || "Timing still flexible";
  const budgetRangeLabel = getOptionLabel(budgetRangeOptions, form.budgetRange) || "Range still flexible";
  const displayInquiryLabel = buildDisplayInquiryLabel(flow.id, form.inquiryType);

  if (flow.id === "walls-mailing") {
    const selectedPreferences = formatOptionLabels(routeDetails.updatePreferences, mailingPreferenceOptions).join(" · ") || "General signal updates";

    return [
      {
        label: "Request",
        value: "Walls/Devine mailing-list request",
        description: selectedPreferences
      },
      {
        label: "Contact",
        value: contactValue,
        description: form.company.trim() || "Direct listener or collaborator route"
      },
      {
        label: "Project",
        value: form.projectTitle.trim() || "Walls/Devine",
        description: "Routed through CGU until the dedicated list is live."
      },
      {
        label: "Next move",
        value: "Manual signal review",
        description: "CGU reviews this request before any future update goes to this inbox."
      }
    ];
  }

  if (flow.id === "walls-booking") {
    return [
      {
        label: "Room",
        value: displayInquiryLabel,
        description: routeDetails.bookingLocation.trim() || "Location still flexible"
      },
      {
        label: "Project",
        value: form.projectTitle.trim() || "Walls/Devine",
        description: `${timelineLabel} · ${budgetRangeLabel}`
      },
      {
        label: "Contact",
        value: contactValue,
        description: form.company.trim() || "Independent room or direct collaborator route"
      },
      {
        label: "Next move",
        value: "Booking-fit review",
        description: "The request stays attached to Volume 1 instead of flattening into a generic calendar flow."
      }
    ];
  }

  if (flow.id === "bong-treatment") {
    return [
      {
        label: "Request",
        value: "Private reading request",
        description: routeDetails.relationshipToProject.trim() || "Relationship details arrive in the routed note below."
      },
      {
        label: "Contact",
        value: contactValue,
        description: form.company.trim() || "Independent reader or collaborator route"
      },
      {
        label: "Project",
        value: form.projectTitle.trim() || "Bong Tour",
        description: "Access is reviewed manually before the protected gate opens."
      },
      {
        label: "Next move",
        value: "Reader review",
        description: "Approved readers later use this same email inside the private gate."
      }
    ];
  }

  if (flow.id === "bong-partnership") {
    return [
      {
        label: "Focus",
        value: getOptionLabel(partnershipFocusOptions, routeDetails.partnershipFocus) || "Bong Tour fit conversation",
        description: `${timelineLabel} · ${budgetRangeLabel}`
      },
      {
        label: "Contact",
        value: contactValue,
        description: form.company.trim() || "Independent partner route"
      },
      {
        label: "Project",
        value: form.projectTitle.trim() || "Bong Tour",
        description: "Production, soundtrack, and collector-world context stay attached to the film."
      },
      {
        label: "Next move",
        value: "CGU partnership routing",
        description: "The fit is reviewed before any scheduling layer appears."
      }
    ];
  }

  return [
    {
      label: "Inquiry type",
      value: displayInquiryLabel,
      description: [getOptionLabel(goalOptions, form.goal), getOptionLabel(surfaceOptions, form.surface), getOptionLabel(engagementOptions, form.engagement)]
        .filter(Boolean)
        .join(" · ") || "Goal, surface, and engagement stay flexible."
    },
    {
      label: "Project",
      value: form.projectTitle.trim() || "New project or studio ask",
      description: `${timelineLabel} · ${budgetRangeLabel}`
    },
    {
      label: "Contact",
      value: contactValue,
      description: form.company.trim() || "No company context added yet"
    },
    {
      label: "Next move",
      value: "CGU review and routing",
      description: "The routed note stays inside the studio signal flow instead of a scheduling widget."
    }
  ];
}

function validateStep(flow: ContactFlow, stepId: GuidedStepId, form: ContactFormState, routeDetails: RouteDetailsState) {
  if (stepId === "intent" && (flow.id === "general" || flow.id === "walls-booking") && !form.inquiryType) {
    return "Choose the closest room before continuing.";
  }

  if (stepId === "project" && flow.id === "general" && !form.brief.trim()) {
    return "Leave a clear project note before continuing.";
  }

  if (stepId === "contact" && (!form.name.trim() || !form.email.trim())) {
    return "Name and email are required before continuing.";
  }

  if (stepId === "details") {
    if (flow.id === "walls-booking" && !form.brief.trim()) {
      return "Leave the clearest room note you can before continuing.";
    }

    if (flow.id === "bong-treatment" && !routeDetails.readerReason.trim()) {
      return "Tell us why this reader needs the private copy before continuing.";
    }

    if (flow.id === "bong-partnership") {
      if (!routeDetails.partnershipFocus) {
        return "Choose the closest Bong Tour lane before continuing.";
      }

      if (!form.brief.trim()) {
        return "Leave the clearest film-fit note you can before continuing.";
      }
    }
  }

  if (stepId === "review" && !buildSubmissionBrief(flow.id, form, routeDetails).trim()) {
    return "Add enough detail for CGU to route the request before sending it.";
  }

  return "";
}

export function ContactSection({ headingLevel = "h2", initialSearch = "", surface = "page" }: ContactSectionProps) {
  const initialPrefill = buildContactPrefill(initialSearch);
  const HeadingTag = headingLevel;
  const [prefill, setPrefill] = useState<ContactPrefill>(initialPrefill);
  const [form, setForm] = useState<ContactFormState>(() => buildInitialForm(initialPrefill));
  const [routeDetails, setRouteDetails] = useState<RouteDetailsState>(emptyRouteDetails);
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const lastTrackedStepKeyRef = useRef("");
  const activeFlow = buildContactFlow(prefill);
  const activeStep = activeFlow.steps[Math.min(currentStep, activeFlow.steps.length - 1)];
  const reviewItems = buildReviewItems(activeFlow, form, routeDetails);
  const submissionBrief = buildSubmissionBrief(activeFlow.id, form, routeDetails);

  useEffect(() => {
    const nextPrefill = buildContactPrefill(initialSearch);
    setPrefill(nextPrefill);
    setForm(buildInitialForm(nextPrefill));
    setRouteDetails(emptyRouteDetails);
    setCurrentStep(0);
    setSubmissionState("idle");
    setFeedbackMessage("");
    lastTrackedStepKeyRef.current = "";

    void trackAnalyticsEvent("contact_guided_context_detected", {
      contextId: nextPrefill.contextId || "default",
      projectTitle: nextPrefill.projectTitle || "none",
      inquiryType: nextPrefill.inquiryType || "none"
    });
  }, [initialSearch]);

  useEffect(() => {
    const trackingKey = `${activeFlow.id}:${activeStep.id}:${currentStep}`;

    if (lastTrackedStepKeyRef.current === trackingKey) {
      return;
    }

    lastTrackedStepKeyRef.current = trackingKey;

    void trackAnalyticsEvent("contact_guided_step_started", {
      contextId: prefill.contextId || "default",
      projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
      inquiryType: form.inquiryType || prefill.inquiryType || "none",
      stepId: activeStep.id,
      stepIndex: currentStep + 1
    });
  }, [activeFlow.id, activeStep.id, currentStep, form.inquiryType, form.projectTitle, prefill.contextId, prefill.inquiryType, prefill.projectTitle]);

  function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    if (name === "inquiryType" && value && value !== form.inquiryType) {
      void trackAnalyticsEvent("contact_guided_inquiry_type_selected", {
        contextId: prefill.contextId || "default",
        projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
        inquiryType: value
      });
    }

    setSubmissionState("idle");
    setFeedbackMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleRouteDetailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setSubmissionState("idle");
    setFeedbackMessage("");
    setRouteDetails((current) => ({ ...current, [name]: value }));
  }

  function handleToggleUpdatePreference(value: string) {
    setSubmissionState("idle");
    setFeedbackMessage("");
    setRouteDetails((current) => ({
      ...current,
      updatePreferences: current.updatePreferences.includes(value)
        ? current.updatePreferences.filter((entry) => entry !== value)
        : [...current.updatePreferences, value]
    }));
  }

  function trackStepCompleted(stepId: GuidedStepId) {
    void trackAnalyticsEvent("contact_guided_step_completed", {
      contextId: prefill.contextId || "default",
      projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
      inquiryType: form.inquiryType || prefill.inquiryType || "none",
      stepId,
      stepIndex: currentStep + 1
    });
  }

  function handleBack() {
    setSubmissionState("idle");
    setFeedbackMessage("");
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function handleContinue() {
    const validationMessage = validateStep(activeFlow, activeStep.id, form, routeDetails);

    if (validationMessage) {
      setSubmissionState("error");
      setFeedbackMessage(validationMessage);
      return;
    }

    trackStepCompleted(activeStep.id);
    setSubmissionState("idle");
    setFeedbackMessage("");
    setCurrentStep((step) => Math.min(step + 1, activeFlow.steps.length - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateStep(activeFlow, activeStep.id, form, routeDetails);

    if (validationMessage) {
      setSubmissionState("error");
      setFeedbackMessage(validationMessage);
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
        brief: submissionBrief,
        source: prefill.contextId ? `contact:${prefill.contextId}` : "contact-page",
        interest: [form.projectTitle.trim(), buildInterestLabel(activeFlow.id, inquiryTypeLabel)].filter(Boolean).join(" · "),
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

      void trackAnalyticsEvent("contact_guided_submit_success", {
        contextId: prefill.contextId || "default",
        projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
        inquiryType: form.inquiryType || prefill.inquiryType || "none",
        stepId: activeStep.id
      });

      setForm(buildInitialForm(prefill));
      setRouteDetails(emptyRouteDetails);
      setCurrentStep(0);
      setSubmissionState("success");
      setFeedbackMessage("Intake received. It is now sitting inside the CGU signal flow for review and routing.");
    } catch (error) {
      void trackAnalyticsEvent("contact_guided_submit_error", {
        contextId: prefill.contextId || "default",
        projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
        inquiryType: form.inquiryType || prefill.inquiryType || "none",
        stepId: activeStep.id,
        errorMessage: error instanceof Error ? error.message : "unknown_error"
      });

      setSubmissionState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Could not send the intake right now.");
    }
  }

  function renderStepBody() {
    if (activeStep.id === "intent") {
      if (activeFlow.id === "general" || activeFlow.id === "walls-booking") {
        return (
          <>
            <fieldset className="cg-contact__fieldset">
              <legend className="cg-contact__legend">Choose the room</legend>
              <p className="cg-contact__field-hint">Pick the lane that best fits the first move. You can still clarify the exact shape in the next step.</p>
              <GuidedIntakeChoiceGrid
                options={inquiryTypeCardOptions}
                value={form.inquiryType}
                onSelect={(value) => {
                  if (value !== form.inquiryType) {
                    void trackAnalyticsEvent("contact_guided_inquiry_type_selected", {
                      contextId: prefill.contextId || "default",
                      projectTitle: form.projectTitle.trim() || prefill.projectTitle || "none",
                      inquiryType: value
                    });
                  }

                  setSubmissionState("idle");
                  setFeedbackMessage("");
                  setForm((current) => ({ ...current, inquiryType: value }));
                }}
              />
            </fieldset>

            {activeFlow.id === "walls-booking" ? (
              <div className="cg-contact__affirmation">
                <strong>Walls/Devine booking route</strong>
                <p>Use the option above if the room leans more toward listening, screening, or partnership than a standard live booking.</p>
              </div>
            ) : null}
          </>
        );
      }

      if (activeFlow.id === "walls-mailing") {
        return (
          <div className="cg-contact__affirmation-grid">
            <article className="cg-contact__affirmation">
              <strong>Signal route confirmed</strong>
              <p>This request stays attached to Walls/Devine instead of getting flattened into a generic signup field.</p>
            </article>
            <article className="cg-contact__affirmation">
              <strong>What happens next</strong>
              <p>CGU reviews this route first, then uses the submitted inbox for future signal updates tied to Volume 1.</p>
            </article>
          </div>
        );
      }

      if (activeFlow.id === "bong-treatment") {
        return (
          <div className="cg-contact__affirmation-grid">
            <article className="cg-contact__affirmation">
              <strong>Protected reading path</strong>
              <p>The treatment stays behind the existing private gate until this reader request is reviewed and approved.</p>
            </article>
            <article className="cg-contact__affirmation">
              <strong>Identity matters</strong>
              <p>The email you submit here is the same identity that later enters the private gate if the reader is approved.</p>
            </article>
          </div>
        );
      }

      return (
        <div className="cg-contact__affirmation-grid">
          <article className="cg-contact__affirmation">
            <strong>Film-fit lane confirmed</strong>
            <p>This path is for production, soundtrack, collector-world, or broader partnership conversations around Bong Tour.</p>
          </article>
          <article className="cg-contact__affirmation">
            <strong>No scheduling layer first</strong>
            <p>CGU captures the fit and note before deciding whether any later operational handoff is needed.</p>
          </article>
        </div>
      );
    }

    if (activeStep.id === "project") {
      return (
        <>
          <GuidedIntakeFieldRow>
            <GuidedIntakeField label="Project or release" htmlFor="contact-project-title">
              <input
                id="contact-project-title"
                name="projectTitle"
                type="text"
                placeholder="Walls/Devine, Bong Tour, or project name"
                value={form.projectTitle}
                onChange={handleFieldChange}
              />
            </GuidedIntakeField>

            <GuidedIntakeField label="Goal" htmlFor="contact-goal">
              <select id="contact-goal" name="goal" value={form.goal} onChange={handleFieldChange}>
                <option value="">Choose the lead move</option>
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>

          <GuidedIntakeFieldRow>
            <GuidedIntakeField label="Surface" htmlFor="contact-surface">
              <select id="contact-surface" name="surface" value={form.surface} onChange={handleFieldChange}>
                <option value="">Choose the primary surface</option>
                {surfaceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Engagement" htmlFor="contact-engagement">
              <select id="contact-engagement" name="engagement" value={form.engagement} onChange={handleFieldChange}>
                <option value="">Choose the lead mode</option>
                {engagementOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>

          <GuidedIntakeFieldRow>
            <GuidedIntakeField label="Timeline" htmlFor="contact-timeline">
              <select id="contact-timeline" name="timeline" value={form.timeline} onChange={handleFieldChange}>
                <option value="">Choose timing</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Budget range" htmlFor="contact-budget-range">
              <select id="contact-budget-range" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                <option value="">Choose a range</option>
                {budgetRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>

          <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-brief" fullWidth>
            <textarea
              id="contact-brief"
              name="brief"
              rows={7}
              placeholder={activeFlow.notePlaceholder}
              value={form.brief}
              onChange={handleFieldChange}
              required
            />
          </GuidedIntakeField>
        </>
      );
    }

    if (activeStep.id === "contact") {
      return (
        <>
          <GuidedIntakeFieldRow>
            <GuidedIntakeField label="Name" htmlFor="contact-name">
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
            </GuidedIntakeField>

            <GuidedIntakeField label="Email" htmlFor="contact-email">
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
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>

          <GuidedIntakeFieldRow>
            <GuidedIntakeField label={activeFlow.companyLabel} htmlFor="contact-company">
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder={activeFlow.companyPlaceholder}
                value={form.company}
                onChange={handleFieldChange}
              />
            </GuidedIntakeField>

            <GuidedIntakeField label="Project or release" htmlFor="contact-contact-project-title">
              <input
                id="contact-contact-project-title"
                name="projectTitle"
                type="text"
                placeholder="Project, release, or film title"
                value={form.projectTitle}
                onChange={handleFieldChange}
              />
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>
        </>
      );
    }

    if (activeStep.id === "details") {
      if (activeFlow.id === "walls-mailing") {
        return (
          <>
            <fieldset className="cg-contact__fieldset">
              <legend className="cg-contact__legend">Choose the updates that matter</legend>
              <p className="cg-contact__field-hint">Pick one or many. If you skip these, CGU treats this as a general request for Walls/Devine signal updates.</p>
              <GuidedIntakeChoiceGrid
                options={mailingPreferenceOptions}
                values={routeDetails.updatePreferences}
                onSelect={handleToggleUpdatePreference}
              />
            </fieldset>

            <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-mailing-note" fullWidth>
              <textarea
                id="contact-mailing-note"
                name="brief"
                rows={6}
                placeholder={activeFlow.notePlaceholder}
                value={form.brief}
                onChange={handleFieldChange}
              />
            </GuidedIntakeField>
          </>
        );
      }

      if (activeFlow.id === "walls-booking") {
        return (
          <>
            <GuidedIntakeFieldRow>
              <GuidedIntakeField label="City or location" htmlFor="contact-booking-location">
                <input
                  id="contact-booking-location"
                  name="bookingLocation"
                  type="text"
                  placeholder="City, venue, or working location"
                  value={routeDetails.bookingLocation}
                  onChange={handleRouteDetailChange}
                />
              </GuidedIntakeField>

              <GuidedIntakeField label="Timeline" htmlFor="contact-booking-timeline">
                <select id="contact-booking-timeline" name="timeline" value={form.timeline} onChange={handleFieldChange}>
                  <option value="">Choose timing</option>
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </GuidedIntakeField>
            </GuidedIntakeFieldRow>

            <GuidedIntakeFieldRow>
              <GuidedIntakeField label="Budget range" htmlFor="contact-booking-budget">
                <select id="contact-booking-budget" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                  <option value="">Choose a range</option>
                  {budgetRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </GuidedIntakeField>

              <GuidedIntakeField label="Project or release" htmlFor="contact-booking-project-title">
                <input
                  id="contact-booking-project-title"
                  name="projectTitle"
                  type="text"
                  placeholder="Walls/Devine or event title"
                  value={form.projectTitle}
                  onChange={handleFieldChange}
                />
              </GuidedIntakeField>
            </GuidedIntakeFieldRow>

            <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-booking-note" fullWidth>
              <textarea
                id="contact-booking-note"
                name="brief"
                rows={7}
                placeholder={activeFlow.notePlaceholder}
                value={form.brief}
                onChange={handleFieldChange}
                required
              />
            </GuidedIntakeField>
          </>
        );
      }

      if (activeFlow.id === "bong-treatment") {
        return (
          <>
            <GuidedIntakeFieldRow>
              <GuidedIntakeField label="Relationship to the project" htmlFor="contact-treatment-relationship">
                <input
                  id="contact-treatment-relationship"
                  name="relationshipToProject"
                  type="text"
                  placeholder="Producer, actor, partner, reader, press, or another direct link"
                  value={routeDetails.relationshipToProject}
                  onChange={handleRouteDetailChange}
                />
              </GuidedIntakeField>

              <GuidedIntakeField label="Project or release" htmlFor="contact-treatment-project-title">
                <input
                  id="contact-treatment-project-title"
                  name="projectTitle"
                  type="text"
                  placeholder="Bong Tour"
                  value={form.projectTitle}
                  onChange={handleFieldChange}
                />
              </GuidedIntakeField>
            </GuidedIntakeFieldRow>

            <GuidedIntakeField label="Why this reader needs the private copy" htmlFor="contact-treatment-reason" fullWidth>
              <textarea
                id="contact-treatment-reason"
                name="readerReason"
                rows={6}
                placeholder="Why this reader is being introduced and what the next conversation should unlock."
                value={routeDetails.readerReason}
                onChange={handleRouteDetailChange}
                required
              />
            </GuidedIntakeField>

            <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-treatment-note" fullWidth>
              <textarea
                id="contact-treatment-note"
                name="brief"
                rows={5}
                placeholder={activeFlow.notePlaceholder}
                value={form.brief}
                onChange={handleFieldChange}
              />
            </GuidedIntakeField>
          </>
        );
      }

      return (
        <>
          <fieldset className="cg-contact__fieldset">
            <legend className="cg-contact__legend">Choose the closest Bong Tour lane</legend>
            <p className="cg-contact__field-hint">Pick the focus that best fits the first conversation. The full note can still span production, soundtrack, and collector-world context.</p>
            <GuidedIntakeChoiceGrid
              options={partnershipFocusOptions}
              value={routeDetails.partnershipFocus}
              onSelect={(value) => {
                setSubmissionState("idle");
                setFeedbackMessage("");
                setRouteDetails((current) => ({ ...current, partnershipFocus: value }));
              }}
            />
          </fieldset>

          <GuidedIntakeFieldRow>
            <GuidedIntakeField label="Timeline" htmlFor="contact-bong-timeline">
              <select id="contact-bong-timeline" name="timeline" value={form.timeline} onChange={handleFieldChange}>
                <option value="">Choose timing</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Budget range" htmlFor="contact-bong-budget">
              <select id="contact-bong-budget" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                <option value="">Choose a range</option>
                {budgetRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>
          </GuidedIntakeFieldRow>

          <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-bong-note" fullWidth>
            <textarea
              id="contact-bong-note"
              name="brief"
              rows={7}
              placeholder={activeFlow.notePlaceholder}
              value={form.brief}
              onChange={handleFieldChange}
              required
            />
          </GuidedIntakeField>
        </>
      );
    }

    return (
      <>
        <div className="cg-contact__review-grid" aria-label="Guided intake review summary">
          {reviewItems.map((item) => (
            <article key={item.label} className="cg-contact__review-card">
              <span className="cg-contact__review-label">{item.label}</span>
              <strong className="cg-contact__review-value">{item.value}</strong>
              <p className="cg-contact__review-description">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="cg-contact__field cg-contact__field--full">
          <label htmlFor="contact-routed-note">Routed note preview</label>
          <div id="contact-routed-note" className="cg-contact__brief-preview">
            {submissionBrief || "Add more detail in the previous steps to generate the routed note preview."}
          </div>
        </div>
      </>
    );
  }

  const formContent = (
    <form className="cg-contact__form" onSubmit={handleSubmit} noValidate aria-busy={submissionState === "submitting"}>
      <HeadingTag id="contact-title" className="cg-contact__sr-only">
        Guided intake
      </HeadingTag>

      <div className="cg-contact__form-head">
        <GuidedIntakeProgress
          steps={activeFlow.steps.map((step) => ({ key: step.id, label: step.label, title: step.title }))}
          currentStep={currentStep}
        />

        <GuidedIntakeStepHeader
          currentStep={currentStep}
          totalSteps={activeFlow.steps.length}
          title={activeStep.title}
          description={activeStep.description}
          trustNote={activeFlow.trustNote}
          helper={activeStep.helper}
        />
      </div>

      <div className="cg-contact__step-panel">{renderStepBody()}</div>

      {feedbackMessage ? (
        <GuidedIntakeStatusMessage
          tone={submissionState === "success" ? "success" : "error"}
          role={submissionState === "error" ? "alert" : "status"}
          message={feedbackMessage}
        />
      ) : null}

      <GuidedIntakeFooter
        secondaryAction={currentStep > 0 ? (
          <Button type="button" variant="ghost" className="cg-contact__nav-button" onClick={handleBack}>
            Back
          </Button>
        ) : null}
        primaryAction={currentStep < activeFlow.steps.length - 1 ? (
          <Button type="button" className="cg-contact__submit" onClick={handleContinue}>
            Continue
          </Button>
        ) : (
          <Button type="submit" className="cg-contact__submit" disabled={submissionState === "submitting"}>
            {submissionState === "submitting" ? "Sending intake..." : "Send intake"}
          </Button>
        )}
        privacyText="Your intelligence stays inside the core studio signal flow."
      />

      <p className="cg-contact__direct-link">
        Prefer email? <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a>
      </p>
    </form>
  );

  if (surface === "modal") {
    return (
      <div className="cg-contact cg-contact--modal">{formContent}</div>
    );
  }

  return (
    <SectionShell id="contact" labelledBy="contact-title" innerClassName="cg-contact__shell">
      <div className="cg-contact cg-contact--solo">{formContent}</div>
    </SectionShell>
  );
}
