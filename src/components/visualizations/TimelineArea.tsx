/**
 * TimelineArea Component
 *
 * Stacked area chart showing career progression over time.
 * Uses Recharts for the chart and displays milestone markers.
 *
 * Features:
 * - Continuous proficiency visualization (linear progression during experience, decay after)
 * - Category drill-down to see individual skills
 * - Interactive legend with hover highlighting
 * - Milestone markers and detail modal
 */

'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimelineData, useSkillTimelineData } from './hooks/useTimelineData';
import { useReducedMotion } from './hooks';
import { TimelineTooltip } from './TimelineTooltip';
import { MilestoneDetailModal } from './MilestoneDetailModal';
import { milestones } from '@/data/milestones';
import { categories as allCategories, categoryMap } from '@/data/categories';
import { getSkillsAtDate } from '@/data';
import type { Milestone, CategoryId } from '@/data/types';

// Cyan color for milestone markers (as per spec)
const MILESTONE_COLOR = '#06B6D4';

// Diamond shape component for milestone markers
interface DiamondProps {
  cx: number;
  cy: number;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

function Diamond({ cx, cy, size = 8, fill = MILESTONE_COLOR, stroke = MILESTONE_COLOR, strokeWidth = 1 }: DiamondProps) {
  const halfSize = size / 2;
  const points = [
    `${cx},${cy - halfSize}`,     // top
    `${cx + halfSize},${cy}`,     // right
    `${cx},${cy + halfSize}`,     // bottom
    `${cx - halfSize},${cy}`,     // left
  ].join(' ');

  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

// Chart margin constants (must match AreaChart margins)
const CHART_MARGIN = { top: 20, right: 20, left: 50, bottom: 20 };

export interface TimelineAreaProps {
  className?: string;
}

export function TimelineArea({ className = '' }: TimelineAreaProps) {
  const reducedMotion = useReducedMotion();
  const { data, categories } = useTimelineData({ sampleRate: 3 });

  // Chart container ref and dimensions for milestone positioning
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  // Track container dimensions
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setChartDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Milestone state
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Category interaction state
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [drillDownCategory, setDrillDownCategory] = useState<CategoryId | null>(null);

  // Mobile tooltip state - tracks current hover/touch data to display below chart
  const [mobileTooltipData, setMobileTooltipData] = useState<{
    year: number;
    date: string;
    payload: Array<{
      value?: number;
      dataKey?: string;
      color?: string;
    }>;
  } | null>(null);

  // Get skill-level data for drill-down view
  const skillTimelineData = useSkillTimelineData(drillDownCategory, { sampleRate: 3 });

  // Group milestones by year for consolidated badges
  const milestonesByYear = useMemo(() => {
    const grouped = new Map<number, Milestone[]>();
    milestones.forEach((milestone) => {
      const year = parseInt(milestone.date.split('-')[0], 10);
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(milestone);
    });
    // Sort years and sort milestones within each year by date
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, msList]) => ({
        year,
        milestones: msList.sort((a, b) => a.date.localeCompare(b.date)),
      }));
  }, []);

  // Get year ticks for X-axis (show all years)
  const yearTicks = useMemo(() => {
    const sourceData = drillDownCategory && skillTimelineData ? skillTimelineData.data : data;
    const years = new Set(sourceData.map((d) => d.year));
    return Array.from(years);
  }, [data, drillDownCategory, skillTimelineData]);

  // Calculate milestone positions (X positions based on data array index)
  //
  // Key insight: With quarterly data (4 points per year), Recharts' XAxis with
  // ticks={yearTicks} positions each year label at the CENTER of all data points
  // for that year (e.g., 2020 tick at center of indices 44-47 = index 45.5).
  //
  // To align milestones with user expectations (where "2020" marks the START of 2020),
  // we calculate position based on where the milestone date falls between year boundaries.
  const milestoneData = useMemo(() => {
    const sourceData = drillDownCategory && skillTimelineData ? skillTimelineData.data : data;
    if (sourceData.length === 0 || chartDimensions.width === 0) return [];

    // Calculate the chart area dimensions (excluding margins)
    const chartAreaWidth = chartDimensions.width - CHART_MARGIN.left - CHART_MARGIN.right;
    const chartAreaHeight = chartDimensions.height - CHART_MARGIN.top - CHART_MARGIN.bottom;

    // Build a map of year -> data indices for that year
    const yearIndices: Record<number, number[]> = {};
    sourceData.forEach((point, index) => {
      if (!yearIndices[point.year]) {
        yearIndices[point.year] = [];
      }
      yearIndices[point.year].push(index);
    });

    // Get all years in sorted order
    const years = Object.keys(yearIndices).map(Number).sort((a, b) => a - b);
    const totalPoints = sourceData.length;

    return milestones.map((milestone) => {
      const [yearStr, monthStr] = milestone.date.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      // Find where this year's tick is centered (middle of year's data points)
      const thisYearIndices = yearIndices[year] || [];
      const nextYear = year + 1;
      const nextYearIndices = yearIndices[nextYear] || [];

      if (thisYearIndices.length === 0) {
        // Year not in data, fall back to start
        return { ...milestone, year, xPos: CHART_MARGIN.left, chartAreaHeight };
      }

      // The year tick label is positioned at the CENTER of this year's data points
      const yearTickIndex = (thisYearIndices[0] + thisYearIndices[thisYearIndices.length - 1]) / 2;

      // The next year tick (or end of chart) determines the right boundary
      let nextYearTickIndex: number;
      if (nextYearIndices.length > 0) {
        nextYearTickIndex = (nextYearIndices[0] + nextYearIndices[nextYearIndices.length - 1]) / 2;
      } else {
        // No next year data, extrapolate based on typical year spacing
        const pointsPerYear = thisYearIndices.length;
        nextYearTickIndex = yearTickIndex + pointsPerYear;
      }

      // Calculate the fraction into the year (0 = Jan 1, 1 = Dec 31)
      const monthFraction = (month - 1) / 12;

      // Position the milestone between the year tick and next year tick
      // based on how far into the year the month is
      const milestoneIndex = yearTickIndex + (monthFraction * (nextYearTickIndex - yearTickIndex));

      // Convert index to x percentage
      const xPercent = totalPoints > 1 ? milestoneIndex / (totalPoints - 1) : 0.5;
      const clampedPercent = Math.max(0, Math.min(1, xPercent));
      const xPos = CHART_MARGIN.left + (clampedPercent * chartAreaWidth);

      return {
        ...milestone,
        year,
        xPos,
        chartAreaHeight,
      };
    });
  }, [data, drillDownCategory, skillTimelineData, chartDimensions]);

  // Sort categories by first appearance in timeline (earlier = bottom of stack)
  const sortedCategories = useMemo(() => {
    const firstAppearance = new Map<string, number>();

    // Find first data point where each category has a non-zero value
    for (const point of data) {
      for (const category of categories) {
        if (!firstAppearance.has(category.id)) {
          const value = point[category.id as keyof typeof point];
          if (typeof value === 'number' && value > 0) {
            firstAppearance.set(category.id, point.year * 12 + point.month);
          }
        }
      }
    }

    // Sort categories by first appearance (earliest first = bottom of stack)
    return [...categories].sort((a, b) => {
      const aFirst = firstAppearance.get(a.id) ?? Infinity;
      const bFirst = firstAppearance.get(b.id) ?? Infinity;
      return aFirst - bFirst;
    });
  }, [data, categories]);

  // Handle category legend click (drill-down)
  const handleCategoryClick = useCallback((categoryId: string) => {
    setDrillDownCategory(categoryId as CategoryId);
    setHighlightedCategory(null);
  }, []);

  // Handle category legend hover
  const handleCategoryHover = useCallback((categoryId: string | null) => {
    if (!drillDownCategory) {
      setHighlightedCategory(categoryId);
    }
  }, [drillDownCategory]);

  // Handle back to categories
  const handleBackToCategories = useCallback(() => {
    setDrillDownCategory(null);
    setHighlightedCategory(null);
  }, []);

  // Animation duration
  const animationDuration = reducedMotion ? 0 : 1500;
  const transitionDuration = reducedMotion ? 0 : 300;

  // Custom tooltip component that captures data for mobile display
  const CustomTooltip = useCallback((props: {
    active?: boolean;
    payload?: Array<{
      payload: {
        date: string;
        year: number;
        [key: string]: unknown;
      };
      value?: number;
      dataKey?: string;
      color?: string;
      name?: string;
    }>;
    label?: string;
    drillDownCategory?: CategoryId | null;
  }) => {
    const { active, payload } = props;
    
    // Update mobile tooltip data when tooltip is active
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0]?.payload;
      const newData = {
        year: dataPoint?.year,
        date: dataPoint?.date,
        payload: payload,
      };
      
      // Only update if data has changed to avoid unnecessary rerenders
      if (JSON.stringify(newData) !== JSON.stringify(mobileTooltipData)) {
        setMobileTooltipData(newData);
      }
    }

    return <TimelineTooltip {...props} />;
  }, [mobileTooltipData]);

  // Calculate current proficiency totals for legend
  const currentProficiencyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    if (data.length > 0) {
      const latestPoint = data[data.length - 1];
      for (const category of categories) {
        const value = latestPoint[category.id as keyof typeof latestPoint];
        totals[category.id] = typeof value === 'number' ? Math.round(value * 10) / 10 : 0;
      }
    }
    return totals;
  }, [data, categories]);

  // Render chart content based on drill-down state
  const renderChartContent = () => {
    if (drillDownCategory && skillTimelineData) {
      // Drill-down view: show individual skills
      return (
        <>
          <defs>
            {skillTimelineData.skills.map((skill) => (
              <linearGradient
                key={`gradient-skill-${skill.id}`}
                id={`gradient-skill-${skill.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={skill.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={skill.color} stopOpacity={0.2} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.2} />

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
              value: 'Cumulative Proficiency',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: 'var(--color-muted)' },
            }}
          />

          <Tooltip
            content={<CustomTooltip drillDownCategory={drillDownCategory} />}
            cursor={{
              stroke: 'var(--color-engineering)',
              strokeWidth: 1,
              strokeDasharray: '5 5',
            }}
          />

          {/* Skill Areas - sorted by first appearance */}
          {skillTimelineData.skills.map((skill) => (
            <Area
              key={skill.id}
              type="monotone"
              dataKey={skill.id}
              stackId="1"
              stroke={skill.color}
              fill={`url(#gradient-skill-${skill.id})`}
              strokeWidth={2}
              fillOpacity={1}
              isAnimationActive={!reducedMotion}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          ))}
        </>
      );
    }

    // Category view
    return (
      <>
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

        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.2} />

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
            value: 'Cumulative Proficiency',
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: 12, fill: 'var(--color-muted)' },
          }}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: 'var(--color-engineering)',
            strokeWidth: 1,
            strokeDasharray: '5 5',
          }}
        />

        {/* Stacked Areas - sorted by first appearance (earlier skills at bottom) */}
        {sortedCategories.map((category) => {
          const isHighlighted =
            !highlightedCategory || highlightedCategory === category.id;
          return (
            <Area
              key={category.id}
              type="monotone"
              dataKey={category.id}
              stackId="1"
              stroke={category.color}
              fill={`url(#gradient-${category.id})`}
              strokeWidth={isHighlighted ? 2 : 1}
              fillOpacity={isHighlighted ? 1 : 0.15}
              strokeOpacity={isHighlighted ? 1 : 0.3}
              isAnimationActive={!reducedMotion}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          );
        })}
      </>
    );
  };

  return (
    <div className={`w-full ${className}`} data-testid="timeline-view">
      {/* Screen Reader Description */}
      <div className="sr-only" role="note">
        Timeline chart showing skill proficiency growth over time from {data[0]?.year} to{' '}
        {data[data.length - 1]?.year}. Proficiency increases during experiences and gradually
        decreases after they end. Click categories to see individual skills.
        Use the milestone buttons below to explore key career events.
      </div>

      {/* Back to Categories Button (when in drill-down) */}
      <AnimatePresence>
        {drillDownCategory && skillTimelineData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: transitionDuration / 1000 }}
            className="mb-4 flex items-center gap-3"
          >
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Return to category view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Viewing: <span className="font-medium" style={{ color: skillTimelineData.categoryColor }}>
                {skillTimelineData.categoryName}
              </span> skills
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category/Skill Legend - Moved above chart for better visibility */}
      <div className="mb-6 border-b border-gray-200 px-4 pb-4 dark:border-gray-700">
        {drillDownCategory && skillTimelineData ? (
          // Skill legend for drill-down
          <>
            <p className="mb-3 text-sm font-medium text-[var(--color-muted)]">
              {skillTimelineData.categoryName} Skills
            </p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Skills in category">
              {skillTimelineData.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
                >
                  <span
                    className="h-4 w-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Category legend
          <>
            <p className="mb-3 text-sm font-medium text-[var(--color-muted)]">
              Categories <span className="font-normal text-xs">(click to drill down)</span>
            </p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Filter chart by category">
              {categories.map((category) => {
                const isSelected = highlightedCategory === category.id;
                const isDimmed = highlightedCategory && highlightedCategory !== category.id;
                const proficiencyTotal = currentProficiencyTotals[category.id] || 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onMouseLeave={() => handleCategoryHover(null)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-md ${
                      isSelected ? 'bg-gray-100 dark:bg-gray-800 shadow-sm' : 'bg-white dark:bg-gray-900'
                    } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
                    aria-label={`View ${category.name} skills (proficiency: ${proficiencyTotal})`}
                  >
                    <span
                      className="h-4 w-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {proficiencyTotal > 0 ? proficiencyTotal.toFixed(1) : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Milestone Badges - Moved above chart for better alignment with markers */}
      <div className="mb-4 px-4">
        <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">★ Career Milestones</p>
        <div className="flex flex-wrap gap-2">
          {milestonesByYear.map(({ year, milestones: yearMilestones }) => (
            <button
              key={year}
              onMouseEnter={() => {
                setHoveredYear(year);
                if (yearMilestones.length === 1) {
                  setHoveredMilestone(yearMilestones[0]);
                }
              }}
              onMouseLeave={() => {
                setHoveredYear(null);
                setHoveredMilestone(null);
              }}
              onClick={() => {
                if (yearMilestones.length === 1) {
                  setSelectedMilestone(yearMilestones[0]);
                }
              }}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-[var(--color-engineering)] hover:text-white dark:bg-gray-800 dark:text-gray-300"
              aria-label={
                yearMilestones.length === 1
                  ? `View details for ${yearMilestones[0].title}`
                  : `View ${yearMilestones.length} milestones from ${year}`
              }
              data-testid="milestone-badge"
            >
              {year}
              {yearMilestones.length > 1 && (
                <span className="ml-1 opacity-70">({yearMilestones.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Hovered Milestone Detail */}
        <AnimatePresence>
          {hoveredYear && !selectedMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
              className="mt-2 space-y-2"
              data-testid="milestone-tooltip"
            >
              {milestonesByYear
                .find(({ year }) => year === hoveredYear)
                ?.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    onClick={() => setSelectedMilestone(milestone)}
                    className="cursor-pointer rounded-lg border border-[var(--color-engineering)] bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {milestone.date} • {milestone.description}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-engineering)]">
                      Click to see more details
                    </p>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="relative h-[300px] w-full sm:h-[400px] lg:h-[500px]"
        data-testid="timeline-area"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={drillDownCategory && skillTimelineData ? skillTimelineData.data : data}
            margin={CHART_MARGIN}
          >
            {renderChartContent()}
          </AreaChart>
        </ResponsiveContainer>

        {/* Milestone Markers Overlay */}
        {chartDimensions.width > 0 && (
          <svg
            className="pointer-events-none absolute inset-0"
            width={chartDimensions.width}
            height={chartDimensions.height}
            style={{ overflow: 'visible' }}
            data-testid="milestone-markers-overlay"
          >
            {milestoneData.map((milestone) => {
              const isIndividualHovered = hoveredMilestone?.id === milestone.id;
              const isYearHovered = hoveredYear === milestone.year;
              const isHovered = isIndividualHovered || isYearHovered;
              const fullMilestone = milestones.find(m => m.id === milestone.id);

              return (
                <g
                  key={milestone.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => fullMilestone && setHoveredMilestone(fullMilestone)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                  onClick={() => fullMilestone && setSelectedMilestone(fullMilestone)}
                >
                  {/* Diamond marker at top */}
                  <Diamond
                    cx={milestone.xPos}
                    cy={CHART_MARGIN.top + 10}
                    size={isHovered ? 12 : 8}
                    fill={MILESTONE_COLOR}
                    stroke={isHovered ? '#fff' : MILESTONE_COLOR}
                    strokeWidth={isHovered ? 2 : 1}
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Mobile Tooltip Display - Shows below chart on mobile */}
      <AnimatePresence>
        {mobileTooltipData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
            className="md:hidden mt-4 px-4"
          >
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-900">
              {/* Year Header */}
              <div className="mb-2 border-b border-gray-200 pb-2 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {mobileTooltipData.year}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total: {mobileTooltipData.payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(1)} proficiency
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-1.5">
                {drillDownCategory ? (
                  // Drill-down view: show individual skills
                  <>
                    {mobileTooltipData.payload
                      .filter((entry) => (entry.value ?? 0) > 0)
                      .map((entry) => {
                        const skillId = entry.dataKey as string;
                        const skill = skillTimelineData?.skills.find(s => s.id === skillId);
                        return (
                          <div key={skillId} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">
                                {skill?.name || skillId}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {(entry.value || 0).toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  // Category view
                  <>
                    {allCategories.map((category) => {
                      const entry = mobileTooltipData.payload.find(p => p.dataKey === category.id);
                      const proficiency = entry?.value ?? 0;
                      if (!proficiency || proficiency === 0) return null;

                      return (
                        <div key={category.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {proficiency.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Active skills count */}
              {!drillDownCategory && mobileTooltipData.date && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getSkillsAtDate(mobileTooltipData.date).length} skills active
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Explanation */}
      <div className="mt-2 px-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          <strong>Cumulative Proficiency:</strong> Shows skill depth across your career.
          Values increase during active experiences and gradually decay after they end.
          Higher values indicate deeper expertise across more skills.
        </p>
      </div>

      {/* Milestone Detail Modal */}
      <MilestoneDetailModal
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
      />
    </div>
  );
}
