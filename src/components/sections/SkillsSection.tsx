/**
 * SkillsSection Component
 *
 * Wrapper for the Fibonacci spiral visualization.
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { FibonacciSpiral } from '@/components/visualizations';
import { Container } from '@/components/ui/Container';
import { fadeUpVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';

export interface SkillsSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function SkillsSection({
  id = 'skills',
  title = 'Skills & Experience',
  subtitle = 'Hover or tap on skills to learn more. Size reflects proficiency and years of experience.',
  className = '',
}: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const variants = reducedMotion ? reducedMotionVariants : fadeUpVariants;

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
          <h2
            id={`${id}-heading`}
            className="mb-4 text-center text-3xl font-bold md:text-4xl"
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mb-8 text-center text-sm text-[var(--color-muted)] md:text-base">
            {subtitle}
          </p>

          {/* Fibonacci Spiral Visualization */}
          <FibonacciSpiral showLegend={true} />
        </motion.div>
      </Container>
    </section>
  );
}
