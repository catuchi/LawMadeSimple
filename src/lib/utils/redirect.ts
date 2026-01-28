/**
 * Validates that a redirect path is safe (relative path only).
 * Prevents open redirect vulnerabilities by rejecting:
 * - Absolute URLs (https://evil.com)
 * - Protocol-relative URLs (//evil.com)
 * - JavaScript URLs (javascript:...)
 * - Data URLs (data:...)
 */
export function isValidRedirectPath(path: string): boolean {
  // Must be a string
  if (typeof path !== 'string') {
    return false;
  }

  // Must start with a single forward slash (relative path)
  if (!path.startsWith('/')) {
    return false;
  }

  // Reject protocol-relative URLs (//evil.com)
  if (path.startsWith('//')) {
    return false;
  }

  // Reject URLs with protocols
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) {
    return false;
  }

  // Reject paths with encoded characters that could bypass checks
  try {
    const decoded = decodeURIComponent(path);
    if (decoded !== path && !isValidRedirectPath(decoded)) {
      return false;
    }
  } catch {
    // If decoding fails, reject the path
    return false;
  }

  return true;
}

/**
 * Returns a safe redirect path, falling back to default if invalid.
 */
export function getSafeRedirectPath(path: string | null | undefined, defaultPath: string): string {
  if (!path || !isValidRedirectPath(path)) {
    return defaultPath;
  }
  return path;
}
