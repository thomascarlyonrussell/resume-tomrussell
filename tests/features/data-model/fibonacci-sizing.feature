Feature: Fibonacci Sizing
  As a developer
  I want skills sized using Fibonacci calculation with experience-derived data
  So that the visualization accurately represents proficiency and experience

  Background:
    Given skills derive their proficiency and timeline from experiences
    And the sizing algorithm uses: size = proficiency × weighted_years
    And proficiency already includes degradation factor from computation

  Scenario: High proficiency active skill
    Given a skill with proficiency 8 and 10 years of experience (current)
    When rendered in Fibonacci view
    Then calculated size = 8 × (10 × 1.0) × 1.0 = 80, mapped to 89
    And it appears much larger than a skill with proficiency 3 and 2 years

  Scenario: Skill sizing with multiple experiences
    Given a skill "Python" with:
      | Experience | Start   | End     | Duration | Proficiency |
      | A          | 2015-01 | 2019-01 | 48       | 5           |
      | B          | 2019-01 | present | 72       | 8           |
    When computing Fibonacci size
    Then base_proficiency = ((5 × 48) + (8 × 72)) / (48 + 72) = 6.8
    And degradation_factor is 1.0 (currently active)
    And proficiency = 6.8 × 1.0 = 6.8
    And years_of_experience is ~10 (2015 to present)
    And weighted_years = 10 × (6.8 / 8) = 8.5
    And calculated size = 6.8 × 8.5 = 57.8, mapped to Fibonacci 55

  Scenario: Degraded inactive skill
    Given a skill with proficiency 5, 3 years experience, ended 6 years ago
    When rendered in Fibonacci view
    Then calculated size accounts for degradation factor
    And appears smaller due to time since last use

  Scenario: Skill sizing with gap in usage
    Given a skill "Microsoft Access" with experience from 2012-2015 (36 months, proficiency 3)
    And no subsequent usage, ended 2015 (10 years ago as of 2025)
    When computing Fibonacci size in 2025
    Then base_proficiency = 3
    And degradation_factor is 0.25 (>5 years inactive)
    And proficiency = 3 × 0.25 = 0.75
    And years_of_experience is ~3
    And weighted_years = 3 × (0.75 / 8) = 0.28
    And calculated size = 0.75 × 0.28 = 0.21, mapped to Fibonacci 1
    And the size is significantly reduced due to long inactivity
