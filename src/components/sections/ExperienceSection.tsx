/**
 * ExperienceSection Component
 *
 * Displays work history in a vertical timeline layout.
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { Container } from '@/components/ui/Container';
import { ExperienceCard } from '@/components/experience';
import { fadeUpVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';
import { experience } from '@/data';

export interface ExperienceSectionProps {
  id?: string;
  title?: string;
  className?: string;
}

export function ExperienceSection({
  id = 'experience',
  title = 'Work Experience',
  className = '',
}: ExperienceSectionProps) {
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
      <Container size="md">
        <motion.div variants={variants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          {/* Section Heading */}
          <h2 id={`${id}-heading`} className="mb-8 text-center text-3xl font-bold md:text-4xl">
            {title}
          </h2>

          {/* Timeline */}
          <div className="relative">
            {experience.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} animationDelay={index} />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
