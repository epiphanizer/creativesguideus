import { expect, test } from "@playwright/test";

import {
  buildContactHref,
  buildContactPrefill,
  contactQueryKeys,
  hasContactModalIntent,
  normalizeQueryToken,
  stripContactModalSearch,
} from "../../lib/contact-intake-routing";

/**
 * Regression guards for routed contact intake metadata.
 *
 * The launch-sensitive contract is that the guided intake URL carries its
 * routing metadata (context, inquiryType, project, goal, surface, engagement,
 * timeline, budgetRange, sourceRoute, campaignWindow) from the originating CTA
 * into the intake surface without loss, and that closing intake clears exactly
 * that metadata while leaving unrelated query params alone.
 *
 * Flow selection inside the intake is driven by launch-state gates and is
 * intentionally not asserted here.
 */

const routedMetadata = {
  context: "walls-devine-mailing-list",
  inquiryType: "mailing-list",
  project: "Walls/Devine",
  goal: "signal-list",
  surface: "public-world",
  engagement: "launch-partnership",
  timeline: "q4-2026",
  budgetRange: "25k-50k",
  sourceRoute: "/bong-tour/treatment?ref=poster",
  campaignWindow: "album-launch",
} as const;

test.describe("routed contact intake metadata contract", () => {
  test("buildContactHref emits contact=open plus every routed metadata key", () => {
    const href = buildContactHref({ pathname: "/contact", overrides: routedMetadata });
    const params = new URLSearchParams(href.slice(href.indexOf("?") + 1));

    expect(href.startsWith("/contact?")).toBe(true);
    expect(params.get("contact")).toBe("open");

    for (const [key, value] of Object.entries(routedMetadata)) {
      expect(params.get(key), `missing routed key: ${key}`).toBe(value);
    }
  });

  test("every routed metadata key is declared in contactQueryKeys", () => {
    for (const key of Object.keys(routedMetadata)) {
      expect(contactQueryKeys as readonly string[]).toContain(key);
    }
  });

  test("buildContactHref preserves unrelated search params while replacing contact keys", () => {
    const href = buildContactHref({
      pathname: "/contact",
      currentSearch: "utm_source=instagram&context=stale-context&gclid=abc123",
      overrides: { context: "bong-tour-intake" },
    });
    const params = new URLSearchParams(href.slice(href.indexOf("?") + 1));

    expect(params.get("utm_source")).toBe("instagram");
    expect(params.get("gclid")).toBe("abc123");
    expect(params.get("context")).toBe("bong-tour-intake");
  });

  test("buildContactHref drops blank overrides instead of writing empty params", () => {
    const href = buildContactHref({
      pathname: "/contact",
      overrides: { context: "bong-tour-intake", campaignWindow: "   ", project: "" },
    });
    const params = new URLSearchParams(href.slice(href.indexOf("?") + 1));

    expect(params.get("context")).toBe("bong-tour-intake");
    expect(params.has("campaignWindow")).toBe(false);
    expect(params.has("project")).toBe(false);
  });

  test("routed metadata survives the URL round trip back into buildContactPrefill", () => {
    const href = buildContactHref({ pathname: "/contact", overrides: routedMetadata });
    const prefill = buildContactPrefill(href.slice(href.indexOf("?") + 1));

    expect(prefill.contextId).toBe(routedMetadata.context);
    expect(prefill.inquiryType).toBe(routedMetadata.inquiryType);
    expect(prefill.projectTitle).toBe(routedMetadata.project);
    expect(prefill.goal).toBe(routedMetadata.goal);
    expect(prefill.surface).toBe(routedMetadata.surface);
    expect(prefill.engagement).toBe(routedMetadata.engagement);
    expect(prefill.timeline).toBe(routedMetadata.timeline);
    expect(prefill.budgetRange).toBe(routedMetadata.budgetRange);
    expect(prefill.sourceRoute).toBe(routedMetadata.sourceRoute);
    expect(prefill.campaignWindow).toBe(routedMetadata.campaignWindow);
  });

  test("sourceRoute accepts an absolute URL and normalizes to pathname plus search", () => {
    const href = buildContactHref({
      pathname: "/contact",
      overrides: { sourceRoute: "https://creativesguideus.com/bong-tour?ref=poster" },
    });
    const prefill = buildContactPrefill(href.slice(href.indexOf("?") + 1));

    expect(prefill.sourceRoute).toBe("/bong-tour?ref=poster");
  });

  test("hasContactModalIntent opens for routed metadata and stays closed for a bare route", () => {
    expect(hasContactModalIntent("")).toBe(false);
    expect(hasContactModalIntent("utm_source=instagram")).toBe(false);
    expect(hasContactModalIntent("contact=open")).toBe(true);
    expect(hasContactModalIntent("contact=1")).toBe(true);
    expect(hasContactModalIntent("contact=true")).toBe(true);

    for (const key of Object.keys(routedMetadata)) {
      expect(hasContactModalIntent(`${key}=sample`), `did not open intake for: ${key}`).toBe(true);
    }
  });

  test("stripContactModalSearch clears routed metadata and keeps unrelated params", () => {
    const stripped = stripContactModalSearch(
      "utm_source=instagram&context=bong-tour-intake&campaignWindow=album-launch&gclid=abc123"
    );
    const params = new URLSearchParams(stripped);

    expect(params.get("utm_source")).toBe("instagram");
    expect(params.get("gclid")).toBe("abc123");

    for (const key of contactQueryKeys) {
      expect(params.has(key), `routed key survived strip: ${key}`).toBe(false);
    }
  });

  test("normalizeQueryToken produces stable slug tokens", () => {
    expect(normalizeQueryToken("Walls/Devine")).toBe("walls-devine");
    expect(normalizeQueryToken("  Bong Tour  ")).toBe("bong-tour");
    expect(normalizeQueryToken("album-launch")).toBe("album-launch");
    expect(normalizeQueryToken(null)).toBe("");
  });
});

test.describe("routed contact intake at the route level", () => {
  test("a routed intake URL opens the guided intake dialog", async ({ page }) => {
    await page.goto(
      "/contact?context=walls-devine-mailing-list&inquiryType=mailing-list&project=Walls%2FDevine"
    );

    const dialog = page.getByRole("dialog", { name: "Guided contact intake" });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("a bare contact route does not open the guided intake dialog", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByRole("dialog", { name: "Guided contact intake" })).toHaveCount(0);
  });

  test("closing the guided intake strips routed metadata from the URL", async ({ page }) => {
    await page.goto(
      "/contact?context=bong-tour-intake&sourceRoute=%2Fbong-tour&campaignWindow=album-launch"
    );

    const dialog = page.getByRole("dialog", { name: "Guided contact intake" });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close guided intake" }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/contact$/);
  });
});

