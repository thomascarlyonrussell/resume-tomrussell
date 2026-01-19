import type { Experience, ExperienceSkill } from './types';

/**
 * Work experience entries in reverse chronological order
 */
export const experience: Experience[] = [
  {
    id: 'personal-development',
    company: 'Personal Development',
    title: 'Self-Study & Continuous Learning',
    startDate: '2023-01',
    endDate: null,
    location: 'Remote',
    description:
      'Continuous learning and skill development through personal projects, online courses, and hands-on experimentation with emerging technologies.',
    highlights: [
      'Explored modern AI tools and development practices',
      'Built personal projects to learn new frameworks and languages',
      'Stayed current with industry trends and best practices',
    ],
    skills: [
      { skillId: 'csharp', proficiency: 5 },
      { skillId: 'powershell', proficiency: 3 },
      { skillId: 'azure-devops', proficiency: 5 },
      { skillId: 'github-copilot', proficiency: 5 },
      { skillId: 'claude-ai', proficiency: 8 },
      { skillId: 'openai-codex', proficiency: 5 },
      { skillId: 'ai-agent-development', proficiency: 5 },
      { skillId: 'mcp-protocol', proficiency: 5 },
      { skillId: 'v0-vibes', proficiency: 5 },
      { skillId: 'openspec', proficiency: 5 },
      { skillId: 'playwright-mcp', proficiency: 3 },
      { skillId: 'public-speaking', proficiency: 5 },
      { skillId: 'stakeholder-management', proficiency: 8 },
      { skillId: 'regulatory-engagement', proficiency: 5 },
      { skillId: 'cross-functional-collaboration', proficiency: 8 }
    ] as ExperienceSkill[],
  } as Experience,
  {
    id: 'integral-analytics-vp',
    company: 'Integral Analytics',
    title: 'Product Manager, VP',
    startDate: '2020-04',
    endDate: null,
    location: 'New York, New York, United States',
    description:
      'Lead product manager responsible for creating long-term roadmaps and managing short-term product backlog for LoadSEER and related products.',
    highlights: [
      'Directed strategic roadmap and prioritized new features using Productboard',
      'Gathered client insights and coordinated developer feedback for sprint management with JIRA',
      'Trained end users and provided technical modeling guidance for new deployments',
      "Developed support tooling for LoadSEER's backend using Python, Azure Pipelines, SQL, and GitHub",
      'Modeled graph database schemas to coordinate electric connectivity models using Neo4j and Cypher',
    ],
    skills: [
      { skillId: 'azure-pipelines', proficiency: 3 },
      { skillId: 'cypher', proficiency: 5 },
      { skillId: 'github', proficiency: 5 },
      { skillId: 'jira', proficiency: 8 },
      { skillId: 'neo4j', proficiency: 5 },
      { skillId: 'product-management', proficiency: 8 },
      { skillId: 'productboard', proficiency: 8 },
      { skillId: 'python', proficiency: 8 },
      { skillId: 'sql', proficiency: 5 },
      { skillId: 'technical-training', proficiency: 5 }
    ] as ExperienceSkill[],
  },
  {
    id: 'integral-analytics-pm',
    company: 'Integral Analytics',
    title: 'Product Manager',
    startDate: '2019-01',
    endDate: '2020-04',
    location: 'San Francisco Bay Area',
    description:
      'Guided the development and implementation of LoadSEER software as a subject matter expert through utility engineering training and background.',
    highlights: [
      'Brought customer feedback and personal experience to build product roadmap and expand design requirements',
      'Navigated graph database data model research for optimal use of connectivity models',
      'Explored R&D for new feature development and data analytics',
      'Led product training, customer support, and sales demos',
    ],
    skills: [
      { skillId: 'neo4j', proficiency: 2 },
      { skillId: 'product-management', proficiency: 5 },
      { skillId: 'python', proficiency: 8 },
      { skillId: 'requirements-gathering', proficiency: 8 },
      { skillId: 'technical-training', proficiency: 2 }
    ] as ExperienceSkill[],
  },
  {
    id: 'pge-expert-engineer',
    company: 'Pacific Gas and Electric Company',
    title: 'Expert Engineer, Grid Innovation',
    startDate: '2018-06',
    endDate: '2019-01',
    location: 'San Francisco Bay Area',
    description:
      "Technical lead for advancing PG&E's integrated distribution planning processes and tools, including hosting capacity efforts that set new 2015 standards across California and the U.S.",
    highlights: [
      'Led design of system-wide process for continually analyzing hosting capacity using LoadSEER, Cymdist, Python, and SQL',
      'Coordinated change management and processes for planning department to provide information for new regulatory filings',
      'Represented PG&E at regulatory and external stakeholder workshops and events',
    ],
    skills: [
      { skillId: 'cymdist', proficiency: 5 },
      { skillId: 'distribution-planning', proficiency: 8 },
      { skillId: 'hosting-capacity', proficiency: 8 },
      { skillId: 'loadseer', proficiency: 8 },
      { skillId: 'python', proficiency: 8 },
      { skillId: 'sql', proficiency: 2 }
    ] as ExperienceSkill[],
  },
  {
    id: 'pge-senior-engineer',
    company: 'Pacific Gas and Electric Company',
    title: 'Senior Engineer, Distributed Resource Planning',
    startDate: '2014-09',
    endDate: '2018-06',
    location: 'San Francisco Bay Area',
    description:
      "Technical expert for developing PG&E's first Electric Distribution Resource Plan.",
    highlights: [
      'Developed methodology and tools to automatically calculate DER Hosting/Integration Capacity on every distribution circuit in the PG&E system',
      'Facilitated collaboration of cross-functional team across many business lines',
      'Coached and mentored entry-level engineers',
    ],
    skills: [
      { skillId: 'distribution-planning', proficiency: 5 },
      { skillId: 'hosting-capacity', proficiency: 5 },
      { skillId: 'loadseer', proficiency: 5 },
      { skillId: 'python', proficiency: 5 },
      { skillId: 'technical-leadership', proficiency: 5 }
    ] as ExperienceSkill[],
  },
  {
    id: 'pge-engineer-dg',
    company: 'Pacific Gas and Electric Company',
    title: 'Engineer, Distributed Generation Interconnection',
    startDate: '2012-09',
    endDate: '2014-08',
    location: 'Sacramento, California Area',
    description:
      'Performed interconnection studies for utility-scale distributed generation and provided technical support for substation systems.',
    highlights: [
      'Performed interconnection studies for utility-scale distributed generation',
      'Provided settings files and troubleshot substation breaker relay issues',
      'Performed research on generation topics related to PV voltage issues, battery mitigation schemes, and smart inverter operations',
      'Developed Access database app to track projects and record technical data for analysis',
    ],
    skills: [
      { skillId: 'microsoft-access', proficiency: 3 },
      { skillId: 'power-systems-analysis', proficiency: 8 },
      { skillId: 'protection-and-control', proficiency: 5 }
    ] as ExperienceSkill[],
  },
  {
    id: 'ppl-engineer-standards',
    company: 'PPL Electric Utilities',
    title: 'Engineer, Distribution Standards',
    startDate: '2011-07',
    endDate: '2012-09',
    location: 'Allentown, Pennsylvania Area',
    description:
      "Lead technical engineer for system-wide distribution capacitor project and administrator of PPL's RTDS Real-Time Power System Simulator Laboratory.",
    highlights: [
      'Led technical engineering for system-wide distribution capacitor project including RFP development',
      "Administered PPL's RTDS Real-Time Power System Simulator Laboratory",
      'Developed new specifications for automated distribution protection devices',
      'Reviewed and updated PPL distribution engineering and construction standard documents',
    ],
    skills: [
      { skillId: 'power-systems-analysis', proficiency: 8 },
      { skillId: 'protection-and-control', proficiency: 2 }
    ] as ExperienceSkill[],
  },
  {
    id: 'ppl-coop-automation',
    company: 'PPL Electric Utilities',
    title: 'Summer Co-Op Engineer, Distribution Automation',
    startDate: '2010-05',
    endDate: '2011-07',
    location: 'Allentown, PA',
    description:
      'SCADA development and testing for distribution and substation automation equipment.',
    highlights: [
      'SCADA development/testing for distribution and substation automation equipment',
      "Wired and programmed the company's first distribution smart grid switch controller",
      'Researched and specified simulation equipment for troubleshooting and validation',
    ],
    skills: [
      { skillId: 'scada', proficiency: 3 }
    ] as ExperienceSkill[],
  },
  {
    id: 'ppl-coop-reliability',
    company: 'PPL Electric Utilities',
    title: 'Summer Co-Op Engineer, Distribution Reliability',
    startDate: '2009-05',
    endDate: '2010-05',
    location: 'Hazleton, PA',
    description:
      'Developed procedures for finding optimal switching strategies for local distribution circuits.',
    highlights: [
      'Developed procedure and documents for finding best switching strategies for local distribution circuits',
      'Performed load flow and short circuit studies on local circuits to ensure proper operating conditions',
      'Assessed distribution lines in the field to identify possible operational problems',
    ],
    skills: [
      { skillId: 'power-systems-analysis', proficiency: 5 }
    ] as ExperienceSkill[],
  },
];

/**
 * Get experience by ID
 */
export function getExperience(id: string): Experience | undefined {
  return experience.find((e) => e.id === id);
}

/**
 * Get current experience (no end date)
 */
export function getCurrentExperience(): Experience | undefined {
  return experience.find((e) => !e.endDate);
}

/**
 * Get experience by company
 */
export function getExperienceByCompany(company: string): Experience[] {
  return experience.filter((e) => e.company === company);
}

/**
 * Get total years of experience
 */
export function getTotalYearsOfExperience(): number {
  const earliest = experience.reduce((min, e) => {
    const start = new Date(e.startDate + '-01');
    return start < min ? start : min;
  }, new Date());

  const years = (Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(years * 10) / 10;
}
