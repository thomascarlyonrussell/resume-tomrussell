import type { Category, CategoryId } from './types';

/**
 * Category definitions with colors and icons for visualizations
 *
 * Colors are designed to be distinct and accessible in both light and dark modes.
 * Icons use heroicons naming convention.
 */
export const categories: Category[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    color: '#06B6D4', // cyan-500
    icon: 'bolt',
    description:
      'Power systems engineering, electrical distribution, grid planning, and protection systems',
  },
  {
    id: 'software-development',
    name: 'Software Development',
    color: '#3B82F6', // blue-500
    icon: 'code',
    description: 'Programming languages, frameworks, version control, and DevOps tools',
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    color: '#8B5CF6', // violet-500
    icon: 'sparkles',
    description: 'AI/ML, LLMs, automation frameworks, and intelligent agents',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    color: '#10B981', // emerald-500
    icon: 'briefcase',
    description: 'Roadmapping, requirements, stakeholder management, and product strategy',
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    color: '#F59E0B', // amber-500
    icon: 'chart-bar',
    description: 'Data analysis, forecasting, databases, and query languages',
  },
  {
    id: 'professional-skills',
    name: 'Professional Skills',
    color: '#64748B', // slate-500
    icon: 'user-group',
    description:
      'Public speaking, stakeholder engagement, regulatory collaboration, and communication',
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    color: '#EC4899', // pink-500
    icon: 'microphone',
    description: 'Technical training, presentations, documentation, and educational content',
  },
];

/**
 * Map of category ID to category object for quick lookup
 */
export const categoryMap: Record<CategoryId, Category> = categories.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<CategoryId, Category>
);

/**
 * Get category by ID
 */
export function getCategory(id: CategoryId): Category {
  const category = categoryMap[id];
  if (!category) {
    throw new Error(`Unknown category: ${id}`);
  }
  return category;
}

/**
 * Get category color by ID
 */
export function getCategoryColor(id: CategoryId): string {
  return getCategory(id).color;
}

/**
 * Get all category IDs
 */
export function getCategoryIds(): CategoryId[] {
  return categories.map((c) => c.id);
}
