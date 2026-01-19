/**
 * SkillLabel Component
 *
 * Main label component that determines whether to render labels inside or outside circles
 * based on circle size, or no label for very small circles
 */

'use client';

import type { ComputedSkill } from '@/data/types';
import { getLabelType } from './utils/labelPositioning';
import { SkillLabelInside } from './SkillLabelInside';
import { SkillLabelOutside } from './SkillLabelOutside';

export interface SkillLabelProps {
  skill: ComputedSkill;
  x: number;
  y: number;
  radius: number;
  skillIndex: number;
  totalSmallSkills: number;
  viewportCenter: { x: number; y: number };
  animationDelay: number;
  reducedMotion: boolean;
}

export function SkillLabel({
  skill,
  x,
  y,
  radius,
  skillIndex,
  totalSmallSkills,
  viewportCenter,
  animationDelay,
  reducedMotion,
}: SkillLabelProps) {
  const diameter = radius * 2;
  const labelType = getLabelType(diameter);

  // No label for very small circles
  if (labelType === 'none') {
    return null;
  }

  // Inside label for large circles
  if (labelType === 'inside') {
    return (
      <SkillLabelInside
        skill={skill}
        x={x}
        y={y}
        radius={radius}
        animationDelay={animationDelay}
        reducedMotion={reducedMotion}
      />
    );
  }

  // Outside label for medium circles
  return (
    <SkillLabelOutside
      skill={skill}
      x={x}
      y={y}
      radius={radius}
      skillIndex={skillIndex}
      totalSmallSkills={totalSmallSkills}
      viewportCenter={viewportCenter}
      animationDelay={animationDelay}
      reducedMotion={reducedMotion}
    />
  );
}
