import type { WallsDevineBookingBannerNote, WallsDevineCollectorHeroNote } from "@/lib/admin/types";

export const defaultWallsDevineCollectorHeroNote: WallsDevineCollectorHeroNote = {
  salutation: "Dear Collector,",
  body: "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

export const defaultWallsDevineBookingBannerNote: WallsDevineBookingBannerNote = {
  eyebrow: "Live Booking + Merch",
  title: "Book or shop Walls/Devine",
  description: "Bring Volume 1 into the room for listening sessions, screenings, live bookings, partnership conversations, or direct shop traffic for the merch drop.",
  meta: "Listening events · Performance · Partnerships · Fourthwall merch shop",
  updatedAt: "2026-05-22T00:00:00.000Z"
};

export function normalizeWallsDevineCollectorHeroNote(note?: Partial<WallsDevineCollectorHeroNote> | null): WallsDevineCollectorHeroNote {
  return {
    salutation: typeof note?.salutation === "string" && note.salutation.trim() ? note.salutation.trim() : defaultWallsDevineCollectorHeroNote.salutation,
    body: typeof note?.body === "string" && note.body.trim() ? note.body.trim() : defaultWallsDevineCollectorHeroNote.body,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineCollectorHeroNote;
}

export function normalizeWallsDevineBookingBannerNote(note?: Partial<WallsDevineBookingBannerNote> | null): WallsDevineBookingBannerNote {
  return {
    eyebrow: typeof note?.eyebrow === "string" && note.eyebrow.trim() ? note.eyebrow.trim() : defaultWallsDevineBookingBannerNote.eyebrow,
    title: typeof note?.title === "string" && note.title.trim() ? note.title.trim() : defaultWallsDevineBookingBannerNote.title,
    description: typeof note?.description === "string" && note.description.trim() ? note.description.trim() : defaultWallsDevineBookingBannerNote.description,
    meta: typeof note?.meta === "string" && note.meta.trim() ? note.meta.trim() : defaultWallsDevineBookingBannerNote.meta,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineBookingBannerNote;
}