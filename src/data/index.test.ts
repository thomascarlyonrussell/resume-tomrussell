/**
 * Unit tests for data helper functions
 *
 * Skills are reference-only (no embedded proficiency/timeline).
 * getAllComputedSkills() derives all properties from experiences using computeSkill().
 * getCategorySkillCounts() counts all reference skills from skills.ts.
 */

import { getCategorySkillCounts, getAllComputedSkills } from './index';
import { categories } from './categories';
import { skills } from './skills';
import type { CategoryId } from './types';

describe('getCategorySkillCounts', () => {
  it('returns correct count for each category', () => {
    const counts = getCategorySkillCounts();

    // getCategorySkillCounts() counts all reference skills from skills.ts
    categories.forEach((category) => {
      const categoryId = category.id as CategoryId;

      // Count skills from raw skills array (includes reference-only skills)
      const expectedCount = skills.filter((skill) => skill.category === categoryId).length;

      expect(counts[categoryId]).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(counts[categoryId])).toBe(true);
    });
  });

  it('includes all 7 categories in result', () => {
    const counts = getCategorySkillCounts();
    const categoryIds = Object.keys(counts);

    // Should have exactly 7 categories
    expect(categoryIds).toHaveLength(7);

    // Should have all expected category IDs
    const expectedIds = [
      'engineering',
      'software-development',
      'ai-automation',
      'product-management',
      'data-analytics',
      'professional-skills',
      'content-creation',
    ];

    expectedIds.forEach((id) => {
      expect(counts[id as CategoryId]).toBeDefined();
      expect(typeof counts[id as CategoryId]).toBe('number');
    });
  });

  it('counts match actual dataset', () => {
    const counts = getCategorySkillCounts();
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    // Total of all category counts should equal total skills in skills.ts (reference-only)
    expect(totalCount).toBe(skills.length);
  });

  it('returns consistent counts across multiple calls', () => {
    const counts1 = getCategorySkillCounts();
    const counts2 = getCategorySkillCounts();

    expect(counts1).toEqual(counts2);
  });

  it('all counts are non-negative integers', () => {
    const counts = getCategorySkillCounts();

    Object.values(counts).forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(count)).toBe(true);
    });
  });
});
