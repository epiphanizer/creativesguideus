import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import type { ListeningRoomVisit, ListeningRoomVisitInput } from "@/lib/admin/types";

import { firebaseDb } from "./client";
import { firebaseAdminPaths } from "./config";

function getListeningRoomVisitsCollection() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return collection(firebaseDb, firebaseAdminPaths.listeningRoomVisitsCollection);
}

function normalizeVisitMeta(value: string | undefined, maxLength: number) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function mapVisitDocument(id: string, data: Partial<Omit<ListeningRoomVisit, "id">>) {
  return {
    id,
    eventType: data.eventType === "listening-room-link-visit" ? data.eventType : "listening-room-link-visit",
    songSlug: typeof data.songSlug === "string" ? data.songSlug : "",
    songTitle: typeof data.songTitle === "string" ? data.songTitle : "",
    queryKey: typeof data.queryKey === "string" ? data.queryKey : "",
    pagePath: typeof data.pagePath === "string" ? data.pagePath : "",
    referrer: typeof data.referrer === "string" ? data.referrer : "",
    userAgent: typeof data.userAgent === "string" ? data.userAgent : "",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : ""
  } satisfies ListeningRoomVisit;
}

export async function createListeningRoomVisit(input: ListeningRoomVisitInput) {
  const songSlug = normalizeVisitMeta(input.songSlug, 80);
  const songTitle = normalizeVisitMeta(input.songTitle, 120);
  const queryKey = normalizeVisitMeta(input.queryKey, 24);
  const pagePath = normalizeVisitMeta(input.pagePath, 240);
  const referrer = normalizeVisitMeta(input.referrer, 320);
  const userAgent = normalizeVisitMeta(input.userAgent, 320);

  if (!songSlug || !songTitle || !queryKey || !pagePath) {
    throw new Error("Listening room visit metadata is incomplete.");
  }

  const payload = {
    eventType: "listening-room-link-visit",
    songSlug,
    songTitle,
    queryKey,
    pagePath,
    referrer,
    userAgent,
    createdAt: new Date().toISOString()
  } satisfies Omit<ListeningRoomVisit, "id">;

  const docRef = await addDoc(getListeningRoomVisitsCollection(), payload);

  return mapVisitDocument(docRef.id, payload);
}

export async function getListeningRoomVisits(limitCount = 24) {
  const visitsQuery = query(getListeningRoomVisitsCollection(), orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(visitsQuery);

  return snapshot.docs.map((docSnapshot) => mapVisitDocument(docSnapshot.id, docSnapshot.data() as Partial<Omit<ListeningRoomVisit, "id">>));
}