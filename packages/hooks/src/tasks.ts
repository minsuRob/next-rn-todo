import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask, completeTask } from '@repo/api'
import type {
  GetTasksRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  Task,
} from '@repo/types'

/**
 * Query key factory for tasks
 */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: GetTasksRequest) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}

/**
 * Hook to fetch tasks with optional filtering
 */
export function useTasks(request: GetTasksRequest = {}) {
  return useQuery({
    queryKey: taskKeys.list(request),
    queryFn: () => getTasks(request),
  })
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateTaskRequest) => createTask(request),
    onSuccess: () => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, request }: { taskId: string; request: UpdateTaskRequest }) =>
      updateTask(taskId, request),
    onSuccess: (data) => {
      // Invalidate task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Update specific task in cache
      if (data.task) {
        queryClient.setQueryData(taskKeys.detail(data.task.id), data.task)
      }
    },
  })
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask({ taskId }),
    onSuccess: () => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

/**
 * Hook to complete a task with optimistic updates
 */
export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CompleteTaskRequest) => completeTask(request),
    onMutate: async (request) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })

      // Snapshot previous values
      const previousTasks = queryClient.getQueriesData({ queryKey: taskKeys.lists() })

      // Optimistically update task lists
      queryClient.setQueriesData({ queryKey: taskKeys.lists() }, (old: unknown) => {
        const oldData = old as { tasks?: Task[] } | undefined
        if (!oldData?.tasks) return old

        return {
          ...oldData,
          tasks: oldData.tasks.map((task: Task) =>
            task.id === request.taskId
              ? {
                  ...task,
                  isCompleted: true,
                  completedAt: new Date().toISOString(),
                }
              : task
          ),
        }
      })

      return { previousTasks }
    },
    onError: (err, request, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: () => {
      // Invalidate task lists to refetch with server data
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Also invalidate character data since XP/gold changed
      queryClient.invalidateQueries({ queryKey: ['character'] })
    },
  })
}
