/**
 * PDF Parser Utility
 *
 * Wrapper around pdf-parse for extracting text from PDF files.
 */

import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

/**
 * Result from parsing a PDF
 */
export interface ParsedPDF {
  /** Extracted text content */
  text: string;

  /** Number of pages */
  numPages: number;

  /** PDF metadata */
  info: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modDate?: Date;
  };

  /** File size in bytes */
  fileSize: number;

  /** Filename */
  filename: string;
}

/**
 * Parse a PDF file and extract text
 *
 * @param pdfPath - Path to the PDF file
 * @returns Parsed PDF data
 */
export async function parsePDF(pdfPath: string): Promise<ParsedPDF> {
  // Verify file exists
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  // Read file
  const dataBuffer = fs.readFileSync(pdfPath);
  const stats = fs.statSync(pdfPath);
  const filename = path.basename(pdfPath);

  try {
    // Parse PDF
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        modDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
      },
      fileSize: stats.size,
      filename,
    };
  } catch (error) {
    // Check for common issues
    if (error instanceof Error) {
      if (error.message.includes('encrypted')) {
        throw new Error(
          `PDF is encrypted and cannot be parsed: ${filename}. Please provide an unencrypted version.`
        );
      }
      if (error.message.includes('Invalid PDF') || error.message.includes('bad XRef')) {
        throw new Error(
          `PDF appears to be corrupted or invalid: ${filename}. Try re-downloading from the source.`
        );
      }
    }
    throw error;
  }
}

/**
 * Check if a file is a valid PDF
 *
 * @param pdfPath - Path to check
 * @returns True if file appears to be a valid PDF
 */
export async function isValidPDF(pdfPath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(pdfPath)) return false;

    // Check magic bytes
    const fd = fs.openSync(pdfPath, 'r');
    const buffer = Buffer.alloc(5);
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    // PDF files start with %PDF-
    return buffer.toString() === '%PDF-';
  } catch {
    return false;
  }
}

/**
 * Get basic PDF info without full parsing
 *
 * @param pdfPath - Path to the PDF file
 * @returns Basic info about the PDF
 */
export async function getPDFInfo(
  pdfPath: string
): Promise<{ filename: string; fileSize: number; isValid: boolean }> {
  const filename = path.basename(pdfPath);
  const isValid = await isValidPDF(pdfPath);

  let fileSize = 0;
  try {
    const stats = fs.statSync(pdfPath);
    fileSize = stats.size;
  } catch {
    // File doesn't exist
  }

  return { filename, fileSize, isValid };
}

/**
 * List all PDF files in a directory
 *
 * @param directory - Directory to scan
 * @returns Array of PDF file paths
 */
export function listPDFs(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map((file) => path.join(directory, file));
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
