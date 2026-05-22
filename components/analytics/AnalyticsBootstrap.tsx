"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { getFirebaseAnalytics, trackAnalyticsEvent, trackPageView } from "@/lib/firebase/analytics";

const analyticsParamPrefix = "analyticsParam";

function coerceAnalyticsParamValue(value: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  return value;
}

function getAnalyticsParamsFromDataset(dataset: DOMStringMap) {
  const entries: Array<[string, string | number | boolean]> = [];

  for (const [key, value] of Object.entries(dataset)) {
    if (!key.startsWith(analyticsParamPrefix) || !value?.trim()) {
      continue;
    }

    const paramKeyStem = key.slice(analyticsParamPrefix.length);

    if (!paramKeyStem) {
      continue;
    }

    const paramKey = `${paramKeyStem.charAt(0).toLowerCase()}${paramKeyStem.slice(1)}`;
    entries.push([paramKey, coerceAnalyticsParamValue(value.trim())]);
  }

  return Object.fromEntries(entries);
}

export function AnalyticsBootstrap() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSeenInitialRoute = useRef(false);
  const search = searchParams.toString();
  const pagePath = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    void getFirebaseAnalytics();
  }, []);

  useEffect(() => {
    if (!pagePath) {
      return;
    }

    if (!hasSeenInitialRoute.current) {
      hasSeenInitialRoute.current = true;
      return;
    }

    void trackPageView(pagePath);
  }, [pagePath]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const trackedElement = event.target.closest("[data-analytics-event]") as HTMLElement | null;

      if (!trackedElement) {
        return;
      }

      const eventName = trackedElement.dataset.analyticsEvent?.trim();

      if (!eventName) {
        return;
      }

      void trackAnalyticsEvent(eventName, getAnalyticsParamsFromDataset(trackedElement.dataset));
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}

export default AnalyticsBootstrap;
