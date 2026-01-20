/**
 * Skill Computation Utilities
 *
 * Helper functions for deriving skill properties from experiences.
 * In the new model, skills are reference data only, and all timeline/proficiency
 * information is computed from the experiences that reference them.
 */

import type {
  Experience,
  ExperienceSkill,
  ComputedSkill,
  SkillTimelinePoint,
  ProficiencyLevel,
  CategoryId,
} from '../data/types';
import { DEGRADATION_FACTORS } from '../data/types';
import { TIMELINE_CONFIG } from './timeline-config';
import {
  monthsSince,
  experienceDurationMonths,
  isDateWithinExperience,
  isDateAfterExperience,
} from './date-utils';

/**
 * Get all experiences that use a specific skill
 *
 * @param skillId - The skill ID to search for
 * @param experiences - Array of all experiences
 * @returns Array of experiences that reference this skill
 */
export function getExperiencesForSkill(
  skillId: string,
  experiences: Experience[],
): Experience[] {
  return experiences.filter((exp) => {
    // Check if skillIds array exists and includes this skill (legacy format)
    if (exp.skillIds && exp.skillIds.includes(skillId)) {
      return true;
    }
    // Check if skills array exists and includes this skill (new format)
    if ('skills' in exp) {
      const skills = exp.skills as ExperienceSkill[] | undefined;
      return skills?.some((s) => s.skillId === skillId) ?? false;
    }
    return false;
  });
}

/**
 * Compute skill timeline from experiences
 *
 * @param skillId - The skill ID
 * @param experiences - Array of all experiences
 * @returns Timeline with start date, end date, and active status
 */
export function computeSkillTimeline(
  skillId: string,
  experiences: Experience[],
): {
  startDate?: string;
  endDate?: string;
  isActive: boolean;
} {
  const skillExperiences = getExperiencesForSkill(skillId, experiences);

  if (skillExperiences.length === 0) {
    return {
      startDate: undefined,
      endDate: undefined,
      isActive: false,
    };
  }

  // Find earliest start date
  const startDates = skillExperiences
    .map((exp) => exp.startDate)
    .filter((date): date is string => date !== null && date !== undefined)
    .sort();
  const startDate = startDates[0];

  // Check if any experience is currently active (no end date)
  const hasActiveExperience = skillExperiences.some(
    (exp) => !exp.endDate || exp.endDate === null,
  );

  // If active, endDate is undefined; otherwise, find latest end date
  let endDate: string | undefined;
  if (!hasActiveExperience) {
    const endDates = skillExperiences
      .map((exp) => exp.endDate)
      .filter((date): date is string => date !== null && date !== undefined)
      .sort();
    endDate = endDates[endDates.length - 1];
  }

  return {
    startDate,
    endDate,
    isActive: hasActiveExperience,
  };
}

/**
 * Calculate duration in months between two YYYY-MM formatted dates
 *
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format, or null for current date
 * @param referenceDate - Reference date for "current" (defaults to now)
 * @returns Number of months
 */
function calculateDurationInMonths(
  startDate: string,
  endDate: string | null | undefined,
  referenceDate: Date = new Date(),
): number {
  const [startYear, startMonth] = startDate.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1);

  let end: Date;
  if (!endDate || endDate === null) {
    end = referenceDate;
  } else {
    const [endYear, endMonth] = endDate.split('-').map(Number);
    end = new Date(endYear, endMonth - 1);
  }

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(0, months);
}

/**
 * Compute degradation factor based on time since last use
 *
 * @param lastUsedDate - Most recent end date, or null if currently active
 * @param referenceDate - Reference date for "now" (defaults to current date)
 * @returns Degradation factor (1.0, 0.5, or 0.25)
 */
export function getDegradationFactor(
  lastUsedDate: Date | null,
  referenceDate: Date = new Date(),
): number {
  // Currently active or no end date
  if (!lastUsedDate) {
    return DEGRADATION_FACTORS.ACTIVE;
  }

  const yearsSinceLastUse =
    (referenceDate.getTime() - lastUsedDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);

  if (yearsSinceLastUse < 2) {
    return DEGRADATION_FACTORS.ACTIVE; // <2 years
  } else if (yearsSinceLastUse < 5) {
    return DEGRADATION_FACTORS.RECENT; // 2-5 years
  } else {
    return DEGRADATION_FACTORS.OLD; // >5 years
  }
}

/**
 * Calculate weighted average proficiency with degradation for inactive skills
 *
 * Formula: proficiency = (sum(exp_proficiency × exp_duration) / total_duration) × degradation_factor
 *
 * @param skillId - The skill ID
 * @param experiences - Array of all experiences
 * @param referenceDate - Reference date for calculations (defaults to now)
 * @returns Weighted average proficiency with degradation, or undefined if no experiences
 */
export function getSkillProficiency(
  skillId: string,
  experiences: Experience[],
  referenceDate: Date = new Date(),
): number | undefined {
  const skillExperiences = getExperiencesForSkill(skillId, experiences);

  if (skillExperiences.length === 0) {
    return undefined;
  }

  let totalWeightedProficiency = 0;
  let totalDuration = 0;
  let mostRecentEndDate: Date | null = null;

  for (const exp of skillExperiences) {
    // Get proficiency for this skill in this experience
    let proficiency: number | undefined;

    // Check new format first
    if ('skills' in exp) {
      const skills = exp.skills as ExperienceSkill[] | undefined;
      const skillEntry = skills?.find((s) => s.skillId === skillId);
      proficiency = skillEntry?.proficiency;
    }

    // If no proficiency found and we have skillIds (legacy), we can't compute
    // This will be handled during migration
    if (proficiency === undefined) {
      continue;
    }

    // Calculate duration for this experience
    const duration = calculateDurationInMonths(
      exp.startDate,
      exp.endDate,
      referenceDate,
    );

    totalWeightedProficiency += proficiency * duration;
    totalDuration += duration;

    // Track most recent end date
    if (exp.endDate && exp.endDate !== null) {
      const [endYear, endMonth] = exp.endDate.split('-').map(Number);
      const endDate = new Date(endYear, endMonth - 1);
      if (!mostRecentEndDate || endDate > mostRecentEndDate) {
        mostRecentEndDate = endDate;
      }
    } else {
      // Currently active, so no end date
      mostRecentEndDate = null;
    }
  }

  // If no valid duration, return undefined
  if (totalDuration === 0) {
    return undefined;
  }

  // Calculate base weighted average
  const baseWeightedAverage = totalWeightedProficiency / totalDuration;

  // Apply degradation factor
  const degradationFactor = getDegradationFactor(
    mostRecentEndDate,
    referenceDate,
  );

  return baseWeightedAverage * degradationFactor;
}

/**
 * Get proficiency history for a skill over time
 *
 * @param skillId - The skill ID
 * @param experiences - Array of all experiences
 * @returns Array of timeline points showing proficiency at different points in time
 */
export function getSkillProficiencyHistory(
  skillId: string,
  experiences: Experience[],
): SkillTimelinePoint[] {
  const skillExperiences = getExperiencesForSkill(skillId, experiences);

  const points: SkillTimelinePoint[] = [];

  for (const exp of skillExperiences) {
    // Get proficiency for this skill in this experience
    let proficiency: ProficiencyLevel | undefined;

    if ('skills' in exp) {
      const skills = exp.skills as ExperienceSkill[] | undefined;
      const skillEntry = skills?.find((s) => s.skillId === skillId);
      proficiency = skillEntry?.proficiency;
    }

    if (proficiency !== undefined) {
      points.push({
        date: exp.startDate,
        experienceId: exp.id,
        proficiency,
      });
    }
  }

  // Sort by date
  points.sort((a, b) => a.date.localeCompare(b.date));

  return points;
}

/**
 * Compute ComputedSkill from base skill data and experiences
 *
 * @param skill - Base skill object with reference data
 * @param experiences - Array of all experiences
 * @param referenceDate - Reference date for calculations (defaults to now)
 * @returns Computed skill with all derived properties
 */
export function computeSkill(
  skill: { id: string; name: string; category: CategoryId; subcategory: string; description?: string },
  experiences: Experience[],
  referenceDate: Date = new Date(),
): ComputedSkill {
  const timeline = computeSkillTimeline(skill.id, experiences);
  const proficiency = getSkillProficiency(skill.id, experiences, referenceDate);
  const skillExperiences = getExperiencesForSkill(skill.id, experiences);

  // Calculate years of experience
  let yearsOfExperience = 0;
  if (timeline.startDate) {
    const endDateForCalc = timeline.endDate || new Date().toISOString().slice(0, 7);
    yearsOfExperience = calculateDurationInMonths(
      timeline.startDate,
      endDateForCalc,
      referenceDate,
    ) / 12;
  }

  // Calculate degradation factor
  let degradationFactor: number = DEGRADATION_FACTORS.ACTIVE;
  if (!timeline.isActive && timeline.endDate) {
    const [endYear, endMonth] = timeline.endDate.split('-').map(Number);
    const lastUsedDate = new Date(endYear, endMonth - 1);
    degradationFactor = getDegradationFactor(lastUsedDate, referenceDate);
  }

  // Calculate Fibonacci size using the same formula as the spec
  // size = proficiency × weighted_years
  // where weighted_years = years_of_experience × (proficiency / 8)
  const effectiveProficiency = proficiency ?? 0;
  const weightedYears = yearsOfExperience * (effectiveProficiency / 8);
  const fibonacciSize = effectiveProficiency * weightedYears;

  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    subcategory: skill.subcategory,
    description: skill.description,
    startDate: timeline.startDate,
    endDate: timeline.endDate,
    isActive: timeline.isActive,
    proficiency,
    yearsOfExperience,
    experiences: skillExperiences,
    fibonacciSize,
    degradationFactor,
  };
}

/**
 * Calculate a skill's proficiency contribution at a specific date
 *
 * This function calculates the cumulative proficiency from all experiences
 * that contributed to this skill, using:
 * - Linear progression during experience (0 → target proficiency)
 * - Linear decay after experience (target → 0 over DECAY_DURATION_MONTHS)
 *
 * @param skill - ComputedSkill object (or skill with id)
 * @param date - Target date in YYYY-MM format
 * @param experiences - Array of all experiences
 * @returns Cumulative proficiency value at the given date
 */
export function calculateSkillProficiencyAtDate(
  skill: { id: string },
  date: string,
  experiences: Experience[]
): number {
  const skillExperiences = getExperiencesForSkill(skill.id, experiences);

  if (skillExperiences.length === 0) {
    return 0;
  }

  let totalProficiency = 0;

  for (const exp of skillExperiences) {
    // Get proficiency for this skill in this experience
    let targetProficiency: number | undefined;

    if ('skills' in exp) {
      const skills = exp.skills as ExperienceSkill[] | undefined;
      const skillEntry = skills?.find((s) => s.skillId === skill.id);
      targetProficiency = skillEntry?.proficiency;
    }

    if (targetProficiency === undefined) {
      continue;
    }

    // Calculate contribution based on timing
    if (isDateWithinExperience(date, exp)) {
      // During experience: linear progression from 0 to target
      const monthsIntoExp = monthsSince(exp.startDate, date);
      const totalExpMonths = experienceDurationMonths(exp);

      if (totalExpMonths > 0) {
        const progressRatio = Math.min(1, monthsIntoExp / totalExpMonths);

        if (TIMELINE_CONFIG.USE_LOGARITHMIC_PROGRESSION) {
          // Logarithmic: rapid early growth, plateau later
          // log(1 + x) / log(2) normalized to 0-1 range
          totalProficiency += targetProficiency * (Math.log(1 + progressRatio) / Math.log(2));
        } else {
          // Linear: constant rate of growth
          totalProficiency += targetProficiency * progressRatio;
        }
      }
    } else if (isDateAfterExperience(date, exp)) {
      // After experience: linear decay from target to 0 over decay duration
      const monthsSinceEnd = monthsSince(exp.endDate!, date);
      const decayDuration = TIMELINE_CONFIG.DECAY_DURATION_MONTHS;

      if (TIMELINE_CONFIG.USE_EXPONENTIAL_DECAY) {
        // Exponential decay: slower initial, faster over time
        const decayRatio = Math.exp(-3 * monthsSinceEnd / decayDuration);
        totalProficiency += targetProficiency * Math.max(0, decayRatio);
      } else {
        // Linear decay: constant rate
        const decayRatio = 1 - monthsSinceEnd / decayDuration;
        if (decayRatio > 0) {
          totalProficiency += targetProficiency * decayRatio;
        }
      }
    }
    // Before experience: contributes 0 (skill not yet acquired)
  }

  return totalProficiency;
}
