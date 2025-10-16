import type {
  GetXPHistoryRequest,
  GetXPHistoryResponse,
  GetTaskStatsResponse,
  GetStreakDataResponse,
} from '@repo/types'
import { getSupabaseClient } from './client'
import { handleSupabaseError } from './errors'
import { mapStreak } from './mappers'

/**
 * Get XP history over time
 */
export async function getXPHistory(
  request: GetXPHistoryRequest = {}
): Promise<GetXPHistoryResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Set default date range (last 30 days)
    const endDate = request.endDate || new Date().toISOString()
    const startDate =
      request.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Get XP transactions within date range
    const { data, error } = await supabase
      .from('transactions')
      .select('created_at, amount')
      .eq('user_id', user.id)
      .eq('type', 'xp_gain')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group by interval
    const interval = request.interval || 'day'
    const groupedData = groupByInterval(data || [], interval)

    return {
      data: groupedData,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get task completion statistics
 */
export async function getTaskStats(): Promise<GetTaskStatsResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get all tasks
    const { data: allTasks, error: allTasksError } = await supabase
      .from('tasks')
      .select('type, difficulty, is_completed')
      .eq('user_id', user.id)

    if (allTasksError) throw allTasksError

    // Get completed tasks
    const { data: completedTasks, error: completedError } = await supabase
      .from('tasks')
      .select('type, difficulty')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .returns<Array<{ type: string; difficulty: string }>>()

    if (completedError) throw completedError

    const totalTasks = allTasks?.length || 0
    const totalCompleted = completedTasks?.length || 0
    const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0

    // Count by type
    const byType: Record<string, number> = {
      habit: 0,
      daily: 0,
      todo: 0,
    }

    // Count by difficulty
    const byDifficulty: Record<string, number> = {
      trivial: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    }

    for (const task of completedTasks || []) {
      const taskType = task.type
      const taskDifficulty = task.difficulty

      if (taskType && byType[taskType] !== undefined) {
        byType[taskType] = (byType[taskType] || 0) + 1
      }
      if (taskDifficulty && byDifficulty[taskDifficulty] !== undefined) {
        byDifficulty[taskDifficulty] = (byDifficulty[taskDifficulty] || 0) + 1
      }
    }

    return {
      totalCompleted,
      completionRate,
      byType: {
        habit: byType.habit || 0,
        daily: byType.daily || 0,
        todo: byType.todo || 0,
      },
      byDifficulty: {
        trivial: byDifficulty.trivial || 0,
        easy: byDifficulty.easy || 0,
        medium: byDifficulty.medium || 0,
        hard: byDifficulty.hard || 0,
      },
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get streak data and statistics
 */
export async function getStreakData(): Promise<GetStreakDataResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get all streaks
    const { data: streaksData, error: streaksError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .order('current_streak', { ascending: false })

    if (streaksError) throw streaksError

    const streaks = (streaksData || []).map(mapStreak)

    // Get current active streaks (streak > 0)
    const currentStreaks = streaks.filter((s: any) => s.currentStreak > 0)

    // Find longest streak
    const longestStreak =
      streaks.length > 0
        ? streaks.reduce((max: any, s: any) => (s.bestStreak > max.bestStreak ? s : max))
        : null

    // Calculate total active days from habit logs
    const { data: habitLogsData, error: habitLogsError } = await supabase
      .from('habit_logs')
      .select('logged_at')
      .eq('user_id', user.id)
      .eq('is_positive', true)

    if (habitLogsError) throw habitLogsError

    // Get unique dates
    const uniqueDates = new Set(
      (habitLogsData || []).map((log: any) => log.logged_at.split('T')[0])
    )

    // Also count completed tasks dates
    const { data: completedTasksData, error: completedTasksError } = await supabase
      .from('tasks')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .not('completed_at', 'is', null)
      .returns<Array<{ completed_at: string | null }>>()

    if (completedTasksError) throw completedTasksError

    for (const task of completedTasksData || []) {
      if (task.completed_at) {
        uniqueDates.add(task.completed_at.split('T')[0])
      }
    }

    const totalActiveDays = uniqueDates.size

    return {
      currentStreaks,
      longestStreak,
      totalActiveDays,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Helper function to group transactions by time interval
 */
function groupByInterval(
  transactions: Array<{ created_at: string; amount: number }>,
  interval: 'day' | 'week' | 'month'
): Array<{ date: string; xp: number }> {
  const grouped = new Map<string, number>()

  for (const transaction of transactions) {
    const date = new Date(transaction.created_at)
    let key: string = ''

    switch (interval) {
      case 'day':
        key = date.toISOString().split('T')[0] || ''
        break
      case 'week':
        // Get ISO week number
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0] || ''
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
    }

    if (key) {
      grouped.set(key, (grouped.get(key) || 0) + transaction.amount)
    }
  }

  return Array.from(grouped.entries())
    .map(([date, xp]) => ({ date, xp }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
