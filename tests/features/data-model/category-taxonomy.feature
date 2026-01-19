Feature: Category Taxonomy
  As a developer
  I want predefined skill categories
  So that visualization colors and grouping are consistent

  Scenario: Category assignment
    Given a skill "Python"
    When assigning a category
    Then it uses one of the predefined category IDs
    And has a consistent color for visualization
