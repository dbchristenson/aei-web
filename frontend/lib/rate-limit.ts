import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter: 5 requests per IP per hour.
 *
 * Gracefully returns null when Upstash env vars are missing (local dev),
 * so the route handler can skip rate limiting instead of crashing.
 */
function createRateLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — rate limiting disabled."
    );
    return null;
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "aei:contact",
  });
}

const rateLimiter = createRateLimiter();

export async function rateLimit(
  ip: string
): Promise<{ success: boolean; remaining: number }> {
  if (!rateLimiter) {
    return { success: true, remaining: -1 };
  }

  const result = await rateLimiter.limit(ip);
  return { success: result.success, remaining: result.remaining };
}
