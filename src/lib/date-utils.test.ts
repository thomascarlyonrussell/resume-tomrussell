/**
 * Unit tests for date utilities
 */

import { describe, it, expect } from 'vitest';
import {
  monthsSince,
  experienceDurationMonths,
  parseYearMonth,
  formatYearMonth,
  isDateWithinExperience,
  isDateAfterExperience,
} from './date-utils';
import type { Experience } from '../data/types';

describe('monthsSince', () => {
  it('should calculate months between two dates', () => {
    expect(monthsSince('2020-01', '2020-12')).toBe(11);
    expect(monthsSince('2020-01', '2021-01')).toBe(12);
    expect(monthsSince('2020-01', '2020-01')).toBe(0);
  });

  it('should handle multi-year spans', () => {
    expect(monthsSince('2015-06', '2020-06')).toBe(60);
    expect(monthsSince('2010-01', '2025-01')).toBe(180);
  });

  it('should return 0 for negative spans', () => {
    expect(monthsSince('2020-12', '2020-01')).toBe(0);
  });
});

describe('experienceDurationMonths', () => {
  it('should calculate duration for completed experience', () => {
    const experience: Experience = {
      id: 'exp1',
      company: 'Company A',
      title: 'Developer',
      startDate: '2020-01',
      endDate: '2021-01',
      description: 'Test',
    };

    expect(experienceDurationMonths(experience)).toBe(12);
  });

  it('should calculate duration for ongoing experience relative to reference date', () => {
    const experience: Experience = {
      id: 'exp1',
      company: 'Company A',
      title: 'Developer',
      startDate: '2020-01',
      endDate: null,
      description: 'Test',
    };

    const referenceDate = new Date('2022-01-15');
    expect(experienceDurationMonths(experience, referenceDate)).toBe(24);
  });
});

describe('parseYearMonth', () => {
  it('should parse YYYY-MM format correctly', () => {
    expect(parseYearMonth('2020-06')).toEqual({ year: 2020, month: 6 });
    expect(parseYearMonth('2025-01')).toEqual({ year: 2025, month: 1 });
    expect(parseYearMonth('2015-12')).toEqual({ year: 2015, month: 12 });
  });
});

describe('formatYearMonth', () => {
  it('should format year and month to YYYY-MM', () => {
    expect(formatYearMonth(2020, 6)).toBe('2020-06');
    expect(formatYearMonth(2025, 1)).toBe('2025-01');
    expect(formatYearMonth(2015, 12)).toBe('2015-12');
  });

  it('should pad single-digit months', () => {
    expect(formatYearMonth(2020, 1)).toBe('2020-01');
    expect(formatYearMonth(2020, 9)).toBe('2020-09');
  });
});

describe('isDateWithinExperience', () => {
  const experience: Experience = {
    id: 'exp1',
    company: 'Company A',
    title: 'Developer',
    startDate: '2020-01',
    endDate: '2021-12',
    description: 'Test',
  };

  it('should return true for date within experience', () => {
    expect(isDateWithinExperience('2020-06', experience)).toBe(true);
    expect(isDateWithinExperience('2021-01', experience)).toBe(true);
  });

  it('should return true for start and end dates', () => {
    expect(isDateWithinExperience('2020-01', experience)).toBe(true);
    expect(isDateWithinExperience('2021-12', experience)).toBe(true);
  });

  it('should return false for date before experience', () => {
    expect(isDateWithinExperience('2019-12', experience)).toBe(false);
  });

  it('should return false for date after experience', () => {
    expect(isDateWithinExperience('2022-01', experience)).toBe(false);
  });

  it('should handle ongoing experience (no end date)', () => {
    const ongoingExp: Experience = {
      id: 'exp2',
      company: 'Company B',
      title: 'Developer',
      startDate: '2020-01',
      endDate: null,
      description: 'Test',
    };

    expect(isDateWithinExperience('2020-06', ongoingExp)).toBe(true);
    expect(isDateWithinExperience('2030-01', ongoingExp)).toBe(true);
    expect(isDateWithinExperience('2019-12', ongoingExp)).toBe(false);
  });
});

describe('isDateAfterExperience', () => {
  const experience: Experience = {
    id: 'exp1',
    company: 'Company A',
    title: 'Developer',
    startDate: '2020-01',
    endDate: '2021-12',
    description: 'Test',
  };

  it('should return true for date after experience ended', () => {
    expect(isDateAfterExperience('2022-01', experience)).toBe(true);
    expect(isDateAfterExperience('2025-06', experience)).toBe(true);
  });

  it('should return false for date during experience', () => {
    expect(isDateAfterExperience('2020-06', experience)).toBe(false);
    expect(isDateAfterExperience('2021-12', experience)).toBe(false);
  });

  it('should return false for date before experience', () => {
    expect(isDateAfterExperience('2019-12', experience)).toBe(false);
  });

  it('should return false for ongoing experience (no end date)', () => {
    const ongoingExp: Experience = {
      id: 'exp2',
      company: 'Company B',
      title: 'Developer',
      startDate: '2020-01',
      endDate: null,
      description: 'Test',
    };

    expect(isDateAfterExperience('2020-06', ongoingExp)).toBe(false);
    expect(isDateAfterExperience('2030-01', ongoingExp)).toBe(false);
  });
});
