# UI Component Examples

This document provides practical examples of using the shared UI components.

## Basic Examples

### Button Variants

```tsx
import { Stack, Button } from '@repo/ui'

function ButtonExamples() {
  return (
    <Stack spacing="md">
      <Button title="Primary" onPress={() => {}} variant="primary" />
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
      <Button title="Outline" onPress={() => {}} variant="outline" />
      <Button title="Ghost" onPress={() => {}} variant="ghost" />
      <Button title="Danger" onPress={() => {}} variant="danger" />
      <Button title="Loading" onPress={() => {}} loading />
      <Button title="Disabled" onPress={() => {}} disabled />
    </Stack>
  )
}
```

### Form with Validation

```tsx
import { useState } from 'react'
import { Stack, Input, Button, Card } from '@repo/ui'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })

  const handleSubmit = () => {
    const newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      console.log('Form submitted:', { email, password })
    }
  }

  return (
    <Card>
      <Stack spacing="md">
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />
        <Button title="Sign In" onPress={handleSubmit} variant="primary" fullWidth />
      </Stack>
    </Card>
  )
}
```

### Task List with Progress

```tsx
import { useState } from 'react'
import { View, Text } from 'react-native'
import { Stack, Card, Checkbox, ProgressBar, Badge } from '@repo/ui'

interface Task {
  id: string
  title: string
  completed: boolean
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project setup', completed: true },
    { id: '2', title: 'Design UI components', completed: true },
    { id: '3', title: 'Implement authentication', completed: false },
    { id: '4', title: 'Add database integration', completed: false },
  ])

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = (completedCount / tasks.length) * 100

  return (
    <Card>
      <Stack spacing="md">
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>My Tasks</Text>
          <Badge count={completedCount} text={`${completedCount}/${tasks.length}`} />
        </View>

        <ProgressBar value={completedCount} max={tasks.length} showPercentage label="Progress" />

        <Stack spacing="sm">
          {tasks.map((task) => (
            <Checkbox
              key={task.id}
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              label={task.title}
            />
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
```

### Character Stats Display

```tsx
import { View, Text } from 'react-native'
import { Stack, Card, Avatar, ProgressBar, Badge } from '@repo/ui'
import { useTheme } from '@repo/ui'

interface CharacterStatsProps {
  name: string
  level: number
  xp: number
  maxXp: number
  hp: number
  maxHp: number
  gold: number
}

function CharacterStats({ name, level, xp, maxXp, hp, maxHp, gold }: CharacterStatsProps) {
  const { theme } = useTheme()

  return (
    <Card>
      <Stack spacing="md">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar name={name} size="lg" />
          <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
              {name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Badge text={`Level ${level}`} variant="primary" size="sm" />
              <View style={{ marginLeft: theme.spacing.sm }}>
                <Badge count={gold} variant="warning" size="sm" />
              </View>
            </View>
          </View>
        </View>

        <ProgressBar value={xp} max={maxXp} label="XP" showPercentage color={theme.colors.xp} />

        <ProgressBar value={hp} max={maxHp} label="HP" showPercentage color={theme.colors.hp} />
      </Stack>
    </Card>
  )
}

// Usage
function Example() {
  return (
    <CharacterStats
      name="John Doe"
      level={5}
      xp={350}
      maxXp={500}
      hp={85}
      maxHp={100}
      gold={1250}
    />
  )
}
```

### Modal Dialog

```tsx
import { useState } from 'react'
import { Text } from 'react-native'
import { Button, Modal, Stack, Input } from '@repo/ui'

function CreateTaskModal() {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    console.log('Creating task:', { title, description })
    setVisible(false)
    setTitle('')
    setDescription('')
  }

  return (
    <>
      <Button title="Create Task" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Create New Task"
        footer={
          <Stack direction="row" spacing="md" justify="flex-end">
            <Button title="Cancel" onPress={() => setVisible(false)} variant="outline" />
            <Button title="Create" onPress={handleCreate} variant="primary" />
          </Stack>
        }
      >
        <Stack spacing="md">
          <Input
            label="Title"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="Description"
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </Stack>
      </Modal>
    </>
  )
}
```

### Confirm Dialog

```tsx
import { useState } from 'react'
import { Button, ConfirmDialog, showToast } from '@repo/ui'

function DeleteTaskButton() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      showToast({
        message: 'Task deleted successfully',
        type: 'success',
      })
      setShowConfirm(false)
    }, 1000)
  }

  return (
    <>
      <Button title="Delete Task" onPress={() => setShowConfirm(true)} variant="danger" />

      <ConfirmDialog
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}
```

### Responsive Grid

```tsx
import { View, Text } from 'react-native'
import { Grid, Card } from '@repo/ui'
import { useTheme } from '@repo/ui'

function DashboardGrid() {
  const { theme } = useTheme()

  const stats = [
    { label: 'Tasks Completed', value: 24, color: theme.colors.success },
    { label: 'XP Earned', value: 1250, color: theme.colors.xp },
    { label: 'Current Streak', value: 7, color: theme.colors.warning },
    { label: 'Level', value: 5, color: theme.colors.primary },
  ]

  return (
    <Grid columns={{ sm: 2, md: 4 }} spacing="md">
      {stats.map((stat, index) => (
        <Card key={index}>
          <View style={{ alignItems: 'center', padding: theme.spacing.md }}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: stat.color }}>{stat.value}</Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
              {stat.label}
            </Text>
          </View>
        </Card>
      ))}
    </Grid>
  )
}
```

### Theme Toggle

```tsx
import { View, Text } from 'react-native'
import { Switch, Card, Stack, useTheme } from '@repo/ui'

function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <Card>
      <Stack direction="row" justify="space-between" align="center">
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
            Dark Mode
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
            Toggle between light and dark themes
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </Stack>
    </Card>
  )
}
```

### Loading States

```tsx
import { useState } from 'react'
import { View } from 'react-native'
import { Button, Spinner, Skeleton, Stack, Card } from '@repo/ui'

function LoadingStates() {
  const [loading, setLoading] = useState(false)

  const handleLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <Stack spacing="lg">
      <Card>
        <Button title="Trigger Loading" onPress={handleLoad} />
      </Card>

      {loading && (
        <>
          <Card>
            <Spinner text="Loading data..." />
          </Card>

          <Card>
            <Stack spacing="md">
              <Skeleton height={20} width="80%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={100} />
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  )
}
```

### Empty State

```tsx
import { EmptyState, Button } from '@repo/ui'

function NoTasksView() {
  return (
    <EmptyState
      title="No tasks yet"
      description="Create your first task to get started on your productivity journey!"
      actionLabel="Create Task"
      onAction={() => console.log('Create task')}
    />
  )
}
```

## Complete Example: Task Management Screen

```tsx
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  Container,
  Stack,
  Card,
  Button,
  Input,
  Select,
  Checkbox,
  ProgressBar,
  Badge,
  Modal,
  EmptyState,
  showToast,
  useTheme,
} from '@repo/ui'

interface Task {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
}

function TaskManagementScreen() {
  const { theme } = useTheme()
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', difficulty: 'medium' as const })

  const handleCreateTask = () => {
    if (!newTask.title) {
      showToast({ message: 'Please enter a task title', type: 'error' })
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      difficulty: newTask.difficulty,
      completed: false,
    }

    setTasks([...tasks, task])
    setNewTask({ title: '', difficulty: 'medium' })
    setShowModal(false)
    showToast({ message: 'Task created successfully', type: 'success' })
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <Container>
      <ScrollView>
        <Stack spacing="lg" style={{ paddingVertical: theme.spacing.lg }}>
          {/* Header */}
          <Card>
            <Stack spacing="md">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Badge text={`${completedCount}/${tasks.length} completed`} />
              </View>
              <ProgressBar value={completedCount} max={tasks.length || 1} showPercentage />
              <Button
                title="Create New Task"
                onPress={() => setShowModal(true)}
                variant="primary"
                fullWidth
              />
            </Stack>
          </Card>

          {/* Task List */}
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Create your first task to get started!"
              actionLabel="Create Task"
              onAction={() => setShowModal(true)}
            />
          ) : (
            <Stack spacing="sm">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <Stack direction="row" align="center" spacing="md">
                    <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: theme.colors.text,
                          textDecorationLine: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </Text>
                    </View>
                    <Badge
                      text={task.difficulty}
                      variant={
                        task.difficulty === 'easy'
                          ? 'success'
                          : task.difficulty === 'medium'
                            ? 'warning'
                            : 'error'
                      }
                      size="sm"
                    />
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </ScrollView>

      {/* Create Task Modal */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Task"
        footer={
          <Stack direction="row" spacing="md" justify="flex-end">
            <Button title="Cancel" onPress={() => setShowModal(false)} variant="outline" />
            <Button title="Create" onPress={handleCreateTask} variant="primary" />
          </Stack>
        }
      >
        <Stack spacing="md">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={newTask.title}
            onChangeText={(title) => setNewTask({ ...newTask, title })}
          />
          <Select
            label="Difficulty"
            value={newTask.difficulty}
            onChange={(difficulty) => setNewTask({ ...newTask, difficulty: difficulty as any })}
            options={[
              { label: 'Easy', value: 'easy' },
              { label: 'Medium', value: 'medium' },
              { label: 'Hard', value: 'hard' },
            ]}
          />
        </Stack>
      </Modal>
    </Container>
  )
}

export default TaskManagementScreen
```

These examples demonstrate the full range of components and how they work together to create a complete user interface that works on both web and mobile platforms!
