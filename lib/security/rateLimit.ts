/**
 * Sliding Window Memory Rate Limiter
 * Provides defensive perimeter protection against brute force or DoS
 * on resource-intensive endpoints like PDF generation and file uploads.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitEntry>();

// Clean up stale memory records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      // Remove timestamps older than 10 minutes
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 600000);
      if (entry.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  windowMs: number; // Duration of rate limit window in milliseconds
  max: number;      // Maximum requests allowed in the window
  identifier: string; // IP or userId
  action: string;   // Name of action (e.g. 'pdf_gen', 'storage_upload')
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const { windowMs, max, identifier, action } = options;
  const key = `${action}:${identifier}`;
  const now = Date.now();

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter out timestamps outside current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= max) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit: max,
    remaining: max - record.timestamps.length,
    resetMs: windowMs,
  };
}
