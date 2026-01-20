/**
 * Timeline Configuration Constants
 *
 * Centralized configuration for timeline visualization behavior.
 * Allows tuning of proficiency progression and decay without code changes.
 */

export const TIMELINE_CONFIG = {
  /**
   * Duration in months for skill proficiency to decay from max to zero
   * after an experience ends.
   */
  DECAY_DURATION_MONTHS: 24,

  /**
   * Whether to use logarithmic (true) or linear (false) progression
   * during experience duration.
   *
   * Logarithmic: Rapid early growth, plateau later
   * Linear: Constant rate of growth
   */
  USE_LOGARITHMIC_PROGRESSION: false,

  /**
   * Whether to use exponential (true) or linear (false) decay
   * after experience ends.
   *
   * Exponential: Slower initial decay, accelerating over time
   * Linear: Constant rate of decay
   */
  USE_EXPONENTIAL_DECAY: false,
} as const;

export type TimelineConfig = typeof TIMELINE_CONFIG;
