import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { getUserProfile, saveUserProfile, createUserProfile, type UserProfile } from '../services/userProfileService'

interface UserProfileContextValue {
  profile: UserProfile | null
  profileLoading: boolean
  needsLocationSetup: boolean
  refreshProfile: () => Promise<void>
  updateLocation: (regionId: string, regionName: string, cityName: string, costLevel: 'high' | 'medium' | 'low') => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  async function loadProfile() {
    if (!user) { setProfile(null); return }
    setProfileLoading(true)
    try {
      await createUserProfile(user.uid, user.displayName ?? '', user.email ?? '', user.photoURL)
      const p = await getUserProfile(user.uid)
      setProfile(p)
    } catch (err) {
      console.error('Failed to load user profile:', err)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => { loadProfile() }, [user])

  async function refreshProfile() { await loadProfile() }

  async function updateLocation(
    regionId: string,
    regionName: string,
    cityName: string,
    costLevel: 'high' | 'medium' | 'low',
  ) {
    if (!user) return
    const updated: UserProfile = {
      uid: user.uid,
      displayName: user.displayName ?? '',
      email: user.email ?? '',
      photoURL: user.photoURL,
      regionId,
      regionName,
      cityName,
      costLevel,
      setupCompleted: true,
    }
    await saveUserProfile(updated)
    setProfile(updated)
  }

  const needsLocationSetup = !!user && !profileLoading && (profile === null || !profile.setupCompleted)

  return (
    <UserProfileContext.Provider value={{ profile, profileLoading, needsLocationSetup, refreshProfile, updateLocation }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) throw new Error('useUserProfile must be inside UserProfileProvider')
  return ctx
}
