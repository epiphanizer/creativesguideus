import type {
  BookingAvailabilityWindow,
  BookingBoard,
  BookingBoardGoal,
  BookingContactMethod,
  BookingContactResearchStatus,
  BookingProspect,
  BookingTarget,
  BookingTargetCategory,
  BookingTargetContact,
  BookingTargetPriority,
  BookingTargetStatus,
  EcosystemLead
} from "./types";

type PartialBookingGoal = Partial<BookingBoardGoal> | undefined;
type PartialBookingWindow = Partial<BookingAvailabilityWindow> | undefined;
type PartialBookingTargetContact = Partial<BookingTargetContact> | undefined;
type PartialBookingTarget = Partial<BookingTarget> | undefined;
type PartialBookingProspect = Partial<BookingProspect> | undefined;

export type BookingLeadMatch = {
  lead: EcosystemLead;
  target: BookingTarget | null;
  window: BookingAvailabilityWindow | null;
  score: number;
  reasons: string[];
  bookingIntent: boolean;
};

const bookingStatusLabels: Record<BookingTargetStatus, string> = {
  seeded: "Seeded",
  researching: "Researching",
  "outreach-ready": "Outreach ready",
  contacted: "Contacted",
  "in-conversation": "In conversation",
  hold: "Hold",
  confirmed: "Confirmed"
};

const bookingPriorityLabels: Record<BookingTargetPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium"
};

const bookingCategoryLabels: Record<BookingTargetCategory, string> = {
  venue: "Venue",
  radio: "Radio",
  podcast: "Podcast",
  festival: "Festival",
  press: "Press"
};

const bookingContactMethodLabels: Record<BookingContactMethod, string> = {
  email: "Email",
  form: "Form",
  web: "Web",
  instagram: "Instagram",
  phone: "Phone"
};

const bookingContactStatusLabels: Record<BookingContactResearchStatus, string> = {
  verified: "Verified",
  partial: "Partial",
  pending: "Pending"
};

const bookingTargetStatusOrder: BookingTargetStatus[] = [
  "confirmed",
  "hold",
  "in-conversation",
  "contacted",
  "outreach-ready",
  "researching",
  "seeded"
];

export const defaultBookingBoard: BookingBoard = {
  updatedAt: "2026-05-18T00:00:00.000Z",
  goal: {
    title: "Book August through November by June 19",
    summary:
      "Treat July as the media warm-up, then close enough live and literary-adjacent dates to keep August through November active before June 19, with November now anchored around Boise the weekend before Thanksgiving.",
    lockByDate: "2026-06-19",
    bookThroughMonths: ["August 2026", "September 2026", "October 2026", "November 2026"],
    priorityMarkets: ["Salt Lake City / Wasatch Front", "Boston / Lowell", "Boise / Ogden route"],
    successMetric:
      "Have at least one strong booking, media placement, or live hold attached to each target month, with October anchored around Kerouac Weekend and November anchored around Boise the weekend before Thanksgiving.",
    nextMoves: [
      "Use July radio and podcast movement in Utah to strengthen the ask for August SLC rooms.",
      "Treat Kerouac Weekend, Lowell, and the Boston spillover as the October anchor rather than a side quest.",
      "Turn the weekend before Thanksgiving into a Boise anchor and use Ogden as the likely routing stop on the way in.",
      "Route every incoming live-booking or performance lead against the seeded target board within one day."
    ]
  },
  availability: [
    {
      id: "july-slc-media-run",
      label: "July media run",
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      market: "Salt Lake City / Wasatch Front",
      city: "Salt Lake City",
      state: "UT",
      purpose: "Radio, podcast, and culture-press movement ahead of live room asks.",
      bookingTypes: ["radio", "podcast", "press"],
      notes: "Use KRCL and adjacent artist-interview outlets to warm the market before August club holds."
    },
    {
      id: "august-wasatch-front",
      label: "August live anchor",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      market: "Salt Lake City / Wasatch Front",
      city: "Salt Lake City",
      state: "UT",
      purpose: "Land the first recognizable Utah room and convert July media into a real date.",
      bookingTypes: ["venue", "press"],
      notes: "Urban Lounge and Drift Lounge are the first named rooms to turn into concrete holds."
    },
    {
      id: "september-open-run",
      label: "September open run",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      market: "Mountain West or routing support",
      city: "Salt Lake City",
      state: "UT",
      purpose: "Keep the fall calendar active between the August Utah anchor and the October East Coast run.",
      bookingTypes: ["venue", "podcast", "press"],
      notes: "Use this slot for the best fit that emerges from inbound or adjacent routing."
    },
    {
      id: "october-kerouac-weekend",
      label: "Kerouac Weekend window",
      startDate: "2026-10-08",
      endDate: "2026-10-12",
      market: "Boston / Lowell",
      city: "Lowell",
      state: "MA",
      purpose: "Anchor October around Lowell and Boston during Kerouac Weekend.",
      bookingTypes: ["festival", "venue", "podcast", "press"],
      notes: "Prioritize Lowell first, then Boston spillover rooms, interviews, and literary-adjacent programming."
    },
    {
      id: "november-boise-route",
      label: "Boise pre-Thanksgiving run",
      startDate: "2026-11-19",
      endDate: "2026-11-22",
      market: "Boise with Ogden routing support",
      city: "Boise",
      state: "ID",
      purpose: "Anchor November with a Boise show the weekend before Thanksgiving and use Ogden as the most likely routing stop en route.",
      bookingTypes: ["venue", "radio", "podcast", "press"],
      notes: "Primary ask is Boise for the Nov 20-22 weekend block, with Ogden treated as the routing-support room on the way in or back."
    }
  ],
  targets: [
    {
      id: "urban-lounge-slc",
      name: "Urban Lounge",
      category: "venue",
      city: "Salt Lake City",
      state: "UT",
      status: "outreach-ready",
      priority: "critical",
      targetWindowId: "august-wasatch-front",
      desiredOutcome: "Lock an August SLC anchor date.",
      fitNote: "Named room already on deck and the clearest first club target in the Wasatch Front stack.",
      notes: "Pair the ask with July radio and podcast movement so it lands with fresh signal behind it.",
      sourceUrl: "",
      contactStatus: "pending",
      contacts: [
        {
          label: "Booking research",
          role: "Promoter / talent buyer",
          method: "web",
          value: "Public booking route still needs verification",
          sourceUrl: "",
          note: "Target is confirmed, but the live contact path still needs to be pinned down in research.",
          verifiedAt: ""
        }
      ],
      tags: ["salt-lake-city", "utah", "club-room", "august"]
    },
    {
      id: "drift-lounge-slc",
      name: "Drift Lounge",
      category: "venue",
      city: "Salt Lake City",
      state: "UT",
      status: "researching",
      priority: "high",
      targetWindowId: "august-wasatch-front",
      desiredOutcome: "Add a second SLC room or fallback hold around the same push.",
      fitNote: "Useful second named room in the same market so August does not hinge on one ask.",
      notes: "Treat as the parallel room target while Urban Lounge is being pressed.",
      sourceUrl: "",
      contactStatus: "pending",
      contacts: [
        {
          label: "Booking research",
          role: "Venue contact",
          method: "web",
          value: "Research public venue contact",
          sourceUrl: "",
          note: "Seeded as a real target from the current list; public contact still needs verification.",
          verifiedAt: ""
        }
      ],
      tags: ["salt-lake-city", "utah", "lounge", "august"]
    },
    {
      id: "krcl-radio",
      name: "KRCL",
      category: "radio",
      city: "Salt Lake City",
      state: "UT",
      status: "outreach-ready",
      priority: "critical",
      targetWindowId: "july-slc-media-run",
      desiredOutcome: "Book July radio coverage that helps unlock the August room asks.",
      fitNote: "KRCL is the clearest named media target and should be treated as the Utah signal amplifier.",
      notes: "Use July airplay or interview coverage as proof of movement for venue outreach.",
      sourceUrl: "https://krcl.org/about/contact-us/",
      contactStatus: "partial",
      contacts: [
        {
          label: "KRCL contact page",
          role: "Station contact",
          method: "web",
          value: "https://krcl.org/about/contact-us/",
          sourceUrl: "https://krcl.org/about/contact-us/",
          note: "Public station contact route for current outreach.",
          verifiedAt: "2026-05-18"
        }
      ],
      tags: ["salt-lake-city", "utah", "radio", "july"]
    },
    {
      id: "lowell-kerouac-weekend",
      name: "Lowell Celebrates Kerouac / Kerouac Weekend",
      category: "festival",
      city: "Lowell",
      state: "MA",
      status: "outreach-ready",
      priority: "critical",
      targetWindowId: "october-kerouac-weekend",
      desiredOutcome: "Anchor October 8-12 with Lowell programming and use Boston as spillover.",
      fitNote: "This is the clearest way to give the October East Coast run a specific reason to happen.",
      notes: "Prioritize Lowell first, then build Boston conversations off the same travel window.",
      sourceUrl: "https://lowellcelebrateskerouac.org/",
      contactStatus: "partial",
      contacts: [
        {
          label: "Festival site",
          role: "Programming contact research",
          method: "web",
          value: "https://lowellcelebrateskerouac.org/",
          sourceUrl: "https://lowellcelebrateskerouac.org/",
          note: "Festival site is the current public source; programming contact still needs direct confirmation.",
          verifiedAt: "2026-05-18"
        }
      ],
      tags: ["lowell", "boston", "massachusetts", "kerouac", "october"]
    },
    {
      id: "neurolux-boise",
      name: "Neurolux",
      category: "venue",
      city: "Boise",
      state: "ID",
      status: "outreach-ready",
      priority: "critical",
      targetWindowId: "november-boise-route",
      desiredOutcome: "Lock the Boise show on the weekend before Thanksgiving.",
      fitNote: "A real Boise room gives November a concrete destination instead of a generic fall placeholder.",
      notes: "Treat this as the primary Nov 20-22 Boise ask and build any Ogden stop around the same route.",
      sourceUrl: "",
      contactStatus: "pending",
      contacts: [
        {
          label: "Booking research",
          role: "Venue contact",
          method: "web",
          value: "Research public booking route for Neurolux",
          sourceUrl: "",
          note: "Named as the Boise anchor target; direct public contact still needs verification.",
          verifiedAt: ""
        }
      ],
      tags: ["boise", "idaho", "november", "pre-thanksgiving", "anchor-room"]
    },
    {
      id: "funk-n-dive-ogden",
      name: "Funk 'n Dive Bar",
      category: "venue",
      city: "Ogden",
      state: "UT",
      status: "researching",
      priority: "high",
      targetWindowId: "november-boise-route",
      desiredOutcome: "Add an Ogden routing stop that strengthens the Boise weekend run.",
      fitNote: "Ogden is the most likely route-support city if the Boise weekend locks and the drive needs a stop with signal behind it.",
      notes: "Treat this as the likely en-route stop rather than the primary November anchor.",
      sourceUrl: "",
      contactStatus: "pending",
      contacts: [
        {
          label: "Routing-stop research",
          role: "Venue contact",
          method: "web",
          value: "Research public booking route for Funk 'n Dive Bar",
          sourceUrl: "",
          note: "Seeded as the likely Ogden room if Boise comes together; direct contact still needs verification.",
          verifiedAt: ""
        }
      ],
      tags: ["ogden", "utah", "route-stop", "november", "boise-run"]
    }
  ],
  prospects: [
    {
      id: "slc-podcast-pull",
      label: "Salt Lake City podcast pull",
      market: "Salt Lake City / Wasatch Front",
      targetWindowId: "july-slc-media-run",
      types: ["podcast", "artist interview", "culture show"],
      rationale: "July media should feed August room outreach instead of living in a separate lane.",
      searchHints: ["Salt Lake City music podcast", "Utah arts podcast", "Salt Lake City artist interview"],
      notes: "Treat this as rolling research connected directly to KRCL and the August room asks.",
      sourceUrl: ""
    },
    {
      id: "boston-lowell-literary-rooms",
      label: "Boston / Lowell literary rooms",
      market: "Boston / Lowell",
      targetWindowId: "october-kerouac-weekend",
      types: ["venue", "listening room", "reading room"],
      rationale: "If Kerouac Weekend opens Lowell, literary-adjacent rooms in Lowell and Boston can deepen the same trip.",
      searchHints: ["Boston listening room booking", "Lowell live room", "Boston literary venue music booking"],
      notes: "Use this queue to widen the October window once the Lowell anchor is in motion.",
      sourceUrl: ""
    },
    {
      id: "boston-lowell-media-pull",
      label: "Boston / Lowell media pull",
      market: "Boston / Lowell",
      targetWindowId: "october-kerouac-weekend",
      types: ["radio", "podcast", "press"],
      rationale: "The East Coast window works better if interviews and press stack alongside live moments.",
      searchHints: ["Boston music podcast guest", "Lowell arts radio", "Boston culture interview"],
      notes: "Tie this media queue to the same Oct 8-12 travel block.",
      sourceUrl: ""
    },
    {
      id: "boise-media-pull",
      label: "Boise media pull",
      market: "Boise / Treasure Valley",
      targetWindowId: "november-boise-route",
      types: ["venue", "radio", "podcast"],
      rationale: "A Boise weekend works better if local media and interview support move alongside the venue ask.",
      searchHints: ["Boise music podcast", "Boise radio artist interview", "Boise live music venue booking"],
      notes: "Use this queue to add Boise radio, podcast, and press support around the Nov 20-22 anchor weekend.",
      sourceUrl: ""
    },
    {
      id: "ogden-route-pull",
      label: "Ogden route support pull",
      market: "Ogden / north Wasatch",
      targetWindowId: "november-boise-route",
      types: ["venue", "routing support", "press"],
      rationale: "If Boise locks, Ogden becomes the most plausible route-support city instead of an afterthought.",
      searchHints: ["Ogden live music booking", "Ogden venue contact", "Ogden artist interview"],
      notes: "Use this queue to widen the routing options around the Boise weekend instead of improvising at the last minute.",
      sourceUrl: ""
    }
  ]
};

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((entry) => normalizeString(entry))
        .filter(Boolean)
    : [];
}

function isBookingTargetStatus(value: unknown): value is BookingTargetStatus {
  return typeof value === "string" && value in bookingStatusLabels;
}

function isBookingTargetPriority(value: unknown): value is BookingTargetPriority {
  return typeof value === "string" && value in bookingPriorityLabels;
}

function isBookingTargetCategory(value: unknown): value is BookingTargetCategory {
  return typeof value === "string" && value in bookingCategoryLabels;
}

function isBookingContactMethod(value: unknown): value is BookingContactMethod {
  return typeof value === "string" && value in bookingContactMethodLabels;
}

function isBookingContactResearchStatus(value: unknown): value is BookingContactResearchStatus {
  return typeof value === "string" && value in bookingContactStatusLabels;
}

function normalizeGoal(value: PartialBookingGoal) {
  return {
    ...defaultBookingBoard.goal,
    title: normalizeString(value?.title, defaultBookingBoard.goal.title),
    summary: normalizeString(value?.summary, defaultBookingBoard.goal.summary),
    lockByDate: normalizeString(value?.lockByDate, defaultBookingBoard.goal.lockByDate),
    bookThroughMonths: normalizeStringArray(value?.bookThroughMonths).length
      ? normalizeStringArray(value?.bookThroughMonths)
      : defaultBookingBoard.goal.bookThroughMonths,
    priorityMarkets: normalizeStringArray(value?.priorityMarkets).length
      ? normalizeStringArray(value?.priorityMarkets)
      : defaultBookingBoard.goal.priorityMarkets,
    successMetric: normalizeString(value?.successMetric, defaultBookingBoard.goal.successMetric),
    nextMoves: normalizeStringArray(value?.nextMoves).length ? normalizeStringArray(value?.nextMoves) : defaultBookingBoard.goal.nextMoves
  } satisfies BookingBoardGoal;
}

function normalizeAvailabilityWindow(value: PartialBookingWindow, fallback: BookingAvailabilityWindow) {
  return {
    ...fallback,
    id: normalizeString(value?.id, fallback.id),
    label: normalizeString(value?.label, fallback.label),
    startDate: normalizeString(value?.startDate, fallback.startDate),
    endDate: normalizeString(value?.endDate, fallback.endDate),
    market: normalizeString(value?.market, fallback.market),
    city: normalizeString(value?.city, fallback.city),
    state: normalizeString(value?.state, fallback.state),
    purpose: normalizeString(value?.purpose, fallback.purpose),
    bookingTypes: normalizeStringArray(value?.bookingTypes).length ? normalizeStringArray(value?.bookingTypes) : fallback.bookingTypes,
    notes: normalizeString(value?.notes, fallback.notes)
  } satisfies BookingAvailabilityWindow;
}

function normalizeTargetContact(value: PartialBookingTargetContact, fallback: BookingTargetContact) {
  return {
    ...fallback,
    label: normalizeString(value?.label, fallback.label),
    role: normalizeString(value?.role, fallback.role),
    method: isBookingContactMethod(value?.method) ? value.method : fallback.method,
    value: normalizeString(value?.value, fallback.value),
    sourceUrl: normalizeString(value?.sourceUrl, fallback.sourceUrl),
    note: normalizeString(value?.note, fallback.note),
    verifiedAt: normalizeString(value?.verifiedAt, fallback.verifiedAt)
  } satisfies BookingTargetContact;
}

function normalizeTarget(value: PartialBookingTarget, fallback: BookingTarget) {
  const fallbackContacts = fallback.contacts.length ? fallback.contacts : defaultBookingBoard.targets[0].contacts;

  return {
    ...fallback,
    id: normalizeString(value?.id, fallback.id),
    name: normalizeString(value?.name, fallback.name),
    category: isBookingTargetCategory(value?.category) ? value.category : fallback.category,
    city: normalizeString(value?.city, fallback.city),
    state: normalizeString(value?.state, fallback.state),
    status: isBookingTargetStatus(value?.status) ? value.status : fallback.status,
    priority: isBookingTargetPriority(value?.priority) ? value.priority : fallback.priority,
    targetWindowId: normalizeString(value?.targetWindowId, fallback.targetWindowId),
    desiredOutcome: normalizeString(value?.desiredOutcome, fallback.desiredOutcome),
    fitNote: normalizeString(value?.fitNote, fallback.fitNote),
    notes: normalizeString(value?.notes, fallback.notes),
    sourceUrl: normalizeString(value?.sourceUrl, fallback.sourceUrl),
    contactStatus: isBookingContactResearchStatus(value?.contactStatus) ? value.contactStatus : fallback.contactStatus,
    contacts:
      Array.isArray(value?.contacts) && value.contacts.length
        ? value.contacts.map((contact, index) => normalizeTargetContact(contact, fallbackContacts[index] ?? fallbackContacts[0]))
        : fallback.contacts,
    tags: normalizeStringArray(value?.tags).length ? normalizeStringArray(value?.tags) : fallback.tags
  } satisfies BookingTarget;
}

function normalizeProspect(value: PartialBookingProspect, fallback: BookingProspect) {
  return {
    ...fallback,
    id: normalizeString(value?.id, fallback.id),
    label: normalizeString(value?.label, fallback.label),
    market: normalizeString(value?.market, fallback.market),
    targetWindowId: normalizeString(value?.targetWindowId, fallback.targetWindowId),
    types: normalizeStringArray(value?.types).length ? normalizeStringArray(value?.types) : fallback.types,
    rationale: normalizeString(value?.rationale, fallback.rationale),
    searchHints: normalizeStringArray(value?.searchHints).length ? normalizeStringArray(value?.searchHints) : fallback.searchHints,
    notes: normalizeString(value?.notes, fallback.notes),
    sourceUrl: normalizeString(value?.sourceUrl, fallback.sourceUrl)
  } satisfies BookingProspect;
}

export function normalizeBookingBoard(value: Partial<BookingBoard> | null | undefined) {
  const nextValue = value ?? {};

  return {
    updatedAt: normalizeString(nextValue.updatedAt, defaultBookingBoard.updatedAt),
    goal: normalizeGoal(nextValue.goal),
    availability:
      Array.isArray(nextValue.availability) && nextValue.availability.length
        ? nextValue.availability.map((window, index) => normalizeAvailabilityWindow(window, defaultBookingBoard.availability[index] ?? defaultBookingBoard.availability[0]))
        : defaultBookingBoard.availability,
    targets:
      Array.isArray(nextValue.targets) && nextValue.targets.length
        ? nextValue.targets.map((target, index) => normalizeTarget(target, defaultBookingBoard.targets[index] ?? defaultBookingBoard.targets[0]))
        : defaultBookingBoard.targets,
    prospects:
      Array.isArray(nextValue.prospects) && nextValue.prospects.length
        ? nextValue.prospects.map((prospect, index) => normalizeProspect(prospect, defaultBookingBoard.prospects[index] ?? defaultBookingBoard.prospects[0]))
        : defaultBookingBoard.prospects
  } satisfies BookingBoard;
}

function normalizeLeadText(lead: EcosystemLead) {
  return [
    lead.source,
    lead.interest,
    lead.company,
    lead.projectTitle,
    lead.brief,
    lead.contextId,
    lead.inquiryType,
    lead.inquiryTypeLabel,
    lead.goal,
    lead.goalLabel,
    lead.surface,
    lead.surfaceLabel,
    lead.engagement,
    lead.engagementLabel,
    lead.timeline,
    lead.timelineLabel,
    lead.budgetRange,
    lead.budgetRangeLabel
  ]
    .join(" ")
    .toLowerCase();
}

function getWindowById(board: BookingBoard, windowId: string) {
  return board.availability.find((window) => window.id === windowId) ?? null;
}

function buildIntentSignals(lead: EcosystemLead, leadText: string) {
  let score = 0;
  const reasons: string[] = [];

  if (lead.inquiryType === "live-booking" || lead.inquiryType === "performance") {
    score += 45;
    reasons.push("Inquiry type already points at live booking.");
  } else if (lead.inquiryType === "listening-session") {
    score += 30;
    reasons.push("Inquiry type points at a listening-room style conversation.");
  }

  if (lead.contextId.toLowerCase().includes("booking")) {
    score += 18;
    reasons.push("Context id is already booking-oriented.");
  }

  if (lead.source.toLowerCase().startsWith("contact:")) {
    score += 12;
    reasons.push("Lead came through guided intake rather than passive collector capture.");
  }

  if (/\b(book|booking|show|gig|tour|radio|podcast|interview|performance|listening)\b/.test(leadText)) {
    score += 12;
    reasons.push("Lead language points at booking or media.");
  }

  return {
    score,
    reasons,
    bookingIntent: score > 0
  };
}

function scoreLeadAgainstTarget(board: BookingBoard, lead: EcosystemLead, target: BookingTarget) {
  const leadText = normalizeLeadText(lead);
  const intent = buildIntentSignals(lead, leadText);
  const window = getWindowById(board, target.targetWindowId);
  let score = intent.score;
  const reasons = [...intent.reasons];

  const locationMatches = [target.city, target.state, ...target.tags].filter(Boolean).filter((token) => leadText.includes(token.toLowerCase()));
  if (locationMatches.length) {
    score += 24;
    reasons.push(`Lead language overlaps with ${locationMatches[0]}.`);
  }

  if (window && leadText.includes(window.label.toLowerCase())) {
    score += 10;
    reasons.push(`Lead lines up with the ${window.label.toLowerCase()} window.`);
  }

  if (window && leadText.includes(window.market.toLowerCase())) {
    score += 12;
    reasons.push(`Lead mentions the ${window.market} market.`);
  }

  if (target.category === "radio" && /\b(radio|airplay|station|interview)\b/.test(leadText)) {
    score += 12;
    reasons.push("Lead language fits radio outreach.");
  }

  if (target.category === "podcast" && /\b(podcast|guest|conversation|interview)\b/.test(leadText)) {
    score += 12;
    reasons.push("Lead language fits podcast outreach.");
  }

  if (target.category === "venue" && /\b(show|gig|room|performance|set|live)\b/.test(leadText)) {
    score += 12;
    reasons.push("Lead language fits a live-room ask.");
  }

  return {
    lead,
    target,
    window,
    score,
    reasons,
    bookingIntent: intent.bookingIntent
  } satisfies BookingLeadMatch;
}

export function buildBookingLeadMatches(board: BookingBoard, leads: EcosystemLead[]) {
  return leads
    .map((lead) => {
      const leadText = normalizeLeadText(lead);
      const intent = buildIntentSignals(lead, leadText);
      const scoredTargets = board.targets.map((target) => scoreLeadAgainstTarget(board, lead, target)).sort((left, right) => right.score - left.score);
      const bestMatch = scoredTargets[0];

      if (!bestMatch) {
        return {
          lead,
          target: null,
          window: null,
          score: intent.score,
          reasons: intent.reasons,
          bookingIntent: intent.bookingIntent
        } satisfies BookingLeadMatch;
      }

      return bestMatch;
    })
    .filter((match) => match.bookingIntent && match.score >= 20)
    .sort((left, right) => right.score - left.score || right.lead.createdAt.localeCompare(left.lead.createdAt));
}

export function countBookingTargetsByStatus(board: BookingBoard) {
  const counts = new Map<BookingTargetStatus, number>();

  for (const status of bookingTargetStatusOrder) {
    counts.set(status, 0);
  }

  for (const target of board.targets) {
    counts.set(target.status, (counts.get(target.status) ?? 0) + 1);
  }

  return bookingTargetStatusOrder
    .map((status) => [status, counts.get(status) ?? 0] as const)
    .filter(([, count]) => count > 0);
}

export function getBookingTargetsForWindow(board: BookingBoard, windowId: string) {
  return board.targets.filter((target) => target.targetWindowId === windowId);
}

export function formatBookingTargetStatus(status: BookingTargetStatus) {
  return bookingStatusLabels[status];
}

export function formatBookingPriority(priority: BookingTargetPriority) {
  return bookingPriorityLabels[priority];
}

export function formatBookingCategory(category: BookingTargetCategory) {
  return bookingCategoryLabels[category];
}

export function formatBookingContactMethod(method: BookingContactMethod) {
  return bookingContactMethodLabels[method];
}

export function formatBookingContactStatus(status: BookingContactResearchStatus) {
  return bookingContactStatusLabels[status];
}