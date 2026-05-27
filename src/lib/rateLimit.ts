interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Run clean-up interval in Node.js runtime to prevent memory leaks
if (typeof global !== "undefined") {
  const globalAny = global as any;
  if (!globalAny.rateLimitCleanupInterval) {
    globalAny.rateLimitCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [ip, record] of rateLimitMap.entries()) {
        // Retain only timestamps from the last 1 hour
        record.timestamps = record.timestamps.filter((t) => now - t < 60 * 60 * 1000);
        if (record.timestamps.length === 0) {
          rateLimitMap.delete(ip);
        }
      }
    }, 10 * 60 * 1000); // Every 10 minutes
  }
}

/**
 * Validates whether an IP address is within the rate limit thresholds.
 * Uses a sliding-window algorithm.
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter out expired timestamps
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(0, Math.ceil((resetTime - now) / 1000)),
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}
