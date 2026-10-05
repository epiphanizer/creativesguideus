import { collection, doc, getDocs, limit, orderBy, query, setDoc, deleteDoc } from "firebase/firestore";
import { firebaseDb } from "./client";

export interface PublishedTrack {
  id: string;
  title: string;
  artist: string;
  description?: string;
  audioUrl: string;
  fileName: string;
  fileSizeBytes: number;
  bpm: number;
  durationSeconds: number;
  barLength: number;
  keySignature?: string;
  dawSource: string;
  alsProject?: string;
  visualizerPreset: string;
  visualizerConfig?: Record<string, unknown>;
  tags: string[];
  publishedAt: string;
}

const COLLECTION_NAME = "johnwallsTakes";

function getTakesCollection() {
  if (!firebaseDb) {
    return null;
  }
  return collection(firebaseDb, COLLECTION_NAME);
}

export async function getFirestorePublishedTakes(limitCount = 50): Promise<PublishedTrack[]> {
  const takesCol = getTakesCollection();
  if (!takesCol) {
    return [];
  }

  try {
    const q = query(takesCol, orderBy("publishedAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<PublishedTrack, "id">)
    }));
  } catch (err) {
    console.error("Failed to query Firestore johnwallsTakes:", err);
    return [];
  }
}

export async function saveFirestorePublishedTake(track: PublishedTrack): Promise<boolean> {
  if (!firebaseDb) {
    return false;
  }

  try {
    const docRef = doc(firebaseDb, COLLECTION_NAME, track.id);
    const { id, ...data } = track;
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save take ${track.id} to Firestore:`, err);
    return false;
  }
}

export async function deleteFirestorePublishedTake(trackId: string): Promise<boolean> {
  if (!firebaseDb) {
    return false;
  }

  try {
    const docRef = doc(firebaseDb, COLLECTION_NAME, trackId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Failed to delete take ${trackId} from Firestore:`, err);
    return false;
  }
}
