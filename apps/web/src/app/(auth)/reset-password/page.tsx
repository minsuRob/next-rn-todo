'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@repo/ui'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { getSupabaseClient } from '@repo/api'

export const dynamic = 'force-dynamic'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if we have the required tokens in the URL
    const accessToken = searchParams.get('access_token')
    if (!accessToken) {
      setError('Invalid or expired reset link')
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setError('')

    if (!password) {
      setError('Password is required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>Enter your new password below</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Password Updated!</Text>
            <Text style={styles.successText}>
              Your password has been successfully reset. Redirecting to sign in...
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              helperText="Must be at least 8 characters"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />

            <Button
              title="Reset Password"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />

            <View style={styles.footer}>
              <Link href="/login">
                <Text style={styles.footerLink}>Back to Sign In</Text>
              </Link>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
  successContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
})
