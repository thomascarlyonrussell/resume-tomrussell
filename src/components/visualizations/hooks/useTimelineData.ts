/**
 * useTimelineData Hook
 *
 * Transforms skill data for the Recharts stacked area chart.
 * Memoizes the transformation for performance.
 */

import { useMemo } from 'react';
import {
  generateTimelineData,
  generateSkillTimelineData,
  getCategorySkillsSorted,
  type SkillTimelineDataPoint,
} from '@/data';
import { categories, categoryMap } from '@/data/categories';
import { skills } from '@/data/skills';
import type { TimelineDataPoint, CategoryId, Skill } from '@/data/types';

export interface TimelineChartData {
  date: string;
  year: number;
  month: number;
  total: number;
  engineering: number;
  'software-development': number;
  'ai-automation': number;
  'product-management': number;
  'data-analytics': number;
  'professional-skills': number;
  'content-creation': number;
}

export interface UseTimelineDataOptions {
  startYear?: number;
  endYear?: number;
  /** Sample every N months to reduce data points (default: 1 = all months) */
  sampleRate?: number;
}

export interface UseTimelineDataResult {
  data: TimelineChartData[];
  categories: typeof categories;
  dateRange: { start: string; end: string };
}

/**
 * Hook to get formatted timeline data for Recharts
 */
export function useTimelineData(options: UseTimelineDataOptions = {}): UseTimelineDataResult {
  const { startYear = 2009, endYear = new Date().getFullYear(), sampleRate = 3 } = options;

  const data = useMemo(() => {
    const rawData = generateTimelineData(startYear, endYear);

    // Sample data to reduce points (every N months)
    const sampledData = rawData.filter((_, index) => index % sampleRate === 0);

    // Transform to chart format with explicit category fields
    return sampledData.map((point: TimelineDataPoint) => {
      const chartPoint: TimelineChartData = {
        date: point.date,
        year: point.year,
        month: point.month,
        total: 0,
        engineering: 0,
        'software-development': 0,
        'ai-automation': 0,
        'product-management': 0,
        'data-analytics': 0,
        'professional-skills': 0,
        'content-creation': 0,
      };

      // Copy category values
      for (const category of categories) {
        const value = point[category.id as CategoryId];
        if (typeof value === 'number') {
          chartPoint[category.id as keyof TimelineChartData] = value as never;
          chartPoint.total += value;
        }
      }

      return chartPoint;
    });
  }, [startYear, endYear, sampleRate]);

  const dateRange = useMemo(() => {
    if (data.length === 0) {
      return { start: '', end: '' };
    }
    return {
      start: data[0].date,
      end: data[data.length - 1].date,
    };
  }, [data]);

  return {
    data,
    categories,
    dateRange,
  };
}

/**
 * Skill data for drill-down chart
 */
export interface SkillChartInfo {
  id: string;
  name: string;
  color: string;
}

/**
 * Hook result for skill timeline data
 */
export interface UseSkillTimelineDataResult {
  data: SkillTimelineDataPoint[];
  skills: SkillChartInfo[];
  categoryName: string;
  categoryColor: string;
}

/**
 * Hook to get formatted skill timeline data for drill-down view
 *
 * @param categoryId - Category to get skill-level data for
 * @param options - Optional start/end year and sample rate
 */
export function useSkillTimelineData(
  categoryId: CategoryId | null,
  options: UseTimelineDataOptions = {}
): UseSkillTimelineDataResult | null {
  const { startYear = 2009, endYear = new Date().getFullYear(), sampleRate = 3 } = options;

  return useMemo(() => {
    if (!categoryId) return null;

    const rawData = generateSkillTimelineData(categoryId, startYear, endYear);
    const sampledData = rawData.filter((_, index) => index % sampleRate === 0);

    // Get sorted skills for this category (earliest first for stacking)
    const categorySkills = getCategorySkillsSorted(categoryId);
    const category = categoryMap[categoryId];

    // Generate color variations for each skill (shades of category color)
    const skillsWithColors: SkillChartInfo[] = categorySkills.map((skill, index) => {
      // Generate shades from light to dark based on index
      const totalSkills = categorySkills.length;
      const lightness = 70 - (index * 40 / Math.max(1, totalSkills - 1)); // 70% to 30%
      const saturation = 60 + (index * 20 / Math.max(1, totalSkills - 1)); // 60% to 80%

      // Parse category color (assumes hex format)
      const baseColor = category.color;
      const hsl = hexToHsl(baseColor);

      return {
        id: skill.id,
        name: skill.name,
        color: hslToHex(hsl.h, saturation, lightness),
      };
    });

    return {
      data: sampledData,
      skills: skillsWithColors,
      categoryName: category.name,
      categoryColor: category.color,
    };
  }, [categoryId, startYear, endYear, sampleRate]);
}

/**
 * Convert hex color to HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}
