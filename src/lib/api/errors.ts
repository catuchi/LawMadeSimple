// Centralized Error Handling for API Routes
// Provides safe error classification, logging, and responses

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import type { ApiErrorResponse } from '@/types/api';
import { badRequest, unauthorized, notFound, conflict, internalError } from './response';
import { AuthError } from './auth';
import { formatZodErrors } from './validation';

// ============================================================================
// Error Classification
// ============================================================================

/**
 * API Error class for known application errors.
 * Use this when you want to throw an error that should return a specific HTTP status.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You do not have permission to access this resource'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(404, 'NOT_FOUND', `The requested ${resource} could not be found`, details);
  }

  static conflict(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(409, 'CONFLICT', message, details);
  }

  static rateLimited(message = 'Too many requests. Please try again later.'): ApiError {
    return new ApiError(429, 'RATE_LIMITED', message);
  }
}

// ============================================================================
// Safe Error Logging
// ============================================================================

interface SafeLogContext {
  endpoint?: string;
  method?: string;
  userId?: string | null;
  requestId?: string;
}

/**
 * Safely log an error without exposing sensitive information.
 * In production, only logs error type and message.
 * In development, logs full error for debugging.
 */
export function logError(error: unknown, context: SafeLogContext = {}): void {
  const isDev = process.env.NODE_ENV === 'development';
  const errorInfo = classifyError(error);

  const logData = {
    timestamp: new Date().toISOString(),
    ...context,
    error: {
      type: errorInfo.type,
      message: errorInfo.message,
      code: errorInfo.code,
      // Only include stack in development
      ...(isDev && error instanceof Error && { stack: error.stack }),
      // Include Prisma error details in dev
      ...(isDev && errorInfo.prismaCode && { prismaCode: errorInfo.prismaCode }),
    },
  };

  // Use console.error for errors, but format nicely
  if (isDev) {
    console.error('[API Error]', JSON.stringify(logData, null, 2));
  } else {
    // In production, log structured JSON for log aggregation
    console.error(JSON.stringify(logData));
  }
}

// ============================================================================
// Error Classification
// ============================================================================

interface ClassifiedError {
  type: string;
  message: string;
  code?: string;
  prismaCode?: string;
  details?: Record<string, unknown>;
}

function classifyError(error: unknown): ClassifiedError {
  // Known API errors
  if (error instanceof ApiError) {
    return {
      type: 'ApiError',
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  // Auth errors
  if (error instanceof AuthError) {
    return {
      type: 'AuthError',
      message: error.message,
      code: 'UNAUTHORIZED',
    };
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      type: 'ValidationError',
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      details: formatZodErrors(error),
    };
  }

  // Prisma errors - need to classify these carefully
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return classifyPrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      type: 'PrismaValidationError',
      message: 'Invalid database query',
      code: 'VALIDATION_ERROR',
      prismaCode: 'VALIDATION',
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      type: 'DatabaseConnectionError',
      message: 'Database connection failed',
      code: 'INTERNAL_ERROR',
    };
  }

  // JSON parse errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return {
      type: 'JsonParseError',
      message: 'Invalid JSON in request body',
      code: 'VALIDATION_ERROR',
    };
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      type: error.name || 'Error',
      message: error.message,
      code: 'INTERNAL_ERROR',
    };
  }

  // Unknown errors
  return {
    type: 'UnknownError',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
  };
}

function classifyPrismaError(error: Prisma.PrismaClientKnownRequestError): ClassifiedError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = (error.meta?.target as string[])?.join(', ') || 'field';
      return {
        type: 'UniqueConstraintViolation',
        message: `A record with this ${target} already exists`,
        code: 'CONFLICT',
        prismaCode: error.code,
        details: { field: target },
      };

    case 'P2025':
      // Record not found
      return {
        type: 'RecordNotFound',
        message: 'The requested record was not found',
        code: 'NOT_FOUND',
        prismaCode: error.code,
      };

    case 'P2003':
      // Foreign key constraint violation
      return {
        type: 'ForeignKeyViolation',
        message: 'Referenced record does not exist',
        code: 'VALIDATION_ERROR',
        prismaCode: error.code,
      };

    case 'P2014':
      // Required relation violation
      return {
        type: 'RequiredRelationViolation',
        message: 'Required related record is missing',
        code: 'VALIDATION_ERROR',
        prismaCode: error.code,
      };

    default:
      return {
        type: 'PrismaError',
        message: 'A database error occurred',
        code: 'INTERNAL_ERROR',
        prismaCode: error.code,
      };
  }
}

// ============================================================================
// Error Response Handler
// ============================================================================

/**
 * Convert any error into an appropriate API response.
 * Use this in catch blocks to ensure consistent error responses.
 */
export function handleError(
  error: unknown,
  context: SafeLogContext = {}
): NextResponse<ApiErrorResponse> {
  // Log the error safely
  logError(error, context);

  // Return appropriate response based on error type
  if (error instanceof ApiError) {
    return errorToResponse(error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof AuthError) {
    return unauthorized(error.message);
  }

  if (error instanceof ZodError) {
    return badRequest('Invalid input data', formatZodErrors(error));
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const classified = classifyPrismaError(error);
    switch (classified.code) {
      case 'CONFLICT':
        return conflict(classified.message, classified.details);
      case 'NOT_FOUND':
        return notFound('record', classified.details);
      case 'VALIDATION_ERROR':
        return badRequest(classified.message, classified.details);
      default:
        return internalError();
    }
  }

  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return badRequest('Invalid JSON in request body');
  }

  // For all other errors, return generic internal error
  // (we don't expose internal error details to clients)
  return internalError();
}

function errorToResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  switch (statusCode) {
    case 400:
      return badRequest(message, details);
    case 401:
      return unauthorized(message);
    case 404:
      return notFound(message.replace('The requested ', '').replace(' could not be found', ''));
    case 409:
      return conflict(message, details);
    default:
      return internalError(message);
  }
}

// ============================================================================
// Safe JSON Parser
// ============================================================================

/**
 * Safely parse JSON from request body.
 * Returns null if parsing fails instead of throwing.
 */
export async function safeParseJson<T = unknown>(
  request: Request
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const data = (await request.json()) as T;
    return { data, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON in request body' };
  }
}
