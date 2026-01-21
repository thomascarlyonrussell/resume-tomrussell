import {
  parseYearMonth,
  calculateYearsBetween,
  calculateDegradationFactor,
  mapToFibonacci,
  calculateFibonacciSize,
  isSkillActive,
  getProficiencyLabel,
  formatYearsOfExperience,
} from './calculations';
import { DEGRADATION_FACTORS } from '@/data/types';

describe('parseYearMonth', () => {
  it('should parse YYYY-MM format correctly', () => {
    const date = parseYearMonth('2020-06');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(5); // 0-indexed
  });

  it('should handle January correctly', () => {
    const date = parseYearMonth('2021-01');
    expect(date.getFullYear()).toBe(2021);
    expect(date.getMonth()).toBe(0);
  });

  it('should handle December correctly', () => {
    const date = parseYearMonth('2019-12');
    expect(date.getFullYear()).toBe(2019);
    expect(date.getMonth()).toBe(11);
  });
});

describe('calculateYearsBetween', () => {
  it('should calculate years between two dates', () => {
    const start = new Date(2020, 0, 1);
    const end = new Date(2025, 0, 1);
    const years = calculateYearsBetween(start, end);
    expect(years).toBeCloseTo(5, 1);
  });

  it('should return 0 for same dates', () => {
    const date = new Date(2020, 0, 1);
    expect(calculateYearsBetween(date, date)).toBe(0);
  });

  it('should return 0 for negative range', () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2020, 0, 1);
    expect(calculateYearsBetween(start, end)).toBe(0);
  });
});

describe('isSkillActive', () => {
  it('should return true for null endDate', () => {
    expect(isSkillActive(null)).toBe(true);
  });

  it('should return true for undefined endDate', () => {
    expect(isSkillActive(undefined)).toBe(true);
  });

  it('should return false for defined endDate', () => {
    expect(isSkillActive('2020-06')).toBe(false);
  });
});

describe('calculateDegradationFactor', () => {
  it('should return 1.0 for active skills (null endDate)', () => {
    expect(calculateDegradationFactor(null)).toBe(DEGRADATION_FACTORS.ACTIVE);
  });

  it('should return 1.0 for skills ended less than 2 years ago', () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const endDate = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}`;
    expect(calculateDegradationFactor(endDate)).toBe(DEGRADATION_FACTORS.ACTIVE);
  });

  it('should return 0.5 for skills ended 2-5 years ago', () => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const endDate = `${threeYearsAgo.getFullYear()}-${String(threeYearsAgo.getMonth() + 1).padStart(2, '0')}`;
    expect(calculateDegradationFactor(endDate)).toBe(DEGRADATION_FACTORS.RECENT);
  });

  it('should return 0.25 for skills ended more than 5 years ago', () => {
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
    const endDate = `${sixYearsAgo.getFullYear()}-${String(sixYearsAgo.getMonth() + 1).padStart(2, '0')}`;
    expect(calculateDegradationFactor(endDate)).toBe(DEGRADATION_FACTORS.OLD);
  });
});

describe('mapToFibonacci', () => {
  it('should normalize to 5-bin scale', () => {
    // Bin 1: 0-1.6 → 1
    expect(mapToFibonacci(0)).toBe(1);
    expect(mapToFibonacci(0.5)).toBe(1);
    expect(mapToFibonacci(1)).toBe(1);
    expect(mapToFibonacci(1.5)).toBe(1);

    // Bin 2: 1.6-3.2 → 2
    expect(mapToFibonacci(1.6)).toBe(2);
    expect(mapToFibonacci(2.0)).toBe(2);
    expect(mapToFibonacci(3.0)).toBe(2);

    // Bin 3: 3.2-4.8 → 3
    expect(mapToFibonacci(3.5)).toBe(3);
    expect(mapToFibonacci(4.0)).toBe(3);
    expect(mapToFibonacci(4.5)).toBe(3);

    // Bin 4: 4.8-6.4 → 5 (represents 4th bin)
    expect(mapToFibonacci(5.0)).toBe(4);
    expect(mapToFibonacci(6.0)).toBe(4);

    // Bin 5: 6.4+ → 8 (represents 5th bin)
    expect(mapToFibonacci(7.0)).toBe(5);
    expect(mapToFibonacci(8.0)).toBe(5);
    expect(mapToFibonacci(100)).toBe(5);
  });
});

describe('calculateFibonacciSize', () => {
  // Test scenario from spec: High proficiency active skill
  // proficiency 8, 10 years experience, active
  // calculated size = 8 × (10 × 1.0) × 1.0 = 80, mapped to 89
  it('should calculate correctly for high proficiency active skill (spec scenario 1)', () => {
    const referenceDate = new Date(2025, 0, 1); // Jan 2025
    const result = calculateFibonacciSize({
      proficiency: 8,
      startDate: '2015-01', // 10 years before reference
      endDate: null,
      referenceDate,
    });

    expect(result.isActive).toBe(true);
    expect(result.yearsOfExperience).toBeCloseTo(10, 0);
    expect(result.degradationFactor).toBe(1.0);
    // raw = 8 × (10 × 8/8) × 1.0 = 8 × 10 × 1.0 = 80
    expect(result.rawSize).toBeCloseTo(80, 0);
    // rawSize 80 normalizes to bin 5 (top bin)
    expect(result.fibonacciSize).toBe(5); // 8 represents bin 5 in 5-star scale
  });

  // Test scenario from spec: Degraded inactive skill
  // proficiency 5, 3 years experience, ended 6 years ago
  // calculated size = 5 × (3 × 0.625) × 0.25 ≈ 2.34, mapped to 3
  it('should calculate correctly for degraded inactive skill (spec scenario 2)', () => {
    const referenceDate = new Date(2025, 0, 1); // Jan 2025
    const result = calculateFibonacciSize({
      proficiency: 5,
      startDate: '2016-01', // Started 9 years before reference
      endDate: '2019-01', // Ended 6 years before reference (3 years of exp)
      referenceDate,
    });

    expect(result.isActive).toBe(false);
    expect(result.yearsOfExperience).toBeCloseTo(3, 0);
    expect(result.degradationFactor).toBe(0.25); // >5 years ago
    // raw = 5 × (3 × 5/8) × 0.25 = 5 × 1.875 × 0.25 = 2.34375
    expect(result.rawSize).toBeCloseTo(2.34, 1);
    // rawSize 2.34 normalizes to bin 2 (1.6-3.2 range)
    expect(result.fibonacciSize).toBe(2);
  });

  it('should handle beginner skill with short experience', () => {
    const referenceDate = new Date(2025, 0, 1);
    const result = calculateFibonacciSize({
      proficiency: 1,
      startDate: '2024-07', // 6 months before Jan 2025
      endDate: null,
      referenceDate,
    });

    expect(result.isActive).toBe(true);
    // ~0.5 years (6 months)
    expect(result.yearsOfExperience).toBeCloseTo(0.5, 0);
    // raw = 1 × (0.5 × 1/8) × 1.0 = small value
    expect(result.rawSize).toBeLessThan(1);
    expect(result.fibonacciSize).toBe(1);
  });
});

describe('getProficiencyLabel', () => {
  it('should return correct labels', () => {
    expect(getProficiencyLabel(1)).toBe('Beginner');
    expect(getProficiencyLabel(2)).toBe('Familiar');
    expect(getProficiencyLabel(3)).toBe('Competent');
    expect(getProficiencyLabel(5)).toBe('Proficient');
    expect(getProficiencyLabel(8)).toBe('Expert');
  });
});

describe('formatYearsOfExperience', () => {
  it('should format months for less than 1 year', () => {
    expect(formatYearsOfExperience(0.5)).toBe('6 months');
    expect(formatYearsOfExperience(0.25)).toBe('3 months');
    expect(formatYearsOfExperience(0.083)).toBe('1 month');
  });

  it('should format years for 1+ years', () => {
    expect(formatYearsOfExperience(1)).toBe('1 year');
    expect(formatYearsOfExperience(2.5)).toBe('2.5 years');
    expect(formatYearsOfExperience(10)).toBe('10 years');
  });
});
