# Resources Folder - Portfolio Data

This folder contains structured data extracted from Tom Russell's LinkedIn profile and formatted for use in the portfolio website.

## Data Files

### Core Data (Matches OpenSpec data-model spec)

- **[skills.json](skills.json)** - **35 skills** across 7 categories with Fibonacci proficiency ratings (1,2,3,5,8) ✨ **UPDATED**
- **[experience.json](experience.json)** - 8 work positions spanning 2009-present
- **[milestones.json](milestones.json)** - 11 key career moments and achievements
- **[categories.json](categories.json)** - 7 skill categories with colors and icons for visualizations ✨ **UPDATED**
- **[publications.json](publications.json)** - 2 publications (research papers and technical reports) ✨ **NEW**
- **[education.json](education.json)** - Educational background (Penn State BS) and certifications (Neo4j) ✨ **NEW**

### Supplementary Data (Beyond spec)

- **[professional-summary.json](professional-summary.json)** - Bio, tagline, work philosophy
- **[chatbot-knowledge-base.md](chatbot-knowledge-base.md)** - Formatted knowledge for AI chatbot system prompt

### Source Data

- **[profile.md](profile.md)** - Original LinkedIn profile export (raw text)

---

## Data Summary

### Career Timeline

| Period | Company | Role |
|--------|---------|------|
| 2009-2011 | PPL Electric | Co-op/Summer Engineer roles |
| 2011-2012 | PPL Electric | Engineer, Distribution Standards |
| 2012-2014 | PG&E | Engineer, Distributed Generation Interconnection |
| 2014-2018 | PG&E | Senior Engineer, Distributed Resource Planning |
| 2018-2019 | PG&E | Expert Engineer, Grid Innovation |
| 2019-2020 | Integral Analytics | Product Manager |
| 2020-Present | Integral Analytics | Product Manager, VP |

**Career Arc:** Engineering → Product Management (2019 transition)

---

### Skills by Category (35 total)

#### Engineering (6 skills) ✨ **NEW**
- **Distribution Planning** (8/8) - Core domain expertise, integrated planning and DER integration
- **Hosting Capacity Analysis** (8/8) - Set CA/US standards in 2015
- **Power Systems Analysis** (8/8) - Foundation skill, load flow and interconnection studies
- Cymdist (5/8) - Power distribution modeling
- Protection and Control (5/8) - Substation relay settings (ended 2019)
- SCADA (3/8) - Early career automation (ended 2012)

#### Software Development (7 skills)
- Python (8/8) - Primary language since 2015
- C# (5/8) - LoadSEER development
- SQL (5/8) - Data analytics and backend
- PowerShell (3/8) - Automation scripting
- Azure Pipelines (5/8) - CI/CD
- GitHub (5/8) - Source control
- Microsoft Access (3/8) - Early career desktop apps

#### Data & Analytics (4 skills)
- LoadSEER (8/8) - Subject matter expert for utility load forecasting software
- Neo4j (5/8) - Graph databases for connectivity models
- SQL (5/8) - Database queries and data analysis
- Cypher (5/8) - Graph query language

#### Product Management (5 skills)
- Product Management (8/8) - Current primary role
- Requirements Gathering (8/8) - Client insights
- Productboard (8/8) - Strategic roadmapping
- JIRA (5/8) - Sprint management
- Technical Leadership (5/8) - Mentoring and collaboration
- Azure DevOps (5/8) - Work item tracking and boards

#### Professional Skills (4 skills) ✨ **NEW**
- Stakeholder Management (8/8) - Executive alignment and client relationships
- Cross-Functional Collaboration (8/8) - Facilitating teams across business lines
- Public Speaking & Presentations (5/8) - Client demos and conference speaking
- Regulatory Engagement (5/8) - PG&E regulatory workshops (ended 2019)

#### Content Creation (1 skill)
- Technical Training (5/8) - User training and demos

#### AI & Automation (8 skills) ✨ **NEW**
- **Claude (Anthropic)** (8/8) - Advanced AI assistant for coding, analysis, and product work
- **Model Context Protocol (MCP)** (5/8) - MCP usage in VSCode and Claude
- **GitHub Copilot** (5/8) - AI-powered code completion and generation
- **OpenSpec** (5/8) - Spec-driven development with AI-powered context building
- **v0 by Vercel** (5/8) - Quick UI prototyping with AI-generated components
- **AI Agent Development** (5/8) - Building custom AI agents with instructions
- **OpenAI Codex** (5/8) - GPT-based code generation
- **Playwright MCP** (3/8) - Browser automation via MCP

---

### Key Milestones

**Major Achievements:**
1. **2015** - Set California/U.S. standards for hosting capacity analysis
2. **2016** - Led PG&E's first Electric Distribution Resource Plan
3. **2019** - Career pivot: Engineering → Product Management

**Certifications:**
- Database Clinic: Neo4J (2019)

**Publications:**
- Electric Vehicle Impact on Distribution Grid (research paper)
- PG&E Electric Distribution Resource Plan (regulatory filing)

---

## ✅ Spec Update Complete

Publications and Education have been added to the data-model spec (archived as `2026-01-18-add-publications-education`).

The data-model spec now includes:
- **Publication interface** - For research papers, technical reports, regulatory filings
- **Education interface** - For degrees with date ranges
- **Certification interface** - For professional certifications and training
- **Updated chatbot knowledge format** - Includes publications and education

All data files in this folder now match the formal OpenSpec specification.

---

## Data Quality Notes

### Complete ✅
- All work experience documented with dates, descriptions, highlights
- Skills mapped to proficiency levels and time ranges
- Milestones linked to relevant skills
- Professional summary and bio extracted

### Missing Information ⚠️
- **Exact dates:** Some milestones have approximate dates (e.g., publications)
- **AI/Automation skills:** User indicated this is current focus but not detailed in LinkedIn
- **GitHub profile URL:** Mentioned in project.md but not in LinkedIn export
- **Portfolio/personal website:** Not listed

### Assumptions Made 📝
- Proficiency ratings assigned based on experience duration, role level, and emphasis in profile
- Milestone dates inferred from role timelines when not explicitly stated
- Skill categories aligned with user's preliminary list from project discussion
- "Self-taught computer science" expertise reflected in high Python/development proficiency

---

## Next Steps

1. ✅ **Spec updates complete** - Publications and education added to data-model spec
2. ✅ **AI/Automation skills added** - 8 skills added to the category
3. ✅ **New categories added** - Engineering and Professional Skills categories added
4. ✅ **Professional skills added** - 4 soft skills added (stakeholder management, public speaking, etc.)
5. **Review data accuracy** - Verify proficiency ratings, dates, and descriptions
6. **Begin implementation** - Ready to start building the portfolio with this data

---

## File Formats

- **JSON files** - Structured data matching TypeScript interfaces from data-model spec
- **Markdown files** - Human-readable formats (knowledge base, this README)
- All dates use `YYYY-MM` format as specified
- All IDs use kebab-case as specified
