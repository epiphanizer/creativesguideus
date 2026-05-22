import type { WallsDevineBookingBannerNote, WallsDevineCollectorHeroNote } from "@/lib/admin/types";

export const defaultWallsDevineCollectorHeroNote: WallsDevineCollectorHeroNote = {
  eyebrow: "Collector experience",
  title: "Walls/Devine Volume 1",
  salutation: "Dear Collector,",
  body: "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine",
  primaryCtaLabel: "Open Listening Room",
  secondaryCtaLabel: "Shop Volume 1 Merch",
  mailingListHelper:
    "Ask to receive Walls/Devine drop alerts, listening-room updates, and collector unlock notices. Until the dedicated list is live, this request routes through CGU intake.",
  signatureIntro: "With Love From the Room,",
  journalLabel: "From the journals",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

export const defaultWallsDevineBookingBannerNote: WallsDevineBookingBannerNote = {
  eyebrow: "Live booking",
  title: "Bring Walls/Devine into the room.",
  description: "Use this lane for listening sessions, screenings, live bookings, and partnership conversations around Volume 1.",
  primaryCtaLabel: "Book Walls/Devine",
  secondaryCtaLabel: "Shop Volume 1 Merch",
  meta: "Listening sessions · Screenings · Partnerships",
  updatedAt: "2026-05-22T00:00:00.000Z"
};

export function normalizeWallsDevineCollectorHeroNote(note?: Partial<WallsDevineCollectorHeroNote> | null): WallsDevineCollectorHeroNote {
  return {
    eyebrow: typeof note?.eyebrow === "string" && note.eyebrow.trim() ? note.eyebrow.trim() : defaultWallsDevineCollectorHeroNote.eyebrow,
    title: typeof note?.title === "string" && note.title.trim() ? note.title.trim() : defaultWallsDevineCollectorHeroNote.title,
    salutation: typeof note?.salutation === "string" && note.salutation.trim() ? note.salutation.trim() : defaultWallsDevineCollectorHeroNote.salutation,
    body: typeof note?.body === "string" && note.body.trim() ? note.body.trim() : defaultWallsDevineCollectorHeroNote.body,
    primaryCtaLabel: typeof note?.primaryCtaLabel === "string" && note.primaryCtaLabel.trim() ? note.primaryCtaLabel.trim() : defaultWallsDevineCollectorHeroNote.primaryCtaLabel,
    secondaryCtaLabel: typeof note?.secondaryCtaLabel === "string" && note.secondaryCtaLabel.trim() ? note.secondaryCtaLabel.trim() : defaultWallsDevineCollectorHeroNote.secondaryCtaLabel,
    mailingListHelper:
      typeof note?.mailingListHelper === "string" && note.mailingListHelper.trim()
        ? note.mailingListHelper.trim()
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