import { test, expect } from "@playwright/test";

test.describe("Actor-Critic Defensive Security Controls", () => {
  test("security headers are present on public web pages", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  test("robots.txt blocks crawler indexing on sensitive and dynamic API paths", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("Disallow: /admin/");
  });

  test("unauthorized requests to screenplay download are gated with 401", async ({ request }) => {
    const res = await request.get("/api/bong-tour/treatment/download?type=screenplay");
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toContain("pass required");
  });

  test("oversized payloads to giveaway route are rejected with 413", async ({ request }) => {
    const largeNote = "X".repeat(35 * 1024);
    const res = await request.post("/api/bong-tour/giveaway", {
      data: {
        email: "test@example.com",
        note: largeNote
      }
    });
    expect(res.status()).toBe(413);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  test("honeypot trap intercepts automated bots without consuming Firestore resources", async ({ request }) => {
    const res = await request.post("/api/bong-tour/giveaway", {
      data: {
        email: "bot@autonomous-agent.net",
        website: "http://rogue-agent-spam.com"
      }
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.claim.claimId).toContain("claim_bot_");
    expect(json.claim.serialNumber).toBe("BT-APPR-2026-SHADOW");
  });

  test("sliding window rate limiting throttles giveaway spam with 429", async ({ request }) => {
    let triggeredRateLimit = false;

    // The route allows 5 requests per 5-minute window
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/bong-tour/giveaway", {
        data: {
          email: `flood_${i}@example.com`,
          tierId: "script_giveaway"
        }
      });

      if (res.status() === 429) {
        triggeredRateLimit = true;
        const headers = res.headers();
        expect(headers["retry-after"]).toBeDefined();
        expect(Number(headers["retry-after"])).toBeGreaterThan(0);
        break;
      }
    }

    expect(triggeredRateLimit).toBe(true);
  });
});
