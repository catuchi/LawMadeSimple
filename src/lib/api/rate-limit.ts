// Rate Limiting for API Routes
// Simple in-memory rate limiter (replace with Redis for production scaling)

import { NextResponse } from 'next/server';
import type { ApiErrorResponse, ResponseMeta } from '@/types/api';

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ============================================================================
// In-Memory Store (replace with Redis for horizontal scaling)
// ============================================================================

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
          rateLimitStore.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
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
// Rate Limiting Functions
// ============================================================================

/**
 * Get client identifier for rate limiting
 * Uses IP address, falling back to a default for local development
 */
export function getClientId(request: Request, userId?: string | null): string {
  // If authenticated, use user ID for more accurate per-user limits
  if (userId) {
    return `user:${userId}`;
  }

  // Use IP address for anonymous users
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

  return `ip:${ip}`;
}

/**
 * Check rate limit for a client
 * Returns null if allowed, or error response if rate limited
 */
export function checkRateLimit(
  clientId: string,
  endpoint: RateLimitEndpoint,
  isAuthenticated: boolean
): { allowed: boolean; remaining: number; resetAt: number; limit: number } {
  const config = RATE_LIMITS[endpoint] ?? RATE_LIMITS.default;
  const limits: RateLimitConfig = isAuthenticated ? config.authenticated : config.guest;

  const key = `${clientId}:${endpoint}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

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
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limits.maxRequests - entry.count,
    resetAt: entry.resetAt,
    limit: limits.maxRequests,
  };
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
          retryAfterSeconds: retryAfter,
        },
      },
      meta,
    },
    { status: 429 }
  );

  // Add rate limit headers
  response.headers.set('Retry-After', String(retryAfter));
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

  const result = checkRateLimit(clientId, endpoint, isAuthenticated);

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
