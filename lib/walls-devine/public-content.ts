import type {
  WallsDevineBookingBannerNote,
  WallsDevineCollectorHeroNote,
  WallsDevineUpcomingShow,
  WallsDevineUpcomingShowsNote
} from "@/lib/admin/types";

const legacyWallsDevineCollectorBody =
  "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine";
const legacyWallsDevineMailingListHelper =
  "Stay close to Walls/Devine for drop alerts, collector unlocks, and new chapter openings.";

export const defaultWallsDevineCollectorHeroNote: WallsDevineCollectorHeroNote = {
  eyebrow: "Collector preview",
  title: "Walls/Devine Volume 1",
  salutation: "Dear Collector,",
  body: "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us as Volume 1 opens on September 1 and the next rooms line up through the fall.\n\nWith gratitude,\nTerry Devine",
  primaryCtaLabel: "Open Listening Room",
  secondaryCtaLabel: "Shop Volume 1 Merch",
  mailingListHelper: "Stay close to Walls/Devine for collector unlocks, merch drops, and the September 1 opening.",
  signatureIntro: "With Love From the Room,",
  journalLabel: "From the journals",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

export const defaultWallsDevineBookingBannerNote: WallsDevineBookingBannerNote = {
  eyebrow: "Live booking",
  title: "Bring Walls/Devine into the room.",
  description: "Use this lane for listening sessions, screenings, release-week bookings, and partnership conversations around the September 1 Volume 1 opening.",
  primaryCtaLabel: "Book Walls/Devine",
  secondaryCtaLabel: "Shop Volume 1 Merch",
  meta: "Live Music · Events ·",
  updatedAt: "2026-05-22T00:00:00.000Z"
};

export const defaultWallsDevineUpcomingShowsNote: WallsDevineUpcomingShowsNote = {
  eyebrow: "Upcoming shows",
  title: "Where Walls/Devine lands next",
  description: "Confirmed appearances, listening sessions, and event rooms update here as soon as dates lock.",
  emptyState: "No public dates are posted right now. Check back soon.",
  shows: [],
  updatedAt: "2026-06-25T00:00:00.000Z"
};

function normalizeUpcomingShowEntry(entry: Partial<WallsDevineUpcomingShow> | null | undefined, index: number): WallsDevineUpcomingShow | null {
  const dateLabel = typeof entry?.dateLabel === "string" ? entry.dateLabel.trim() : "";
  const city = typeof entry?.city === "string" ? entry.city.trim() : "";
  const venue = typeof entry?.venue === "string" ? entry.venue.trim() : "";

  if (!dateLabel || !city || !venue) {
    return null;
  }

  const status = typeof entry?.status === "string" && entry.status.trim() ? entry.status.trim() : "TBA";
  const href = typeof entry?.href === "string" ? entry.href.trim() : "";
  const normalizedId = typeof entry?.id === "string" && entry.id.trim() ? entry.id.trim() : `show-${index + 1}`;

  return {
    id: normalizedId,
    dateLabel,
    city,
    venue,
    status,
    href
  } satisfies WallsDevineUpcomingShow;
}

export function normalizeWallsDevineCollectorHeroNote(note?: Partial<WallsDevineCollectorHeroNote> | null): WallsDevineCollectorHeroNote {
  const nextBody = typeof note?.body === "string" && note.body.trim() ? note.body.trim() : "";
  const nextMailingListHelper = typeof note?.mailingListHelper === "string" && note.mailingListHelper.trim() ? note.mailingListHelper.trim() : "";

  return {
    eyebrow: typeof note?.eyebrow === "string" && note.eyebrow.trim() ? note.eyebrow.trim() : defaultWallsDevineCollectorHeroNote.eyebrow,
    title: typeof note?.title === "string" && note.title.trim() ? note.title.trim() : defaultWallsDevineCollectorHeroNote.title,
    salutation: typeof note?.salutation === "string" && note.salutation.trim() ? note.salutation.trim() : defaultWallsDevineCollectorHeroNote.salutation,
    body:
      nextBody && nextBody !== legacyWallsDevineCollectorBody
        ? nextBody
        : defaultWallsDevineCollectorHeroNote.body,
    primaryCtaLabel: typeof note?.primaryCtaLabel === "string" && note.primaryCtaLabel.trim() ? note.primaryCtaLabel.trim() : defaultWallsDevineCollectorHeroNote.primaryCtaLabel,
    secondaryCtaLabel: typeof note?.secondaryCtaLabel === "string" && note.secondaryCtaLabel.trim() ? note.secondaryCtaLabel.trim() : defaultWallsDevineCollectorHeroNote.secondaryCtaLabel,
    mailingListHelper:
      nextMailingListHelper && nextMailingListHelper !== legacyWallsDevineMailingListHelper
        ? nextMailingListHelper
        : defaultWallsDevineCollectorHeroNote.mailingListHelper,
    signatureIntro: typeof note?.signatureIntro === "string" && note.signatureIntro.trim() ? note.signatureIntro.trim() : defaultWallsDevineCollectorHeroNote.signatureIntro,
    journalLabel: typeof note?.journalLabel === "string" && note.journalLabel.trim() ? note.journalLabel.trim() : defaultWallsDevineCollectorHeroNote.journalLabel,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineCollectorHeroNote;
}

export function normalizeWallsDevineBookingBannerNote(note?: Partial<WallsDevineBookingBannerNote> | null): WallsDevineBookingBannerNote {
  return {
    eyebrow: typeof note?.eyebrow === "string" && note.eyebrow.trim() ? note.eyebrow.trim() : defaultWallsDevineBookingBannerNote.eyebrow,
    title: typeof note?.title === "string" && note.title.trim() ? note.title.trim() : defaultWallsDevineBookingBannerNote.title,
    description: typeof note?.description === "string" && note.description.trim() ? note.description.trim() : defaultWallsDevineBookingBannerNote.description,
    primaryCtaLabel: typeof note?.primaryCtaLabel === "string" && note.primaryCtaLabel.trim() ? note.primaryCtaLabel.trim() : defaultWallsDevineBookingBannerNote.primaryCtaLabel,
    secondaryCtaLabel: typeof note?.secondaryCtaLabel === "string" && note.secondaryCtaLabel.trim() ? note.secondaryCtaLabel.trim() : defaultWallsDevineBookingBannerNote.secondaryCtaLabel,
    meta: typeof note?.meta === "string" && note.meta.trim() ? note.meta.trim() : defaultWallsDevineBookingBannerNote.meta,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineBookingBannerNote;
}

export function normalizeWallsDevineUpcomingShowsNote(note?: Partial<WallsDevineUpcomingShowsNote> | null): WallsDevineUpcomingShowsNote {
  const shows = Array.isArray(note?.shows)
    ? note.shows
        .map((show, index) => normalizeUpcomingShowEntry(show as Partial<WallsDevineUpcomingShow>, index))
        .filter((show): show is WallsDevineUpcomingShow => show !== null)
    : defaultWallsDevineUpcomingShowsNote.shows;

  return {
    eyebrow: typeof note?.eyebrow === "string" && note.eyebrow.trim() ? note.eyebrow.trim() : defaultWallsDevineUpcomingShowsNote.eyebrow,
    title: typeof note?.title === "string" && note.title.trim() ? note.title.trim() : defaultWallsDevineUpcomingShowsNote.title,
    description: typeof note?.description === "string" && note.description.trim() ? note.description.trim() : defaultWallsDevineUpcomingShowsNote.description,
    emptyState: typeof note?.emptyState === "string" && note.emptyState.trim() ? note.emptyState.trim() : defaultWallsDevineUpcomingShowsNote.emptyState,
    shows,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineUpcomingShowsNote;
}