/**
 * FibonacciSpiral Component
 *
 * Main visualization component that displays skills in a Fibonacci spiral pattern.
 * Skills are sized by proficiency and experience, color-coded by category.
 */

'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import type { ComputedSkill, CategoryId } from '@/data/types';
import { getAllComputedSkills, getCategorySkillCounts } from '@/data';

import { SkillNode, SkillNodeFocusRing } from './SkillNode';
import { SkillTooltip } from './SkillTooltip';
import { Legend } from './Legend';
import { SkillLabel } from './SkillLabel';
import { useFibonacciLayout, useSkillTooltip, useReducedMotion } from './hooks';

export interface FibonacciSpiralProps {
  skills?: ComputedSkill[];
  className?: string;
  showLegend?: boolean;
  onSkillClick?: (skill: ComputedSkill) => void;
  selectedCategoryFilter?: CategoryId | null;
  onCategoryToggle?: (categoryId: CategoryId) => void;
}

// Size multiplier for converting Fibonacci values to pixels
const SIZE_MULTIPLIER = 1.5;

interface SpiralContentProps extends FibonacciSpiralProps {
  width: number;
  height: number;
}

function SpiralContent({
  skills: skillsProp,
  width,
  height,
  showLegend = true,
  onSkillClick,
  selectedCategoryFilter,
  onCategoryToggle,
}: SpiralContentProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const skillRefs = useRef<Map<string, SVGCircleElement>>(new Map());
  const reducedMotion = useReducedMotion();

  // Get skills data
  const skills = useMemo(() => skillsProp ?? getAllComputedSkills(), [skillsProp]);

  // Filter skills by category if a filter is active
  const filteredSkills = useMemo(
    () =>
      selectedCategoryFilter
        ? skills.filter((skill) => skill.category === selectedCategoryFilter)
        : skills,
    [skills, selectedCategoryFilter]
  );

  // Calculate layout
  const { positions, sortedSkills, center } = useFibonacciLayout({
    skills: filteredSkills,
    width,
    height,
    padding: 60,
    sizeMultiplier: SIZE_MULTIPLIER,
  });

  // Tooltip state
  const tooltip = useSkillTooltip({
    containerRef,
  });

  // Hover and focus state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const focusedId = focusedIndex >= 0 ? sortedSkills[focusedIndex]?.id : null;

  // Calculate skill counts per category
  const skillCounts = useMemo(() => getCategorySkillCounts(), []);

  // Event handlers
  const handleSkillHover = useCallback(
    (skill: ComputedSkill, hovering: boolean) => {
      setHoveredId(hovering ? skill.id : null);

      if (hovering) {
        const pos = positions.get(skill.id);
        if (pos) {
          tooltip.showTooltip(skill, pos.x, pos.y, (skill.fibonacciSize * SIZE_MULTIPLIER) / 2);
        }
      } else {
        tooltip.hideTooltip();
      }
    },
    [positions, tooltip]
  );

  const handleSkillFocus = useCallback(
    (skill: ComputedSkill, focused: boolean) => {
      if (focused) {
        const index = sortedSkills.findIndex((s) => s.id === skill.id);
        setFocusedIndex(index);

        const pos = positions.get(skill.id);
        if (pos) {
          tooltip.showTooltip(skill, pos.x, pos.y, (skill.fibonacciSize * SIZE_MULTIPLIER) / 2);
        }
      } else {
        setFocusedIndex(-1);
        tooltip.hideTooltip();
      }
    },
    [sortedSkills, positions, tooltip]
  );

  const handleSkillClick = useCallback(
    (skill: ComputedSkill) => {
      onSkillClick?.(skill);
    },
    [onSkillClick]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const maxIndex = sortedSkills.length - 1;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < maxIndex ? prev + 1 : 0;
            const skill = sortedSkills[next];
            const ref = skillRefs.current.get(skill.id);
            ref?.focus();
            return next;
          });
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : maxIndex;
            const skill = sortedSkills[next];
            const ref = skillRefs.current.get(skill.id);
            ref?.focus();
            return next;
          });
          break;

        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          if (sortedSkills.length > 0) {
            const skill = sortedSkills[0];
            const ref = skillRefs.current.get(skill.id);
            ref?.focus();
          }
          break;

        case 'End':
          e.preventDefault();
          setFocusedIndex(maxIndex);
          if (sortedSkills.length > 0) {
            const skill = sortedSkills[maxIndex];
            const ref = skillRefs.current.get(skill.id);
            ref?.focus();
          }
          break;
      }
    },
    [sortedSkills]
  );

  // Generate description for screen readers
  const description = useMemo(() => {
    const topSkills = sortedSkills.slice(0, 3).map((s) => s.name);
    const filterText = selectedCategoryFilter
      ? ` Filtered to ${selectedCategoryFilter} category, showing ${filteredSkills.length} skills.`
      : '';
    return `A visualization of ${skills.length} professional skills arranged in a Fibonacci spiral pattern, sized by proficiency and years of experience.${filterText} The largest skills include ${topSkills.join(', ')}. Use arrow keys to navigate between skills.`;
  }, [skills.length, sortedSkills, selectedCategoryFilter, filteredSkills.length]);

  if (width <= 0 || height <= 0) return null;

  return (
    <div className="relative h-full w-full">
      <motion.svg
        ref={containerRef}
        width={width}
        height={height}
        role="img"
        aria-label="Skills Fibonacci Spiral Visualization"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none"
        initial="hidden"
        animate="visible"
      >
        <title>Skills Fibonacci Spiral Visualization</title>
        <desc>{description}</desc>

        <Group>
          {/* Render smooth spiral curve (behind everything) */}
          {sortedSkills.length > 1 &&
            (() => {
              // Generate smooth spiral curve points
              const firstPos = positions.get(sortedSkills[0].id);
              const lastPos = positions.get(sortedSkills[sortedSkills.length - 1].id);
              if (!firstPos || !lastPos) return null;

              // Extract the scale factor from the first position
              // The radius in the position has been scaled, so we can derive the scale
              const PHI = (1 + Math.sqrt(5)) / 2;
              const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);

              // Calculate what the unscaled radius would be at the first position
              const unscaledInitialRadius = sortedSkills[0].fibonacciSize * SIZE_MULTIPLIER * 0.5;
              const unscaledFirstRadius =
                unscaledInitialRadius * Math.exp(SPIRAL_B * firstPos.angle);
              const scale = firstPos.radius / unscaledFirstRadius;

              // Now calculate offset - the center of the unscaled spiral was at (0, 0)
              const unscaledFirstX = unscaledFirstRadius * Math.cos(firstPos.angle);
              const unscaledFirstY = unscaledFirstRadius * Math.sin(firstPos.angle);
              const scaledFirstX = unscaledFirstX * scale;
              const scaledFirstY = unscaledFirstY * scale;
              const offsetX = firstPos.x - scaledFirstX;
              const offsetY = firstPos.y - scaledFirstY;

              // Calculate angles for first and last positions
              const startAngle = firstPos.angle;
              const endAngle = lastPos.angle;
              const angleRange = endAngle - startAngle;

              // Generate smooth curve with many points
              const numPoints = 150;
              const spiralPoints = Array.from({ length: numPoints }, (_, i) => {
                const t = i / (numPoints - 1);
                const angle = startAngle + angleRange * t;

                // Calculate radius using the same formula
                const unscaledRadius = unscaledInitialRadius * Math.exp(SPIRAL_B * angle);
                const scaledRadius = unscaledRadius * scale;

                // Calculate position and apply transformation
                const x = scaledRadius * Math.cos(angle) + offsetX;
                const y = scaledRadius * Math.sin(angle) + offsetY;

                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ');

              return (
                <motion.path
                  d={spiralPoints}
                  stroke="var(--color-foreground)"
                  strokeWidth={1.5}
                  strokeOpacity={0.2}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: reducedMotion ? 0.01 : 2, ease: 'easeInOut' },
                    opacity: { duration: reducedMotion ? 0.01 : 0.5 },
                  }}
                  style={{ pointerEvents: 'none' }}
                />
              );
            })()}

          {/* Render focus rings first (behind nodes) */}
          {sortedSkills.map((skill) => {
            const pos = positions.get(skill.id);
            if (!pos) return null;

            return (
              <SkillNodeFocusRing
                key={`focus-${skill.id}`}
                x={pos.x}
                y={pos.y}
                size={skill.fibonacciSize * SIZE_MULTIPLIER}
                isVisible={focusedId === skill.id}
              />
            );
          })}

          {/* Render skill nodes */}
          <AnimatePresence mode="popLayout">
            {sortedSkills.map((skill, index) => {
              const pos = positions.get(skill.id);
              if (!pos) return null;

              return (
                <SkillNode
                  key={skill.id}
                  ref={(el) => {
                    if (el) {
                      skillRefs.current.set(skill.id, el);
                    } else {
                      skillRefs.current.delete(skill.id);
                    }
                  }}
                  skill={skill}
                  x={pos.x}
                  y={pos.y}
                  size={skill.fibonacciSize * SIZE_MULTIPLIER}
                  isHovered={hoveredId === skill.id}
                  animationDelay={index}
                  reducedMotion={reducedMotion}
                  tabIndex={focusedIndex === index || (focusedIndex === -1 && index === 0) ? 0 : -1}
                  onHover={(hovering) => handleSkillHover(skill, hovering)}
                  onFocus={(focused) => handleSkillFocus(skill, focused)}
                  onClick={() => handleSkillClick(skill)}
                />
              );
            })}
          </AnimatePresence>

          {/* Render skill labels */}
          <AnimatePresence mode="popLayout">
            {sortedSkills.map((skill, index) => {
              const pos = positions.get(skill.id);
              if (!pos) return null;

              const radius = (skill.fibonacciSize * SIZE_MULTIPLIER) / 2;

              return (
                <SkillLabel
                  key={`label-${skill.id}`}
                  skill={skill}
                  x={pos.x}
                  y={pos.y}
                  radius={radius}
                  skillIndex={index}
                  totalSmallSkills={sortedSkills.length}
                  viewportCenter={center}
                  animationDelay={index}
                  reducedMotion={reducedMotion}
                />
              );
            })}
          </AnimatePresence>
        </Group>
      </motion.svg>

      {/* Tooltip */}
      <SkillTooltip
        skill={tooltip.skill}
        position={tooltip.position}
        isVisible={tooltip.isVisible}
        reducedMotion={reducedMotion}
      />

      {/* Legend */}
      {showLegend && (
        <Legend
          position="bottom-left"
          reducedMotion={reducedMotion}
          selectedCategoryFilter={selectedCategoryFilter}
          onCategoryToggle={onCategoryToggle}
          skillCounts={skillCounts}
        />
      )}
    </div>
  );
}

/**
 * Responsive wrapper for the Fibonacci spiral
 */
export function FibonacciSpiral(props: FibonacciSpiralProps) {
  const { className = '' } = props;

  return (
    <div className={`h-[400px] w-full sm:h-[500px] md:h-[600px] lg:h-[700px] ${className}`}>
      <ParentSize>
        {({ width, height }) => <SpiralContent {...props} width={width} height={height} />}
      </ParentSize>
    </div>
  );
}
