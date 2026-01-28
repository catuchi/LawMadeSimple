// POST /api/v1/feedback - Submit feedback on explanation
// Auth: Optional (anonymous allowed)

import { prisma } from '@/lib/db';
import {
  created,
  badRequest,
  formatZodErrors,
  createFeedbackSchema,
  withRateLimit,
  handleError,
  safeParseJson,
} from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { FeedbackResponse } from '@/types/api';
import type { FeedbackType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // Get current user (optional)
    const { userId } = await getCurrentUser();

    // Rate limiting
    const rateLimitCheck = await withRateLimit(request, 'feedback', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    // Parse and validate request body
    const { data: body, error: jsonError } = await safeParseJson(request);
    if (jsonError) {
      return badRequest(jsonError);
    }

    const parsed = createFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Invalid request body', formatZodErrors(parsed.error));
    }

    const { explanationId, rating, feedbackType, comment } = parsed.data;

    // Verify explanation exists
    const explanation = await prisma.explanation.findUnique({
      where: { id: explanationId },
    });

    if (!explanation) {
      return badRequest('Explanation not found', { explanationId });
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        explanationId,
        rating,
        feedbackType: feedbackType as FeedbackType | undefined,
        comment,
      },
    });

    const data: FeedbackResponse = {
      id: feedback.id,
      message: 'Thank you for your feedback!',
    };

    return created(data);
  } catch (error) {
    return handleError(error, { endpoint: 'POST /api/v1/feedback' });
  }
}
