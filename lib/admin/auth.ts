import { firebaseAdminPaths, firebaseProjectInfo, hasFirebaseConfig } from "@/lib/firebase/config";

export const adminAuthConfig = {
  provider: "firebase-email-password",
  firebaseReady: hasFirebaseConfig,
  firebaseProjectId: firebaseProjectInfo.projectId,
  authorizationCollection: firebaseAdminPaths.adminUsersCollection,
  projectDocument: `${firebaseAdminPaths.adminProjectsCollection}/${firebaseAdminPaths.wallsDevineProjectId}`,
  storageBasePath: firebaseAdminPaths.storageBasePath
} as const;
