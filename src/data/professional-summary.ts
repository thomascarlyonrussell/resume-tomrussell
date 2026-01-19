/**
 * Professional Summary Data
 *
 * Bio, contact information, career highlights, and work philosophy
 */

export interface ProfessionalSummary {
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  linkedin: string;
}

export interface CareerHighlights {
  highlights: string[];
}

export interface WorkPhilosophy {
  approach: string;
  values: string[];
  strengths: string[];
}

/**
 * Professional summary and bio
 */
export const professionalSummary: ProfessionalSummary = {
  headline: 'Product Manager @ Integral Analytics',
  tagline:
    'Building innovative software solutions that empower utilities to integrate sustainable energy into the grid',
  bio: "With a passion for creating innovative software solutions that streamline engineering tasks, I've dedicated my career to driving the future of power grid technologies. As a Product Manager at Integral Analytics, I shape tools that empower engineers and analysts to evaluate the cost-effective integration of sustainable energy into the grid. My role focuses on merging advanced analytics with long-term forecasting to enhance utility decision-making.\n\nI began my career as a distribution engineer with a strong foundation in power systems. My self-taught expertise in computer science, combined with hands-on experience at a major utility, gives me a unique perspective on technology-driven solutions for the energy sector. At PG&E, I led efforts in integrated distribution planning, spearheading the development of tools and standards that set new baselines for hosting capacity analysis across California and the U.S.\n\nI strive to lead by example and learn as much about not just what to do but how to do it. I'm driven by a commitment to challenge the status quo, streamline workflows, and deliver products that move utilities forward, enhancing their processes and capabilities for a sustainable energy future.",
  location: 'Brooklyn, New York, United States',
  email: 'Tom.Russell@IntegralAnalytics.com',
  linkedin: 'https://www.linkedin.com/in/thomascarlyonrussell',
};

/**
 * Key career achievements and milestones
 */
export const careerHighlights: string[] = [
  "Led development of PG&E's first Electric Distribution Resource Plan",
  'Set new 2015 standards for hosting capacity analysis across California and the United States',
  'Transitioned from utility engineering to product management, bridging technical and strategic roles',
  'Subject matter expert on LoadSEER software for utility load forecasting and distribution planning',
  'Pioneered use of graph databases (Neo4j) for electric connectivity modeling in utility planning',
];

/**
 * Work philosophy and approach
 */
export const workPhilosophy: WorkPhilosophy = {
  approach: 'Lead by example and focus on both what to do and how to do it effectively',
  values: [
    'Challenge the status quo',
    'Streamline workflows for maximum efficiency',
    'Deliver products that enhance utility processes',
    'Commit to sustainable energy future',
    'Self-taught and proactive in technology adoption',
  ],
  strengths: [
    'Bridging engineering domain expertise with software product development',
    'Translating complex technical requirements into actionable roadmaps',
    'Building collaborative relationships with diverse stakeholders',
    'Leveraging utility grid planning expertise to guide strategic decisions',
    'Continuous learning and technology exploration',
  ],
};
