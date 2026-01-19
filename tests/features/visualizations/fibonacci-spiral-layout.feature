Feature: Fibonacci Spiral Layout
  As a visitor
  I want to see skills arranged in a Fibonacci spiral
  So that I can understand Tom's skill proficiency at a glance

  Scenario: Skill sizing with experience
    Given an active skill with proficiency 8 and 10 years experience
    When displayed in the spiral
    Then calculated size is mapped to Fibonacci sequence
    And appears much larger than a proficiency 3 skill with 2 years

  Scenario: Degraded skill sizing
    Given an inactive skill ended 6 years ago with proficiency 5 and 3 years experience
    When displayed in the spiral
    Then calculated size accounts for time degradation
    And appears smaller due to time degradation

  Scenario: Category coloring
    Given skills from different categories
    When displayed in the spiral
    Then each category has a distinct consistent color
