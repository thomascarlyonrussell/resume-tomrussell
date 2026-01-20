Feature: Skill Item Structure
  As a developer
  I want skill data to have a consistent structure
  So that visualizations and chatbot can use it reliably

  Background:
    Given the new data model where skills are reference data only
    And proficiency and timeline information is derived from experiences

  Scenario: Complete skill entry
    Given a skill "Python"
    When it is added to the data
    Then it includes only id, name, category, subcategory, and optional description
    And it does NOT include proficiency, startDate, or endDate

  Scenario: Skill timeline derivation
    Given a skill "Python" referenced by multiple experiences
    When computing the skill's timeline
    Then the timeline is derived from the date ranges of all experiences that reference it

  Scenario: Skill proficiency derivation
    Given a skill "Python" referenced by multiple experiences with different proficiencies
    When determining the skill's current proficiency
    Then the proficiency is a weighted average across all experiences, weighted by duration
    And a degradation factor is applied based on time since last use
