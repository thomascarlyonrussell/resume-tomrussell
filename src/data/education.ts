import type { Education, Certification } from './types';

/**
 * Formal education entries
 */
export const education: Education[] = [
  {
    id: 'pennstate-bs',
    institution: 'Penn State University',
    degree: 'Bachelor of Science',
    field: 'Electrical Engineering',
    focus: 'Power Systems',
    startDate: '2007-08',
    endDate: '2011-05',
    location: 'University Park, PA',
  },
];

/**
 * Professional certifications
 */
export const certifications: Certification[] = [
  {
    id: 'neo4j-clinic',
    name: 'Database Clinic: Neo4J',
    issuer: 'LinkedIn Learning / Lynda.com',
    date: '2019-06',
    description:
      'Comprehensive training on Neo4j graph database design, implementation, and Cypher queries',
    url: null,
    expirationDate: null,
  },
];

/**
 * Get education by ID
 */
export function getEducation(id: string): Education | undefined {
  return education.find((e) => e.id === id);
}

/**
 * Get certification by ID
 */
export function getCertification(id: string): Certification | undefined {
  return certifications.find((c) => c.id === id);
}

/**
 * Get highest degree
 */
export function getHighestDegree(): Education | undefined {
  // For now, just return the first (only) degree
  // Could be extended to rank by degree level
  return education[0];
}

/**
 * Get active certifications (not expired)
 */
export function getActiveCertifications(): Certification[] {
  const now = new Date().toISOString().slice(0, 7); // YYYY-MM
  return certifications.filter((c) => !c.expirationDate || c.expirationDate >= now);
}
