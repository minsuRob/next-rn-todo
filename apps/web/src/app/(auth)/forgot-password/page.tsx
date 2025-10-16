'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@repo/ui'
import { View, Text, StyleSheet } from 'react-native'
import { getSupabaseClient } from '@repo/api'

export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Email is required')
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}. Please check your inbox and follow the
              instructions.
            </Text>
            <Link href="/login" style={styles.backLink}>
              <Text style={styles.backLinkText}>Back to Sign In</Text>
            </Link>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Button
              title="Send Reset Link"
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
    marginBottom: 24,
    lineHeight: 20,
  },
  backLink: {
    marginTop: 8,
  },
  backLinkText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
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
