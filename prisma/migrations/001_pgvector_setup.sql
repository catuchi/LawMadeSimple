-- Migration: Enable pgvector and add embedding columns
-- Run this in Supabase SQL Editor (Database > SQL Editor)
-- Date: 2026-01-30

-- ============================================================================
-- Phase 1.1: Enable pgvector extension
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- Phase 1.2: Add embedding columns to sections table
-- ============================================================================
ALTER TABLE sections
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model text,
ADD COLUMN IF NOT EXISTS embedded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS content_hash text;

-- ============================================================================
-- Phase 1.2: Add embedding columns to scenarios table
-- ============================================================================
ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model text,
ADD COLUMN IF NOT EXISTS embedded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS content_hash text;

-- ============================================================================
-- Phase 1.2: Create HNSW indexes for fast similarity search
-- HNSW (Hierarchical Navigable Small World) provides fast approximate nearest neighbor search
-- Parameters:
--   m = 16: Number of bi-directional links per node (higher = more accurate, slower build)
--   ef_construction = 64: Size of dynamic candidate list during construction
-- ============================================================================

-- Index for sections (cosine similarity)
CREATE INDEX IF NOT EXISTS sections_embedding_idx
ON sections USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Index for scenarios (cosine similarity)
CREATE INDEX IF NOT EXISTS scenarios_embedding_idx
ON scenarios USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- Verification queries (run these to confirm setup)
-- ============================================================================

-- Check pgvector is enabled:
-- SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check columns were added to sections:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'sections' AND column_name IN ('embedding', 'embedding_model', 'embedded_at', 'content_hash');

-- Check columns were added to scenarios:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'scenarios' AND column_name IN ('embedding', 'embedding_model', 'embedded_at', 'content_hash');

-- Check indexes were created:
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('sections', 'scenarios') AND indexname LIKE '%embedding%';
