/**
 * useViewTransition Hook
 *
 * Manages focus and transition state when switching between visualization views.
 * Ensures keyboard users have proper focus management after view changes.
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export interface UseViewTransitionResult {
  /** Ref to attach to the visualization container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether a view transition is in progress */
  isTransitioning: boolean;
  /** Call when transition starts */
  onTransitionStart: () => void;
  /** Call when transition completes */
  onTransitionComplete: () => void;
}

/**
 * Hook to manage view transitions with focus management
 *
 * @param activeView - Current active view identifier
 * @returns Transition state and handlers
 */
export function useViewTransition(activeView: string): UseViewTransitionResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousViewRef = useRef(activeView);

  // Focus first focusable element after transition completes
  useEffect(() => {
    // Only manage focus if view actually changed and transition completed
    if (previousViewRef.current !== activeView && !isTransitioning) {
      previousViewRef.current = activeView;

      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        if (!containerRef.current) return;

        // Find first focusable element within the container
        const focusableSelectors = [
          '[tabindex="0"]',
          'button:not([disabled])',
          'a[href]',
          'input:not([disabled])',
        ].join(', ');

        const focusable = containerRef.current.querySelector<HTMLElement>(focusableSelectors);
        if (focusable) {
          focusable.focus({ preventScroll: true });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [activeView, isTransitioning]);

  const onTransitionStart = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const onTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return {
    containerRef,
    isTransitioning,
    onTransitionStart,
    onTransitionComplete,
  };
}
