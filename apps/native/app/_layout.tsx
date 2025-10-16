import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import 'react-native-reanimated'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@repo/ui'
import Constants from 'expo-constants'
import { createSupabaseClient } from '@repo/api'

import { ThemeProvider as AppThemeProvider, useAppTheme } from '@/lib/theme/context'
import { customFontsToLoad } from '@/lib/theme/typography'
import { useAuth, AuthProvider } from '@repo/hooks'

const queryClient = new QueryClient()

// Initialize Supabase client from EXPO_PUBLIC_* or app.json extra
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? (Constants.expoConfig?.extra as any)?.supabaseUrl

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? (Constants.expoConfig?.extra as any)?.supabaseAnonKey

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  createSupabaseClient({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  })
} else {
  // Warn in development if env is missing to help diagnose init errors
  console.warn('Supabase env not configured (EXPO_PUBLIC_* or app.json extra)')
}

export const unstable_settings = {
  anchor: '(tabs)',
}

function RootLayoutNav() {
  const { navigationTheme, themeContext } = useAppTheme()
  const { user, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login')
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)')
    }
  }, [user, segments, isLoading])

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={themeContext === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </NavigationThemeProvider>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(customFontsToLoad)

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppThemeProvider>
            <RootLayoutNav />
          </AppThemeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
