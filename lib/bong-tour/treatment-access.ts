import { createHmac, timingSafeEqual } from "node:crypto";

import { Timestamp } from "firebase-admin/firestore";

import { getServerFirestore, isFirebaseAdminConfigError } from "@/lib/firebase/server-admin";
import { firebaseAdminPaths } from "@/lib/firebase/config";

const TREATMENT_SESSION_COOKIE = "bt_treatment_session";
const TREATMENT_SESSION_TTL_MS = 1000 * 60 * 60 * 2;
const TREATMENT_CONTENT_DOC_ID = "bongTourTreatment";

export type TreatmentSession = {
  email: string;
  expiresAt: number;
};

type TreatmentContentRecord = {
  title: string;
  content: string;
  updatedAt: string;
  source: string;
};

function isLocalTreatmentFallbackEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.BONG_TOUR_TREATMENT_LOCAL_FALLBACK !== "false";
}

function normalizeEmail(value: string | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getProjectDoc() {
  return getServerFirestore().collection(firebaseAdminPaths.adminProjectsCollection).doc(firebaseAdminPaths.wallsDevineProjectId);
}

function getPrivateContentDoc() {
  return getProjectDoc().collection(firebaseAdminPaths.privateContentCollection).doc(TREATMENT_CONTENT_DOC_ID);
}

function getAccessLogCollection() {
  return getProjectDoc().collection(firebaseAdminPaths.privateContentAccessLogsCollection);
}

function getSessionSecret() {
  const secret = process.env.BONG_TOUR_TREATMENT_SESSION_SECRET;

  if (!secret && isLocalTreatmentFallbackEnabled()) {
    return "bong-tour-local-session-secret";
  }

  if (!secret) {
    throw new Error("Missing BONG_TOUR_TREATMENT_SESSION_SECRET environment variable.");
  }

  return secret;
}

function getAccessPassword() {
  return process.env.BONG_TOUR_TREATMENT_ACCESS_PASSWORD ?? "";
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeSession(session: TreatmentSession) {
  const payload = JSON.stringify(session);
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function decodeTreatmentSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as TreatmentSession;

    if (!payload.email || !payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createTreatmentSession(email: string) {
  return encodeSession({
    email,
    expiresAt: Date.now() + TREATMENT_SESSION_TTL_MS
  });
}

export function getTreatmentSessionCookieName() {
  return TREATMENT_SESSION_COOKIE;
}

export function getTreatmentSessionMaxAgeSeconds() {
  return Math.floor(TREATMENT_SESSION_TTL_MS / 1000);
}

export async function hasTreatmentLeadAccess(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return false;
  }

  try {
    const firestore = getServerFirestore();
    const [leadSnapshot, collectorSnapshot] = await Promise.all([
      firestore
        .collection(firebaseAdminPaths.ecosystemLeadsCollection)
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get(),
      firestore
        .collection(firebaseAdminPaths.collectorsCollection)
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get()
    ]);

    return !leadSnapshot.empty || !collectorSnapshot.empty;
  } catch (error) {
    if (isFirebaseAdminConfigError(error) && isLocalTreatmentFallbackEnabled()) {
      return true;
    }

    throw error;
  }
}

export async function verifyTreatmentGate(input: { email: string; password: string }) {
  const normalizedEmail = normalizeEmail(input.email);
  const password = (input.password ?? "").trim();

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false as const, normalizedEmail };
  }

  const [hasLeadAccess, expectedPassword] = await Promise.all([hasTreatmentLeadAccess(normalizedEmail), Promise.resolve(getAccessPassword())]);
  const passwordMatches = expectedPassword
    ? safeCompare(password, expectedPassword)
    : isLocalTreatmentFallbackEnabled() && password.length > 0;

  return {
    ok: hasLeadAccess && passwordMatches,
    normalizedEmail
  } as const;
}

export function canUseLocalTreatmentFallback() {
  return isLocalTreatmentFallbackEnabled();
}

export async function logTreatmentAccessAttempt(input: {
  email: string;
  success: boolean;
  reason: "granted" | "invalid_credentials" | "invalid_email" | "session" | "content_error";
  ipAddress?: string;
  userAgent?: string;
}) {
  await getAccessLogCollection().add({
    email: normalizeEmail(input.email),
    success: input.success,
    reason: input.reason,
    ipAddress: (input.ipAddress ?? "").slice(0, 160),
    userAgent: (input.userAgent ?? "").slice(0, 320),
    createdAt: Timestamp.now()
  });
}

export async function tryLogTreatmentAccessAttempt(input: {
  email: string;
  success: boolean;
  reason: "granted" | "invalid_credentials" | "invalid_email" | "session" | "content_error";
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await logTreatmentAccessAttempt(input);
  } catch {
    return;
  }
}

export async function getProtectedTreatmentContent() {
  const snapshot = await getPrivateContentDoc().get();

  if (!snapshot.exists) {
    throw new Error("Bong Tour treatment content is not configured in private Firestore storage yet.");
  }

  const data = snapshot.data() as Partial<TreatmentContentRecord> | undefined;
  const title = typeof data?.title === "string" && data.title.trim() ? data.title.trim() : "Bong Tour treatment";
  const content = typeof data?.content === "string" ? data.content : "";
  const updatedAt = typeof data?.updatedAt === "string" ? data.updatedAt : "";
  const source = typeof data?.source === "string" ? data.source : "firestore";

  if (!content.trim()) {
    throw new Error("Bong Tour treatment content is empty in private Firestore storage.");
  }

  return {
    title,
    content,
    updatedAt,
    source
  } satisfies TreatmentContentRecord;
}

export async function syncTreatmentContentIfMissing(input: { title: string; content: string; source: string }) {
  const docRef = getPrivateContentDoc();
  const snapshot = await docRef.get();

  if (snapshot.exists) {
    return;
  }

  const nextContent = input.content.trimEnd() ? `${input.content.trimEnd()}\n` : "";

  if (!nextContent) {
    return;
  }

  await docRef.set({
    title: input.title.trim() || "Bong Tour treatment",
    content: nextContent,
    preview: nextContent.split("\n\n").map((section) => section.trim()).find(Boolean) ?? "",
    updatedAt: new Date().toISOString(),
    source: input.source,
    searchable: false
  }, { merge: true });
}