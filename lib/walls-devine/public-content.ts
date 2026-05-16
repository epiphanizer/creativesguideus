import type { WallsDevineCollectorHeroNote } from "@/lib/admin/types";

export const defaultWallsDevineCollectorHeroNote: WallsDevineCollectorHeroNote = {
  salutation: "Dear Collector,",
  body: "From my journal to your headphones: thank you for meeting us inside this record. If these songs find you where you are, step into the rooms, listen all the way through, and stay with us for the story behind each chapter.\n\nWith gratitude,\nTerry Devine",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

export function normalizeWallsDevineCollectorHeroNote(note?: Partial<WallsDevineCollectorHeroNote> | null): WallsDevineCollectorHeroNote {
  return {
    salutation: typeof note?.salutation === "string" && note.salutation.trim() ? note.salutation.trim() : defaultWallsDevineCollectorHeroNote.salutation,
    body: typeof note?.body === "string" && note.body.trim() ? note.body.trim() : defaultWallsDevineCollectorHeroNote.body,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineCollectorHeroNote;
}