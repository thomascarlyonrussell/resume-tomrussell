/**
 * Unit tests for data helper functions
 */

import { describe, it, expect } from 'vitest';
import { getCategorySkillCounts, getAllComputedSkills } from './index';
import { categories } from './categories';
import type { CategoryId } from './types';

describe('getCategorySkillCounts', () => {
  it('returns correct count for each category', () => {
    const counts = getCategorySkillCounts();
    const allSkills = getAllComputedSkills();

    // Verify each category has a count
    categories.forEach((category) => {
      const categoryId = category.id as CategoryId;
      const expectedCount = allSkills.filter((skill) => skill.category === categoryId).length;

      expect(counts[categoryId]).toBe(expectedCount);
      expect(counts[categoryId]).toBeGreaterThanOrEqual(0);
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
      'tools-platforms',
    ];

    expectedIds.forEach((id) => {
      expect(counts[id as CategoryId]).toBeDefined();
      expect(typeof counts[id as CategoryId]).toBe('number');
    });
  });

  it('counts match actual dataset', () => {
    const counts = getCategorySkillCounts();
    const allSkills = getAllComputedSkills();
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    // Total of all category counts should equal total skills
    expect(totalCount).toBe(allSkills.length);
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
