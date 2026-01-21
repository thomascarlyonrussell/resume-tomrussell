import type { Skill } from './types';

/**
 * All skills (reference data only - proficiency and timelines derived from experiences)
 *
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
    description:
      'Backend development, scripting, automation, data analytics, and support tooling for LoadSEER',
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'software-development',
    subcategory: 'Languages',
    description: 'LoadSEER product development and backend services',
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    category: 'software-development',
    subcategory: 'Scripting',
    description: 'Automation scripts and system administration',
  },
  {
    id: 'azure-pipelines',
    name: 'Azure Pipelines',
    category: 'software-development',
    subcategory: 'DevOps',
    description: 'CI/CD pipelines for LoadSEER backend deployment',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'software-development',
    subcategory: 'Version Control',
    description: 'Source control, collaboration, and code review',
  },
  {
    id: 'microsoft-access',
    name: 'Microsoft Access',
    category: 'software-development',
    subcategory: 'Desktop Applications',
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
    description: 'Database queries, data analysis, and LoadSEER backend operations',
  },
  {
    id: 'neo4j',
    name: 'Neo4j',
    category: 'data-analytics',
    subcategory: 'Databases',
    description:
      'Graph database schemas for electric connectivity models and distribution network modeling',
  },
  {
    id: 'cypher',
    name: 'Cypher',
    category: 'data-analytics',
    subcategory: 'Query Languages',
    description: 'Graph database queries for Neo4j connectivity models',
  },
  {
    id: 'loadseer',
    name: 'LoadSEER',
    category: 'data-analytics',
    subcategory: 'Domain Tools',
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
    description: 'Power distribution system analysis and modeling',
  },
  {
    id: 'distribution-planning',
    name: 'Distribution Planning',
    category: 'engineering',
    subcategory: 'Power Systems',
    description: 'Integrated distribution planning, DER integration, and grid modernization',
  },
  {
    id: 'hosting-capacity',
    name: 'Hosting Capacity Analysis',
    category: 'engineering',
    subcategory: 'Power Systems',
    description:
      'DER hosting capacity methodology and analysis - set California/U.S. standards in 2015',
  },
  {
    id: 'power-systems-analysis',
    name: 'Power Systems Analysis',
    category: 'engineering',
    subcategory: 'Power Systems',
    description: 'Load flow, short circuit studies, interconnection analysis',
  },
  {
    id: 'protection-and-control',
    name: 'Protection and Control',
    category: 'engineering',
    subcategory: 'Power Systems',
    description: 'Substation relay settings, protection logic, and control systems',
  },
  {
    id: 'scada',
    name: 'SCADA',
    category: 'engineering',
    subcategory: 'Industrial Systems',
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
    description: 'Strategic roadmaps, feature prioritization, and product planning',
  },
  {
    id: 'jira',
    name: 'JIRA',
    category: 'product-management',
    subcategory: 'Project Management',
    description: 'Sprint management, backlog coordination, and developer feedback',
  },
  {
    id: 'agile-scrum',
    name: 'Agile/Scrum Methodology',
    category: 'product-management',
    subcategory: 'Project Management',
    description:
      'Scrum framework including sprint planning, backlog management, and ceremonies. Certified Product Owner and Scrum Master.',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    category: 'product-management',
    subcategory: 'Core Skills',
    description:
      'Roadmap development, requirements gathering, stakeholder management, and product strategy',
  },
  {
    id: 'requirements-gathering',
    name: 'Requirements Gathering',
    category: 'product-management',
    subcategory: 'Core Skills',
    description: 'Client insights, user feedback, and design requirement development',
  },
  {
    id: 'technical-leadership',
    name: 'Technical Leadership',
    category: 'product-management',
    subcategory: 'Leadership',
    description: 'Cross-functional team collaboration, mentoring, and technical guidance',
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps',
    category: 'product-management',
    subcategory: 'Project Management',
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
    description: 'AI-powered code completion and generation',
  },
  {
    id: 'claude-ai',
    name: 'Claude (Anthropic)',
    category: 'ai-automation',
    subcategory: 'AI Coding Assistants',
    description: 'Advanced AI assistant for coding, analysis, and product work',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    category: 'ai-automation',
    subcategory: 'AI Coding Assistants',
    description: 'GPT-based code generation and completion',
  },
  {
    id: 'ai-agent-development',
    name: 'AI Agent Development',
    category: 'ai-automation',
    subcategory: 'Agent Building',
    description: 'Building custom AI agents with instructions and specialized skills',
  },
  {
    id: 'mcp-protocol',
    name: 'Model Context Protocol (MCP)',
    category: 'ai-automation',
    subcategory: 'AI Integration',
    description: 'MCP usage in VSCode and Claude for enhanced AI capabilities',
  },
  {
    id: 'openspec',
    name: 'OpenSpec',
    category: 'ai-automation',
    subcategory: 'Specification Tools',
    description: 'Spec-driven development with AI-powered context building and validation',
  },
  {
    id: 'playwright-mcp',
    name: 'Playwright MCP',
    category: 'ai-automation',
    subcategory: 'Browser Automation',
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
    description: 'Client demos, sales presentations, product training, and conference speaking',
  },
  {
    id: 'stakeholder-management',
    name: 'Stakeholder Management',
    category: 'professional-skills',
    subcategory: 'Leadership',
    description:
      'Alignment with strategic and executive teams, client relationship management, and cross-organizational coordination',
  },
  {
    id: 'regulatory-engagement',
    name: 'Regulatory Engagement',
    category: 'professional-skills',
    subcategory: 'Policy & Compliance',
    description:
      'Represented PG&E at regulatory workshops, external stakeholder events, and policy development forums',
  },
  {
    id: 'cross-functional-collaboration',
    name: 'Cross-Functional Collaboration',
    category: 'professional-skills',
    subcategory: 'Teamwork',
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
  return Array.from(new Set(skills.map((s) => s.subcategory)));
}
