/**
 * SkillsSection Component
 *
 * Wrapper for both visualizations with toggle to switch between them.
 */

'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useViewTransition } from '@/components/visualizations/hooks';
import { FibonacciSpiral, TimelineArea, VisualizationToggle, SkillDetailModal } from '@/components/visualizations';
import type { VisualizationView } from '@/components/visualizations/VisualizationToggle';
import type { ComputedSkill } from '@/data/types';
import { Container } from '@/components/ui/Container';
import { fadeUpVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';

export interface SkillsSectionProps {
  id?: string;
  className?: string;
}

const VIEW_CONFIG: Record<VisualizationView, { title: string; subtitle: string }> = {
  fibonacci: {
    title: 'Skills & Experience',
    subtitle: 'Hover for quick info or click to see full details. Size reflects proficiency and years of experience.',
  },
  timeline: {
    title: 'Career Progression',
    subtitle: 'See how skills have grown over time. Hover to explore skills, click milestones for details.',
  },
};

export function SkillsSection({
  id = 'skills',
  className = '',
}: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.1 });
  const [activeView, setActiveView] = useState<VisualizationView>('fibonacci');
  const [selectedSkill, setSelectedSkill] = useState<ComputedSkill | null>(null);

  // Manage focus and transition state
  const {
    containerRef,
    isTransitioning,
    onTransitionStart,
    onTransitionComplete,
  } = useViewTransition(activeView);

  const variants = reducedMotion ? reducedMotionVariants : fadeUpVariants;
  const { title, subtitle } = VIEW_CONFIG[activeView];

  // Handle skill click to open detail modal
  const handleSkillClick = (skill: ComputedSkill) => {
    setSelectedSkill(skill);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`py-20 md:py-32 ${className}`}
    >
      <Container size="xl">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Heading */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <h2
              id={`${id}-heading`}
              className="text-center text-3xl font-bold md:text-4xl"
            >
              {title}
            </h2>

            {/* Toggle */}
            <VisualizationToggle
              activeView={activeView}
              onChange={setActiveView}
              disabled={isTransitioning}
            />

            {/* Subtitle */}
            <p className="max-w-lg text-center text-sm text-[var(--color-muted)] md:text-base">
              {subtitle}
            </p>
          </div>

          {/* Visualization Panel */}
          <div ref={containerRef}>
            <AnimatePresence mode="wait" onExitComplete={onTransitionComplete}>
              {activeView === 'fibonacci' ? (
                <motion.div
                  key="fibonacci"
                  id="fibonacci-panel"
                  role="tabpanel"
                  aria-labelledby="fibonacci-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.3,
                    exit: { duration: reducedMotion ? 0.01 : 0.2 },
                  }}
                  onAnimationStart={onTransitionStart}
                >
                  <FibonacciSpiral showLegend={true} onSkillClick={handleSkillClick} />
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  id="timeline-panel"
                  role="tabpanel"
                  aria-labelledby="timeline-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.3,
                    exit: { duration: reducedMotion ? 0.01 : 0.2 },
                  }}
                  onAnimationStart={onTransitionStart}
                >
                  <TimelineArea />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </Container>

      {/* Skill Detail Modal */}
      <SkillDetailModal skill={selectedSkill} onClose={handleCloseModal} />
    </section>
  );
}
