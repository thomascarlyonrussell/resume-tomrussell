/**
 * Data Model Type Definitions
 *
 * These types define the data structures for skills, experience, and career
 * information that power visualizations and the AI chatbot knowledge base.
 */

// ============================================================================
// Category Types
// ============================================================================

/**
 * Valid category identifiers for skill classification
 */
export type CategoryId =
  | 'engineering'
  | 'software-development'
  | 'ai-automation'
  | 'product-management'
  | 'data-analytics'
  | 'professional-skills'
  | 'content-creation';

/**
 * Category definition with display properties for visualizations
 */
export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Hex color for visualizations
  icon: string; // Icon identifier (e.g., heroicons name)
  description?: string;
}

// ============================================================================
// Skill Types
// ============================================================================

/**
 * Valid proficiency levels using Fibonacci sequence
 * 1 = Beginner, 2 = Familiar, 3 = Competent, 5 = Proficient, 8 = Expert
 */
export type ProficiencyLevel = 1 | 2 | 3 | 5 | 8;

/**
 * Skill entry representing a technical or professional capability
 * In the new model, skills contain only reference data.
 * Proficiency and timeline information are derived from experiences.
 */
export interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  /** @deprecated Use ExperienceSkill.proficiency in Experience.skills instead */
  proficiency?: ProficiencyLevel;
  /** @deprecated Computed from experiences via computeSkillTimeline() */
  startDate?: string; // YYYY-MM format
  /** @deprecated Computed from experiences via computeSkillTimeline() */
  endDate?: string | null; // YYYY-MM format, null/undefined if current
  description?: string;
}

/**
 * Skill reference in an experience with proficiency level
 * Used in the new experience-based model where experiences define
 * which skills were used and at what proficiency level
 */
export interface ExperienceSkill {
  /** Reference to skill ID */
  skillId: string;
  /** Proficiency level achieved in this experience (1, 2, 3, 5, or 8) */
  proficiency: ProficiencyLevel;
}

/**
 * Computed skill properties derived from experiences
 * In the new model, skill timelines and proficiency are calculated
 * from the experiences that reference them
 */
export interface ComputedSkill {
  /** Skill ID */
  id: string;
  /** Display name */
  name: string;
  /** Primary category */
  category: CategoryId;
  /** Secondary grouping */
  subcategory: string;
  /** General description (not experience-specific) */
  description?: string;
  /** Earliest start date from experiences (computed) */
  startDate?: string;
  /** Latest end date from experiences (computed) */
  endDate?: string;
  /** Whether any experience is currently active (computed) */
  isActive: boolean;
  /** Weighted average proficiency with degradation (computed, not discrete) */
  proficiency?: number;
  /** Years of experience across all experiences (computed) */
  yearsOfExperience: number;
  /** Experiences that used this skill (computed) */
  experiences: Experience[];
  /** Fibonacci size for visualization (computed) */
  fibonacciSize: number;
  /** Degradation factor applied (1.0, 0.5, or 0.25) (computed) */
  degradationFactor: number;
}

/**
 * Point in time showing skill proficiency for proficiency history
 */
export interface SkillTimelinePoint {
  /** Date in YYYY-MM format */
  date: string;
  /** Experience ID where this proficiency was achieved */
  experienceId: string;
  /** Proficiency level at this point */
  proficiency: ProficiencyLevel;
}

// ============================================================================
// Milestone Types
// ============================================================================

/**
 * Career milestone representing key achievements or transitions
 */
export interface Milestone {
  id: string;
  title: string;
  date: string; // YYYY-MM format
  description?: string;
  skillIds?: string[];
}

// ============================================================================
// Experience Types
// ============================================================================

/**
 * Work experience entry representing a job role
 */
export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string; // YYYY-MM format
  endDate?: string | null; // YYYY-MM format, null/undefined if current
  location?: string;
  description: string;
  highlights?: string[];
  /** @deprecated Use skills instead */
  skillIds?: string[];
  /** Skills used in this experience with proficiency levels (new model) */
  skills?: ExperienceSkill[];
}

// ============================================================================
// Publication Types
// ============================================================================

/**
 * Publication type identifiers
 */
export type PublicationType =
  | 'Research Paper'
  | 'Technical Report'
  | 'Regulatory Filing'
  | 'Article';

/**
 * Publication entry for research papers, reports, and articles
 */
export interface Publication {
  id: string;
  title: string;
  type: string;
  date?: string | null; // YYYY-MM format, null if unknown
  description?: string;
  url?: string | null;
}

// ============================================================================
// Education Types
// ============================================================================

/**
 * Formal education entry (degrees)
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  focus?: string;
  startDate: string; // YYYY-MM format
  endDate?: string | null; // YYYY-MM format, null if in progress
  location?: string;
}

/**
 * Professional certification entry
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string; // YYYY-MM format
  description?: string;
  url?: string | null;
  expirationDate?: string | null; // YYYY-MM format, null if no expiration
}

// ============================================================================
// Timeline Types (for visualization)
// ============================================================================

/**
 * Data point for timeline stacked area chart
 */
export interface TimelineDataPoint {
  date: string; // YYYY-MM format
  year: number;
  month: number;
  [categoryId: string]: number | string; // Category counts
}

/**
 * Skill active during a time period (for timeline hover)
 */
export interface TimelineSkillInfo {
  skillId: string;
  skillName: string;
  category: CategoryId;
  proficiency: ProficiencyLevel;
}

// ============================================================================
// Fibonacci Calculation Types
// ============================================================================

/**
 * Valid Fibonacci values for display sizing
 */
export const FIBONACCI_SEQUENCE = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89] as const;
export type FibonacciValue = (typeof FIBONACCI_SEQUENCE)[number];

/**
 * Degradation factors for inactive skills
 */
export const DEGRADATION_FACTORS = {
  ACTIVE: 1.0, // Current or <2 years since end
  RECENT: 0.5, // 2-5 years since end
  OLD: 0.25, // >5 years since end
} as const;

/**
 * Input for Fibonacci size calculation
 */
export interface FibonacciSizeInput {
  proficiency: ProficiencyLevel;
  startDate: string;
  endDate?: string | null;
  referenceDate?: Date; // Defaults to current date
}

/**
 * Result of Fibonacci size calculation
 */
export interface FibonacciSizeResult {
  rawSize: number;
  fibonacciSize: FibonacciValue;
  yearsOfExperience: number;
  degradationFactor: number;
  isActive: boolean;
}
