import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { getBytes, listAll, ref } from "firebase/storage";

import { defaultBookingBoard, normalizeBookingBoard } from "@/lib/admin/booking-engine";
import type { AdminMarkdownCollection, AdminMarkdownFile, BookingBoard, LinkHubContent, ReleasePlan, WallsDevineAdminData, WallsDevineCollectorHeroNote } from "@/lib/admin/types";
import { defaultLinkHubContent, normalizeLinkHubContent } from "@/lib/link-hub/content";
import { defaultWallsDevineCollectorHeroNote, normalizeWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";

import { firebaseDb, firebaseStorage } from "./client";
import { firebaseAdminPaths } from "./config";

export type AdminUserProfile = {
  active?: boolean;
  email?: string;
  displayName?: string;
  roles?: string[];
};

type FirebaseMarkdownDoc = {
  collection: AdminMarkdownCollection;
  slug: string;
  title: string;
  content: string;
  preview: string;
  updatedAt: string;
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

function getMarkdownCollectionRef() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return collection(getProjectDoc(), firebaseAdminPaths.markdownCollection);
}

function getCollectorHeroNoteDocRef() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(getProjectDoc(), firebaseAdminPaths.publicContentCollection, firebaseAdminPaths.collectorHeroNoteDocId);
}

function getLinkHubDocRef() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(getProjectDoc(), firebaseAdminPaths.publicContentCollection, firebaseAdminPaths.linkHubDocId);
}

function getMarkdownFileId(collectionName: AdminMarkdownCollection, slug: string) {
  return `${collectionName}--${slug}`;
}

function getFirestoreMarkdownPath(collectionName: AdminMarkdownCollection, slug: string) {
  return `${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}/${firebaseAdminPaths.markdownCollection}/${getMarkdownFileId(collectionName, slug)}`;
}

function getMarkdownDocRef(collectionName: AdminMarkdownCollection, slug: string) {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return doc(getProjectDoc(), firebaseAdminPaths.markdownCollection, getMarkdownFileId(collectionName, slug));
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

function createFirestoreMarkdownPayload(
  collectionName: AdminMarkdownCollection,
  slug: string,
  content: string,
  updatedAt = new Date().toISOString()
) {
  const normalizedContent = normalizeMarkdown(content);

  return {
    collection: collectionName,
    slug,
    title: getMarkdownTitle(normalizedContent, `${slug}.md`),
    content: normalizedContent,
    preview: getMarkdownPreview(normalizedContent),
    updatedAt
  } satisfies FirebaseMarkdownDoc;
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

function createFirestoreMarkdownFileRecord(data: FirebaseMarkdownDoc) {
  return {
    slug: data.slug,
    title: data.title || getMarkdownTitle(data.content, `${data.slug}.md`),
    filePath: getFirestoreMarkdownPath(data.collection, data.slug),
    content: data.content,
    preview: data.preview || getMarkdownPreview(data.content),
    updatedAt: data.updatedAt
  } satisfies AdminMarkdownFile;
}

async function readLegacyStorageMarkdownCollection(collection: AdminMarkdownCollection) {
  if (!firebaseStorage) {
    return [];
  }

  try {
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
  } catch {
    return [];
  }
}

async function readFirestoreMarkdownCollections() {
  const snapshot = await getDocs(getMarkdownCollectionRef());
  const instagramDrafts: AdminMarkdownFile[] = [];
  const journalEntries: AdminMarkdownFile[] = [];

  snapshot.forEach((markdownSnapshot) => {
    const data = markdownSnapshot.data() as Partial<FirebaseMarkdownDoc>;

    if ((data.collection !== "instagram-posts" && data.collection !== "journals") || typeof data.slug !== "string" || typeof data.content !== "string") {
      return;
    }

    const record = createFirestoreMarkdownFileRecord({
      collection: data.collection,
      slug: data.slug,
      title: typeof data.title === "string" ? data.title : getMarkdownTitle(data.content, `${data.slug}.md`),
      content: data.content,
      preview: typeof data.preview === "string" ? data.preview : getMarkdownPreview(data.content),
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : ""
    });

    if (data.collection === "instagram-posts") {
      instagramDrafts.push(record);
      return;
    }

    journalEntries.push(record);
  });

  instagramDrafts.sort((left, right) => left.slug.localeCompare(right.slug));
  journalEntries.sort((left, right) => left.slug.localeCompare(right.slug));

  return {
    instagramDrafts,
    journalEntries
  };
}

async function migrateLegacyStorageMarkdownContent() {
  const [instagramDrafts, journalEntries] = await Promise.all([
    readLegacyStorageMarkdownCollection("instagram-posts"),
    readLegacyStorageMarkdownCollection("journals")
  ]);

  if (!instagramDrafts.length && !journalEntries.length) {
    return null;
  }

  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  const batch = writeBatch(firebaseDb);

  for (const file of instagramDrafts) {
    batch.set(getMarkdownDocRef("instagram-posts", file.slug), createFirestoreMarkdownPayload("instagram-posts", file.slug, file.content));
  }

  for (const file of journalEntries) {
    batch.set(getMarkdownDocRef("journals", file.slug), createFirestoreMarkdownPayload("journals", file.slug, file.content));
  }

  batch.set(
    getProjectDoc(),
    {
      [firebaseAdminPaths.markdownInitializedField]: true
    },
    { merge: true }
  );

  await batch.commit();

  return {
    instagramDrafts,
    journalEntries
  };
}

async function readMarkdownCollection(collection: AdminMarkdownCollection) {
  const allMarkdown = await readFirestoreMarkdownCollections();

  return collection === "instagram-posts" ? allMarkdown.instagramDrafts : allMarkdown.journalEntries;
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

async function saveBookingBoard(board: BookingBoard) {
  const nextBookingBoard = normalizeBookingBoard({
    ...board,
    updatedAt: board.updatedAt || new Date().toISOString()
  });

  await setDoc(
    getProjectDoc(),
    {
      projectId: firebaseAdminPaths.wallsDevineProjectId,
      updatedAt: nextBookingBoard.updatedAt,
      [firebaseAdminPaths.bookingBoardField]: nextBookingBoard
    },
    { merge: true }
  );

  return nextBookingBoard;
}

async function getReleasePlanFromFirestore() {
  const projectSnapshot = await getDoc(getProjectDoc());
  return projectSnapshot.data()?.[firebaseAdminPaths.releasePlanField] as ReleasePlan | undefined;
}

async function getCollectorHeroNoteFromFirestore() {
  const snapshot = await getDoc(getCollectorHeroNoteDocRef());

  if (!snapshot.exists()) {
    return defaultWallsDevineCollectorHeroNote;
  }

  return normalizeWallsDevineCollectorHeroNote(snapshot.data() as Partial<WallsDevineCollectorHeroNote>);
}

async function getLinkHubFromFirestore() {
  const snapshot = await getDoc(getLinkHubDocRef());

  if (!snapshot.exists()) {
    return defaultLinkHubContent;
  }

  return normalizeLinkHubContent(snapshot.data() as Partial<LinkHubContent>);
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
  const projectSnapshot = await getDoc(getProjectDoc());
  const projectData = projectSnapshot.data() ?? null;
  const releasePlan = projectData?.[firebaseAdminPaths.releasePlanField] as ReleasePlan | undefined;
  const bookingBoard = normalizeBookingBoard(projectData?.[firebaseAdminPaths.bookingBoardField] as Partial<BookingBoard> | undefined);
  const bookingBoardInitialized = Boolean(projectData?.[firebaseAdminPaths.bookingBoardField]);

  if (!releasePlan) {
    return null;
  }

  try {
    let { instagramDrafts, journalEntries } = await readFirestoreMarkdownCollections();
    let markdownInitialized = Boolean(projectData?.[firebaseAdminPaths.markdownInitializedField]);
    const [collectorHeroNote, linkHub] = await Promise.all([getCollectorHeroNoteFromFirestore(), getLinkHubFromFirestore()]);

    if (!markdownInitialized && !instagramDrafts.length && !journalEntries.length) {
      const migratedContent = await migrateLegacyStorageMarkdownContent();

      if (migratedContent) {
        instagramDrafts = migratedContent.instagramDrafts;
        journalEntries = migratedContent.journalEntries;
        markdownInitialized = true;
      }
    }

    return {
      plan: releasePlan,
      bookingBoard,
      instagramDrafts,
      journalEntries,
      collectorHeroNote,
      linkHub,
      storageBacked: true,
      contentBackend: "firestore",
      markdownInitialized: markdownInitialized || instagramDrafts.length > 0 || journalEntries.length > 0,
      bookingBoardInitialized
    } satisfies WallsDevineAdminData;
  } catch {
    return {
      plan: releasePlan,
      bookingBoard,
      instagramDrafts: [],
      journalEntries: [],
      collectorHeroNote: defaultWallsDevineCollectorHeroNote,
      linkHub: defaultLinkHubContent,
      storageBacked: false,
      contentBackend: "bootstrap",
      markdownInitialized: false,
      bookingBoardInitialized
    } satisfies WallsDevineAdminData;
  }
}

export async function updateFirebaseBookingBoard(board: BookingBoard) {
  return saveBookingBoard(board);
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

export async function updateFirebaseCollectorHeroNote(note: Partial<WallsDevineCollectorHeroNote>) {
  const nextNote = normalizeWallsDevineCollectorHeroNote({
    ...note,
    updatedAt: new Date().toISOString()
  });

  await setDoc(getCollectorHeroNoteDocRef(), nextNote, { merge: true });
  return nextNote;
}

export async function updateFirebaseLinkHub(content: Partial<LinkHubContent>) {
  const nextLinkHub = normalizeLinkHubContent({
    ...content,
    updatedAt: new Date().toISOString()
  });

  await setDoc(getLinkHubDocRef(), nextLinkHub, { merge: true });
  return nextLinkHub;
}

export async function updateFirebaseAdminMarkdownFile(collection: AdminMarkdownCollection, slug: string, content: string) {
  const nextPayload = createFirestoreMarkdownPayload(collection, slug, content);

  await setDoc(getMarkdownDocRef(collection, slug), nextPayload, { merge: true });
  await setDoc(
    getProjectDoc(),
    {
      [firebaseAdminPaths.markdownInitializedField]: true
    },
    { merge: true }
  );

  return createFirestoreMarkdownFileRecord(nextPayload);
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
  await deleteDoc(getMarkdownDocRef(collection, slug));
}

export async function seedFirebaseWallsDevineAdminData(seedData: WallsDevineAdminData): Promise<WallsDevineAdminData> {
  const nextPlan = await saveReleasePlan({
    ...seedData.plan,
    updatedAt: new Date().toISOString()
  });
  const nextBookingBoard = normalizeBookingBoard({
    ...seedData.bookingBoard,
    updatedAt: new Date().toISOString()
  });

  try {
    if (!firebaseDb) {
      throw new Error("Firestore is not initialized for this Firebase project.");
    }

    const batch = writeBatch(firebaseDb);

    batch.set(
      getProjectDoc(),
      {
        [firebaseAdminPaths.markdownInitializedField]: true,
        [firebaseAdminPaths.bookingBoardField]: nextBookingBoard
      },
      { merge: true }
    );

    batch.set(
      getCollectorHeroNoteDocRef(),
      normalizeWallsDevineCollectorHeroNote({
        ...seedData.collectorHeroNote,
        updatedAt: new Date().toISOString()
      }),
      { merge: true }
    );

    batch.set(
      getLinkHubDocRef(),
      normalizeLinkHubContent({
        ...seedData.linkHub,
        updatedAt: new Date().toISOString()
      }),
      { merge: true }
    );

    for (const file of seedData.instagramDrafts) {
      batch.set(getMarkdownDocRef("instagram-posts", file.slug), createFirestoreMarkdownPayload("instagram-posts", file.slug, file.content));
    }

    for (const file of seedData.journalEntries) {
      batch.set(getMarkdownDocRef("journals", file.slug), createFirestoreMarkdownPayload("journals", file.slug, file.content));
    }

    await batch.commit();

    const remoteData = await getFirebaseWallsDevineAdminData();

    if (remoteData) {
      return remoteData;
    }
  } catch {
    return {
      ...seedData,
      plan: nextPlan,
      bookingBoard: nextBookingBoard,
      storageBacked: false,
      contentBackend: "bootstrap",
      markdownInitialized: false,
      bookingBoardInitialized: false
    } satisfies WallsDevineAdminData;
  }

  return {
    ...seedData,
    plan: nextPlan,
    bookingBoard: nextBookingBoard,
    storageBacked: false,
    contentBackend: "bootstrap",
    markdownInitialized: false,
    bookingBoardInitialized: false
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