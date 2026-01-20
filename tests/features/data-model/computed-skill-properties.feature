Feature: Computed Skill Properties
  As a developer
  I want skills to derive their properties from experiences
  So that the data model stays consistent and maintainable

  Background:
    Given the data model where skills are reference data only
    And all timeline and proficiency data is computed from experiences

  Scenario: Skill timeline computation
    Given a skill "Python" used in 3 experiences spanning 2015-2025
    When computing the skill's timeline
    Then startDate is 2015-01
    And endDate is null (current)
    And isActive is true

  Scenario: Skill proficiency computation with weighted average
    Given a skill "SQL" used in experience A (2014-2018, 48 months, proficiency 3) and experience B (2018-present, 84 months, proficiency 5)
    When computing current proficiency
    Then proficiency = ((3 × 48) + (5 × 84)) / (48 + 84) × 1.0 = 4.27
    And degradation_factor is 1.0 (currently active)

  Scenario: Skill proficiency with inactive degradation
    Given a skill "Cymdist" used in experience A (2014-2020, 72 months, proficiency 5)
    And not used since 2020 (>5 years ago as of 2025)
    When computing current proficiency
    Then base_proficiency = 5
    And degradation_factor is 0.25 (>5 years inactive)
    And effective_proficiency = 5 × 0.25 = 1.25

  Scenario: Skill proficiency growth over three experiences
    Given a skill "Python" used in:
      | Experience | Start    | End      | Duration | Proficiency |
      | A          | 2015-01  | 2017-01  | 24       | 3           |
      | B          | 2017-01  | 2020-01  | 36       | 5           |
      | C          | 2020-01  | present  | 60       | 8           |
    When computing current proficiency
    Then weighted_proficiency = ((3 × 24) + (5 × 36) + (8 × 60)) / (24 + 36 + 60) = 6.1
    And degradation_factor is 1.0 (currently active)
    And effective_proficiency = 6.1
    And this reflects skill growth from beginner (3) to expert (8) over 10 years

  Scenario: Skill with no experiences
    Given a skill that is defined but not referenced by any experience
    When computing timeline properties
    Then startDate and endDate are undefined
    And isActive is false
    And proficiency is undefined
