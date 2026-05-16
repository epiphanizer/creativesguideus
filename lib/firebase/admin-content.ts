import { doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getBytes, listAll, ref, uploadString } from "firebase/storage";

import type { AdminMarkdownCollection, AdminMarkdownFile, ReleasePlan, WallsDevineAdminData } from "@/lib/admin/types";

import { firebaseDb, firebaseStorage } from "./client";
import { firebaseAdminPaths } from "./config";

export type AdminUserProfile = {
  active?: boolean;
  email?: string;
  displayName?: string;
  roles?: string[];
};

function getProjectDoc() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(firebaseDb, firebaseAdminPaths.adminProjectsCollection, firebaseAdminPaths.wallsDevineProjectId);
}

function getAdminUserDoc(uid: string) {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(firebaseDb, firebaseAdminPaths.adminUsersCollection, uid);
}

function getStoragePath(collection: AdminMarkdownCollection, slug?: string) {
  const suffix = slug ? `${slug}.md` : "";
  const trailing = suffix ? `/${suffix}` : "";

  return `${firebaseAdminPaths.storageBasePath}/${collection}${trailing}`;
}

function getMarkdownTitle(content: string, fallback: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function getMarkdownPreview(content: string) {
  const sections = content
    .split("\n\n")
    .map((section) => section.trim())
    .filter(Boolean)
    .filter((section) => !section.startsWith("#") && !section.startsWith("##"));

  return sections[0] ?? "";
}

function normalizeMarkdown(content: string) {
  return content.trimEnd() ? `${content.trimEnd()}\n` : "";
}

function createMarkdownFileRecord(collection: AdminMarkdownCollection, slug: string, content: string) {
  return {
    slug,
    title: getMarkdownTitle(content, `${slug}.md`),
    filePath: getStoragePath(collection, slug),
    content,
    preview: getMarkdownPreview(content)
  } satisfies AdminMarkdownFile;
}

async function readMarkdownCollection(collection: AdminMarkdownCollection) {
  if (!firebaseStorage) {
    throw new Error("Firebase Storage is not initialized for this Firebase project.");
  }

  const collectionRef = ref(firebaseStorage, getStoragePath(collection));
  const result = await listAll(collectionRef);
  const decoder = new TextDecoder();
  const sortedItems = [...result.items].sort((left, right) => left.name.localeCompare(right.name));

  return Promise.all(
    sortedItems.map(async (item) => {
      const slug = item.name.replace(/\.md$/, "");
      const content = decoder.decode(await getBytes(item));

      return {
        slug,
        title: getMarkdownTitle(content, item.name),
        filePath: getStoragePath(collection, slug),
        content,
        preview: getMarkdownPreview(content)
      } satisfies AdminMarkdownFile;
    })
  );
}

async function saveReleasePlan(plan: ReleasePlan) {
  const nextPlan = {
    ...plan,
    updatedAt: plan.updatedAt || new Date().toISOString()
  } satisfies ReleasePlan;

  await setDoc(
    getProjectDoc(),
    {
      projectId: firebaseAdminPaths.wallsDevineProjectId,
      updatedAt: nextPlan.updatedAt,
      [firebaseAdminPaths.releasePlanField]: nextPlan
    },
    { merge: true }
  );

  return nextPlan;
}

async function getReleasePlanFromFirestore() {
  const projectSnapshot = await getDoc(getProjectDoc());
  return projectSnapshot.data()?.[firebaseAdminPaths.releasePlanField] as ReleasePlan | undefined;
}

function updateMarkdownCollection(
  files: AdminMarkdownFile[],
  nextFile: AdminMarkdownFile
) {
  const nextFiles = files.some((file) => file.slug === nextFile.slug)
    ? files.map((file) => (file.slug === nextFile.slug ? nextFile : file))
    : [...files, nextFile];

  return nextFiles.sort((left, right) => left.slug.localeCompare(right.slug));
}

function removeMarkdownCollectionFile(files: AdminMarkdownFile[], slug: string) {
  return files.filter((file) => file.slug !== slug);
}

export function isActiveAdminProfile(profile: AdminUserProfile | null) {
  return Boolean(profile && profile.active !== false);
}

export async function getAdminUserProfile(uid: string) {
  const snapshot = await getDoc(getAdminUserDoc(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as AdminUserProfile;
}

export async function getFirebaseWallsDevineAdminData(): Promise<WallsDevineAdminData | null> {
  const releasePlan = await getReleasePlanFromFirestore();

  if (!releasePlan) {
    return null;
  }

  try {
    const [instagramDrafts, journalEntries] = await Promise.all([
      readMarkdownCollection("instagram-posts"),
      readMarkdownCollection("journals")
    ]);

    return {
      plan: releasePlan,
      instagramDrafts,
      journalEntries,
      storageBacked: true
    } satisfies WallsDevineAdminData;
  } catch {
    return {
      plan: releasePlan,
      instagramDrafts: [],
      journalEntries: [],
      storageBacked: false
    } satisfies WallsDevineAdminData;
  }
}

export async function updateFirebaseReleasePlanItem(itemId: string, completed: boolean) {
  const releasePlan = await getReleasePlanFromFirestore();

  if (!releasePlan) {
    throw new Error("Firebase admin content is not initialized yet.");
  }

  const nextPlan = {
    ...releasePlan,
    updatedAt: new Date().toISOString(),
    checklist: releasePlan.checklist.map((item) => (item.id === itemId ? { ...item, completed } : item))
  } satisfies ReleasePlan;

  return saveReleasePlan(nextPlan);
}

export async function updateFirebaseAdminMarkdownFile(collection: AdminMarkdownCollection, slug: string, content: string) {
  if (!firebaseStorage) {
    throw new Error("Firebase Storage is not initialized for this Firebase project.");
  }

  const normalizedContent = normalizeMarkdown(content);
  const fileRef = ref(firebaseStorage, getStoragePath(collection, slug));

  await uploadString(fileRef, normalizedContent, "raw", {
    contentType: "text/markdown; charset=utf-8"
  });

  return createMarkdownFileRecord(collection, slug, normalizedContent);
}

export async function renameFirebaseAdminMarkdownFile(
  collection: AdminMarkdownCollection,
  currentSlug: string,
  nextSlug: string,
  content: string
) {
  const nextFile = await updateFirebaseAdminMarkdownFile(collection, nextSlug, content);

  if (currentSlug !== nextSlug) {
    await deleteFirebaseAdminMarkdownFile(collection, currentSlug);
  }

  return nextFile;
}

export async function deleteFirebaseAdminMarkdownFile(collection: AdminMarkdownCollection, slug: string) {
  if (!firebaseStorage) {
    throw new Error("Firebase Storage is not initialized for this Firebase project.");
  }

  await deleteObject(ref(firebaseStorage, getStoragePath(collection, slug)));
}

export async function seedFirebaseWallsDevineAdminData(seedData: WallsDevineAdminData): Promise<WallsDevineAdminData> {
  const nextPlan = await saveReleasePlan({
    ...seedData.plan,
    updatedAt: new Date().toISOString()
  });

  try {
    await Promise.all([
      ...seedData.instagramDrafts.map((file) => updateFirebaseAdminMarkdownFile("instagram-posts", file.slug, file.content)),
      ...seedData.journalEntries.map((file) => updateFirebaseAdminMarkdownFile("journals", file.slug, file.content))
    ]);

    const remoteData = await getFirebaseWallsDevineAdminData();

    if (remoteData) {
      return remoteData;
    }
  } catch {
    return {
      ...seedData,
      plan: nextPlan,
      storageBacked: false
    } satisfies WallsDevineAdminData;
  }

  return {
    ...seedData,
    plan: nextPlan,
    storageBacked: false
  } satisfies WallsDevineAdminData;
}

export function replaceAdminMarkdownFile(
  data: WallsDevineAdminData,
  collection: AdminMarkdownCollection,
  nextFile: AdminMarkdownFile
) {
  if (collection === "instagram-posts") {
    return {
      ...data,
      instagramDrafts: updateMarkdownCollection(data.instagramDrafts, nextFile)
    } satisfies WallsDevineAdminData;
  }

  return {
    ...data,
    journalEntries: updateMarkdownCollection(data.journalEntries, nextFile)
  } satisfies WallsDevineAdminData;
}

export function removeAdminMarkdownFile(data: WallsDevineAdminData, collection: AdminMarkdownCollection, slug: string) {
  if (collection === "instagram-posts") {
    return {
      ...data,
      instagramDrafts: removeMarkdownCollectionFile(data.instagramDrafts, slug)
    } satisfies WallsDevineAdminData;
  }

  return {
    ...data,
    journalEntries: removeMarkdownCollectionFile(data.journalEntries, slug)
  } satisfies WallsDevineAdminData;
}