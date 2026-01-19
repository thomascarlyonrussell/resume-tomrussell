/**
 * SkillsSection Component
 *
 * Wrapper for both visualizations with toggle to switch between them.
 */

'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { FibonacciSpiral, TimelineArea, VisualizationToggle } from '@/components/visualizations';
import type { VisualizationView } from '@/components/visualizations/VisualizationToggle';
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
    subtitle: 'Hover or tap on skills to learn more. Size reflects proficiency and years of experience.',
  },
  timeline: {
    title: 'Career Progression',
    subtitle: 'See how skills have grown over time. Hover to explore skills active at each point.',
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

  const variants = reducedMotion ? reducedMotionVariants : fadeUpVariants;
  const { title, subtitle } = VIEW_CONFIG[activeView];

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
            />

            {/* Subtitle */}
            <p className="max-w-lg text-center text-sm text-[var(--color-muted)] md:text-base">
              {subtitle}
            </p>
          </div>

          {/* Visualization Panel */}
          <AnimatePresence mode="wait">
            {activeView === 'fibonacci' ? (
              <motion.div
                key="fibonacci"
                id="fibonacci-panel"
                role="tabpanel"
                aria-labelledby="fibonacci-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
              >
                <FibonacciSpiral showLegend={true} />
              </motion.div>
            ) : (
              <motion.div
                key="timeline"
                id="timeline-panel"
                role="tabpanel"
                aria-labelledby="timeline-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
              >
                <TimelineArea />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
