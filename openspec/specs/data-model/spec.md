# Data Model Specification

## Purpose

Define the data structures for skills, experience, and career information that power both visualizations and the AI chatbot knowledge base.

## Overview

A unified data model serves multiple purposes:
1. **Fibonacci Visualization** - Skills sized by intensity/proficiency
2. **Timeline Visualization** - Skills/categories building over time
3. **Chatbot Knowledge** - Structured information for AI responses

The same underlying data powers all three, ensuring consistency.

---
## Requirements
### Requirement: Skill Item Structure

Each skill item SHALL contain the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `name` | string | Yes | Display name |
| `category` | string | Yes | Primary category |
| `subcategory` | string | Yes | Secondary grouping |
| `proficiency` | number | Yes | Intensity/depth of knowledge (Fibonacci: 1, 2, 3, 5, or 8) |
| `startDate` | string | Yes | When skill acquisition began (YYYY-MM format) |
| `endDate` | string | No | When stopped using (null if current) |
| `description` | string | No | Brief description for chatbot/tooltips |
| `milestones` | Milestone[] | No | Key achievements related to this skill |

#### Scenario: Complete skill entry
- **GIVEN** a skill "Python"
- **WHEN** it is added to the data
- **THEN** it includes id, name, category, subcategory, proficiency, and startDate at minimum

#### Scenario: Active vs inactive skills
- **GIVEN** a skill the user no longer actively uses
- **WHEN** endDate is populated
- **THEN** visualizations can distinguish current from past skills

---

### Requirement: Milestone Structure

Milestones SHALL capture key achievements or project deliverables.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `title` | string | Yes | Milestone name |
| `date` | string | Yes | When achieved (YYYY-MM format) |
| `description` | string | No | Brief description |
| `skillIds` | string[] | No | Related skill IDs |

#### Scenario: Project milestone
- **GIVEN** a major project delivery "LoadSEER Next Launch"
- **WHEN** added as a milestone
- **THEN** it can be displayed on the timeline
- **AND** linked to relevant skills

---

### Requirement: Category Taxonomy

Categories SHALL be predefined to ensure consistency.

Primary categories SHALL include:
- `engineering` - Power systems, electrical engineering, distribution planning
- `software-development` - Programming, architecture, tooling
- `ai-automation` - AI/ML, LLMs, automation, agents
- `product-management` - Roadmaps, requirements, stakeholder management
- `data-analytics` - Data analysis, forecasting, visualization
- `professional-skills` - Public speaking, stakeholder engagement, regulatory collaboration
- `content-creation` - Tutorials, documentation, narration

Each category SHALL have a display name, color, and icon identifier.

#### Scenario: Category assignment
- **GIVEN** a skill "Python"
- **WHEN** assigning a category
- **THEN** it uses one of the predefined category IDs

---

### Requirement: Experience Role Structure

Work experience SHALL be stored separately but linkable to skills.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `company` | string | Yes | Company/organization name |
| `title` | string | Yes | Job title |
| `startDate` | string | Yes | Start date (YYYY-MM format) |
| `endDate` | string | No | End date (null if current) |
| `description` | string | Yes | Role description |
| `highlights` | string[] | No | Key achievements |
| `skillIds` | string[] | No | Skills used in this role |

#### Scenario: Current role
- **GIVEN** Tom's current position
- **WHEN** endDate is null
- **THEN** it displays as "Present" on timeline

---

### Requirement: Computed Properties

The data model SHALL support computed/derived values:

- `timeInvested` - Duration from startDate to endDate (or now)
- `isActive` - Boolean based on endDate being null
- `categorySkills` - Skills grouped by category
- `timelineData` - Skills formatted for stacked area chart

#### Scenario: Time calculation
- **GIVEN** a skill started "2020-01"
- **WHEN** computing timeInvested in 2025
- **THEN** it returns approximately 5 years

---

### Requirement: Fibonacci Sizing

For the Fibonacci visualization, skills SHALL be sized based on a calculated value from the Fibonacci sequence [1, 2, 3, 5, 8, 13, 21, 34, 55, 89].

The sizing algorithm SHALL calculate display size as:
```
size = proficiency × weighted_years × degradation_factor
```

Where:
- `proficiency` = Base Fibonacci value (1, 2, 3, 5, or 8)
- `weighted_years` = `(years_of_experience) × (proficiency / 8)`
- `years_of_experience` = Time from startDate to endDate (or present)
- `degradation_factor` = 1.0 if current OR <2 years since endDate, 0.5 if 2-5 years since endDate, 0.25 if >5 years since endDate

The algorithm SHALL:
- Group skills by category for color coding
- Position skills along a spiral based on category and calculated size
- Map the calculated size to the nearest Fibonacci value in [1, 2, 3, 5, 8, 13, 21, 34, 55, 89] for final display

#### Scenario: High proficiency active skill
- **GIVEN** a skill with proficiency 8 and 10 years of experience (current)
- **WHEN** rendered in Fibonacci view
- **THEN** calculated size = 8 × (10 × 1.0) × 1.0 = 80, mapped to 89
- **AND** it appears much larger than a skill with proficiency 3 and 2 years

#### Scenario: Degraded inactive skill
- **GIVEN** a skill with proficiency 5, 3 years of experience, ended 6 years ago
- **WHEN** rendered in Fibonacci view
- **THEN** calculated size = 5 × (3 × 0.625) × 0.25 ≈ 2.34, mapped to 3
- **AND** it appears smaller due to degradation

---

### Requirement: Timeline Aggregation

For the Timeline visualization, data SHALL aggregate by category over time.

The aggregation SHALL:
- Sum active skills per category at each time point
- Create stacked values for area chart
- Support hover to show specific skills at a point in time

#### Scenario: Category growth over time
- **GIVEN** multiple skills in "software-development" category
- **WHEN** viewed on timeline from 2015-2025
- **THEN** the area shows growth as skills were added over time

---

### Requirement: Chatbot Knowledge Format

Data SHALL be exportable to a format suitable for LLM system prompts.

The export SHALL include:
- Summary of all skills by category
- Work experience narrative
- Key milestones and achievements
- Structured facts about proficiency levels
- Publications and research contributions
- Education and certifications

#### Scenario: Chatbot query about skills
- **GIVEN** the chatbot receives "What languages does Tom know?"
- **WHEN** it queries the knowledge base
- **THEN** it can find all skills in the programming subcategory

#### Scenario: Chatbot query about publications
- **GIVEN** the chatbot receives "What has Tom published?"
- **WHEN** it queries the knowledge base
- **THEN** it can list all publications with titles and descriptions

#### Scenario: Chatbot query about education
- **GIVEN** the chatbot receives "Where did Tom go to school?"
- **WHEN** it queries the knowledge base
- **THEN** it can provide education details including degree, institution, and graduation date

### Requirement: Publication Structure

Publications SHALL capture research papers, technical reports, regulatory filings, and articles.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `title` | string | Yes | Publication title |
| `type` | string | Yes | Publication type (e.g., "Research Paper", "Technical Report") |
| `date` | string | No | Publication date (YYYY-MM format) |
| `description` | string | No | Brief description or abstract |
| `url` | string | No | Link to publication (if publicly available) |

#### Scenario: Publication with full details
- **GIVEN** a research paper "Electric Vehicle Impact on Distribution Grid"
- **WHEN** it is added to the data
- **THEN** it includes id, title, type, and optional date, description, and url

#### Scenario: Regulatory filing publication
- **GIVEN** a regulatory filing "PG&E Electric Distribution Resource Plan"
- **WHEN** it is added to the publications data
- **THEN** it can be displayed on the About section or timeline
- **AND** referenced in the chatbot knowledge base

#### Scenario: Undated publication
- **GIVEN** a publication without a specific publication date
- **WHEN** the date field is null
- **THEN** the publication can still be displayed without temporal placement

---

### Requirement: Education Structure

Education SHALL capture formal degrees, certifications, and professional training.

The data model SHALL support two distinct structures:

**Degree/Formal Education:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `institution` | string | Yes | School/university name |
| `degree` | string | Yes | Degree type (e.g., "Bachelor of Science") |
| `field` | string | Yes | Field of study |
| `focus` | string | No | Specialization or concentration |
| `startDate` | string | Yes | Start date (YYYY-MM format) |
| `endDate` | string | No | Graduation date (YYYY-MM format, null if in progress) |
| `location` | string | No | Geographic location |

**Certifications:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `name` | string | Yes | Certification name |
| `issuer` | string | Yes | Issuing organization |
| `date` | string | Yes | Date obtained (YYYY-MM format) |
| `description` | string | No | Brief description of certification content |
| `url` | string | No | Link to credential or certificate |
| `expirationDate` | string | No | Expiration date if applicable (YYYY-MM format) |

#### Scenario: Bachelor's degree
- **GIVEN** a degree "BS Electrical Engineering" from Penn State
- **WHEN** it is added to the education data
- **THEN** it includes institution, degree, field, and date range
- **AND** can be displayed in the About section

#### Scenario: Professional certification
- **GIVEN** a certification "Database Clinic: Neo4J" from LinkedIn Learning
- **WHEN** it is added to the certifications data
- **THEN** it includes name, issuer, and date obtained
- **AND** can be referenced in skills context

#### Scenario: Current education
- **GIVEN** a degree or certification in progress
- **WHEN** endDate or expirationDate is null
- **THEN** it displays as "In Progress" or "No Expiration"

---

## Type Definitions (TypeScript)

```typescript
interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  proficiency: number; // Fibonacci: 1, 2, 3, 5, or 8
  startDate: string;   // YYYY-MM
  endDate?: string;    // YYYY-MM or undefined if current
  description?: string;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  date: string;        // YYYY-MM
  description?: string;
  skillIds?: string[];
}

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;   // YYYY-MM
  endDate?: string;    // YYYY-MM or undefined if current
  description: string;
  highlights?: string[];
  skillIds?: string[];
}

interface Category {
  id: CategoryId;
  name: string;
  color: string;       // Hex color for visualizations
  icon: string;        // Icon identifier
}

type CategoryId =
  | 'engineering'
  | 'software-development'
  | 'ai-automation'
  | 'product-management'
  | 'data-analytics'
  | 'professional-skills'
  | 'content-creation';

interface Publication {
  id: string;
  title: string;
  type: string;        // "Research Paper", "Technical Report", etc.
  date?: string;       // YYYY-MM or undefined if unknown
  description?: string;
  url?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  focus?: string;
  startDate: string;   // YYYY-MM
  endDate?: string;    // YYYY-MM or undefined if in progress
  location?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;        // YYYY-MM
  description?: string;
  url?: string;
  expirationDate?: string; // YYYY-MM or undefined if no expiration
}
```

---

## Data File Organization

```
src/data/
├── categories.ts      # Category definitions with colors/icons
├── skills.ts          # All skill entries
├── experience.ts      # Work history
├── milestones.ts      # Standalone milestones (or embedded in skills)
├── publications.ts    # Publications and research contributions
├── education.ts       # Education and certifications
├── index.ts           # Unified export and computed helpers
└── chatbot-knowledge.ts # Formatted for LLM system prompt
```
