import type { WallsDevineCollectorHeroNote } from "@/lib/admin/types";

export const defaultWallsDevineCollectorHeroNote: WallsDevineCollectorHeroNote = {
  salutation: "Dear Collector,",
  body: "Join the private collector email for first-listen links, studio-journal fragments, artifact drop notes, and release-night signals as each room opens across Volume 1.",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

export function normalizeWallsDevineCollectorHeroNote(note?: Partial<WallsDevineCollectorHeroNote> | null): WallsDevineCollectorHeroNote {
  return {
    salutation: typeof note?.salutation === "string" && note.salutation.trim() ? note.salutation.trim() : defaultWallsDevineCollectorHeroNote.salutation,
    body: typeof note?.body === "string" && note.body.trim() ? note.body.trim() : defaultWallsDevineCollectorHeroNote.body,
    updatedAt: typeof note?.updatedAt === "string" && note.updatedAt.trim() ? note.updatedAt : new Date().toISOString()
  } satisfies WallsDevineCollectorHeroNote;
}