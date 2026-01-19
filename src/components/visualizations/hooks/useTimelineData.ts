/**
 * useTimelineData Hook
 *
 * Transforms skill data for the Recharts stacked area chart.
 * Memoizes the transformation for performance.
 */

import { useMemo } from 'react';
import { generateTimelineData } from '@/data';
import { categories } from '@/data/categories';
import type { TimelineDataPoint, CategoryId } from '@/data/types';

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
