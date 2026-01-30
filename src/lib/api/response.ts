// API Response Utilities
// Standardized response format per docs/pre-dev/18-api-specifications.md

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
  ErrorCode,
  PaginationMeta,
  ResponseMeta,
} from '@/types/api';

// ============================================================================
// Response Meta
// ============================================================================

function createMeta(requestId?: string): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    requestId: requestId ?? randomUUID(),
  };
}

// ============================================================================
// Success Responses
// ============================================================================

export function success<T>(data: T, requestId?: string): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: createMeta(requestId),
    },
    { status: 200 }
  );
}

export function created<T>(data: T, requestId?: string): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: createMeta(requestId),
    },
    { status: 201 }
  );
}

export function paginated<T, E extends Record<string, unknown> = Record<string, never>>(
  data: T[],
  pagination: PaginationMeta,
  extra?: E,
  requestId?: string
): NextResponse<ApiPaginatedResponse<T> & { extra?: E }> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: createMeta(requestId),
      pagination,
      ...(extra && Object.keys(extra).length > 0 ? { extra } : {}),
    },
    { status: 200 }
  );
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================================================
// Error Responses
// ============================================================================

interface ErrorOptions {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  status: number;
  requestId?: string;
}

function errorResponse(options: ErrorOptions): NextResponse<ApiErrorResponse> {
  const { code, message, details, status, requestId } = options;
  return NextResponse.json(
    {
      success: false as const,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: createMeta(requestId),
    },
    { status }
  );
}

export function badRequest(
  message: string,
  details?: Record<string, unknown>,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'VALIDATION_ERROR',
    message,
    details,
    status: 400,
    requestId,
  });
}

export function unauthorized(
  message = 'Authentication required',
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'UNAUTHORIZED',
    message,
    status: 401,
    requestId,
  });
}

export function forbidden(
  message = 'You do not have permission to access this resource',
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'FORBIDDEN',
    message,
    status: 403,
    requestId,
  });
}

export function notFound(
  resource: string,
  details?: Record<string, unknown>,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'NOT_FOUND',
    message: `The requested ${resource} could not be found`,
    details,
    status: 404,
    requestId,
  });
}

export function conflict(
  message: string,
  details?: Record<string, unknown>,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'CONFLICT',
    message,
    details,
    status: 409,
    requestId,
  });
}

export function rateLimited(
  message = 'Too many requests. Please try again later.',
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'RATE_LIMITED',
    message,
    status: 429,
    requestId,
  });
}

export function internalError(
  message = 'An unexpected error occurred',
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'INTERNAL_ERROR',
    message,
    status: 500,
    requestId,
  });
}

export function aiUnavailable(
  message = 'AI service temporarily unavailable. Please try again later.',
  requestId?: string
): NextResponse<ApiErrorResponse> {
  return errorResponse({
    code: 'AI_UNAVAILABLE',
    message,
    status: 503,
    requestId,
  });
}

// ============================================================================
// Pagination Helpers
// ============================================================================

export function calculatePagination(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { page: number; limit: number; maxLimit: number } = {
    page: 1,
    limit: 20,
    maxLimit: 100,
  }
): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? String(defaults.page), 10));
  const rawLimit = parseInt(searchParams.get('limit') ?? String(defaults.limit), 10);
  const limit = Math.min(Math.max(1, rawLimit), defaults.maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
