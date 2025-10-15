import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  SocialAuthProvider,
} from '@repo/types'
import { getSupabaseClient } from './client.js'
import { handleSupabaseError, AuthenticationError } from './errors.js'
import { mapProfile, mapCharacter } from './mappers.js'

/**
 * Sign up a new user with email and password
 */
export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
  const supabase = getSupabaseClient()

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: request.email,
      password: request.password,
    })

    if (authError) throw authError
    if (!authData.user) {
      throw new AuthenticationError('Failed to create user')
    }

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: request.username,
      })
      .select()
      .single()

    if (profileError) throw profileError

    // Create character with default values
    const { data: characterData, error: characterError } = await supabase
      .from('characters')
      .insert({
        user_id: authData.user.id,
        level: 1,
        xp: 0,
        hp: 100,
        gold: 0,
        theme: 'default',
        avatar_config: {},
      })
      .select()
      .single()

    if (characterError) throw characterError

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
      },
      profile: mapProfile(profileData),
      character: mapCharacter(characterData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: request.email,
      password: request.password,
    })

    if (error) throw error
    if (!data.user || !data.session) {
      throw new AuthenticationError('Invalid credentials')
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    handleSupabaseError(error)
  }
}

/**
 * Sign in with social authentication provider
 */
export async function signInWithSocial(provider: SocialAuthProvider): Promise<{ url: string }> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider.provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    if (!data.url) {
      throw new AuthenticationError('Failed to initiate social login')
    }

    return { url: data.url }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error

    return data.session
  } catch (error) {
    handleSupabaseError(error)
  }
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    return data.user
  } catch (error) {
    handleSupabaseError(error)
  }
}

/**
 * Refresh the current session
 */
export async function refreshSession() {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error

    return data.session
  } catch (error) {
    handleSupabaseError(error)
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = getSupabaseClient()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)

  return subscription
}
