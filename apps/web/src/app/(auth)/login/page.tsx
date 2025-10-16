'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@repo/hooks'
import { Button, Input } from '@repo/ui'
import { signInSchema } from '@repo/types'
import { validate } from '@repo/types'
import { View, Text, StyleSheet } from 'react-native'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async () => {
    setErrors({})
    setGeneralError('')

    // Validate form data
    const result = validate(signInSchema, { email, password })

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    setIsLoading(true)

    try {
      await signIn({ email, password })
      router.push('/dashboard')
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to sign in. Please check your credentials.')
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
      setGeneralError(error.message || `Failed to sign in with ${provider}`)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your adventure</Text>

        {generalError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{generalError}</Text>
          </View>
        )}

        <View style={styles.form}>
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
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password?.[0]}
          />

          <Link href="/auth/forgot-password" style={styles.forgotLink}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Link>

          <Button
            title="Sign In"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
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
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup">
              <Text style={styles.footerLink}>Sign up</Text>
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#6366f1',
    fontSize: 14,
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
