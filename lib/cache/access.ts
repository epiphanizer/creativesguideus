import { createHmac, timingSafeEqual } from "node:crypto";

import { Timestamp } from "firebase-admin/firestore";

import { getServerFirestore, isFirebaseAdminConfigError } from "@/lib/firebase/server-admin";
import { firebaseAdminPaths } from "@/lib/firebase/config";

const CACHE_SESSION_COOKIE = "cache_access_session";
const CACHE_SESSION_TTL_MS = 1000 * 60 * 60 * 2;

export type CacheSession = {
  email: string;
  expiresAt: number;
};

function isLocalFallbackEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.CACHE_ACCESS_LOCAL_FALLBACK !== "false";
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
  return getServerFirestore()
    .collection(firebaseAdminPaths.adminProjectsCollection)
    .doc(firebaseAdminPaths.cacheProjectId);
}

function getAccessLogCollection() {
  return getProjectDoc().collection(firebaseAdminPaths.privateContentAccessLogsCollection);
}

function getSessionSecret() {
  const secret = process.env.CACHE_ACCESS_SESSION_SECRET;

  if (!secret && isLocalFallbackEnabled()) {
    return "cache-local-session-secret";
  }

  if (!secret) {
    throw new Error("Missing CACHE_ACCESS_SESSION_SECRET environment variable.");
  }

  return secret;
}

function getAccessPassword() {
  return process.env.CACHE_ACCESS_PASSWORD ?? "";
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

function encodeSession(session: CacheSession) {
  const payload = JSON.stringify(session);
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function decodeCacheSession(value: string | undefined) {
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
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as CacheSession;

    if (!payload.email || !payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createCacheSession(email: string) {
  return encodeSession({
    email,
    expiresAt: Date.now() + CACHE_SESSION_TTL_MS
  });
}

export function getCacheSessionCookieName() {
  return CACHE_SESSION_COOKIE;
}

export function getCacheSessionMaxAgeSeconds() {
  return Math.floor(CACHE_SESSION_TTL_MS / 1000);
}

export async function hasCacheLeadAccess(email: string) {
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
    if (isFirebaseAdminConfigError(error) && isLocalFallbackEnabled()) {
      return true;
    }

    throw error;
  }
}

export async function verifyCacheGate(input: { email: string; password: string }) {
  const normalizedEmail = normalizeEmail(input.email);
  const password = (input.password ?? "").trim();

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false as const, normalizedEmail };
  }

  const [hasLeadAccess, expectedPassword] = await Promise.all([
    hasCacheLeadAccess(normalizedEmail),
    Promise.resolve(getAccessPassword())
  ]);

  const passwordMatches = expectedPassword
    ? safeCompare(password, expectedPassword)
    : isLocalFallbackEnabled() && password.length > 0;

  return {
    ok: hasLeadAccess && passwordMatches,
    normalizedEmail
  } as const;
}

export async function logCacheAccessAttempt(input: {
  email: string;
  success: boolean;
  reason: "granted" | "invalid_credentials" | "invalid_email" | "session";
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

export async function tryLogCacheAccessAttempt(input: {
  email: string;
  success: boolean;
  reason: "granted" | "invalid_credentials" | "invalid_email" | "session";
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await logCacheAccessAttempt(input);
  } catch {
    return;
  }
}
