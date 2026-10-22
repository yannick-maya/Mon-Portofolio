import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 10 * 60 * 1000;
const MESSAGE_LIMIT = 15;

type MemoryRateLimit = {
  requestsByKey: Map<string, number[]>;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  chatRateLimit?: MemoryRateLimit;
  upstashRateLimiter?: Ratelimit;
  hasLoggedInvalidUpstashConfig?: boolean;
};

function getMemoryRateLimit() {
  globalForRateLimit.chatRateLimit ??= { requestsByKey: new Map() };
  return globalForRateLimit.chatRateLimit;
}

function getHashedKey(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

function consumeMemoryLimit(key: string, now: number) {
  const state = getMemoryRateLimit();

  if (state.requestsByKey.size > 5000) {
    for (const [storedKey, timestamps] of state.requestsByKey) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) {
        state.requestsByKey.delete(storedKey);
      }
    }
  }

  const timestamps = (state.requestsByKey.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (timestamps.length >= MESSAGE_LIMIT) {
    state.requestsByKey.set(key, timestamps);
    return {
      success: false,
      reset: timestamps[0] + WINDOW_MS,
    };
  }

  timestamps.push(now);
  state.requestsByKey.set(key, timestamps);
  return { success: true, reset: now + WINDOW_MS };
}

function getUpstashRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (
      (url || token) &&
      !globalForRateLimit.hasLoggedInvalidUpstashConfig
    ) {
      console.error(
        "Upstash rate-limit configuration is incomplete; using memory fallback.",
      );
      globalForRateLimit.hasLoggedInvalidUpstashConfig = true;
    }
    return null;
  }

  globalForRateLimit.upstashRateLimiter ??= new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MESSAGE_LIMIT, "10 m"),
    prefix: "portfolio-chat",
    analytics: false,
  });

  return globalForRateLimit.upstashRateLimiter;
}

export async function checkChatRateLimit(ip: string) {
  const key = getHashedKey(ip);
  const limiter = getUpstashRateLimiter();

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      return { success: result.success, reset: result.reset };
    } catch (error) {
      console.error("Chat rate-limit service failed; using memory fallback.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  return consumeMemoryLimit(key, Date.now());
}
