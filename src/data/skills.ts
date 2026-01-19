import type { Skill } from './types';

/**
 * All skills with proficiency levels and time ranges
 *
 * Proficiency uses Fibonacci values: 1, 2, 3, 5, 8
 * - 1 = Beginner/Exposure
 * - 2 = Familiar
 * - 3 = Competent
 * - 5 = Proficient
 * - 8 = Expert
 */
export const skills: Skill[] = [
  // ============================================================================
  // Software Development
  // ============================================================================
  {
    id: 'python',
    name: 'Python',
    category: 'software-development',
    subcategory: 'Languages',
    proficiency: 8,
    startDate: '2015-01',
    endDate: null,
    description:
      'Backend development, scripting, automation, data analytics, and support tooling for LoadSEER',
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'software-development',
    subcategory: 'Languages',
    proficiency: 5,
    startDate: '2019-01',
    endDate: null,
    description: 'LoadSEER product development and backend services',
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    category: 'software-development',
    subcategory: 'Scripting',
    proficiency: 3,
    startDate: '2018-01',
    endDate: null,
    description: 'Automation scripts and system administration',
  },
  {
    id: 'azure-pipelines',
    name: 'Azure Pipelines',
    category: 'software-development',
    subcategory: 'DevOps',
    proficiency: 5,
    startDate: '2020-01',
    endDate: null,
    description: 'CI/CD pipelines for LoadSEER backend deployment',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'software-development',
    subcategory: 'Version Control',
    proficiency: 5,
    startDate: '2018-01',
    endDate: null,
    description: 'Source control, collaboration, and code review',
  },
  {
    id: 'microsoft-access',
    name: 'Microsoft Access',
    category: 'software-development',
    subcategory: 'Desktop Applications',
    proficiency: 3,
    startDate: '2012-09',
    endDate: '2015-01',
    description: 'Database application development for project tracking and data analysis',
  },

  // ============================================================================
  // Data & Analytics
  // ============================================================================
  {
    id: 'sql',
    name: 'SQL',
    category: 'data-analytics',
    subcategory: 'Databases',
    proficiency: 5,
    startDate: '2014-01',
    endDate: null,
    description: 'Database queries, data analysis, and LoadSEER backend operations',
  },
  {
    id: 'neo4j',
    name: 'Neo4j',
    category: 'data-analytics',
    subcategory: 'Databases',
    proficiency: 5,
    startDate: '2019-01',
    endDate: null,
    description:
      'Graph database schemas for electric connectivity models and distribution network modeling',
  },
  {
    id: 'cypher',
    name: 'Cypher',
    category: 'data-analytics',
    subcategory: 'Query Languages',
    proficiency: 5,
    startDate: '2019-01',
    endDate: null,
    description: 'Graph database queries for Neo4j connectivity models',
  },
  {
    id: 'loadseer',
    name: 'LoadSEER',
    category: 'data-analytics',
    subcategory: 'Domain Tools',
    proficiency: 8,
    startDate: '2014-09',
    endDate: null,
    description:
      'Utility load forecasting and distribution planning software - subject matter expert',
  },

  // ============================================================================
  // Engineering
  // ============================================================================
  {
    id: 'cymdist',
    name: 'Cymdist',
    category: 'engineering',
    subcategory: 'Domain Tools',
    proficiency: 5,
    startDate: '2014-09',
    endDate: '2020-01',
    description: 'Power distribution system analysis and modeling',
  },
  {
    id: 'distribution-planning',
    name: 'Distribution Planning',
    category: 'engineering',
    subcategory: 'Power Systems',
    proficiency: 8,
    startDate: '2012-09',
    endDate: null,
    description: 'Integrated distribution planning, DER integration, and grid modernization',
  },
  {
    id: 'hosting-capacity',
    name: 'Hosting Capacity Analysis',
    category: 'engineering',
    subcategory: 'Power Systems',
    proficiency: 8,
    startDate: '2014-09',
    endDate: null,
    description:
      'DER hosting capacity methodology and analysis - set California/U.S. standards in 2015',
  },
  {
    id: 'power-systems-analysis',
    name: 'Power Systems Analysis',
    category: 'engineering',
    subcategory: 'Power Systems',
    proficiency: 8,
    startDate: '2009-05',
    endDate: null,
    description: 'Load flow, short circuit studies, interconnection analysis',
  },
  {
    id: 'protection-and-control',
    name: 'Protection and Control',
    category: 'engineering',
    subcategory: 'Power Systems',
    proficiency: 5,
    startDate: '2010-05',
    endDate: '2019-01',
    description: 'Substation relay settings, protection logic, and control systems',
  },
  {
    id: 'scada',
    name: 'SCADA',
    category: 'engineering',
    subcategory: 'Industrial Systems',
    proficiency: 3,
    startDate: '2010-05',
    endDate: '2012-09',
    description: 'Distribution and substation automation equipment development and testing',
  },

  // ============================================================================
  // Product Management
  // ============================================================================
  {
    id: 'productboard',
    name: 'Productboard',
    category: 'product-management',
    subcategory: 'Roadmapping',
    proficiency: 8,
    startDate: '2020-04',
    endDate: null,
    description: 'Strategic roadmaps, feature prioritization, and product planning',
  },
  {
    id: 'jira',
    name: 'JIRA',
    category: 'product-management',
    subcategory: 'Project Management',
    proficiency: 5,
    startDate: '2019-01',
    endDate: null,
    description: 'Sprint management, backlog coordination, and developer feedback',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    category: 'product-management',
    subcategory: 'Core Skills',
    proficiency: 8,
    startDate: '2019-01',
    endDate: null,
    description:
      'Roadmap development, requirements gathering, stakeholder management, and product strategy',
  },
  {
    id: 'requirements-gathering',
    name: 'Requirements Gathering',
    category: 'product-management',
    subcategory: 'Core Skills',
    proficiency: 8,
    startDate: '2014-09',
    endDate: null,
    description: 'Client insights, user feedback, and design requirement development',
  },
  {
    id: 'technical-leadership',
    name: 'Technical Leadership',
    category: 'product-management',
    subcategory: 'Leadership',
    proficiency: 5,
    startDate: '2014-09',
    endDate: null,
    description: 'Cross-functional team collaboration, mentoring, and technical guidance',
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps',
    category: 'product-management',
    subcategory: 'Project Management',
    proficiency: 5,
    startDate: '2020-01',
    endDate: null,
    description: 'Work item tracking, boards, and sprint management',
  },

  // ============================================================================
  // AI & Automation
  // ============================================================================
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'ai-automation',
    subcategory: 'AI Coding Assistants',
    proficiency: 5,
    startDate: '2023-06',
    endDate: null,
    description: 'AI-powered code completion and generation',
  },
  {
    id: 'claude-ai',
    name: 'Claude (Anthropic)',
    category: 'ai-automation',
    subcategory: 'AI Coding Assistants',
    proficiency: 8,
    startDate: '2024-01',
    endDate: null,
    description: 'Advanced AI assistant for coding, analysis, and product work',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    category: 'ai-automation',
    subcategory: 'AI Coding Assistants',
    proficiency: 5,
    startDate: '2023-03',
    endDate: null,
    description: 'GPT-based code generation and completion',
  },
  {
    id: 'ai-agent-development',
    name: 'AI Agent Development',
    category: 'ai-automation',
    subcategory: 'Agent Building',
    proficiency: 5,
    startDate: '2024-06',
    endDate: null,
    description: 'Building custom AI agents with instructions and specialized skills',
  },
  {
    id: 'mcp-protocol',
    name: 'Model Context Protocol (MCP)',
    category: 'ai-automation',
    subcategory: 'AI Integration',
    proficiency: 5,
    startDate: '2024-11',
    endDate: null,
    description: 'MCP usage in VSCode and Claude for enhanced AI capabilities',
  },
  {
    id: 'v0-vibes',
    name: 'v0 by Vercel',
    category: 'ai-automation',
    subcategory: 'Prototyping',
    proficiency: 5,
    startDate: '2024-08',
    endDate: null,
    description: 'Quick UI prototyping with AI-generated React components',
  },
  {
    id: 'openspec',
    name: 'OpenSpec',
    category: 'ai-automation',
    subcategory: 'Specification Tools',
    proficiency: 5,
    startDate: '2025-01',
    endDate: null,
    description:
      'Spec-driven development with AI-powered context building and validation',
  },
  {
    id: 'playwright-mcp',
    name: 'Playwright MCP',
    category: 'ai-automation',
    subcategory: 'Browser Automation',
    proficiency: 3,
    startDate: '2024-12',
    endDate: null,
    description: 'Browser automation via MCP for testing and interaction workflows',
  },

  // ============================================================================
  // Professional Skills
  // ============================================================================
  {
    id: 'public-speaking',
    name: 'Public Speaking & Presentations',
    category: 'professional-skills',
    subcategory: 'Communication',
    proficiency: 5,
    startDate: '2014-09',
    endDate: null,
    description:
      'Client demos, sales presentations, product training, and conference speaking',
  },
  {
    id: 'stakeholder-management',
    name: 'Stakeholder Management',
    category: 'professional-skills',
    subcategory: 'Leadership',
    proficiency: 8,
    startDate: '2014-09',
    endDate: null,
    description:
      'Alignment with strategic and executive teams, client relationship management, and cross-organizational coordination',
  },
  {
    id: 'regulatory-engagement',
    name: 'Regulatory Engagement',
    category: 'professional-skills',
    subcategory: 'Policy & Compliance',
    proficiency: 5,
    startDate: '2014-09',
    endDate: '2019-01',
    description:
      'Represented PG&E at regulatory workshops, external stakeholder events, and policy development forums',
  },
  {
    id: 'cross-functional-collaboration',
    name: 'Cross-Functional Collaboration',
    category: 'professional-skills',
    subcategory: 'Teamwork',
    proficiency: 8,
    startDate: '2012-09',
    endDate: null,
    description:
      'Facilitating collaboration across business lines, engineering teams, and product development groups',
  },

  // ============================================================================
  // Content Creation
  // ============================================================================
  {
    id: 'technical-training',
    name: 'Technical Training',
    category: 'content-creation',
    subcategory: 'Training & Education',
    proficiency: 5,
    startDate: '2014-09',
    endDate: null,
    description: 'End user training, product demonstrations, and modeling guidance',
  },
];

/**
 * Get skill by ID
 */
export function getSkill(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(categoryId: string): Skill[] {
  return skills.filter((s) => s.category === categoryId);
}

/**
 * Get skills by subcategory
 */
export function getSkillsBySubcategory(subcategory: string): Skill[] {
  return skills.filter((s) => s.subcategory === subcategory);
}

/**
 * Get all unique subcategories
 */
export function getSubcategories(): string[] {
  return [...new Set(skills.map((s) => s.subcategory))];
}
