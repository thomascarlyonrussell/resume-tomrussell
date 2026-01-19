/**
 * useSkillTooltip Hook
 *
 * Manages tooltip state and positioning for skill nodes.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { ComputedSkill } from '@/data/types';

export interface TooltipPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipState {
  skill: ComputedSkill | null;
  position: TooltipPosition | null;
  isVisible: boolean;
}

export interface UseSkillTooltipOptions {
  containerRef: React.RefObject<HTMLElement | SVGSVGElement | null>;
  tooltipWidth?: number;
  tooltipHeight?: number;
  offset?: number;
}

export interface UseSkillTooltipResult extends TooltipState {
  showTooltip: (skill: ComputedSkill, anchorX: number, anchorY: number, nodeRadius: number) => void;
  hideTooltip: () => void;
  updatePosition: (anchorX: number, anchorY: number, nodeRadius: number) => void;
}

const DEFAULT_TOOLTIP_WIDTH = 280;
const DEFAULT_TOOLTIP_HEIGHT = 160;
const DEFAULT_OFFSET = 12;

/**
 * Calculate optimal tooltip position to stay within viewport
 */
function calculateTooltipPosition(
  anchorX: number,
  anchorY: number,
  nodeRadius: number,
  containerWidth: number,
  containerHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  offset: number
): TooltipPosition {
  // Try right first
  let x = anchorX + nodeRadius + offset;
  let y = anchorY - tooltipHeight / 2;
  let placement: TooltipPosition['placement'] = 'right';

  // If overflows right, try left
  if (x + tooltipWidth > containerWidth - offset) {
    x = anchorX - nodeRadius - tooltipWidth - offset;
    placement = 'left';
  }

  // If overflows left too, try bottom
  if (x < offset) {
    x = anchorX - tooltipWidth / 2;
    if (anchorY < containerHeight / 2) {
      y = anchorY + nodeRadius + offset;
      placement = 'bottom';
    } else {
      y = anchorY - nodeRadius - tooltipHeight - offset;
      placement = 'top';
    }
  }

  // Clamp to container bounds
  x = Math.max(offset, Math.min(x, containerWidth - tooltipWidth - offset));
  y = Math.max(offset, Math.min(y, containerHeight - tooltipHeight - offset));

  return { x, y, placement };
}

export function useSkillTooltip(options: UseSkillTooltipOptions): UseSkillTooltipResult {
  const {
    containerRef,
    tooltipWidth = DEFAULT_TOOLTIP_WIDTH,
    tooltipHeight = DEFAULT_TOOLTIP_HEIGHT,
    offset = DEFAULT_OFFSET,
  } = options;

  const [state, setState] = useState<TooltipState>({
    skill: null,
    position: null,
    isVisible: false,
  });

  const currentSkillRef = useRef<ComputedSkill | null>(null);

  const showTooltip = useCallback(
    (skill: ComputedSkill, anchorX: number, anchorY: number, nodeRadius: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const position = calculateTooltipPosition(
        anchorX,
        anchorY,
        nodeRadius,
        containerWidth,
        containerHeight,
        tooltipWidth,
        tooltipHeight,
        offset
      );

      currentSkillRef.current = skill;
      setState({
        skill,
        position,
        isVisible: true,
      });
    },
    [containerRef, tooltipWidth, tooltipHeight, offset]
  );

  const hideTooltip = useCallback(() => {
    currentSkillRef.current = null;
    setState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const updatePosition = useCallback(
    (anchorX: number, anchorY: number, nodeRadius: number) => {
      const container = containerRef.current;
      const skill = currentSkillRef.current;
      if (!container || !skill) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const position = calculateTooltipPosition(
        anchorX,
        anchorY,
        nodeRadius,
        containerWidth,
        containerHeight,
        tooltipWidth,
        tooltipHeight,
        offset
      );

      setState((prev) => ({
        ...prev,
        position,
      }));
    },
    [containerRef, tooltipWidth, tooltipHeight, offset]
  );

  return {
    ...state,
    showTooltip,
    hideTooltip,
    updatePosition,
  };
}
