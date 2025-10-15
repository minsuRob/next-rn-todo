# @repo/hooks

Shared React hooks package for the gamified TODO application. Provides hooks for authentication, task management, character progression, rewards, and realtime synchronization.

## Features

- **Authentication Hooks**: User authentication and session management
- **Task Management Hooks**: CRUD operations for tasks with React Query
- **Character Hooks**: Character progression, level up, and equipment management
- **Rewards Hooks**: Shop, inventory, and reward redemption
- **Realtime Hooks**: Supabase realtime subscriptions for live updates

## Installation

This package is part of the monorepo and is installed automatically via workspace dependencies.

```json
{
  "dependencies": {
    "@repo/hooks": "workspace:*"
  }
}
```

## Usage

### Authentication

```tsx
import { AuthProvider, useAuth, useUser, useSession } from '@repo/hooks'

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  )
}

// Use authentication in components
function LoginButton() {
  const { signIn, signOut, user } = useAuth()

  if (user) {
    return <button onClick={signOut}>Sign Out</button>
  }

  return (
    <button onClick={() => signIn({ email: 'user@example.com', password: 'password' })}>
      Sign In
    </button>
  )
}

// Access user data
function UserProfile() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return <div>Welcome, {user.email}</div>
}
```

### Task Management

```tsx
import { useTasks, useCreateTask, useCompleteTask } from '@repo/hooks'

function TaskList() {
  const { data, isLoading } = useTasks({ type: 'todo', isCompleted: false })
  const createTask = useCreateTask()
  const completeTask = useCompleteTask()

  if (isLoading) return <div>Loading tasks...</div>

  return (
    <div>
      {data?.tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => completeTask.mutate({ taskId: task.id })}>Complete</button>
        </div>
      ))}

      <button
        onClick={() =>
          createTask.mutate({
            type: 'todo',
            title: 'New Task',
            difficulty: 'medium',
          })
        }
      >
        Add Task
      </button>
    </div>
  )
}
```

### Character Progression

```tsx
import { useCharacter, useLevelUp, useEquipment } from '@repo/hooks'

function CharacterCard() {
  const { data, isLoading } = useCharacter()
  const { level, xp, gold } = useLevelUp()
  const { equip, unequip } = useEquipment()

  if (isLoading) return <div>Loading character...</div>

  return (
    <div>
      <h2>Level {level}</h2>
      <p>XP: {xp}</p>
      <p>Gold: {gold}</p>

      <h3>Equipped Items</h3>
      {data?.equippedItems.map((item) => (
        <div key={item.id}>
          {item.rewardId}
          <button onClick={() => unequip({ inventoryItemId: item.id })}>Unequip</button>
        </div>
      ))}
    </div>
  )
}
```

### Rewards and Inventory

```tsx
import { useRewards, usePurchaseReward, useInventory } from '@repo/hooks'

function Shop() {
  const { data: rewards } = useRewards({ isCustom: false })
  const purchaseReward = usePurchaseReward()

  return (
    <div>
      {rewards?.rewards.map((reward) => (
        <div key={reward.id}>
          <h3>{reward.name}</h3>
          <p>Price: {reward.price} gold</p>
          <button onClick={() => purchaseReward.mutate({ rewardId: reward.id })}>Purchase</button>
        </div>
      ))}
    </div>
  )
}

function Inventory() {
  const { data, isLoading } = useInventory()

  if (isLoading) return <div>Loading inventory...</div>

  return (
    <div>
      {data?.items.map((item) => (
        <div key={item.id}>
          <p>Quantity: {item.quantity}</p>
          <p>Equipped: {item.isEquipped ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  )
}
```

### Realtime Synchronization

```tsx
import { useRealtimeSync, useTaskUpdates, useCharacterUpdates } from '@repo/hooks'

function App() {
  const { user } = useAuth()

  // Enable realtime sync for all user data
  useRealtimeSync(user?.id)

  return <YourApp />
}

// Or subscribe to specific updates
function TasksPage() {
  const { user } = useAuth()

  // Subscribe to task updates only
  useTaskUpdates(user?.id)

  return <TaskList />
}
```

## React Query Setup

This package requires React Query to be set up in your application:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <YourApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

## Dependencies

- `@repo/api` - API client functions
- `@repo/types` - TypeScript types and interfaces
- `@tanstack/react-query` - Data fetching and caching
- `react` - React library

## Development

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint
```
