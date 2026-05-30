import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, facebookProvider } from '../config/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signInWithGoogle() {
    try {
      setError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (err: unknown) {
      setError(getFriendlyError(err))
    }
  }

  async function signInWithFacebook() {
    try {
      setError(null)
      await signInWithPopup(auth, facebookProvider)
    } catch (err: unknown) {
      setError(getFriendlyError(err))
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth)
    } catch {
      // silent
    }
  }

  function clearError() { setError(null) }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithFacebook, signOut, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function getFriendlyError(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: string }).code
    if (code === 'auth/popup-closed-by-user') return 'Sarado ang popup. Subukan ulit.'
    if (code === 'auth/popup-blocked') return 'Naka-block ang popup. Payagan muna sa browser.'
    if (code === 'auth/account-exists-with-different-credential')
      return 'May account na ang email na ito. Subukan ang ibang paraan ng pag-login.'
    if (code === 'auth/network-request-failed') return 'Walang internet connection. Subukan ulit.'
    if (code === 'auth/cancelled-popup-request') return ''
    if (code === 'auth/operation-not-allowed') return 'Hindi pa naka-enable ang login method na ito sa Firebase.'
  }
  return 'May error sa pag-login. Subukan ulit.'
}
