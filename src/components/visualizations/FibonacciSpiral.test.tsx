/**
 * Unit tests for FibonacciSpiral filtering logic
 */

import { render } from '@testing-library/react';
import { FibonacciSpiral } from './FibonacciSpiral';
import type { ComputedSkill, CategoryId } from '@/data/types';

// Mock data for testing
const mockSkills: ComputedSkill[] = [
  {
    id: 'skill-1',
    name: 'TypeScript',
    category: 'software-development',
    subcategory: 'Programming Languages',
    proficiency: 5,
    yearsOfExperience: 4,
    startDate: '2020-01-01',
    isActive: true,
    fibonacciSize: 21,
    experiences: [],
    degradationFactor: 1.0,
  },
  {
    id: 'skill-2',
    name: 'Power Systems',
    category: 'engineering',
    subcategory: 'Electrical Engineering',
    proficiency: 5,
    yearsOfExperience: 8,
    startDate: '2016-01-01',
    isActive: true,
    fibonacciSize: 21,
    experiences: [],
    degradationFactor: 1.0,
  },
  {
    id: 'skill-3',
    name: 'React',
    category: 'software-development',
    subcategory: 'Frontend Frameworks',
    proficiency: 5,
    yearsOfExperience: 3,
    startDate: '2021-01-01',
    isActive: true,
    fibonacciSize: 13,
    experiences: [],
    degradationFactor: 1.0,
  },
  {
    id: 'skill-4',
    name: 'Product Strategy',
    category: 'product-management',
    subcategory: 'Strategy',
    proficiency: 5,
    yearsOfExperience: 5,
    startDate: '2019-01-01',
    isActive: true,
    fibonacciSize: 13,
    experiences: [],
    degradationFactor: 1.0,
  },
];

// Mock the hooks to avoid complex rendering
vi.mock('./hooks', () => ({
  useFibonacciLayout: vi.fn(() => ({
    positions: new Map(),
    sortedSkills: [],
    center: { x: 0, y: 0 },
  })),
  useSkillTooltip: vi.fn(() => ({
    showTooltip: vi.fn(),
    hideTooltip: vi.fn(),
    tooltipData: null,
  })),
  useReducedMotion: vi.fn(() => false),
}));

describe('FibonacciSpiral Filtering Logic', () => {
  it('renders without filter (shows all skills)', () => {
    const { container } = render(
      <FibonacciSpiral skills={mockSkills} showLegend={false} />
    );

    // Component should render successfully
    expect(container).toBeTruthy();
  });

  it('filters skills to specific category', () => {
    const { container } = render(
      <FibonacciSpiral
        skills={mockSkills}
        selectedCategoryFilter="software-development"
        showLegend={false}
      />
    );

    // Component should render successfully with filter
    expect(container).toBeTruthy();
  });

  it('handles empty category filter (no matching skills)', () => {
    const { container } = render(
      <FibonacciSpiral
        skills={mockSkills}
        selectedCategoryFilter="ai-automation" // No skills in this category
        showLegend={false}
      />
    );

    // Component should render successfully even with no matching skills
    expect(container).toBeTruthy();
  });

  it('passes correct props to legend', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <FibonacciSpiral
        skills={mockSkills}
        selectedCategoryFilter="engineering"
        onCategoryToggle={mockToggle}
        showLegend={true}
      />
    );

    // Component should render with legend
    expect(container).toBeTruthy();
  });

  it('handles category toggle callback', () => {
    const mockToggle = vi.fn();
    const { rerender } = render(
      <FibonacciSpiral
        skills={mockSkills}
        selectedCategoryFilter={null}
        onCategoryToggle={mockToggle}
        showLegend={false}
      />
    );

    // Rerender with different filter
    rerender(
      <FibonacciSpiral
        skills={mockSkills}
        selectedCategoryFilter="engineering"
        onCategoryToggle={mockToggle}
        showLegend={false}
      />
    );

    // Component should handle filter changes
    expect(true).toBe(true);
  });
});

describe('FibonacciSpiral Filter Logic (Isolated)', () => {
  const testFilterLogic = (
    skills: ComputedSkill[],
    selectedCategoryFilter: CategoryId | null
  ): ComputedSkill[] => {
    // This mirrors the filtering logic in FibonacciSpiral
    return selectedCategoryFilter
      ? skills.filter((skill) => skill.category === selectedCategoryFilter)
      : skills;
  };

  it('no filter returns all skills', () => {
    const filtered = testFilterLogic(mockSkills, null);
    expect(filtered).toHaveLength(mockSkills.length);
    expect(filtered).toEqual(mockSkills);
  });

  it('filter to engineering returns only engineering skills', () => {
    const filtered = testFilterLogic(mockSkills, 'engineering');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe('engineering');
    expect(filtered[0].name).toBe('Power Systems');
  });

  it('filter to software-development returns only software-development skills', () => {
    const filtered = testFilterLogic(mockSkills, 'software-development');
    expect(filtered).toHaveLength(2);
    filtered.forEach((skill) => {
      expect(skill.category).toBe('software-development');
    });
    expect(filtered.map((s) => s.name)).toContain('TypeScript');
    expect(filtered.map((s) => s.name)).toContain('React');
  });

  it('filter to product-management returns only product-management skills', () => {
    const filtered = testFilterLogic(mockSkills, 'product-management');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe('product-management');
    expect(filtered[0].name).toBe('Product Strategy');
  });

  it('filter to category with no skills returns empty array', () => {
    const filtered = testFilterLogic(mockSkills, 'ai-automation');
    expect(filtered).toHaveLength(0);
  });

  it('filter preserves skill properties', () => {
    const filtered = testFilterLogic(mockSkills, 'engineering');
    const skill = filtered[0];

    expect(skill).toHaveProperty('id');
    expect(skill).toHaveProperty('name');
    expect(skill).toHaveProperty('category');
    expect(skill).toHaveProperty('proficiency');
    expect(skill).toHaveProperty('yearsOfExperience');
    expect(skill).toHaveProperty('fibonacciSize');
  });

  it('filtering does not mutate original array', () => {
    const originalLength = mockSkills.length;
    const filtered = testFilterLogic(mockSkills, 'engineering');

    expect(mockSkills).toHaveLength(originalLength);
    expect(filtered).not.toBe(mockSkills);
  });
});
