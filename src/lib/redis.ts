// Redis utility functions
// Uses Upstash Redis for production (serverless-compatible)

import { Redis } from '@upstash/redis';

// ============================================================================
// Redis Client Singleton
// ============================================================================

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

// ============================================================================
// Distributed Lock for preventing race conditions
// ============================================================================

interface LockOptions {
  /** Lock timeout in seconds (default: 60) */
  ttlSeconds?: number;
  /** Max wait time in ms to acquire lock (default: 5000) */
  waitTimeoutMs?: number;
  /** Polling interval in ms when waiting (default: 100) */
  pollIntervalMs?: number;
}

interface LockResult {
  acquired: boolean;
  release: () => Promise<void>;
}

/**
 * Attempt to acquire a distributed lock
 *
 * @param key - Unique lock key
 * @param options - Lock options
 * @returns Object with `acquired` boolean and `release` function
 *
 * @example
 * const lock = await acquireLock('generating:section:123');
 * if (lock.acquired) {
 *   try {
 *     // Do exclusive work
 *   } finally {
 *     await lock.release();
 *   }
 * }
 */
export async function acquireLock(key: string, options: LockOptions = {}): Promise<LockResult> {
  const { ttlSeconds = 60, waitTimeoutMs = 5000, pollIntervalMs = 100 } = options;

  const redisClient = getRedis();

  // No-op if Redis not available (development fallback)
  if (!redisClient) {
    return {
      acquired: true,
      release: async () => {},
    };
  }

  const lockKey = `lock:${key}`;
  const lockValue = crypto.randomUUID();
  const startTime = Date.now();

  // Try to acquire lock with polling
  while (Date.now() - startTime < waitTimeoutMs) {
    try {
      // SET key value NX EX ttl - only set if not exists
      const result = await redisClient.set(lockKey, lockValue, {
        nx: true,
        ex: ttlSeconds,
      });

      if (result === 'OK') {
        // Lock acquired
        return {
          acquired: true,
          release: async () => {
            try {
              // Only delete if we own the lock (compare value)
              const currentValue = await redisClient.get(lockKey);
              if (currentValue === lockValue) {
                await redisClient.del(lockKey);
              }
            } catch {
              // Ignore release errors
            }
          },
        };
      }

      // Lock not acquired, wait and retry
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    } catch (error) {
      console.error('[Lock] Redis error:', error);
      // On error, allow operation to proceed (fail open)
      return {
        acquired: true,
        release: async () => {},
      };
    }
  }

  // Timeout - could not acquire lock
  return {
    acquired: false,
    release: async () => {},
  };
}

/**
 * Check if a lock exists (without acquiring it)
 */
export async function isLocked(key: string): Promise<boolean> {
  const redisClient = getRedis();
  if (!redisClient) return false;

  try {
    const lockKey = `lock:${key}`;
    const value = await redisClient.get(lockKey);
    return value !== null;
  } catch {
    return false;
  }
}
