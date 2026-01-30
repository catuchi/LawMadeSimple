-- Migration: Add indexes for embedding backfill queries
-- Run this in Supabase SQL Editor after deploying the schema
-- Date: 2026-01-30

-- ============================================================================
-- Partial indexes for finding content needing embedding
-- These are partial indexes that only include rows where the condition is true,
-- making them very efficient for the backfill queries.
-- ============================================================================

-- Index for finding sections needing embedding (null embedded_at)
CREATE INDEX IF NOT EXISTS idx_sections_pending_embedding
ON sections(id) WHERE embedded_at IS NULL;

-- Index for finding sections with null content_hash (needs re-embedding)
CREATE INDEX IF NOT EXISTS idx_sections_null_content_hash
ON sections(id) WHERE content_hash IS NULL;

-- Index for finding scenarios needing embedding (null embedded_at)
CREATE INDEX IF NOT EXISTS idx_scenarios_pending_embedding
ON scenarios(id) WHERE embedded_at IS NULL;

-- Index for finding scenarios with null content_hash (needs re-embedding)
CREATE INDEX IF NOT EXISTS idx_scenarios_null_content_hash
ON scenarios(id) WHERE content_hash IS NULL;

-- ============================================================================
-- Regular indexes for embedding metadata queries
-- Useful for admin dashboards and status checks
-- ============================================================================

-- Index on embedded_at for counting embedded items
CREATE INDEX IF NOT EXISTS idx_sections_embedded_at
ON sections(embedded_at);

CREATE INDEX IF NOT EXISTS idx_scenarios_embedded_at
ON scenarios(embedded_at);

-- Index on embedding_model for tracking which model was used
CREATE INDEX IF NOT EXISTS idx_sections_embedding_model
ON sections(embedding_model);

CREATE INDEX IF NOT EXISTS idx_scenarios_embedding_model
ON scenarios(embedding_model);

-- ============================================================================
-- Verify indexes were created
-- ============================================================================
-- Run this to verify:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('sections', 'scenarios') AND indexname LIKE 'idx_%';
