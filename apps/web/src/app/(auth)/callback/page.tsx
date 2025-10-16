'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { getSupabaseClient } from '@repo/api'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseClient()

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.search.substring(1)
        )

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        // Redirect to dashboard on success
        router.push('/dashboard')
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.push('/login?error=unexpected')
      }
    }

    handleCallback()
  }, [router])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
})
