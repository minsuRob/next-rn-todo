# Gamified TODO - Web Application

Next.js web application for the Gamified TODO app, built with React Native Web for maximum code sharing with the mobile app.

## Features

- 🎮 Gamified task management
- 📊 Character progression system
- 🏆 Rewards and achievements
- 📱 Responsive design (mobile-first)
- 🌐 React Native Web for code sharing
- ⚡ Server-side rendering with Next.js
- 🔐 Supabase authentication
- 💾 Real-time data synchronization

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React Native Web + Shared UI components
- **State Management**: React Query + Context API
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: React Native StyleSheet
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Supabase account

### Installation

From the monorepo root:

\`\`\`bash
pnpm install
\`\`\`

### Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Fill in your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Development

Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

\`\`\`bash
pnpm build
\`\`\`

Start the production server:

\`\`\`bash
pnpm start
\`\`\`

## Project Structure

\`\`\`
apps/web/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Authentication routes
│ │ ├── (dashboard)/ # Dashboard routes
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Home page
│ │ ├── providers.tsx # App providers
│ │ └── globals.css # Global styles
│ ├── components/ # Web-specific components
│ ├── lib/ # Utilities and helpers
│ └── env.d.ts # Environment types
├── public/ # Static assets
├── next.config.ts # Next.js configuration
├── tsconfig.json # TypeScript configuration
└── package.json
\`\`\`

## Code Sharing with Mobile

This web app shares code with the React Native mobile app through:

- **@repo/ui**: Shared UI components (React Native)
- **@repo/hooks**: Shared React hooks
- **@repo/api**: Shared API client
- **@repo/types**: Shared TypeScript types
- **@repo/utils**: Shared utility functions

React Native components are automatically converted to web-compatible components using `react-native-web`.

## Key Configurations

### React Native Web

The `next.config.ts` file includes:

- Transpilation of shared packages
- Alias for `react-native` → `react-native-web`
- Support for `.web.tsx` extensions

### TypeScript

Path aliases are configured for easy imports:

\`\`\`typescript
import { Button } from '@repo/ui'
import { useAuth } from '@repo/hooks'
import { getTasks } from '@repo/api'
\`\`\`

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Performance

- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- React Query caching for API calls
- Server-side rendering for initial page load

## Accessibility

- Keyboard navigation support
- ARIA labels and semantic HTML
- Focus management
- Screen reader compatibility

## License

Private - Part of Gamified TODO monorepo
