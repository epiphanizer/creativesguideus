import { doc, getDoc, setDoc } from "firebase/firestore";

import type { WallsDevineCollectorHeroNote } from "@/lib/admin/types";
import { firebaseDb } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import { normalizeWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";

function getCollectorHeroNoteDoc() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(
    firebaseDb,
    firebaseAdminPaths.adminProjectsCollection,
    firebaseAdminPaths.wallsDevineProjectId,
    firebaseAdminPaths.publicContentCollection,
    firebaseAdminPaths.collectorHeroNoteDocId
  );
}

export async function getWallsDevineCollectorHeroNote() {
  try {
    const snapshot = await getDoc(getCollectorHeroNoteDoc());
    return normalizeWallsDevineCollectorHeroNote(snapshot.exists() ? (snapshot.data() as Partial<WallsDevineCollectorHeroNote>) : null);
  } catch {
    return normalizeWallsDevineCollectorHeroNote();
  }
}

export async function updateWallsDevineCollectorHeroNote(note: Partial<WallsDevineCollectorHeroNote>) {
  const normalizedNote = normalizeWallsDevineCollectorHeroNote({
    ...note,
    updatedAt: new Date().toISOString()
  });

  await setDoc(getCollectorHeroNoteDoc(), normalizedNote, { merge: true });
  return normalizedNote;
}