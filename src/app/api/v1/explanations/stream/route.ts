// POST /api/v1/explanations/stream - Generate explanation with streaming
// Auth: Optional (rate limited for guests)

import { z } from 'zod';
import { badRequest, notFound, aiUnavailable, withRateLimit } from '@/lib/api';
import { handleError, safeParseJson, logError } from '@/lib/api/errors';
import { getCurrentUser } from '@/lib/api/auth';
import { estimateTokens } from '@/lib/openai';
import { acquireLock, isLocked } from '@/lib/redis';
import { STANDARD_DISCLAIMER } from '@/constants/prompts';
import {
  generateExplanationStream,
  getCachedExplanation,
  saveExplanation,
  fetchContent,
  buildExplanationSource,
  extractExamples,
  formatExplanationData,
} from '@/services/explanation/explanation.service';
import {
  checkUsageLimit,
  recordExplanationUsage,
  checkGuestUsageLimit,
  recordGuestUsage,
} from '@/services/subscription/subscription.service';
import type { ExplanationContentType, ExplanationExample, StreamEvent } from '@/types/api';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get client IP address from request headers
 * Uses x-forwarded-for in production (behind proxy) or x-real-ip
 */
function getClientIP(request: Request): string {
  // Vercel provides x-real-ip which is more reliable
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  // Fallback to x-forwarded-for (first IP in chain)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return 'unknown';
}

// ============================================================================
// Request Validation
// ============================================================================

const GenerateExplanationSchema = z.object({
  contentType: z.enum(['section', 'article', 'scenario']),
  contentId: z.string().uuid('Invalid content ID format'),
  forceRegenerate: z.boolean().optional().default(false),
});

// ============================================================================
// SSE Helpers
// ============================================================================

function formatSSE(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function createSSEStream(): {
  stream: ReadableStream<Uint8Array>;
  enqueue: (data: string) => void;
  close: () => void;
} {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      controller = ctrl;
    },
  });

  return {
    stream,
    enqueue: (data: string) => controller.enqueue(encoder.encode(data)),
    close: () => controller.close(),
  };
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: Request) {
  try {
    // Get current user (optional auth)
    const { userId } = await getCurrentUser();

    // Rate limiting - stricter for AI endpoints
    const rateLimitCheck = await withRateLimit(request, 'explanations', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    // Parse and validate request body
    const parseResult = await safeParseJson(request);
    if (parseResult.error) {
      return badRequest(parseResult.error);
    }

    const validationResult = GenerateExplanationSchema.safeParse(parseResult.data);
    if (!validationResult.success) {
      return badRequest('Invalid request body', {
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const { contentType, contentId, forceRegenerate } = validationResult.data;

    // Get client IP for guest tracking
    const clientIP = getClientIP(request);

    // Check usage limits
    if (userId) {
      // Authenticated user limits
      const usageCheck = await checkUsageLimit(userId, 'explanation_generated');
      if (!usageCheck.allowed) {
        return badRequest(
          'Daily explanation limit reached. Upgrade to premium for unlimited access.',
          {
            limit: usageCheck.limit,
            used: usageCheck.used,
            resetAt: usageCheck.resetAt.toISOString(),
          }
        );
      }
    } else {
      // Guest user limits (more restrictive)
      const guestCheck = await checkGuestUsageLimit(clientIP, 'explanation_generated');
      if (!guestCheck.allowed) {
        return badRequest('Daily limit reached for guest users. Sign in for more explanations.', {
          limit: guestCheck.limit,
          used: guestCheck.used,
          resetAt: guestCheck.resetAt.toISOString(),
          hint: 'Create a free account to get 5 explanations per day.',
        });
      }
    }

    // Check if content exists
    const content = await fetchContent(contentType as ExplanationContentType, contentId);
    if (!content) {
      return notFound(`${contentType}`, { contentId });
    }

    // Check cache first (unless force regenerate)
    if (!forceRegenerate) {
      const cached = await getCachedExplanation(
        contentType as ExplanationContentType,
        contentId,
        content.content
      );
      if (cached) {
        // Return cached result as SSE stream (immediate completion)
        const { stream, enqueue, close } = createSSEStream();

        // Send events asynchronously
        (async () => {
          try {
            // Start event
            enqueue(formatSSE({ type: 'start', id: cached.id }));

            // Send full content as single chunk
            enqueue(formatSSE({ type: 'chunk', content: cached.explanationText }));

            // Done event with full explanation data
            const source = buildExplanationSource(content);
            const examples = Array.isArray(cached.examples)
              ? (cached.examples as ExplanationExample[])
              : [];
            const explanation = formatExplanationData(
              cached.id,
              contentType as ExplanationContentType,
              contentId,
              cached.explanationText,
              examples,
              source,
              true,
              cached.createdAt
            );
            enqueue(formatSSE({ type: 'done', explanation }));

            close();
          } catch {
            // Ignore write errors (client may have disconnected)
          }
        })();

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            ...rateLimitCheck.headers,
          },
        });
      }
    }

    // Acquire distributed lock to prevent duplicate AI generations
    // This prevents race conditions where multiple requests generate the same explanation
    const lockKey = `explanation:${contentType}:${contentId}`;

    // Quick check if generation is already in progress
    if (await isLocked(lockKey)) {
      // Another request is generating - wait briefly and check cache again
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const cachedAfterWait = await getCachedExplanation(
        contentType as ExplanationContentType,
        contentId,
        content.content
      );
      if (cachedAfterWait) {
        // Cached result appeared - return it
        const { stream, enqueue, close } = createSSEStream();
        (async () => {
          try {
            enqueue(formatSSE({ type: 'start', id: cachedAfterWait.id }));
            enqueue(formatSSE({ type: 'chunk', content: cachedAfterWait.explanationText }));
            const source = buildExplanationSource(content);
            const examples = Array.isArray(cachedAfterWait.examples)
              ? (cachedAfterWait.examples as ExplanationExample[])
              : [];
            const explanation = formatExplanationData(
              cachedAfterWait.id,
              contentType as ExplanationContentType,
              contentId,
              cachedAfterWait.explanationText,
              examples,
              source,
              true,
              cachedAfterWait.createdAt
            );
            enqueue(formatSSE({ type: 'done', explanation }));
            close();
          } catch {
            // Ignore errors
          }
        })();
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            ...rateLimitCheck.headers,
          },
        });
      }
    }

    // Acquire lock for generation
    const lock = await acquireLock(lockKey, { ttlSeconds: 120, waitTimeoutMs: 10000 });

    // Double-check cache after acquiring lock (another request may have finished)
    if (lock.acquired && !forceRegenerate) {
      const cachedAfterLock = await getCachedExplanation(
        contentType as ExplanationContentType,
        contentId,
        content.content
      );
      if (cachedAfterLock) {
        await lock.release();
        const { stream, enqueue, close } = createSSEStream();
        (async () => {
          try {
            enqueue(formatSSE({ type: 'start', id: cachedAfterLock.id }));
            enqueue(formatSSE({ type: 'chunk', content: cachedAfterLock.explanationText }));
            const source = buildExplanationSource(content);
            const examples = Array.isArray(cachedAfterLock.examples)
              ? (cachedAfterLock.examples as ExplanationExample[])
              : [];
            const explanation = formatExplanationData(
              cachedAfterLock.id,
              contentType as ExplanationContentType,
              contentId,
              cachedAfterLock.explanationText,
              examples,
              source,
              true,
              cachedAfterLock.createdAt
            );
            enqueue(formatSSE({ type: 'done', explanation }));
            close();
          } catch {
            // Ignore errors
          }
        })();
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            ...rateLimitCheck.headers,
          },
        });
      }
    }

    // Generate new explanation with streaming
    let generationStream;
    try {
      generationStream = await generateExplanationStream(
        contentType as ExplanationContentType,
        contentId
      );
    } catch (error) {
      // Release lock on error
      await lock.release();
      logError(error, { endpoint: 'POST /api/v1/explanations/stream' });
      return aiUnavailable();
    }

    const { stream: aiStream, content: contentData, model } = generationStream;

    // Create SSE stream for response
    const { stream, enqueue, close } = createSSEStream();

    // Generate a temporary ID for the stream
    const tempId = crypto.randomUUID();

    // Process the AI stream asynchronously
    (async () => {
      let fullText = '';

      try {
        // Send start event
        enqueue(formatSSE({ type: 'start', id: tempId }));

        // Stream chunks from AI
        const result = aiStream;
        for await (const chunk of result.textStream) {
          fullText += chunk;
          enqueue(formatSSE({ type: 'chunk', content: chunk }));
        }

        // Add disclaimer
        const disclaimer = STANDARD_DISCLAIMER;
        fullText += disclaimer;
        enqueue(formatSSE({ type: 'chunk', content: disclaimer }));

        // Extract examples from the generated text
        const examples = extractExamples(fullText);

        // Save to cache
        const tokenCount = estimateTokens(fullText);
        const explanationId = await saveExplanation(
          contentType as ExplanationContentType,
          contentId,
          contentData.content,
          fullText,
          examples,
          model,
          tokenCount
        );

        // Record usage
        if (userId) {
          await recordExplanationUsage(userId, contentId, model, tokenCount);
        } else {
          // Record guest usage for daily limit tracking
          await recordGuestUsage(clientIP, 'explanation_generated');
        }

        // Build final explanation data
        const source = buildExplanationSource(contentData);
        const explanation = formatExplanationData(
          explanationId,
          contentType as ExplanationContentType,
          contentId,
          fullText,
          examples,
          source,
          false,
          new Date()
        );

        // Send done event
        enqueue(formatSSE({ type: 'done', explanation }));
      } catch (error) {
        // Send error event
        const errorMessage = error instanceof Error ? error.message : 'AI generation failed';
        enqueue(
          formatSSE({
            type: 'error',
            code: 'AI_UNAVAILABLE',
            message: errorMessage,
          })
        );
      } finally {
        // Release the distributed lock
        await lock.release();
        try {
          close();
        } catch {
          // Ignore close errors
        }
      }
    })();

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...rateLimitCheck.headers,
      },
    });
  } catch (error) {
    return handleError(error, { endpoint: 'POST /api/v1/explanations/stream' });
  }
}
