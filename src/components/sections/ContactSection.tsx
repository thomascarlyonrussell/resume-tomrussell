/**
 * ContactSection Component
 *
 * Footer section with contact links and CTA.
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { Container } from '@/components/ui/Container';
import { SocialLinks, type SocialLink } from '@/components/ui/SocialLinks';
import { fadeUpVariants, staggerContainerVariants, reducedMotionVariants } from '@/lib/animations';
import { useIntersectionObserver } from '@/hooks';

// Import contact info from professional summary
import professionalSummary from '@/../resources/professional-summary.json';

export interface ContactSectionProps {
  id?: string;
  ctaMessage?: string;
  className?: string;
}

export function ContactSection({
  id = 'contact',
  ctaMessage = "Let's Connect!",
  className = '',
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.2 });

  const containerVariants = reducedMotion ? reducedMotionVariants : staggerContainerVariants;
  const itemVariants = reducedMotion ? reducedMotionVariants : fadeUpVariants;

  const socialLinks: SocialLink[] = [
    {
      href: professionalSummary.summary.email,
      icon: 'email',
      label: 'Email',
    },
    {
      href: professionalSummary.summary.linkedin,
      icon: 'linkedin',
      label: 'LinkedIn',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`bg-gray-50 py-20 dark:bg-gray-900/50 ${className}`}
    >
      <Container size="md">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* CTA Message */}
          <motion.h2
            id={`${id}-heading`}
            variants={itemVariants}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            {ctaMessage}
          </motion.h2>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="mb-8 text-[var(--color-muted)]">
            I&apos;m always open to discussing new opportunities and ideas.
          </motion.p>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <SocialLinks links={socialLinks} />
          </motion.div>

          {/* Divider */}
          <motion.hr
            variants={itemVariants}
            className="mx-auto my-8 max-w-xs border-gray-200 dark:border-gray-700"
          />

          {/* Copyright */}
          <motion.p variants={itemVariants} className="text-sm text-[var(--color-muted)]">
            &copy; {currentYear} Tom Russell. All rights reserved.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
