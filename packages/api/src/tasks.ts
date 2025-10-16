import type {
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  CompleteTaskRequest,
  CompleteTaskResponse,
  GetTasksRequest,
  GetTasksResponse,
  DeleteTaskRequest,
} from '@repo/types'
import { calculateXP, calculateGoldReward, calculateRequiredXP } from '@repo/utils'
import { getSupabaseClient } from './client'
import { handleSupabaseError, NotFoundError } from './errors'
import { mapTask, mapCharacter } from './mappers'

/**
 * Get tasks with optional filtering
 */
export async function getTasks(request: GetTasksRequest = {}): Promise<GetTasksResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (request.type) {
      query = query.eq('type', request.type)
    }

    if (request.isCompleted !== undefined) {
      query = query.eq('is_completed', request.isCompleted)
    }

    if (request.tags && request.tags.length > 0) {
      query = query.overlaps('tags', request.tags)
    }

    // Apply pagination
    const limit = request.limit || 50
    const offset = request.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      tasks: (data || []).map(mapTask),
      total: count || 0,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Create a new task
 */
export async function createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        type: request.type,
        title: request.title,
        description: request.description || null,
        difficulty: request.difficulty || 'easy',
        due_date: request.dueDate || null,
        repeat_pattern: request.repeatPattern || null,
        tags: request.tags || [],
      })
      .select()
      .single()

    if (error) throw error

    // Create streak record for daily tasks
    if (request.type === 'daily') {
      await supabase.from('streaks').insert({
        task_id: data.id,
        user_id: user.id,
        current_streak: 0,
        best_streak: 0,
      })
    }

    return {
      task: mapTask(data),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Update an existing task
 */
export async function updateTask(
  taskId: string,
  request: UpdateTaskRequest
): Promise<UpdateTaskResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const updateData: any = {}

    if (request.title !== undefined) updateData.title = request.title
    if (request.description !== undefined) updateData.description = request.description
    if (request.difficulty !== undefined) updateData.difficulty = request.difficulty
    if (request.dueDate !== undefined) updateData.due_date = request.dueDate
    if (request.repeatPattern !== undefined) updateData.repeat_pattern = request.repeatPattern
    if (request.checklist !== undefined) updateData.checklist = request.checklist
    if (request.tags !== undefined) updateData.tags = request.tags

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new NotFoundError('Task')

    return {
      task: mapTask(data),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Complete a task and award XP/gold
 */
export async function completeTask(request: CompleteTaskRequest): Promise<CompleteTaskResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get the task
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', request.taskId)
      .eq('user_id', user.id)
      .single()

    if (taskError) throw taskError
    if (!taskData) throw new NotFoundError('Task')

    // Get character
    const { data: characterData, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (characterError) throw characterError
    if (!characterData) throw new NotFoundError('Character')

    // Calculate rewards
    const xpGained = calculateXP(taskData.difficulty)
    const goldGained = calculateGoldReward(taskData.difficulty)

    // Update character
    const newXP = characterData.xp + xpGained
    const newGold = characterData.gold + goldGained
    const requiredXP = calculateRequiredXP(characterData.level)

    let newLevel = characterData.level
    let leveledUp = false
    let remainingXP = newXP

    // Check for level up
    if (newXP >= requiredXP) {
      newLevel = characterData.level + 1
      remainingXP = newXP - requiredXP
      leveledUp = true
    }

    // Update character in database
    const { data: updatedCharacter, error: updateCharacterError } = await supabase
      .from('characters')
      .update({
        xp: remainingXP,
        level: newLevel,
        gold: newGold,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateCharacterError) throw updateCharacterError

    // Mark task as completed
    const { data: updatedTask, error: updateTaskError } = await supabase
      .from('tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', request.taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateTaskError) throw updateTaskError

    // Log transactions
    await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'xp_gain',
        amount: xpGained,
        source: 'task_completion',
        source_id: request.taskId,
      },
      {
        user_id: user.id,
        type: 'gold_gain',
        amount: goldGained,
        source: 'task_completion',
        source_id: request.taskId,
      },
    ])

    return {
      task: mapTask(updatedTask),
      xpGained,
      goldGained,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Delete a task
 */
export async function deleteTask(request: DeleteTaskRequest): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', request.taskId)
      .eq('user_id', user.id)

    if (error) throw error
  } catch (error) {
    return handleSupabaseError(error)
  }
}
