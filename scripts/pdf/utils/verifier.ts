/**
 * PDF Extraction Verification Utility
 *
 * Verifies that extracted content matches the source PDF by:
 * 1. Anchor Verification: Extract unique phrases from sections and verify they exist in raw PDF text
 * 2. Section Count Validation: Regex-count section patterns in PDF and compare against extracted count
 *
 * This helps detect:
 * - Hallucinated content (AI invented text not in the PDF)
 * - Paraphrasing (AI reworded instead of extracting verbatim)
 * - Missing sections (AI skipped sections)
 * - Corrupted boundaries (AI merged or split sections incorrectly)
 */

import type { ExtractedSection } from '../../../prisma/data/raw/schema';

/**
 * Result of searching for a single anchor phrase
 */
export interface AnchorResult {
  /** The anchor phrase searched for (truncated for display) */
  phrase: string;
  /** Whether the anchor was found in the PDF text */
  found: boolean;
  /** Character position where anchor was found (if found) */
  position?: number;
}

/**
 * Verification result for a single section
 */
export interface SectionVerification {
  /** Section number (e.g., "33", "33(1)(a)") */
  sectionNumber: string;
  /** Verification status */
  status: 'verified' | 'partial' | 'not_found';
  /** Number of anchors checked */
  anchorsChecked: number;
  /** Number of anchors found in PDF */
  anchorsFound: number;
  /** Individual anchor results */
  anchors: AnchorResult[];
}

/**
 * Result of section count comparison
 */
export interface SectionCountResult {
  /** Number of sections detected in PDF via regex */
  pdfSectionCount: number;
  /** Number of sections in extracted JSON */
  extractedSectionCount: number;
  /** Difference (positive = missing, negative = extra) */
  missing: number;
  /** Whether counts match within tolerance */
  status: 'match' | 'mismatch';
}

/**
 * Complete verification report
 */
export interface VerificationReport {
  /** Section count comparison */
  sectionCount: SectionCountResult;
  /** Per-section verification results */
  sections: SectionVerification[];
  /** Overall verification status */
  overallStatus: 'pass' | 'review' | 'fail';
  /** Human-readable summary */
  summary: string;
}

/**
 * Verification data saved to JSON quality field
 */
export interface VerificationData {
  sectionCount: {
    pdfCount: number;
    extractedCount: number;
    status: 'match' | 'mismatch';
  };
  anchorsVerified: number;
  anchorsPartial: number;
  anchorsNotFound: number;
  notFoundSections: string[];
  overallStatus: 'pass' | 'review' | 'fail';
}

/**
 * Common legal boilerplate phrases to avoid as anchors
 */
const BOILERPLATE_PHRASES = [
  'notwithstanding the provisions of',
  'subject to the provisions of',
  'in accordance with',
  'for the purposes of',
  'under this act',
  'under this section',
  'pursuant to',
  'without prejudice to',
  'save as otherwise provided',
  'as may be prescribed',
  'as the case may be',
  'from time to time',
];

/**
 * Normalize text for comparison
 * - Lowercase
 * - Remove spaces inside words (PDF line-break artifacts like "ind ividual")
 * - Remove spaces before punctuation (PDF artifacts like "Act .")
 * - Normalize spaces around hyphens (PDF artifacts like "non - resident")
 * - Collapse remaining whitespace
 * - Normalize quotes and dashes
 * - Trim
 */
function normalize(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[\u2018\u2019\u201c\u201d]/g, '"') // Smart quotes to standard
      .replace(/[\u2013\u2014]/g, '-') // En/em dashes to hyphen
      // Normalize spaces around hyphens: "non - resident" -> "non-resident"
      .replace(/\s*-\s*/g, '-')
      // Remove spaces inside words (PDF line-break artifacts)
      // Match: lowercase letter + space(s) + lowercase letter
      .replace(/([a-z])\s+([a-z])/g, '$1$2')
      // Run twice to catch overlapping patterns like "a b c" -> "abc"
      .replace(/([a-z])\s+([a-z])/g, '$1$2')
      // Remove spaces before punctuation: "Act ." -> "Act."
      .replace(/\s+([.,;:!?)])/g, '$1')
      // Remove spaces after opening punctuation: "( 1)" -> "(1)"
      .replace(/([[(])\s+/g, '$1')
      .replace(/\s+/g, ' ') // Collapse remaining whitespace
      .trim()
  );
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Split on period, question mark, or exclamation followed by space or end
  // Keep the delimiter with the sentence
  const sentences: string[] = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    current += text[i];

    if (
      (text[i] === '.' || text[i] === '?' || text[i] === '!') &&
      (i === text.length - 1 || /\s/.test(text[i + 1]))
    ) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        sentences.push(trimmed);
      }
      current = '';
    }
  }

  // Add remaining text
  const remaining = current.trim();
  if (remaining.length > 0) {
    sentences.push(remaining);
  }

  return sentences;
}

/**
 * Count words in a string
 */
function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Score sentence uniqueness for anchor selection
 * Higher score = more unique/distinctive
 */
function scoreUniqueness(sentence: string): number {
  let score = 0;
  const lower = sentence.toLowerCase();

  // Prefer sentences with numbers
  if (/\d+/.test(sentence)) score += 2;

  // Prefer sentences with proper nouns (capitalized words not at start)
  const words = sentence.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    if (words[i].length > 2 && /^[A-Z]/.test(words[i])) {
      score += 1;
    }
  }

  // Prefer sentences with specific legal terms
  const specificTerms = [
    'naira',
    'court',
    'tribunal',
    'minister',
    'president',
    'governor',
    'commissioner',
    'imprisonment',
    'fine',
    'penalty',
    'offence',
  ];
  for (const term of specificTerms) {
    if (lower.includes(term)) score += 1;
  }

  // Penalize boilerplate
  for (const phrase of BOILERPLATE_PHRASES) {
    if (lower.includes(phrase)) score -= 3;
  }

  // Penalize very generic sentences
  if (lower.startsWith('the ') && wordCount(sentence) < 20) score -= 1;

  return score;
}

/**
 * Extract anchor phrases from section content
 *
 * @param content Section content text
 * @param count Number of anchors to extract (default 3)
 * @returns Array of anchor phrases
 */
export function extractAnchors(content: string, count: number = 3): string[] {
  const sentences = splitIntoSentences(content);

  // Filter sentences by length (15-30 words for best matching)
  const candidates = sentences.filter((s) => {
    const wc = wordCount(s);
    return wc >= 8 && wc <= 40; // Relaxed range for flexibility
  });

  // If not enough candidates, include shorter sentences
  if (candidates.length < count) {
    const shorter = sentences.filter((s) => {
      const wc = wordCount(s);
      return wc >= 5 && wc < 8;
    });
    candidates.push(...shorter);
  }

  // Score and sort by uniqueness
  const scored = candidates.map((s) => ({
    sentence: s,
    score: scoreUniqueness(s),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Return top N
  return scored.slice(0, count).map((s) => s.sentence);
}

/**
 * Search for an anchor phrase in PDF text
 *
 * @param anchor The anchor phrase to search for
 * @param pdfText The raw PDF text to search in
 * @returns AnchorResult with found status and position
 */
export function searchAnchor(anchor: string, pdfText: string): AnchorResult {
  const normalizedAnchor = normalize(anchor);
  const normalizedPdf = normalize(pdfText);

  const position = normalizedPdf.indexOf(normalizedAnchor);

  return {
    phrase: anchor.length > 60 ? anchor.slice(0, 57) + '...' : anchor,
    found: position !== -1,
    position: position !== -1 ? position : undefined,
  };
}

/**
 * Count unique sections in PDF text using regex
 *
 * Uses multiple strategies:
 * 1. Look for Table of Contents entries like "1.   Objective" (number + period + 2+ spaces + capital)
 * 2. Look for body headings like "27. (1) The total profits"
 * 3. Fall back to "Section X" cross-references if needed
 *
 * Also handles "Article" and "Clause" patterns for different law types.
 */
export function countSectionsInPdf(pdfText: string): number {
  const unique = new Set<string>();

  // Strategy 1: Match TOC entries with double-space after period
  // Pattern: "NUMBER.   Title" (number, period, 2+ spaces, capital letter)
  // Works for inline TOC like "1.   Objective  2.   Application"
  const tocPattern = /\b(\d+)\.\s{2,}[A-Z]/g;
  const tocMatches = [...pdfText.matchAll(tocPattern)];
  for (const match of tocMatches) {
    if (match[1]) {
      unique.add(match[1]);
    }
  }

  // Strategy 2: Match body headings at line start
  // Pattern: line start + "NUMBER. (1)" or "NUMBER. The..."
  const bodyPattern = /(?:^|\n)\s*(\d+)\.\s+\([0-9]+\)/gm;
  const bodyMatches = [...pdfText.matchAll(bodyPattern)];
  for (const match of bodyMatches) {
    if (match[1]) {
      unique.add(match[1]);
    }
  }

  // Strategy 3: If we found very few, also count cross-references
  if (unique.size < 50) {
    const sectionPattern = /\bsection\s+(\d+)\b/gi;
    const refMatches = [...pdfText.matchAll(sectionPattern)];
    for (const match of refMatches) {
      if (match[1]) {
        unique.add(match[1]);
      }
    }
  }

  return unique.size;
}

/**
 * Verify a single section against PDF text
 *
 * @param section The extracted section to verify
 * @param pdfText The raw PDF text
 * @returns SectionVerification result
 */
export function verifySection(section: ExtractedSection, pdfText: string): SectionVerification {
  // For very short sections, use fewer anchors
  const anchorCount = wordCount(section.content) < 50 ? 1 : section.content.length < 200 ? 2 : 3;

  const anchors = extractAnchors(section.content, anchorCount);
  const results: AnchorResult[] = [];

  for (const anchor of anchors) {
    results.push(searchAnchor(anchor, pdfText));
  }

  const found = results.filter((r) => r.found).length;
  const checked = results.length;

  let status: 'verified' | 'partial' | 'not_found';
  if (checked === 0) {
    // No anchors extracted (very short content)
    status = 'partial';
  } else if (found === checked) {
    status = 'verified';
  } else if (found > 0) {
    status = 'partial';
  } else {
    status = 'not_found';
  }

  return {
    sectionNumber: section.number,
    status,
    anchorsChecked: checked,
    anchorsFound: found,
    anchors: results,
  };
}

/**
 * Determine overall verification status based on results
 */
function determineOverallStatus(
  sectionCount: SectionCountResult,
  sections: SectionVerification[]
): 'pass' | 'review' | 'fail' {
  const totalSections = sections.length;

  // FAIL conditions
  // More than 10% sections missing (based on PDF count)
  if (
    sectionCount.pdfSectionCount > 0 &&
    sectionCount.missing > sectionCount.pdfSectionCount * 0.1
  ) {
    return 'fail';
  }

  // More than 5% sections not found in verification
  const notFoundCount = sections.filter((s) => s.status === 'not_found').length;
  if (totalSections > 0 && notFoundCount > totalSections * 0.05) {
    return 'fail';
  }

  // REVIEW conditions
  // Section count mismatch
  if (sectionCount.status === 'mismatch') {
    return 'review';
  }

  // More than 10% partial matches
  const partialCount = sections.filter((s) => s.status === 'partial').length;
  if (totalSections > 0 && partialCount > totalSections * 0.1) {
    return 'review';
  }

  return 'pass';
}

/**
 * Generate human-readable summary of verification results
 */
function generateSummary(report: VerificationReport): string {
  const { sectionCount, sections, overallStatus } = report;

  const verified = sections.filter((s) => s.status === 'verified').length;
  const partial = sections.filter((s) => s.status === 'partial').length;
  const notFound = sections.filter((s) => s.status === 'not_found').length;

  const lines: string[] = [];

  // Section count summary
  if (sectionCount.status === 'match') {
    lines.push(`Section count: ${sectionCount.extractedSectionCount} extracted (matches PDF)`);
  } else {
    lines.push(
      `Section count: PDF has ~${sectionCount.pdfSectionCount}, extracted ${sectionCount.extractedSectionCount} (${sectionCount.missing > 0 ? sectionCount.missing + ' possibly missing' : Math.abs(sectionCount.missing) + ' extra'})`
    );
  }

  // Anchor verification summary
  lines.push(
    `Anchor verification: ${verified}/${sections.length} verified, ${partial} partial, ${notFound} not found`
  );

  // Overall status
  lines.push(`Status: ${overallStatus.toUpperCase()}`);

  // List problematic sections
  if (notFound > 0) {
    const notFoundSections = sections
      .filter((s) => s.status === 'not_found')
      .map((s) => s.sectionNumber);
    lines.push(`Sections not found: ${notFoundSections.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Verify extracted sections against raw PDF text
 *
 * Main entry point for verification.
 *
 * @param sections Array of extracted sections
 * @param pdfText Raw text from the PDF
 * @returns Complete verification report
 */
export function verifyExtraction(
  sections: ExtractedSection[],
  pdfText: string
): VerificationReport {
  // Section count validation
  const pdfSectionCount = countSectionsInPdf(pdfText);
  const extractedSectionCount = sections.length;
  const missing = pdfSectionCount - extractedSectionCount;

  // Consider match if within 5% tolerance
  const tolerance = Math.max(Math.floor(pdfSectionCount * 0.05), 2);
  const sectionCountStatus: 'match' | 'mismatch' =
    Math.abs(missing) <= tolerance ? 'match' : 'mismatch';

  const sectionCount: SectionCountResult = {
    pdfSectionCount,
    extractedSectionCount,
    missing,
    status: sectionCountStatus,
  };

  // Verify each section
  const sectionResults: SectionVerification[] = [];
  for (const section of sections) {
    sectionResults.push(verifySection(section, pdfText));
  }

  // Determine overall status
  const overallStatus = determineOverallStatus(sectionCount, sectionResults);

  // Generate summary
  const report: VerificationReport = {
    sectionCount,
    sections: sectionResults,
    overallStatus,
    summary: '',
  };
  report.summary = generateSummary(report);

  return report;
}

/**
 * Convert verification report to data for JSON storage
 */
export function toVerificationData(report: VerificationReport): VerificationData {
  return {
    sectionCount: {
      pdfCount: report.sectionCount.pdfSectionCount,
      extractedCount: report.sectionCount.extractedSectionCount,
      status: report.sectionCount.status,
    },
    anchorsVerified: report.sections.filter((s) => s.status === 'verified').length,
    anchorsPartial: report.sections.filter((s) => s.status === 'partial').length,
    anchorsNotFound: report.sections.filter((s) => s.status === 'not_found').length,
    notFoundSections: report.sections
      .filter((s) => s.status === 'not_found')
      .map((s) => s.sectionNumber),
    overallStatus: report.overallStatus,
  };
}

/**
 * Format verification report for CLI output
 */
export function formatVerificationReport(
  report: VerificationReport,
  verbose: boolean = false
): string {
  const lines: string[] = [];

  // Section count
  if (report.sectionCount.status === 'match') {
    lines.push(
      `   Section count: ${report.sectionCount.extractedSectionCount} extracted (matches PDF)`
    );
  } else {
    const diff = report.sectionCount.missing;
    const diffText = diff > 0 ? `${diff} possibly missing` : `${Math.abs(diff)} extra`;
    lines.push(
      `   Section count: PDF has ~${report.sectionCount.pdfSectionCount}, extracted ${report.sectionCount.extractedSectionCount} \u26a0\ufe0f (${diffText})`
    );
  }

  // Anchor summary
  const verified = report.sections.filter((s) => s.status === 'verified').length;
  const partial = report.sections.filter((s) => s.status === 'partial').length;
  const notFound = report.sections.filter((s) => s.status === 'not_found').length;
  lines.push(
    `   Anchor verification: ${verified}/${report.sections.length} verified, ${partial} partial, ${notFound} not found`
  );

  // Status
  if (report.overallStatus !== 'pass') {
    lines.push(`   \u26a0\ufe0f  Status: ${report.overallStatus.toUpperCase()}`);
  }

  // Problem sections
  if (notFound > 0 || partial > 0) {
    lines.push('');
    lines.push('   Sections needing review:');

    for (const section of report.sections) {
      if (section.status === 'not_found') {
        lines.push(`   - Section ${section.sectionNumber}: NOT FOUND - possible hallucination`);
      } else if (section.status === 'partial' && verbose) {
        lines.push(
          `   - Section ${section.sectionNumber}: partial match (${section.anchorsFound}/${section.anchorsChecked} anchors found)`
        );
      }
    }
  }

  // Verbose anchor details
  if (verbose && notFound > 0) {
    lines.push('');
    lines.push('   Anchor details for unverified sections:');

    for (const section of report.sections.filter((s) => s.status === 'not_found')) {
      lines.push(`   Section ${section.sectionNumber}:`);
      for (const anchor of section.anchors) {
        const status = anchor.found ? '\u2713' : '\u2717';
        lines.push(`     ${status} "${anchor.phrase}"`);
      }
    }
  }

  return lines.join('\n');
}
