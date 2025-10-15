/**
 * Theme timing constants for animations and transitions.
 * Units are milliseconds (ms).
 */
export const timing = {
  /**
   * The duration (ms) for quick animations.
   */
  quick: 300,

  /**
   * The duration (ms) for standard animations.
   */
  normal: 450,

  /**
   * The duration (ms) for deliberate/slow animations.
   */
  slow: 700,
} as const

export type Timing = typeof timing
