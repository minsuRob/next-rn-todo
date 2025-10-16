import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Animated,
} from 'react-native'
import { Button, Select, Container } from '@repo/ui'
import { useTasks, useCreateTask, useCompleteTask, useDeleteTask } from '@repo/hooks'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import type { TaskType, TaskDifficulty } from '@repo/types'

export default function TasksScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [filter, setFilter] = useState<TaskType | 'all'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data: tasksData, isLoading } = useTasks({})
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const { mutate: completeTask } = useCompleteTask()
  const { mutate: deleteTask } = useDeleteTask()

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
    deleteTask(taskId)
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Manage your daily tasks
          </Text>
        </View>
        <Button title="+ New" onPress={() => setIsCreateModalOpen(true)} variant="primary" />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', 'habit', 'daily', 'todo'] as const}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setFilter(item)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: filter === item ? colors.tint : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: filter === item ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={() => handleCompleteTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
            colors={colors}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyIcon, { color: colors.tabIconDefault }]}>📝</Text>
            <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              No tasks yet. Create your first task!
            </Text>
          </View>
        }
        contentContainerStyle={styles.taskList}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
        isCreating={isCreating}
        colors={colors}
      />
    </View>
  )
}

// Task Card Component
function TaskCard({
  task,
  onComplete,
  onDelete,
  colors,
}: {
  task: any
  onComplete: () => void
  onDelete: () => void
  colors: any
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const scaleAnim = useState(new Animated.Value(1))[0]

  const handleComplete = () => {
    setIsAnimating(true)
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
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
      style={[styles.taskCard, { backgroundColor: colors.card, transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.taskCardContent}>
        <Pressable
          onPress={handleComplete}
          disabled={task.isCompleted || isAnimating}
          style={[
            styles.checkbox,
            {
              borderColor: task.isCompleted ? '#22c55e' : colors.border,
              backgroundColor: task.isCompleted ? '#22c55e' : 'transparent',
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
                color: task.isCompleted ? colors.tabIconDefault : colors.text,
                textDecorationLine: task.isCompleted ? 'line-through' : 'none',
              },
            ]}
          >
            {task.title}
          </Text>
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
                  {
                    color: difficultyColors[task.difficulty as keyof typeof difficultyColors],
                  },
                ]}
              >
                {task.difficulty}
              </Text>
            </View>
            <Text style={[styles.taskType, { color: colors.tabIconDefault }]}>{task.type}</Text>
          </View>
        </View>

        {!task.isCompleted && (
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </Pressable>
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
  colors,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => void
  isCreating: boolean
  colors: any
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

    setTitle('')
    setDescription('')
    setType('todo')
    setDifficulty('medium')
  }

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Task</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={colors.tabIconDefault}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              placeholderTextColor={colors.tabIconDefault}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={[styles.label, { color: colors.text }]}>Type</Text>
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
              <Text style={[styles.label, { color: colors.text }]}>Difficulty</Text>
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
              title={isCreating ? 'Creating...' : 'Create'}
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
    paddingHorizontal: 16,
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
    marginBottom: 16,
  },
  filtersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyCard: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
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
