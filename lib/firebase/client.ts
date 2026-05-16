import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { firebaseConfig, hasFirebaseConfig } from "./config";

let cachedFirebaseApp: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    return null;
  }

  if (!cachedFirebaseApp) {
    cachedFirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return cachedFirebaseApp;
}

export const firebaseApp = getFirebaseApp();
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null;