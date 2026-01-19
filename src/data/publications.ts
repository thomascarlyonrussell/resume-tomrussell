import type { Publication } from './types';

/**
 * Publications including research papers, technical reports, and regulatory filings
 */
export const publications: Publication[] = [
  {
    id: 'ev-reactive-power',
    title:
      'Electric Vehicle Impact on Distribution Grid: Reactive Power Compensation and Voltage Support',
    type: 'Research Paper',
    date: null,
    description:
      'Analysis of electric vehicle charging impacts on distribution grid voltage profiles and reactive power requirements',
    url: null,
  },
  {
    id: 'pge-drp',
    title: 'PG&E Electric Distribution Resource Plan',
    type: 'Regulatory Filing',
    date: '2016-06',
    description:
      "PG&E's first comprehensive Electric Distribution Resource Plan detailing DER integration strategies and hosting capacity analysis",
    url: null,
  },
];

/**
 * Get publication by ID
 */
export function getPublication(id: string): Publication | undefined {
  return publications.find((p) => p.id === id);
}

/**
 * Get publications by type
 */
export function getPublicationsByType(type: string): Publication[] {
  return publications.filter((p) => p.type === type);
}

/**
 * Get dated publications sorted by date
 */
export function getDatedPublications(): Publication[] {
  return publications
    .filter((p) => p.date !== null)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
