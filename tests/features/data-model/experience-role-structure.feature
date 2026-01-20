Feature: Experience Role Structure
  As a developer
  I want work experience to be structured
  So that it can be linked to skills and displayed properly

  Background:
    Given work experience defines which skills were used and at what proficiency level

  Scenario: Experience with skill proficiencies
    Given an experience "Product Manager, VP at Integral Analytics"
    When defining skills used in this role
    Then each skill includes both the skill ID and the proficiency level achieved
    And the proficiency reflects the level attained during that specific role

  Scenario: Overlapping skill proficiencies
    Given two experiences that both used "Python"
    When the first experience had proficiency 3 and the second had proficiency 5
    Then the timeline shows skill growth from proficiency 3 to 5
    And the current proficiency is 5 (most recent)

  Scenario: Current role with active skills
    Given Tom's current position with endDate null
    When computing active skills
    Then all skills in that experience are considered active
    And their timelines extend to the present

  Scenario: Current role display
    Given Tom's current position
    When endDate is null
    Then it displays as "Present" on timeline
