interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 5;

class ResponseRateLimiter {
  // key: `${formId}:${ip}` -> entry
  // NOTE: entries never expire from memory. Fine for demo/hackathon scale;
  // production would need periodic cleanup or a TTL-based store (e.g. Redis).
  private store = new Map<string, RateLimitEntry>();

  public checkAndIncrement(formId: string, ip: string): { allowed: boolean; retryAfterMs?: number } {
    const key = `${formId}:${ip}`;
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now - entry.windowStartedAt > WINDOW_MS) {
      // naya window shuru karo
      this.store.set(key, { count: 1, windowStartedAt: now });
      return { allowed: true };
    }

    if (entry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
      const retryAfterMs = WINDOW_MS - (now - entry.windowStartedAt);
      return { allowed: false, retryAfterMs };
    }

    entry.count += 1;
    return { allowed: true };
  }
}

// singleton — poore app mein ek hi instance, state share hoga
export const responseRateLimiter = new ResponseRateLimiter();
