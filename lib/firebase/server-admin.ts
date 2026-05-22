import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { firebaseConfig } from "./config";

export class FirebaseAdminConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FirebaseAdminConfigError";
  }
}

function getPrivateKey() {
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  return rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;
}

function hasExplicitAdminCredentials() {
  return Boolean((process.env.FIREBASE_ADMIN_PROJECT_ID ?? firebaseConfig.projectId) && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && getPrivateKey());
}

function shouldUseApplicationDefaultCredentials() {
  return (
    process.env.FIREBASE_ADMIN_USE_APPLICATION_DEFAULT === "true" ||
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
    Boolean(process.env.K_SERVICE) ||
    Boolean(process.env.FUNCTION_TARGET) ||
    Boolean(process.env.FUNCTION_NAME) ||
    Boolean(process.env.GOOGLE_CLOUD_PROJECT) ||
    Boolean(process.env.GCLOUD_PROJECT) ||
    Boolean(process.env.GAE_ENV)
  );
}

function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? firebaseConfig.projectId;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
  }

  if (!hasExplicitAdminCredentials() && !shouldUseApplicationDefaultCredentials()) {
    throw new FirebaseAdminConfigError(
      "Firebase admin credentials are not configured for the Next server. Set FIREBASE_ADMIN_* env vars, enable FIREBASE_ADMIN_USE_APPLICATION_DEFAULT, or run on a managed GCP runtime with ADC."
    );
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId
  });
}

export function getServerFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

export function isFirebaseAdminConfigError(error: unknown) {
  return error instanceof FirebaseAdminConfigError;
}