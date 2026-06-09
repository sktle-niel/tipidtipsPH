import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { emailToDocId, emailToToken, tokenToEmail } from '../lib/email'

export { emailToToken, tokenToEmail }

export type SubscribeResult =
  | { success: true }
  | { success: false; alreadyExists: boolean; message: string }

const LS_KEY = 'tipidtips_subscribed'

function getLocalSubscribed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveLocalSubscribed(email: string) {
  const list = getLocalSubscribed()
  if (!list.includes(email)) {
    localStorage.setItem(LS_KEY, JSON.stringify([...list, email]))
  }
}

function removeLocalSubscribed(email: string) {
  const list = getLocalSubscribed().filter(e => e !== email)
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

export function isAlreadySubscribed(email: string): boolean {
  return getLocalSubscribed().includes(email.trim().toLowerCase())
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const normalized = email.trim().toLowerCase()

  if (isAlreadySubscribed(normalized)) {
    return {
      success: false,
      alreadyExists: true,
      message: 'Naka-subscribe ka na! Abangan ang tips sa email mo. 📬',
    }
  }
// fixing bug where same email can be subscribed multiple times if user clears localStorage or uses different browser. Firestore will prevent duplicates but we should also check before writing to Firestore. This also allows us to return a more accurate message to the user.
  const docId = emailToDocId(normalized)

  await setDoc(doc(db, 'subscribers', {
    email: normalized,
    subscribedAt: serverTimestamp(),
    unsubscribed: false,
    source: 'homepage_cta',
  })

  saveLocalSubscribed(normalized)

  return { success: true }
}

export async function unsubscribeEmail(token: string): Promise<'success' | 'invalid' | 'error'> {
  const email = tokenToEmail(token)
  if (!email) return 'invalid'

  try {
    const docId = emailToDocId(email)
    console.log('[unsubscribe] docId:', docId, 'email:', email)
    await setDoc(doc(db, 'subscribers', docId), {
      email,
      unsubscribed: true,
      unsubscribedAt: serverTimestamp(),
    }, { merge: true })
    removeLocalSubscribed(email)
    return 'success'
  } catch (err) {
    console.error('[unsubscribe] Firestore error:', err)
    return 'error'
  }
}

export function buildUnsubscribeUrl(email: string, baseUrl?: string): string {
  const base = baseUrl ?? window.location.origin
  const token = emailToToken(email)
  return `${base}/unsubscribe?token=${token}`
}
