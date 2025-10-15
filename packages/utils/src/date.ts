import {
  startOfDay,
  differenceInDays,
  isToday,
  isYesterday,
  parseISO,
  addDays,
  getDay,
} from 'date-fns'
import type { RepeatPattern } from '@repo/types'

/**
 * Calculate streak based on completion dates
 * A streak is maintained if tasks are completed on consecutive days
 *
 * @param lastCompletedDate - ISO date string of last completion
 * @param currentDate - Current date (defaults to now)
 * @returns Current streak count
 */
export function calculateStreak(
  lastCompletedDate: string | null | undefined,
  currentDate: Date = new Date()
): number {
  if (!lastCompletedDate) {
    return 0
  }

  const lastDate = parseISO(lastCompletedDate)
  const today = startOfDay(currentDate)
  const lastCompleted = startOfDay(lastDate)

  // If completed today, streak continues
  if (isToday(lastCompleted)) {
    return 1 // Streak is maintained, but we don't increment until tomorrow
  }

  // If completed yesterday, streak continues
  if (isYesterday(lastCompleted)) {
    return 1 // Will be incremented when completed today
  }

  // If more than 1 day has passed, streak is broken
  const daysDiff = differenceInDays(today, lastCompleted)
  if (daysDiff > 1) {
    return 0
  }

  return 1
}

/**
 * Check if a streak should be incremented based on last completion
 *
 * @param lastCompletedDate - ISO date string of last completion
 * @param currentDate - Current date (defaults to now)
 * @returns True if streak should be incremented
 */
export function shouldIncrementStreak(
  lastCompletedDate: string | null | undefined,
  currentDate: Date = new Date()
): boolean {
  if (!lastCompletedDate) {
    return true // First completion
  }

  const lastDate = parseISO(lastCompletedDate)
  const today = startOfDay(currentDate)
  const lastCompleted = startOfDay(lastDate)

  // Don't increment if already completed today
  if (isToday(lastCompleted)) {
    return false
  }

  // Increment if completed yesterday (maintaining streak)
  if (isYesterday(lastCompleted)) {
    return true
  }

  // If it's been more than a day, this is a new streak
  const daysDiff = differenceInDays(today, lastCompleted)
  return daysDiff > 1
}

/**
 * Check if a streak should be reset
 *
 * @param lastCompletedDate - ISO date string of last completion
 * @param currentDate - Current date (defaults to now)
 * @returns True if streak should be reset
 */
export function shouldResetStreak(
  lastCompletedDate: string | null | undefined,
  currentDate: Date = new Date()
): boolean {
  if (!lastCompletedDate) {
    return false
  }

  const lastDate = parseISO(lastCompletedDate)
  const today = startOfDay(currentDate)
  const lastCompleted = startOfDay(lastDate)

  // Streak is broken if more than 1 day has passed
  const daysDiff = differenceInDays(today, lastCompleted)
  return daysDiff > 1
}

/**
 * Check if daily tasks should be reset
 * Daily tasks reset at the start of each day
 *
 * @param lastResetDate - ISO date string of last reset
 * @param currentDate - Current date (defaults to now)
 * @returns True if tasks should be reset
 */
export function shouldResetDailyTasks(
  lastResetDate: string | null | undefined,
  currentDate: Date = new Date()
): boolean {
  if (!lastResetDate) {
    return true
  }

  const lastReset = startOfDay(parseISO(lastResetDate))
  const today = startOfDay(currentDate)

  return differenceInDays(today, lastReset) > 0
}

/**
 * Validate repeat pattern for daily tasks
 *
 * @param pattern - Repeat pattern to validate
 * @returns True if pattern is valid
 */
export function isValidRepeatPattern(pattern: RepeatPattern): boolean {
  // Check interval is valid
  if (!['daily', 'weekly', 'custom'].includes(pattern.interval)) {
    return false
  }

  // Check days array
  if (!Array.isArray(pattern.days)) {
    return false
  }

  // For daily interval, days should be empty or contain all days
  if (pattern.interval === 'daily') {
    return pattern.days.length === 0 || pattern.days.length === 7
  }

  // For weekly/custom, days should be 0-6 (Sunday-Saturday)
  if (pattern.days.length === 0) {
    return false
  }

  return pattern.days.every((day) => day >= 0 && day <= 6)
}

/**
 * Check if a task should be active today based on repeat pattern
 *
 * @param pattern - Repeat pattern
 * @param currentDate - Current date (defaults to now)
 * @returns True if task should be active today
 */
export function isTaskActiveToday(pattern: RepeatPattern, currentDate: Date = new Date()): boolean {
  if (!isValidRepeatPattern(pattern)) {
    return false
  }

  // Daily tasks are always active
  if (pattern.interval === 'daily') {
    return true
  }

  // Check if today's day of week is in the pattern
  const dayOfWeek = getDay(currentDate) // 0 = Sunday, 6 = Saturday
  return pattern.days.includes(dayOfWeek)
}

/**
 * Get the next active date for a task based on repeat pattern
 *
 * @param pattern - Repeat pattern
 * @param fromDate - Starting date (defaults to now)
 * @returns Next active date
 */
export function getNextActiveDate(pattern: RepeatPattern, fromDate: Date = new Date()): Date {
  if (!isValidRepeatPattern(pattern)) {
    throw new Error('Invalid repeat pattern')
  }

  // For daily tasks, next active is tomorrow
  if (pattern.interval === 'daily') {
    return addDays(startOfDay(fromDate), 1)
  }

  // Find next day that matches the pattern
  let nextDate = addDays(startOfDay(fromDate), 1)
  let attempts = 0
  const maxAttempts = 7 // Check up to a week ahead

  while (attempts < maxAttempts) {
    const dayOfWeek = getDay(nextDate)
    if (pattern.days.includes(dayOfWeek)) {
      return nextDate
    }
    nextDate = addDays(nextDate, 1)
    attempts++
  }

  // If no match found in a week, return tomorrow
  return addDays(startOfDay(fromDate), 1)
}

/**
 * Check if a date is overdue
 *
 * @param dueDate - ISO date string
 * @param currentDate - Current date (defaults to now)
 * @returns True if date is overdue
 */
export function isOverdue(dueDate: string, currentDate: Date = new Date()): boolean {
  const due = startOfDay(parseISO(dueDate))
  const today = startOfDay(currentDate)

  return due < today
}

/**
 * Get days until due date
 *
 * @param dueDate - ISO date string
 * @param currentDate - Current date (defaults to now)
 * @returns Number of days until due (negative if overdue)
 */
export function getDaysUntilDue(dueDate: string, currentDate: Date = new Date()): number {
  const due = startOfDay(parseISO(dueDate))
  const today = startOfDay(currentDate)

  return differenceInDays(due, today)
}
