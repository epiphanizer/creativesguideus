import { doc, getDoc, setDoc } from "firebase/firestore";

import type {
  WallsDevineBookingBannerNote,
  WallsDevineCollectorHeroNote,
  WallsDevineUpcomingShowsNote
} from "@/lib/admin/types";
import { firebaseDb } from "@/lib/firebase/client";
import { firebaseAdminPaths } from "@/lib/firebase/config";
import {
  normalizeWallsDevineBookingBannerNote,
  normalizeWallsDevineCollectorHeroNote,
  normalizeWallsDevineUpcomingShowsNote
} from "@/lib/walls-devine/public-content";

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

function getBookingBannerNoteDoc() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(
    firebaseDb,
    firebaseAdminPaths.adminProjectsCollection,
    firebaseAdminPaths.wallsDevineProjectId,
    firebaseAdminPaths.publicContentCollection,
    firebaseAdminPaths.bookingBannerNoteDocId
  );
}

function getUpcomingShowsDoc() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(
    firebaseDb,
    firebaseAdminPaths.adminProjectsCollection,
    firebaseAdminPaths.wallsDevineProjectId,
    firebaseAdminPaths.publicContentCollection,
    firebaseAdminPaths.upcomingShowsDocId
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

export async function getWallsDevineBookingBannerNote() {
  try {
    const snapshot = await getDoc(getBookingBannerNoteDoc());
    return normalizeWallsDevineBookingBannerNote(snapshot.exists() ? (snapshot.data() as Partial<WallsDevineBookingBannerNote>) : null);
  } catch {
    return normalizeWallsDevineBookingBannerNote();
  }
}

export async function updateWallsDevineBookingBannerNote(note: Partial<WallsDevineBookingBannerNote>) {
  const normalizedNote = normalizeWallsDevineBookingBannerNote({
    ...note,
    updatedAt: new Date().toISOString()
  });

  await setDoc(getBookingBannerNoteDoc(), normalizedNote, { merge: true });
  return normalizedNote;
}

export async function getWallsDevineUpcomingShowsNote() {
  try {
    const snapshot = await getDoc(getUpcomingShowsDoc());
    return normalizeWallsDevineUpcomingShowsNote(snapshot.exists() ? (snapshot.data() as Partial<WallsDevineUpcomingShowsNote>) : null);
  } catch {
    return normalizeWallsDevineUpcomingShowsNote();
  }
}

export async function updateWallsDevineUpcomingShowsNote(note: Partial<WallsDevineUpcomingShowsNote>) {
  const normalizedNote = normalizeWallsDevineUpcomingShowsNote({
    ...note,
    updatedAt: new Date().toISOString()
  });

  await setDoc(getUpcomingShowsDoc(), normalizedNote, { merge: true });
  return normalizedNote;
}