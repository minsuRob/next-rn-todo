import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import 'react-native-reanimated'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { ThemeProvider as AppThemeProvider, useAppTheme } from '@/lib/theme/context'
import { customFontsToLoad } from '@/lib/theme/typography'

export const unstable_settings = {
  anchor: '(tabs)',
}

function RootLayoutNav() {
  const { navigationTheme, themeContext } = useAppTheme()

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={themeContext === 'dark' ? 'light' : 'dark'} />
      <Stack>
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
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  )
}
