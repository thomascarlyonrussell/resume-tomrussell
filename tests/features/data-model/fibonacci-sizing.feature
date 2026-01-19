Feature: Fibonacci Sizing
  As a developer
  I want skills sized using Fibonacci calculation
  So that the visualization accurately represents proficiency and experience

  Scenario: High proficiency active skill
    Given a skill with proficiency 8 and 10 years of experience (current)
    When rendered in Fibonacci view
    Then calculated size is large (mapped to 89 in Fibonacci sequence)
    And it appears much larger than lower proficiency skills

  Scenario: Degraded inactive skill
    Given a skill with proficiency 5, 3 years experience, ended 6 years ago
    When rendered in Fibonacci view
    Then calculated size accounts for degradation factor
    And appears smaller due to time since last use
