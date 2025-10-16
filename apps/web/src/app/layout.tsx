import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gamified TODO - Level Up Your Productivity',
  description:
    'Transform your tasks into an epic adventure. Complete tasks, earn XP, level up your character, and unlock rewards.',
  keywords: ['todo', 'productivity', 'gamification', 'tasks', 'habits'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
