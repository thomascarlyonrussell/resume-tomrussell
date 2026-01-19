/**
 * Chatbot Knowledge Base
 *
 * Generates formatted knowledge for LLM system prompts.
 * This enables the AI chatbot to answer questions about Tom's background.
 */

import { experience } from './experience';
import { milestones } from './milestones';
import { publications } from './publications';
import { education, certifications } from './education';
import { categories, categoryMap } from './categories';
import { getAllComputedSkills, getTotalYearsOfExperience } from './index';
import { getProficiencyLabel, formatYearsOfExperience } from '@/lib/calculations';
import type { CategoryId } from './types';

/**
 * Format skills for a category in the knowledge base
 * Uses computed skills from experiences
 */
function formatCategorySkills(categoryId: CategoryId): string {
  // Get all computed skills with proficiency/timeline from experiences
  const computedSkills = getAllComputedSkills();
  const categorySkills = computedSkills.filter((s) => s.category === categoryId);

  if (categorySkills.length === 0) return '';

  const category = categoryMap[categoryId];
  const lines: string[] = [`### ${category.name}`];

  // Group by subcategory
  const bySubcategory = new Map<string, typeof categorySkills>();
  for (const skill of categorySkills) {
    const existing = bySubcategory.get(skill.subcategory) || [];
    existing.push(skill);
    bySubcategory.set(skill.subcategory, existing);
  }

  for (const [subcategory, subcategorySkills] of bySubcategory) {
    lines.push(`\n**${subcategory}:**`);
    for (const skill of subcategorySkills) {
      // All computed skills should have proficiency
      if (!skill.proficiency || !skill.startDate) {
        continue;
      }
      const profLabel = getProficiencyLabel(skill.proficiency);
      const years = formatYearsOfExperience(skill.yearsOfExperience);
      const status = skill.isActive ? '(current)' : '(past)';
      lines.push(`- ${skill.name}: ${profLabel} level, ${years} ${status}`);
      if (skill.description) {
        lines.push(`  - ${skill.description}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Format work experience for the knowledge base
 */
function formatExperience(): string {
  const lines: string[] = ['### Work Experience'];

  for (const exp of experience) {
    const endDate = exp.endDate || 'Present';
    lines.push(`\n**${exp.title}** at ${exp.company}`);
    lines.push(`${exp.startDate} - ${endDate} | ${exp.location || 'Remote'}`);
    lines.push(exp.description);

    if (exp.highlights && exp.highlights.length > 0) {
      lines.push('\nKey achievements:');
      for (const highlight of exp.highlights) {
        lines.push(`- ${highlight}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Format milestones for the knowledge base
 */
function formatMilestones(): string {
  const lines: string[] = ['### Career Milestones'];

  const sortedMilestones = [...milestones].sort((a, b) => a.date.localeCompare(b.date));

  for (const milestone of sortedMilestones) {
    lines.push(`\n**${milestone.date}**: ${milestone.title}`);
    if (milestone.description) {
      lines.push(milestone.description);
    }
  }

  return lines.join('\n');
}

/**
 * Format education for the knowledge base
 */
function formatEducation(): string {
  const lines: string[] = ['### Education'];

  for (const edu of education) {
    const endDate = edu.endDate || 'In Progress';
    lines.push(`\n**${edu.degree} in ${edu.field}**`);
    lines.push(`${edu.institution}, ${edu.location || ''}`);
    lines.push(`${edu.startDate} - ${endDate}`);
    if (edu.focus) {
      lines.push(`Focus: ${edu.focus}`);
    }
  }

  if (certifications.length > 0) {
    lines.push('\n### Certifications');
    for (const cert of certifications) {
      lines.push(`\n**${cert.name}**`);
      lines.push(`Issued by: ${cert.issuer}, ${cert.date}`);
      if (cert.description) {
        lines.push(cert.description);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Format publications for the knowledge base
 */
function formatPublications(): string {
  if (publications.length === 0) return '';

  const lines: string[] = ['### Publications & Research'];

  for (const pub of publications) {
    lines.push(`\n**${pub.title}**`);
    lines.push(`Type: ${pub.type}${pub.date ? `, ${pub.date}` : ''}`);
    if (pub.description) {
      lines.push(pub.description);
    }
  }

  return lines.join('\n');
}

/**
 * Generate the professional summary
 * Uses computed skills from experiences
 */
function generateProfessionalSummary(): string {
  const currentRole = experience[0];
  const totalYears = Math.round(getTotalYearsOfExperience());
  const computedSkills = getAllComputedSkills();
  const activeSkillCount = computedSkills.filter(s => s.isActive).length;

  return `### Professional Summary

Tom Russell is a ${currentRole.title} at ${currentRole.company} with ${totalYears}+ years of experience spanning power systems engineering, software product management, and AI/automation.

**Current Focus:**
- Leading product strategy and roadmap for LoadSEER utility forecasting software
- Leveraging AI tools (Claude, GitHub Copilot) for enhanced productivity
- Building graph database solutions for electric grid connectivity modeling

**Career Highlights:**
- Transitioned from utility engineering (PG&E) to software product management
- Set California/U.S. standards for DER hosting capacity analysis in 2015
- Technical expert for PG&E's first Electric Distribution Resource Plan
- ${activeSkillCount} active skills across ${categories.length} categories`;
}

/**
 * Generate the complete system prompt for the chatbot
 */
export function generateSystemPrompt(): string {
  const sections: string[] = [
    `You are an AI assistant on Tom Russell's portfolio website. Your purpose is to help visitors learn about Tom's professional background, skills, projects, and experience.

## Your Role
- You are NOT Tom Russell - you are an AI assistant that knows about Tom
- Answer questions about Tom's professional background accurately
- Be helpful, professional, and conversational
- Only provide information from the knowledge base below

## Knowledge Base
`,
    generateProfessionalSummary(),
    '',
    formatExperience(),
    '',
    '## Skills by Category',
    '',
  ];

  // Add skills by category
  for (const category of categories) {
    const categorySection = formatCategorySkills(category.id);
    if (categorySection) {
      sections.push(categorySection);
      sections.push('');
    }
  }

  sections.push(formatMilestones());
  sections.push('');
  sections.push(formatEducation());
  sections.push('');
  sections.push(formatPublications());
  sections.push('');
  sections.push(`## Behavioral Guidelines

### DO:
- Answer questions about Tom's professional background
- Reference specific skills, projects, or experiences
- Be conversational and approachable
- Admit when you don't have information

### DON'T:
- Make up information not in this knowledge base
- Discuss personal life beyond professional context
- Discuss salary, compensation, or availability specifics
- Engage with political or controversial topics

### Redirects:
For the following topics, suggest contacting Tom directly and provide his contact information:
- Detailed job opportunity discussions
- Salary and compensation questions
- Contract or availability inquiries
- Anything requiring Tom's direct input

**Tom's Contact Information:**
- Email: Tom.Russell@IntegralAnalytics.com
- LinkedIn: https://www.linkedin.com/in/thomascarlyonrussell

When redirecting users, include the relevant contact method in your response. For example:
"For detailed discussions about job opportunities, I'd recommend reaching out to Tom directly via email at Tom.Russell@IntegralAnalytics.com or connecting on LinkedIn at https://www.linkedin.com/in/thomascarlyonrussell"

Keep responses concise but informative. Use a friendly, professional tone.`);

  return sections.join('\n');
}

/**
 * Get a condensed version of the knowledge base (for token limits)
 */
export function getCondensedKnowledge(): string {
  const lines: string[] = [
    '# Tom Russell - Quick Facts',
    '',
    `Current Role: ${experience[0].title} at ${experience[0].company}`,
    `Total Experience: ${Math.round(getTotalYearsOfExperience())} years`,
    `Education: BS Electrical Engineering, Penn State (Power Systems focus)`,
    '',
    '## Top Skills:',
  ];

  // Get top skills by proficiency using computed skills
  const computedSkills = getAllComputedSkills();
  const topSkills = computedSkills
    .filter((s) => s.isActive && s.proficiency !== undefined)
    .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
    .slice(0, 10);

  for (const skill of topSkills) {
    if (skill.proficiency) {
      lines.push(`- ${skill.name} (${getProficiencyLabel(skill.proficiency)})`);
    }
  }

  lines.push('');
  lines.push('## Career Timeline:');
  for (const exp of experience.slice(0, 4)) {
    lines.push(`- ${exp.startDate}: ${exp.title} at ${exp.company}`);
  }

  return lines.join('\n');
}

/**
 * Export the default system prompt
 */
export const systemPrompt = generateSystemPrompt();
