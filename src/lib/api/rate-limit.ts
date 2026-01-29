// Rate Limiting for API Routes
// Uses Upstash Redis for production (serverless-compatible)
// Falls back to in-memory for local development

import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from '@/lib/redis';
import type { ApiErrorResponse, ResponseMeta } from '@/types/api';

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ============================================================================
// Rate Limit Configurations by Endpoint
// ============================================================================

export const RATE_LIMITS = {
  // Laws endpoints - generous limits
  laws: {
    guest: { windowMs: 60_000, maxRequests: 100 },
    authenticated: { windowMs: 60_000, maxRequests: 200 },
  },
  // Search endpoints - more restrictive
  search: {
    guest: { windowMs: 60_000, maxRequests: 30 },
    authenticated: { windowMs: 60_000, maxRequests: 100 },
  },
  // Scenarios endpoints
  scenarios: {
    guest: { windowMs: 60_000, maxRequests: 100 },
    authenticated: { windowMs: 60_000, maxRequests: 200 },
  },
  // AI/Explanations endpoints - most restrictive
  explanations: {
    guest: { windowMs: 60_000, maxRequests: 5 },
    authenticated: { windowMs: 60_000, maxRequests: 20 },
  },
  // Bookmarks - auth only, moderate limits
  bookmarks: {
    guest: { windowMs: 60_000, maxRequests: 0 }, // Not allowed
    authenticated: { windowMs: 60_000, maxRequests: 50 },
  },
  // Feedback - allow anonymous but limit
  feedback: {
    guest: { windowMs: 60_000, maxRequests: 10 },
    authenticated: { windowMs: 60_000, maxRequests: 30 },
  },
  // Default fallback
  default: {
    guest: { windowMs: 60_000, maxRequests: 60 },
    authenticated: { windowMs: 60_000, maxRequests: 120 },
  },
} as const;

export type RateLimitEndpoint = keyof typeof RATE_LIMITS;

// ============================================================================
// Upstash Redis Rate Limiter (Production)
// ============================================================================

let rateLimiters: Map<string, Ratelimit> | null = null;

function getRateLimiter(endpoint: RateLimitEndpoint, isAuthenticated: boolean): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  if (!rateLimiters) {
    rateLimiters = new Map();
  }

  const key = `${endpoint}:${isAuthenticated ? 'auth' : 'guest'}`;
  const existing = rateLimiters.get(key);
  if (existing) {
    return existing;
  }

  const config = RATE_LIMITS[endpoint] ?? RATE_LIMITS.default;
  const limits: RateLimitConfig = isAuthenticated ? config.authenticated : config.guest;

  // Create rate limiter with sliding window
  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(limits.maxRequests, `${limits.windowMs}ms`),
    prefix: `ratelimit:${key}`,
    analytics: true,
  });

  rateLimiters.set(key, limiter);
  return limiter;
}

// ============================================================================
// In-Memory Rate Limiter (Fallback for Development)
// ============================================================================

const inMemoryStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of inMemoryStore.entries()) {
        if (entry.resetAt < now) {
          inMemoryStore.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}

function checkInMemoryRateLimit(
  clientId: string,
  endpoint: RateLimitEndpoint,
  isAuthenticated: boolean
): { allowed: boolean; remaining: number; resetAt: number; limit: number } {
  const config = RATE_LIMITS[endpoint] ?? RATE_LIMITS.default;
  const limits: RateLimitConfig = isAuthenticated ? config.authenticated : config.guest;

  const key = `${clientId}:${endpoint}`;
  const now = Date.now();

  let entry = inMemoryStore.get(key);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + limits.windowMs,
    };
  }

  // Check if rate limited
  if (entry.count >= limits.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: limits.maxRequests,
    };
  }

  // Increment counter
  entry.count++;
  inMemoryStore.set(key, entry);

  return {
    allowed: true,
    remaining: limits.maxRequests - entry.count,
    resetAt: entry.resetAt,
    limit: limits.maxRequests,
  };
}

// ============================================================================
// Rate Limiting Functions
// ============================================================================

/**
 * Generate a simple hash for fingerprinting
 * Uses a basic string hash for performance (not cryptographic)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get client identifier for rate limiting
 *
 * SECURITY NOTE: This application MUST be deployed behind a trusted proxy
 * (e.g., Vercel, Cloudflare) that sets x-real-ip from the actual client IP.
 * Direct deployment without a proxy allows IP header spoofing.
 *
 * For unauthenticated users, we use IP + User-Agent fingerprinting to make
 * rate limit bypass harder (attacker must rotate both IP and User-Agent).
 */
export function getClientId(request: Request, userId?: string | null): string {
  // If authenticated, use user ID for accurate per-user limits (most secure)
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP address from trusted proxy headers
  // Priority: x-real-ip (Vercel) > x-forwarded-for > 'unknown'
  const realIP = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = realIP || forwarded?.split(',')[0]?.trim() || 'unknown';

  // Add User-Agent fingerprint for defense in depth
  // This makes bypass harder - attacker must rotate both IP and UA
  const userAgent = request.headers.get('user-agent') || '';
  const fingerprint = simpleHash(userAgent);

  return `ip:${ip}:${fingerprint}`;
}

/**
 * Check rate limit using Redis (production) or in-memory (development)
 */
async function checkRateLimit(
  clientId: string,
  endpoint: RateLimitEndpoint,
  isAuthenticated: boolean
): Promise<{ allowed: boolean; remaining: number; resetAt: number; limit: number }> {
  // Try Redis first
  const limiter = getRateLimiter(endpoint, isAuthenticated);

  if (limiter) {
    try {
      const result = await limiter.limit(clientId);
      const config = RATE_LIMITS[endpoint] ?? RATE_LIMITS.default;
      const limits = isAuthenticated ? config.authenticated : config.guest;

      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
        limit: limits.maxRequests,
      };
    } catch (error) {
      // Log but don't fail - fall back to in-memory
      console.error('[RateLimit] Redis error, falling back to in-memory:', error);
    }
  }

  // Fallback to in-memory
  return checkInMemoryRateLimit(clientId, endpoint, isAuthenticated);
}

/**
 * Create rate limit error response
 */
export function rateLimitResponse(
  resetAt: number,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  const meta: ResponseMeta = {
    timestamp: new Date().toISOString(),
    requestId: requestId ?? crypto.randomUUID(),
  };

  const response = NextResponse.json(
    {
      success: false as const,
      error: {
        code: 'RATE_LIMITED' as const,
        message: 'Too many requests. Please try again later.',
        details: {
          retryAfterSeconds: Math.max(1, retryAfter),
        },
      },
      meta,
    },
    { status: 429 }
  );

  // Add rate limit headers
  response.headers.set('Retry-After', String(Math.max(1, retryAfter)));
  response.headers.set('X-RateLimit-Limit', '0');
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));

  return response;
}

/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: { remaining: number; resetAt: number; limit: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
  return response;
}

// ============================================================================
// Middleware Helper
// ============================================================================

/**
 * Rate limit check that can be used at the start of API handlers
 * Returns error response if rate limited, null if allowed
 */
export async function withRateLimit(
  request: Request,
  endpoint: RateLimitEndpoint,
  userId?: string | null
): Promise<{ error: NextResponse<ApiErrorResponse> | null; headers: Record<string, string> }> {
  const clientId = getClientId(request, userId);
  const isAuthenticated = !!userId;

  const result = await checkRateLimit(clientId, endpoint, isAuthenticated);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    return {
      error: rateLimitResponse(result.resetAt),
      headers,
    };
  }

  return { error: null, headers };
}
