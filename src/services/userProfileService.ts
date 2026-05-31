import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  regionId: string
  regionName: string
  cityName: string
  costLevel: 'high' | 'medium' | 'low'
  setupCompleted: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export async function saveUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function createUserProfile(
  uid: string,
  displayName: string,
  email: string,
  photoURL: string | null,
): Promise<void> {
  const existing = await getUserProfile(uid)
  if (existing) return

  await setDoc(doc(db, 'users', uid), {
    uid,
    displayName,
    email,
    photoURL,
    regionId: '',
    regionName: '',
    cityName: '',
    costLevel: 'medium',
    setupCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
