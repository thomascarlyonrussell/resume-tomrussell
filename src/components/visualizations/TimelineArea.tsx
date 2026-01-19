/**
 * TimelineArea Component
 *
 * Stacked area chart showing career progression over time.
 * Uses Recharts for the chart and displays milestone markers.
 */

'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimelineData } from './hooks/useTimelineData';
import { useReducedMotion } from './hooks';
import { TimelineTooltip } from './TimelineTooltip';
import { MilestoneDetailModal } from './MilestoneDetailModal';
import { milestones } from '@/data/milestones';
import type { Milestone } from '@/data/types';

export interface TimelineAreaProps {
  className?: string;
}

export function TimelineArea({ className = '' }: TimelineAreaProps) {
  const reducedMotion = useReducedMotion();
  const { data, categories } = useTimelineData({ sampleRate: 3 });
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Get year ticks for X-axis
  const yearTicks = useMemo(() => {
    const years = new Set(data.map((d) => d.year));
    return Array.from(years).filter((year) => year % 2 === 1); // Show odd years
  }, [data]);

  // Calculate milestone positions (X positions based on year)
  const milestoneData = useMemo(() => {
    const yearToIndex = new Map<number, number>();
    data.forEach((d, index) => {
      if (!yearToIndex.has(d.year)) {
        yearToIndex.set(d.year, index);
      }
    });

    return milestones.map((milestone) => {
      const year = parseInt(milestone.date.split('-')[0], 10);
      return {
        ...milestone,
        year,
        dataIndex: yearToIndex.get(year) || 0,
      };
    });
  }, [data]);

  // Animation duration
  const animationDuration = reducedMotion ? 0 : 1500;

  return (
    <div className={`w-full ${className}`}>
      {/* Screen Reader Description */}
      <div className="sr-only" role="note">
        Timeline chart showing skill growth over time from {data[0]?.year} to {data[data.length - 1]?.year}.
        Use the milestone buttons below to explore key career events.
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full sm:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <defs>
              {categories.map((category) => (
                <linearGradient
                  key={`gradient-${category.id}`}
                  id={`gradient-${category.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={category.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={category.color} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-muted)"
              opacity={0.2}
            />

            <XAxis
              dataKey="year"
              ticks={yearTicks}
              tick={{ fontSize: 12, fill: 'var(--color-muted)' }}
              tickLine={{ stroke: 'var(--color-muted)' }}
              axisLine={{ stroke: 'var(--color-muted)' }}
            />

            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-muted)' }}
              tickLine={{ stroke: 'var(--color-muted)' }}
              axisLine={{ stroke: 'var(--color-muted)' }}
              label={{
                value: 'Active Skills',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: 'var(--color-muted)' },
              }}
            />

            <Tooltip
              content={<TimelineTooltip />}
              cursor={{
                stroke: 'var(--color-engineering)',
                strokeWidth: 1,
                strokeDasharray: '5 5',
              }}
            />

            {/* Stacked Areas - render in reverse order so first category is on bottom */}
            {[...categories].reverse().map((category) => (
              <Area
                key={category.id}
                type="monotone"
                dataKey={category.id}
                stackId="1"
                stroke={category.color}
                fill={`url(#gradient-${category.id})`}
                strokeWidth={1}
                isAnimationActive={!reducedMotion}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              />
            ))}

            {/* Milestone Reference Lines */}
            {milestoneData.map((milestone) => (
              <ReferenceLine
                key={milestone.id}
                x={milestone.year}
                stroke="var(--color-engineering)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: '★',
                  position: 'top',
                  fill: 'var(--color-engineering)',
                  fontSize: 12,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone Legend */}
      <div className="mt-4 px-4">
        <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
          ★ Career Milestones
        </p>
        <div className="flex flex-wrap gap-2">
          {milestones.slice(0, 6).map((milestone) => (
            <button
              key={milestone.id}
              onMouseEnter={() => setHoveredMilestone(milestone)}
              onMouseLeave={() => setHoveredMilestone(null)}
              onClick={() => setSelectedMilestone(milestone)}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-[var(--color-engineering)] hover:text-white dark:bg-gray-800 dark:text-gray-300"
              aria-label={`View details for ${milestone.title}`}
            >
              {milestone.date.split('-')[0]}
            </button>
          ))}
          {milestones.length > 6 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{milestones.length - 6} more
            </span>
          )}
        </div>

        {/* Hovered Milestone Detail - Hidden when modal is open */}
        <AnimatePresence>
          {hoveredMilestone && !selectedMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
              className="mt-2 rounded-lg border border-[var(--color-engineering)] bg-gray-50 p-2 dark:bg-gray-800"
            >
              <p className="text-sm font-medium">{hoveredMilestone.title}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {hoveredMilestone.date} • {hoveredMilestone.description}
              </p>
              <p className="text-xs text-[var(--color-engineering)] mt-1">
                Click to see more details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Legend - with separator */}
      <div className="mt-6 border-t border-gray-200 pt-4 px-4 dark:border-gray-700">
        <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">Categories</p>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Detail Modal */}
      <MilestoneDetailModal
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
      />
    </div>
  );
}
