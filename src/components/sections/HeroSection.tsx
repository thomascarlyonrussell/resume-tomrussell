/**
 * HeroSection Component
 *
 * Full-height hero section with name, headline, tagline, and scroll cue.
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { ScrollCue } from '@/components/ui/ScrollCue';
import { fadeUpVariants, staggerContainerVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';

export interface HeroSectionProps {
  id?: string;
  name?: string;
  headline?: string;
  tagline?: string;
  showScrollCue?: boolean;
  className?: string;
}

export function HeroSection({
  id = 'hero',
  name = 'Tom Russell',
  headline = 'Product Manager @ Integral Analytics',
  tagline = 'Building innovative software solutions that empower utilities to integrate sustainable energy into the grid',
  showScrollCue = true,
  className = '',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const containerVariants = reducedMotion ? reducedMotionVariants : staggerContainerVariants;
  const itemVariants = reducedMotion ? reducedMotionVariants : fadeUpVariants;

  return (
    <section
      ref={sectionRef}
      id={id}
      data-testid={`${id}-section`}
      aria-labelledby={`${id}-heading`}
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-20 ${className}`}
    >
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Name */}
        <motion.h1
          id={`${id}-heading`}
          variants={itemVariants}
          className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {name}
        </motion.h1>

        {/* Headline */}
        <motion.p
          variants={itemVariants}
          className="mb-4 text-lg font-medium text-[var(--color-foreground)] sm:text-xl md:text-2xl"
        >
          {headline}
        </motion.p>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mx-auto max-w-2xl text-base text-[var(--color-muted)] sm:text-lg md:text-xl"
        >
          {tagline}
        </motion.p>
      </motion.div>

      {/* Scroll Cue */}
      {showScrollCue && (
        <motion.div
          className="absolute bottom-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1, duration: reducedMotion ? 0.01 : 0.5 }}
        >
          <ScrollCue targetSection="#about" label="Scroll to explore" />
        </motion.div>
      )}
    </section>
  );
}
