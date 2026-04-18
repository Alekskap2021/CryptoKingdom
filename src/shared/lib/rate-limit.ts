const buckets = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
let cleanupTimer: null | ReturnType<typeof setInterval> = null;

function startCleanup(windowMs: number) {
 if (cleanupTimer) return;
 cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
   const filtered = timestamps.filter((t) => now - t < windowMs);
   if (filtered.length === 0) buckets.delete(key);
   else buckets.set(key, filtered);
  }
 }, CLEANUP_INTERVAL);

 if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
  cleanupTimer.unref();
 }
}

interface RateLimitOptions {
 /** Max number of requests allowed within the window */
 maxRequests: number;
 /** Time window in milliseconds */
 windowMs: number;
}

/**
 * Sliding-window rate limiter keyed by an arbitrary string (e.g. userId).
 * Throws an error when the limit is exceeded.
 */
export function assertRateLimit(key: string, opts: RateLimitOptions): void {
 startCleanup(opts.windowMs);

 const now = Date.now();
 const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < opts.windowMs);

 if (timestamps.length >= opts.maxRequests) {
  throw new Error("Too many requests. Please try again later.");
 }

 timestamps.push(now);
 buckets.set(key, timestamps);
}
