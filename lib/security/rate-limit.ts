/**
 * In-memory sliding-window rate limiter for edge/Node Next.js runtimes.
 * Prevents autonomous scrapers, brute-force bots, and malicious agents
 * from exhausting server compute, memory, and database quotas.
 */

type RateLimitRecord = {
  timestamps: number[];
};

const store = new Map<string, RateLimitRecord>();

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanupTimer() {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    // Default window prune: anything older than 10 minutes
    const maxRetentionMs = 10 * 60 * 1000;
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxRetentionMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 60 * 1000);

  if (typeof cleanupInterval.unref === "function") {
    cleanupInterval.unref();
  }
}

export type RateLimitOptions = {
  key: string;
  maxRequests: number;
  windowMs: number;
};

export type RateLimitResult = {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  ensureCleanupTimer();

  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = store.get(options.key);
  if (!record) {
    record = { timestamps: [] };
    store.set(options.key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldestInWindow = record.timestamps[0] ?? now;
    const resetTime = oldestInWindow + options.windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      isAllowed: false,
      limit: options.maxRequests,
      remaining: 0,
      resetTime,
      retryAfterSeconds
    };
  }

  // Record this request
  record.timestamps.push(now);

  const remaining = Math.max(0, options.maxRequests - record.timestamps.length);
  const resetTime = now + options.windowMs;

  return {
    isAllowed: true,
    limit: options.maxRequests,
    remaining,
    resetTime,
    retryAfterSeconds: 0
  };
}

export function resetRateLimitStoreForTesting() {
  store.clear();
}
