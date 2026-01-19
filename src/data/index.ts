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
import { computeSkill } from '@/lib/skill-computation';

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
 * Creates monthly data points showing active skill counts per category over time.
 * Uses computeSkill() to derive skill timelines from experiences.
 */
export function generateTimelineData(
  startYear: number = 2009,
  endYear: number = new Date().getFullYear()
): TimelineDataPoint[] {
  const dataPoints: TimelineDataPoint[] = [];

  // Compute all skills once to get their timelines
  const computedSkills = getAllComputedSkills();

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

      // Count active skills per category at this point in time
      for (const category of categories) {
        const activeCount = computedSkills.filter((skill) => {
          if (skill.category !== category.id) return false;
          if (!skill.startDate || skill.startDate > dateStr) return false;
          if (skill.endDate && skill.endDate < dateStr) return false;
          return true;
        }).length;

        dataPoint[category.id] = activeCount;
      }

      dataPoints.push(dataPoint);
    }
  }

  return dataPoints;
}

/**
 * Get skills active at a specific date (for timeline hover)
 *
 * Uses computeSkill() to derive skill timelines and proficiency from experiences.
 */
export function getSkillsAtDate(dateStr: string): TimelineSkillInfo[] {
  // Compute all skills to get their timelines and proficiency
  const computedSkills = getAllComputedSkills();

  return computedSkills
    .filter((skill) => {
      if (!skill.startDate || skill.startDate > dateStr) return false;
      if (skill.endDate && skill.endDate < dateStr) return false;
      if (!skill.proficiency) return false; // Skip skills without proficiency
      return true;
    })
    .map((skill) => ({
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      proficiency: Math.round(skill.proficiency!) as ProficiencyLevel,
    }));
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
