# Task 7: 공유 훅 패키지 생성 (Create Shared Hooks Package)

## Summary

Successfully created a comprehensive React hooks package (`@repo/hooks`) that provides reusable hooks for authentication, task management, character progression, rewards, and realtime synchronization.

## Completed Subtasks

### 7.1 인증 훅 구현 (Authentication Hooks)

- ✅ Created `AuthProvider` context component for managing authentication state
- ✅ Implemented `useAuth` hook with user, session, and auth methods
- ✅ Implemented `useSession` hook for accessing current session
- ✅ Implemented `useUser` hook for accessing current user
- ✅ Integrated with Supabase auth state changes for real-time updates

### 7.2 태스크 관리 훅 구현 (Task Management Hooks)

- ✅ Created `useTasks` hook with React Query for fetching tasks with filters
- ✅ Implemented `useCreateTask` mutation for creating new tasks
- ✅ Implemented `useUpdateTask` mutation for updating existing tasks
- ✅ Implemented `useDeleteTask` mutation for deleting tasks
- ✅ Implemented `useCompleteTask` mutation with optimistic updates
- ✅ Created query key factory for efficient cache management

### 7.3 캐릭터 훅 구현 (Character Hooks)

- ✅ Created `useCharacter` hook for fetching character data with equipment
- ✅ Implemented `useUpdateCharacter` mutation for theme and avatar updates
- ✅ Implemented `useLevelUp` hook for monitoring level progression
- ✅ Implemented `useEquipment` hook with equip/unequip functionality
- ✅ Integrated cache updates for character state changes

### 7.4 보상 훅 구현 (Rewards Hooks)

- ✅ Created `useRewards` hook for fetching rewards with filters
- ✅ Implemented `useCreateCustomReward` mutation for custom rewards
- ✅ Implemented `usePurchaseReward` mutation with gold validation
- ✅ Implemented `useRedeemReward` mutation for consuming rewards
- ✅ Created `useInventory` hook for fetching user inventory
- ✅ Created query key factories for rewards and inventory

### 7.5 실시간 훅 구현 (Realtime Hooks)

- ✅ Created `useRealtimeSubscription` generic hook for Supabase realtime
- ✅ Implemented `useTaskUpdates` for real-time task synchronization
- ✅ Implemented `useCharacterUpdates` for real-time character updates
- ✅ Implemented `useChallengeUpdates` for real-time challenge updates
- ✅ Created `useRealtimeSync` convenience hook for enabling all realtime features

## Package Structure

```
packages/hooks/
├── src/
│   ├── auth.tsx          # Authentication hooks and context
│   ├── tasks.ts          # Task management hooks
│   ├── character.ts      # Character progression hooks
│   ├── rewards.ts        # Rewards and inventory hooks
│   ├── realtime.ts       # Realtime synchronization hooks
│   └── index.ts          # Main export file
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

## Key Features

### Authentication

- Context-based auth state management
- Automatic session persistence
- Real-time auth state changes
- Support for email/password and social auth

### Task Management

- Optimistic updates for better UX
- Automatic cache invalidation
- Query key factory for efficient caching
- Support for filtering and pagination

### Character Progression

- Real-time character stat updates
- Equipment management with cache updates
- Level up monitoring
- Theme and avatar customization

### Rewards System

- Shop and inventory management
- Gold validation for purchases
- Custom reward creation
- Reward redemption tracking

### Realtime Synchronization

- Generic subscription hook for any table
- Automatic cache updates on realtime events
- Support for filtered subscriptions
- Convenience hooks for common use cases

## Dependencies

- `@repo/api` - API client functions
- `@repo/types` - TypeScript types and interfaces
- `@tanstack/react-query` - Data fetching and caching
- `react` - React library

## Usage Example

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth, useTasks, useCharacter } from '@repo/hooks'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { data: tasks } = useTasks({ isCompleted: false })
  const { data: character } = useCharacter()

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>Level: {character?.character.level}</p>
      <p>Tasks: {tasks?.tasks.length}</p>
    </div>
  )
}
```

## Testing

All code passes:

- ✅ ESLint validation (no warnings)
- ✅ TypeScript type checking (with skipLibCheck for dependencies)
- ✅ Code style compliance

## Notes

- The package uses TypeScript for type safety
- All hooks follow React Query best practices
- Optimistic updates are used where appropriate for better UX
- Cache management is handled automatically through query keys
- The package is ready for use in both web (Next.js) and mobile (React Native) applications
