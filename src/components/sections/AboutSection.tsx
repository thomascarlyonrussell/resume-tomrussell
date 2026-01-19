/**
 * AboutSection Component
 *
 * Professional bio, career highlights, and key stats.
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { Container } from '@/components/ui/Container';
import { fadeUpVariants, staggerContainerVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';
import { getTotalYearsOfExperience } from '@/data';
import { getHighestDegree } from '@/data/education';
import { professionalSummary, careerHighlights } from '@/data/professional-summary';

export interface AboutSectionProps {
  id?: string;
  className?: string;
}

export function AboutSection({ id = 'about', className = '' }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.2 });

  const containerVariants = reducedMotion ? reducedMotionVariants : staggerContainerVariants;
  const itemVariants = reducedMotion ? reducedMotionVariants : fadeUpVariants;

  // Split bio into paragraphs
  const bioParagraphs = professionalSummary.bio.split('\n\n');
  const totalYears = Math.round(getTotalYearsOfExperience());
  const degree = getHighestDegree();

  return (
    <section
      ref={sectionRef}
      id={id}
      data-testid={`${id}-section`}
      aria-labelledby={`${id}-heading`}
      className={`py-20 md:py-32 ${className}`}
    >
      <Container size="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Heading */}
          <motion.h2
            id={`${id}-heading`}
            variants={itemVariants}
            className="mb-8 text-center text-3xl font-bold md:text-4xl"
          >
            About Me
          </motion.h2>

          {/* Stats Badges */}
          <motion.div variants={itemVariants} className="mb-8 flex flex-wrap justify-center gap-4">
            <span className="rounded-full bg-[var(--color-engineering)] px-4 py-2 text-sm font-medium text-white">
              {totalYears}+ Years Experience
            </span>
            <span className="rounded-full bg-[var(--color-software-development)] px-4 py-2 text-sm font-medium text-white">
              {professionalSummary.location}
            </span>
            {degree && (
              <span className="rounded-full bg-[var(--color-product-management)] px-4 py-2 text-sm font-medium text-white">
                {degree.degree}, {degree.institution}
              </span>
            )}
          </motion.div>

          {/* Bio Content */}
          <motion.div variants={itemVariants} className="mx-auto max-w-3xl space-y-4">
            {bioParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Career Highlights */}
          <motion.div variants={itemVariants} className="mx-auto mt-12 max-w-3xl">
            <h3 className="mb-4 text-xl font-semibold md:text-2xl">Career Highlights</h3>
            <ul className="space-y-3">
              {careerHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-ai-automation)]"
                    aria-hidden="true"
                  />
                  <span className="text-base text-[var(--color-muted)]">{highlight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
