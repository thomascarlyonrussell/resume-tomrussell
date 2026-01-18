# OpenSpec Instructions

Instructions for AI coding assistants using OpenSpec for spec-driven development.

## Quick Start

For this portfolio project, you'll typically **edit specs directly** rather than creating formal proposals. Use proposals only for major architectural changes.

**Common workflow:**
1. Read the spec: `openspec show <spec-name> --type spec`
2. Update [openspec/specs/<capability>/spec.md](openspec/specs) directly
3. Validate: `openspec validate <spec-name> --strict --no-interactive`

**When to create a formal proposal:**
- Major architectural changes affecting multiple specs
- Breaking changes to data models
- New capabilities that need approval before implementation

## Directory Structure

```
openspec/
├── project.md              # Project conventions and context
├── specs/                  # Current truth - what IS built
│   └── [capability]/
│       └── spec.md         # Requirements with scenarios
└── changes/                # Proposals (rarely used for this project)
    ├── [change-id]/
    │   ├── proposal.md     # Why and what
    │   ├── tasks.md        # Implementation checklist
    │   └── specs/          # Delta changes
    │       └── [capability]/
    │           └── spec.md # ADDED/MODIFIED/REMOVED
    └── archive/            # Completed changes
```

## Spec Format

### Requirements Structure

```markdown
### Requirement: Feature Name

The system SHALL do something specific.

Properties/rules as needed.

#### Scenario: Success case
- **GIVEN** initial state
- **WHEN** action occurs
- **THEN** expected result
```

**Critical formatting:**
- Use `#### Scenario:` (exactly 4 hashtags)
- Every requirement MUST have at least one scenario
- Use SHALL/MUST for normative requirements

### Finding Things

```bash
# List all specs
openspec list --specs

# Show spec details
openspec show <spec-name> --type spec

# Validate spec
openspec validate <spec-name> --strict --no-interactive

# Full-text search in specs
rg -n "Requirement:|Scenario:" openspec/specs
```

## Creating Proposals (Rare)

Only needed for major changes. For most updates, edit specs directly.

### 1. Scaffold Structure

```bash
CHANGE=add-new-feature
mkdir -p openspec/changes/$CHANGE/specs/<capability>
```

Create these files:
- `proposal.md` - Why, what, impact
- `tasks.md` - Implementation checklist
- `specs/<capability>/spec.md` - Delta changes

### 2. Write proposal.md

```markdown
# Change: Brief description

## Why
Problem/opportunity in 1-2 sentences

## What Changes
- Bullet list of changes
- Mark breaking changes with **BREAKING**

## Impact
- Affected specs: [list]
- Affected code: [key files]
```

### 3. Write Spec Deltas

Use operation headers to indicate changes:

```markdown
## ADDED Requirements
### Requirement: New Feature
The system SHALL...

#### Scenario: Success case
- **WHEN** condition
- **THEN** result

## MODIFIED Requirements
### Requirement: Existing Feature
[Complete updated requirement with all scenarios]

## REMOVED Requirements
### Requirement: Old Feature
**Reason**: Why removing
```

**Important for MODIFIED:**
1. Find the existing requirement in `openspec/specs/<capability>/spec.md`
2. Copy the ENTIRE requirement (header + all scenarios)
3. Paste it under `## MODIFIED Requirements`
4. Edit to reflect new behavior
5. Keep at least one scenario

### 4. Write tasks.md

```markdown
## Implementation
- [ ] Create/update component X
- [ ] Add tests
- [ ] Update documentation
- [ ] Validate changes
```

### 5. Validate

```bash
openspec validate <change-id> --strict --no-interactive
```

Fix any errors before proceeding.

## Common Validation Errors

**"Requirement must have at least one scenario"**
- Use exactly `#### Scenario:` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

**"Change must have at least one delta"**
- Ensure `changes/<id>/specs/` exists with .md files
- Verify files have operation headers (`## ADDED Requirements`, etc.)

## Quick Reference

### Essential Commands

```bash
openspec list --specs          # List all capabilities
openspec show <item>           # View spec or change details
openspec validate <item> --strict --no-interactive  # Validate
openspec archive <change-id> --yes  # Archive completed change
```

### Flags

- `--json` - Machine-readable output
- `--type spec|change` - Disambiguate items
- `--strict` - Comprehensive validation
- `--no-interactive` - Disable prompts
- `--yes` / `-y` - Skip confirmations

### Project Context

Before making changes:
- [ ] Read [openspec/project.md](openspec/project.md) for conventions
- [ ] Check relevant specs in [openspec/specs/](openspec/specs)
- [ ] Run `openspec list --specs` to see existing capabilities

### What Goes Where

- **`specs/`** - Built and deployed (source of truth)
- **`changes/`** - Proposed, not yet built
- **`archive/`** - Historical record of completed changes

---

**Remember:** For this portfolio project, most changes = direct spec edits. Only create formal proposals for major architectural work.
