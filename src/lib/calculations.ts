/**
 * Fibonacci Sizing Calculations
 *
 * Implements the sizing algorithm for the Fibonacci spiral visualization.
 *
 * Formula: size = proficiency × weighted_years × degradation_factor
 * - proficiency: Base Fibonacci value (1, 2, 3, 5, or 8)
 * - weighted_years: years_of_experience × (proficiency / 8)
 * - degradation_factor: 1.0 (active/<2yr), 0.5 (2-5yr), 0.25 (>5yr)
 *
 * Result is mapped to nearest Fibonacci value: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */

import type {
  FibonacciSizeInput,
  FibonacciSizeResult,
  FibonacciValue,
  ProficiencyLevel,
} from '@/data/types';
import { FIBONACCI_SEQUENCE, DEGRADATION_FACTORS } from '@/data/types';

/**
 * Parse a YYYY-MM date string into a Date object
 */
export function parseYearMonth(dateStr: string): Date {
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1); // month is 0-indexed
}

/**
 * Calculate years between two dates
 */
export function calculateYearsBetween(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, years);
}

/**
 * Calculate years since a date ended (for degradation)
 */
export function calculateYearsSinceEnd(endDate: Date, referenceDate: Date): number {
  return calculateYearsBetween(endDate, referenceDate);
}

/**
 * Determine if a skill is currently active
 */
export function isSkillActive(endDate?: string | null): boolean {
  return !endDate;
}

/**
 * Calculate the degradation factor based on how long ago a skill was used
 *
 * - Active or <2 years since end: 1.0
 * - 2-5 years since end: 0.5
 * - >5 years since end: 0.25
 */
export function calculateDegradationFactor(
  endDate?: string | null,
  referenceDate: Date = new Date()
): number {
  if (!endDate) {
    return DEGRADATION_FACTORS.ACTIVE;
  }

  const endDateObj = parseYearMonth(endDate);
  const yearsSinceEnd = calculateYearsSinceEnd(endDateObj, referenceDate);

  if (yearsSinceEnd < 2) {
    return DEGRADATION_FACTORS.ACTIVE;
  } else if (yearsSinceEnd <= 5) {
    return DEGRADATION_FACTORS.RECENT;
  } else {
    return DEGRADATION_FACTORS.OLD;
  }
}

/**
 * Calculate years of experience for a skill
 */
export function calculateYearsOfExperience(
  startDate: string,
  endDate?: string | null,
  referenceDate: Date = new Date()
): number {
  const startDateObj = parseYearMonth(startDate);
  const endDateObj = endDate ? parseYearMonth(endDate) : referenceDate;
  return calculateYearsBetween(startDateObj, endDateObj);
}

/**
 * Map a raw size value to the nearest Fibonacci number
 */
export function mapToFibonacci(rawSize: number): FibonacciValue {
  // Clamp to valid range
  if (rawSize <= 1) return 1;
  if (rawSize >= 89) return 89;

  // Find the closest Fibonacci number
  let closest: FibonacciValue = FIBONACCI_SEQUENCE[0];
  let minDiff = Math.abs(rawSize - closest);

  for (const fib of FIBONACCI_SEQUENCE) {
    const diff = Math.abs(rawSize - fib);
    if (diff < minDiff) {
      minDiff = diff;
      closest = fib;
    }
  }

  return closest;
}

/**
 * Calculate the Fibonacci size for a skill
 *
 * Formula: size = proficiency × weighted_years × degradation_factor
 * Where: weighted_years = years_of_experience × (proficiency / 8)
 */
export function calculateFibonacciSize(input: FibonacciSizeInput): FibonacciSizeResult {
  const referenceDate = input.referenceDate ?? new Date();
  const { proficiency, startDate, endDate } = input;

  // Calculate components
  const isActive = isSkillActive(endDate);
  const yearsOfExperience = calculateYearsOfExperience(startDate, endDate, referenceDate);
  const degradationFactor = calculateDegradationFactor(endDate, referenceDate);

  // Calculate weighted years: years × (proficiency / 8)
  const weightedYears = yearsOfExperience * (proficiency / 8);

  // Calculate raw size: proficiency × weighted_years × degradation_factor
  const rawSize = proficiency * weightedYears * degradationFactor;

  // Map to nearest Fibonacci number
  const fibonacciSize = mapToFibonacci(rawSize);

  return {
    rawSize,
    fibonacciSize,
    yearsOfExperience,
    degradationFactor,
    isActive,
  };
}

/**
 * Validate that a proficiency value is a valid Fibonacci base (1, 2, 3, 5, or 8)
 */
export function isValidProficiency(value: number): value is ProficiencyLevel {
  return [1, 2, 3, 5, 8].includes(value);
}

/**
 * Get proficiency label for display
 * Accepts both discrete ProficiencyLevel and continuous number values
 */
export function getProficiencyLabel(proficiency: ProficiencyLevel | number): string {
  const labels: Record<ProficiencyLevel, string> = {
    1: 'Beginner',
    2: 'Familiar',
    3: 'Competent',
    5: 'Proficient',
    8: 'Expert',
  };

  // If continuous value, round to nearest Fibonacci proficiency level
  if (![1, 2, 3, 5, 8].includes(proficiency)) {
    const validProficiencies: ProficiencyLevel[] = [1, 2, 3, 5, 8];
    const nearest = validProficiencies.reduce((prev, curr) =>
      Math.abs(curr - proficiency) < Math.abs(prev - proficiency) ? curr : prev
    );
    return labels[nearest];
  }

  return labels[proficiency as ProficiencyLevel];
}

/**
 * Format years of experience for display
 */
export function formatYearsOfExperience(years: number): string {
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const roundedYears = Math.round(years * 10) / 10;
  return `${roundedYears} year${roundedYears !== 1 ? 's' : ''}`;
}
