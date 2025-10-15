import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSession, getUser, onAuthStateChange, signIn, signOut, signUp } from '@repo/api'
import type { SignInRequest, SignUpRequest } from '@repo/types'

interface User {
  id: string
  email: string
}

interface Session {
  accessToken: string
  refreshToken: string
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (request: SignInRequest) => Promise<void>
  signUp: (request: SignUpRequest) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth provider component that manages authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const currentSession = await getSession()
        if (currentSession) {
          setSession({
            accessToken: currentSession.access_token,
            refreshToken: currentSession.refresh_token,
          })
          const currentUser = await getUser()
          if (currentUser) {
            setUser({
              id: currentUser.id,
              email: currentUser.email!,
            })
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth changes
    const subscription = onAuthStateChange((event, session) => {
      if (session) {
        setSession({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        })
        if (session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
          })
        }
      } else {
        setSession(null)
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (request: SignInRequest) => {
    const response = await signIn(request)
    setUser(response.user)
    setSession(response.session)
  }

  const handleSignUp = async (request: SignUpRequest) => {
    const response = await signUp(request)
    setUser(response.user)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setSession(null)
  }

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 * Provides user, session, and auth methods
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook to access current session
 */
export function useSession() {
  const { session, isLoading } = useAuth()
  return { session, isLoading }
}

/**
 * Hook to access current user
 */
export function useUser() {
  const { user, isLoading } = useAuth()
  return { user, isLoading }
}
