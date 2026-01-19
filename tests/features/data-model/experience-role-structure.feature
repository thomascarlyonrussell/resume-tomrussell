Feature: Experience Role Structure
  As a developer
  I want work experience to be structured
  So that it can be linked to skills and displayed properly

  Scenario: Current role
    Given Tom's current position
    When endDate is null
    Then it displays as "Present" on timeline
