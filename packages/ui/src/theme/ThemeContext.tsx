import React, { createContext, useContext, useState, ReactNode } from 'react'
import { lightTheme, darkTheme, Theme } from './index'

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false)

  const theme = isDark ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  const setTheme = (dark: boolean) => {
    setIsDark(dark)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
