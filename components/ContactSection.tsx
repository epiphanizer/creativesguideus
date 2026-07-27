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
import {
  albumLaunchCampaignWindow,
  appreeshLaunchDateLabel,
  bongTourLaunchDateLabel,
  isBeforeWallsDevineLaunchCutoff,
  launchSequenceDateRangeLabel,
  wallsDevineLaunchDateLabel
} from "@/lib/launch-state";
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

type ContactFlowId = "general" | "walls-mailing" | "walls-booking" | "bong-treatment" | "bong-partnership" | "appreesh-preview";

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
    description: "Get release updates, drop alerts, and collector unlock notices."
  },
  {
    value: "screening",
    label: "Screening",
    description: "Frame a screening, visual companion, or event-world activation around the release."
  },
  {
    value: "performance",
    label: "Performance",
    description: "Ask about a live activation, performance, or event around the work."
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
    description: "Music direction, soundtrack expansion, or score collaboration."
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

  if (prefill.contextId === "appreesh-preview") {
    return "appreesh-preview";
  }

  return "general";
}

function buildContactFlow(prefill: ContactPrefill): ContactFlow {
  const flowId = getContactFlowId(prefill);

  if (flowId === "walls-mailing") {
    return {
      id: flowId,
      routingNote: "Walls/Devine updates request loaded for the Volume 1 rollout.",
      summary: [
        `Walls/Devine opens ${wallsDevineLaunchDateLabel} while Appreesh and Bong Tour follow later in the fall sequence.`,
        `Your email anchors future Volume 1 updates tied to the ${wallsDevineLaunchDateLabel} release world.`,
        "Each request is reviewed and routed by the studio team."
      ],
      trustNote: "This is a reviewed updates request. The studio follows up with the right Volume 1 notes for this inbox.",
      noteLabel: "Optional note",
      notePlaceholder: "How did you find Volume 1, and what kind of update should reach you first?",
      companyLabel: "Company or context",
      companyPlaceholder: "Label, publication, collaborator, or listener context",
      steps: [
        {
          id: "intent",
          label: "Confirm request",
          title: "Request Volume 1 updates",
          description: `This route keeps you close to the Volume 1 rollout and the ${wallsDevineLaunchDateLabel} opening.`,
          helper: "The request stays attached to Walls/Devine so follow-up can stay specific."
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
          title: "What updates do you want?",
          description: "Pick the signal types you actually want, then add any note that helps the studio route this cleanly.",
          helper: `If you skip this step, we treat it as a general request for Walls/Devine and ${wallsDevineLaunchDateLabel} rollout updates.`
        },
        {
          id: "review",
          label: "Review",
          title: "Review the routed request",
          description: "Confirm the contact lane, then send it into the studio signal flow.",
          helper: "The team reviews each request before future updates are sent."
        }
      ]
    };
  }

  if (flowId === "walls-booking") {
    return {
      id: flowId,
      routingNote:
        "Walls/Devine booking context is loaded. Leave the room type, timing, and booking note here so it stays attached to the Volume 1 rollout.",
      summary: [
        `The booking lane stays attached to the ${wallsDevineLaunchDateLabel} release world instead of dropping into a generic calendar flow.`,
        "Inquiry type, timing, and room note remain visible to booking-fit review in admin.",
        "Direct contact details stay inside CGU rather than being handed off to a third-party scheduler."
      ],
      trustNote:
        `This route is for listening sessions, screenings, live bookings, and partnership-adjacent room asks around the ${wallsDevineLaunchDateLabel} Walls/Devine opening.`,
      noteLabel: "Room note",
      notePlaceholder: "Room size, event type, desired date, collaborators, press angle, or the exact booking context.",
      companyLabel: "Company or context",
      companyPlaceholder: "Venue, organizer, promoter, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm intent",
          title: "What kind of booking is this?",
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
        `Use this route to request Bong Tour treatment access ahead of the ${bongTourLaunchDateLabel} opening.`,
      summary: [
        `The private treatment opens on ${bongTourLaunchDateLabel}.`,
        "Use the email you want us to contact when access is available.",
        "Tell us why the screenplay matters to you so we can follow up in the right way."
      ],
      trustNote:
        `This request does not unlock the treatment immediately. We review it first and follow up as access opens around ${bongTourLaunchDateLabel}.`,
      noteLabel: "Additional context",
      notePlaceholder: "Any extra context around the reader, the relationship, or the conversation this should unlock.",
      companyLabel: "Role or company",
      companyPlaceholder: "Producer, reader, company, publication, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm request",
          title: "Request post-launch treatment access",
          description: `This route is for readers who want access when the treatment opens on ${bongTourLaunchDateLabel}.`,
          helper: "Leave the clearest request you can and we will follow up from there."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the reader identity",
          description: "Use the best email for the reader or the person requesting access.",
          helper: "Role or company context helps us respond with the right next step."
        },
        {
          id: "details",
          label: "Reader details",
          title: "Describe the reader fit",
          description: "Leave the relationship to the project and why this reader needs the private copy.",
          helper: "A concise reason is enough. Help us understand the fit."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the reader request",
          description: "Confirm the reader identity and access note before sending it into the review lane.",
          helper: `We will reply here as treatment access opens around ${bongTourLaunchDateLabel}.`
        }
      ]
    };
  }

  if (flowId === "bong-partnership") {
    return {
      id: flowId,
      routingNote:
        `Bong Tour preview context is loaded. Leave the clearest production, soundtrack, or partnership note here so the ${bongTourLaunchDateLabel} launch path can route cleanly.`,
      summary: [
        `Production, soundtrack, collector-world, and partnership interest can start here before ${bongTourLaunchDateLabel}.`,
        "The intake leads with fit and context instead of a scheduling-first experience.",
        "We can reply with the clearest next step once we understand the fit."
      ],
      trustNote:
        "This is the film-fit lane for production, soundtrack, and partnership conversations around Bong Tour.",
      noteLabel: "Partnership note",
      notePlaceholder: "What you see, the fit you want to explore, and the clearest next move around Bong Tour.",
      companyLabel: "Role or company",
      companyPlaceholder: "Studio, producer, music partner, financier, or collaborator",
      steps: [
        {
          id: "intent",
          label: "Confirm intent",
          title: "Open the Bong Tour launch lane",
          description: "This route is for production, soundtrack, collector-world, or broader partnership conversations around Bong Tour.",
          helper: "Tell us what you want to explore and we will route it from there."
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
          description: "Select the lane that fits best, add timing if you have it, and leave the clearest note you can.",
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

  if (flowId === "appreesh-preview") {
    return {
      id: flowId,
      routingNote:
        `Appreesh opens ${appreeshLaunchDateLabel}. Leave your info here if you want the first notice.`,
      summary: [
        `Appreesh opens on ${appreeshLaunchDateLabel}.`,
        "We will use this inbox for first access notes and launch updates.",
        "Add context if you want to tell us why Appreesh matters to you."
      ],
      trustNote:
        "This is the easiest way to hear first when Appreesh opens.",
      noteLabel: "Optional note",
      notePlaceholder: "If helpful, say how Appreesh connects to your interest in Walls/Devine, Bong Tour, or the wider release world.",
      companyLabel: "Company or context",
      companyPlaceholder: "Collector, collaborator, press, partner, or working context",
      steps: [
        {
          id: "intent",
          label: "Confirm request",
          title: "Queue the Appreesh preview lane",
          description: `This route signs you up for Appreesh news ahead of the ${appreeshLaunchDateLabel} opening.`,
          helper: "You are in the right place if you want early notice when Appreesh arrives."
        },
        {
          id: "contact",
          label: "Contact details",
          title: "Anchor the inbox",
          description: "Use the best email for launch notes and first access updates.",
          helper: "Add working context if this interest is tied to a collaborator, publication, or partner lane."
        },
        {
          id: "details",
          label: "Context note",
          title: "Add any useful context",
          description: "Leave an optional note if there is a specific Appreesh angle, bridge, or follow-up that matters.",
          helper: "Use this note if there is a specific angle or follow-up you want us to remember."
        },
        {
          id: "review",
          label: "Review",
          title: "Review the preview route",
          description: "Confirm the inbox and note before sending this Appreesh preview request into CGU.",
          helper: `We will follow up here as Appreesh opens on ${appreeshLaunchDateLabel}.`
        }
      ]
    };
  }

  return {
    id: "general",
    routingNote:
      "Use this form for bookings, collaborations, soundtrack work, and systems builds.",
    summary: [
      "Inquiry type, timing, and range help us respond clearly.",
      "Project context and a real note help us start in the right place.",
      "Direct contact details keep the conversation personal from the first reply."
    ],
    trustNote: "",
    noteLabel: "Project note",
    notePlaceholder: "Scope, desired move, collaborators, links, or the exact conversation you want to have.",
    companyLabel: "Company or context",
    companyPlaceholder: "Studio, company, or context",
    steps: [
      {
        id: "intent",
        label: "Select the lane",
        title: "What are you looking for?",
        description: "Pick the lane that best matches your project.",
        helper: "Select the lane that fits the work."
      },
      {
        id: "project",
        label: "Scope and timing",
        title: "Outline scope and timing",
        description: "",
        helper: ""
      },
      {
        id: "contact",
        label: "Contact details",
        title: "Add your contact details",
        description: "Share the best contact path for this project.",
        helper: "Include your studio or company context when relevant."
      },
      {
        id: "review",
        label: "Send the brief",
        title: "Send the brief",
        description: "Review the details, then send.",
        helper: ""
      }
    ]
  };
}

function buildDisplayInquiryLabel(flowId: ContactFlowId, inquiryType: string) {
  if (flowId === "bong-treatment") {
    return "Post-launch treatment access";
  }

  if (flowId === "appreesh-preview") {
    return "Appreesh preview route";
  }

  return getOptionLabel(inquiryTypeOptions, inquiryType) || "Studio contact";
}

function buildInterestLabel(flowId: ContactFlowId, inquiryTypeLabel: string) {
  if (flowId === "bong-treatment") {
    return "Post-launch treatment access";
  }

  if (flowId === "appreesh-preview") {
    return "Appreesh preview";
  }

  return inquiryTypeLabel || "Studio contact";
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
      "Request: Walls/Devine Volume 1 updates.",
      `Requested updates: ${selectedPreferences.length ? selectedPreferences.join(", ") : "General Volume 1 signal updates"}.`,
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
      "Request: Bong Tour post-launch treatment access.",
      routeDetails.relationshipToProject.trim() ? `Relationship to project: ${routeDetails.relationshipToProject.trim()}.` : "",
      routeDetails.readerReason.trim() ? `Reader note: ${routeDetails.readerReason.trim()}` : "",
      trimmedBrief ? `Additional context: ${trimmedBrief}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (flowId === "appreesh-preview") {
    return [
      "Request: Appreesh preview notice.",
      trimmedBrief ? `Note: ${trimmedBrief}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    "Request: Bong Tour partnership or launch conversation.",
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
        value: "Volume 1 updates request",
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
        description: `Walls/Devine opens ${wallsDevineLaunchDateLabel} as the first chapter in the ${launchSequenceDateRangeLabel} sequence.`
      },
      {
        label: "Next move",
        value: "Manual signal review",
        description: "CGU reviews this request before future Volume 1 updates go to this inbox."
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
        value: "Post-launch treatment access",
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
        description: `Treatment access requests are reviewed ahead of the ${bongTourLaunchDateLabel} opening.`
      },
      {
        label: "Next move",
        value: "Reader review",
        description: `We will follow up here as treatment access opens around ${bongTourLaunchDateLabel}.`
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
        description: "Production, soundtrack, and collector-world context stay attached to the film while the public route stays in preview."
      },
      {
        label: "Next move",
        value: "CGU launch routing",
        description: "The fit is reviewed before any scheduling layer or private page handoff appears."
      }
    ];
  }

  if (flow.id === "appreesh-preview") {
    return [
      {
        label: "Request",
        value: "Appreesh preview notice",
        description: `Held inside CGU until the ${appreeshLaunchDateLabel} opening.`
      },
      {
        label: "Contact",
        value: contactValue,
        description: form.company.trim() || "Direct collector or collaborator route"
      },
      {
        label: "Project",
        value: form.projectTitle.trim() || "Appreesh",
        description: "No external Appreesh handoff before launch."
      },
      {
        label: "Next move",
        value: "Internal preview routing",
        description: "Launch-window flags stay with this lead for later follow-up."
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
    return "What are you looking for? Select a lane to continue.";
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
        return "What kind of Bong Tour conversation is this? Select a lane to continue.";
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
      const joinedBeforeWallsDevineLaunch = prefill.campaignWindow === albumLaunchCampaignWindow && isBeforeWallsDevineLaunchCutoff();
      const wantsWallsDevineUpdates = activeFlow.id === "walls-mailing";
      const wantsBongTourLaunchNotice = activeFlow.id === "bong-treatment" || activeFlow.id === "bong-partnership";
      const wantsAppreeshLaunchNotice = activeFlow.id === "appreesh-preview";
      const airdropCandidate = joinedBeforeWallsDevineLaunch && (wantsWallsDevineUpdates || wantsAppreeshLaunchNotice);

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
        budgetRangeLabel,
        sourceRoute: prefill.sourceRoute,
        campaignWindow: prefill.campaignWindow,
        wantsWallsDevineUpdates,
        wantsBongTourLaunchNotice,
        wantsAppreeshLaunchNotice,
        joinedBeforeJune30: joinedBeforeWallsDevineLaunch,
        airdropCandidate
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
              <legend className="cg-contact__legend">What are you looking for?</legend>
              <p className="cg-contact__field-hint">Select the lane that best matches your request.</p>
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
              <p>This request stays attached to the Walls/Devine rollout instead of getting flattened into a generic signup field.</p>
            </article>
            <article className="cg-contact__affirmation">
              <strong>What happens next</strong>
              <p>{`CGU reviews this route first, then uses the submitted inbox for future Volume 1 and ${wallsDevineLaunchDateLabel} rollout updates.`}</p>
            </article>
          </div>
        );
      }

      if (activeFlow.id === "bong-treatment") {
        return (
          <div className="cg-contact__affirmation-grid">
            <article className="cg-contact__affirmation">
              <strong>Treatment request received</strong>
              <p>{`The Bong Tour treatment opens ${bongTourLaunchDateLabel}. We will review this request and follow up as access becomes available.`}</p>
            </article>
            <article className="cg-contact__affirmation">
              <strong>Watch this inbox</strong>
              <p>{`We will use the email you submitted here for the next step if treatment access opens after ${bongTourLaunchDateLabel}.`}</p>
            </article>
          </div>
        );
      }

      if (activeFlow.id === "appreesh-preview") {
        return (
          <div className="cg-contact__affirmation-grid">
            <article className="cg-contact__affirmation">
              <strong>You’re on the list</strong>
              <p>{`Appreesh opens ${appreeshLaunchDateLabel}. We will use this inbox for the first notice.`}</p>
            </article>
            <article className="cg-contact__affirmation">
              <strong>What happens next</strong>
              <p>We will follow up here with launch updates and first-access details.</p>
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
                <option value="">What is the goal?</option>
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
                <option value="">What is the surface?</option>
                {surfaceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Engagement" htmlFor="contact-engagement">
              <select id="contact-engagement" name="engagement" value={form.engagement} onChange={handleFieldChange}>
                <option value="">What is the engagement?</option>
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
                <option value="">When do you need this?</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Budget range" htmlFor="contact-budget-range">
              <select id="contact-budget-range" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                <option value="">What is the budget range?</option>
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
              <legend className="cg-contact__legend">What updates do you want?</legend>
              <p className="cg-contact__field-hint">Pick one or many. If you skip these, CGU treats this as a general request for Volume 1 signal updates.</p>
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
                  <option value="">When do you need this?</option>
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
                  <option value="">What is the budget range?</option>
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

      if (activeFlow.id === "appreesh-preview") {
        return (
          <GuidedIntakeField label={activeFlow.noteLabel} htmlFor="contact-appreesh-note" fullWidth>
            <textarea
              id="contact-appreesh-note"
              name="brief"
              rows={7}
              placeholder={activeFlow.notePlaceholder}
              value={form.brief}
              onChange={handleFieldChange}
            />
          </GuidedIntakeField>
        );
      }

      return (
        <>
          <fieldset className="cg-contact__fieldset">
            <legend className="cg-contact__legend">What kind of Bong Tour conversation is this?</legend>
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
                <option value="">When do you need this?</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </GuidedIntakeField>

            <GuidedIntakeField label="Budget range" htmlFor="contact-bong-budget">
              <select id="contact-bong-budget" name="budgetRange" value={form.budgetRange} onChange={handleFieldChange}>
                <option value="">What is the budget range?</option>
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
        Studio Contact
      </HeadingTag>

      <div className="cg-contact__form-head">
        <GuidedIntakeProgress
          steps={activeFlow.steps.map((step) => ({ key: step.id, label: step.label, title: step.title }))}
          currentStep={currentStep}
        />

        <GuidedIntakeStepHeader
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
