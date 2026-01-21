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
    skills: [] as ExperienceSkill[],
  } as Experience,
  {
    id: 'integral-analytics-vp-2025',
    company: 'Integral Analytics',
    title: 'Product Manager, VP',
    startDate: '2025-01',
    endDate: null,
    location: 'New York, New York, United States',
    description:
      'Lead product manager focused on AI-driven development practices and innovative tooling for LoadSEER and related products.',
    highlights: [
      'Pioneered AI-assisted development workflows at IA using Claude AI, GitHub Copilot, and MCP protocol',
      'Developed custom AI agents and skills for product development automation',
      'Continued strategic roadmap direction and feature prioritization',
      'Advanced support tooling with modern AI integration patterns',
    ],
    skills: [
      { skillId: 'product-management', rigor: 8 },
      { skillId: 'productboard', rigor: 5 },
      { skillId: 'jira', rigor: 5 },
      { skillId: 'stakeholder-management', rigor: 8 },
      { skillId: 'cross-functional-collaboration', rigor: 8 },
      { skillId: 'loadseer', rigor: 8 },
      { skillId: 'python', rigor: 5 },
      { skillId: 'azure-devops', rigor: 5 },
      { skillId: 'github', rigor: 5 },
      { skillId: 'technical-training', rigor: 5 },
      { skillId: 'claude-ai', rigor: 3 },
      { skillId: 'github-copilot', rigor: 3 },
      { skillId: 'openai-codex', rigor: 3 },
      { skillId: 'distribution-planning', rigor: 3 },
      { skillId: 'mcp-protocol', rigor: 2 },
      { skillId: 'openspec', rigor: 2 },
      { skillId: 'ai-agent-development', rigor: 2 },
      { skillId: 'playwright', rigor: 2 },
      { skillId: 'csharp', rigor: 1 },
    ] as ExperienceSkill[],
  },
  {
    id: 'integral-analytics-vp-2021-2024',
    company: 'Integral Analytics',
    title: 'Product Manager, VP',
    startDate: '2021-01',
    endDate: '2024-12',
    location: 'New York, New York, United States',
    description:
      'Lead product manager responsible for creating long-term roadmaps and managing short-term product backlog for LoadSEER and related products, while managing direct reports.',
    highlights: [
      'Directed strategic roadmap and prioritized new features using Productboard',
      'Managed team of developers and coordinated sprint planning and execution',
      'Gathered client insights and coordinated developer feedback for sprint management with JIRA',
      'Trained end users and provided technical modeling guidance for new deployments',
      "Developed support tooling for LoadSEER's backend using Python, Azure Pipelines, SQL, and GitHub",
      'Modeled graph database schemas to coordinate electric connectivity models using Neo4j and Cypher',
    ],
    skills: [
      { skillId: 'product-management', rigor: 8 },
      { skillId: 'productboard', rigor: 8 },
      { skillId: 'jira', rigor: 8 },
      { skillId: 'stakeholder-management', rigor: 8 },
      { skillId: 'cross-functional-collaboration', rigor: 8 },
      { skillId: 'loadseer', rigor: 8 },
      { skillId: 'python', rigor: 5 },
      { skillId: 'azure-devops', rigor: 5 },
      { skillId: 'github', rigor: 5 },
      { skillId: 'sql', rigor: 5 },
      { skillId: 'neo4j', rigor: 5 },
      { skillId: 'cypher', rigor: 5 },
      { skillId: 'technical-training', rigor: 5 },
      { skillId: 'agile-scrum', rigor: 3 },
      { skillId: 'distribution-planning', rigor: 3 },
      { skillId: 'public-speaking', rigor: 2 },
      { skillId: 'team-management', rigor: 2 },
      { skillId: 'github-copilot', rigor: 2 },
      { skillId: 'azure-pipelines', rigor: 2 },
      { skillId: 'hosting-capacity', rigor: 1 },
    ] as ExperienceSkill[],
  },
  {
    id: 'integral-analytics-vp-2020',
    company: 'Integral Analytics',
    title: 'Product Manager, VP',
    startDate: '2020-04',
    endDate: '2020-12',
    location: 'New York, New York, United States',
    description:
      'Promoted to VP, establishing processes and systems for long-term product roadmap and backlog management for LoadSEER and related products.',
    highlights: [
      'Established strategic roadmap framework and feature prioritization using Productboard',
      'Gathered client insights and coordinated developer feedback for sprint management with JIRA',
      'Built foundation for product training and technical guidance programs',
      "Developed initial support tooling for LoadSEER's backend using Python and SQL",
    ],
    skills: [
      { skillId: 'product-management', rigor: 8 },
      { skillId: 'productboard', rigor: 8 },
      { skillId: 'jira', rigor: 8 },
      { skillId: 'python', rigor: 8 },
      { skillId: 'stakeholder-management', rigor: 8 },
      { skillId: 'cross-functional-collaboration', rigor: 8 },
      { skillId: 'loadseer', rigor: 8 },
      { skillId: 'sql', rigor: 5 },
      { skillId: 'technical-training', rigor: 5 },
      { skillId: 'distribution-planning', rigor: 3 },
      { skillId: 'hosting-capacity', rigor: 2 },
    ] as ExperienceSkill[],
  },
  {
    id: 'integral-analytics-pm',
    company: 'Integral Analytics',
    title: 'Product Manager',
    startDate: '2019-01',
    endDate: '2020-03',
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
      { skillId: 'python', rigor: 8 },
      { skillId: 'requirements-gathering', rigor: 8 },
      { skillId: 'product-management', rigor: 5 },
      { skillId: 'loadseer', rigor: 5 },
      { skillId: 'distribution-planning', rigor: 3 },
      { skillId: 'neo4j', rigor: 2 },
      { skillId: 'technical-training', rigor: 2 },
      { skillId: 'hosting-capacity', rigor: 2 },
    ] as ExperienceSkill[],
  },
  {
    id: 'pge-expert-engineer',
    company: 'Pacific Gas and Electric Company',
    title: 'Expert Engineer, Grid Innovation',
    startDate: '2018-06',
    endDate: '2018-12',
    location: 'San Francisco Bay Area',
    description:
      "Technical lead for advancing PG&E's integrated distribution planning processes and tools, including hosting capacity efforts that set new 2015 standards across California and the U.S.",
    highlights: [
      'Led design of system-wide process for continually analyzing hosting capacity using LoadSEER, Cymdist, Python, and SQL',
      'Coordinated change management and processes for planning department to provide information for new regulatory filings',
      'Represented PG&E at regulatory and external stakeholder workshops and events',
    ],
    skills: [
      { skillId: 'distribution-planning', rigor: 8 },
      { skillId: 'hosting-capacity', rigor: 8 },
      { skillId: 'python', rigor: 8 },
      { skillId: 'cymdist', rigor: 5 },
      { skillId: 'stakeholder-management', rigor: 5 },
      { skillId: 'cross-functional-collaboration', rigor: 5 },
      { skillId: 'public-speaking', rigor: 5 },
      { skillId: 'regulatory-engagement', rigor: 5 },
      { skillId: 'loadseer', rigor: 3 },
      { skillId: 'sql', rigor: 2 },
    ] as ExperienceSkill[],
  },
  {
    id: 'pge-senior-engineer',
    company: 'Pacific Gas and Electric Company',
    title: 'Senior Engineer, Distributed Resource Planning',
    startDate: '2014-09',
    endDate: '2018-05',
    location: 'San Francisco Bay Area',
    description:
      "Technical expert for developing PG&E's first Electric Distribution Resource Plan.",
    highlights: [
      'Developed methodology and tools to automatically calculate DER Hosting/Integration Capacity on every distribution circuit in the PG&E system',
      'Facilitated collaboration of cross-functional team across many business lines',
      'Coached and mentored entry-level engineers',
    ],
    skills: [
      { skillId: 'distribution-planning', rigor: 5 },
      { skillId: 'hosting-capacity', rigor: 5 },
      { skillId: 'python', rigor: 5 },
      { skillId: 'technical-leadership', rigor: 5 },
      { skillId: 'stakeholder-management', rigor: 5 },
      { skillId: 'cross-functional-collaboration', rigor: 5 },
      { skillId: 'regulatory-engagement', rigor: 5 },
      { skillId: 'public-speaking', rigor: 3 },
      { skillId: 'loadseer', rigor: 2 },
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
      { skillId: 'power-systems-analysis', rigor: 8 },
      { skillId: 'protection-and-control', rigor: 5 },
      { skillId: 'microsoft-access', rigor: 3 },
    ] as ExperienceSkill[],
  },
  {
    id: 'ppl-engineer-standards',
    company: 'PPL Electric Utilities',
    title: 'Engineer, Distribution Standards',
    startDate: '2011-07',
    endDate: '2012-08',
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
      { skillId: 'power-systems-analysis', rigor: 8 },
      { skillId: 'protection-and-control', rigor: 2 }
    ] as ExperienceSkill[],
  },
  {
    id: 'ppl-coop-automation',
    company: 'PPL Electric Utilities',
    title: 'Summer Co-Op Engineer, Distribution Automation',
    startDate: '2010-05',
    endDate: '2011-06',
    location: 'Allentown, PA',
    description:
      'SCADA development and testing for distribution and substation automation equipment.',
    highlights: [
      'SCADA development/testing for distribution and substation automation equipment',
      "Wired and programmed the company's first distribution smart grid switch controller",
      'Researched and specified simulation equipment for troubleshooting and validation',
    ],
    skills: [
      { skillId: 'scada', rigor: 3 }
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
      { skillId: 'power-systems-analysis', rigor: 5 }
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
