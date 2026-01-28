// GET /api/v1/explanations/[contentType]/[contentId] - Get cached explanation
// Auth: Optional

import { success, notFound, badRequest, withRateLimit } from '@/lib/api';
import { handleError } from '@/lib/api/errors';
import { getCurrentUser } from '@/lib/api/auth';
import {
  getCachedExplanation,
  fetchContent,
  buildExplanationSource,
  formatExplanationData,
} from '@/services/explanation/explanation.service';
import type { ExplanationContentType, ExplanationExample } from '@/types/api';

// ============================================================================
// Route Handler
// ============================================================================

interface RouteParams {
  params: Promise<{ contentType: string; contentId: string }>;
}

const VALID_CONTENT_TYPES = ['section', 'article', 'scenario'] as const;

function isValidContentType(type: string): type is ExplanationContentType {
  return VALID_CONTENT_TYPES.includes(type as ExplanationContentType);
}

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'explanations', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { contentType, contentId } = await params;

    // Validate content type
    if (!isValidContentType(contentType)) {
      return badRequest(`Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`, {
        contentType,
        validTypes: VALID_CONTENT_TYPES,
      });
    }

    // Validate content ID format
    if (!isValidUUID(contentId)) {
      return badRequest('Invalid content ID format. Must be a valid UUID.', { contentId });
    }

    // Check if content exists
    const content = await fetchContent(contentType, contentId);
    if (!content) {
      return notFound(contentType, { contentId });
    }

    // Get cached explanation
    const cached = await getCachedExplanation(contentType, contentId);
    if (!cached) {
      return notFound('explanation', {
        message:
          'No cached explanation found. Use POST /api/v1/explanations/stream to generate one.',
        contentType,
        contentId,
      });
    }

    // Build response
    const source = buildExplanationSource(content);
    const explanation = formatExplanationData(
      cached.id,
      contentType,
      contentId,
      cached.explanationText,
      (cached.examples as ExplanationExample[]) || [],
      source,
      true,
      cached.createdAt
    );

    const response = success(explanation);

    // Add rate limit headers
    Object.entries(rateLimitCheck.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return handleError(error, {
      endpoint: 'GET /api/v1/explanations/[contentType]/[contentId]',
    });
  }
}
