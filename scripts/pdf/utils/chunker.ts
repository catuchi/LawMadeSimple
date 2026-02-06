/**
 * Text Chunking Utility
 *
 * Splits large PDF text into manageable chunks for AI processing
 * while preserving section boundaries where possible.
 */

import { CHUNK_CONFIG } from '../config';

/**
 * A chunk of text with metadata
 */
export interface TextChunk {
  /** Chunk index (0-based) */
  index: number;

  /** The text content */
  text: string;

  /** Starting character position in original text */
  startChar: number;

  /** Ending character position in original text */
  endChar: number;

  /** Estimated page range (if detectable) */
  pageRange?: { start: number; end: number };

  /** Whether this chunk has overlap from previous */
  hasOverlapFromPrevious: boolean;

  /** Whether this chunk has overlap into next */
  hasOverlapIntoNext: boolean;
}

/**
 * Split text into overlapping chunks
 *
 * Uses intelligent boundary detection to avoid cutting sections mid-sentence.
 *
 * @param text - Full text to chunk
 * @param maxChunkSize - Maximum characters per chunk (default from config)
 * @param overlapSize - Characters of overlap between chunks (default from config)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  maxChunkSize: number = CHUNK_CONFIG.maxChunkSize,
  overlapSize: number = CHUNK_CONFIG.overlapSize
): TextChunk[] {
  // If text fits in one chunk, return it as-is
  if (text.length <= maxChunkSize) {
    return [
      {
        index: 0,
        text,
        startChar: 0,
        endChar: text.length,
        hasOverlapFromPrevious: false,
        hasOverlapIntoNext: false,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentPosition = 0;

  while (currentPosition < text.length) {
    // Calculate end position for this chunk
    let endPosition = Math.min(currentPosition + maxChunkSize, text.length);

    // If not at the end, find a good break point
    if (endPosition < text.length) {
      endPosition = findGoodBreakPoint(text, endPosition, maxChunkSize);
    }

    // Extract chunk text
    const chunkText = text.slice(currentPosition, endPosition);

    // Create chunk
    chunks.push({
      index: chunks.length,
      text: chunkText,
      startChar: currentPosition,
      endChar: endPosition,
      hasOverlapFromPrevious: currentPosition > 0,
      hasOverlapIntoNext: endPosition < text.length,
    });

    // Move position, accounting for overlap
    currentPosition = endPosition - overlapSize;

    // Ensure we're making progress
    if (currentPosition <= chunks[chunks.length - 1].startChar) {
      currentPosition = endPosition;
    }
  }

  return chunks;
}

/**
 * Find a good break point near the target position
 *
 * Looks for section boundaries, paragraphs, or sentence endings.
 *
 * @param text - Full text
 * @param targetPosition - Where we'd like to break
 * @param maxChunkSize - Maximum chunk size (for search range)
 * @returns Best position to break at
 */
function findGoodBreakPoint(text: string, targetPosition: number, maxChunkSize: number): number {
  // Search window: look back up to 10% of chunk size
  const searchWindow = Math.min(5000, Math.floor(maxChunkSize * 0.1));
  const searchStart = Math.max(0, targetPosition - searchWindow);
  const searchText = text.slice(searchStart, targetPosition);

  // Priority 1: Look for section headers (e.g., "Section 33", "PART II")
  const sectionPattern = /\n(?=(?:Section|SECTION|PART|Part|Chapter|CHAPTER)\s+\d)/g;
  const sectionMatches = [...searchText.matchAll(sectionPattern)];
  if (sectionMatches.length > 0) {
    const lastMatch = sectionMatches[sectionMatches.length - 1];
    return searchStart + (lastMatch.index ?? 0);
  }

  // Priority 2: Look for numbered items (e.g., "(1)", "(a)", "1.")
  const numberedPattern = /\n(?=\(\d+\)|\([a-z]\)|^\d+\.)/gm;
  const numberedMatches = [...searchText.matchAll(numberedPattern)];
  if (numberedMatches.length > 0) {
    const lastMatch = numberedMatches[numberedMatches.length - 1];
    return searchStart + (lastMatch.index ?? 0);
  }

  // Priority 3: Look for paragraph breaks (double newline)
  const paragraphPattern = /\n\n/g;
  const paragraphMatches = [...searchText.matchAll(paragraphPattern)];
  if (paragraphMatches.length > 0) {
    const lastMatch = paragraphMatches[paragraphMatches.length - 1];
    return searchStart + (lastMatch.index ?? 0) + 2; // After the newlines
  }

  // Priority 4: Look for sentence endings
  const sentencePattern = /[.!?]\s/g;
  const sentenceMatches = [...searchText.matchAll(sentencePattern)];
  if (sentenceMatches.length > 0) {
    const lastMatch = sentenceMatches[sentenceMatches.length - 1];
    return searchStart + (lastMatch.index ?? 0) + 2; // After period and space
  }

  // Fallback: Just use the target position
  return targetPosition;
}

/**
 * Estimate page numbers for a chunk
 *
 * Uses heuristic based on average characters per page.
 *
 * @param chunk - The text chunk
 * @param totalChars - Total characters in document
 * @param totalPages - Total pages in document
 * @returns Estimated page range
 */
export function estimatePageRange(
  chunk: TextChunk,
  totalChars: number,
  totalPages: number
): { start: number; end: number } {
  const charsPerPage = totalChars / totalPages;

  const startPage = Math.floor(chunk.startChar / charsPerPage) + 1;
  const endPage = Math.ceil(chunk.endChar / charsPerPage);

  return {
    start: Math.max(1, startPage),
    end: Math.min(totalPages, endPage),
  };
}

/**
 * Check if text needs chunking
 */
export function needsChunking(
  text: string,
  maxChunkSize: number = CHUNK_CONFIG.maxChunkSize
): boolean {
  return text.length > maxChunkSize;
}

/**
 * Get chunk statistics
 */
export function getChunkStats(chunks: TextChunk[]): {
  count: number;
  totalChars: number;
  avgChunkSize: number;
  minChunkSize: number;
  maxChunkSize: number;
} {
  if (chunks.length === 0) {
    return {
      count: 0,
      totalChars: 0,
      avgChunkSize: 0,
      minChunkSize: 0,
      maxChunkSize: 0,
    };
  }

  const sizes = chunks.map((c) => c.text.length);
  const totalChars = sizes.reduce((sum, size) => sum + size, 0);

  return {
    count: chunks.length,
    totalChars,
    avgChunkSize: Math.round(totalChars / chunks.length),
    minChunkSize: Math.min(...sizes),
    maxChunkSize: Math.max(...sizes),
  };
}
