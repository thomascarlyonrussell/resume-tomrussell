/**
 * Date Utilities for Timeline Calculations
 *
 * Helper functions for computing time durations and differences
 * in the context of skill proficiency calculations.
 */

import type { Experience } from '@/data/types';

/**
 * Calculate the number of months between two dates
 *
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format
 * @returns Number of months (always non-negative)
 */
export function monthsSince(startDate: string, endDate: string): number {
  const [startYear, startMonth] = startDate.split('-').map(Number);
  const [endYear, endMonth] = endDate.split('-').map(Number);

  const months = (endYear - startYear) * 12 + (endMonth - startMonth);
  return Math.max(0, months);
}

/**
 * Calculate the total duration of an experience in months
 *
 * @param experience - Experience object with startDate and optional endDate
 * @param referenceDate - Reference date for ongoing experiences (defaults to current date)
 * @returns Number of months for the experience duration
 */
export function experienceDurationMonths(
  experience: Experience,
  referenceDate: Date = new Date()
): number {
  const endDateStr = experience.endDate
    ? experience.endDate
    : `${referenceDate.getFullYear()}-${String(referenceDate.getMonth() + 1).padStart(2, '0')}`;

  return monthsSince(experience.startDate, endDateStr);
}

/**
 * Parse a YYYY-MM date string into year and month components
 *
 * @param dateStr - Date string in YYYY-MM format
 * @returns Object with year and month properties
 */
export function parseYearMonth(dateStr: string): { year: number; month: number } {
  const [year, month] = dateStr.split('-').map(Number);
  return { year, month };
}

/**
 * Convert year and month to YYYY-MM string format
 *
 * @param year - Year number
 * @param month - Month number (1-12)
 * @returns Date string in YYYY-MM format
 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Check if a date falls within an experience period
 *
 * @param dateStr - Date to check in YYYY-MM format
 * @param experience - Experience object
 * @returns True if the date is within the experience period
 */
export function isDateWithinExperience(dateStr: string, experience: Experience): boolean {
  if (dateStr < experience.startDate) return false;
  if (experience.endDate && dateStr > experience.endDate) return false;
  return true;
}

/**
 * Check if a date is after an experience has ended
 *
 * @param dateStr - Date to check in YYYY-MM format
 * @param experience - Experience object
 * @returns True if the date is after the experience ended
 */
export function isDateAfterExperience(dateStr: string, experience: Experience): boolean {
  return experience.endDate !== null &&
         experience.endDate !== undefined &&
         dateStr > experience.endDate;
}
