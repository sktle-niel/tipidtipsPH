/**
 * Pure email helpers — no Firebase import, so they can be unit-tested without
 * initializing the Firebase app. subscribeService re-exports these.
 */

/** Firestore-safe document id: every non-alphanumeric char becomes '_'. */
export function emailToDocId(email: string): string {
  return email.replace(/[^a-zA-Z0-9]/g, '_')
}

/** Encode an email into the unsubscribe-link token (base64 of the normalized email). */
export function emailToToken(email: string): string {
  return btoa(email.trim().toLowerCase())
}

/** Decode an unsubscribe token back to an email, or null if it isn't valid base64. */
export function tokenToEmail(token: string): string | null {
  try {
    return atob(token)
  } catch {
    return null
  }
}
