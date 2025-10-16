'use client'

import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native'
import { useTheme, Button, Container, Select } from '@repo/ui'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask } from '@repo/hooks'
import type { TaskType, TaskDifficulty } from '@repo/types'

export default function TasksPage() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState<TaskType | 'all'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)

  const { data: tasksData, isLoading } = useTasks({})
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: deleteTask } = useDeleteTask()
  const { mutate: completeTask } = useCompleteTask()

  const tasks = tasksData?.tasks || []
  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.type === filter)

  const handleCreateTask = (taskData: {
    title: string
    description?: string
    type: TaskType
    difficulty: TaskDifficulty
  }) => {
    createTask(taskData, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  const handleCompleteTask = (taskId: string) => {
    completeTask({ taskId })
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container maxWidth="lg">
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Tasks</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Manage your daily tasks, habits, and to-dos
              </Text>
            </View>
            <Button
              title="+ New Task"
              onPress={() => setIsCreateModalOpen(true)}
              variant="primary"
            />
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterButtons}>
                {(['all', 'habit', 'daily', 'todo'] as const).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setFilter(type)}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor:
                          filter === type ? theme.colors.primary : theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color: filter === type ? '#FFFFFF' : theme.colors.text,
                        },
                      ]}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Task List */}
          <View style={styles.taskList}>
            {filteredTasks.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.emptyIcon, { color: theme.colors.textTertiary }]}>📝</Text>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No tasks yet. Create your first task to get started!
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleCompleteTask(task.id)}
                  onEdit={() => setEditingTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  theme={theme}
                />
              ))
            )}
          </View>
        </Container>
      </ScrollView>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
        isCreating={isCreating}
        theme={theme}
      />
    </View>
  )
}

// Task Card Component
function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  theme,
}: {
  task: any
  onComplete: () => void
  onEdit: () => void
  onDelete: () => void
  theme: any
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const scaleAnim = useState(new Animated.Value(1))[0]

  const handleComplete = () => {
    setIsAnimating(true)
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete()
      setIsAnimating(false)
    })
  }

  const difficultyColors = {
    trivial: '#94a3b8',
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
  }

  return (
    <Animated.View
      style={[
        styles.taskCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.taskCardContent}>
        <View style={styles.taskCardLeft}>
          <Pressable
            onPress={handleComplete}
            disabled={task.isCompleted || isAnimating}
            style={[
              styles.checkbox,
              {
                borderColor: task.isCompleted ? theme.colors.success : theme.colors.border,
                backgroundColor: task.isCompleted ? theme.colors.success : 'transparent',
              },
            ]}
          >
            {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>

          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                {
                  color: task.isCompleted ? theme.colors.textTertiary : theme.colors.text,
                  textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                },
              ]}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text style={[styles.taskDescription, { color: theme.colors.textSecondary }]}>
                {task.description}
              </Text>
            )}
            <View style={styles.taskMeta}>
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      difficultyColors[task.difficulty as keyof typeof difficultyColors] + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: difficultyColors[task.difficulty as keyof typeof difficultyColors] },
                  ]}
                >
                  {task.difficulty}
                </Text>
              </View>
              <Text style={[styles.taskType, { color: theme.colors.textTertiary }]}>
                {task.type}
              </Text>
            </View>
          </View>
        </View>

        {!task.isCompleted && (
          <View style={styles.taskActions}>
            <Pressable onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionIcon}>✏️</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={styles.actionButton}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  )
}

// Create Task Modal Component
function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  theme,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => void
  isCreating: boolean
  theme: any
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TaskType>('todo')
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium')

  const handleSubmit = () => {
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      difficulty,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setType('todo')
    setDifficulty('medium')
  }

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create New Task</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description (optional)"
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Type</Text>
              <Select
                value={type}
                onChange={(value) => setType(value as TaskType)}
                options={[
                  { label: 'Habit', value: 'habit' },
                  { label: 'Daily', value: 'daily' },
                  { label: 'To-Do', value: 'todo' },
                ]}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Difficulty</Text>
              <Select
                value={difficulty}
                onChange={(value) => setDifficulty(value as TaskDifficulty)}
                options={[
                  { label: 'Trivial', value: 'trivial' },
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
            </View>
          </View>

          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={onClose} variant="secondary" />
            <Button
              title={isCreating ? 'Creating...' : 'Create Task'}
              onPress={handleSubmit}
              variant="primary"
              disabled={!title.trim() || isCreating}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  filters: {
    marginBottom: 24,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskList: {
    paddingBottom: 24,
  },
  emptyCard: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskCardLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskType: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
})
