Feature: Timeline Aggregation
  As a developer
  I want data aggregated by category over time
  So that the timeline visualization can show career progression

  Background:
    Given timeline data aggregates skills by category using experience date ranges
    And skills are counted as active during their associated experience periods

  Scenario: Category growth over time
    Given multiple experiences adding "software-development" skills over time
    When viewed on timeline from 2015-2025
    Then the area shows growth as new skills were added through new experiences
    And skills remain active as long as any experience is active

  Scenario: Skill proficiency evolution
    Given a skill "Python" growing from proficiency 3 to 8 across experiences
    When hovering over timeline at different points
    Then the tooltip shows the proficiency level at that time based on the active experience
    And demonstrates skill progression over career timeline

