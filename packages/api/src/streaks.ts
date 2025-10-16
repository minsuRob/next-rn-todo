import type {
  GetStreaksRequest,
  GetStreaksResponse,
  UpdateStreakRequest,
  UpdateStreakResponse,
  LogHabitRequest,
  LogHabitResponse,
} from '@repo/types'
import { calculateXP, calculateGoldReward } from '@repo/utils'
import { getSupabaseClient } from './client'
import { handleSupabaseError, NotFoundError } from './errors'
import { mapStreak, mapHabitLog } from './mappers'

/**
 * Get streaks for user's tasks
 */
export async function getStreaks(request: GetStreaksRequest = {}): Promise<GetStreaksResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .order('current_streak', { ascending: false })

    // Filter by task if specified
    if (request.taskId) {
      query = query.eq('task_id', request.taskId)
    }

    const { data, error } = await query

    if (error) throw error

    return {
      streaks: (data || []).map(mapStreak),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Update streak when a task is completed
 */
export async function updateStreak(request: UpdateStreakRequest): Promise<UpdateStreakResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get the streak record
    const { data: streakData, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('task_id', request.taskId)
      .eq('user_id', user.id)
      .single()

    if (streakError) throw streakError
    if (!streakData) throw new NotFoundError('Streak')

    const today = new Date().toISOString().split('T')[0]
    const lastCompleted = streakData.last_completed_date

    let newCurrentStreak = streakData.current_streak
    let newBestStreak = streakData.best_streak
    let bonusXp: number | undefined
    let milestone: number | undefined

    if (request.completed) {
      // Check if already completed today
      if (lastCompleted === today) {
        // Already completed today, no change
        return {
          streak: mapStreak(streakData),
        }
      }

      // Check if streak continues (completed yesterday)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (lastCompleted === yesterdayStr) {
        // Continue streak
        newCurrentStreak += 1
      } else {
        // Start new streak
        newCurrentStreak = 1
      }

      // Update best streak
      if (newCurrentStreak > newBestStreak) {
        newBestStreak = newCurrentStreak
      }

      // Calculate bonus XP for milestones (every 7 days)
      if (newCurrentStreak % 7 === 0) {
        bonusXp = 50
        milestone = newCurrentStreak

        // Award bonus XP to character
        const { data: characterData } = await supabase
          .from('characters')
          .select('xp')
          .eq('user_id', user.id)
          .single()

        if (characterData) {
          await supabase
            .from('characters')
            .update({
              xp: characterData.xp + bonusXp,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)

          // Log transaction
          await supabase.from('transactions').insert({
            user_id: user.id,
            type: 'xp_gain',
            amount: bonusXp,
            source: 'streak_milestone',
            source_id: request.taskId,
          })
        }
      }

      // Update streak
      const { data: updatedStreak, error: updateError } = await supabase
        .from('streaks')
        .update({
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          last_completed_date: today,
        })
        .eq('task_id', request.taskId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      return {
        streak: mapStreak(updatedStreak),
        bonusXp,
        milestone,
      }
    } else {
      // Task not completed, check if streak should break
      if (lastCompleted) {
        const lastDate = new Date(lastCompleted)
        const daysSinceCompletion = Math.floor(
          (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Break streak if more than 1 day has passed
        if (daysSinceCompletion > 1) {
          const { data: updatedStreak, error: updateError } = await supabase
            .from('streaks')
            .update({
              current_streak: 0,
            })
            .eq('task_id', request.taskId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (updateError) throw updateError

          return {
            streak: mapStreak(updatedStreak),
          }
        }
      }

      return {
        streak: mapStreak(streakData),
      }
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Log a habit (positive or negative)
 */
export async function logHabit(request: LogHabitRequest): Promise<LogHabitResponse> {
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

    // Verify it's a habit task
    if (taskData.type !== 'habit') {
      throw new Error('Task is not a habit')
    }

    // Create habit log
    const { data: habitLogData, error: habitLogError } = await supabase
      .from('habit_logs')
      .insert({
        task_id: request.taskId,
        user_id: user.id,
        is_positive: request.isPositive,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (habitLogError) throw habitLogError

    let xpGained: number | undefined
    let goldGained: number | undefined

    // Award or deduct XP/gold based on positive/negative
    if (request.isPositive) {
      xpGained = calculateXP(taskData.difficulty)
      goldGained = calculateGoldReward(taskData.difficulty)

      // Get character and update
      const { data: characterData } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (characterData) {
        await supabase
          .from('characters')
          .update({
            xp: characterData.xp + xpGained,
            gold: characterData.gold + goldGained,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)

        // Log transactions
        await supabase.from('transactions').insert([
          {
            user_id: user.id,
            type: 'xp_gain',
            amount: xpGained,
            source: 'habit_positive',
            source_id: request.taskId,
          },
          {
            user_id: user.id,
            type: 'gold_gain',
            amount: goldGained,
            source: 'habit_positive',
            source_id: request.taskId,
          },
        ])
      }
    } else {
      // Negative habit - deduct HP
      const hpLoss = 5

      const { data: characterData } = await supabase
        .from('characters')
        .select('hp')
        .eq('user_id', user.id)
        .single()

      if (characterData) {
        const newHp = Math.max(0, characterData.hp - hpLoss)

        await supabase
          .from('characters')
          .update({
            hp: newHp,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
      }
    }

    return {
      habitLog: mapHabitLog(habitLogData),
      xpGained,
      goldGained,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}
