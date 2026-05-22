import type { Analytics } from "firebase/analytics";

import { firebaseApp } from "./client";
import { firebaseAnalyticsMeasurementId } from "./config";

type AnalyticsParamValue = string | number | boolean;

export type AnalyticsEventParams = Record<string, AnalyticsParamValue | null | undefined>;

let analyticsPromise: Promise<Analytics | null> | null = null;

function sanitizeAnalyticsParams(params?: AnalyticsEventParams) {
  const normalizedEntries: Array<[string, AnalyticsParamValue]> = [];

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().slice(0, 100);

      if (normalizedValue) {
        normalizedEntries.push([key, normalizedValue]);
      }

      continue;
    }

    if (typeof value === "number") {
      if (Number.isFinite(value)) {
        normalizedEntries.push([key, value]);
      }

      continue;
    }

    normalizedEntries.push([key, value]);
  }

  return Object.fromEntries(normalizedEntries);
}

async function loadAnalyticsModule() {
  return import("firebase/analytics");
}

export async function getFirebaseAnalytics() {
  if (!firebaseApp || !firebaseAnalyticsMeasurementId || typeof window === "undefined") {
    return null;
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      try {
        const analyticsModule = await loadAnalyticsModule();
        const supported = await analyticsModule.isSupported().catch(() => false);

        if (!supported) {
          return null;
        }

        return analyticsModule.getAnalytics(firebaseApp);
      } catch {
        analyticsPromise = null;
        return null;
      }
    })();
  }

  return analyticsPromise;
}

export async function trackAnalyticsEvent(eventName: string, params?: AnalyticsEventParams) {
  const analytics = await getFirebaseAnalytics();

  if (!analytics) {
    return false;
  }

  const analyticsModule = await loadAnalyticsModule();
  analyticsModule.logEvent(analytics, eventName, sanitizeAnalyticsParams(params));

  return true;
}

export async function trackPageView(pagePath: string) {
  const analytics = await getFirebaseAnalytics();

  if (!analytics || typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  const analyticsModule = await loadAnalyticsModule();
  analyticsModule.logEvent(
    analytics,
    "page_view",
    sanitizeAnalyticsParams({
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath
    })
  );

  return true;
}
