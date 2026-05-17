import { doc, getDoc } from "firebase/firestore";

import type { LinkHubContent } from "@/lib/admin/types";
import { defaultLinkHubContent, normalizeLinkHubContent } from "@/lib/link-hub/content";

import { firebaseDb } from "./client";
import { firebaseAdminPaths } from "./config";

function getLinkHubDoc() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(
    firebaseDb,
    firebaseAdminPaths.adminProjectsCollection,
    firebaseAdminPaths.wallsDevineProjectId,
    firebaseAdminPaths.publicContentCollection,
    firebaseAdminPaths.linkHubDocId
  );
}

export async function getLinkHubContent() {
  try {
    const snapshot = await getDoc(getLinkHubDoc());
    return normalizeLinkHubContent(snapshot.exists() ? (snapshot.data() as Partial<LinkHubContent>) : null);
  } catch {
    return defaultLinkHubContent;
  }
}