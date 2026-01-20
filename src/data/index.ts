/**
 * Data Layer Index
 *
 * Unified exports and computed helpers for all data modules.
 */

// Re-export types
export * from './types';

// Re-export data
export {
  categories,
  categoryMap,
  getCategory,
  getCategoryColor,
  getCategoryIds,
} from './categories';
export {
  skills,
  getSkill,
  getSkillsByCategory,
  getSkillsBySubcategory,
  getSubcategories,
} from './skills';
export {
  experience,
  getExperience,
  getCurrentExperience,
  getExperienceByCompany,
  getTotalYearsOfExperience,
} from './experience';
export {
  milestones,
  getMilestone,
  getMilestonesBySkill,
  getMilestonesInRange,
  getMilestonesSorted,
} from './milestones';
export {
  publications,
  getPublication,
  getPublicationsByType,
  getDatedPublications,
} from './publications';
export {
  education,
  certifications,
  getEducation,
  getCertification,
  getHighestDegree,
  getActiveCertifications,
} from './education';
export { professionalSummary, careerHighlights, workPhilosophy } from './professional-summary';
export type { ProfessionalSummary, CareerHighlights, WorkPhilosophy } from './professional-summary';
// Import for computed helpers
import { skills } from './skills';
import { experience } from './experience';
import { categories, categoryMap } from './categories';
import { milestones } from './milestones';
import type {
  Skill,
  ComputedSkill,
  CategoryId,
  TimelineDataPoint,
  TimelineSkillInfo,
  ProficiencyLevel,
} from './types';
import { isSkillActive } from '@/lib/calculations';
import { computeSkill, calculateSkillProficiencyAtDate } from '@/lib/skill-computation';

// ============================================================================
// Computed Skill Helpers
// ============================================================================

/**
 * Get all skills with computed properties from experiences
 *
 * This is the canonical approach: derive all skill properties from experiences.
 */
export function getAllComputedSkills(referenceDate: Date = new Date()): ComputedSkill[] {
  return skills.map((skill) => computeSkill(skill, experience, referenceDate));
}

/**
 * Get active skills (reference-only)
 */
export function getActiveSkills(): Skill[] {
  return skills.filter((s) => isSkillActive(s.endDate));
}

/**
 * Get inactive (ended) skills (reference-only)
 */
export function getInactiveSkills(): Skill[] {
  return skills.filter((s) => !isSkillActive(s.endDate));
}

// ============================================================================
// Category Grouping Helpers
// ============================================================================

/**
 * Group skills by category
 */
export function getSkillsGroupedByCategory(): Record<CategoryId, Skill[]> {
  const grouped = {} as Record<CategoryId, Skill[]>;

  for (const category of categories) {
    grouped[category.id] = skills.filter((s) => s.category === category.id);
  }

  return grouped;
}

/**
 * Get category skill counts
 */
export function getCategorySkillCounts(): Record<CategoryId, number> {
  const grouped = getSkillsGroupedByCategory();
  const counts = {} as Record<CategoryId, number>;

  for (const [categoryId, categorySkills] of Object.entries(grouped)) {
    counts[categoryId as CategoryId] = categorySkills.length;
  }

  return counts;
}

/**
 * Get category with computed totals
 */
export function getCategoryStats(categoryId: CategoryId) {
  const computedSkills = getAllComputedSkills();
  const categorySkills = computedSkills.filter((s) => s.category === categoryId);
  const category = categoryMap[categoryId];

  const activeSkills = categorySkills.filter((s) => s.isActive);
  const totalProficiency = categorySkills.reduce((sum, s) => sum + (s.proficiency || 0), 0);

  return {
    ...category,
    skillCount: categorySkills.length,
    activeSkillCount: activeSkills.length,
    totalProficiency,
    averageProficiency: categorySkills.length > 0 ? totalProficiency / categorySkills.length : 0,
  };
}

// ============================================================================
// Timeline Data Helpers
// ============================================================================

/**
 * Generate timeline data points for the stacked area chart
 *
 * Creates monthly data points showing cumulative proficiency per category over time.
 * Uses calculateSkillProficiencyAtDate() with linear progression during experiences
 * and linear decay after experiences end.
 *
 * Y-axis values represent "Cumulative Proficiency" (sum of all skill proficiency
 * contributions), not "Active Skill Count" as in the previous implementation.
 */
export function generateTimelineData(
  startYear: number = 2009,
  endYear: number = new Date().getFullYear()
): TimelineDataPoint[] {
  const dataPoints: TimelineDataPoint[] = [];

  // Get all skills for proficiency calculation
  const allSkills = skills;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      // Skip future months in current year
      if (year === endYear && month > new Date().getMonth() + 1) {
        break;
      }

      const dateStr = `${year}-${month.toString().padStart(2, '0')}`;
      const dataPoint: TimelineDataPoint = {
        date: dateStr,
        year,
        month,
      };

      // Calculate cumulative proficiency per category at this point in time
      for (const category of categories) {
        let categoryProficiency = 0;

        // Sum proficiency contributions from all skills in this category
        for (const skill of allSkills) {
          if (skill.category !== category.id) continue;

          const proficiency = calculateSkillProficiencyAtDate(
            skill,
            dateStr,
            experience
          );
          categoryProficiency += proficiency;
        }

        dataPoint[category.id] = Math.round(categoryProficiency * 10) / 10; // Round to 1 decimal
      }

      dataPoints.push(dataPoint);
    }
  }

  return dataPoints;
}

/**
 * Skill-level timeline data point for drill-down view
 */
export interface SkillTimelineDataPoint {
  date: string;
  year: number;
  month: number;
  [skillId: string]: number | string; // Proficiency values per skill
}

/**
 * Generate skill-level timeline data for a specific category (drill-down view)
 *
 * Returns timeline data with individual skill proficiency values instead of
 * category aggregates. Used when user clicks a category to see individual skills.
 *
 * @param categoryId - Category to drill down into
 * @param startYear - Start year for timeline (default: 2009)
 * @param endYear - End year for timeline (default: current year)
 * @returns Array of data points with proficiency per skill
 */
export function generateSkillTimelineData(
  categoryId: CategoryId,
  startYear: number = 2009,
  endYear: number = new Date().getFullYear()
): SkillTimelineDataPoint[] {
  const dataPoints: SkillTimelineDataPoint[] = [];

  // Get all skills in this category
  const categorySkills = skills.filter((s) => s.category === categoryId);

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      // Skip future months in current year
      if (year === endYear && month > new Date().getMonth() + 1) {
        break;
      }

      const dateStr = `${year}-${month.toString().padStart(2, '0')}`;
      const dataPoint: SkillTimelineDataPoint = {
        date: dateStr,
        year,
        month,
      };

      // Calculate proficiency for each skill in this category
      for (const skill of categorySkills) {
        const proficiency = calculateSkillProficiencyAtDate(
          skill,
          dateStr,
          experience
        );
        dataPoint[skill.id] = Math.round(proficiency * 10) / 10;
      }

      dataPoints.push(dataPoint);
    }
  }

  return dataPoints;
}

/**
 * Get skills in a category sorted by first appearance (for consistent rendering)
 *
 * @param categoryId - Category to get skills for
 * @returns Skills sorted by their first appearance date (earliest first)
 */
export function getCategorySkillsSorted(categoryId: CategoryId): Skill[] {
  const categorySkills = skills.filter((s) => s.category === categoryId);
  const computedSkills = getAllComputedSkills();

  return categorySkills.sort((a, b) => {
    const aComputed = computedSkills.find((s) => s.id === a.id);
    const bComputed = computedSkills.find((s) => s.id === b.id);
    const aStart = aComputed?.startDate ?? '9999-99';
    const bStart = bComputed?.startDate ?? '9999-99';
    return aStart.localeCompare(bStart);
  });
}

/**
 * Extended skill info that includes calculated proficiency at a specific date
 */
export interface TimelineSkillInfoWithProficiency extends TimelineSkillInfo {
  /** Calculated proficiency at the queried date (continuous value) */
  calculatedProficiency: number;
}

/**
 * Get skills active at a specific date (for timeline hover)
 *
 * Uses calculateSkillProficiencyAtDate() to get the proficiency value
 * at the specific date point, including progression and decay effects.
 */
export function getSkillsAtDate(dateStr: string): TimelineSkillInfoWithProficiency[] {
  const result: TimelineSkillInfoWithProficiency[] = [];

  for (const skill of skills) {
    const proficiency = calculateSkillProficiencyAtDate(skill, dateStr, experience);

    // Only include skills with non-zero proficiency at this date
    if (proficiency > 0) {
      result.push({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        proficiency: Math.min(8, Math.max(1, Math.round(proficiency))) as ProficiencyLevel,
        calculatedProficiency: Math.round(proficiency * 10) / 10,
      });
    }
  }

  // Sort by proficiency descending
  return result.sort((a, b) => b.calculatedProficiency - a.calculatedProficiency);
}

/**
 * Get milestones at or near a specific date (for timeline markers)
 */
export function getMilestonesNearDate(dateStr: string, monthRange: number = 3) {
  const targetDate = new Date(dateStr + '-01');
  const rangeMs = monthRange * 30 * 24 * 60 * 60 * 1000;

  return milestones.filter((milestone) => {
    const milestoneDate = new Date(milestone.date + '-01');
    const diff = Math.abs(milestoneDate.getTime() - targetDate.getTime());
    return diff <= rangeMs;
  });
}

// ============================================================================
// Summary Statistics
// ============================================================================

/**
 * Get overall portfolio statistics
 */
export function getPortfolioStats() {
  const computedSkills = getAllComputedSkills();
  const activeSkills = computedSkills.filter((s) => s.isActive);

  return {
    totalSkills: skills.length,
    activeSkills: activeSkills.length,
    inactiveSkills: skills.length - activeSkills.length,
    totalCategories: categories.length,
    totalMilestones: milestones.length,
    categoryBreakdown: getCategorySkillCounts(),
  };
}
