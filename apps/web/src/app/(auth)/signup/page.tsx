'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@repo/hooks'
import { Button, Input } from '@repo/ui'
import { signUpSchema } from '@repo/types'
import { validate } from '@repo/types'
import { View, Text, StyleSheet } from 'react-native'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async () => {
    setErrors({})
    setGeneralError('')

    // Check password confirmation
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ['Passwords do not match'] })
      return
    }

    // Validate form data
    const result = validate(signUpSchema, { email, password, username })

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    setIsLoading(true)

    try {
      await signUp({ email, password, username })
      router.push('/dashboard')
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    try {
      const { signInWithSocial } = await import('@repo/api')
      const { url } = await signInWithSocial({ provider })
      window.location.href = url
    } catch (error: any) {
      setGeneralError(error.message || `Failed to sign up with ${provider}`)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your productivity adventure today</Text>

        {generalError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{generalError}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
            autoComplete="username"
            error={errors.username?.[0]}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.[0]}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a strong password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.password?.[0]}
            helperText="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.confirmPassword?.[0]}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            style={{ marginTop: 8 }}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continue with Google"
            onPress={() => handleSocialAuth('google')}
            variant="outline"
            fullWidth
          />

          <Button
            title="Continue with Apple"
            onPress={() => handleSocialAuth('apple')}
            variant="outline"
            fullWidth
            style={{ marginTop: 12 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login">
              <Text style={styles.footerLink}>Sign in</Text>
            </Link>
          </View>
        </View>
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
  form: {
    gap: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
})
