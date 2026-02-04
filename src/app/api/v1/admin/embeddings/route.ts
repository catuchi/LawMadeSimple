// GET /api/v1/admin/embeddings - Embedding system status and health check
// Auth: Admin only (email allowlist via ADMIN_EMAILS env var)

import { success, unauthorized, handleError } from '@/lib/api';
import { requireAdmin, AuthError } from '@/lib/api/auth';
import { getEmbeddingStats, validateEmbeddingConfig } from '@/services/embedding/embedding.service';
import { EMBEDDING_CONFIG } from '@/constants/embeddings';

export async function GET() {
  try {
    // Require admin access (checks ADMIN_EMAILS env var)
    try {
      await requireAdmin();
    } catch (error) {
      if (error instanceof AuthError) {
        return unauthorized(error.message);
      }
      throw error;
    }

    // Get embedding configuration validity
    const configValidation = validateEmbeddingConfig();

    // Get embedding statistics
    const stats = await getEmbeddingStats();

    // Calculate overall health status
    const totalPending = stats.sections.pending + stats.scenarios.pending;
    const totalItems = stats.sections.total + stats.scenarios.total;

    let status: 'healthy' | 'degraded' | 'error';
    if (!configValidation.valid) {
      status = 'error';
    } else if (totalItems > 0 && totalPending / totalItems > 0.5) {
      // More than 50% pending = degraded
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return success({
      status,
      config: {
        model: EMBEDDING_CONFIG.model,
        dimensions: EMBEDDING_CONFIG.dimensions,
        similarityThreshold: EMBEDDING_CONFIG.defaultSimilarityThreshold,
        maxBatchSize: EMBEDDING_CONFIG.maxBatchSize,
        rrfK: EMBEDDING_CONFIG.rrfK,
        semanticWeight: EMBEDDING_CONFIG.defaultSemanticWeight,
        valid: configValidation.valid,
        error: configValidation.error,
      },
      statistics: {
        sections: {
          total: stats.sections.total,
          embedded: stats.sections.embedded,
          pending: stats.sections.pending,
          percentComplete:
            stats.sections.total > 0
              ? Math.round((stats.sections.embedded / stats.sections.total) * 100)
              : 100,
        },
        scenarios: {
          total: stats.scenarios.total,
          embedded: stats.scenarios.embedded,
          pending: stats.scenarios.pending,
          percentComplete:
            stats.scenarios.total > 0
              ? Math.round((stats.scenarios.embedded / stats.scenarios.total) * 100)
              : 100,
        },
        overall: {
          total: totalItems,
          embedded: stats.sections.embedded + stats.scenarios.embedded,
          pending: totalPending,
          percentComplete:
            totalItems > 0
              ? Math.round(
                  ((stats.sections.embedded + stats.scenarios.embedded) / totalItems) * 100
                )
              : 100,
        },
      },
      instructions: {
        backfillCommand:
          'DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts',
        dryRunCommand:
          'DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts --dry-run',
        statsCommand:
          'DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts --stats',
      },
    });
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/admin/embeddings' });
  }
}
