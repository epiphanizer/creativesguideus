import test from "node:test";
import assert from "node:assert/strict";

// We can test the rate limiting logic directly
import { checkRateLimit, resetRateLimitStoreForTesting } from "../lib/security/rate-limit.ts";

test("rate limiter allows requests up to maxRequests threshold", () => {
  resetRateLimitStoreForTesting();
  const key = "test-ip-1";

  for (let i = 1; i <= 5; i++) {
    const res = checkRateLimit({ key, maxRequests: 5, windowMs: 10000 });
    assert.equal(res.isAllowed, true, `Request ${i} should be allowed`);
    assert.equal(res.remaining, 5 - i, `Remaining should be ${5 - i}`);
  }

  // 6th request should be blocked
  const blocked = checkRateLimit({ key, maxRequests: 5, windowMs: 10000 });
  assert.equal(blocked.isAllowed, false, "6th request should be blocked");
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSeconds > 0, "retryAfterSeconds should be positive");
});

test("rate limiter isolates different keys", () => {
  resetRateLimitStoreForTesting();
  const key1 = "test-ip-a";
  const key2 = "test-ip-b";

  for (let i = 0; i < 3; i++) {
    checkRateLimit({ key: key1, maxRequests: 3, windowMs: 10000 });
  }

  assert.equal(checkRateLimit({ key: key1, maxRequests: 3, windowMs: 10000 }).isAllowed, false);
  assert.equal(checkRateLimit({ key: key2, maxRequests: 3, windowMs: 10000 }).isAllowed, true);
});
