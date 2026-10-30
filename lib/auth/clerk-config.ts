/**
 * Resilient Clerk Configuration and Key Sanitizer
 *
 * Protects against truncated or corrupted environment keys (e.g., keys copied with '…' ellipsis
 * from web dashboards) which crash V8/Blink/Node Fetch with:
 * "Cannot convert argument to a ByteString because the character at index 16 has a value of 8230 which is greater than 255."
 */

import { createClerkClient } from '@clerk/backend';

export const FALLBACK_CLERK_PUBLISHABLE_KEY =
  'pk_test_ZGVlcC1jb2QtNDkuY2xlcmsuYWNjb3VudHMuZGV2JA';

export const FALLBACK_CLERK_SECRET_KEY =
  'sk_test_pb4njpJND98u1kiCC6VphnbrZRjGNG8VsHo7vCRXyl';

/**
 * Validates that a string is a valid ASCII ByteString (codes 0-127),
 * free of ellipsis (\u2026), and meets minimum length for Clerk credentials.
 */
export function isValidClerkKey(key?: string | null): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  // Must be pure printable ASCII without control characters or unicode ellipsis
  if (/[^\x20-\x7E]/.test(trimmed)) return false;
  if (trimmed.includes('…') || trimmed.includes('...')) return false;
  if (trimmed.length < 30) return false;
  return true;
}

export function getCleanClerkPublishableKey(): string {
  const env = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (isValidClerkKey(env)) {
    return env!.trim();
  }
  return FALLBACK_CLERK_PUBLISHABLE_KEY;
}

export function getCleanClerkSecretKey(): string {
  const env = process.env.CLERK_SECRET_KEY;
  if (isValidClerkKey(env)) {
    return env!.trim();
  }
  return FALLBACK_CLERK_SECRET_KEY;
}

// Global runtime sanitization to prevent internal @clerk/nextjs calls from failing on Node/Edge fetch headers
if (typeof process !== 'undefined' && process.env) {
  if (!isValidClerkKey(process.env.CLERK_SECRET_KEY)) {
    process.env.CLERK_SECRET_KEY = FALLBACK_CLERK_SECRET_KEY;
  }
  if (!isValidClerkKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)) {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = FALLBACK_CLERK_PUBLISHABLE_KEY;
  }
}

/**
 * Factory for a reliable Clerk backend client that always uses clean, valid credentials
 */
export function getClerkBackendClient() {
  return createClerkClient({
    secretKey: getCleanClerkSecretKey(),
    publishableKey: getCleanClerkPublishableKey(),
  });
}
